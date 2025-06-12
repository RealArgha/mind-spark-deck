
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Brain, Upload, Target, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileHeader from '@/components/MobileHeader';

const Dashboard = () => {
  const stats = [
    { label: 'Cards Studied', value: '47', icon: BookOpen },
    { label: 'Streak Days', value: '8', icon: Target },
    { label: 'Study Time', value: '2.3h', icon: Clock },
  ];

  const recentDecks = [
    { id: 1, title: 'Biology Chapter 5', cards: 25, progress: 75 },
    { id: 2, title: 'Spanish Vocabulary', cards: 40, progress: 60 },
    { id: 3, title: 'Physics Formulas', cards: 18, progress: 45 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title="Dashboard" showLogo />
      
      <div className="px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <stat.icon className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
                <p className="text-lg font-semibold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <Link to="/upload" className="block">
              <Button className="w-full touch-target">
                <Upload className="h-4 w-4 mr-2" />
                Upload Material
              </Button>
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/flashcards" className="block">
                <Button variant="outline" className="w-full touch-target">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Study
                </Button>
              </Link>
              <Link to="/quiz" className="block">
                <Button variant="outline" className="w-full touch-target">
                  <Brain className="h-4 w-4 mr-2" />
                  Quiz
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Decks */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Decks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentDecks.map((deck) => (
              <Link key={deck.id} to="/flashcards" className="block">
                <div className="p-3 border border-border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-sm">{deck.title}</h3>
                    <span className="text-xs text-muted-foreground">{deck.cards} cards</span>
                  </div>
                  <div className="w-full h-1 bg-muted rounded-full">
                    <div 
                      className="h-full bg-foreground rounded-full"
                      style={{ width: `${deck.progress}%` }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
