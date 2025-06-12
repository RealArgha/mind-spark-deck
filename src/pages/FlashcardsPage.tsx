
import React, { useState } from 'react';
import FlashcardViewer from '@/components/FlashcardViewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const FlashcardsPage = () => {
  const [isCompleted, setIsCompleted] = useState(false);

  const sampleCards = [
    {
      id: '1',
      front: 'What is the powerhouse of the cell?',
      back: 'The mitochondria is the powerhouse of the cell, responsible for producing ATP through cellular respiration.',
      difficulty: 'easy' as const
    },
    {
      id: '2',
      front: 'Define photosynthesis',
      back: 'Photosynthesis is the process by which plants convert light energy, carbon dioxide, and water into glucose and oxygen.',
      difficulty: 'medium' as const
    },
    {
      id: '3',
      front: 'What is DNA replication?',
      back: 'DNA replication is the process by which DNA makes a copy of itself during cell division, ensuring genetic information is passed to daughter cells.',
      difficulty: 'hard' as const
    },
    {
      id: '4',
      front: 'Explain the difference between mitosis and meiosis',
      back: 'Mitosis produces two identical diploid cells for growth and repair, while meiosis produces four genetically different haploid gametes for reproduction.',
      difficulty: 'hard' as const
    },
    {
      id: '5',
      front: 'What is osmosis?',
      back: 'Osmosis is the movement of water molecules across a semi-permeable membrane from an area of low solute concentration to high solute concentration.',
      difficulty: 'medium' as const
    }
  ];

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-purple-50/20">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl">Study Session Complete!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground mb-6">
                Great job! You've reviewed all {sampleCards.length} flashcards in this deck.
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-purple-50/20">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Biology Chapter 5</h1>
          <p className="text-muted-foreground">Review your flashcards using spaced repetition</p>
        </div>

        <FlashcardViewer 
          cards={sampleCards}
          onComplete={() => setIsCompleted(true)}
        />
      </div>
    </div>
  );
};

export default FlashcardsPage;
