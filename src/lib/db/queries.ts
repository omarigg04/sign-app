import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { db } from './index';
import { users, signatures, type NewUser } from './schema';

// User operations
export async function createUser(data: {
  id: string;
  email: string;
  name: string | null;
  plan?: string;
}) {
  const now = new Date();
  const plan = data.plan || 'FREE';

  // Use raw SQL to avoid Drizzle/postgres-js null handling issues
  const result = await db.execute(sql`
    INSERT INTO "User" ("id", "email", "name", "plan", "stripeCustomerId", "createdAt", "updatedAt")
    VALUES (${data.id}, ${data.email}, ${data.name}, ${plan}::"plan", NULL, ${now}, ${now})
    ON CONFLICT ("id") DO UPDATE SET
      "email" = EXCLUDED."email",
      "name" = EXCLUDED."name",
      "updatedAt" = EXCLUDED."updatedAt"
    RETURNING *
  `);

  return result.rows[0];
}

export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

export async function getUserByStripeCustomerId(stripeCustomerId: string) {
  const [user] = await db.select().from(users).where(eq(users.stripeCustomerId, stripeCustomerId));
  return user;
}

export async function updateUser(id: string, data: Partial<Omit<NewUser, 'createdAt' | 'updatedAt'>>) {
  const [user] = await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, id)).returning();
  return user;
}

export async function deleteUser(id: string) {
  await db.delete(users).where(eq(users.id, id));
}

// Signature operations
export async function createSignature(data: { userId: string; fileName: string; weekNumber: string; monthYear: string }) {
  const id = `sig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const [signature] = await db.insert(signatures).values({
    id,
    userId: data.userId,
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
        eq(signatures.userId, userId),
        gte(signatures.signedAt, startDate),
        lte(signatures.signedAt, endDate)
      )
    );
  return result.length;
}
