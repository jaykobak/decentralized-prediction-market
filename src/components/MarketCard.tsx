import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { TrendingUp, TrendingDown, Clock, Users } from "lucide-react";

export interface Market {
  id: string;
  title: string;
  description: string;
  category: string;
  endDate: string;
  totalVolume: number;
  participants: number;
  yesPrice: number;
  noPrice: number;
  yesShares: number;
  noShares: number;
  status: "active" | "pending" | "resolved";
  resolution?: "yes" | "no";
}

interface MarketCardProps {
  market: Market;
  onSelect: (market: Market) => void;
}

export function MarketCard({ market, onSelect }: MarketCardProps) {
  const totalShares = market.yesShares + market.noShares;
  const yesPercentage = totalShares > 0 ? (market.yesShares / totalShares) * 100 : 50;
  const noPercentage = 100 - yesPercentage;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "resolved": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "crypto": return "bg-blue-100 text-blue-800";
      case "sports": return "bg-green-100 text-green-800";
      case "politics": return "bg-red-100 text-red-800";
      case "technology": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelect(market)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className={getCategoryColor(market.category)}>
                {market.category}
              </Badge>
              <div className="flex items-center gap-1">
                <div className={`h-2 w-2 rounded-full ${getStatusColor(market.status)}`}></div>
                <span className="text-sm text-muted-foreground capitalize">{market.status}</span>
              </div>
            </div>
            <h3 className="font-semibold line-clamp-2 mb-1">{market.title}</h3>
            <p className="text-muted-foreground text-sm line-clamp-2">{market.description}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Prediction Outcome */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-3 bg-green-50 rounded-lg border">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">YES</span>
            </div>
            <div className="text-2xl font-semibold text-green-800">{yesPercentage.toFixed(0)}%</div>
            <div className="text-xs text-green-600">${market.yesPrice.toFixed(2)}</div>
          </div>
          
          <div className="text-center p-3 bg-red-50 rounded-lg border">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-800">NO</span>
            </div>
            <div className="text-2xl font-semibold text-red-800">{noPercentage.toFixed(0)}%</div>
            <div className="text-xs text-red-600">${market.noPrice.toFixed(2)}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <Progress value={yesPercentage} className="h-2" />
        </div>

        {/* Market Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{market.participants} participants</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Ends {market.endDate}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">${market.totalVolume.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Volume</div>
          </div>
          <Button size="sm">
            {market.status === "resolved" ? "Trade" : "Trade"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
