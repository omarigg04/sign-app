import { eq, and, gte, lte, sql, desc } from 'drizzle-orm';
import { db } from './index';
import {
  profiles,
  signatures,
  savedSignatures,
  creditPackages,
  userCredits,
  creditTransactions,
  type Profile,
  type Signature,
  type SavedSignature,
  type NewSavedSignature,
  type CreditPackage,
  type UserCredit,
  type CreditTransaction,
} from './schema';

// Profile operations
export async function getProfileById(id: string): Promise<Profile | undefined> {
  const [profile] = await db.select().from(profiles).where(eq(profiles.id, id));
  return profile;
}

export async function createProfile(userId: string): Promise<Profile> {
  const now = new Date();

  const result = await db.execute(sql`
    INSERT INTO profiles (id, plan, stripe_customer_id, created_at, updated_at)
    VALUES (${userId}::uuid, 'FREE'::"plan", NULL, ${now}, ${now})
    ON CONFLICT (id) DO UPDATE SET
      updated_at = EXCLUDED.updated_at
    RETURNING *
  `);

  return result[0] as Profile;
}

export async function updateProfile(id: string, data: { plan?: string; stripeCustomerId?: string | null }): Promise<Profile> {
  const now = new Date();

  // Build update object
  const updateData: any = { updatedAt: now };

  if (data.plan) {
    updateData.plan = data.plan;
  }

  if (data.stripeCustomerId !== undefined) {
    updateData.stripeCustomerId = data.stripeCustomerId;
  }

  const [result] = await db
    .update(profiles)
    .set(updateData)
    .where(eq(profiles.id, id))
    .returning();

  return result;
}

export async function getProfileByStripeCustomerId(stripeCustomerId: string): Promise<Profile | undefined> {
  const [profile] = await db.select().from(profiles).where(eq(profiles.stripeCustomerId, stripeCustomerId));
  return profile;
}

