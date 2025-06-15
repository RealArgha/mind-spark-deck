import React, { useState, useEffect } from 'react';
import FlashcardViewer from '@/components/FlashcardViewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Plus, FileText, Brain, Calendar, Check, Trash, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileHeader from '@/components/MobileHeader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input'; 
import { useToast } from '@/hooks/use-toast'; // For notifications

const FlashcardsPage = () => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [cards, setCards] = useState([]);
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renamingSetId, setRenamingSetId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const { toast } = useToast();

  // Edit Card Dialog State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editFront, setEditFront] = useState('');
  const [editBack, setEditBack] = useState('');

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
              createdAt: Date.now(),
              source: 'Uploaded Content'
            };
            setFlashcardSets([defaultSet]);
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
        createdAt: Date.now(),
        source: 'Sample Content'
      };
      
      setFlashcardSets([sampleSet]);
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

  const handleBackToSelection = () => {
    setSelectedSetId(null);
    setCards([]);
    setIsCompleted(false);
  };

  const openRenameDialog = (setId: string, currentName: string) => {
    setRenamingSetId(setId);
    setRenameValue(currentName);
    setRenameDialogOpen(true);
  };

  const handleRenameConfirm = () => {
    if (renameValue.trim().length === 0) {
      toast({ title: "Name cannot be empty", variant: "destructive" });
      return;
    }
    const updatedSets = flashcardSets.map((set) =>
      set.id === renamingSetId ? { ...set, name: renameValue } : set
    );
    setFlashcardSets(updatedSets);
    localStorage.setItem('flashcardSets', JSON.stringify(updatedSets));
    setRenameDialogOpen(false);
    setRenamingSetId(null);
    setRenameValue('');
    toast({ title: "Set renamed!" });
  };

  const handleAddCard = () => {
    if (!newFront.trim() || !newBack.trim() || !selectedSetId) {
      toast({ title: "Both front and back must be filled.", variant: "destructive" });
      return;
    }
    const updatedSets = flashcardSets.map(set =>
      set.id === selectedSetId
        ? {
            ...set,
            cards: [
              ...set.cards,
              {
                id: `card-${Date.now()}`,
                front: newFront.trim(),
                back: newBack.trim(),
                difficulty: 'medium'
              }
            ]
          }
        : set
    );
    setFlashcardSets(updatedSets);
    localStorage.setItem('flashcardSets', JSON.stringify(updatedSets));
    setAddDialogOpen(false);
    setNewFront('');
    setNewBack('');
    toast({ title: "Flashcard added!" });
    // reload cards if in the set
    const newSet = updatedSets.find(set => set.id === selectedSetId);
    if (newSet) setCards(newSet.cards);
  };

  const handleDeleteCard = (cardId: string) => {
    if (!selectedSetId) return;
    const updatedSets = flashcardSets.map(set => {
      if (set.id !== selectedSetId) return set;
      return { ...set, cards: set.cards.filter(card => card.id !== cardId) };
    });
    setFlashcardSets(updatedSets);
    localStorage.setItem('flashcardSets', JSON.stringify(updatedSets));
    toast({ title: "Flashcard deleted." });
    // reload cards if in the set
    const newSet = updatedSets.find(set => set.id === selectedSetId);
    if (newSet) setCards(newSet.cards);
  };

  // Open edit dialog for card
  const openEditDialog = (cardId: string, front: string, back: string) => {
    setEditingCardId(cardId);
    setEditFront(front);
    setEditBack(back);
    setEditDialogOpen(true);
  };

  // Confirm update card
  const handleEditConfirm = () => {
    if (!editingCardId || !editFront.trim() || !editBack.trim() || !selectedSetId) {
      toast({ title: "Both front and back must be filled.", variant: "destructive" });
      return;
    }
    const updatedSets = flashcardSets.map(set =>
      set.id === selectedSetId
        ? {
            ...set,
            cards: set.cards.map(card =>
              card.id === editingCardId
                ? { ...card, front: editFront, back: editBack }
                : card
            )
          }
        : set
    );
    setFlashcardSets(updatedSets);
    localStorage.setItem('flashcardSets', JSON.stringify(updatedSets));
    setEditDialogOpen(false);
    setEditingCardId(null);
    setEditFront('');
    setEditBack('');
    toast({ title: "Flashcard updated!" });
    // reload cards
    const newSet = updatedSets.find(set => set.id === selectedSetId);
    if (newSet) setCards(newSet.cards);
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
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={handleBackToSelection}
                >
                  Choose Different Set
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show set selection
  if (!selectedSetId) {
    return (
      <div className="h-screen bg-gradient-to-br from-background to-purple-50/20 flex flex-col">
        <MobileHeader title="Your Flashcard Sets" showBack />
        <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Choose a flashcard set</h2>
              <p className="text-sm text-muted-foreground">Select from your collection</p>
            </div>
            <Link to="/create-flashcards">
              <Button size="sm" className="bg-gradient-to-r from-primary to-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </Link>
          </div>
          
          {flashcardSets.length === 0 ? (
            <Card className="text-center p-6">
              <CardContent>
                <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Flashcards Available</h3>
                <p className="text-muted-foreground mb-4">
                  Create custom flashcards or upload content to get started.
                </p>
                <div className="space-y-2">
                  <Link to="/create-flashcards">
                    <Button className="w-full bg-gradient-to-r from-primary to-purple-600">
                      Create Custom Cards
                    </Button>
                  </Link>
                  <Link to="/upload">
                    <Button variant="outline" className="w-full">
                      Generate from Content
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {flashcardSets.map((set) => (
                <Card 
                  key={set.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary/20 hover:border-l-primary relative" 
                  onClick={() => handleSetSelect(set.id)}
                >
                  <CardContent className="p-4 flex flex-col">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <h3 className="font-medium text-base">{set.name}</h3>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center space-x-1">
                            <Brain className="h-3 w-3" />
                            <span>{set.cards.length} cards</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(set.createdAt).toLocaleDateString()}</span>
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded inline-block">
                          Source: {set.source || 'Unknown'}
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col items-center gap-2">
                        <Button size="sm" variant="ghost" className="text-primary">
                          Study →
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          type="button"
                          onClick={e => { e.stopPropagation(); openRenameDialog(set.id, set.name); }}
                          title="Rename this set"
                          className="text-muted-foreground"
                        >
                          ✏️
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* ------- Rename Dialog ------- */}
          <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename Set</DialogTitle>
              </DialogHeader>
              <Input 
                value={renameValue} 
                onChange={e => setRenameValue(e.target.value)} 
                placeholder="Enter new set name"
                className="mb-4"
                onKeyDown={e => { if (e.key === "Enter") handleRenameConfirm(); }}
                autoFocus
              />
              <DialogFooter>
                <Button onClick={handleRenameConfirm}>Save</Button>
                <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  // --- Show set flashcards view with Add/Delete/Edit options ---
  if (selectedSetId && !isCompleted) {
    return (
      <div className="h-screen bg-gradient-to-br from-background to-purple-50/20 flex flex-col overflow-hidden">
        <MobileHeader title="Your Flashcards" showBack />
        <div className="flex-1 overflow-hidden">
          <div className="p-4 flex flex-col h-full">
            <div className="flex items-center mb-4">
              <Button
                size="sm"
                variant="outline"
                onClick={handleBackToSelection}
                className="mr-3"
              >
                ← Sets
              </Button>
              <h2 className="font-bold text-lg flex-1">
                {
                  flashcardSets.find(s => s.id === selectedSetId)?.name ||
                  'Unknown Set'
                }
              </h2>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setAddDialogOpen(true)}
                title="Add Flashcard"
                className="ml-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Card
              </Button>
            </div>

            {/* Cards Table / List with Edit & Delete */}
            <div className="flex-1 overflow-y-auto">
              {cards.length === 0 ? (
                <div className="text-center text-muted-foreground py-10">
                  No flashcards found in this set.
                </div>
              ) : (
                <div className="grid gap-3">
                  {cards.map(card => (
                    <Card key={card.id} className="relative group flex flex-col sm:flex-row">
                      <CardContent className="flex-1 flex flex-col sm:flex-row justify-between w-full p-4 gap-3">
                        <div className="mb-2 sm:mb-0 flex-1">
                          <div className="text-sm font-semibold text-slate-900 mb-1">Front:</div>
                          <div className="break-words text-base">{card.front}</div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-slate-900 mb-1">Back:</div>
                          <div className="break-words text-base">{card.back}</div>
                        </div>
                        <div className="flex flex-col items-center justify-center ml-2 gap-2">
                          {/* Edit button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Edit this card"
                            onClick={() => openEditDialog(card.id, card.front, card.back)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {/* Delete button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete this card"
                            onClick={() => handleDeleteCard(card.id)}
                            className="text-destructive"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* ADD CARD DIALOG */}
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Flashcard</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <Input
                  placeholder="Front (Question)"
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  autoFocus
                />
                <Input
                  className="mt-2"
                  placeholder="Back (Answer)"
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button onClick={handleAddCard}>
                  Add
                </Button>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* EDIT CARD DIALOG */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Flashcard</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <Input
                  placeholder="Front (Question)"
                  value={editFront}
                  onChange={e => setEditFront(e.target.value)}
                  autoFocus
                />
                <Input
                  className="mt-2"
                  placeholder="Back (Answer)"
                  value={editBack}
                  onChange={e => setEditBack(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button onClick={handleEditConfirm}>
                  Save
                </Button>
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  // --- FlashcardViewer (Study Mode) ---
  if (selectedSetId && cards.length > 0 && !isCompleted) {
    return (
      <FlashcardViewer
        cards={cards}
        onComplete={() => setIsCompleted(true)}
      />
    );
  }

  return (
    <div>
      Error.
    </div>
  );
};

export default FlashcardsPage;
