import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';
import { getProfileById, updateProfile, createProfile, getCreditPackageById } from '@/lib/db/queries';

export async function POST(req: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-12-15.clover',
    });

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get packageId from request body
    const body = await req.json();
    const packageId = body.packageId;

    if (!packageId) {
      return NextResponse.json({ error: 'packageId required' }, { status: 400 });
    }

    // Get credit package
    const creditPackage = await getCreditPackageById(packageId);
    if (!creditPackage) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    // Get or create profile
    let profile = await getProfileById(user.id);
    if (!profile) {
      profile = await createProfile(user.id);
    }

    // If user doesn't have a stripeCustomerId, create a customer in Stripe
    let stripeCustomerId = profile.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email || '',
        metadata: {
          userId: user.id,
        },
      });

      stripeCustomerId = customer.id;

      // Update profile with the new stripeCustomerId
      await updateProfile(user.id, { stripeCustomerId });
    }

    // Create a checkout session for one-time payment
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment', // ONE-TIME PAYMENT, not subscription
      customer: stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: creditPackage.name,
              description: `${creditPackage.creditAmount} firmas - ${creditPackage.description}`,
            },
            unit_amount: Math.round(parseFloat(creditPackage.price) * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      metadata: {
        userId: user.id,
        packageId: creditPackage.id,
        creditAmount: creditPackage.creditAmount.toString(),
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Error creating checkout session' }, { status: 500 });
  }
}
