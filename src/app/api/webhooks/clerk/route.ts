import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('CLERK_WEBHOOK_SECRET is not set');
  }

  // Get the headers
  const headerPayload = await headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const body = await req.text();

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as any;
  } catch (err) {
    console.error('Webhook verification error:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  const { id, email_addresses, first_name, last_name } = evt.data;
  const eventType = evt.type;

  if (eventType === 'user.created') {
    try {
      const email = email_addresses?.[0]?.email_address;
      if (!email) {
        console.warn('User created event but no email found:', id);
        return new NextResponse('No email found for user', { status: 400 });
      }

      console.log('🔄 Creating user with data:', { id, email, name: `${first_name || ''} ${last_name || ''}`.trim() });

      await prisma.user.create({
        data: {
          id,
          email,
          name: `${first_name || ''} ${last_name || ''}`.trim() || null,
          plan: 'FREE',
        },
      });
      console.log('✓ User created successfully:', id, email);
      return new NextResponse('', { status: 200 });
    } catch (error: any) {
      console.error('✗ Error creating user:', {
        message: error?.message,
        code: error?.code,
        meta: error?.meta,
      });
      return new NextResponse(JSON.stringify({ error: error?.message || 'Unknown error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } else if (eventType === 'user.updated') {
    try {
      const email = email_addresses?.[0]?.email_address;
      if (!email) {
        console.warn('User updated event but no email found:', id);
        return new NextResponse('No email found for user', { status: 400 });
      }

      await prisma.user.update({
        where: { id },
        data: {
          email,
          name: `${first_name || ''} ${last_name || ''}`.trim() || null,
        },
      });
      console.log('✓ User updated successfully:', id);
      return new NextResponse('', { status: 200 });
    } catch (error: any) {
      console.error('✗ Error updating user:', error?.message);
      return new NextResponse(JSON.stringify({ error: error?.message || 'Unknown error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } else if (eventType === 'user.deleted') {
    try {
      await prisma.user.delete({
        where: { id },
      });
      console.log('✓ User deleted successfully:', id);
      return new NextResponse('', { status: 200 });
    } catch (error: any) {
      console.error('✗ Error deleting user:', error?.message);
      return new NextResponse(JSON.stringify({ error: error?.message || 'Unknown error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new NextResponse('', { status: 200 });
}