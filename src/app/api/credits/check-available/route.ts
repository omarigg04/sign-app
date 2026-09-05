import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getOrCreateUserCredits } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const credits = await getOrCreateUserCredits(user.id);

    return NextResponse.json({
      canSign: credits.balance > 0,
      remaining: credits.balance,
      message: `Tienes ${credits.balance} crédito${credits.balance !== 1 ? 's' : ''} disponible${credits.balance !== 1 ? 's' : ''}`,
    }, { status: 200 });
  } catch (error) {
    console.error('Error checking credits:', error);
    return NextResponse.json({ error: 'Error checking credits' }, { status: 500 });
  }
}
