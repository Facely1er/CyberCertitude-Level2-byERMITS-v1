// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = await import("https://esm.sh/stripe@14.21.0");

const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Get signature from headers
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      console.error("No stripe-signature header found");
      return new Response("No signature provided", { status: 400 });
    }

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return new Response("Webhook secret not configured", { status: 500 });
    }

    const body = await req.text();
    
    // Verify webhook signature
    let event;
    try {
      event = stripe.default(stripeSecretKey || "").webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response(`Webhook Error: ${err?.message}`, { status: 400 });
    }

    console.log(`Received Stripe event: ${event.type}`);

    // Initialize Supabase client
    const supabaseClient = createClient(
      supabaseUrl || "",
      supabaseServiceKey || "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object, supabaseClient);
        break;
        
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdate(event.data.object, supabaseClient);
        break;
        
      case "customer.subscription.deleted":
        await handleSubscriptionCancelled(event.data.object, supabaseClient);
        break;
        
      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object, supabaseClient);
        break;
        
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object, supabaseClient);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true, eventType: event.type }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Webhook handler error:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Unknown error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});

// Handle successful checkout completion
async function handleCheckoutCompleted(session: any, supabase: any) {
  console.log("Processing checkout.session.completed:", session.id);
  
  try {
    const metadata = session.metadata || {};
    const userId = metadata.user_id;
    
    if (!userId) {
      console.error("No user_id in session metadata");
      return;
    }

    // Update user subscription status
    const { error } = await supabase
      .from("user_subscriptions")
      .upsert({
        user_id: userId,
        customer_id: session.customer,
        subscription_id: session.subscription,
        status: "active",
        plan_id: metadata.plan_id || "unknown",
        current_period_start: session.subscription_details
          ? new Date(session.subscription_details.current_period_start * 1000).toISOString()
          : null,
        current_period_end: session.subscription_details
          ? new Date(session.subscription_details.current_period_end * 1000).toISOString()
          : null,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "user_id"
      });

    if (error) {
      console.error("Error updating subscription:", error);
      throw error;
    }

    console.log(`Subscription activated for user: ${userId}`);
  } catch (error) {
    console.error("Error in handleCheckoutCompleted:", error);
    throw error;
  }
}

// Handle subscription creation/updates
async function handleSubscriptionUpdate(subscription: any, supabase: any) {
  console.log("Processing subscription update:", subscription.id);
  
  try {
    const { data: subData, error } = await supabase
      .from("user_subscriptions")
      .select("user_id")
      .eq("subscription_id", subscription.id)
      .single();

    if (error || !subData) {
      console.error("Subscription not found in database:", error);
      return;
    }

    const updates: any = {
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (subscription.items?.data?.[0]?.price?.id) {
      updates.plan_id = subscription.items.data[0].price.id;
    }

    const { error: updateError } = await supabase
      .from("user_subscriptions")
      .update(updates)
      .eq("subscription_id", subscription.id);

    if (updateError) {
      console.error("Error updating subscription:", updateError);
    } else {
      console.log(`Subscription ${subscription.id} updated successfully`);
    }
  } catch (error) {
    console.error("Error in handleSubscriptionUpdate:", error);
  }
}

// Handle subscription cancellation
async function handleSubscriptionCancelled(subscription: any, supabase: any) {
  console.log("Processing subscription cancellation:", subscription.id);
  
  try {
    const { error } = await supabase
      .from("user_subscriptions")
      .update({
        status: "cancelled",
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("subscription_id", subscription.id);

    if (error) {
      console.error("Error cancelling subscription:", error);
    } else {
      console.log(`Subscription ${subscription.id} cancelled successfully`);
    }
  } catch (error) {
    console.error("Error in handleSubscriptionCancelled:", error);
  }
}

// Handle successful payment
async function handlePaymentSucceeded(invoice: any, supabase: any) {
  console.log("Processing successful payment for invoice:", invoice.id);
  
  try {
    // Optional: Log successful payments
    const { error } = await supabase
      .from("user_subscriptions")
      .update({
        status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("subscription_id", invoice.subscription);

    if (!error) {
      console.log(`Payment succeeded for subscription: ${invoice.subscription}`);
    }
  } catch (error) {
    console.error("Error in handlePaymentSucceeded:", error);
  }
}

// Handle failed payment
async function handlePaymentFailed(invoice: any, supabase: any) {
  console.log("Processing failed payment for invoice:", invoice.id);
  
  try {
    const { error } = await supabase
      .from("user_subscriptions")
      .update({
        status: "past_due",
        updated_at: new Date().toISOString(),
      })
      .eq("subscription_id", invoice.subscription);

    if (!error) {
      console.log(`Payment failed for subscription: ${invoice.subscription}`);
    }
  } catch (error) {
    console.error("Error in handlePaymentFailed:", error);
  }
}
