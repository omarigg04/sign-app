import { Webhook } from 'svix';
import { buffer } from 'micro';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('CLERK_WEBHOOK_SECRET is not set');
  }

  // Get the headers
  const headerPayload = headers();
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
  const body = await buffer(req);
  const payload = body.toString();

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
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
    await prisma.user.create({
      data: {
        id,
        email: email_addresses[0].email_address,
        name: `${first_name || ''} ${last_name || ''}`.trim() || null,
        plan: 'FREE', // Default to FREE plan
      },
    });
  } else if (eventType === 'user.updated') {
    await prisma.user.update({
      where: { id },
      data: {
        email: email_addresses[0].email_address,
        name: `${first_name || ''} ${last_name || ''}`.trim() || null,
      },
    });
  } else if (eventType === 'user.deleted') {
    await prisma.user.delete({
      where: { id },
    });
  }

  return new NextResponse('', { status: 200 });
}