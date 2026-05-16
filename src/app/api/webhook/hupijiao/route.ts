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

export async function POST(request: NextRequest) {
  try {
    const key = process.env.HUPIJIAO_KEY;
    if (!key) {
      console.error("HUPIJIAO_KEY not set");
      return new NextResponse("error", { status: 500 });
    }

    // 虎皮椒 sends form-encoded body
    const body = await request.text();
    const params = Object.fromEntries(new URLSearchParams(body).entries());

    console.log("[hupijiao webhook]", params);

    // Verify signature
    if (!verifySign(params, key)) {
      console.error("[hupijiao] signature mismatch", params);
      return new NextResponse("fail", { status: 400 });
    }

    // Only handle successful payments
    if (params["trade_status"] !== "TRADE_SUCCESS") {
      return new NextResponse("success"); // acknowledge but skip
    }

    // Parse param: userId:tier:out_trade_no
    const param = params["param"] ?? "";
    const [userId, tier, out_trade_no] = param.split(":");

    if (!userId || !tier || !["basic", "pro", "max"].includes(tier)) {
      console.error("[hupijiao] invalid param:", param);
      return new NextResponse("fail", { status: 400 });
    }

    // Update payment record and user tier in a transaction
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

    console.log(`[hupijiao] ✅ activated ${tier} for user ${userId}`);

    // 虎皮椒 requires exactly "success" in response body
    return new NextResponse("success");
  } catch (error) {
    console.error("[hupijiao webhook error]", error);
    return new NextResponse("fail", { status: 500 });
  }
}
