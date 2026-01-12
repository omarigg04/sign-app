import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { db } from './index';
import { profiles, signatures } from './schema';

// Profile operations
export async function getProfileById(id: string) {
  const [profile] = await db.select().from(profiles).where(eq(profiles.id, id));
  return profile;
}

export async function createProfile(userId: string) {
  const now = new Date();

  const result = await db.execute(sql`
    INSERT INTO profiles (id, plan, stripe_customer_id, created_at, updated_at)
    VALUES (${userId}::uuid, 'FREE'::"plan", NULL, ${now}, ${now})
    ON CONFLICT (id) DO UPDATE SET
      updated_at = EXCLUDED.updated_at
    RETURNING *
  `);

  return result[0];
}

export async function updateProfile(id: string, data: { plan?: string; stripeCustomerId?: string | null }) {
  const now = new Date();
  const updates: string[] = ['updated_at = $1'];
  const values: any[] = [now];
  let paramIndex = 2;

  if (data.plan) {
    updates.push(`plan = $${paramIndex}::"plan"`);
    values.push(data.plan);
    paramIndex++;
  }

  if (data.stripeCustomerId !== undefined) {
    updates.push(`stripe_customer_id = $${paramIndex}`);
    values.push(data.stripeCustomerId);
    paramIndex++;
  }

  const result = await db.execute(sql.raw(`
    UPDATE profiles
    SET ${updates.join(', ')}
    WHERE id = $${paramIndex}::uuid
    RETURNING *
  `, [...values, id]));

  return result[0];
}

export async function getProfileByStripeCustomerId(stripeCustomerId: string) {
  const [profile] = await db.select().from(profiles).where(eq(profiles.stripeCustomerId, stripeCustomerId));
  return profile;
}

// Signature operations
export async function createSignature(data: { userId: string; fileName: string; weekNumber: string; monthYear: string }) {
  const id = `sig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const [signature] = await db.insert(signatures).values({
    id,
    userId: data.userId as any,
    fileName: data.fileName,
    signedAt: new Date(),
    weekNumber: data.weekNumber,
    monthYear: data.monthYear,
  }).returning();
  return signature;
}

export async function countSignatures(userId: string, startDate: Date, endDate: Date) {
  const result = await db
    .select()
    .from(signatures)
    .where(
      and(
        eq(signatures.userId, userId as any),
        gte(signatures.signedAt, startDate),
        lte(signatures.signedAt, endDate)
      )
    );
  return result.length;
}
