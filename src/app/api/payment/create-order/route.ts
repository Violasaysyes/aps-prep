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
const NAME: Record<string, string> = {
  basic: "APSlay Basic会员",
  pro: "APSlay Pro会员",
  max: "APSlay Max会员",
};

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
    const domain = process.env.ZPAY_DOMAIN || "https://zpayz.cn";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://apslay.com";

    if (!pid || !key) {
      return NextResponse.json({ mockMode: true, tier });
    }

    const out_trade_no = `aps${Date.now()}${randomBytes(3).toString("hex")}`;

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
    // Get user IP for Zpay MAPI requirement
    const clientip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";

    const params: Record<string, string> = {
      pid,
      type: "alipay",
      out_trade_no,
      notify_url,
      name: NAME[tier],
      money: PRICE[tier],
      clientip,
      param,
    };

    const sign = buildSign(params, key);

    // Use MAPI — returns qrcode/img directly instead of page redirect
    const body = new URLSearchParams({ ...params, sign, sign_type: "MD5", return_url });
    const zpayRes = await fetch(`${domain}/mapi.php`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const zpayData = await zpayRes.json();
    console.log("[zpay mapi]", zpayData);

    if (zpayData.code !== 1) {
      throw new Error(zpayData.msg || "Zpay创建订单失败");
    }

    return NextResponse.json({
      qrImg: zpayData.img ?? null,       // direct QR image URL
      qrCode: zpayData.qrcode ?? zpayData.payurl ?? null, // URL to generate QR from
      out_trade_no,
      amount: PRICE[tier],
      tier,
    });
  } catch (error) {
    console.error("create-order error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "创建订单失败" },
      { status: 500 }
    );
  }
}
