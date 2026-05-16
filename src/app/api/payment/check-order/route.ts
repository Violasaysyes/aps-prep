import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const out_trade_no = request.nextUrl.searchParams.get("out_trade_no");
  if (!out_trade_no) {
    return NextResponse.json({ error: "缺少 out_trade_no" }, { status: 400 });
  }

  try {
    const payment = await prisma.payment.findFirst({
      where: { note: out_trade_no },
      select: { status: true, tier: true },
    });

    if (!payment) {
      return NextResponse.json({ paid: false });
    }

    return NextResponse.json({
      paid: payment.status === "paid",
      tier: payment.tier,
    });
  } catch (error) {
    console.error("check-order error:", error);
    return NextResponse.json({ error: "查询失败" }, { status: 500 });
  }
}
