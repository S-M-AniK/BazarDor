# 🥬 BazarDor (বাজার দর)

A Bangla-first grocery price tracker where daily prices, price changes and market comparisons live in one place. Prices are shown in Bangla numerals with familiar local units, so people can check market rates before leaving home. The whole site also works in English.

**Live demo:** https://bazardor-bd-delta.vercel.app

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
- **Category Browsing and Search:** eight grocery categories, sorting by price, and search in Bangla or English
- **Favourites and Budget Calculator:** save products and calculate the total cost for the quantities you need
- **Bangla / English Toggle:** the whole interface switches language and the choice is remembered
- **Dark Mode:** theme choice is saved in a cookie
- **Secure Authentication:** sign in with email, Google or GitHub
- **Protected Routes:** product, favourites, profile and admin pages need a session
- **Admin Dashboard:** update one price, upload a CSV to update every price at once, or add a brand new product. The dashboard, ticker, risers/fallers and charts update automatically

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

Load the sample products and 30-day price history into MongoDB:

```bash
node --env-file=.env.local scripts/seed.mjs
node --env-file=.env.local scripts/seed-history.mjs
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`. Register an account with the same email as `ADMIN_EMAIL` to access the admin page.

## Admin

The admin page is only available to the account that matches `ADMIN_EMAIL`.

- **Single update:** pick a product and enter the new price
- **CSV update:** download the template, change the `price` column, and upload the file to update every price together
- **Add a product:** enter the Bangla name, an optional English name, category, unit, emoji and price

Every price change is stored in a history collection, which powers the 30-day chart.

## Project structure

```text
src/
  app/            pages, server actions and the auth API route
  components/     navbar, ticker, product cards, chart, budget calculator, forms
  lib/            database, auth, session, translations and formatting helpers
  data/           categories, translations and seed products
scripts/          database seed scripts
```

## Deployment

The app is deployed on Vercel and uses a MongoDB Atlas cluster. Set `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (the live site URL) and `ADMIN_EMAIL` as environment variables, and choose a Vercel function region close to the database region.

## Data note

Prices and the 30-day history are sample data for demonstration, and the market-wise prices are derived from each product's price. The admin tools show how real prices can be maintained. Importing the daily reports published by Bangladesh's Department of Agricultural Marketing or the Trading Corporation of Bangladesh is a planned improvement.

## Author

Siam Mehedi Anik · [GitHub](https://github.com/S-M-AniK)