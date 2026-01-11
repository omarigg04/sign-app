import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserById, countSignatures } from '@/lib/db/queries';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { plan } = user;

    // Get current week and month
    const now = new Date();
    const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 }); // Monday as start of week
    const endOfCurrentWeek = endOfWeek(now, { weekStartsOn: 1 });
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);

    // Count signatures in the current period based on the user's plan
    let signaturesCount = 0;
    let maxSignatures = plan === 'PREMIUM' ? 50 : 1;

    if (plan === 'FREE') {
      // FREE plan: 1 signature per week
      signaturesCount = await countSignatures(userId, startOfCurrentWeek, endOfCurrentWeek);
    } else if (plan === 'PREMIUM') {
      // PREMIUM plan: 50 signatures per month
      signaturesCount = await countSignatures(userId, startOfCurrentMonth, endOfCurrentMonth);
    }

    const canSign = signaturesCount < maxSignatures;
    const remaining = maxSignatures - signaturesCount;

    return NextResponse.json({
      canSign,
      remaining,
      signaturesCount,
      maxSignatures,
      plan,
      period: plan === 'FREE' ? 'week' : 'month',
    }, { status: 200 });
  } catch (error) {
    console.error('Error checking signature limit:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}