import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// Lazy singleton — only instantiates when a property is first accessed,
// NOT at module import time. This prevents build-time failures on Vercel.
function createPrisma(): PrismaClient {
  if (global.__prisma) return global.__prisma;
  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
  if (process.env.NODE_ENV !== "production") global.__prisma = client;
  return client;
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return createPrisma()[prop as keyof PrismaClient];
  },
});
