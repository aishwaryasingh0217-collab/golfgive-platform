import { NextResponse } from 'next/server';
import { stripe, PLANS } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const { planType, userId, email } = await request.json();
    const plan = planType === 'yearly' ? PLANS.yearly : PLANS.monthly;

    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `GolfGive ${plan.name} Subscription`,
              description: plan.description,
            },
            unit_amount: Math.round(plan.price * 100),
            recurring: {
              interval: plan.interval,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?cancelled=true`,
      metadata: {
        userId,
        planType,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
