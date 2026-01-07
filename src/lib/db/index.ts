import { PrismaClient } from '@prisma/client';

// Mock implementation for Prisma Client
const mockPrisma = {
  user: {
    findUnique: async (args: { where: { id?: string; email?: string }, select?: any }) => {
      console.log('--- MOCK DB: findUnique user ---', args);
      if (args.where.id || args.where.email) {
        const fullUser = {
          id: 'mock-user-id',
          email: 'mock@example.com',
          name: 'Mock User',
          plan: 'FREE',
          stripeCustomerId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        if (args.select) {
          const selectedUser: any = {};
          for (const key in args.select) {
            if (args.select[key] === true) {
              selectedUser[key] = (fullUser as any)[key];
            }
          }
          return Promise.resolve(selectedUser);
        }
        return Promise.resolve(fullUser);
      }
      return Promise.resolve(null);
    },
    findFirst: async (args: { where: any, select?: any }) => {
      console.log('--- MOCK DB: findFirst user ---', args);
      if (args.where.stripeCustomerId) {
        const fullUser = {
          id: 'mock-user-id',
          email: 'mock@example.com',
          name: 'Mock User',
          plan: 'PREMIUM',
          stripeCustomerId: args.where.stripeCustomerId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        if (args.select) {
          const selectedUser: any = {};
          for (const key in args.select) {
            if (args.select[key] === true) {
              selectedUser[key] = (fullUser as any)[key];
            }
          }
          return Promise.resolve(selectedUser);
        }
        return Promise.resolve(fullUser);
      }
      return Promise.resolve(null);
    },
    findMany: async (args?: any) => {
      console.log('--- MOCK DB: findMany users ---', args);
      return Promise.resolve([]);
    },
    create: async (args: { data: any }) => {
      console.log('--- MOCK DB: create user ---', args);
      return Promise.resolve({ ...args.data, id: `mock-user-${Date.now()}`, createdAt: new Date(), updatedAt: new Date() });
    },
    update: async (args: { where: { id: string }, data: any, select?: any }) => {
      console.log('--- MOCK DB: update user ---', args);
      const updatedUser = { id: args.where.id, ...args.data, updatedAt: new Date() };

      if (args.select) {
          const selectedUser: any = {};
          for (const key in args.select) {
            if (args.select[key] === true) {
              selectedUser[key] = (updatedUser as any)[key];
            }
          }
          return Promise.resolve(selectedUser);
        }

      return Promise.resolve(updatedUser);
    },
    delete: async (args: { where: { id: string } }) => {
      console.log('--- MOCK DB: delete user ---', args);
      return Promise.resolve({ id: args.where.id });
    },
  },
  signature: {
    findUnique: async (args: { where: { id: string }, select?: any }) => {
      console.log('--- MOCK DB: findUnique signature ---', args);
      return Promise.resolve(null);
    },
    findMany: async (args?: any) => {
      console.log('--- MOCK DB: findMany signatures ---', args);
      return Promise.resolve([]);
    },
    create: async (args: { data: any }) => {
      console.log('--- MOCK DB: create signature ---', args);
      return Promise.resolve({ ...args.data, id: `mock-sig-${Date.now()}`, signedAt: new Date() });
    },
    count: async (args?: any) => {
      console.log('--- MOCK DB: count signatures ---', args);
      return Promise.resolve(0);
    }
  },
};

export const prisma: PrismaClient = mockPrisma;
export default prisma;
