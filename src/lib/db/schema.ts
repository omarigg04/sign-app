import { pgTable, text, timestamp, pgEnum, uuid, integer, numeric, boolean } from 'drizzle-orm/pg-core';

export const planEnum = pgEnum('plan', ['FREE', 'BASICO', 'PREMIUM']);

// Supabase Auth creates auth.users automatically
// We create a profiles table that references it
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // References auth.users(id)
  plan: planEnum('plan').notNull(),
  stripeCustomerId: text('stripe_customer_id').unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const signatures = pgTable('signatures', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull(), // References auth.users(id)
  fileName: text('file_name').notNull(),
  signedAt: timestamp('signed_at').notNull(),
  weekNumber: text('week_number').notNull(),
  monthYear: text('month_year').notNull(),
});

// Saved signatures library - stores user's reusable signatures
export const savedSignatures = pgTable('saved_signatures', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(), // References auth.users(id)
  name: text('name').notNull(), // User-friendly name like "Formal", "Initial", "Rubric"
  imageData: text('image_data').notNull(), // Base64 data URL of the signature
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Credit packages - predefined packages for sale
export const creditPackages = pgTable('credit_packages', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(), // "Bolsa Chica", "Bolsa Media", etc
  price: numeric('price', { precision: 10, scale: 2 }).notNull(), // In MXN
  creditAmount: integer('credit_amount').notNull(), // Number of signatures
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true),
  order: integer('order').notNull().default(0), // For ordering in UI
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// User credits - tracks balance for each user
export const userCredits = pgTable('user_credits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(), // References profiles.id
  balance: integer('balance').notNull().default(0), // Available credits
  lastFreeSignatureClaim: timestamp('last_free_signature_claim'), // Track weekly free signature regeneration
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Credit transactions - audit log of all credit movements
export const creditTransactions = pgTable('credit_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(), // References profiles.id
  type: text('type').notNull(), // 'purchase' | 'use' | 'refund'
  amount: integer('amount').notNull(), // Quantity of credits (positive or negative)
  description: text('description'),
  relatedSignatureId: text('related_signature_id'), // For type 'use' - references signatures.id (which is text)
  relatedPaymentId: text('related_payment_id'), // For type 'purchase' (Stripe)
  balance: integer('balance').notNull(), // Balance after this transaction
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Signature = typeof signatures.$inferSelect;
export type NewSignature = typeof signatures.$inferInsert;
export type SavedSignature = typeof savedSignatures.$inferSelect;
export type NewSavedSignature = typeof savedSignatures.$inferInsert;
export type CreditPackage = typeof creditPackages.$inferSelect;
export type NewCreditPackage = typeof creditPackages.$inferInsert;
export type UserCredit = typeof userCredits.$inferSelect;
export type NewUserCredit = typeof userCredits.$inferInsert;
export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type NewCreditTransaction = typeof creditTransactions.$inferInsert;
