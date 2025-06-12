
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Brain, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Landing = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Generation",
      description: "Convert notes into flashcards automatically"
    },
    {
      icon: Zap,
      title: "Spaced Repetition",
      description: "Learn efficiently with smart scheduling"
    },
    {
      icon: BookOpen,
      title: "Multiple Formats",
      description: "Support for PDFs and text input"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-32 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Learn Faster with AI
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Transform your study materials into intelligent flashcards. 
            Simple, efficient, effective.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/upload">
              <Button size="lg" className="px-8">
                Start Learning
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="px-8">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Everything you need
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-none">
                <CardContent className="p-6 text-center">
                  <feature.icon className="h-8 w-8 text-foreground mb-4 mx-auto" />
                  <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join students learning more effectively.
          </p>
          <Link to="/upload">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
