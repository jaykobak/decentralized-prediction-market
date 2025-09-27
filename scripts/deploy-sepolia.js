// Deployment script for Sepolia testnet
// Run with: npx hardhat run scripts/deploy-sepolia.js --network sepolia

const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying contracts to Sepolia testnet...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)));

  // Deploy BDAGToken first
  console.log("\n1. Deploying BDAGToken...");
  const BDAGToken = await ethers.getContractFactory("BDAGToken");
  const initialSupply = 1000000; // 1 million BDAG tokens
  const bdagToken = await BDAGToken.deploy(initialSupply);
  await bdagToken.waitForDeployment();
  const bdagAddress = await bdagToken.getAddress();
  console.log("BDAGToken deployed to:", bdagAddress);

  // Deploy PredictionMarket
  console.log("\n2. Deploying PredictionMarket...");
  const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
  const feeCollector = deployer.address; // Use deployer as fee collector for now
  const predictionMarket = await PredictionMarket.deploy(bdagAddress, feeCollector);
  await predictionMarket.waitForDeployment();
  const predictionMarketAddress = await predictionMarket.getAddress();
  console.log("PredictionMarket deployed to:", predictionMarketAddress);

  // Mint some BDAG tokens to deployer for testing
  console.log("\n3. Minting test BDAG tokens...");
  const mintAmount = ethers.parseEther("10000"); // 10,000 BDAG for testing
  await bdagToken.mint(deployer.address, mintAmount);
  console.log("Minted 10,000 BDAG tokens to deployer for testing");

  // Create a test market
  console.log("\n4. Creating a test market...");
  const endTime = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // 1 week from now
  const resolutionTime = endTime + (24 * 60 * 60); // 1 day after end time
  const creatorFee = 100; // 1% creator fee

  const createTx = await predictionMarket.createMarket(
    "Will Bitcoin reach $100,000 by the end of 2024?",
    "A test prediction market for Bitcoin price speculation",
    "Cryptocurrency",
    endTime,
    resolutionTime,
    creatorFee
  );
  await createTx.wait();
  console.log("Test market created successfully");

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("DEPLOYMENT SUMMARY");
  console.log("=".repeat(50));
  console.log("Network: Sepolia Testnet");
  console.log("BDAGToken Address:      ", bdagAddress);
  console.log("PredictionMarket Address:", predictionMarketAddress);
  console.log("Fee Collector:          ", feeCollector);
  console.log("Deployer Balance:       ", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

  console.log("\n" + "=".repeat(50));
  console.log("NEXT STEPS:");
  console.log("=".repeat(50));
  console.log("1. Update src/contracts/config.ts with these addresses:");
  console.log(`   PREDICTION_MARKET: '${predictionMarketAddress}',`);
  console.log(`   BDAG_TOKEN: '${bdagAddress}',`);
  console.log("\n2. Verify contracts on Etherscan:");
  console.log(`   npx hardhat verify --network sepolia ${bdagAddress} ${initialSupply}`);
  console.log(`   npx hardhat verify --network sepolia ${predictionMarketAddress} ${bdagAddress} ${feeCollector}`);
  console.log("\n3. Get Sepolia ETH for gas: https://sepoliafaucet.com");
  console.log("4. Test the dApp with the deployed contracts");

  // Save deployment info to file
  const fs = require('fs');
  const deploymentInfo = {
    network: "sepolia",
    chainId: 11155111,
    contracts: {
      BDAGToken: bdagAddress,
      PredictionMarket: predictionMarketAddress
    },
    deployer: deployer.address,
    deploymentTime: new Date().toISOString()
  };

  fs.writeFileSync(
    'deployments/sepolia.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n5. Deployment info saved to deployments/sepolia.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });