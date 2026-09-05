'use server';

import { getCreditHistory, getRecentSignatures } from '@/lib/db/queries';

export async function fetchUserHistory(userId: string) {
  try {
    const [transactions, signatures] = await Promise.all([
      getCreditHistory(userId, 5),
      getRecentSignatures(userId, 5),
    ]);

    return {
      transactions: transactions || [],
      signatures: signatures || [],
      error: null,
    };
  } catch (error) {
    console.error('Error fetching user history:', error);
    return {
      transactions: [],
      signatures: [],
      error: 'Error al cargar el historial',
    };
  }
}
