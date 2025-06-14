
import React, { useState, useEffect } from 'react';
import FlashcardViewer from '@/components/FlashcardViewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileHeader from '@/components/MobileHeader';

const FlashcardsPage = () => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [cards, setCards] = useState([]);
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);

  useEffect(() => {
    // Load all flashcard sets from localStorage
    const storedSets = localStorage.getItem('flashcardSets');
    let sets = [];
    
    if (storedSets) {
      try {
        sets = JSON.parse(storedSets);
        setFlashcardSets(sets);
        
        // If there's a selected set, load its cards
        if (selectedSetId) {
          const selectedSet = sets.find(set => set.id === selectedSetId);
          if (selectedSet) {
            setCards(selectedSet.cards);
          }
        } else if (sets.length > 0) {
          // Auto-select first set if none selected
          setSelectedSetId(sets[0].id);
          setCards(sets[0].cards);
        }
      } catch (error) {
        console.error('Error parsing stored flashcard sets:', error);
      }
    }
    
    // Fallback: Load old single set for backward compatibility
    if (sets.length === 0) {
      const storedCards = localStorage.getItem('generatedFlashcards');
      if (storedCards) {
        try {
          const parsedCards = JSON.parse(storedCards);
          if (Array.isArray(parsedCards) && parsedCards.length > 0) {
            const defaultSet = {
              id: 'default',
              name: 'Generated Flashcards',
              cards: parsedCards,
              createdAt: Date.now()
            };
            setFlashcardSets([defaultSet]);
            setSelectedSetId('default');
            setCards(parsedCards);
            // Save to new format
            localStorage.setItem('flashcardSets', JSON.stringify([defaultSet]));
            return;
          }
        } catch (error) {
          console.error('Error parsing stored flashcards:', error);
        }
      }
      
      // Final fallback to sample cards
      const sampleCards = [
        {
          id: '1',
          front: 'What is the powerhouse of the cell?',
          back: 'The mitochondria is the powerhouse of the cell, responsible for producing ATP through cellular respiration.',
          difficulty: 'easy'
        },
        {
          id: '2',
          front: 'Define photosynthesis',
          back: 'Photosynthesis is the process by which plants convert light energy, carbon dioxide, and water into glucose and oxygen.',
          difficulty: 'medium'
        }
      ];
      
      const sampleSet = {
        id: 'sample',
        name: 'Sample Biology Cards',
        cards: sampleCards,
        createdAt: Date.now()
      };
      
      setFlashcardSets([sampleSet]);
      setSelectedSetId('sample');
      setCards(sampleCards);
      localStorage.setItem('flashcardSets', JSON.stringify([sampleSet]));
    }
  }, [selectedSetId]);

  const handleSetSelect = (setId: string) => {
    const selectedSet = flashcardSets.find(set => set.id === setId);
    if (selectedSet) {
      setSelectedSetId(setId);
      setCards(selectedSet.cards);
      setIsCompleted(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="h-screen bg-gradient-to-br from-background to-purple-50/20 flex flex-col">
        <MobileHeader title="Study Complete" showBack />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Study Session Complete!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Great job! You've reviewed all {cards.length} flashcards in this deck.
              </p>
              <div className="space-y-3">
                <Link to="/dashboard">
                  <Button className="w-full bg-gradient-to-r from-primary to-purple-600">
                    Back to Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsCompleted(false)}
                >
                  Study Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show set selection if multiple sets available
  if (flashcardSets.length > 1 && !selectedSetId) {
    return (
      <div className="h-screen bg-gradient-to-br from-background to-purple-50/20 flex flex-col">
        <MobileHeader title="Your Flashcard Sets" showBack />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Choose a flashcard set</h2>
            <Link to="/create-flashcards">
              <Button size="sm" className="bg-gradient-to-r from-primary to-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {flashcardSets.map((set) => (
              <Card key={set.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleSetSelect(set.id)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{set.name}</h3>
                      <p className="text-sm text-muted-foreground">{set.cards.length} cards</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(set.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-background to-purple-50/20 flex flex-col overflow-hidden">
      <MobileHeader title="Your Flashcards" showBack />
      <div className="flex-1 overflow-hidden">
        <FlashcardViewer 
          cards={cards}
          onComplete={() => setIsCompleted(true)}
        />
      </div>
    </div>
  );
};

export default FlashcardsPage;
