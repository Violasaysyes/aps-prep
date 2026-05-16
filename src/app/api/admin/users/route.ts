import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-admin-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const search = request.nextUrl.searchParams.get("q") ?? "";
  const page = parseInt(request.nextUrl.searchParams.get("page") ?? "1");
  const pageSize = 20;

  const where = search
    ? { email: { contains: search, mode: "insensitive" as const } }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        tier: true,
        createdAt: true,
        payments: {
          where: { status: "paid" },
          select: { amount: true, tier: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  // Stats (always full, not paginated)
  const [tierCounts, paidTotal] = await Promise.all([
    prisma.user.groupBy({ by: ["tier"], _count: { id: true } }),
    prisma.payment.aggregate({
      where: { status: "paid" },
      _sum: { amount: true },
    }),
  ]);

  const stats = {
    total,
    tiers: Object.fromEntries(tierCounts.map((t) => [t.tier, t._count.id])),
    revenue: paidTotal._sum.amount ?? 0,
  };

  return NextResponse.json({ users, stats, page, pageSize, total });
}
