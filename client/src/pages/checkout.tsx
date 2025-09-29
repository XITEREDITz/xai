import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/navbar";
import { 
  Check, 
  ArrowLeft, 
  CreditCard, 
  Shield, 
  Zap, 
  Crown,
  Infinity,
  Bolt,
  Headset,
  Loader2
} from "lucide-react";

const CheckoutForm = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useLocation();

  const handlePayPalSubscription = async () => {
    setIsProcessing(true);

    try {
      // Create PayPal subscription
      const response = await apiRequest("POST", "/api/paypal/create-subscription");
      const data = await response.json();
      
      if (data.approvalUrl) {
        // Redirect to PayPal for approval
        window.location.href = data.approvalUrl;
      } else {
        throw new Error("Failed to create PayPal subscription");
      }
    } catch (error: any) {
      setIsProcessing(false);
      toast({
        title: "Payment Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Information</h3>
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <div className="text-blue-600 font-semibold text-lg mb-2">PayPal Subscription</div>
          <p className="text-muted-foreground mb-4">
            You'll be redirected to PayPal to complete your subscription securely.
          </p>
          <div className="flex justify-center">
            <img 
              src="/paypal-logo.png" 
              alt="PayPal" 
              className="h-8"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-secondary/20 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
          <Shield className="h-4 w-4" />
          <span>Secured by PayPal • SSL Encrypted</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Your payment information is processed securely by PayPal. We don't store your payment details.
        </p>
      </div>

      <Button 
        onClick={handlePayPalSubscription}
        className="w-full" 
        size="lg"
        disabled={isProcessing}
        data-testid="submit-payment"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Continue with PayPal
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By subscribing, you agree to our Terms of Service and Privacy Policy. 
        Cancel anytime from your account settings.
      </p>
    </div>
  );
};

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: userData } = useQuery({
    queryKey: ['/api/auth/me'],
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (userData === null) {
      toast({
        title: "Authentication required",
        description: "Please log in to upgrade your account",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [userData, setLocation, toast]);


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/pricing")}
            className="mb-4"
            data-testid="back-to-pricing"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pricing
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="checkout-title">
            Upgrade to Pro
          </h1>
          <p className="text-xl text-muted-foreground">
            Unlock unlimited AI generations and premium features
          </p>
        </div>
      </div>

      {/* Checkout Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Plan Summary */}
          <div className="space-y-6">
            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Crown className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl">Pro Plan</CardTitle>
                  </div>
                  <Badge className="bg-accent text-accent-foreground">
                    Most Popular
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">$4.99</div>
                  <div className="text-muted-foreground">per month</div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">What's included:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                      <Infinity className="h-4 w-4 text-primary" />
                      <span className="text-sm">Unlimited AI generations</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Bolt className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm">Priority AI processing</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">All AI models (Claude, Gemini, GPT)</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">Premium templates</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">Advanced code optimization</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">Private project storage</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Headset className="h-4 w-4 text-blue-400" />
                      <span className="text-sm">Priority support</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Zap className="h-4 w-4 text-accent" />
                      <span className="text-sm">Early access to new features</span>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm font-medium">30-day money back guarantee</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cancel anytime, no questions asked
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Billing Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Billing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Pro Plan (Monthly)</span>
                  <span>$4.99</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>$4.99/month</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Billed monthly. Cancel anytime from your account settings.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Complete Your Subscription</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CheckoutForm />
              </CardContent>
            </Card>

            {/* Security Features */}
            <div className="space-y-4">
              <h3 className="font-semibold">Why choose X.AI Pro?</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Infinity className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">No Limits</h4>
                    <p className="text-xs text-muted-foreground">
                      Generate as many mods as you want without watching ads or spending coins
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bolt className="h-4 w-4 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Priority Processing</h4>
                    <p className="text-xs text-muted-foreground">
                      Your AI requests are processed first, with faster response times
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Headset className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Premium Support</h4>
                    <p className="text-xs text-muted-foreground">
                      Get help from our team when you need it most
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
