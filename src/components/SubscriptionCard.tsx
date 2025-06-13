
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Infinity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionCardProps {
  planType: 'monthly' | 'lifetime';
  currentTier?: string;
  onUpgrade?: () => void;
}

const plans = {
  monthly: {
    name: 'Monthly Plan',
    price: 4.99,
    icon: Crown,
    features: ['Unlimited flashcards', 'AI-powered generation', 'Spaced repetition', 'Progress tracking'],
    color: 'from-blue-500 to-indigo-600',
    badge: '$4.99/month',
    popular: false
  },
  lifetime: {
    name: 'Lifetime Access',
    price: 40,
    icon: Infinity,
    features: ['Everything in Monthly', 'One-time payment', 'Lifetime updates', 'Priority support'],
    color: 'from-purple-500 to-pink-600',
    badge: '$40 once',
    popular: true
  }
};

const SubscriptionCard = ({ planType, currentTier, onUpgrade }: SubscriptionCardProps) => {
  const plan = plans[planType];
  const { toast } = useToast();
  const isCurrentPlan = currentTier?.toLowerCase() === planType;

  const handleUpgrade = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={`relative border-0 shadow-lg ${isCurrentPlan ? 'ring-2 ring-indigo-500' : ''} ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}>
      {plan.popular && (
        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-500">
          Most Popular
        </Badge>
      )}
      {isCurrentPlan && (
        <Badge className="absolute -top-2 right-4 bg-indigo-500">
          Current Plan
        </Badge>
      )}
      <CardHeader className="text-center pb-4">
        <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4`}>
          <plan.icon className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <div className="text-3xl font-bold">
          {plan.badge}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <Button 
          className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-medium py-3`}
          onClick={isCurrentPlan ? undefined : handleUpgrade}
          disabled={isCurrentPlan}
          size="lg"
        >
          {isCurrentPlan ? 'Current Plan' : `Choose ${plan.name}`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
