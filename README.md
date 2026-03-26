# GolfGive - Golf Charity Subscription Platform

A modern subscription-driven golf platform that combines performance tracking, monthly prize draws, and charitable giving. Built with Next.js, Supabase, and Stripe.

![GolfGive Platform](https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1200&h=400&fit=crop)

## 🎯 Features

- **Golf Score Tracking** - Enter and track your Stableford golf scores
- **Monthly Prize Draws** - Automated lottery-style draws with multiple prize tiers
- **Charity Support** - Direct contributions to selected charities
- **Subscription Management** - Monthly and yearly plans with Stripe integration
- **Admin Dashboard** - Comprehensive management tools for draws, users, and charities
- **Real-time Updates** - Live data synchronization with Supabase
- **Responsive Design** - Beautiful UI that works on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe (INR currency)
- **Styling**: Custom CSS with Tailwind utilities
- **Deployment**: Vercel-ready

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier works)
- A Stripe account (for payment processing)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/golfgive-platform.git
cd golfgive-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the schema from `supabase/schema.sql`
4. Disable email confirmation: Settings → Auth → Providers → Email → Turn off "Confirm email"

### 5. Configure Stripe

1. Create a Stripe account at https://stripe.com
2. Get your API keys from https://dashboard.stripe.com/test/apikeys
3. Set up webhook endpoint at https://dashboard.stripe.com/test/webhooks
4. Add webhook events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

### For Users

1. **Sign Up** - Create an account at `/auth`
2. **Subscribe** - Choose a monthly (₹799) or yearly (₹7,999) plan
3. **Enter Scores** - Track your golf performance
4. **Select Charity** - Choose which charity receives your contribution
5. **Enter Draws** - Participate in monthly prize draws
6. **Win Prizes** - Match numbers to win from the prize pool

### For Admins

1. **User Management** - View and manage user accounts
2. **Draw Management** - Create and run monthly draws
3. **Charity Management** - Add and manage charitable organizations
4. **Winner Verification** - Approve winner claims and manage payouts

## 🧪 Testing

### Test Stripe Payments

Use these test card details:
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

### Test User Roles

- **Visitor**: Default role after signup
- **Subscriber**: Active subscription
- **Admin**: Full platform access

## 📁 Project Structure

```
golfgive-platform/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # User dashboard pages
│   │   └── page.tsx           # Homepage
│   ├── components/            # Reusable components
│   ├── lib/                   # Utilities and configurations
│   │   ├── auth-context.tsx  # Authentication context
│   │   ├── supabase.ts       # Supabase client
│   │   ├── stripe.ts         # Stripe configuration
│   │   └── types.ts          # TypeScript types
├── supabase/
│   └── schema.sql            # Database schema
├── public/                    # Static assets
├── .env.local                # Environment variables (not in git)
├── .gitignore                # Git ignore rules
└── package.json              # Dependencies
```

## 🔐 Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- Supabase Row Level Security (RLS) is enabled
- Stripe webhook signatures are verified
- Service role key is only used server-side

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Update Webhook URL

After deployment, update your Stripe webhook URL to:
```
https://your-domain.vercel.app/api/stripe/webhook
```

## 💰 Pricing

- **Monthly Plan**: ₹799/month
- **Yearly Plan**: ₹7,999/year (Save 17%)

## 🤝 Contributing

This is a portfolio/demonstration project. Feel free to fork and customize for your own use.

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Built with Next.js and React
- Database powered by Supabase
- Payments processed by Stripe
- Icons from Lucide React
- Images from Unsplash

---

**Note**: This is a demonstration project. For production use, ensure proper testing, security audits, and compliance with local regulations.
