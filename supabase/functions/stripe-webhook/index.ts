import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@17.7.0?target=deno";

async function sha256Hash(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sendMetaCAPISubscribeEvent(
  invoice: Stripe.Invoice,
): Promise<void> {
  const META_PIXEL_ID = Deno.env.get("META_PIXEL_ID");
  const META_CAPI_ACCESS_TOKEN = Deno.env.get("META_CAPI_ACCESS_TOKEN");

  if (!META_PIXEL_ID || !META_CAPI_ACCESS_TOKEN) {
    console.error("Missing Meta CAPI environment variables");
    return;
  }

  const email = invoice.customer_email;
  if (!email) {
    console.error("No customer email on invoice, skipping CAPI event");
    return;
  }

  const emailHash = await sha256Hash(email);

  const userData: Record<string, string> = {
    em: emailHash,
  };

  // Include fbp/fbc from subscription metadata if available
  const metadata = invoice.subscription_details?.metadata ?? {};
  if (metadata.fbp) userData.fbp = metadata.fbp;
  if (metadata.fbc) userData.fbc = metadata.fbc;

  const eventData = {
    data: [
      {
        event_name: "Subscribe",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: userData,
        custom_data: {
          value: (invoice.amount_paid / 100).toFixed(2),
          currency: invoice.currency.toUpperCase(),
        },
      },
    ],
  };

  const url = `https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events?access_token=${META_CAPI_ACCESS_TOKEN}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Meta CAPI error:", JSON.stringify(result));
  } else {
    console.log("Meta CAPI Subscribe event sent:", JSON.stringify(result));
  }
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!STRIPE_WEBHOOK_SECRET) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return new Response("Server configuration error", { status: 500 });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
    apiVersion: "2024-12-18.acacia",
    httpClient: Stripe.createFetchHttpClient(),
  });

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log(`Received event: ${event.type} (${event.id})`);

  try {
    if (event.type === "checkout.session.completed") {
      // Extract fbp/fbc from client_reference_id and store on subscription metadata
      const session = event.data.object as Stripe.Checkout.Session;
      const ref = session.client_reference_id;
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

      if (ref && subscriptionId) {
        const params: Record<string, string> = {};
        for (const part of ref.split(";")) {
          const [key, ...rest] = part.split("=");
          if (key && rest.length) params[key] = rest.join("=");
        }

        if (params.fbp || params.fbc) {
          const metadata: Record<string, string> = {};
          if (params.fbp) metadata.fbp = params.fbp;
          if (params.fbc) metadata.fbc = params.fbc;

          await stripe.subscriptions.update(subscriptionId, { metadata });
          console.log(`Stored fbp/fbc on subscription ${subscriptionId}`);
        }
      }
    }

    if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;

      // Only track conversion on the first charge (subscription creation)
      if (invoice.billing_reason === "subscription_create") {
        console.log(
          `First payment for subscription. Invoice: ${invoice.id}, Email: ${invoice.customer_email}, Amount: ${invoice.amount_paid}`,
        );
        await sendMetaCAPISubscribeEvent(invoice);
      } else {
        console.log(
          `Recurring payment (billing_reason: ${invoice.billing_reason}), skipping CAPI event`,
        );
      }
    }
  } catch (err) {
    console.error(`Error processing event ${event.type}:`, err);
    return new Response("Webhook handler error", { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
