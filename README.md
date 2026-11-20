# 🥬 BazarDor (বাজার দর)

A Bangla-first grocery price tracker and ordering app. Daily prices, price changes and market comparisons live in one place, shown in Bangla numerals with familiar local units. Shoppers can check rates, add items to a cart and place an order. The whole site also works in English and can be installed on a phone.

**Live demo:** [bazardor-bd-delta.vercel.app](https://bazardor-bd-delta.vercel.app)

## The problem

- Daily grocery prices are unclear and scattered
- No easy way to see what got costlier or cheaper than yesterday
- Hard to find which market is the cheapest
- Prices are rarely shown in familiar Bangla units

## Features

### For shoppers

- **Daily Price Dashboard:** today's prices in Bangla numerals with local units (per kg, per litre, per dozen)
- **Scrolling Price Ticker:** a moving strip of product prices and percentage changes
- **Risers and Fallers:** items that got costlier or cheaper than yesterday
- **Market Comparison:** compare prices across five Dhaka markets and spot the cheapest
- **Price Summary and Chart:** lowest, highest and average price, plus a 30-day line chart with hover tooltips
- **Category Browsing and Search:** eight grocery categories, price sorting, and search in Bangla or English
- **Guest Browsing:** anyone can browse prices without signing in; sign-in is only needed to order or save favourites
- **Favourites and Budget Calculator:** save products and calculate the total cost for the quantities you need
- **Cart and Checkout:** add items to a cart, enter delivery details, and pay with Cash on Delivery or a simulated bKash payment
- **My Orders:** every order gets a number, and its status (pending, confirmed, out for delivery, delivered, cancelled) can be followed on the My Orders page
- **Stock Awareness:** stock levels are shown on every product, and sold-out items cannot be ordered
- **Bangla / English Toggle and Dark Mode:** both choices are remembered
- **PWA:** can be installed on a phone's home screen

### For the admin

- **Price Management:** update one price, or upload a CSV to update every price at once
- **Add Products:** create new products with Bangla and English names, category, unit and emoji
- **Stock Management:** add to stock or set it to an exact number
- **Order Management:** see every order with customer details, move it through the delivery stages, or cancel it (cancelling returns the items to stock)

## Tech stack

Next.js · React · Tailwind CSS · HeroUI · Better Auth · MongoDB · React Hot Toast

Deployed on Vercel with MongoDB Atlas.

## Getting started

Clone the repository and install dependencies:

```bash
git clone https://github.com/S-M-AniK/bazardor.git
cd bazardor
npm install
```

Create a `.env.local` file in the project root:

```text
MONGODB_URI=mongodb://127.0.0.1:27017/bazardor
BETTER_AUTH_SECRET=your_random_secret
BETTER_AUTH_URL=http://localhost:3000
ADMIN_EMAIL=your_email@example.com
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
NEXT_PUBLIC_GOOGLE_ENABLED=false
NEXT_PUBLIC_GITHUB_ENABLED=false
```

Generate a secret with `openssl rand -base64 32`. Google and GitHub login are optional: add the keys and set the matching `NEXT_PUBLIC_..._ENABLED` flag to `true` to show the buttons.

Load the sample products, 30-day price history and starting stock into MongoDB:

```bash
node --env-file=.env.local scripts/seed.mjs
node --env-file=.env.local scripts/seed-history.mjs
node --env-file=.env.local scripts/add-stock.mjs
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`. Register an account with the same email as `ADMIN_EMAIL` to access the admin pages.

## Ordering flow

1. Browse products and add items to the cart (no account needed)
2. Open the cart and continue to checkout, which asks the shopper to sign in
3. Enter name, phone and address, then choose Cash on Delivery or the demo bKash option
4. The order is saved with a number, stock is reduced, and the shopper lands on the order page
5. The admin confirms, ships and delivers the order from `/admin/orders`, and the shopper sees each change in My Orders

Stock is reduced with an atomic update, so two shoppers cannot buy the last item at the same time. The bKash option is a demo and never charges real money.

## Project structure

```text
src/
  app/            pages, server actions and the auth API route
  components/     navbar, ticker, product cards, chart, cart, checkout, forms
  lib/            database, auth, session, cart, orders, translations and helpers
  data/           categories, translations and seed products
scripts/          database seed and stock scripts
```

## Deployment

The app is deployed on Vercel and uses a MongoDB Atlas cluster. Set `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (the live site URL) and `ADMIN_EMAIL` as environment variables, and choose a Vercel function region close to the database region.

## Data note

Prices and the 30-day history are sample data for demonstration, and the market-wise prices are derived from each product's price. The admin tools show how real prices can be maintained. Importing the daily reports published by Bangladesh's Department of Agricultural Marketing or the Trading Corporation of Bangladesh is a planned improvement. Orders are for demonstration: no goods are delivered and no real payment is taken.

## Author

Siam Mehedi Anik · [GitHub](https://github.com/S-M-AniK)
