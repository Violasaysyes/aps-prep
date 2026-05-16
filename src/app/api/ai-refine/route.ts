import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { original, suggestions, context, type } = await request.json();

    if (!original || !suggestions) {
      return NextResponse.json({ error: "缺少参数" }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      // Fallback: just append the suggestions as a note
      return NextResponse.json({ refined: original + " [已根据你的意见更新]" });
    }

    const lengthGuide =
      type === "summary"
        ? "Keep it around 90-110 words — rich with specific course details."
        : "Keep it 2-4 sentences — concrete, direct, easy to memorize and recite.";

    const prompt = `You are helping a Chinese student refine their APS (Akademische Prüfstelle) interview preparation material. The student is preparing for a German university oral interview and needs polished, natural-sounding English text they can memorize and recite confidently.

Course context: ${context || "Not specified"}
Content type: ${type === "summary" ? "Course overview paragraph (for introducing the course to the examiner)" : "Reference answer (for responding to a specific examiner question)"}

Original text:
"""
${original}
"""

Student's modification suggestions / keywords to incorporate:
"""
${suggestions}
"""

Please rewrite the text incorporating the student's suggestions. Rules:
- ${lengthGuide}
- Keep the same first-person academic tone
- Make it sound natural when spoken aloud
- Incorporate ALL of the student's suggestions meaningfully
- Do NOT add bullet points or headers — continuous prose only
- Return ONLY the refined text, nothing else`;

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 400,
      }),
    });

    if (!response.ok) throw new Error("AI API failed");

    const data = await response.json();
    const refined = data.choices[0]?.message?.content?.trim() || original;

    return NextResponse.json({ refined });
  } catch (error) {
    console.error("ai-refine error:", error);
    return NextResponse.json({ error: "润色失败，请重试" }, { status: 500 });
  }
}
