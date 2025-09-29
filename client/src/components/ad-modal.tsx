import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Play, Coins, Clock, X, CheckCircle2, AlertTriangle } from "lucide-react";

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdCompleted: () => void;
}

export default function AdModal({ isOpen, onClose, onAdCompleted }: AdModalProps) {
  const [adState, setAdState] = useState<'waiting' | 'playing' | 'completed' | 'error'>('waiting');
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setAdState('waiting');
      setTimeRemaining(30);
      setProgress(0);
    }
  }, [isOpen]);

  // Record ad view mutation
  const recordAdViewMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ads/view", {
        adType: 'video',
        duration: 30,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Coins earned!",
        description: `You earned ${data.coinsEarned} coins! New balance: ${data.newBalance}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/coins'] });
      onAdCompleted();
    },
    onError: (error: any) => {
      setAdState('error');
      toast({
        title: "Failed to earn coins",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Simulate ad playback
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (adState === 'playing') {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          setProgress((30 - newTime) / 30 * 100);
          
          if (newTime <= 0) {
            setAdState('completed');
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [adState]);

  const startAd = () => {
    setAdState('playing');
    setTimeRemaining(30);
    setProgress(0);
  };

  const claimReward = () => {
    recordAdViewMutation.mutate();
  };

  const handleClose = () => {
    if (adState === 'playing') {
      toast({
        title: "Ad interrupted",
        description: "You must watch the full ad to earn coins",
        variant: "destructive",
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" data-testid="ad-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Coins className="h-5 w-5 text-yellow-400" />
            <span>Earn Coins</span>
          </DialogTitle>
          <DialogDescription>
            Watch a short ad to earn coins for AI generations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Ad Preview/Player Area */}
          <div className="bg-black rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
            {adState === 'waiting' && (
              <div className="text-center text-white space-y-4">
                <Play className="h-16 w-16 mx-auto opacity-60" />
                <div>
                  <h3 className="text-lg font-semibold">Ready to Watch Ad?</h3>
                  <p className="text-sm opacity-80">30 second video ad</p>
                </div>
              </div>
            )}

            {adState === 'playing' && (
              <div className="text-center text-white space-y-4 w-full p-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8">
                  <h3 className="text-xl font-bold mb-2">Sample Advertisement</h3>
                  <p className="text-sm opacity-90">This is a demo ad for X.AI platform</p>
                  <div className="mt-4">
                    <div className="animate-pulse bg-white/20 rounded-lg h-16 w-full"></div>
                  </div>
                </div>
                
                {/* Timer Overlay */}
                <div className="absolute top-4 right-4 bg-black/70 rounded-lg px-3 py-1">
                  <div className="flex items-center space-x-2 text-white">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-mono">{timeRemaining}s</span>
                  </div>
                </div>
              </div>
            )}

            {adState === 'completed' && (
              <div className="text-center text-white space-y-4">
                <CheckCircle2 className="h-16 w-16 mx-auto text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold">Ad Complete!</h3>
                  <p className="text-sm opacity-80">Claim your reward</p>
                </div>
              </div>
            )}

            {adState === 'error' && (
              <div className="text-center text-white space-y-4">
                <AlertTriangle className="h-16 w-16 mx-auto text-red-400" />
                <div>
                  <h3 className="text-lg font-semibold">Something went wrong</h3>
                  <p className="text-sm opacity-80">Please try again</p>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {adState === 'playing' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Ad Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Reward Info */}
          <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Coins className="h-5 w-5 text-yellow-400" />
                <span className="font-medium">Reward</span>
              </div>
              <Badge className="bg-yellow-400 text-yellow-900">
                +15 Coins
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Enough for 1-2 AI generations
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {adState === 'waiting' && (
              <>
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={startAd} className="flex-1" data-testid="button-start-ad">
                  <Play className="h-4 w-4 mr-2" />
                  Start Ad
                </Button>
              </>
            )}

            {adState === 'playing' && (
              <Button variant="outline" onClick={handleClose} className="w-full" disabled>
                <Clock className="h-4 w-4 mr-2" />
                Please wait... {timeRemaining}s
              </Button>
            )}

            {adState === 'completed' && (
              <>
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Close
                </Button>
                <Button 
                  onClick={claimReward} 
                  className="flex-1"
                  disabled={recordAdViewMutation.isPending}
                  data-testid="button-claim-reward"
                >
                  <Coins className="h-4 w-4 mr-2" />
                  {recordAdViewMutation.isPending ? "Claiming..." : "Claim Coins"}
                </Button>
              </>
            )}

            {adState === 'error' && (
              <>
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Close
                </Button>
                <Button onClick={() => setAdState('waiting')} className="flex-1">
                  Try Again
                </Button>
              </>
            )}
          </div>

          {/* Terms */}
          <p className="text-xs text-muted-foreground text-center">
            By watching ads, you agree to our advertising terms. 
            Coins are earned after completing the full advertisement.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
