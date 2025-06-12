
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <nav className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-foreground" />
          <span className="text-xl font-semibold text-foreground">
            NeuroDeck
          </span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <Link to="/upload" className="text-sm text-muted-foreground hover:text-foreground">
            Upload
          </Link>
          <Link to="/login">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
