// Simple deployment script for the prediction market contracts
// This can be used with tools like Hardhat, Truffle, or directly with web3.js

const deployPredictionMarket = async (web3, accounts) => {
  // Deploy BDAG Token first
  const BDAGToken = artifacts.require("BDAGToken");
  const initialSupply = 1000000; // 1M tokens
  const bdagToken = await BDAGToken.new(initialSupply, { from: accounts[0] });

  console.log(`BDAG Token deployed at: ${bdagToken.address}`);

  // Deploy Prediction Market
  const PredictionMarket = artifacts.require("PredictionMarket");
  const feeCollector = accounts[1]; // Use second account as fee collector
  const predictionMarket = await PredictionMarket.new(
    bdagToken.address,
    feeCollector,
    { from: accounts[0] }
  );

  console.log(`Prediction Market deployed at: ${predictionMarket.address}`);

  // Deploy Factory (optional)
  const PredictionMarketFactory = artifacts.require("PredictionMarketFactory");
  const factory = await PredictionMarketFactory.new(
    bdagToken.address,
    feeCollector,
    { from: accounts[0] }
  );

  console.log(`Factory deployed at: ${factory.address}`);

  // Mint some tokens to test accounts
  for (let i = 0; i < 5; i++) {
    await bdagToken.mint(accounts[i], web3.utils.toWei("10000", "ether"), { from: accounts[0] });
    console.log(`Minted 10,000 BDAG to ${accounts[i]}`);
  }

  return {
    bdagToken: bdagToken.address,
    predictionMarket: predictionMarket.address,
    factory: factory.address
  };
};

module.exports = deployPredictionMarket;