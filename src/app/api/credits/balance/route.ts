import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getOrCreateUserCredits, getCreditHistory } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const credits = await getOrCreateUserCredits(user.id);
    const history = await getCreditHistory(user.id, 10);

    return NextResponse.json({
      balance: credits.balance,
      history,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching credit balance:', error);
    return NextResponse.json({ error: 'Error fetching balance' }, { status: 500 });
  }
}
