
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Volume2 } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import AdBanner from '@/components/AdBanner';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface FlashcardViewerProps {
  cards: Flashcard[];
  onComplete?: () => void;
}

const FlashcardViewer = ({ cards, onComplete }: FlashcardViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCards, setReviewedCards] = useState<Set<string>>(new Set());
  const { subscribed, trial_active } = useSubscription();

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;
  const showAds = !subscribed && !trial_active;

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else if (onComplete) {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setReviewedCards(prev => new Set([...prev, currentCard.id]));
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!currentCard) return null;

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4">
      {/* Show ad before flashcard for trial users */}
      {showAds && currentIndex === 0 && (
        <div className="mb-4">
          <AdBanner slot="1234567890" className="text-center" />
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Card {currentIndex + 1} of {cards.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard - Fixed height to prevent overflow */}
      <div className="relative flex-1 mb-4 max-h-80 perspective-1000">
        <Card 
          className={`absolute inset-0 cursor-pointer transition-transform duration-500 transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={handleFlip}
        >
          {/* Front */}
          <CardContent className="h-full flex items-center justify-center p-6 backface-hidden">
            <div className="text-center">
              <p className="text-lg font-medium leading-relaxed">{currentCard.front}</p>
              <p className="text-xs text-muted-foreground mt-3">Tap to reveal answer</p>
            </div>
          </CardContent>
          
          {/* Back */}
          <CardContent className="absolute inset-0 h-full flex items-center justify-center p-6 backface-hidden rotate-y-180 bg-gradient-to-br from-primary/5 to-purple-600/5">
            <div className="text-center">
              <p className="text-lg font-medium leading-relaxed text-primary">{currentCard.back}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  speakText(currentCard.back);
                }}
                className="mt-3"
              >
                <Volume2 className="h-4 w-4 mr-2" />
                Listen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          size="sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <Button variant="ghost" onClick={() => setIsFlipped(false)} size="sm">
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>

        <Button 
          onClick={handleNext}
          className="bg-gradient-to-r from-primary to-purple-600"
          size="sm"
        >
          {currentIndex === cards.length - 1 ? 'Complete' : 'Next'}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Difficulty Rating (when flipped) - Compact */}
      {isFlipped && (
        <div className="p-3 bg-secondary/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-2">How difficult was this card?</p>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-green-600 text-xs px-2 py-1">Easy</Button>
            <Button variant="outline" size="sm" className="text-yellow-600 text-xs px-2 py-1">Medium</Button>
            <Button variant="outline" size="sm" className="text-red-600 text-xs px-2 py-1">Hard</Button>
          </div>
        </div>
      )}

      {/* Show ad after completing flashcard for trial users */}
      {showAds && currentIndex === cards.length - 1 && isFlipped && (
        <div className="mt-4">
          <AdBanner slot="0987654321" className="text-center" />
        </div>
      )}
    </div>
  );
};

export default FlashcardViewer;
