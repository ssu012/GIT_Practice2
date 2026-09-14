# Hamro Pasal

A Nepali grocery, snacks, spices, tea, books, and handmade-goods storefront —
modeled on the layout and product taxonomy of
[baakostore.com](https://www.baakostore.com/) — with a real, working
**Stripe Checkout** integration so customers can pay by credit card.

## How it works

- `public/` — the storefront (HTML/CSS/JS), served as static files
- `data/products.js` — the product catalog **and the only source of truth for
  prices**. The frontend never sends a price to the server; it only sends
  product ids and quantities, so nobody can tamper with what they're charged.
- `server.js` — a small Express server that:
  - serves the storefront
  - exposes `GET /api/products` for the frontend to render
  - exposes `POST /api/create-checkout-session`, which builds a
    [Stripe Checkout](https://stripe.com/docs/payments/checkout) session from
    the cart and returns Stripe's hosted payment page URL. **Card numbers
    never touch this server or this code** — Stripe's own page collects
    them, which is what keeps this PCI-compliant without you having to
    handle card data directly.

## Setting up real payments (you do this part)

1. **Create a Stripe account** at [stripe.com](https://dashboard.stripe.com/register)
   with your real business details. This is required — nobody else can do
   this step for you, since it needs your legal business/banking info.
2. In the Stripe Dashboard, grab your **API keys**
   ([dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)).
   Start with the **test** secret key (`sk_test_...`) so you can run through
   the whole flow with [Stripe's test card numbers](https://stripe.com/docs/testing)
   before any real money is involved.
3. Copy `.env.example` to `.env` and paste in your key:
   ```bash
   cp .env.example .env
   # edit .env and set STRIPE_SECRET_KEY=sk_test_...
   ```
4. Install dependencies and run the server:
   ```bash
   npm install
   npm start
   ```
5. Visit `http://localhost:3000`, add items to the cart, and click
   **"Checkout with card"** — you'll land on Stripe's real hosted checkout
   page. Use a [Stripe test card](https://stripe.com/docs/testing) (e.g.
   `4242 4242 4242 4242`, any future expiry, any CVC) to complete a test
   purchase end-to-end.
6. **Go live:** once you're ready to accept real cards, activate your Stripe
   account (Stripe will ask for business verification details), swap in
   your **live** secret key (`sk_live_...`), and deploy the app (see below).
   Stripe deposits payments to your linked bank account on their normal
   payout schedule.

## Deploying

This is a normal Node/Express app — deploy it anywhere that runs Node:
[Render](https://render.com), [Railway](https://railway.app),
[Fly.io](https://fly.io), a VPS, etc. In short:

1. Push this repo to your host of choice.
2. Set the `STRIPE_SECRET_KEY` environment variable there (never commit it).
3. Start command: `npm start`.
4. Point your domain at the deployed app, and Stripe Checkout's
   `success_url`/`cancel_url` will automatically use that domain.

## Product sourcing note

The category list (Pau, Chaamal, Sabji, Chiura, Khaja, Tel, Chhop, Peetho,
Achar, Chiya, Kitabkhana, Hand Made) and sample products mirror what's
publicly visible on Baako Store. Several sample items reference real
third-party brands (Wai Wai, CG Foods, Lekali Foods, etc.) — before actually
selling those, make sure you have a legitimate supplier/distributor
relationship for them, or replace them with products you're authorized to
sell. Update `data/products.js` with your real catalog, pricing, and
(optionally) real product photos before going live.

## Local development without Stripe

You can browse the site and use the cart without any Stripe key configured —
`npm start` will run fine and log a warning. Checkout will return a clear
error until `STRIPE_SECRET_KEY` is set.