// Signature operations
export async function createSignature(data: { userId: string; fileName: string; weekNumber: string; monthYear: string }): Promise<Signature> {
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

export async function countSignatures(userId: string, startDate: Date, endDate: Date): Promise<number> {
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

// Saved Signatures operations (signature library)
export async function getSavedSignatures(userId: string): Promise<SavedSignature[]> {
  const result = await db
    .select()
    .from(savedSignatures)
    .where(eq(savedSignatures.userId, userId as any))
    .orderBy(savedSignatures.createdAt);
  return result;
}

export async function getSavedSignatureById(id: string, userId: string): Promise<SavedSignature | undefined> {
  const [signature] = await db
    .select()
    .from(savedSignatures)
    .where(
      and(
        eq(savedSignatures.id, id as any),
        eq(savedSignatures.userId, userId as any)
      )
    );
  return signature;
}

export async function createSavedSignature(data: { userId: string; name: string; imageData: string }): Promise<SavedSignature> {
  const [signature] = await db
    .insert(savedSignatures)
    .values({
      userId: data.userId as any,
      name: data.name,
      imageData: data.imageData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return signature;
}

export async function updateSavedSignature(id: string, userId: string, data: { name?: string; imageData?: string }): Promise<SavedSignature> {
  const updateData: any = { updatedAt: new Date() };

  if (data.name !== undefined) {
    updateData.name = data.name;
  }

  if (data.imageData !== undefined) {
    updateData.imageData = data.imageData;
  }

  const [signature] = await db
    .update(savedSignatures)
    .set(updateData)
    .where(
      and(
        eq(savedSignatures.id, id as any),
        eq(savedSignatures.userId, userId as any)
      )
    )
    .returning();
  return signature;
}

export async function deleteSavedSignature(id: string, userId: string): Promise<void> {
  await db
    .delete(savedSignatures)
    .where(
      and(
        eq(savedSignatures.id, id as any),
        eq(savedSignatures.userId, userId as any)
      )
    );
}

// ============ Credit Packages operations ============

export async function getCreditPackages(): Promise<CreditPackage[]> {
  const result = await db
    .select()
    .from(creditPackages)
    .where(eq(creditPackages.isActive, true))
    .orderBy(creditPackages.order);
  return result;
}

export async function getCreditPackageById(id: string): Promise<CreditPackage | undefined> {
  const [pkg] = await db
    .select()
    .from(creditPackages)
    .where(eq(creditPackages.id, id));
  return pkg;
}

// ============ User Credits operations ============

export async function getUserCredits(userId: string): Promise<UserCredit | undefined> {
  const [credits] = await db
    .select()
    .from(userCredits)
    .where(eq(userCredits.userId, userId as any));
  return credits;
}

export async function getOrCreateUserCredits(userId: string): Promise<UserCredit> {
  let credits = await getUserCredits(userId);
  if (!credits) {
    const [newCredits] = await db
      .insert(userCredits)
      .values({
        userId: userId as any,
        balance: 1, // 1 free signature to start
        lastFreeSignatureClaim: new Date(), // Track when they claimed it
      })
      .returning();
    return newCredits;
  }
  return credits;
}

export async function addCredits(
  userId: string,
  amount: number,
  description: string,
  relatedPaymentId?: string
): Promise<CreditTransaction> {
  try {
    // Get current balance
    const userCredit = await getOrCreateUserCredits(userId);
    console.log(`[addCredits] Current balance for ${userId}:`, userCredit.balance);

    const newBalance = userCredit.balance + amount;
    console.log(`[addCredits] New balance will be:`, newBalance);

    // Update balance
    const updateResult = await db
      .update(userCredits)
      .set({ balance: newBalance, updatedAt: new Date() })
      .where(eq(userCredits.userId, userId as any))
      .returning();

    console.log(`[addCredits] Balance updated. Rows affected:`, updateResult.length);

    if (updateResult.length === 0) {
      throw new Error('Failed to update user credits balance - no rows updated');
    }

    // Create transaction record
    const [transaction] = await db
      .insert(creditTransactions)
      .values({
        userId: userId as any,
        type: 'purchase',
        amount,
        description,
        relatedPaymentId,
        balance: newBalance,
      })
      .returning();

    console.log(`[addCredits] Transaction recorded:`, transaction.id);

    if (!transaction) {
      throw new Error('Failed to create transaction record');
    }

    return transaction;
  } catch (error) {
    console.error(`[addCredits] ERROR:`, error);
    throw error;
  }
}

export async function regenerateFreeSignature(userId: string): Promise<boolean> {
  try {
    const userCredit = await getOrCreateUserCredits(userId);

    // Only regenerate if balance is 0
    if (userCredit.balance > 0) {
      console.log(`[regenerateFreeSignature] User ${userId} has ${userCredit.balance} credits, no regeneration needed`);
      return false;
    }

    // Check if a week has passed since last claim
    const lastClaim = userCredit.lastFreeSignatureClaim;
    const now = new Date();
    const weekInMs = 7 * 24 * 60 * 60 * 1000;

    if (lastClaim && now.getTime() - lastClaim.getTime() < weekInMs) {
      console.log(`[regenerateFreeSignature] User ${userId} claimed too recently, wait ${weekInMs - (now.getTime() - lastClaim.getTime())}ms`);
      return false;
    }

    // Regenerate the free signature
    console.log(`[regenerateFreeSignature] Regenerating free signature for ${userId}`);

    await db
      .update(userCredits)
      .set({
        balance: 1,
        lastFreeSignatureClaim: now,
        updatedAt: new Date()
      })
      .where(eq(userCredits.userId, userId as any));

    // Record the transaction
    await db
      .insert(creditTransactions)
      .values({
        userId: userId as any,
        type: 'purchase',
        amount: 1,
        description: 'Firma gratuita semanal regenerada',
        balance: 1,
      });

    console.log(`[regenerateFreeSignature] Free signature regenerated successfully for ${userId}`);
    return true;
  } catch (error) {
    console.error(`[regenerateFreeSignature] ERROR:`, error);
    return false;
  }
}

export async function useCredits(
  userId: string,
  amount: number,
  relatedSignatureId: string
): Promise<CreditTransaction> {
  // Get current balance
  const userCredit = await getOrCreateUserCredits(userId);
  const newBalance = Math.max(0, userCredit.balance - amount);

  // Update balance
  await db
    .update(userCredits)
    .set({ balance: newBalance, updatedAt: new Date() })
    .where(eq(userCredits.userId, userId as any));

  // Create transaction record
  const [transaction] = await db
    .insert(creditTransactions)
    .values({
      userId: userId as any,
      type: 'use',
      amount: -amount,
      description: `Firma en PDF`,
      relatedSignatureId: relatedSignatureId as any,
      balance: newBalance,
    })
    .returning();

  return transaction;
}

export async function getCreditHistory(userId: string, limit: number = 50): Promise<CreditTransaction[]> {
  const result = await db
    .select()
    .from(creditTransactions)
    .where(eq(creditTransactions.userId, userId as any))
    .orderBy(desc(creditTransactions.createdAt))
    .limit(limit);
  return result;
}

// Get user's recent signatures
export async function getRecentSignatures(userId: string, limit: number = 10): Promise<Signature[]> {
  const result = await db
    .select()
    .from(signatures)
    .where(eq(signatures.userId, userId as any))
    .orderBy(desc(signatures.signedAt))
    .limit(limit);
  return result;
}
