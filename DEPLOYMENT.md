# Deployment Instructions

This document provides instructions for deploying your decentralized prediction market smart contracts and configuring the frontend.

## Smart Contract Deployment

### Prerequisites
- Install Hardhat or Foundry for contract deployment
- Have BlockDAG network RPC endpoints ready
- Ensure you have sufficient native tokens for gas fees

### Step 1: Deploy BDAGToken Contract

First, deploy the BDAG token contract:

```solidity
// Deploy with initial supply (e.g., 1,000,000 tokens)
constructor(1000000) // This creates 1M BDAG tokens
```

### Step 2: Deploy PredictionMarket Contract

Deploy the main prediction market contract:

```solidity
// Constructor parameters:
// _bdag: Address of the deployed BDAGToken contract
// _feeCollector: Address to collect platform fees
constructor(BDAG_TOKEN_ADDRESS, FEE_COLLECTOR_ADDRESS)
```

### Step 3: Update Frontend Configuration

After deployment, update the contract addresses in:
`src/contracts/config.ts`

```typescript
export const CONTRACT_ADDRESSES = {
  PREDICTION_MARKET: '0xYourPredictionMarketAddress',
  BDAG_TOKEN: '0xYourBDAGTokenAddress',
} as const;
```

## Frontend Setup

### Step 1: Configure RainbowKit for Your Network

Update `src/App.tsx` to include your blockchain network:

```typescript
import { defineChain } from 'viem';

const blockdagNetwork = defineChain({
  id: YOUR_CHAIN_ID,
  name: 'BlockDAG Network',
  network: 'blockdag',
  nativeCurrency: {
    decimals: 18,
    name: 'BlockDAG',
    symbol: 'BDAG',
  },
  rpcUrls: {
    default: {
      http: ['YOUR_RPC_URL'],
    },
    public: {
      http: ['YOUR_RPC_URL'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'YOUR_EXPLORER_URL' },
  },
});

const config = getDefaultConfig({
  appName: "Decentralized Prediction Market",
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  chains: [blockdagNetwork], // Use your custom chain
});
```

### Step 2: Get WalletConnect Project ID

1. Go to https://cloud.walletconnect.com/
2. Create a new project
3. Copy the Project ID
4. Replace `'YOUR_PROJECT_ID'` in `src/App.tsx`

## How the Smart Contract Works

### For Users (Voters):

1. **Connect Wallet**: Users connect their BlockDAG-compatible wallet
2. **Approve BDAG**: Users approve the contract to spend their BDAG tokens
3. **Buy Shares**: Users vote by purchasing "Yes" or "No" shares with BDAG
4. **Claim Rewards**: After market resolution, winners claim their proportional share of the pool

### Transaction Flow:

```
1. User clicks "Place Prediction"
2. If approval needed: Contract prompts for BDAG approval
3. User approves BDAG spending
4. User calls buyShares() with their prediction and amount
5. Contract deducts BDAG from user wallet
6. Contract issues shares based on current odds
7. After resolution, winners call claimPayout() to get rewards
```

### Pool Distribution Logic:

- Winners share the **entire pool** proportionally based on their shares
- If you own 10% of winning shares, you get 10% of the total pool (minus fees)
- Fees: Platform fee (2%) + Creator fee (set per market, max 10%)

## Testing

### Local Testing:
1. Deploy contracts to a local blockchain (Hardhat/Anvil)
2. Update contract addresses in config
3. Run the frontend with `npm run dev`
4. Use test accounts with BDAG tokens

### Testnet Testing:
1. Deploy to BlockDAG testnet
2. Get testnet BDAG tokens
3. Test the full user flow

## Security Considerations

- The contracts include access controls and validation
- Platform and creator fees are capped at reasonable limits
- Emergency withdrawal function for contract owner
- Market cancellation with automatic refunds

## Production Checklist

- [ ] Deploy contracts to mainnet
- [ ] Verify contract source code on block explorer
- [ ] Update frontend with mainnet contract addresses
- [ ] Set up proper fee collector address
- [ ] Test with small amounts first
- [ ] Monitor contract events and transactions

## Support

If you need help with deployment or encounter issues, check:
1. Contract compilation errors
2. Network configuration
3. RPC endpoint connectivity
4. Wallet connection issues

The smart contracts are designed to be secure and efficient for prediction market operations with BDAG tokens.