
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Check for existing subscriber record
    const { data: existingSubscriber } = await supabaseClient
      .from("subscribers")
      .select("*")
      .eq("email", user.email)
      .single();

    const now = new Date();
    let trialActive = false;
    let trialEnd = null;

    // If no subscriber record exists, create one with 7-day trial
    if (!existingSubscriber) {
      const trialEndDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
      
      await supabaseClient.from("subscribers").insert({
        email: user.email,
        user_id: user.id,
        stripe_customer_id: null,
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        trial_active: true,
        trial_end: trialEndDate.toISOString(),
        updated_at: new Date().toISOString(),
      });

      trialActive = true;
      trialEnd = trialEndDate.toISOString();
      logStep("Created new subscriber with 7-day trial", { trialEnd });
    } else {
      // Check if trial is still active
      if (existingSubscriber.trial_end) {
        const trialEndDate = new Date(existingSubscriber.trial_end);
        trialActive = trialEndDate > now;
        trialEnd = existingSubscriber.trial_end;
      }
      logStep("Found existing subscriber", { trialActive, trialEnd });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    let hasActiveSub = false;
    let subscriptionTier = null;
    let subscriptionEnd = null;

    if (customers.data.length > 0) {
      const customerId = customers.data[0].id;
      logStep("Found Stripe customer", { customerId });

      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
      });
      hasActiveSub = subscriptions.data.length > 0;

      if (hasActiveSub) {
        const subscription = subscriptions.data[0];
        subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
        logStep("Active subscription found", { subscriptionId: subscription.id, endDate: subscriptionEnd });
        
        const priceId = subscription.items.data[0].price.id;
        const price = await stripe.prices.retrieve(priceId);
        const amount = price.unit_amount || 0;
        if (amount <= 999) {
          subscriptionTier = "Basic";
        } else if (amount <= 2999) {
          subscriptionTier = "Premium";
        } else {
          subscriptionTier = "Pro";
        }
        logStep("Determined subscription tier", { priceId, amount, subscriptionTier });

        // If user has active subscription, deactivate trial
        if (trialActive) {
          await supabaseClient
            .from("subscribers")
            .update({ trial_active: false })
            .eq("email", user.email);
          trialActive = false;
        }
      }

      await supabaseClient.from("subscribers").upsert({
        email: user.email,
        user_id: user.id,
        stripe_customer_id: customerId,
        subscribed: hasActiveSub,
        subscription_tier: subscriptionTier,
        subscription_end: subscriptionEnd,
        trial_active: trialActive,
        trial_end: trialEnd,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });
    }

    logStep("Updated database with subscription info", { subscribed: hasActiveSub, subscriptionTier, trialActive });
    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
      trial_active: trialActive,
      trial_end: trialEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
