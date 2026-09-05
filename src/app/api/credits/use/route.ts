import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getOrCreateUserCredits, useCredits } from '@/lib/db/queries';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const signatureId = body.signatureId;

    if (!signatureId) {
      return NextResponse.json({ error: 'signatureId required' }, { status: 400 });
    }

    // Verify user has credits
    const userCredits = await getOrCreateUserCredits(user.id);
    if (userCredits.balance <= 0) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
    }

    // Use 1 credit
    await useCredits(user.id, 1, signatureId);

    // Get updated balance
    const updatedCredits = await getOrCreateUserCredits(user.id);

    return NextResponse.json({
      success: true,
      remainingCredits: updatedCredits.balance,
    }, { status: 200 });
  } catch (error) {
    console.error('Error using credit:', error);
    return NextResponse.json({ error: 'Error using credit' }, { status: 500 });
  }
}
