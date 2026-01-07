import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !endpointSecret) {
    console.error('Stripe environment variables not set');
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-12-15.clover',
  });

  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'No signature found' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed. Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        {
          const session = event.data.object as Stripe.Checkout.Session;
          const userId = session.metadata?.userId;

          if (userId && session.customer) {
            // Update user's plan to PREMIUM and save customer ID
            await prisma.user.update({
              where: { id: userId },
              data: {
                plan: 'PREMIUM',
                stripeCustomerId: session.customer as string
              },
            });
          }
        }
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;

          // Find user by stripeCustomerId
          const user = await prisma.user.findFirst({
            where: { stripeCustomerId: customerId },
          });

          if (user) {
            // Determine if the subscription is active
            const isActive = subscription.status === 'active' || subscription.status === 'trialing';

            // Update user's plan based on subscription status
            await prisma.user.update({
              where: { id: user.id },
              data: {
                plan: isActive ? 'PREMIUM' : 'FREE'
              },
            });
          }
        }
        break;

      case 'customer.subscription.deleted':
      case 'customer.subscription.paused':
        {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;

          // Find user by stripeCustomerId
          const user = await prisma.user.findFirst({
            where: { stripeCustomerId: customerId },
          });

          if (user) {
            // Downgrade user to FREE plan
            await prisma.user.update({
              where: { id: user.id },
              data: { plan: 'FREE' },
            });
          }
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 });
  }
}