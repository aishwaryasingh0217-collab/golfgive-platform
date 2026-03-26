# Complete Setup Guide

This guide will walk you through setting up the GolfGive platform from scratch.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Stripe Setup](#stripe-setup)
4. [Local Development](#local-development)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js** (v18 or higher)
  - Download: https://nodejs.org/
  - Verify: `node --version`

- **npm** (comes with Node.js)
  - Verify: `npm --version`

- **Git**
  - Download: https://git-scm.com/
  - Verify: `git --version`

### Required Accounts

- **Supabase Account** (Free)
  - Sign up: https://supabase.com

- **Stripe Account** (Free for testing)
  - Sign up: https://stripe.com

---

## Supabase Setup

### Step 1: Create a New Project

1. Go to https://supabase.com/dashboard
2. Click "New project"
3. Fill in:
   - **Name**: `golfgive-platform` (or your choice)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait 2-3 minutes for setup to complete

### Step 2: Get API Keys

1. In your project dashboard, click "Settings" (gear icon)
2. Click "API" under Configuration
3. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret key** (click "Reveal") → `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Run Database Schema

1. In Supabase dashboard, click "SQL Editor"
2. Click "New query"
3. Copy the entire contents of `supabase/schema.sql` from this project
4. Paste into the SQL editor
5. Click "Run" (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

### Step 4: Disable Email Confirmation (for development)

1. Go to "Authentication" → "Providers"
2. Click on "Email" provider
3. Scroll down and **disable** "Confirm email"
4. Click "Save"

**Note**: For production, keep email confirmation enabled!

---

## Stripe Setup

### Step 1: Create Stripe Account

1. Go to https://stripe.com
2. Click "Start now" or "Sign up"
3. Complete the registration
4. You'll start in **Test mode** (perfect for development)

### Step 2: Get API Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy these keys:
   - **Publishable key** (starts with `pk_test_`) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** (click "Reveal", starts with `sk_test_`) → `STRIPE_SECRET_KEY`

### Step 3: Set Up Webhook

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. Enter endpoint URL: `http://localhost:3000/api/stripe/webhook`
4. Click "Select events"
5. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
6. Click "Add events"
7. Click "Add endpoint"
8. Click on your new webhook endpoint
9. Copy the **Signing secret** (starts with `whsec_`) → `STRIPE_WEBHOOK_SECRET`

---

## Local Development

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/golfgive-platform.git
cd golfgive-platform
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js
- React
- Supabase client
- Stripe
- TypeScript
- And more...

### Step 3: Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` in your editor

3. Fill in all the values you collected from Supabase and Stripe:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Run the Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
- Ready in X.Xs
```

### Step 5: Open in Browser

Go to http://localhost:3000

You should see the GolfGive homepage!

---

## Testing the Application

### Create Your First Account

1. Click "Start Your Journey" or go to http://localhost:3000/auth
2. Click "Sign up"
3. Fill in:
   - Full Name: Test User
   - Email: test@example.com
   - Password: test123456
4. Click "Create Account"
5. You should be redirected to the dashboard

### Test Subscription (with Stripe Test Mode)

1. Go to "Subscription" in the sidebar
2. Click "Subscribe Monthly" or "Subscribe Yearly"
3. You'll be redirected to Stripe Checkout
4. Use test card details:
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/34` (any future date)
   - CVC: `123` (any 3 digits)
   - Name: Test User
   - ZIP: `12345` (any 5 digits)
5. Click "Subscribe"
6. You'll be redirected back to your dashboard
7. Your subscription should now be active!

### Create an Admin User

1. Go to Supabase dashboard → "Table Editor"
2. Click on "profiles" table
3. Find your user
4. Change the "role" column from "visitor" to "admin"
5. Refresh your app
6. You should now see "Admin Panel" in the sidebar

---

## Troubleshooting

### Issue: "Invalid API key" error

**Solution**: 
- Check that your `.env.local` file has the correct keys
- Make sure there are no extra spaces
- Restart the dev server after changing `.env.local`

### Issue: Can't sign in after creating account

**Solution**:
- Make sure you disabled email confirmation in Supabase
- Check browser console for errors (F12)
- Verify the database schema was run successfully

### Issue: Stripe checkout not working

**Solution**:
- Verify all three Stripe keys are in `.env.local`
- Make sure you're using test mode keys (start with `pk_test_` and `sk_test_`)
- Check that webhook is set up correctly

### Issue: Database errors

**Solution**:
- Re-run the schema from `supabase/schema.sql`
- Check Supabase logs in dashboard
- Verify RLS policies are enabled

### Issue: Port 3000 already in use

**Solution**:
```bash
# Kill the process using port 3000
npx kill-port 3000

# Or run on a different port
npm run dev -- -p 3001
```

---

## Next Steps

Once everything is working:

1. ✅ Explore the dashboard features
2. ✅ Test score tracking
3. ✅ Try the draw system (as admin)
4. ✅ Add charities
5. ✅ Customize the design
6. ✅ Deploy to Vercel

---

## Need Help?

- Check the main [README.md](README.md)
- Review Supabase docs: https://supabase.com/docs
- Review Stripe docs: https://stripe.com/docs
- Check Next.js docs: https://nextjs.org/docs

---

**Happy coding! 🎉**
