# 🥬 BazarDor (বাজার দর)

A Bangla-first grocery price tracker where daily prices, price changes and market comparisons live in one place. Prices are shown in Bangla numerals with familiar local units, so people can check market rates before leaving home.

**Live demo:** _add your Vercel link here_

## The problem

- Daily grocery prices are unclear and scattered
- No easy way to see what got costlier or cheaper than yesterday
- Hard to find which market is the cheapest
- Prices are rarely shown in familiar Bangla units

## Features

- **Daily Price Dashboard:** today's prices in Bangla numerals with local units (per kg, per litre, per dozen)
- **Scrolling Price Ticker:** a moving strip of product prices and percentage changes
- **Risers and Fallers:** items that got costlier or cheaper than yesterday
- **Market Comparison:** compare prices across five Dhaka markets and spot the cheapest
- **Price Summary:** lowest, highest and average price for every product
- **Price History Chart:** 30-day line chart with a price scale and hover tooltips
- **Category Browsing:** eight grocery categories with sorting by price
- **Favourites and Budget Calculator:** save products and calculate the total cost for the quantities you need
- **Secure Authentication:** sign in with email, Google or GitHub
- **Protected Routes:** product, favourites, profile and admin pages need a session
- **Admin Price Update:** the admin updates a price and the dashboard, ticker and risers/fallers update automatically
- **Dark Mode:** theme choice is saved in a cookie

## Tech stack

Next.js · React · Tailwind CSS · HeroUI · Better Auth · MongoDB · React Hot Toast

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
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_EMAIL=your_email@example.com
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
NEXT_PUBLIC_GOOGLE_ENABLED=false
NEXT_PUBLIC_GITHUB_ENABLED=false
```

Generate a secret with `openssl rand -base64 32`. Google and GitHub login are optional: add the keys and set the matching `NEXT_PUBLIC_..._ENABLED` flag to `true` to show the buttons.

Load the sample products and 30-day price history into MongoDB:

```bash
node --env-file=.env.local scripts/seed.mjs
node --env-file=.env.local scripts/seed-history.mjs
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`. Register an account with the same email as `ADMIN_EMAIL` to access `/admin` and update prices.

## Project structure

```text
src/
  app/            pages, server actions and the auth API route
  components/     navbar, ticker, product cards, chart, budget calculator
  lib/            database, auth, session and formatting helpers
  data/           categories and seed products
scripts/          database seed scripts
```

## Data note

Prices and the 30-day history are sample data for demonstration, and the market-wise prices are derived from each product's price. The admin page shows how real prices can be maintained. Importing the daily reports published by Bangladesh's Department of Agricultural Marketing or the Trading Corporation of Bangladesh is a planned improvement.

## Author

Siam Mehedi Anik · [GitHub](https://github.com/S-M-AniK)
