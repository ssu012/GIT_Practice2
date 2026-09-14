/* ===========================================================
   Hamro Pasal — server
   Serves the static storefront and handles Stripe Checkout.
   Card numbers never touch this server: Stripe hosts the actual
   payment form and redirects back to /success.html or /cancel.html.
   =========================================================== */

require("dotenv").config();
const path = require("path");
const express = require("express");
const Stripe = require("stripe");

const PRODUCTS = require("./data/products");

const app = express();
const PORT = process.env.PORT || 3000;

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Public catalog for the frontend to render (no server internals leaked).
app.get("/api/products", (req, res) => {
  res.json(PRODUCTS);
});

// Creates a Stripe Checkout Session and hands the client the URL to
// redirect to. Prices are looked up server-side from data/products.js —
// the client only ever sends product ids + quantities, never amounts.
app.post("/api/create-checkout-session", async (req, res) => {
  if (!stripe) {
    return res.status(500).json({
      error:
        "Stripe is not configured yet. Add STRIPE_SECRET_KEY to your .env file (see .env.example) and restart the server.",
    });
  }

  const { items } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Your cart is empty." });
  }

  const line_items = [];
  for (const item of items) {
    const product = PRODUCTS.find((p) => p.id === item.id);
    if (!product) {
      return res.status(400).json({ error: `Unknown product: ${item.id}` });
    }
    const qty = Math.max(1, Math.min(99, parseInt(item.qty, 10) || 1));
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: `${product.name} (${product.brand})` },
        unit_amount: product.price, // cents — server-side source of truth
      },
      quantity: qty,
    });
  }

  const origin = req.headers.origin || `${req.protocol}://${req.get("host")}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      shipping_address_collection: { allowed_countries: ["US"] },
      success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel.html`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session error:", err.message);
    res.status(500).json({ error: "Could not start checkout. Please try again." });
  }
});

app.listen(PORT, () => {
  console.log(`Hamro Pasal running at http://localhost:${PORT}`);
  if (!stripe) {
    console.warn(
      "⚠️  STRIPE_SECRET_KEY not set — checkout will not work until you add it to .env (see .env.example)."
    );
  }
});
