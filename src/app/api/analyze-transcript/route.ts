import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const major = formData.get("major") as string;
    const university = formData.get("university") as string;
    const examLang = formData.get("examLang") as string;

    if (!file || !major) {
      return NextResponse.json(
        { error: "请上传成绩单并选择专业" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let textContent = "";

    const fileName = file.name.toLowerCase();
    if (fileName.endsWith(".pdf")) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
      const { PDFParse } = require("pdf-parse") as any;
      const parser = new PDFParse({ data: buffer });
      const textResult = await parser.getText();
      textContent = (textResult.pages as Array<{ text: string }>).map((p) => p.text).join("\n");
    } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      textContent = result.value;
    } else {
      return NextResponse.json(
        { error: "不支持的文件格式，请上传PDF或Word文件" },
        { status: 400 }
      );
    }

    if (!textContent.trim()) {
      return NextResponse.json(
        { error: "无法解析文件���容，请确认文件不是扫描件" },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(generateFallbackAnalysis(textContent, major));
    }

    const prompt = `你是一位资深APS面试辅导专家。请分析以下学生的成绩单，判断每门课程在APS面试中被考官提问的风险等级。

学生专业：${major}
目标大学：${university || "未指定"}
面试语言：${examLang === "german" ? "德语" : "英语"}

成绩单内容：
${textContent.substring(0, 4000)}

请按以下JSON格式返回分析结果（确保是合法JSON）：
{
  "semesters": [
    {
      "name": "第一学期",
      "courses": [
        {
          "name": "课程中文名",
          "nameEn": "Course English Name",
          "grade": 85,
          "credits": 3,
          "risk": "high|medium|low",
          "reason": "被判定为该风险等级的原因（中文）",
          "summary": "A 90-110 word English overview of what was studied in this course, key topics covered, and how it was assessed (exam format, projects, labs, etc). Should be detailed enough for the student to memorize and confidently recite to the examiner when asked to describe the course.",
          "questions": ["可能被问到的问题1", "可能被问到的问题2", "可能被问到的问题3"],
          "answers": ["问题1的参考英文回答（2-4句）", "问题2的参考英文回答", "问题3的参考英文回答"]
        }
      ]
    }
  ],
  "mustReview": ["必须重点复习的课程名1", "课程名2"]
}

风险判定规则：
1. 高风险(high)：成绩特别高(>90)或特别低(<65)的课程；课程名称有特色/不常见的；专业核心课
2. 中风险(medium)：专业必修课；成绩中等的课程
3. 低风险(low)：通识课、体育课、思政课等与专业关联度低的课程

字段说明：
- mustReview 包含所有高风险课程名称
- questions 为2-3个考官可能提问的具体问题（中文）
- answers 每题对应一个英文参考回答，2-4句，具体且实用，可直接背诵
- summary 90-110词英文课程梗概，详细介绍课程内容和考核方式，帮助学生向考官流利介绍这门课

请只返回JSON，不要添加其他文字。`;

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error("AI API request failed");
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response");
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analyze transcript error:", error);
    return NextResponse.json(
      { error: "分析失败，请重试" },
      { status: 500 }
    );
  }
}

function generateFallbackAnalysis(text: string, major: string) {
  const lines = text.split("\n").filter((l) => l.trim());

  const coursePatterns = lines
    .filter((l) => /\d{2,3}/.test(l) && l.length > 5)
    .slice(0, 20);

  const semesters = [];
  const coursesPerSemester = Math.ceil(coursePatterns.length / 4) || 3;

  for (let i = 0; i < 4; i++) {
    const semCourses = coursePatterns
      .slice(i * coursesPerSemester, (i + 1) * coursesPerSemester)
      .map((line) => {
        const gradeMatch = line.match(/(\d{2,3})/);
        const grade = gradeMatch ? parseInt(gradeMatch[1]) : 75;
        const name = line.replace(/\d+/g, "").trim().substring(0, 20) || `${major}相关课程`;

        let risk: "high" | "medium" | "low" = "medium";
        if (grade > 90 || grade < 65) risk = "high";
        else if (grade < 70 || grade > 85) risk = "medium";
        else risk = "low";

        return {
          name,
          nameEn: name,
          grade,
          credits: 3,
          risk,
          reason:
            risk === "high"
              ? "成绩突出或偏低，考官可能重点关注"
              : risk === "medium"
              ? "专业相关课程，有一定被问到的可能"
              : "通识类课程，被问到的可能性较低",
          summary: `This course covers core topics in ${name}. Students are assessed through assignments and a written final examination.`,
          questions: [
            `请简单介绍一下${name}这门课的主要内容`,
            `你在${name}这门课中学到了什么对你最有帮助的知识？`,
          ],
          answers: [
            `This course introduced the fundamental concepts of ${name}. We covered theoretical foundations as well as practical applications relevant to our major.`,
            `The most valuable insight was understanding how the concepts connect to real-world problems in our field, which I expect will be useful in my studies in Germany.`,
          ],
        };
      });

    if (semCourses.length > 0) {
      semesters.push({ name: `第${i + 1}学期`, courses: semCourses });
    }
  }

  if (semesters.length === 0) {
    semesters.push({
      name: "第一学期",
      courses: [
        {
          name: `${major}导论`,
          nameEn: `Introduction to ${major}`,
          grade: 85,
          credits: 3,
          risk: "medium" as const,
          reason: "专业入门课程，考官可能用来暖场",
          questions: [
            "请介绍一下这门课的主要内容",
            "你为什么选择这个专业方向？",
          ],
        },
      ],
    });
  }

  const mustReview = semesters
    .flatMap((s) => s.courses)
    .filter((c) => c.risk === "high")
    .map((c) => c.name);

  return { semesters, mustReview };
}
