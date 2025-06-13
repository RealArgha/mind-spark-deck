
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MobileHeader from '@/components/MobileHeader';
import SubscriptionCard from '@/components/SubscriptionCard';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, RefreshCw } from 'lucide-react';

const SubscriptionPage = () => {
  const { subscribed, subscription_tier, subscription_end, loading, refetch } = useSubscription();
  const { toast } = useToast();

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Portal error:', error);
      toast({
        title: "Error",
        description: "Failed to open customer portal",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <MobileHeader title="Subscription" />
      
      <div className="px-4 py-6 space-y-6">
        {/* Current Status */}
        {subscribed && (
          <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800">Current Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Plan</span>
                <span className="font-medium capitalize">{subscription_tier || 'Unknown'}</span>
              </div>
              {subscription_end && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Next billing</span>
                  <span className="font-medium">
                    {new Date(subscription_end).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={handleManageSubscription}
                  variant="outline" 
                  className="flex-1"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Manage
                </Button>
                <Button 
                  onClick={refetch}
                  variant="outline"
                  size="icon"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plans */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 px-2">Choose Your Plan</h2>
          <div className="grid gap-4">
            <SubscriptionCard tier="basic" currentTier={subscription_tier} />
            <SubscriptionCard tier="premium" currentTier={subscription_tier} />
            <SubscriptionCard tier="pro" currentTier={subscription_tier} />
          </div>
        </div>

        {/* Features Comparison */}
        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Why Upgrade?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span>AI-Generated Flashcards</span>
                <span className="text-slate-500">Unlimited</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span>Advanced Study Analytics</span>
                <span className="text-slate-500">Premium+</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span>Priority Support</span>
                <span className="text-slate-500">All Plans</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Custom AI Models</span>
                <span className="text-slate-500">Pro Only</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPage;
