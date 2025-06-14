
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Brain, Zap, Upload, HelpCircle, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OnboardingCard {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
}

const OnboardingScreen = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const cards: OnboardingCard[] = [
    {
      title: "AI-Powered Learning",
      description: "Transform any content into intelligent flashcards automatically using advanced AI technology",
      icon: Brain,
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      title: "Smart Upload",
      description: "Upload PDFs, paste text, or record voice notes - our AI handles the rest seamlessly",
      icon: Upload,
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      title: "Interactive Quizzes",
      description: "Test your knowledge with adaptive quizzes that adjust to your learning pace",
      icon: HelpCircle,
      gradient: "from-green-500 to-emerald-600"
    },
    {
      title: "Spaced Repetition",
      description: "Optimize retention with scientifically-backed spaced repetition algorithms",
      icon: Zap,
      gradient: "from-orange-500 to-red-600"
    }
  ];

  const nextCard = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentCard < cards.length - 1) {
        setCurrentCard(currentCard + 1);
      } else {
        navigate('/auth');
      }
      setIsTransitioning(false);
    }, 150);
  };

  const prevCard = () => {
    if (isTransitioning || currentCard === 0) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentCard(currentCard - 1);
      setIsTransitioning(false);
    }, 150);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right' && currentCard > 0) {
      prevCard();
    } else if (direction === 'left') {
      nextCard();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    (e.currentTarget as any).startX = touch.clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const startX = (e.currentTarget as any).startX;
    const diffX = startX - touch.clientX;
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        handleSwipe('left');
      } else {
        handleSwipe('right');
      }
    }
  };

  const currentCardData = cards[currentCard];
  const Icon = currentCardData.icon;
  const isLastCard = currentCard === cards.length - 1;

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-center pt-8 pb-4 px-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-indigo-600" />
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            NeuroDeck
          </span>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center space-x-2 mb-6 px-4">
        {cards.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentCard 
                ? 'w-8 bg-indigo-600' 
                : index < currentCard
                ? 'w-2 bg-indigo-400'
                : 'w-2 bg-slate-300'
            }`}
          />
        ))}
      </div>

      {/* Main Card Container with 3D Perspective */}
      <div 
        className="flex-1 px-6 flex items-center justify-center"
        style={{ perspective: '1000px' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full max-w-sm h-96">
          <Card className={`
            absolute inset-0 border-0 shadow-2xl bg-white/90 backdrop-blur-sm 
            transition-all duration-500 ease-out
            ${isTransitioning ? 'scale-95' : 'scale-100'}
            hover:scale-105
          `}
          style={{
            transformStyle: 'preserve-3d',
            transform: isTransitioning ? 'rotateY(12deg)' : 'rotateY(0deg)'
          }}>
            <CardContent className="p-8 h-full flex flex-col items-center justify-center text-center space-y-6">
              {/* Icon */}
              <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${currentCardData.gradient} flex items-center justify-center shadow-lg transform transition-transform duration-300 ${isTransitioning ? 'scale-90' : 'scale-100'}`}>
                <Icon className="h-10 w-10 text-white" />
              </div>

              {/* Title */}
              <h2 className={`text-2xl font-bold text-slate-800 leading-tight transition-opacity duration-300 ${isTransitioning ? 'opacity-70' : 'opacity-100'}`}>
                {currentCardData.title}
              </h2>

              {/* Description */}
              <p className={`text-slate-600 leading-relaxed text-base transition-opacity duration-300 ${isTransitioning ? 'opacity-70' : 'opacity-100'}`}>
                {currentCardData.description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevCard}
          disabled={currentCard === 0 || isTransitioning}
          className="text-slate-500 disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        <div className="flex space-x-1">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => !isTransitioning && setCurrentCard(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentCard ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>

        <Button
          size="sm"
          onClick={nextCard}
          disabled={isTransitioning}
          className={`${
            isLastCard 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white px-3 py-1 text-sm`}
        >
          {isLastCard ? 'Start Learning' : 'Next'}
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Swipe Hint */}
      {currentCard === 0 && (
        <div className="absolute bottom-20 left-0 right-0 text-center">
          <p className="text-sm text-slate-400 animate-pulse">
            Swipe left or right to navigate
          </p>
        </div>
      )}
    </div>
  );
};

export default OnboardingScreen;
