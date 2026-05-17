import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

function md5(str: string) {
  return createHash("md5").update(str).digest("hex");
}

function verifySign(params: Record<string, string>, key: string): boolean {
  const expected = params["sign"];
  if (!expected) return false;
  const computed = Object.entries(params)
    .filter(([k, v]) => k !== "sign" && k !== "sign_type" && v !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  return md5(computed + "&key=" + key) === expected;
}

// Zpay sends async notifications via GET
export async function GET(request: NextRequest) {
  try {
    const key = process.env.ZPAY_KEY;
    if (!key) {
      console.error("[zpay] ZPAY_KEY not set");
      return new NextResponse("error", { status: 500 });
    }

    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    console.log("[zpay webhook]", params);

    if (!verifySign(params, key)) {
      console.error("[zpay] signature mismatch");
      return new NextResponse("fail", { status: 400 });
    }

    if (params["trade_status"] !== "TRADE_SUCCESS") {
      return new NextResponse("success");
    }

    // param encodes userId:tier:out_trade_no
    const [userId, tier, out_trade_no] = (params["param"] ?? "").split(":");
    if (!userId || !tier || !["basic", "pro", "max"].includes(tier)) {
      console.error("[zpay] invalid param:", params["param"]);
      return new NextResponse("fail", { status: 400 });
    }

    // Idempotent: check if already processed
    const existing = await prisma.payment.findFirst({
      where: { note: out_trade_no, status: "paid" },
    });
    if (existing) {
      console.log("[zpay] already processed:", out_trade_no);
      return new NextResponse("success");
    }

    await prisma.$transaction([
      prisma.payment.updateMany({
        where: { note: out_trade_no, status: "pending" },
        data: { status: "paid" },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { tier },
      }),
    ]);

    console.log(`[zpay] ✅ activated ${tier} for user ${userId}`);
    return new NextResponse("success");
  } catch (error) {
    console.error("[zpay webhook error]", error);
    return new NextResponse("fail", { status: 500 });
  }
}
