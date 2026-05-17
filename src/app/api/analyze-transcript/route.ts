import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const rawText = (formData.get("rawText") as string | null)?.trim();
    const major = formData.get("major") as string;
    const university = formData.get("university") as string;
    const examLang = formData.get("examLang") as string;

    const majorLabel = major || "未知专业";
    let textContent = "";

    // Path A: user pasted text directly
    if (rawText && rawText.length > 20) {
      textContent = rawText;
    } else if (file) {
      // Path B: parse uploaded file
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith(".pdf")) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const pdfParse = require("pdf-parse");
          const data = await pdfParse(buffer);
          textContent = data.text ?? "";
          console.log(`[pdf-parse] pages=${data.numpages} chars=${textContent.length}`);
        } catch (e) {
          console.error("PDF parse error:", e);
          throw new Error(`PDF解析失败: ${e instanceof Error ? e.message : String(e)}`);
        }
      } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const mammoth = require("mammoth");
          const result = await mammoth.extractRawText({ buffer });
          textContent = result.value ?? "";
        } catch (e) {
          console.error("Word parse error:", e);
          throw new Error(`Word解析失败: ${e instanceof Error ? e.message : String(e)}`);
        }
      } else {
        return NextResponse.json(
          { error: "不支持的文件格式，请上传PDF或Word文件" },
          { status: 400 }
        );
      }

      if (!textContent.trim()) {
        return NextResponse.json(
          { error: "PDF无法提取文字——可能是扫描件或字体编码问题。请改用「粘贴文字」模式：在学校教务系统中选中成绩单文字，复制后粘贴到文本框即可。" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "请上传成绩单文件，或粘贴成绩单文字内容" },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI服务未配置，请联系管理员（缺少DEEPSEEK_API_KEY）" },
        { status: 500 }
      );
    }

    const prompt = `你是一位资深APS（德国留学审核）面试辅导专家。请分析以下学生的成绩单，提取课程信息并评估APS面试风险。

学生专业：${majorLabel}
目标大学：${university || "未指定"}
面试语言：${examLang === "german" ? "德语" : "英语"}

成绩单原始文本：
${textContent.substring(0, 7000)}

【重要规则】

第一，学期划分：
- 严格按照成绩单上实际出现的学期来划分，不要合并或增减
- 学期名称使用成绩单上的原始表述（如"第一学年第一学期"、"大一上"、"第一学期"等）
- 常见情况是6-8个学期，少数人可能只有4-6个

第二，必须完全排除以下课程（不要出现在JSON中）：
- 思政政治类：马克思主义原理、毛泽东思想、习近平新时代中国特色社会主义、形势与政策、中国近现代史纲要、思想道德修养、政治经济学（马克思版）
- 军事体育类：军事理论、军训、大学体育、体育、军事技能
- 心理健康、职业规划、就业指导、创业基础、劳动教育、安全教育
- 任何看起来是成绩单表头/元数据的文本（如学号、学制、学院名称、入学日期等）
- 任何不是真实课程名称的内容

第三，只保留以下课程（APS考官实际会问的）：
- 专业核心课、专业必修课、专业选修课
- 专业基础课（数学/物理/化学/力学/编程等，视专业而定）
- 对口专业的重要公共课（如外语专业的大学英语算专业课，理工科的高等数学是核心）
- 有明确学术内容的课程

第四，风险等级判定：
- high（高风险）：专业核心课 OR 成绩<70分 OR 成绩>92分且是专业课 → 这门课考官大概率会问
- medium（中风险）：专业选修课、专业基础课、成绩普通的专业必修课
- low（低风险）：与专业关联较弱的课程（但仍然是真实学术课程）

第五，mustReview列表：
- 只包含 high 风险的专业课名称（通常5-10门）
- 绝对不包含政治课、体育、军训等已排除的课程

请严格按照此JSON格式返回（只返回JSON，不要添加其他文字）：
{
  "semesters": [
    {
      "name": "第一学期",
      "courses": [
        {
          "name": "课程中文名",
          "nameEn": "Course English/German Name",
          "grade": 85,
          "credits": 3,
          "risk": "high",
          "reason": "该课程被判定为高风险的具体原因（1-2句中文）",
          "summary": "A 180-220 word English course description covering: (1) the core subject matter and theoretical frameworks studied, (2) the 4-6 most important specific topics, concepts, or techniques covered (be concrete — name actual theories, algorithms, methods, or authors), (3) how the course was assessed (exam format, labs, projects, thesis, presentations), and (4) one sentence on how this course connects to the student's broader major. Written in first person, natural spoken register, detailed enough for the student to recite fluently when the examiner asks 'Tell me about this course.'",
          "questions": ["考官可能的提问1（中文）", "提问2", "提问3"],
          "answers": ["问题1的英文参考回答（6-8句，100-130词，结构：直接回答核心观点 → 展开具体细节/举例 → 联系个人学习经历或课程内容 → 收尾句）", "问题2的英文回答（同样6-8句）", "问题3的英文回答（同样6-8句）"]
        }
      ]
    }
  ],
  "mustReview": ["高风险课程名1", "高风险课程名2"]
}`;

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
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => "");
      console.error("[deepseek] API error", response.status, errBody);
      throw new Error(`AI API错误 ${response.status}：${errBody.slice(0, 200)}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";
    console.log(`[deepseek] response length=${content.length}`);

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[deepseek] no JSON block in response:", content.slice(0, 300));
      return NextResponse.json(
        { error: "AI返回格式异常，请重试。如持续失败请检查成绩单文字是否完整。" },
        { status: 500 }
      );
    }

    let analysis;
    try {
      analysis = JSON.parse(jsonMatch[0]);
    } catch {
      const raw = jsonMatch[0];
      const lastBrace = raw.lastIndexOf("}");
      const trimmed = raw.substring(0, lastBrace + 1);
      try {
        analysis = JSON.parse(trimmed);
      } catch {
        console.error("[deepseek] JSON parse failed, raw length:", raw.length);
        return NextResponse.json(
          { error: "AI返回内容过长被截断，请减少粘贴的文字量（保留课程表部分即可）后重试。" },
          { status: 500 }
        );
      }
    }
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analyze transcript error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: msg || "分析失败，请重试" },
      { status: 500 }
    );
  }
}

// Courses that should never appear in APS prep (won't be asked)
const EXCLUDED_COURSE_KEYWORDS = [
  "马克思", "毛泽东", "习近平", "形势与政策", "中国近现代史", "思想道德", "政治经济学",
  "军事理论", "军训", "军事技能",
  "体育", "大学体育",
  "心理健康", "职业规划", "就业指导", "创业", "劳动教育", "安全教育",
  "入学教育", "毕业教育",
];

function isExcludedCourse(name: string): boolean {
  return EXCLUDED_COURSE_KEYWORDS.some((kw) => name.includes(kw));
}

function generateFallbackAnalysis(text: string, major: string) {
  const lines = text.split("\n").filter((l) => l.trim());

  // Detect semester boundaries heuristically
  const semesterMarkers = lines
    .map((l, i) => ({ line: l, idx: i }))
    .filter(({ line }) => /第[一二三四五六七八九十\d]+学[期年]|大[一二三四][上下]/.test(line));

  const coursePatterns = lines
    .filter((l) => /\d{2,3}/.test(l) && l.length > 5 && l.length < 60)
    .filter((l) => !isExcludedCourse(l))
    .slice(0, 60);

  // Try to infer semester count from markers; default to 6 if not found
  const semCount = semesterMarkers.length > 0
    ? Math.min(semesterMarkers.length, 8)
    : Math.min(Math.max(Math.ceil(coursePatterns.length / 6), 4), 8);

  const semesters = [];
  const coursesPerSemester = Math.ceil(coursePatterns.length / semCount) || 4;

  for (let i = 0; i < semCount; i++) {
    const semCourses = coursePatterns
      .slice(i * coursesPerSemester, (i + 1) * coursesPerSemester)
      .map((line) => {
        const gradeMatch = line.match(/\b(\d{2,3})\b/);
        const grade = gradeMatch ? parseInt(gradeMatch[1]) : 75;
        const name = line.replace(/[\d\.]+/g, "").trim().substring(0, 25) || `${major}相关课程`;

        if (isExcludedCourse(name)) return null;

        let risk: "high" | "medium" | "low" = "medium";
        if (grade < 70 || grade > 92) risk = "high";
        else if (grade >= 70 && grade < 78) risk = "medium";
        else risk = "low";

        return {
          name,
          nameEn: name,
          grade,
          credits: 3,
          risk,
          reason:
            risk === "high"
              ? "成绩偏低或突出，考官可能重点关注"
              : "专业相关课程，有一定被问到的可能",
          summary: `This course covers core topics in ${name}. Students are assessed through assignments and a written final examination.`,
          questions: [
            `请简单介绍一下${name}这门课的主要内容`,
            `你在${name}这门课中学到了什么？`,
          ],
          answers: [
            `This course introduced the fundamental concepts and theories of ${name}. We covered both theoretical foundations and practical applications.`,
            `The most valuable insight was understanding how the concepts connect to real-world problems in our field, which I expect will be relevant in my studies in Germany.`,
          ],
        };
      })
      .filter(Boolean);

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
          summary: `This introductory course covers the foundational principles of ${major}. Topics include core theoretical frameworks, key methodologies, and an overview of the field's major themes. Students are assessed through weekly assignments, a mid-term exam, and a final written examination.`,
          questions: [
            "请介绍一下这门课的主要内容",
            "你为什么选择这个专业方向？",
          ],
          answers: [
            `This course introduced the foundational concepts and theoretical frameworks of ${major}. We studied core principles through lectures, readings, and practical assignments.`,
            `I chose this major because I am passionate about the field and see strong career opportunities in Germany. The structured curriculum here prepared me well for further study abroad.`,
          ],
        },
      ],
    });
  }

  type FallbackCourse = { name: string; nameEn: string; grade: number; credits: number; risk: "high" | "medium" | "low"; reason: string; summary: string; questions: string[]; answers: string[] };
  const mustReview = (semesters as Array<{ name: string; courses: FallbackCourse[] }>)
    .flatMap((s) => s.courses)
    .filter((c) => c.risk === "high")
    .map((c) => c.name);

  return { semesters, mustReview };
}
