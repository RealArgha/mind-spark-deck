
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Brain, TrendingUp, Clock, Plus, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Dashboard = () => {
  const stats = [
    { label: "Total Cards Studied", value: "847", icon: BookOpen, color: "text-blue-600" },
    { label: "Current Streak", value: "12 days", icon: TrendingUp, color: "text-green-600" },
    { label: "Cards Due Today", value: "23", icon: Clock, color: "text-orange-600" },
    { label: "Mastery Rate", value: "78%", icon: Brain, color: "text-purple-600" }
  ];

  const recentDecks = [
    { id: 1, name: "Biology Chapter 5", cards: 25, mastered: 18, dueToday: 5 },
    { id: 2, name: "Spanish Vocabulary", cards: 50, mastered: 32, dueToday: 8 },
    { id: 3, name: "Computer Science Algorithms", cards: 35, mastered: 22, dueToday: 10 },
    { id: 4, name: "History - World War II", cards: 40, mastered: 35, dueToday: 0 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-purple-50/20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Alex!</h1>
            <p className="text-muted-foreground">Ready to continue your learning journey?</p>
          </div>
          <Link to="/upload">
            <Button className="bg-gradient-to-r from-primary to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Create New Deck
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Study</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/flashcards">
                <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                  <BookOpen className="h-6 w-6" />
                  <span>Review Due Cards</span>
                  <span className="text-xs text-muted-foreground">23 cards waiting</span>
                </Button>
              </Link>
              <Link to="/quiz">
                <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                  <Brain className="h-6 w-6" />
                  <span>Take Quiz</span>
                  <span className="text-xs text-muted-foreground">Test your knowledge</span>
                </Button>
              </Link>
              <Link to="/upload">
                <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                  <Plus className="h-6 w-6" />
                  <span>Add Content</span>
                  <span className="text-xs text-muted-foreground">Upload new material</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Decks */}
        <Card>
          <CardHeader>
            <CardTitle>Your Study Decks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDecks.map((deck) => (
                <div key={deck.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{deck.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{deck.cards} cards</span>
                      <span>{deck.mastered} mastered</span>
                      {deck.dueToday > 0 && (
                        <span className="text-orange-600 font-medium">
                          {deck.dueToday} due today
                        </span>
                      )}
                    </div>
                    <Progress 
                      value={(deck.mastered / deck.cards) * 100} 
                      className="w-48 mt-2"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Link to="/flashcards">
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Study
                      </Button>
                    </Link>
                    <Link to="/quiz">
                      <Button variant="outline" size="sm">
                        Quiz
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
