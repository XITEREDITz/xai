import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import { Code, Zap, Sparkles, Star, Play, PlayCircle, ArrowRight, Coins, Clock, Infinity, Bolt, Headset, Check, Timer, WandSparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative" data-testid="hero-section">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6" data-testid="hero-title">
              Build Minecraft Mods
              <span className="block bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">with AI Power</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8" data-testid="hero-description">
              Create custom Minecraft plugins and mods using Claude Sonnet, Gemini, and GPT models. 
              No coding experience required - just drag, drop, and deploy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3" data-testid="button-start-trial">
                <Link href="/builder">
                  <Play className="mr-2 h-4 w-4" />
                  Start 7-Day Free Trial
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3" data-testid="button-watch-demo">
                <PlayCircle className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            {/* AI Models Showcase */}
            <div className="flex justify-center items-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2" data-testid="ai-model-claude">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span>Claude Sonnet 4</span>
              </div>
              <div className="flex items-center space-x-2" data-testid="ai-model-gemini">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Gemini Pro</span>
              </div>
              <div className="flex items-center space-x-2" data-testid="ai-model-gpt">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>GPT-4</span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative max-w-5xl mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm border border-border" data-testid="hero-demo-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">X.AI Builder v2.1</div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Visual Builder Preview */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-primary mb-3">Visual Builder</h3>
                    <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-card rounded-lg border border-border" data-testid="component-custom-block">
                        <Code className="text-primary h-4 w-4" />
                        <span className="text-sm">Custom Block</span>
                        <div className="ml-auto text-muted-foreground">⋮⋮</div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-card rounded-lg border border-border" data-testid="component-magic-weapon">
                        <Zap className="text-accent h-4 w-4" />
                        <span className="text-sm">WandSparkles Weapon</span>
                        <div className="ml-auto text-muted-foreground">⋮⋮</div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-card rounded-lg border border-border" data-testid="component-custom-command">
                        <Sparkles className="text-blue-400 h-4 w-4" />
                        <span className="text-sm">Custom Command</span>
                        <div className="ml-auto text-muted-foreground">⋮⋮</div>
                      </div>
                    </div>
                  </div>

                  {/* Generated Code Preview */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-primary mb-3">Generated Java Code</h3>
                    <div className="bg-secondary/50 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                      <div className="text-green-400">// Generated by X.AI Claude Sonnet 4</div>
                      <div className="text-blue-400">@Override</div>
                      <div><span className="text-purple-400">public void</span> <span className="text-yellow-400">onBlockPlace</span>(<span className="text-blue-300">BlockPlaceEvent</span> event) {"{"}</div>
                      <div className="ml-4 text-muted-foreground">Player player = event.getPlayer();</div>
                      <div className="ml-4 text-muted-foreground">Block block = event.getBlock();</div>
                      <div className="ml-4 text-green-400">// Custom logic here...</div>
                      <div>{"}"}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Models Section */}
      <section className="py-20 bg-card/30" data-testid="ai-models-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" data-testid="section-title-ai-models">Powered by Leading AI Models</h2>
            <p className="text-xl text-muted-foreground">Choose the perfect AI assistant for your mod development needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Claude Sonnet */}
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1" data-testid="card-claude-sonnet">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="text-accent h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Claude Sonnet 4</h3>
                <p className="text-muted-foreground mb-4">Advanced reasoning for complex mod logic and game mechanics</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Check className="text-primary h-4 w-4" />
                    <span>Complex plugin architecture</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="text-primary h-4 w-4" />
                    <span>Advanced event handling</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="text-primary h-4 w-4" />
                    <span>Performance optimization</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gemini */}
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1" data-testid="card-gemini">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="text-blue-400 h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Gemini Pro</h3>
                <p className="text-muted-foreground mb-4">Versatile AI for rapid prototyping and creative solutions</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Check className="text-primary h-4 w-4" />
                    <span>Rapid code generation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="text-primary h-4 w-4" />
                    <span>Creative mod concepts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="text-primary h-4 w-4" />
                    <span>Multi-language support</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* GPT */}
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1" data-testid="card-gpt">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Code className="text-green-400 h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">GPT-4 & GPT-4o</h3>
                <p className="text-muted-foreground mb-4">Reliable code generation with extensive Minecraft knowledge</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Check className="text-primary h-4 w-4" />
                    <span>Bukkit/Spigot expertise</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="text-primary h-4 w-4" />
                    <span>Forge/Fabric knowledge</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="text-primary h-4 w-4" />
                    <span>Best practices</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20" data-testid="pricing-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" data-testid="section-title-pricing">Simple, Affordable Pricing</h2>
            <p className="text-xl text-muted-foreground">Start free, then choose a plan that works for you</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Trial */}
            <Card className="relative" data-testid="card-free-trial">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  7 Days Free
                </div>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Free Trial</h3>
                  <div className="text-4xl font-bold mb-2">$0</div>
                  <div className="text-muted-foreground">First 7 days</div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <Check className="text-primary h-4 w-4" />
                    <span className="text-sm">Unlimited AI generations</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="text-primary h-4 w-4" />
                    <span className="text-sm">All AI models included</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="text-primary h-4 w-4" />
                    <span className="text-sm">Template library access</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="text-primary h-4 w-4" />
                    <span className="text-sm">Code export & documentation</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="text-primary h-4 w-4" />
                    <span className="text-sm">Community support</span>
                  </li>
                </ul>
                <Button asChild className="w-full" data-testid="button-start-free-trial">
                  <Link href="/builder">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Ad-Supported */}
            <Card data-testid="card-ad-supported">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Ad-Supported</h3>
                  <div className="text-4xl font-bold mb-2">Free</div>
                  <div className="text-muted-foreground">After trial period</div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <Coins className="text-yellow-400 h-4 w-4" />
                    <span className="text-sm">Earn coins by watching ads</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Clock className="text-blue-400 h-4 w-4" />
                    <span className="text-sm">1 generation per ad (≈30s)</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="text-primary h-4 w-4" />
                    <span className="text-sm">All AI models available</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="text-primary h-4 w-4" />
                    <span className="text-sm">Basic templates</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Timer className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm text-muted-foreground">No priority support</span>
                  </li>
                </ul>
                <Button variant="secondary" className="w-full" data-testid="button-continue-free">
                  Continue Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative border-2 border-primary shadow-lg" data-testid="card-pro-plan">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Pro</h3>
                  <div className="text-4xl font-bold mb-2">$4.99</div>
                  <div className="text-muted-foreground">/month</div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <Infinity className="text-primary h-4 w-4" />
                    <span className="text-sm">Unlimited generations</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Bolt className="text-yellow-400 h-4 w-4" />
                    <span className="text-sm">Priority AI processing</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="text-primary h-4 w-4" />
                    <span className="text-sm">Premium templates</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="text-primary h-4 w-4" />
                    <span className="text-sm">Advanced code optimization</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Headset className="text-blue-400 h-4 w-4" />
                    <span className="text-sm">Priority support</span>
                  </li>
                </ul>
                <Button asChild className="w-full" data-testid="button-upgrade-pro">
                  <Link href="/pricing">Upgrade to Pro</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Coin System Explanation */}
          <Card className="mt-16 max-w-4xl mx-auto bg-secondary/30" data-testid="coin-system-explanation">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="text-yellow-400 h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">How the Coin System Works</h3>
                <p className="text-muted-foreground">Earn coins by watching ads and spend them on AI generations</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">15</div>
                  <div className="text-sm text-muted-foreground">Coins per 30s ad</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-accent">10-50</div>
                  <div className="text-sm text-muted-foreground">Coins per generation</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-400">1,000</div>
                  <div className="text-sm text-muted-foreground">Daily bonus coins</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10" data-testid="cta-section">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">Ready to Build Your Dream Mod?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of creators using X.AI to bring their Minecraft ideas to life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8 py-3" data-testid="button-start-building">
              <Link href="/builder">
                <WandSparkles className="mr-2 h-4 w-4" />
                Start Building Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-3" data-testid="button-view-templates">
              <Link href="/templates">
                View Templates
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Code className="text-primary-foreground h-4 w-4" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">X.AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The most advanced AI-powered Minecraft mod builder. Create amazing plugins and mods with zero coding experience.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/builder" className="hover:text-foreground transition-colors">Visual Builder</Link></li>
                <li><a href="#" className="hover:text-foreground transition-colors">AI Models</a></li>
                <li><Link href="/templates" className="hover:text-foreground transition-colors">Templates</Link></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Code Export</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground">
              © 2024 X.AI. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 00-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 00-5.487 0 12.36 12.36 0 00-.617-1.23A.077.077 0 008.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 00-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 00.031.055 20.03 20.03 0 005.993 2.98.078.078 0 00.084-.026 13.83 13.83 0 001.226-1.963.074.074 0 00-.041-.104 13.201 13.201 0 01-1.872-.878.075.075 0 01-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 01.078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 01.079.009c.12.098.245.195.372.288a.075.075 0 01-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 00-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 00.084.028 19.963 19.963 0 006.002-2.981.076.076 0 00.032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 00-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
