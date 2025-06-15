import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MobileHeader from '@/components/MobileHeader';
import SubscriptionCard from '@/components/SubscriptionCard';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, RefreshCw, Star } from 'lucide-react';
import { useState } from 'react';

const SubscriptionPage = () => {
  const { subscribed, subscription_tier, subscription_end, loading, refetch } = useSubscription();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<null | 'monthly' | 'lifetime'>(null);

  const handleCheckout = async (planType: 'monthly' | 'lifetime') => {
    setLoadingPlan(planType);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType }
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Could not open checkout. Try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col">
      <MobileHeader title="Choose Your Plan" />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Current Status */}
        {subscribed && (
          <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-slate-800 flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                Your Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Plan</span>
                <span className="font-medium capitalize">{subscription_tier || 'Active'}</span>
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

        {/* Plan Selection with Checkout buttons */}
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Unlock Premium Features</h2>
            <p className="text-slate-600">Choose the plan that works best for you</p>
          </div>
          <div className="grid gap-4">
            {/* Lifetime Card with Checkout */}
            <Card>
              <CardHeader>
                <CardTitle>Lifetime Access</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <span className="text-xl font-semibold text-purple-600">$25 (one-time)</span>
                <Button
                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium py-3 mt-2"
                  onClick={() => handleCheckout('lifetime')}
                  disabled={loadingPlan === 'lifetime'}
                >
                  {loadingPlan === 'lifetime' ? 'Processing...' : 'Checkout Lifetime'}
                </Button>
              </CardContent>
            </Card>
            {/* Monthly Card with Checkout */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Plan</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <span className="text-xl font-semibold text-blue-600">$4.99 / month</span>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-3 mt-2"
                  onClick={() => handleCheckout('monthly')}
                  disabled={loadingPlan === 'monthly'}
                >
                  {loadingPlan === 'monthly' ? 'Processing...' : 'Checkout Monthly'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-800">What You Get</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 text-sm">
              <div className="flex items-center py-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Unlimited AI-generated flashcards</span>
              </div>
              <div className="flex items-center py-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span>Smart spaced repetition system</span>
              </div>
              <div className="flex items-center py-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span>Progress tracking & analytics</span>
              </div>
              <div className="flex items-center py-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                <span>Multiple content formats (PDF, text, audio)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Money Back Guarantee */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-emerald-50 mb-4">
          <CardContent className="p-4 text-center">
            <div className="text-green-700 font-medium mb-1">30-Day Money Back Guarantee</div>
            <div className="text-sm text-green-600">Try risk-free. Cancel anytime.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPage;
