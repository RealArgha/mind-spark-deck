
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import MobileHeader from '@/components/MobileHeader';

interface FlashcardInput {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const CreateFlashcardsPage = () => {
  const [setName, setSetName] = useState('');
  const [cards, setCards] = useState<FlashcardInput[]>([
    { id: '1', front: '', back: '', difficulty: 'medium' }
  ]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const addCard = () => {
    const newCard: FlashcardInput = {
      id: Date.now().toString(),
      front: '',
      back: '',
      difficulty: 'medium'
    };
    setCards([...cards, newCard]);
  };

  const removeCard = (id: string) => {
    if (cards.length > 1) {
      setCards(cards.filter(card => card.id !== id));
    }
  };

  const updateCard = (id: string, field: keyof FlashcardInput, value: string) => {
    setCards(cards.map(card => 
      card.id === id ? { ...card, [field]: value } : card
    ));
  };

  const saveFlashcardSet = () => {
    if (!setName.trim()) {
      toast({
        title: "Set name required",
        description: "Please enter a name for your flashcard set.",
        variant: "destructive",
      });
      return;
    }

    const validCards = cards.filter(card => card.front.trim() && card.back.trim());
    
    if (validCards.length === 0) {
      toast({
        title: "No valid cards",
        description: "Please create at least one card with both front and back content.",
        variant: "destructive",
      });
      return;
    }

    const newSet = {
      id: `custom-${Date.now()}`,
      name: setName,
      cards: validCards.map(card => ({
        ...card,
        id: `card-${card.id}`
      })),
      createdAt: Date.now(),
      source: 'Custom created'
    };

    // Get existing sets
    const existingSets = JSON.parse(localStorage.getItem('flashcardSets') || '[]');
    const updatedSets = [...existingSets, newSet];
    
    localStorage.setItem('flashcardSets', JSON.stringify(updatedSets));

    toast({
      title: "Flashcard set created!",
      description: `Created "${setName}" with ${validCards.length} cards.`,
    });

    navigate('/flashcards');
  };

  return (
    <div className="h-screen bg-gradient-to-br from-background to-purple-50/20 flex flex-col">
      <MobileHeader title="Create Flashcards" showBack />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Flashcard Set Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Enter set name..."
              value={setName}
              onChange={(e) => setSetName(e.target.value)}
              className="mb-4"
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {cards.map((card, index) => (
            <Card key={card.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Card {index + 1}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <select
                      value={card.difficulty}
                      onChange={(e) => updateCard(card.id, 'difficulty', e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                    {cards.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCard(card.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Front (Question)</label>
                  <Textarea
                    placeholder="Enter the question or prompt..."
                    value={card.front}
                    onChange={(e) => updateCard(card.id, 'front', e.target.value)}
                    className="mt-1"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Back (Answer)</label>
                  <Textarea
                    placeholder="Enter the answer or explanation..."
                    value={card.back}
                    onChange={(e) => updateCard(card.id, 'back', e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={addCard}
            variant="outline"
            className="flex-1"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>
          <Button
            onClick={saveFlashcardSet}
            className="flex-1 bg-gradient-to-r from-primary to-purple-600"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Set
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateFlashcardsPage;
