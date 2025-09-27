import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Wallet, Home, TrendingUp, User, Plus, Menu } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useChainId } from "wagmi";

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const chainId = useChainId();

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 11155111:
        return "Sepolia Testnet";
      case 1:
        return "Ethereum Mainnet";
      default:
        return "Unknown Network";
    }
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Branding */}
          <div className="flex items-center gap-3">
            {/* <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">FS</span>
            </div> */}
            <div>
              <h1 className="font-bold text-3xl text-blue-600">FORESIGHT</h1>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-2">
              <Button
                variant={currentView === "markets" ? "default" : "ghost"}
                onClick={() => onViewChange("markets")}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Markets
              </Button>
              <Button
                variant={currentView === "portfolio" ? "default" : "ghost"}
                onClick={() => onViewChange("portfolio")}
                className="gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Portfolio
              </Button>
              <Button
                variant={currentView === "create" ? "default" : "ghost"}
                onClick={() => onViewChange("create")}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Market
              </Button>
            </nav>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-2 mt-4">
                  <Button
                    variant={currentView === "markets" ? "default" : "ghost"}
                    onClick={() => { onViewChange("markets"); setIsOpen(false); }}
                    className="justify-start gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Markets
                  </Button>
                  <Button
                    variant={currentView === "portfolio" ? "default" : "ghost"}
                    onClick={() => { onViewChange("portfolio"); setIsOpen(false); }}
                    className="justify-start gap-2"
                  >
                    <TrendingUp className="h-4 w-4" />
                    Portfolio
                  </Button>
                  <Button
                    variant={currentView === "create" ? "default" : "ghost"}
                    onClick={() => { onViewChange("create"); setIsOpen(false); }}
                    className="justify-start gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Market
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="hidden sm:flex gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              {getNetworkName(chainId)}
            </Badge>
            <ConnectButton/>
          </div>
        </div>
      </div>
    </header>
  );
}
