
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Brain, Upload, Target, Clock, Crown, User, LogOut, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileHeader from '@/components/MobileHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { subscribed, subscription_tier } = useSubscription();

  const stats = [
    { label: 'Cards Studied', value: '0', icon: BookOpen, color: 'text-blue-600' },
    { label: 'Study Streak', value: '0', icon: Target, color: 'text-green-600' },
    { label: 'Time Today', value: '0m', icon: Clock, color: 'text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <MobileHeader showLogo />
      
      <div className="px-4 py-6 space-y-6">
        {/* Welcome Card */}
        <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Welcome back!
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {user?.email?.split('@')[0]}
                </p>
                <div className="flex items-center mt-2">
                  {subscribed ? (
                    <div className="flex items-center text-sm text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Free Plan</span>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={signOut} className="text-slate-500 h-8 w-8">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
            
            {!subscribed && (
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Go Premium</h3>
                    <p className="text-sm opacity-90">Unlock unlimited flashcards</p>
                  </div>
                  <Link to="/subscription">
                    <Button variant="secondary" size="sm" className="bg-white text-indigo-600 hover:bg-white/90">
                      Upgrade
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <stat.icon className={`h-5 w-5 ${stat.color} mx-auto mb-2`} />
                <p className="text-lg font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-600 leading-tight">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4 space-y-3">
            <Link to="/upload" className="block">
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-6 text-base">
                <Plus className="h-5 w-5 mr-2" />
                Create New Flashcards
              </Button>
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/flashcards" className="block">
                <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 py-4">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Study
                </Button>
              </Link>
              <Link to="/quiz" className="block">
                <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 py-4">
                  <Brain className="h-4 w-4 mr-2" />
                  Quiz
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-800">How it Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Upload Content</p>
                  <p className="text-xs text-slate-500">Add PDFs, notes, or paste text</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <p className="text-sm font-medium text-slate-700">AI Creates Cards</p>
                  <p className="text-xs text-slate-500">Automatically generate flashcards</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Study & Learn</p>
                  <p className="text-xs text-slate-500">Use spaced repetition to master content</p>
                </div>
              </div>
            </div>
            <Link to="/upload">
              <Button variant="outline" className="w-full mt-4 border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                Get Started
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
