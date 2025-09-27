// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract PredictionMarket {
    IERC20 public immutable bdag;

    enum MarketStatus { Active, Resolved, Cancelled }
    enum Outcome { Pending, Yes, No }

    struct Market {
        uint256 id;
        string title;
        string description;
        string category;
        uint256 endTime;
        uint256 resolutionTime;
        MarketStatus status;
        Outcome outcome;
        address creator;
        uint256 totalVolume;
        uint256 yesShares;
        uint256 noShares;
        uint256 creatorFee; // in basis points (100 = 1%)
        mapping(address => UserPosition) positions;
        address[] participants;
    }

    struct UserPosition {
        uint256 yesShares;
        uint256 noShares;
        uint256 totalInvestment;
        bool hasPosition;
    }

    struct MarketInfo {
        uint256 id;
        string title;
        string description;
        string category;
        uint256 endTime;
        uint256 resolutionTime;
        MarketStatus status;
        Outcome outcome;
        address creator;
        uint256 totalVolume;
        uint256 yesShares;
        uint256 noShares;
        uint256 creatorFee;
        uint256 participantCount;
    }

    uint256 public nextMarketId = 1;
    uint256 public platformFee = 200; // 2% in basis points
    address public feeCollector;
    address public owner;

    mapping(uint256 => Market) public markets;
    mapping(address => uint256[]) public userMarkets;

    event MarketCreated(
        uint256 indexed marketId,
        address indexed creator,
        string title,
        uint256 endTime
    );

    event PositionTaken(
        uint256 indexed marketId,
        address indexed user,
        bool isYes,
        uint256 shares,
        uint256 cost,
        uint256 price
    );

    event MarketResolved(
        uint256 indexed marketId,
        Outcome outcome,
        uint256 totalPayout
    );

    event Payout(
        uint256 indexed marketId,
        address indexed user,
        uint256 amount
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier marketExists(uint256 marketId) {
        require(marketId < nextMarketId && marketId > 0, "Market does not exist");
        _;
    }

    modifier marketActive(uint256 marketId) {
        require(markets[marketId].status == MarketStatus.Active, "Market not active");
        require(block.timestamp < markets[marketId].endTime, "Market ended");
        _;
    }

    constructor(address _bdag, address _feeCollector) {
        bdag = IERC20(_bdag);
        feeCollector = _feeCollector;
        owner = msg.sender;
    }

    function createMarket(
        string memory _title,
        string memory _description,
        string memory _category,
        uint256 _endTime,
        uint256 _resolutionTime,
        uint256 _creatorFee
    ) external returns (uint256) {
        require(_endTime > block.timestamp, "End time must be in future");
        require(_resolutionTime > _endTime, "Resolution time must be after end time");
        require(_creatorFee <= 1000, "Creator fee too high"); // Max 10%

        uint256 marketId = nextMarketId++;
        Market storage market = markets[marketId];

        market.id = marketId;
        market.title = _title;
        market.description = _description;
        market.category = _category;
        market.endTime = _endTime;
        market.resolutionTime = _resolutionTime;
        market.status = MarketStatus.Active;
        market.outcome = Outcome.Pending;
        market.creator = msg.sender;
        market.creatorFee = _creatorFee;

        userMarkets[msg.sender].push(marketId);

        emit MarketCreated(marketId, msg.sender, _title, _endTime);

        return marketId;
    }

    function buyShares(
        uint256 marketId,
        bool isYes,
        uint256 amount
    ) external marketExists(marketId) marketActive(marketId) {
        require(amount > 0, "Amount must be greater than 0");

        Market storage market = markets[marketId];

        // Calculate shares based on current odds
        uint256 shares = calculateShares(marketId, isYes, amount);
        require(shares > 0, "Insufficient amount for shares");

        // Transfer tokens from user
        require(bdag.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        // Update market state
        if (isYes) {
            market.yesShares += shares;
        } else {
            market.noShares += shares;
        }
        market.totalVolume += amount;

        // Update user position
        UserPosition storage position = market.positions[msg.sender];
        if (!position.hasPosition) {
            market.participants.push(msg.sender);
            userMarkets[msg.sender].push(marketId);
            position.hasPosition = true;
        }

        if (isYes) {
            position.yesShares += shares;
        } else {
            position.noShares += shares;
        }
        position.totalInvestment += amount;

        uint256 currentPrice = getCurrentPrice(marketId, isYes);

        emit PositionTaken(marketId, msg.sender, isYes, shares, amount, currentPrice);
    }

    function calculateShares(
        uint256 marketId,
        bool isYes,
        uint256 amount
    ) public view marketExists(marketId) returns (uint256) {
        Market storage market = markets[marketId];

        uint256 currentPrice = getCurrentPrice(marketId, isYes);

        // Shares = amount / price (with 18 decimal precision)
        return (amount * 1e18) / currentPrice;
    }

    function getCurrentPrice(
        uint256 marketId,
        bool isYes
    ) public view marketExists(marketId) returns (uint256) {
        Market storage market = markets[marketId];

        uint256 totalShares = market.yesShares + market.noShares;

        if (totalShares == 0) {
            return 0.5e18; // 50% initial price
        }

        uint256 targetShares = isYes ? market.yesShares : market.noShares;

        // Price = targetShares / totalShares (probability)
        // But we add liquidity factor to prevent extreme prices
        uint256 liquidityFactor = 1000e18; // Virtual liquidity
        uint256 adjustedTargetShares = targetShares + (liquidityFactor / 2);
        uint256 adjustedTotalShares = totalShares + liquidityFactor;

        return (adjustedTargetShares * 1e18) / adjustedTotalShares;
    }

    function getPotentialPayout(
        uint256 marketId,
        address user
    ) external view marketExists(marketId) returns (uint256, uint256) {
        Market storage market = markets[marketId];
        UserPosition storage position = market.positions[user];

        if (!position.hasPosition) {
            return (0, 0);
        }

        // Calculate potential payout for each outcome based on proportional pool sharing
        uint256 yesPayout = 0;
        uint256 noPayout = 0;

        if (position.yesShares > 0 && market.yesShares > 0) {
            uint256 grossYesPayout = (market.totalVolume * position.yesShares) / market.yesShares;
            uint256 totalFees = (grossYesPayout * (platformFee + market.creatorFee)) / 10000;
            yesPayout = grossYesPayout - totalFees;
        }

        if (position.noShares > 0 && market.noShares > 0) {
            uint256 grossNoPayout = (market.totalVolume * position.noShares) / market.noShares;
            uint256 totalFees = (grossNoPayout * (platformFee + market.creatorFee)) / 10000;
            noPayout = grossNoPayout - totalFees;
        }

        return (yesPayout, noPayout);
    }

    function resolveMarket(
        uint256 marketId,
        Outcome _outcome
    ) external marketExists(marketId) onlyOwner {
        Market storage market = markets[marketId];
        require(market.status == MarketStatus.Active, "Market not active");
        require(block.timestamp >= market.resolutionTime, "Too early to resolve");
        require(_outcome == Outcome.Yes || _outcome == Outcome.No, "Invalid outcome");

        market.status = MarketStatus.Resolved;
        market.outcome = _outcome;

        emit MarketResolved(marketId, _outcome, market.totalVolume);
    }

    function claimPayout(uint256 marketId) external marketExists(marketId) {
        Market storage market = markets[marketId];
        require(market.status == MarketStatus.Resolved, "Market not resolved");

        UserPosition storage position = market.positions[msg.sender];
        require(position.hasPosition, "No position in market");

        uint256 userWinningShares = 0;
        uint256 totalWinningShares = 0;

        // Determine winning shares and total winning shares
        if (market.outcome == Outcome.Yes) {
            userWinningShares = position.yesShares;
            totalWinningShares = market.yesShares;
            position.yesShares = 0;
        } else if (market.outcome == Outcome.No) {
            userWinningShares = position.noShares;
            totalWinningShares = market.noShares;
            position.noShares = 0;
        }

        require(userWinningShares > 0, "No winning position");
        require(totalWinningShares > 0, "No winning shares exist");

        // Calculate proportional share of the total pool
        uint256 totalPoolAmount = market.totalVolume;
        uint256 grossPayout = (totalPoolAmount * userWinningShares) / totalWinningShares;

        // Calculate fees
        uint256 platformFeeAmount = (grossPayout * platformFee) / 10000;
        uint256 creatorFeeAmount = (grossPayout * market.creatorFee) / 10000;
        uint256 userPayout = grossPayout - platformFeeAmount - creatorFeeAmount;

        // Reset position
        position.hasPosition = false;
        position.totalInvestment = 0;

        // Transfer payouts
        if (userPayout > 0) {
            require(bdag.transfer(msg.sender, userPayout), "User payout failed");
        }
        if (platformFeeAmount > 0) {
            require(bdag.transfer(feeCollector, platformFeeAmount), "Platform fee transfer failed");
        }
        if (creatorFeeAmount > 0) {
            require(bdag.transfer(market.creator, creatorFeeAmount), "Creator fee transfer failed");
        }

        emit Payout(marketId, msg.sender, userPayout);
    }

    function getMarketInfo(uint256 marketId) external view marketExists(marketId) returns (MarketInfo memory) {
        Market storage market = markets[marketId];

        return MarketInfo({
            id: market.id,
            title: market.title,
            description: market.description,
            category: market.category,
            endTime: market.endTime,
            resolutionTime: market.resolutionTime,
            status: market.status,
            outcome: market.outcome,
            creator: market.creator,
            totalVolume: market.totalVolume,
            yesShares: market.yesShares,
            noShares: market.noShares,
            creatorFee: market.creatorFee,
            participantCount: market.participants.length
        });
    }

    function getUserPosition(
        uint256 marketId,
        address user
    ) external view marketExists(marketId) returns (
        uint256 yesShares,
        uint256 noShares,
        uint256 totalInvestment,
        bool hasPosition
    ) {
        UserPosition storage position = markets[marketId].positions[user];
        return (
            position.yesShares,
            position.noShares,
            position.totalInvestment,
            position.hasPosition
        );
    }

    function getUserMarkets(address user) external view returns (uint256[] memory) {
        return userMarkets[user];
    }

    function getMarketParticipants(uint256 marketId) external view marketExists(marketId) returns (address[] memory) {
        return markets[marketId].participants;
    }

    // Admin functions
    function setPlatformFee(uint256 _platformFee) external onlyOwner {
        require(_platformFee <= 1000, "Fee too high"); // Max 10%
        platformFee = _platformFee;
    }

    function setFeeCollector(address _feeCollector) external onlyOwner {
        require(_feeCollector != address(0), "Invalid address");
        feeCollector = _feeCollector;
    }

    function cancelMarket(uint256 marketId) external onlyOwner marketExists(marketId) {
        Market storage market = markets[marketId];
        require(market.status == MarketStatus.Active, "Market not active");

        market.status = MarketStatus.Cancelled;

        // Allow users to withdraw their investments
        for (uint256 i = 0; i < market.participants.length; i++) {
            address participant = market.participants[i];
            UserPosition storage position = market.positions[participant];

            if (position.hasPosition && position.totalInvestment > 0) {
                uint256 refund = position.totalInvestment;
                position.totalInvestment = 0;
                position.yesShares = 0;
                position.noShares = 0;
                position.hasPosition = false;

                require(bdag.transfer(participant, refund), "Refund failed");
            }
        }
    }

    function emergencyWithdraw() external onlyOwner {
        uint256 balance = bdag.balanceOf(address(this));
        require(bdag.transfer(owner, balance), "Emergency withdraw failed");
    }
}