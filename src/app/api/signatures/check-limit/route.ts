import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getProfileById, countSignatures, createProfile } from '@/lib/db/queries';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    // Get authenticated user from Supabase
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create profile
    let profile = await getProfileById(user.id);
    if (!profile) {
      profile = await createProfile(user.id);
    }

    const { plan } = profile;

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
      signaturesCount = await countSignatures(user.id, startOfCurrentWeek, endOfCurrentWeek);
    } else if (plan === 'PREMIUM') {
      // PREMIUM plan: 50 signatures per month
      signaturesCount = await countSignatures(user.id, startOfCurrentMonth, endOfCurrentMonth);
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
