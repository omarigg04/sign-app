import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import prisma from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get authenticated user
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get user from database to check or update their stripeCustomerId
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user doesn't have a stripeCustomerId, create a customer in Stripe
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: userId,
        },
      });

      stripeCustomerId = customer.id;

      // Update user with the new stripeCustomerId
      user = await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId },
      });
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription', // Premium plan is a subscription
      customer: stripeCustomerId,
      line_items: [
        {
          price: process.env.STRIPE_PREMIUM_PRICE_ID, // This should be set in your .env
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      metadata: {
        userId,
      },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: 'Error creating checkout session' });
  }
}