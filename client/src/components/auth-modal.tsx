import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth, validateEmail, validatePassword, validateUsername } from "@/lib/auth";
import { Eye, EyeOff, Mail, User, Lock, Zap } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

export default function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { login, register, isLoggingIn, isRegistering } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (mode === 'register') {
      const usernameValidation = validateUsername(username);
      if (!usernameValidation.isValid) {
        newErrors.username = usernameValidation.errors[0];
      }
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (mode === 'login') {
      login({ email, password }, {
        onSuccess: () => {
          onClose();
          resetForm();
        }
      });
    } else {
      register({ username, email, password }, {
        onSuccess: () => {
          onClose();
          resetForm();
        }
      });
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setErrors({});
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const switchMode = () => {
    resetForm();
    onModeChange(mode === 'login' ? 'register' : 'login');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" data-testid="auth-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-primary" />
            <span>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</span>
          </DialogTitle>
          <DialogDescription>
            {mode === 'login' 
              ? 'Sign in to continue building amazing Minecraft mods'
              : 'Join thousands of creators using X.AI to build their dream mods'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  data-testid="input-username"
                />
              </div>
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                data-testid="input-email"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                data-testid="input-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setShowPassword(!showPassword)}
                data-testid="toggle-password-visibility"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
            {mode === 'register' && (
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters with uppercase, lowercase, and number
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoggingIn || isRegistering}
            data-testid="submit-auth"
          >
            {(isLoggingIn || isRegistering) ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
              </div>
            ) : (
              <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            )}
          </Button>

          <Separator />

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            </span>
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={switchMode}
              data-testid="switch-auth-mode"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </Button>
          </div>

          {mode === 'register' && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-2">🎉 Welcome Bonus</h4>
              <p className="text-xs text-muted-foreground">
                Get 7 days of unlimited AI generations when you create your account!
              </p>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
