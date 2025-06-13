
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionCardProps {
  tier: 'basic' | 'premium' | 'pro';
  currentTier?: string;
  onUpgrade?: () => void;
}

const plans = {
  basic: {
    name: 'Basic',
    price: 9,
    icon: Zap,
    features: ['50 flashcards/month', 'Basic AI generation', 'Email support'],
    color: 'from-blue-500 to-blue-600'
  },
  premium: {
    name: 'Premium',
    price: 19,
    icon: Crown,
    features: ['Unlimited flashcards', 'Advanced AI features', 'Priority support', 'Spaced repetition'],
    color: 'from-indigo-500 to-purple-600'
  },
  pro: {
    name: 'Pro',
    price: 39,
    icon: Crown,
    features: ['Everything in Premium', 'Custom AI models', '24/7 support', 'Advanced analytics'],
    color: 'from-purple-500 to-pink-600'
  }
};

const SubscriptionCard = ({ tier, currentTier, onUpgrade }: SubscriptionCardProps) => {
  const plan = plans[tier];
  const { toast } = useToast();
  const isCurrentPlan = currentTier?.toLowerCase() === tier;

  const handleUpgrade = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { tier }
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
    <Card className={`relative border-0 shadow-lg ${isCurrentPlan ? 'ring-2 ring-indigo-500' : ''}`}>
      {isCurrentPlan && (
        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-indigo-500">
          Current Plan
        </Badge>
      )}
      <CardHeader className="text-center pb-4">
        <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4`}>
          <plan.icon className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <div className="text-3xl font-bold">
          ${plan.price}
          <span className="text-sm font-normal text-muted-foreground">/month</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <Button 
          className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90`}
          onClick={isCurrentPlan ? undefined : handleUpgrade}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? 'Current Plan' : 'Choose Plan'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
