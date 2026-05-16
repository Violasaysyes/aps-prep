import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { major, university, examLang, name, background, motivation } = body;

    if (!major) {
      return NextResponse.json({ error: "请选择专业方向" }, { status: 400 });
    }

    const langLabel = examLang === "german" ? "德语" : "英语";
    const targetLang = examLang === "german" ? "German" : "English";

    const prompt = `你是一位APS面试辅导专家。请为以下学生生成一段APS面试用的自我介绍。

学生信息：
- 姓名：${name || "（未提供）"}
- 专业方向：${major}
- 目标德国大学：${university || "（未确定）"}
- 学校和专业背景：${background || "（未提供）"}
- 留德动机：${motivation || "（未提供）"}
- 面试语言：${langLabel}

要求：
1. 先输出中文版本，再输出${targetLang}版本
2. 自我介绍时长控制在1-2分钟（约150-200词）
3. 内容包含：问候、姓名、学校专业、为什么选择去德国、为什么选择这个专业方向、对未来的规划
4. 语言自然流畅，不要太书面化
5. 展现对专业的热情和对德国教育的了解
6. 用"---"分隔中文和${targetLang}版本

请直接输出自我介绍内容，不要添加额外说明。`;

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { intro: generateFallbackIntro(name, major, university, background, motivation, examLang) },
        { status: 200 }
      );
    }

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error("AI API request failed");
    }

    const data = await response.json();
    const intro = data.choices[0]?.message?.content || "";

    return NextResponse.json({ intro });
  } catch (error) {
    console.error("Generate intro error:", error);
    return NextResponse.json(
      { error: "生成失败，请重试" },
      { status: 500 }
    );
  }
}

function generateFallbackIntro(
  name: string,
  major: string,
  university: string,
  background: string,
  motivation: string,
  examLang: string
): string {
  const studentName = name || "同学";
  const uni = university || "德国的大学";
  const bg = background || `${major}专业`;

  const cnIntro = `您好，我叫${studentName}。我目前就读于${bg}。我选择去德国留学是因为德国在${major}领域有着卓越的教育资源和研究实力。${motivation ? `我的目标是${motivation}。` : `我希望能在${uni}继续深造。`}在本科阶段的学习中，我对${major}产生了浓厚的兴趣，希望能在德国获得更深入的学术训练和国际化视野。感谢您给我这次面试的机会。`;

  const enIntro = examLang === "german"
    ? `Guten Tag, mein Name ist ${studentName}. Ich studiere derzeit ${bg}. Ich habe mich für ein Studium in Deutschland entschieden, weil Deutschland im Bereich ${major} über hervorragende Bildungsressourcen verfügt. ${motivation ? `Mein Ziel ist es, ${motivation}.` : `Ich hoffe, mein Studium an ${uni} fortsetzen zu können.`} Vielen Dank für die Gelegenheit zu diesem Gespräch.`
    : `Hello, my name is ${studentName}. I am currently studying ${bg}. I chose to study in Germany because of its excellent educational resources and research strength in ${major}. ${motivation ? `My goal is to ${motivation}.` : `I hope to continue my studies at ${uni}.`} During my undergraduate studies, I developed a strong interest in ${major} and hope to gain deeper academic training and an international perspective in Germany. Thank you for giving me this interview opportunity.`;

  return `${cnIntro}\n\n---\n\n${enIntro}`;
}
