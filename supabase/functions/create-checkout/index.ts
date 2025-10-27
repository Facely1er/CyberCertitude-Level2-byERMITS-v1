// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { priceId, userId, successUrl, cancelUrl } = await req.json();

    if (!priceId || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters: priceId and userId" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ error: "Stripe not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Import Stripe (dynamic import for Edge Runtime compatibility)
    const stripe = await import("https://esm.sh/stripe@14.21.0");
    const stripeClient = stripe.default(stripeSecretKey);

    // Create checkout session
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl || `${Deno.env.get("APP_URL") || "https://cmmc.cybercertitude.com"}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${Deno.env.get("APP_URL") || "https://cmmc.cybercertitude.com"}/pricing`,
      metadata: {
        user_id: userId,
      },
      subscription_data: {
        metadata: {
          user_id: userId,
        },
      },
    });

    return new Response(
      JSON.stringify({ 
        sessionId: session.id,
        checkoutUrl: session.url 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Failed to create checkout session" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
