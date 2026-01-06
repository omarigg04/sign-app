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

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.stripeCustomerId) {
      return res.status(400).json({ message: 'User does not have a Stripe customer ID' });
    }

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    res.status(500).json({ message: 'Error creating billing portal session' });
  }
}