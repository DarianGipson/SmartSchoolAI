import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please fill in all fields.",
      });
      setIsLoading(false);
      return;
    }

    // Simulate API call / localStorage login
    try {
      const success = await login(email, password);

      if (success) {
        toast({
          title: "Login Successful!",
          description: "Welcome back! Redirecting you now...",
        });
        // Navigation is handled in AuthContext login
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
        });
      }
    } catch (error) {
      let description = error.message || "An unexpected error occurred.";
      if (error.code === 'auth/invalid-login-credentials' || error.code === 'auth/wrong-password') {
        description = "Invalid email or password.";
      } else if (error.code === 'auth/user-not-found') {
        description = "No account found with this email.";
      }
      toast({
        variant: "destructive",
        title: "Login Error",
        description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-12"
    >
      <Card className="w-full max-w-md shadow-2xl rounded-2xl border-smartSchool-blue/30">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-smartSchool-blue">Parent Login</CardTitle>
          <CardDescription>Access your SmartSchool AI parent dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 rounded-lg text-lg p-4"
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 rounded-lg text-lg p-4"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-smartSchool-blue hover:bg-smartSchool-blue/90 text-white font-semibold py-3 text-lg rounded-xl" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-smartSchool-red hover:underline">
              Sign up here
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Student login?{' '}
            <Button variant="link" className="p-0 h-auto text-smartSchool-yellow hover:underline">
              Click here for Student PIN Login (Coming Soon!)
            </Button>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default LoginPage;