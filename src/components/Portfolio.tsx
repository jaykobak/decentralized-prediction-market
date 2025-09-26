import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { TrendingUp, TrendingDown, DollarSign, Award, Clock, BarChart3 } from "lucide-react";

export function Portfolio() {
  // Mock portfolio data
  const portfolioStats = {
    totalValue: 1250.43,
    totalInvested: 980.00,
    totalProfit: 270.43,
    profitPercentage: 27.6,
    activePredictions: 5,
    resolvedPredictions: 12,
    winRate: 75
  };

  const activePredictions = [
    {
      id: "1",
      marketTitle: "Will Bitcoin reach $100,000 by end of 2024?",
      outcome: "yes",
      shares: 45,
      currentPrice: 0.62,
      purchasePrice: 0.58,
      investment: 26.1,
      currentValue: 27.9,
      profit: 1.8,
      endDate: "Dec 31, 2024",
      status: "active"
    },
    {
      id: "2",
      marketTitle: "Will BlockDAG mainnet launch in Q1 2025?",
      outcome: "yes", 
      shares: 32,
      currentPrice: 0.78,
      purchasePrice: 0.72,
      investment: 23.04,
      currentValue: 24.96,
      profit: 1.92,
      endDate: "Mar 31, 2025",
      status: "active"
    },
    {
      id: "3",
      marketTitle: "Will AI achieve AGI before 2030?",
      outcome: "no",
      shares: 28,
      currentPrice: 0.66,
      purchasePrice: 0.70,
      investment: 19.6,
      currentValue: 18.48,
      profit: -1.12,
      endDate: "Jan 1, 2030",
      status: "active"
    }
  ];

  const resolvedPredictions = [
    {
      id: "4",
      marketTitle: "Will the US election be decided by November 15, 2024?",
      outcome: "yes",
      shares: 50,
      finalPrice: 1.0,
      purchasePrice: 0.85,
      investment: 42.5,
      payout: 50.0,
      profit: 7.5,
      resolution: "yes",
      status: "won"
    },
    {
      id: "5",
      marketTitle: "Will Ethereum reach $5,000 in 2024?",
      outcome: "yes",
      shares: 35,
      finalPrice: 0.0,
      purchasePrice: 0.65,
      investment: 22.75,
      payout: 0,
      profit: -22.75,
      resolution: "no",
      status: "lost"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Portfolio Header */}
      <div>
        <h1 className="text-2xl font-semibold mb-2">Portfolio</h1>
        <p className="text-muted-foreground">Track your predictions and performance</p>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-sm text-muted-foreground">Portfolio Value</span>
            </div>
            <div className="text-2xl font-bold">{portfolioStats.totalValue.toFixed(2)} BDAG</div>
            <div className="text-sm text-green-600">
              +{portfolioStats.totalProfit.toFixed(2)} ({portfolioStats.profitPercentage.toFixed(1)}%)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-muted-foreground">Total Invested</span>
            </div>
            <div className="text-2xl font-bold">{portfolioStats.totalInvested.toFixed(2)} BDAG</div>
            <div className="text-sm text-muted-foreground">
              Across {portfolioStats.activePredictions + portfolioStats.resolvedPredictions} markets
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span className="text-sm text-muted-foreground">Active Predictions</span>
            </div>
            <div className="text-2xl font-bold">{portfolioStats.activePredictions}</div>
            <div className="text-sm text-muted-foreground">Currently trading</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-muted-foreground">Win Rate</span>
            </div>
            <div className="text-2xl font-bold">{portfolioStats.winRate}%</div>
            <div className="text-sm text-muted-foreground">
              {Math.round(portfolioStats.resolvedPredictions * portfolioStats.winRate / 100)} wins of {portfolioStats.resolvedPredictions}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictions Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Predictions</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          <div className="space-y-4">
            {activePredictions.map((prediction) => (
              <Card key={prediction.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{prediction.marketTitle}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Badge variant={prediction.outcome === "yes" ? "default" : "secondary"}>
                            {prediction.outcome.toUpperCase()}
                          </Badge>
                          <span>{prediction.shares} shares</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Ends {prediction.endDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-sm text-muted-foreground">Invested</div>
                        <div className="font-semibold">{prediction.investment.toFixed(2)} BDAG</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Current Value</div>
                        <div className="font-semibold">{prediction.currentValue.toFixed(2)} BDAG</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">P&L</div>
                        <div className={`font-semibold ${prediction.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {prediction.profit >= 0 ? "+" : ""}{prediction.profit.toFixed(2)} BDAG
                        </div>
                      </div>
                      <div>
                        <Button size="sm" variant="outline">View Market</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-4">
            {resolvedPredictions.map((prediction) => (
              <Card key={prediction.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{prediction.marketTitle}</h3>
                        <Badge variant={prediction.status === "won" ? "default" : "destructive"}>
                          {prediction.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <span>Predicted: </span>
                          <Badge variant={prediction.outcome === "yes" ? "default" : "secondary"}>
                            {prediction.outcome.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>Resolved: </span>
                          <Badge variant={prediction.resolution === "yes" ? "default" : "secondary"}>
                            {prediction.resolution?.toUpperCase()}
                          </Badge>
                        </div>
                        <span>{prediction.shares} shares</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-sm text-muted-foreground">Invested</div>
                        <div className="font-semibold">{prediction.investment.toFixed(2)} BDAG</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Payout</div>
                        <div className="font-semibold">{prediction.payout.toFixed(2)} BDAG</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">P&L</div>
                        <div className={`font-semibold ${prediction.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {prediction.profit >= 0 ? "+" : ""}{prediction.profit.toFixed(2)} BDAG
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Return</div>
                        <div className={`font-semibold ${prediction.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {((prediction.profit / prediction.investment) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}