
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            NeuroDeck
          </span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link to="/upload">
            <Button variant="ghost">Upload</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
