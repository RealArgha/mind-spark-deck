
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Home, Upload, Brain, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MobileNavbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/upload', icon: Upload, label: 'Upload' },
    { path: '/flashcards', icon: BookOpen, label: 'Cards' },
    { path: '/quiz', icon: Brain, label: 'Quiz' },
    { path: '/login', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex justify-around items-center py-2 px-4 safe-area-inset-bottom">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link key={path} to={path} className="flex-1">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full flex flex-col items-center gap-1 h-auto py-2 ${
                location.pathname === path 
                  ? 'text-foreground' 
                  : 'text-muted-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs">{label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavbar;
