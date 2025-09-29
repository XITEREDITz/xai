import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/navbar";
import { Check, X, Zap, Infinity, Bolt, Headset, Coins, Clock, Star } from "lucide-react";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4" data-testid="pricing-title">
            Simple, Affordable Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Start free, then choose a plan that works for you. No hidden fees, cancel anytime.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Trial */}
          <Card className="relative" data-testid="plan-free-trial">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-4 py-1">
                7 Days Free
              </Badge>
            </div>
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-2xl font-bold">Free Trial</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/first 7 days</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Unlimited AI generations</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">All AI models included</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Template library access</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Code export & documentation</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Community support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Project saving & management</span>
                </li>
              </ul>
              
              <Button asChild className="w-full" size="lg" data-testid="button-start-trial">
                <Link href="/builder">
                  Start Free Trial
                </Link>
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                No credit card required
              </p>
            </CardContent>
          </Card>

          {/* Ad-Supported */}
          <Card data-testid="plan-ad-supported">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Ad-Supported</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-green-500">Free</span>
                <span className="text-muted-foreground">/forever</span>
              </div>
              <p className="text-sm text-muted-foreground">After trial period</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Coins className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm">Earn coins by watching ads</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">1 generation per ad (≈30s)</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">All AI models available</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Basic templates</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Code export</span>
                </li>
                <li className="flex items-center space-x-3">
                  <X className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">No priority support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <X className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">No premium templates</span>
                </li>
              </ul>
              
              <Button variant="secondary" className="w-full" size="lg" data-testid="button-continue-free">
                Continue Free
              </Button>
              
              <div className="bg-secondary/30 rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2">Coin System</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>15 coins per ad</div>
                  <div>10-50 coins per generation</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-2 border-primary shadow-lg" data-testid="plan-pro">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-accent text-accent-foreground px-4 py-1">
                <Star className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-2xl font-bold">Pro</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">$4.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">Billed monthly, cancel anytime</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Infinity className="h-4 w-4 text-primary" />
                  <span className="text-sm">Unlimited generations</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Bolt className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm">Priority AI processing</span>
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
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Early access to new features</span>
                </li>
              </ul>
              
              <Button asChild className="w-full" size="lg" data-testid="button-upgrade-pro">
                <Link href="/checkout?plan=pro">
                  Upgrade to Pro
                </Link>
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                30-day money back guarantee
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" data-testid="faq-title">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">How does the free trial work?</h3>
                <p className="text-sm text-muted-foreground">
                  Get unlimited access to all features for 7 days. No credit card required. 
                  After the trial, you can continue with our ad-supported free plan or upgrade to Pro.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">What are coins and how do I earn them?</h3>
                <p className="text-sm text-muted-foreground">
                  Coins are our virtual currency for free users. Watch a 30-second ad to earn 15 coins, 
                  then spend them on AI generations (10-50 coins each depending on complexity).
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Can I cancel my Pro subscription anytime?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! Cancel anytime from your account settings. You'll continue to have Pro access 
                  until the end of your billing period.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Which AI models do you support?</h3>
                <p className="text-sm text-muted-foreground">
                  We support Claude Sonnet 4, Gemini Pro, and GPT-5. Each model has unique strengths 
                  for different types of mod development tasks.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Do you offer educational discounts?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! Students and educators get 50% off Pro plans. Contact support with your 
                  educational email address for verification.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Is my generated code mine to use?</h3>
                <p className="text-sm text-muted-foreground">
                  Absolutely! All code generated through X.AI belongs to you. You can use it 
                  commercially, modify it, or distribute it as you see fit.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="mt-24 bg-card/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Something More?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Looking for enterprise features like team collaboration, custom AI training, 
            or dedicated support? We've got you covered.
          </p>
          <Button variant="outline" size="lg" data-testid="button-contact-enterprise">
            Contact Enterprise Sales
          </Button>
        </div>
      </div>
    </div>
  );
}
