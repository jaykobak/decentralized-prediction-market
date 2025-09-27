import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ArrowLeft, TrendingUp, TrendingDown, Clock, Users, Activity, DollarSign, Wallet } from "lucide-react";
import { Market } from "./MarketCard";
import { usePredictionMarket, useBuyShares } from "../hooks/useContract";
import { useAccount } from "wagmi";
import { toast } from "sonner";

interface MarketDetailProps {
  market: Market;
  onBack: () => void;
}

export function MarketDetail({ market, onBack }: MarketDetailProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<"yes" | "no">("yes");
  const [amount, setAmount] = useState("");
  const [shares, setShares] = useState("");
  const [isApprovalNeeded, setIsApprovalNeeded] = useState(false);

  const { isConnected } = useAccount();
  const {
    bdagBalance,
    allowance,
    approve,
    isApproving,
    userAddress,
  } = usePredictionMarket();

  const { buyShares, isLoading: isBuying, isSuccess, error } = useBuyShares(
    market.id,
    selectedOutcome === "yes",
    amount
  );

  const totalShares = market.yesShares + market.noShares;
  const yesPercentage = totalShares > 0 ? (market.yesShares / totalShares) * 100 : 50;
  const noPercentage = 100 - yesPercentage;

  const currentPrice = selectedOutcome === "yes" ? market.yesPrice : market.noPrice;
  const estimatedShares = amount ? (parseFloat(amount) / currentPrice).toFixed(2) : "0";

  // Check if approval is needed when amount changes
  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      const needsApproval = parseFloat(allowance) < parseFloat(amount);
      setIsApprovalNeeded(needsApproval);
    } else {
      setIsApprovalNeeded(false);
    }
  }, [amount, allowance]);

  // Handle successful transaction
  useEffect(() => {
    if (isSuccess) {
      toast.success("Prediction placed successfully!");
      setAmount("");
      setShares("");
    }
  }, [isSuccess]);

  // Handle transaction errors
  useEffect(() => {
    if (error) {
      toast.error("Transaction failed. Please try again.");
    }
  }, [error]);

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (value && !isNaN(parseFloat(value))) {
      const calculatedShares = (parseFloat(value) / currentPrice).toFixed(2);
      setShares(calculatedShares);
    } else {
      setShares("");
    }
  };

  const handleSharesChange = (value: string) => {
    setShares(value);
    if (value && !isNaN(parseFloat(value))) {
      const calculatedAmount = (parseFloat(value) * currentPrice).toFixed(2);
      setAmount(calculatedAmount);
    } else {
      setAmount("");
    }
  };

  const handleApprove = async () => {
    if (approve) {
      try {
        await approve();
        toast.success("Approval transaction submitted!");
      } catch (err) {
        toast.error("Approval failed. Please try again.");
      }
    }
  };

  const handleBuyShares = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (parseFloat(amount) > parseFloat(bdagBalance)) {
      toast.error("Insufficient BDAG balance");
      return;
    }

    if (buyShares) {
      try {
        await buyShares();
        toast.success("Transaction submitted! Waiting for confirmation...");
      } catch (err) {
        toast.error("Transaction failed. Please try again.");
      }
    }
  };

  const getButtonText = () => {
    if (!isConnected) return "Connect Wallet";
    if (isApprovalNeeded) return isApproving ? "Approving..." : "Approve BDAG";
    if (isBuying) return "Placing Prediction...";
    return "Place Prediction";
  };

  const isButtonDisabled = () => {
    if (!isConnected) return false;
    if (isApprovalNeeded) return isApproving;
    return !amount || parseFloat(amount) <= 0 || isBuying || parseFloat(amount) > parseFloat(bdagBalance);
  };

  // Mock trading history data
  const recentTrades = [
    { id: 1, outcome: "yes", price: 0.62, amount: 150, time: "2m ago" },
    { id: 2, outcome: "no", price: 0.38, amount: 89, time: "5m ago" },
    { id: 3, outcome: "yes", price: 0.61, amount: 200, time: "8m ago" },
    { id: 4, outcome: "no", price: 0.39, amount: 75, time: "12m ago" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary">{market.category}</Badge>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-muted-foreground capitalize">{market.status}</span>
            </div>
          </div>
          <h1 className="text-2xl font-semibold">{market.title}</h1>
          <p className="text-muted-foreground mt-1">{market.description}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Market Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Market Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg border">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">YES</span>
                  </div>
                  <div className="text-3xl font-bold text-green-800 mb-1">
                    {yesPercentage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-green-600">
                    ${market.yesPrice.toFixed(2)} per share
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {market.yesShares.toLocaleString()} shares
                  </div>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-lg border">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-red-800">NO</span>
                  </div>
                  <div className="text-3xl font-bold text-red-800 mb-1">
                    {noPercentage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-red-600">
                    ${market.noPrice.toFixed(2)} per share
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {market.noShares.toLocaleString()} shares
                  </div>
                </div>
              </div>

              <Progress value={yesPercentage} className="h-3 mb-4" />
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">Volume</span>
                  </div>
                  <div className="font-semibold">${market.totalVolume.toLocaleString()}</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Participants</span>
                  </div>
                  <div className="font-semibold">{market.participants}</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Ends</span>
                  </div>
                  <div className="font-semibold">{market.endDate}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trading Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Trading Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentTrades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                    <div className="flex items-center gap-3">
                      <Badge variant={trade.outcome === "yes" ? "default" : "secondary"} className="w-12">
                        {trade.outcome.toUpperCase()}
                      </Badge>
                      <span className="font-medium">${trade.price.toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${trade.amount}</div>
                      <div className="text-xs text-muted-foreground">{trade.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trading Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Place Prediction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Outcome Selection */}
              <div>
                <label className="text-sm font-medium mb-3 block">Select Outcome</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={selectedOutcome === "yes" ? "default" : "outline"}
                    onClick={() => setSelectedOutcome("yes")}
                    className="h-12"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    YES ${market.yesPrice.toFixed(2)}
                  </Button>
                  <Button
                    variant={selectedOutcome === "no" ? "default" : "outline"}
                    onClick={() => setSelectedOutcome("no")}
                    className="h-12"
                  >
                    <TrendingDown className="h-4 w-4 mr-2" />
                    NO ${market.noPrice.toFixed(2)}
                  </Button>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="amount" className="block text-sm font-medium">Amount (BDAG)</label>
                  {isConnected && (
                    <span className="text-xs text-muted-foreground">
                      Balance: {parseFloat(bdagBalance).toFixed(2)} BDAG
                    </span>
                  )}
                </div>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                />
              </div>

              {/* Shares Input */}
              <div>
                <label htmlFor="shares" className="block text-sm font-medium mb-2">Shares</label>
                <Input
                  id="shares"
                  type="number"
                  placeholder="0"
                  value={shares}
                  onChange={(e) => handleSharesChange(e.target.value)}
                />
              </div>

              {/* Prediction Summary */}
              {amount && (
                <div className="p-3 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cost:</span>
                    <span>{amount} BDAG</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shares:</span>
                    <span>{estimatedShares}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Potential Payout:</span>
                    <span>{shares ? (parseFloat(shares) * 1).toFixed(2) : "0"} BDAG</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>Potential Profit:</span>
                    <span className="text-green-600">
                      +{shares && amount ? (parseFloat(shares) - parseFloat(amount)).toFixed(2) : "0"} BDAG
                    </span>
                  </div>
                </div>
              )}

              <Button
                className="w-full"
                disabled={isButtonDisabled()}
                onClick={isApprovalNeeded ? handleApprove : handleBuyShares}
              >
                {!isConnected && <Wallet className="h-4 w-4 mr-2" />}
                {getButtonText()}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Powered by BlockDAG smart contracts
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}