
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Brain, Upload, Target, Clock, Crown, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileHeader from '@/components/MobileHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { subscribed, subscription_tier } = useSubscription();

  const stats = [
    { label: 'Cards Studied', value: '12', icon: BookOpen },
    { label: 'Study Streak', value: '3', icon: Target },
    { label: 'Time Today', value: '25m', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <MobileHeader title="Dashboard" showLogo />
      
      <div className="px-4 py-6 space-y-6">
        {/* Welcome Card */}
        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}!
                </h2>
                <div className="flex items-center mt-1">
                  {subscribed ? (
                    <div className="flex items-center text-sm text-indigo-600">
                      <Crown className="h-4 w-4 mr-1" />
                      {subscription_tier} Plan
                    </div>
                  ) : (
                    <span className="text-sm text-slate-600">Free Plan</span>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={signOut} className="text-slate-500">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
            
            {!subscribed && (
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Unlock Premium Features</h3>
                    <p className="text-sm opacity-90">Get unlimited flashcards and advanced AI</p>
                  </div>
                  <Link to="/subscription">
                    <Button variant="secondary" size="sm">
                      Upgrade
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <stat.icon className="h-5 w-5 text-indigo-600 mx-auto mb-2" />
                <p className="text-lg font-semibold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4 space-y-3">
            <Link to="/upload" className="block">
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <Upload className="h-4 w-4 mr-2" />
                Upload New Material
              </Button>
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/flashcards" className="block">
                <Button variant="outline" className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Study Cards
                </Button>
              </Link>
              <Link to="/quiz" className="block">
                <Button variant="outline" className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                  <Brain className="h-4 w-4 mr-2" />
                  Take Quiz
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-800">Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-slate-600 space-y-2">
              <p>1. Upload your study materials (PDFs, notes, or text)</p>
              <p>2. AI will automatically generate flashcards</p>
              <p>3. Study with spaced repetition for optimal retention</p>
            </div>
            <Link to="/upload">
              <Button variant="outline" className="w-full mt-3 border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                Start Your First Upload
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
