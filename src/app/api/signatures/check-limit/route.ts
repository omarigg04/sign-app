import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getProfileById, createProfile, getOrCreateUserCredits, regenerateFreeSignature } from '@/lib/db/queries';

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

    // Get or create user's credit balance (creates with 1 free signature if new)
    let userCredits = await getOrCreateUserCredits(user.id);
    let remaining = userCredits.balance;

    // Try to regenerate free signature if needed
    if (remaining === 0) {
      const regenerated = await regenerateFreeSignature(user.id);
      if (regenerated) {
        // Refresh the balance after regeneration
        userCredits = await getOrCreateUserCredits(user.id);
        remaining = userCredits.balance;
      }
    }

    const canSign = remaining > 0;

    return NextResponse.json({
      canSign,
      remaining,
      system: 'credits',
    }, { status: 200 });
  } catch (error) {
    console.error('Error checking credits:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
