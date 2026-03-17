import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../hooks/useAppStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { Shield, Truck, Server } from 'lucide-react';

const demoAccounts = [
  { username: 'admin', password: 'admin', role: 'admin', label: 'Admin', description: 'Full access to all sections and settings', icon: Shield, colorBg: 'bg-brand-primary-light', colorText: 'text-brand-primary' },
  { username: 'delivery', password: 'delivery', role: 'delivery', label: 'Delivery', description: 'Business sections (contacts, licenses, tickets, notes)', icon: Truck, colorBg: 'bg-brand-success-light', colorText: 'text-brand-success' },
  { username: 'devops', password: 'devops', role: 'devops', label: 'DevOps', description: 'Technical sections (VPN, connections, servers, updates)', icon: Server, colorBg: 'bg-brand-warning-light', colorText: 'text-brand-warning' },
];

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quickLoginUser, setQuickLoginUser] = useState<string | null>(null);
  const navigate = useNavigate();
  const { actions } = useAppStore('auth');

  const handleLogin = async (user?: string, pass?: string) => {
    const u = user ?? username;
    const p = pass ?? password;
    
    if (!u || !p) {
      toast.error('Please enter username and password');
      return;
    }

    setIsLoading(true);
    if (user) setQuickLoginUser(user);
    try {
      const result = await actions.login(u, p);
      if (result.success) {
        toast.success(`Welcome, ${result.data.username}! (${result.data.role})`);
        navigate('/');
      } else {
        toast.error(result.error.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
      setQuickLoginUser(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-primary-light to-brand-secondary-light p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-brand-main">Client Management System</CardTitle>
            <CardDescription>Sign in to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && !quickLoginUser ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Quick-Login */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-brand-main">Demo Accounts</CardTitle>
            <CardDescription className="text-xs">
              Click to sign in instantly as a specific role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {demoAccounts.map((account) => {
              const Icon = account.icon;
              const isThisLoading = isLoading && quickLoginUser === account.username;
              return (
                <button
                  key={account.username}
                  onClick={() => handleLogin(account.username, account.password)}
                  disabled={isLoading}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent hover:border-brand-secondary/30 transition-colors disabled:opacity-50 text-left"
                >
                  <div className={`${account.colorBg} p-2 rounded-lg flex-shrink-0`}>
                    <Icon className={`h-4 w-4 ${account.colorText}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground">
                        {isThisLoading ? 'Signing in...' : account.label}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {account.role}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{account.description}</p>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Test credentials info */}
        <div className="p-4 bg-brand-primary-light rounded-lg border border-brand-secondary">
          <p className="text-sm text-brand-main mb-2">Demo credentials:</p>
          <div className="text-xs text-brand-primary space-y-1">
            <p>Username and password are the same as the role name</p>
            <p>e.g. admin/admin, delivery/delivery, devops/devops</p>
          </div>
        </div>
      </div>
    </div>
  );
}
