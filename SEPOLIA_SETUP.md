# Sepolia Testnet Setup Guide

This guide will help you deploy your prediction market contracts to Sepolia testnet and configure the frontend to use them.

## Prerequisites

1. **MetaMask or compatible wallet** with Sepolia testnet added
2. **Sepolia ETH** for gas fees (get from [Sepolia Faucet](https://sepoliafaucet.com))
3. **Node.js** and **npm** installed
4. **Git** for version control

## Step 1: Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Edit `.env` and add your values:
```bash
# Your wallet private key (get from MetaMask > Account Details > Export Private Key)
PRIVATE_KEY=your_private_key_without_0x_prefix

# Sepolia RPC URL (you can use the default or get one from Alchemy/Infura)
SEPOLIA_RPC_URL=https://rpc.sepolia.org

# Get API key from https://etherscan.io/apis
ETHERSCAN_API_KEY=your_etherscan_api_key

# Get Project ID from https://cloud.walletconnect.com/
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

⚠️ **Security Note**: Never commit your `.env` file to git! It's already in `.gitignore`.

## Step 2: Install Hardhat Dependencies

```bash
# Install Hardhat and related tools
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv

# Or copy from the provided package file
cp package-hardhat.json package-contracts.json
cd contracts-folder
npm install
```

## Step 3: Deploy Contracts to Sepolia

```bash
# Compile contracts
npx hardhat compile

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy-sepolia.js --network sepolia
```

The deployment script will:
- Deploy BDAGToken contract
- Deploy PredictionMarket contract
- Mint 10,000 test BDAG tokens to your account
- Create a test market
- Save deployment info to `deployments/sepolia.json`

## Step 4: Update Frontend Configuration

After successful deployment, update `src/contracts/config.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  11155111: { // Sepolia chain ID
    PREDICTION_MARKET: '0xYourPredictionMarketAddress',
    BDAG_TOKEN: '0xYourBDAGTokenAddress',
  },
  // ... other networks
};
```

## Step 5: Verify Contracts (Optional but Recommended)

```bash
# Verify BDAGToken
npx hardhat verify --network sepolia <BDAG_TOKEN_ADDRESS> 1000000

# Verify PredictionMarket
npx hardhat verify --network sepolia <PREDICTION_MARKET_ADDRESS> <BDAG_TOKEN_ADDRESS> <FEE_COLLECTOR_ADDRESS>
```

## Step 6: Test the Application

1. **Start the development server**:
```bash
npm run dev
```

2. **Connect your wallet**:
   - Open http://localhost:5173
   - Click "Connect Wallet"
   - Switch to Sepolia network in MetaMask
   - Connect your account

3. **Test the prediction market**:
   - You should see the test market created during deployment
   - Your account should have 10,000 BDAG tokens
   - Try placing a small prediction (e.g., 10 BDAG)
   - The transaction should prompt MetaMask for approval

## Step 7: Get Test Tokens

If you need more Sepolia ETH or BDAG tokens:

### Sepolia ETH:
- [Sepolia Faucet](https://sepoliafaucet.com)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com)
- [Chainlink Faucet](https://faucets.chain.link/sepolia)

### BDAG Tokens:
The deployer account has mint permissions, so you can mint more:
```javascript
// In Hardhat console
const bdagToken = await ethers.getContractAt("BDAGToken", "YOUR_BDAG_ADDRESS");
await bdagToken.mint("USER_ADDRESS", ethers.parseEther("1000")); // Mint 1000 BDAG
```

## Network Information

- **Chain ID**: 11155111
- **Network Name**: Sepolia Testnet
- **RPC URL**: https://rpc.sepolia.org
- **Block Explorer**: https://sepolia.etherscan.io

## Troubleshooting

### Common Issues:

1. **"Insufficient funds" error**:
   - Get more Sepolia ETH from faucets
   - Check you're on Sepolia network

2. **"Contract not found" error**:
   - Verify contract addresses in config.ts
   - Ensure contracts are deployed successfully

3. **MetaMask not connecting**:
   - Clear browser cache
   - Reset MetaMask account
   - Check network settings

4. **Transaction failing**:
   - Increase gas limit
   - Check you have enough ETH for gas
   - Verify contract interactions

### Useful Commands:

```bash
# Check account balance
npx hardhat console --network sepolia
> const balance = await ethers.provider.getBalance("YOUR_ADDRESS");
> console.log(ethers.formatEther(balance));

# Interact with deployed contracts
> const bdag = await ethers.getContractAt("BDAGToken", "BDAG_ADDRESS");
> const balance = await bdag.balanceOf("YOUR_ADDRESS");
> console.log(ethers.formatEther(balance));
```

## Next Steps

1. **Test thoroughly** on Sepolia before mainnet
2. **Create more markets** for testing
3. **Test edge cases** like market resolution
4. **Monitor gas usage** and optimize if needed
5. **Plan mainnet deployment** when ready

## Support Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Sepolia Testnet Info](https://sepolia.dev)
- [MetaMask Support](https://support.metamask.io)
- [Etherscan Sepolia](https://sepolia.etherscan.io)