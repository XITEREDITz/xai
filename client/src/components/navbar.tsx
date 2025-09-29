import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AuthModal from "@/components/auth-modal";
import CoinDisplay from "@/components/coin-display";
import AdModal from "@/components/ad-modal";
import { 
  Code, 
  Menu, 
  User, 
  LogOut, 
  Settings, 
  HelpCircle,
  Coins,
  Play
} from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/logout"),
    onSuccess: () => {
      queryClient.setQueryData(['/api/auth/me'], null);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleSignUp = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    { href: "/", label: "Home", active: location === "/" },
    { href: "/builder", label: "Builder", active: location.startsWith("/builder") },
    { href: "/templates", label: "Templates", active: location === "/templates" },
    { href: "/pricing", label: "Pricing", active: location === "/pricing" },
  ];

  const user = userData?.user;

  return (
    <>
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50" data-testid="navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2" data-testid="logo">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Code className="text-primary-foreground h-4 w-4" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                X.AI
              </span>
              <Badge variant="secondary" className="text-xs">BETA</Badge>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm transition-colors ${
                    item.active 
                      ? "text-foreground font-medium" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`nav-link-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Coin Display */}
              {user && (
                <CoinDisplay onEarnCoins={() => setShowAdModal(true)} />
              )}

              {/* User Menu or Auth Buttons */}
              {userLoading ? (
                <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full" data-testid="user-menu">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.username}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/builder" className="cursor-pointer">
                        <Code className="mr-2 h-4 w-4" />
                        <span>Builder</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowAdModal(true)}>
                      <Coins className="mr-2 h-4 w-4" />
                      <span>Earn Coins</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Help</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} data-testid="logout-button">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" onClick={handleLogin} data-testid="login-button">
                    Log In
                  </Button>
                  <Button onClick={handleSignUp} data-testid="signup-button">
                    <Play className="mr-2 h-4 w-4" />
                    Start Building
                  </Button>
                </div>
              )}

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className="md:hidden"
                    size="sm"
                    data-testid="mobile-menu-trigger"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-4">
                    {/* Mobile Navigation */}
                    <div className="space-y-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                            item.active 
                              ? "bg-primary text-primary-foreground" 
                              : "hover:bg-muted"
                          }`}
                          data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    {/* Mobile Auth/User Section */}
                    {!user ? (
                      <div className="space-y-2 pt-4 border-t">
                        <Button variant="outline" onClick={handleLogin} className="w-full">
                          Log In
                        </Button>
                        <Button onClick={handleSignUp} className="w-full">
                          <Play className="mr-2 h-4 w-4" />
                          Start Building
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {user.username?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.username}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        
                        <CoinDisplay showDetails onEarnCoins={() => setShowAdModal(true)} />
                        
                        <div className="space-y-1">
                          <Button variant="outline" onClick={() => setShowAdModal(true)} className="w-full justify-start">
                            <Coins className="mr-2 h-4 w-4" />
                            Earn Coins
                          </Button>
                          <Button variant="outline" disabled className="w-full justify-start">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </Button>
                          <Button variant="outline" onClick={handleLogout} className="w-full justify-start">
                            <LogOut className="mr-2 h-4 w-4" />
                            Log Out
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />

      {/* Ad Modal */}
      <AdModal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        onAdCompleted={() => {
          setShowAdModal(false);
          queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
        }}
      />
    </>
  );
}
