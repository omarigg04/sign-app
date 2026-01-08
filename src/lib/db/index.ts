import type { PrismaClient } from '@prisma/client';

let cachedPrisma: PrismaClient | undefined;

const getPrismaClient = (): PrismaClient => {
  if (cachedPrisma) return cachedPrisma;

  if (typeof window !== 'undefined') {
    throw new Error('Prisma Client cannot be used in the browser');
  }

  if (globalThis.prisma) {
    cachedPrisma = globalThis.prisma;
    return cachedPrisma;
  }

  // Use dynamic require to avoid initialization at compile time
  const module = require('@prisma/client');
  const { PrismaClient } = module;
  const newClient = new PrismaClient();
  cachedPrisma = newClient;

  if (process.env.NODE_ENV !== 'production') {
    (globalThis as any).prisma = newClient;
  }

  return newClient;
};

// Create a proxy that initializes Prisma on first property access
const prisma = new Proxy({} as any, {
  get: (target: any, prop: string) => {
    const client = getPrismaClient();
    return (client as any)[prop];
  },
});

export default prisma;
export { prisma };
export type { PrismaClient };
