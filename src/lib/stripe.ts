import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia' as Stripe.LatestApiVersion,
});

export const PLANS = {
  monthly: {
    name: 'Monthly',
    price: 799,
    interval: 'month' as const,
    description: 'Full access to all features, billed monthly',
    features: [
      'Enter golf scores & track performance',
      'Monthly prize draw entry',
      'Support your chosen charity',
      'Full dashboard access',
      'Winner verification & payouts',
    ],
  },
  yearly: {
    name: 'Yearly',
    price: 7999,
    interval: 'year' as const,
    description: 'Save 17% with annual billing',
    features: [
      'Everything in Monthly',
      '2 months free',
      'Priority support',
      'Early draw notifications',
      'Annual impact report',
    ],
  },
};
