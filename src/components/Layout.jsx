import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, LayoutDashboard, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import WidgetLauncher from './WidgetLauncher';
import LegalComplianceBanner from './LegalComplianceBanner';

const icons = {
  dashboard: <svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="8" strokeWidth="1.5"/></svg>,
  user: <svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="10" cy="7" r="4" strokeWidth="1.5"/><path d="M4 18c0-3 6-3 6-3s6 0 6 3" strokeWidth="1.5"/></svg>,
  curriculum: <svg width="20" height="20" fill="none" stroke="currentColor"><rect x="4" y="4" width="12" height="12" rx="2" strokeWidth="1.5"/></svg>,
  parent: <svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="6" cy="7" r="2" strokeWidth="1.5"/><circle cx="14" cy="7" r="2" strokeWidth="1.5"/></svg>,
  tools: <svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="8" strokeWidth="1.5"/><line x1="10" y1="6" x2="10" y2="14" strokeWidth="1.5"/></svg>,
  admin: <svg width="20" height="20" fill="none" stroke="currentColor"><rect x="4" y="4" width="12" height="12" rx="2" strokeWidth="1.5"/></svg>,
  widgets: <svg width="20" height="20" fill="none" stroke="currentColor"><rect x="3" y="3" width="5" height="5" rx="1" strokeWidth="1.5"/><rect x="12" y="3" width="5" height="5" rx="1" strokeWidth="1.5"/><rect x="12" y="12" width="5" height="5" rx="1" strokeWidth="1.5"/><rect x="3" y="12" width="5" height="5" rx="1" strokeWidth="1.5"/></svg>,
};

const menuItems = [
  { to: '/dashboard', icon: icons.dashboard, label: 'Dashboard' },
  { to: '/user-home', icon: icons.user, label: 'User Home' },
  { to: '/curriculum', icon: icons.curriculum, label: 'Curriculum' },
  { to: '/parent-dashboard', icon: icons.parent, label: 'Parent Dashboard' },
  { to: '/tools', icon: icons.tools, label: 'Tools' },
  { to: '/admin', icon: icons.admin, label: 'Admin' },
  { to: '/all-widgets', icon: icons.widgets, label: 'All Widgets' },
];

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  return (
    <>
      <LegalComplianceBanner />
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-yellow-100">
        <header className="bg-smartSchool-blue text-white shadow-md sticky top-0 z-50">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center space-x-2"
                >
                  <img src="/images/logo12.png" alt="SmartSchool AI Logo" className="h-12 w-12 rounded bg-white p-1 shadow" />
                  <h1 className="text-3xl font-poppins font-bold tracking-tight">
                    SmartSchool AI
                  </h1>
                </motion.div>
              </Link>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to={user ? "/user-home" : "/"}>
                <Button variant="ghost" className="text-white hover:bg-white/20">
                  <Home size={20} className="mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Home</span>
                </Button>
              </Link>
              {user ? (
                <>
                  <Link to={user.role === 'student' ? "/user-home" : user.role === 'parent' ? "/parent-dashboard" : "/dashboard"}>
                    <Button variant="ghost" className="text-white hover:bg-white/20">
                      <LayoutDashboard size={20} className="mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </Button>
                  </Link>
                  <Link to="/curriculum">
                    <Button variant="ghost" className="text-white hover:bg-white/20">
                      <Home size={20} className="mr-1 sm:mr-2" /> {/* Placeholder icon, change as needed */}
                      <span className="hidden sm:inline">Curriculum</span>
                    </Button>
                  </Link>
                  <Button onClick={handleLogout} variant="destructive" className="bg-smartSchool-red hover:bg-smartSchool-red/90">
                    <LogOut size={20} className="mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                  {user.role === 'admin' && (
                    <Button onClick={() => navigate('/admin')} variant="outline" className="text-white border-white hover:bg-white/10">
                      Admin
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-white hover:bg-white/20">
                      <LogIn size={20} className="mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Login</span>
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-smartSchool-yellow hover:bg-smartSchool-yellow/90 text-smartSchool-blue font-semibold">
                      <UserPlus size={20} className="mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Sign Up</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>

        <main className="flex-grow"> {/* Removed container here to allow full-width sections on landing page */}
          {children}
        </main>

        <div className="flex flex-wrap gap-4 justify-center mt-6 mb-12">
          {user && user.role === 'student' && (
            <div className="fixed bottom-8 left-8 z-50">
              <img src="/images/user-only-icon.png" alt="User Only Icon" className="h-14 w-14 rounded-xl shadow-lg border-4 border-blue-500 bg-white p-2" />
            </div>
          )}
          <Link to="/tools" className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold text-lg shadow hover:bg-blue-600 transition">Tools</Link>
          <Link to="/curriculum" className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-bold text-lg shadow hover:bg-yellow-500 transition">Curriculum</Link>
          <Link to="/progress" className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-lg shadow hover:bg-red-600 transition">Progress</Link>
        </div>

        <footer className="bg-gray-800 text-gray-300 py-10 text-center">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="text-lg font-poppins font-semibold text-white">SmartSchool AI</p>
              <p className="text-sm font-openSans mt-1">
                &copy; {new Date().getFullYear()} SmartSchool AI. Revolutionizing homeschool, one lesson at a time.
              </p>
              <div className="mt-4 space-x-4">
                <Link to="/privacy-policy" className="hover:text-smartSchool-yellow transition-colors">Privacy Policy</Link>
                <Link to="/terms-of-service" className="hover:text-smartSchool-yellow transition-colors">Terms of Service</Link>
                <a href="/Disclaimer.txt" className="hover:text-smartSchool-yellow transition-colors" target="_blank" rel="noopener noreferrer">Disclaimer</a>
                <a href="/ContentModerationPolicy.txt" className="hover:text-smartSchool-yellow transition-colors" target="_blank" rel="noopener noreferrer">Content Moderation</a>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                <a href="/LICENSE" target="_blank" rel="noopener noreferrer">Copyright & License</a>
              </div>
            </motion.div>
          </div>
          <div className="mt-6 text-xs text-gray-400">
            <p>SmartSchool AI complies with COPPA, FERPA, and GDPR. All user data is protected and handled according to strict privacy standards.</p>
          </div>
        </footer>
        <WidgetLauncher />
      </div>
    </>
  );
};

export default Layout;