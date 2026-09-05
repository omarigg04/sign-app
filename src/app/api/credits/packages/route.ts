import { NextResponse } from 'next/server';
import { getCreditPackages } from '@/lib/db/queries';

export async function GET() {
  try {
    const packages = await getCreditPackages();
    return NextResponse.json({ packages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching credit packages:', error);
    return NextResponse.json({ error: 'Error fetching packages' }, { status: 500 });
  }
}
