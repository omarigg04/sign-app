import type { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

const getPrismaClient = (): PrismaClient => {
  if (!prisma) {
    // @ts-ignore
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient();

    if (process.env.NODE_ENV !== 'production') {
      globalThis.prisma = prisma;
    }
  }

  return prisma;
};

export default getPrismaClient();
