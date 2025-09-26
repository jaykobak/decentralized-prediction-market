import { useState } from "react";
import { MarketCard, Market } from "./MarketCard";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Search, Filter, TrendingUp } from "lucide-react";

interface MarketListProps {
  onSelectMarket: (market: Market) => void;
}

export function MarketList({ onSelectMarket }: MarketListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock market data
  const markets: Market[] = [
    {
      id: "1",
      title: "Will Bitcoin reach $100,000 by end of 2024?",
      description: "Predict whether Bitcoin (BTC) will reach or exceed $100,000 USD by December 31, 2024.",
      category: "Crypto",
      endDate: "Dec 31, 2024",
      totalVolume: 125400,
      participants: 2847,
      yesPrice: 0.62,
      noPrice: 0.38,
      yesShares: 78200,
      noShares: 47200,
      status: "active"
    },
    {
      id: "2", 
      title: "Will Ethereum 2.0 staking exceed 50% of total supply?",
      description: "Will more than 50% of all ETH be staked in Ethereum 2.0 by the end of 2024?",
      category: "Crypto",
      endDate: "Dec 31, 2024",
      totalVolume: 89300,
      participants: 1654,
      yesPrice: 0.45,
      noPrice: 0.55,
      yesShares: 45000,
      noShares: 55000,
      status: "active"
    },
    {
      id: "3",
      title: "Will the next FIFA World Cup be held in a new country?",
      description: "Will the 2030 FIFA World Cup be hosted by a country that has never hosted before?",
      category: "Sports",
      endDate: "Jan 1, 2030",
      totalVolume: 67800,
      participants: 3421,
      yesPrice: 0.73,
      noPrice: 0.27,
      yesShares: 73000,
      noShares: 27000,
      status: "active"
    },
    {
      id: "4",
      title: "Will AI achieve AGI before 2030?",
      description: "Will artificial general intelligence (AGI) be achieved by any company before January 1, 2030?",
      category: "Technology",
      endDate: "Jan 1, 2030",
      totalVolume: 234500,
      participants: 5672,
      yesPrice: 0.34,
      noPrice: 0.66,
      yesShares: 34000,
      noShares: 66000,
      status: "active"
    },
    {
      id: "5",
      title: "Will the US election be decided by November 15, 2024?",
      description: "Will the winner of the 2024 US Presidential election be officially determined by November 15, 2024?",
      category: "Politics",
      endDate: "Nov 15, 2024",
      totalVolume: 456700,
      participants: 8934,
      yesPrice: 0.89,
      noPrice: 0.11,
      yesShares: 89000,
      noShares: 11000,
      status: "resolved",
      resolution: "yes"
    },
    {
      id: "6",
      title: "Will BlockDAG mainnet launch in Q1 2025?",
      description: "Will the BlockDAG mainnet be officially launched and operational in Q1 2025?",
      category: "Crypto",
      endDate: "Mar 31, 2025",
      totalVolume: 178900,
      participants: 4567,
      yesPrice: 0.78,
      noPrice: 0.22,
      yesShares: 78000,
      noShares: 22000,
      status: "active"
    }
  ];

  const categories = ["all", "crypto", "sports", "politics", "technology"];
  const statuses = ["all", "active", "pending", "resolved"];

  const filteredMarkets = markets.filter(market => {
    const matchesSearch = market.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         market.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || market.category.toLowerCase() === categoryFilter;
    const matchesStatus = statusFilter === "all" || market.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalVolume = markets.reduce((sum, market) => sum + market.totalVolume, 0);
  const activeMarkets = markets.filter(m => m.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm opacity-90">Total Volume</span>
          </div>
          <div className="text-2xl font-bold">${totalVolume.toLocaleString()}</div>
          <div className="text-sm opacity-75">Across all markets</div>
        </div>
        
        <div className="bg-card border rounded-lg p-6">
          <div className="text-muted-foreground text-sm mb-2">Active Markets</div>
          <div className="text-2xl font-bold">{activeMarkets}</div>
          <div className="text-sm text-muted-foreground">Currently trading</div>
        </div>
        
        <div className="bg-card border rounded-lg p-6">
          <div className="text-muted-foreground text-sm mb-2">Total Participants</div>
          <div className="text-2xl font-bold">
            {markets.reduce((sum, market) => sum + market.participants, 0).toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Unique traders</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search markets..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-40 px-3 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-32 px-3 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {(categoryFilter !== "all" || statusFilter !== "all" || searchTerm) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Search: "{searchTerm}"
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => setSearchTerm("")}
              >
                ×
              </Button>
            </Badge>
          )}
          {categoryFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Category: {categoryFilter}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => setCategoryFilter("all")}
              >
                ×
              </Button>
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Status: {statusFilter}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => setStatusFilter("all")}
              >
                ×
              </Button>
            </Badge>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredMarkets.length} of {markets.length} markets
      </div>

      {/* Market Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMarkets.map(market => (
          <MarketCard
            key={market.id}
            market={market}
            onSelect={onSelectMarket}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredMarkets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Filter className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No markets found matching your criteria</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("all");
              setStatusFilter("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}