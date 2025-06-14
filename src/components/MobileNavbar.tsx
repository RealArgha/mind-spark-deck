
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Home, Upload, Brain, CreditCard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MobileNavbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/upload', icon: Upload, label: 'Upload' },
    { path: '/flashcards', icon: BookOpen, label: 'Cards' },
    { path: '/quiz', icon: Brain, label: 'Quiz' },
    { path: '/subscription', icon: CreditCard, label: 'Premium' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center py-2 px-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link key={path} to={path} className="flex-1">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full flex flex-col items-center gap-1 h-auto py-3 px-2 ${
                location.pathname === path 
                  ? 'text-indigo-600 bg-indigo-50/80' 
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavbar;
