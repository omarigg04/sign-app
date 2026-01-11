import { pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const planEnum = pgEnum('plan', ['FREE', 'PREMIUM']);

export const users = pgTable('User', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  plan: planEnum('plan').notNull().default('FREE'),
  stripeCustomerId: text('stripeCustomerId').unique().default(sql`NULL`),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const signatures = pgTable('Signature', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  fileName: text('fileName').notNull(),
  signedAt: timestamp('signedAt').notNull().defaultNow(),
  weekNumber: text('weekNumber').notNull(),
  monthYear: text('monthYear').notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Signature = typeof signatures.$inferSelect;
export type NewSignature = typeof signatures.$inferInsert;
