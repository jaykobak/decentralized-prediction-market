# Prediction Market Smart Contracts

This directory contains the smart contracts for the decentralized prediction market platform.

## Contracts

### 1. PredictionMarket.sol
The main contract that handles:
- Market creation and management
- Share buying/selling with dynamic pricing
- Market resolution and payouts
- Fee collection (platform and creator fees)

### 2. BDAGToken.sol
ERC20 token contract for the BDAG token used as the platform currency.

### 3. PredictionMarketFactory.sol
Factory contract for deploying multiple prediction market instances.

## Key Features

### Dynamic Pricing
The contract uses an automated market maker (AMM) approach where:
- Initial price for both outcomes starts at 0.5 (50%)
- Prices adjust based on the ratio of YES to NO shares
- Liquidity factor prevents extreme price movements

### Fee Structure
- Platform fee: 2% (configurable by owner)
- Creator fee: Set by market creator (max 10%)
- Fees are deducted from winning payouts

### Market Lifecycle
1. **Creation**: Anyone can create a market with title, description, end time, and resolution time
2. **Trading**: Users can buy YES or NO shares until the end time
3. **Resolution**: Owner resolves the market after the resolution time
4. **Payout**: Winners can claim their payouts (1 token per winning share minus fees)

## Contract Interactions

### Creating a Market
```solidity
function createMarket(
    string memory _title,
    string memory _description,
    string memory _category,
    uint256 _endTime,
    uint256 _resolutionTime,
    uint256 _creatorFee
) external returns (uint256)
```

### Buying Shares
```solidity
function buyShares(
    uint256 marketId,
    bool isYes,
    uint256 amount
) external
```

### Getting Current Price
```solidity
function getCurrentPrice(
    uint256 marketId,
    bool isYes
) public view returns (uint256)
```

### Resolving Market
```solidity
function resolveMarket(
    uint256 marketId,
    Outcome _outcome
) external onlyOwner
```

### Claiming Payout
```solidity
function claimPayout(uint256 marketId) external
```

## Deployment

1. Deploy BDAGToken with initial supply
2. Deploy PredictionMarket with BDAG token address and fee collector
3. Optionally deploy PredictionMarketFactory for multiple markets

## Security Features

- Market end time validation
- Resolution time after end time
- Owner-only market resolution
- Fee limits (max 10% creator fee, max 10% platform fee)
- Emergency withdrawal for owner
- Position tracking to prevent double payouts

## Integration with Frontend

The contract is designed to work with the existing React frontend:
- Supports BDAG token as shown in MarketDetail.tsx
- Provides all necessary view functions for market data
- Emits events for real-time updates
- Compatible with wagmi/viem for Web3 integration

## Testing

Use the provided test-example.js with your preferred testing framework (Truffle, Hardhat, etc.) to verify contract functionality.