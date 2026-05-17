import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

function md5(str: string) {
  return createHash("md5").update(str).digest("hex");
}

function buildSign(params: Record<string, string>, key: string): string {
  const query = Object.entries(params)
    .filter(([k, v]) => k !== "sign" && k !== "sign_type" && v !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  return md5(query + "&key=" + key);
}

const PRICE: Record<string, string> = { basic: "29.00", pro: "59.00", max: "99.00" };
const NAME: Record<string, string> = { basic: "APSlay Basic", pro: "APSlay Pro", max: "APSlay Max" };

export async function POST(request: NextRequest) {
  try {
    const { tier } = await request.json() as { tier: string };
    if (!["basic", "pro", "max"].includes(tier)) {
      return NextResponse.json({ error: "无效套餐" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("aps_token")?.value;
    const payload = token ? await verifyToken(token) : null;
    if (!payload) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const pid = process.env.ZPAY_PID;
    const key = process.env.ZPAY_KEY;
    const domain = process.env.ZPAY_DOMAIN; // e.g. https://zpay.example.com
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    if (!pid || !key || !domain) {
      return NextResponse.json({ mockMode: true, tier });
    }

    const out_trade_no = `aps_${Date.now()}_${randomBytes(4).toString("hex")}`;

    await prisma.payment.create({
      data: {
        userId: payload.userId,
        tier,
        amount: parseFloat(PRICE[tier]),
        status: "pending",
        note: out_trade_no,
      },
    });

    const notify_url = `${baseUrl}/api/webhook/zpay`;
    const return_url = `${baseUrl}/dashboard`;
    const param = `${payload.userId}:${tier}:${out_trade_no}`;

    const params: Record<string, string> = {
      pid,
      type: "alipay",
      out_trade_no,
      notify_url,
      return_url,
      name: NAME[tier],
      money: PRICE[tier],
      param,
    };

    const sign = buildSign(params, key);
    const qs = new URLSearchParams({ ...params, sign, sign_type: "MD5" }).toString();
    const paymentUrl = `${domain}/submit.php?${qs}`;

    return NextResponse.json({ paymentUrl, out_trade_no, amount: PRICE[tier], tier });
  } catch (error) {
    console.error("create-order error:", error);
    return NextResponse.json({ error: "创建订单失败" }, { status: 500 });
  }
}
