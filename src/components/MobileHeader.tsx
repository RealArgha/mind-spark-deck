
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
    <header className="bg-background border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 safe-area-inset-top">
        {showLogo ? (
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-foreground" />
            <span className="text-lg font-semibold text-foreground">
              NeuroDeck
            </span>
          </div>
        ) : (
          <h1 className="text-lg font-medium">{title}</h1>
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
