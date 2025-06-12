
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Volume2 } from 'lucide-react';

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

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

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
    <div className="max-w-2xl mx-auto p-4">
      {/* Progress Bar */}
      <div className="mb-6">
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

      {/* Flashcard */}
      <div className="relative h-96 mb-6 perspective-1000">
        <Card 
          className={`absolute inset-0 cursor-pointer transition-transform duration-500 transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={handleFlip}
        >
          {/* Front */}
          <CardContent className="h-full flex items-center justify-center p-8 backface-hidden">
            <div className="text-center">
              <p className="text-xl font-medium leading-relaxed">{currentCard.front}</p>
              <p className="text-sm text-muted-foreground mt-4">Click to reveal answer</p>
            </div>
          </CardContent>
          
          {/* Back */}
          <CardContent className="absolute inset-0 h-full flex items-center justify-center p-8 backface-hidden rotate-y-180 bg-gradient-to-br from-primary/5 to-purple-600/5">
            <div className="text-center">
              <p className="text-xl font-medium leading-relaxed text-primary">{currentCard.back}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  speakText(currentCard.back);
                }}
                className="mt-4"
              >
                <Volume2 className="h-4 w-4 mr-2" />
                Listen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <Button variant="ghost" onClick={() => setIsFlipped(false)}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>

        <Button 
          onClick={handleNext}
          className="bg-gradient-to-r from-primary to-purple-600"
        >
          {currentIndex === cards.length - 1 ? 'Complete' : 'Next'}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Difficulty Rating (when flipped) */}
      {isFlipped && (
        <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-3">How difficult was this card?</p>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-green-600">Easy</Button>
            <Button variant="outline" size="sm" className="text-yellow-600">Medium</Button>
            <Button variant="outline" size="sm" className="text-red-600">Hard</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardViewer;
