
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Brain, Zap, Mic, Volume2, TrendingUp } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Landing = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Generation",
      description: "Automatically convert your notes into optimized flashcards using advanced AI"
    },
    {
      icon: Zap,
      title: "Spaced Repetition",
      description: "Smart algorithm adapts to your learning pace for maximum retention"
    },
    {
      icon: Mic,
      title: "Voice Input",
      description: "Record voice notes and convert them to flashcards instantly"
    },
    {
      icon: Volume2,
      title: "Text-to-Speech",
      description: "Listen to your flashcards for auditory learning"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your learning progress with detailed analytics"
    },
    {
      icon: BookOpen,
      title: "Multiple Formats",
      description: "Support for PDFs, text input, and various content types"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-50/20">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Learn Faster with AI
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Transform your study materials into intelligent flashcards and quizzes. 
            NeuroDeck uses AI to help you learn more efficiently than ever before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/upload">
              <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 text-lg px-8 py-3">
                Start Learning Now
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Modern Learning
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to supercharge your study sessions
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <feature.icon className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-primary/10 to-purple-600/10 border-primary/20">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already learning faster and more effectively with NeuroDeck.
            </p>
            <Link to="/upload">
              <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 text-lg px-8 py-3">
                Get Started Free
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Landing;
