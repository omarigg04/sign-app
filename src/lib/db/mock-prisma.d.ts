// src/lib/db/mock-prisma.d.ts

declare module '@prisma/client' {
  export class PrismaClient {
    user: {
      findUnique(args: { where: { id?: string; email?: string }; select?: any }): Promise<any>;
      findFirst(args: { where: any; select?: any }): Promise<any>;
      findMany(args?: any): Promise<any[]>;
      create(args: { data: any }): Promise<any>;
      update(args: { where: { id: string }; data: any; select?: any }): Promise<any>;
      delete(args: { where: { id: string } }): Promise<any>;
    };
    signature: {
      findUnique(args: { where: { id: string }; select?: any }): Promise<any>;
      findMany(args?: any): Promise<any[]>;
      create(args: { data: any }): Promise<any>;
      count(args?: any): Promise<number>;
    };
  }
}
