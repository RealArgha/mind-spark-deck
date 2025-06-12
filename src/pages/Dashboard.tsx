
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Brain, Upload, TrendingUp, Clock, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileHeader from '@/components/MobileHeader';

const Dashboard = () => {
  const stats = [
    { label: 'Cards Studied', value: '47', icon: BookOpen, change: '+12%' },
    { label: 'Streak Days', value: '8', icon: Target, change: '+2' },
    { label: 'Study Time', value: '2.3h', icon: Clock, change: '+0.5h' },
  ];

  const recentDecks = [
    { id: 1, title: 'Biology Chapter 5', cards: 25, lastStudied: '2 hours ago', progress: 75 },
    { id: 2, title: 'Spanish Vocabulary', cards: 40, lastStudied: '1 day ago', progress: 60 },
    { id: 3, title: 'Physics Formulas', cards: 18, lastStudied: '3 days ago', progress: 45 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-purple-50/20">
      <MobileHeader title="Dashboard" showLogo />
      
      <div className="px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {stat.change}
                    </p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/upload" className="block">
              <Button className="w-full bg-gradient-to-r from-primary to-purple-600 touch-target">
                <Upload className="h-4 w-4 mr-2" />
                Upload New Material
              </Button>
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/flashcards" className="block">
                <Button variant="outline" className="w-full touch-target">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Study Cards
                </Button>
              </Link>
              <Link to="/quiz" className="block">
                <Button variant="outline" className="w-full touch-target">
                  <Brain className="h-4 w-4 mr-2" />
                  Take Quiz
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Decks */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Decks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentDecks.map((deck) => (
              <Link key={deck.id} to="/flashcards" className="block">
                <div className="p-4 bg-card rounded-lg border border-border hover:bg-accent/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{deck.title}</h3>
                    <span className="text-xs text-muted-foreground">{deck.lastStudied}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{deck.cards} cards</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full transition-all"
                          style={{ width: `${deck.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{deck.progress}%</span>
                    </div>
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
