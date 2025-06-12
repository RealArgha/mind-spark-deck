
import React from 'react';
import { BookOpen, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileHeaderProps {
  title?: string;
  showLogo?: boolean;
  onMenuClick?: () => void;
}

const MobileHeader = ({ title, showLogo = false, onMenuClick }: MobileHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 safe-area-inset-top">
        {showLogo ? (
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              NeuroDeck
            </span>
          </div>
        ) : (
          <h1 className="text-lg font-semibold">{title}</h1>
        )}
        
        {onMenuClick && (
          <Button variant="ghost" size="icon" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;
