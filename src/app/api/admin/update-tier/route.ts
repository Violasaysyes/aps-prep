import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/admin/update-tier
// Headers: x-admin-secret  OR  Body: { secret, ... }
// Body: { email?, userId?, tier }
// Tier: "none" | "basic" | "pro" | "max"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, userId, tier } = body;

    const secret =
      req.headers.get("x-admin-secret") ?? body.secret ?? body.adminSecret;

    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "无权操作" }, { status: 403 });
    }

    if (!["none", "basic", "pro", "max"].includes(tier)) {
      return NextResponse.json({ error: "无效的 tier" }, { status: 400 });
    }

    if (!email && !userId) {
      return NextResponse.json({ error: "需要 email 或 userId" }, { status: 400 });
    }

    const where = userId ? { id: userId } : { email: (email as string).toLowerCase() };
    const user = await prisma.user.update({ where, data: { tier } });

    // Record payment for paid upgrades
    if (tier !== "none") {
      const PRICE: Record<string, number> = { basic: 29, pro: 59, max: 99 };
      await prisma.payment.create({
        data: {
          userId: user.id,
          tier,
          amount: PRICE[tier],
          status: "paid",
          note: "管理员手动",
        },
      });
    }

    return NextResponse.json({ success: true, email: user.email, tier: user.tier });
  } catch (err) {
    console.error("[update-tier]", err);
    return NextResponse.json({ error: "更新失败，用户可能不存在" }, { status: 500 });
  }
}
