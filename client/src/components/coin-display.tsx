import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins, Plus, TrendingUp, Gift, Clock } from "lucide-react";

interface CoinDisplayProps {
  className?: string;
  showDetails?: boolean;
  onEarnCoins?: () => void;
}

export default function CoinDisplay({ className = "", showDetails = false, onEarnCoins }: CoinDisplayProps) {
  const [animatedCoins, setAnimatedCoins] = useState(0);

  const { data: userData } = useQuery({
    queryKey: ['/api/auth/me'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: coinData } = useQuery({
    queryKey: ['/api/user/coins'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const coins = coinData?.coins ?? userData?.user?.coins ?? 0;

  // Animate coin count changes
  useEffect(() => {
    if (coins !== animatedCoins) {
      const duration = 500;
      const steps = 20;
      const stepValue = (coins - animatedCoins) / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setAnimatedCoins(coins);
          clearInterval(timer);
        } else {
          setAnimatedCoins(prev => prev + stepValue);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [coins, animatedCoins]);

  const getCoinStatus = () => {
    if (coins >= 1000) return { level: "Rich", color: "text-yellow-400", progress: 100 };
    if (coins >= 500) return { level: "Wealthy", color: "text-blue-400", progress: 80 };
    if (coins >= 100) return { level: "Comfortable", color: "text-green-400", progress: 60 };
    if (coins >= 50) return { level: "Growing", color: "text-purple-400", progress: 40 };
    return { level: "Starting", color: "text-gray-400", progress: 20 };
  };

  const status = getCoinStatus();

  if (!showDetails) {
    return (
      <div className={`flex items-center space-x-2 bg-secondary/30 rounded-lg px-3 py-1 ${className}`} data-testid="coin-display-simple">
        <Coins className="text-yellow-400 h-4 w-4 animate-pulse" />
        <span className="text-sm font-mono" data-testid="coin-count">
          {Math.round(animatedCoins).toLocaleString()}
        </span>
        {onEarnCoins && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onEarnCoins}
            data-testid="button-earn-coins"
          >
            <Plus className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className={className} data-testid="coin-display-detailed">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Coins className="text-yellow-400 h-5 w-5" />
            <span>Coin Wallet</span>
          </div>
          <Badge variant="outline" className={status.color}>
            {status.level}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Coin Balance */}
        <div className="text-center">
          <div className="text-3xl font-bold mb-1" data-testid="detailed-coin-count">
            {Math.round(animatedCoins).toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Coins Available</div>
        </div>

        {/* Progress to Next Level */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Next Level</span>
            <span>{status.progress}%</span>
          </div>
          <Progress value={status.progress} className="h-2" />
        </div>

        {/* Earning Options */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Earn More Coins</div>
          
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="justify-between"
              onClick={onEarnCoins}
              data-testid="button-watch-ad"
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Watch Ad</span>
              </div>
              <Badge variant="secondary">+15</Badge>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="justify-between"
              disabled
              data-testid="button-daily-bonus"
            >
              <div className="flex items-center space-x-2">
                <Gift className="h-4 w-4" />
                <span>Daily Bonus</span>
              </div>
              <Badge variant="secondary">+100</Badge>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="justify-between"
              disabled
              data-testid="button-share-reward"
            >
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Share & Earn</span>
              </div>
              <Badge variant="secondary">+50</Badge>
            </Button>
          </div>
        </div>

        {/* Usage Guide */}
        <div className="bg-secondary/20 rounded-lg p-3">
          <div className="text-sm font-medium mb-2">Coin Usage</div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Simple generation</span>
              <span>10-20 coins</span>
            </div>
            <div className="flex justify-between">
              <span>Complex generation</span>
              <span>25-50 coins</span>
            </div>
            <div className="flex justify-between">
              <span>Code optimization</span>
              <span>25 coins</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
