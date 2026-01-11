import type { PrismaClient } from '@prisma/client';

let prismaInstance: any = null;

function getPrisma() {
  if (prismaInstance) {
    return prismaInstance;
  }

  // Dynamically import to avoid Turbopack compilation issues
  const { PrismaClient: PC } = require('@prisma/client');

  if ((global as any).prisma) {
    prismaInstance = (global as any).prisma;
  } else {
    prismaInstance = new PC({
      log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    });

    if (process.env.NODE_ENV !== 'production') {
      (global as any).prisma = prismaInstance;
    }
  }

  return prismaInstance;
}

// Export a getter object that initializes Prisma on first access
const prisma = new Proxy({} as any, {
  get: (target, prop) => {
    const client = getPrisma();
    return (client as any)[prop];
  },
}) as PrismaClient;

export default prisma;
export { prisma };
