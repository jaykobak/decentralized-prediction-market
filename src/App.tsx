import { useState } from "react";
import { Header } from "./components/Header";
import { MarketList } from "./components/MarketList";
import { MarketDetail } from "./components/MarketDetail";
import { Portfolio } from "./components/Portfolio";
import { CreateMarket } from "./components/CreateMarket";
import { Market } from "./components/MarketCard";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";

export default function App() {
  const [currentView, setCurrentView] = useState("markets");
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    setSelectedMarket(null);
  };

  const handleSelectMarket = (market: Market) => {
    setSelectedMarket(market);
    setCurrentView("market-detail");
  };

  const handleBackToMarkets = () => {
    setSelectedMarket(null);
    setCurrentView("markets");
  };

  const renderContent = () => {
    switch (currentView) {
      case "market-detail":
        return selectedMarket ? (
          <MarketDetail market={selectedMarket} onBack={handleBackToMarkets} />
        ) : null;
      case "portfolio":
        return <Portfolio />;
      case "create":
        return <CreateMarket />;
      case "markets":
      default:
        return <MarketList onSelectMarket={handleSelectMarket} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header currentView={currentView} onViewChange={handleViewChange} />
      
      {/* Hero Section (only on markets page) */}
      {currentView === "markets" && (
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Predict the Future on
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  BlockDAG
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                The world's first decentralized prediction market built on BlockDAG's revolutionary technology. 
                Trade on outcomes, earn rewards, and shape the future of prediction markets.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => setCurrentView("create")}
                  className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 hover:shadow-lg transition-all duration-200"
                >
                  Create Market
                </button>
                <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 hover:scale-105 hover:shadow-lg transition-all duration-200">
                  Learn More
                </button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">$2.4M+</div>
                  <div className="text-blue-200">Total Volume Traded</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">15,000+</div>
                  <div className="text-blue-200">Active Traders</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">95%</div>
                  <div className="text-blue-200">Uptime Guarantee</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Background Image */}
          <div className="absolute inset-0 opacity-10">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1639305239869-8ef28a21b313?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwY3J5cHRvY3VycmVuY3klMjB0cmFkaW5nfGVufDF8fHx8MTc1ODc0MDEwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Blockchain trading background"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="border-t bg-card/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-xs">BD</span>
                </div>
                <span className="font-semibold">BlockDAG Predictions</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Decentralized prediction markets powered by BlockDAG technology.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Markets</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Browse Markets</a></li>
                <li><a href="#" className="hover:text-foreground">Create Market</a></li>
                <li><a href="#" className="hover:text-foreground">Market Rules</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Discord</a></li>
                <li><a href="#" className="hover:text-foreground">Twitter</a></li>
                <li><a href="#" className="hover:text-foreground">Telegram</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 BlockDAG Predictions. Built on BlockDAG Network.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}