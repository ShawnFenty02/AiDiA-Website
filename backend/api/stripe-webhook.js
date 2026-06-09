import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
  api: { bodyParser: false }
};

function buffer(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

export default async function handler(req, res) {
  const sig = req.headers["stripe-signature"];

  const rawBody = await buffer(req);

  let event = stripe.webhooks.constructEvent(
    rawBody,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    await supabase.from("orders").insert([
      {
        email: session.customer_details?.email,
        product: "AiDiA Bear",
        variant: session.metadata?.variant,
        quantity: session.metadata?.quantity,
        amount: session.amount_total
      }
    ]);
  }

  res.json({ received: true });
}
