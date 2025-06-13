
import React from 'react';
import { BookOpen, Menu, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface MobileHeaderProps {
  title?: string;
  showLogo?: boolean;
  showBack?: boolean;
  onMenuClick?: () => void;
}

const MobileHeader = ({ title, showLogo = false, showBack = false, onMenuClick }: MobileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3 safe-area-inset-top">
        <div className="flex items-center space-x-3">
          {showBack && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          {showLogo ? (
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-indigo-600" />
              <span className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                NeuroDeck
              </span>
            </div>
          ) : (
            <h1 className="text-lg font-medium text-slate-800">{title}</h1>
          )}
        </div>
        
        {onMenuClick && (
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="h-8 w-8">
            <Menu className="h-4 w-4" />
          </Button>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;
