// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./PredictionMarket.sol";

contract PredictionMarketFactory {
    address public immutable bdag;
    address public feeCollector;
    address public owner;

    PredictionMarket[] public markets;
    mapping(address => PredictionMarket[]) public userMarkets;

    event MarketDeployed(
        address indexed marketAddress,
        address indexed creator,
        uint256 marketIndex
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _bdag, address _feeCollector) {
        bdag = _bdag;
        feeCollector = _feeCollector;
        owner = msg.sender;
    }

    function createPredictionMarket() external returns (address) {
        PredictionMarket newMarket = new PredictionMarket(bdag, feeCollector);

        markets.push(newMarket);
        userMarkets[msg.sender].push(newMarket);

        emit MarketDeployed(address(newMarket), msg.sender, markets.length - 1);

        return address(newMarket);
    }

    function getMarketCount() external view returns (uint256) {
        return markets.length;
    }

    function getUserMarkets(address user) external view returns (PredictionMarket[] memory) {
        return userMarkets[user];
    }

    function getAllMarkets() external view returns (PredictionMarket[] memory) {
        return markets;
    }

    function setFeeCollector(address _feeCollector) external onlyOwner {
        require(_feeCollector != address(0), "Invalid address");
        feeCollector = _feeCollector;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}