import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserById, countSignatures, createSignature } from '@/lib/db/queries';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get fileName from request body
    const body = await req.json();
    const { fileName } = body;

    if (!fileName) {
      return NextResponse.json({ error: 'fileName is required' }, { status: 400 });
    }

    // Get user from database to check their plan
    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { plan } = user;

    // Get current week and month for calculating periods
    const now = new Date();
    const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 });
    const endOfCurrentWeek = endOfWeek(now, { weekStartsOn: 1 });
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);

    // Count signatures in the current period based on the user's plan
    let signaturesCount = 0;
    let maxSignatures = plan === 'PREMIUM' ? 50 : 1;

    if (plan === 'FREE') {
      // FREE plan: check signatures this week
      signaturesCount = await countSignatures(userId, startOfCurrentWeek, endOfCurrentWeek);
    } else if (plan === 'PREMIUM') {
      // PREMIUM plan: check signatures this month
      signaturesCount = await countSignatures(userId, startOfCurrentMonth, endOfCurrentMonth);
    }

    // Check if user has exceeded their limit
    if (signaturesCount >= maxSignatures) {
      return NextResponse.json({
        error: `Signature limit exceeded. Plan: ${plan}. Max signatures: ${maxSignatures} per ${plan === 'FREE' ? 'week' : 'month'}.`
      }, { status: 403 });
    }

    // Register the new signature
    const weekNumber = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(getWeekNumber(now)).padStart(2, '0')}`;
    const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const newSignature = await createSignature({
      userId,
      fileName,
      weekNumber,
      monthYear,
    });

    return NextResponse.json({
      success: true,
      signature: newSignature,
      message: 'Signature registered successfully',
    }, { status: 200 });
  } catch (error) {
    console.error('Error registering signature:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to get week number
function getWeekNumber(d: Date) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}