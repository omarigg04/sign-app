import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getProfileByStripeCustomerId, updateProfile, addCredits } from '@/lib/db/queries';

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
          try {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.userId;
            const creditAmount = parseInt(session.metadata?.creditAmount || '0');

            console.log('=== CHECKOUT SESSION COMPLETED ===');
            console.log('Session ID:', session.id);
            console.log('User ID:', userId);
            console.log('Customer ID:', session.customer);
            console.log('Credits (parsed):', creditAmount);
            console.log('Credits (raw metadata):', session.metadata?.creditAmount);
            console.log('Full metadata:', session.metadata);
            console.log('Payment intent:', session.payment_intent);

            if (!userId) {
              console.error('❌ ERROR: userId missing from metadata');
              return;
            }

            if (creditAmount === 0 || isNaN(creditAmount)) {
              console.error('❌ ERROR: creditAmount is 0 or NaN. Raw value:', session.metadata?.creditAmount);
              return;
            }

            if (!session.customer) {
              console.error('❌ ERROR: session.customer is missing');
              return;
            }

            try {
              // Update profile with customer ID
              await updateProfile(userId, {
                stripeCustomerId: session.customer as string
              });
              console.log('✅ Profile updated with Stripe customer ID');
            } catch (profileError) {
              console.error('❌ ERROR updating profile:', profileError);
              throw profileError;
            }

            try {
              // Add credits to user
              await addCredits(userId, creditAmount, `Compra de ${creditAmount} créditos`, session.payment_intent as string);
              console.log('✅ Credits added successfully');
            } catch (creditsError) {
              console.error('❌ ERROR adding credits:', creditsError);
              throw creditsError;
            }
          } catch (sessionError) {
            console.error('❌ ERROR processing checkout session:', sessionError);
            throw sessionError;
          }
        }
        break;

      // NOTA: Los eventos de suscripción se ignoran ahora
      // El nuevo sistema usa SOLO créditos, no planes de suscripción
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
      case 'customer.subscription.paused':
        {
          console.log(`⚠️ Ignoring subscription event: ${event.type}`);
          console.log('Sistema nuevo basado en créditos, no en suscripciones');
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
