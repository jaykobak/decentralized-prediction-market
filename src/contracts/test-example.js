// Example test for the Prediction Market contract
// This demonstrates how to interact with the contract

const PredictionMarket = artifacts.require("PredictionMarket");
const BDAGToken = artifacts.require("BDAGToken");

contract("PredictionMarket", (accounts) => {
  let predictionMarket;
  let bdagToken;
  const [owner, feeCollector, user1, user2] = accounts;

  beforeEach(async () => {
    // Deploy BDAG token
    bdagToken = await BDAGToken.new(1000000, { from: owner });

    // Deploy prediction market
    predictionMarket = await PredictionMarket.new(
      bdagToken.address,
      feeCollector,
      { from: owner }
    );

    // Mint tokens to users
    await bdagToken.mint(user1, web3.utils.toWei("1000", "ether"), { from: owner });
    await bdagToken.mint(user2, web3.utils.toWei("1000", "ether"), { from: owner });

    // Approve prediction market to spend tokens
    await bdagToken.approve(
      predictionMarket.address,
      web3.utils.toWei("1000", "ether"),
      { from: user1 }
    );
    await bdagToken.approve(
      predictionMarket.address,
      web3.utils.toWei("1000", "ether"),
      { from: user2 }
    );
  });

  it("should create a market", async () => {
    const endTime = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
    const resolutionTime = endTime + 3600; // 1 hour after end

    const tx = await predictionMarket.createMarket(
      "Will Bitcoin reach $100k by end of 2024?",
      "Prediction about Bitcoin price",
      "Cryptocurrency",
      endTime,
      resolutionTime,
      500, // 5% creator fee
      { from: user1 }
    );

    const marketInfo = await predictionMarket.getMarketInfo(1);
    assert.equal(marketInfo.title, "Will Bitcoin reach $100k by end of 2024?");
    assert.equal(marketInfo.creator, user1);
  });

  it("should allow users to buy shares", async () => {
    // Create market first
    const endTime = Math.floor(Date.now() / 1000) + 86400;
    const resolutionTime = endTime + 3600;

    await predictionMarket.createMarket(
      "Test Market",
      "Test Description",
      "Test",
      endTime,
      resolutionTime,
      500,
      { from: user1 }
    );

    // Buy YES shares
    const amount = web3.utils.toWei("100", "ether");
    await predictionMarket.buyShares(1, true, amount, { from: user2 });

    const position = await predictionMarket.getUserPosition(1, user2);
    assert.isTrue(position.yesShares > 0);
    assert.equal(position.totalInvestment, amount);
  });

  it("should calculate prices correctly", async () => {
    // Create market
    const endTime = Math.floor(Date.now() / 1000) + 86400;
    const resolutionTime = endTime + 3600;

    await predictionMarket.createMarket(
      "Test Market",
      "Test Description",
      "Test",
      endTime,
      resolutionTime,
      500,
      { from: user1 }
    );

    // Initial price should be 0.5 (50%)
    const initialPrice = await predictionMarket.getCurrentPrice(1, true);
    assert.equal(initialPrice.toString(), web3.utils.toWei("0.5", "ether"));

    // Buy some YES shares to shift the price
    const amount = web3.utils.toWei("100", "ether");
    await predictionMarket.buyShares(1, true, amount, { from: user2 });

    // Price should have increased
    const newPrice = await predictionMarket.getCurrentPrice(1, true);
    assert.isTrue(newPrice.gt(initialPrice));
  });

  it("should resolve market and allow payouts", async () => {
    // Create market
    const endTime = Math.floor(Date.now() / 1000) + 1; // End immediately
    const resolutionTime = endTime + 1; // Resolution 1 second later

    await predictionMarket.createMarket(
      "Test Market",
      "Test Description",
      "Test",
      endTime,
      resolutionTime,
      500,
      { from: user1 }
    );

    // Buy YES shares
    const amount = web3.utils.toWei("100", "ether");
    await predictionMarket.buyShares(1, true, amount, { from: user2 });

    // Wait for resolution time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Resolve market as YES
    await predictionMarket.resolveMarket(1, 1, { from: owner }); // 1 = Yes

    // Claim payout
    const initialBalance = await bdagToken.balanceOf(user2);
    await predictionMarket.claimPayout(1, { from: user2 });
    const finalBalance = await bdagToken.balanceOf(user2);

    assert.isTrue(finalBalance.gt(initialBalance));
  });
});