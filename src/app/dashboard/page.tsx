"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { SwipeCard, SwipeButtons, type CourseCard } from "@/components/SwipeCard";
import { AchievementPopup, ACHIEVEMENTS, type AchievementData } from "@/components/Achievement";
import { UpgradeModal, type Tier } from "@/components/UpgradeModal";

interface Semester {
  name: string;
  courses: CourseCard[];
}

interface AnalysisResult {
  semesters: Semester[];
  mustReview: string[];
}

const MAJORS = [
  // 文学 & 语言
  "汉语言文学", "汉语国际教育", "英语/翻译", "德语", "法语", "日语", "西班牙语",
  // 人文社科
  "历史学", "哲学", "社会学", "心理学", "法学", "政治学/国际关系",
  // 传媒 & 教育
  "新闻传播学", "广告学", "广播电视学", "教育学",
  // 艺术
  "艺术设计", "视觉传达", "产品设计", "中国画/油画", "音乐学", "音乐表演", "舞蹈学",
  // 建筑 & 规划
  "建筑学", "城乡规划", "风景园林",
  // 商科
  "经济学/商科", "金融学", "会计学", "市场营销", "管理学", "人力资源管理", "旅游管理",
  // 理工
  "计算机科学", "软件工程", "电子信息", "通信工程",
  "机械工程", "土木工程", "材料科学", "化学工程",
  "数学", "物理", "生物", "化学", "环境科学",
];

const UNIVERSITIES = [
  "慕尼黑工业大学 (TUM)", "慕尼黑大学 (LMU)", "海德堡大学",
  "柏林自由大学", "柏林工业大学", "亚琛工业大学",
  "卡尔斯鲁厄理工学院 (KIT)", "斯图加特大学", "德累斯顿工业大学",
  "汉堡大学", "科隆大学", "法兰克福大学",
  "波恩大学", "曼海姆大学", "柏林艺术大学",
  "魏玛包豪斯大学", "其他",
];

const SAMPLE_ANALYSIS: AnalysisResult = {
  mustReview: ["高等数学", "概率论与数理统计", "数据结构"],
  semesters: [
    {
      name: "第一学期",
      courses: [
        {
          id: "0-0", name: "高等数学", nameEn: "Advanced Mathematics", grade: 62, credits: 6, risk: "high",
          reason: "成绩偏低（62分），且为核心数学基础课，考官极可能以此切入考察数学基础。",
          summary: "This course covers the foundational pillars of calculus: limits, continuity, derivatives, and the Fundamental Theorem of Calculus, before progressing to techniques of integration, improper integrals, and applications to area, volume, and arc length. The second half introduces infinite series and convergence tests, Taylor and power series, and an introduction to multivariable calculus covering partial derivatives, gradient vectors, and double integrals. Weekly problem sets built computational fluency, and the closed-book written final demanded both formal proof-writing and rapid numerical calculation under strict time constraints.",
          questions: ["请解释什么是极限，并给出一个你认为直观的例子。", "微积分的基本定理是什么？", "你觉得这门课哪里最难？你是怎么克服的？"],
          answers: [
            "A limit describes the value a function approaches as the input nears a specific point. For example, as x → 0, sin(x)/x → 1, which is intuitive because sin(x) closely tracks x for small angles.",
            "The Fundamental Theorem of Calculus links differentiation and integration: if F is an antiderivative of f, then ∫[a,b] f(x)dx = F(b) − F(a). It shows these two operations are inverses.",
            "I found series convergence tests most challenging — especially distinguishing absolute from conditional convergence. I made comparison tables for each test and worked through extra practice problems until the patterns became clear.",
          ],
        },
        {
          id: "0-1", name: "大学英语", nameEn: "College English", grade: 88, credits: 4, risk: "low",
          reason: "通识类语言课，与专业关联度低，考官通常不会重点询问。",
          summary: "This course develops academic English skills across four areas: reading comprehension of scholarly texts, structured essay writing, oral presentation, and professional vocabulary. Students analyzed argumentative articles, wrote persuasive and expository essays with formal citations, and delivered group presentations on assigned topics. Assessment comprised mid-term essays, a group presentation graded on delivery and content, and a final written exam covering grammar, reading comprehension, and vocabulary in context. The course significantly improved my ability to communicate ideas clearly in an academic register.",
          questions: ["你的英语学习经历是什么？", "你是否有用英语进行学术交流的经历？"],
          answers: [
            "I started learning English in primary school and improved significantly through reading technical documentation and watching English-language lectures online. This course helped me structure academic writing more formally.",
            "Yes — I participated in an English-medium online seminar and co-wrote a group report in English on AI ethics. The experience improved my confidence in both written and spoken academic English.",
          ],
        },
        {
          id: "0-2", name: "计算机导论", nameEn: "Introduction to Computer Science", grade: 91, credits: 3, risk: "high",
          reason: "成绩优秀（91分），且是专业入门课，考官可能追问你对CS基础概念的理解深度。",
          summary: "This introductory course surveys the entire landscape of computer science, from hardware foundations — logic gates, binary representation, memory hierarchies — to software abstractions including algorithms, operating systems, and programming paradigms. We studied the history of computing from Turing and von Neumann through to modern architectures, and explored how computers solve problems at each layer of abstraction. Assessment included weekly quizzes on theory, two Python programming assignments, and a written final requiring both technical explanations and short essays on computing's societal impact.",
          questions: ["什么是算法？请举例说明时间复杂度的概念。", "图灵机模型对你理解计算机有什么帮助？", "你认为计算机科学最核心的思想是什么？"],
          answers: [
            "An algorithm is a finite, well-defined sequence of steps to solve a problem. Time complexity measures how runtime grows with input size — for example, binary search runs in O(log n), meaning it stays efficient even for large datasets.",
            "The Turing machine gave me a formal mental model of computation: a processor reads symbols, changes state, and writes back. It showed me that any computable problem can be reduced to these simple operations, which grounds everything from CPUs to programming languages.",
            "I believe abstraction is the most essential idea — the ability to hide complexity behind clean interfaces, from transistors to OS kernels to high-level APIs. Without abstraction, scaling systems would be impossible.",
          ],
        },
        {
          id: "0-3", name: "思想道德与法治", nameEn: "Moral Education", grade: 85, credits: 2, risk: "low",
          reason: "公共必修课，与专业无关，APS考官几乎不会提及。",
          summary: "This mandatory general-education course examines Chinese constitutional law, citizens' rights and obligations, professional ethics, and the theoretical foundations of socialist core values. Topics included legal reasoning, case studies on civil and criminal liability, and discussions on the intersection of morality and law in modern society. Students wrote two short analytical essays responding to ethical dilemmas, and the closed-book final tested knowledge of key legal concepts and the ability to apply moral reasoning frameworks to given scenarios.",
          questions: ["这门课给你留下印象最深的内容是什么？"],
          answers: [
            "The section on constitutional rights and citizen responsibilities stood out — it prompted me to think about how legal frameworks balance individual freedom with collective welfare, which feels relevant to AI governance debates too.",
          ],
        },
      ],
    },
    {
      name: "第二学期",
      courses: [
        {
          id: "1-0", name: "数据结构", nameEn: "Data Structures", grade: 78, credits: 4, risk: "high",
          reason: "CS核心专业课，考官几乎必问。栈、队列、树、图等基本结构需熟练掌握。",
          summary: "This core CS course covers the design, implementation, and complexity analysis of fundamental data structures: arrays, linked lists, stacks, queues, binary and balanced trees (AVL, red-black), heaps, hash tables, and graphs. Each structure was implemented from scratch in C++, requiring manual memory management with pointers. Lab assignments included building a dictionary using hash tables and implementing Dijkstra's algorithm on a graph. The written final combined algorithm tracing, Big-O analysis proofs, and questions on choosing appropriate structures for given problem constraints.",
          questions: ["请说明二叉搜索树的查找时间复杂度，以及最坏情况是什么？", "你能描述图的BFS和DFS的区别吗？", "什么情况下你会选择链表而不是数组？"],
          answers: [
            "BST search is O(log n) on average when the tree is balanced. The worst case is O(n) — a completely skewed tree where every node has only one child, effectively becoming a linked list.",
            "BFS uses a queue and explores level by level, finding shortest paths in unweighted graphs. DFS uses a stack (or recursion) and goes as deep as possible first, useful for cycle detection, topological sort, and connectivity checks.",
            "I'd choose a linked list when the size is unpredictable and insertions/deletions in the middle are frequent, since they're O(1). Arrays are better when random access is needed or memory locality matters for performance.",
          ],
        },
        {
          id: "1-1", name: "概率论与数理统计", nameEn: "Probability and Statistics", grade: 71, credits: 4, risk: "high",
          reason: "成绩一般且为AI/ML重要基础，考官可能以应用场景考察你的理解。",
          summary: "This course establishes the mathematical foundations of probability and statistics essential for machine learning and data analysis. Topics included probability axioms, conditional probability, Bayes' theorem, discrete and continuous random variables, common distributions (binomial, Poisson, normal, exponential), expectation and variance, the Central Limit Theorem, hypothesis testing, confidence intervals, and linear regression. Biweekly problem sets required deriving proofs alongside numerical computation. The written final emphasized applied reasoning — given a real-world scenario, select and apply the appropriate statistical tool and interpret the result.",
          questions: ["什么是条件概率？请用生活中的例子解释贝叶斯定理。", "期望值和方差在实际中有什么应用？", "你是否在项目中用过统计方法？"],
          answers: [
            "Conditional probability P(A|B) is the probability of A given B has occurred. Bayes' theorem reverses this: if a medical test has a 99% accuracy rate but the disease is rare (1 in 1000), a positive result may still be mostly false positives — Bayes lets you calculate the true posterior probability.",
            "Expectation gives the average outcome over many trials — useful in risk assessment and pricing. Variance measures spread, telling you how reliable that average is. In ML, minimizing variance reduces overfitting; in finance, it quantifies investment risk.",
            "Yes — in a group project I used linear regression to predict student performance based on attendance and assignment scores. I applied t-tests to check whether the correlation was statistically significant.",
          ],
        },
        {
          id: "1-2", name: "线性代数", nameEn: "Linear Algebra", grade: 84, credits: 4, risk: "medium",
          reason: "专业数学基础课，成绩中等偏上，可能会被问到矩阵的实际应用。",
          summary: "This course covers the theory and computation of linear algebra, progressing from systems of linear equations and Gaussian elimination to abstract vector spaces, linear transformations, inner product spaces, and spectral theory. Key topics include matrix factorizations (LU, QR), determinants, eigenvalues and eigenvectors, diagonalization, and singular value decomposition. Applications to least-squares problems and principal component analysis were discussed. Problem sets alternated between abstract proofs and numerical computation; the written final tested both theoretical understanding and the ability to apply decompositions to concrete examples.",
          questions: ["特征值和特征向量在机器学习中有什么用？", "什么是矩阵的秩？请解释其几何意义。"],
          answers: [
            "Eigenvalues and eigenvectors are central to PCA — they identify the directions of maximum variance in data. In neural networks, understanding the eigenspectrum of the weight matrix relates to gradient flow and training stability.",
            "The rank of a matrix is the dimension of its column (or row) space — the number of linearly independent vectors it contains. Geometrically, a rank-2 matrix maps R^n onto a 2D plane, meaning information is compressed or lost.",
          ],
        },
        {
          id: "1-3", name: "离散数学", nameEn: "Discrete Mathematics", grade: 89, credits: 3, risk: "medium",
          reason: "CS重要理论课，成绩良好，逻辑证明与图论部分可能被问到。",
          summary: "This course develops the mathematical reasoning skills that underpin theoretical computer science. Topics covered include propositional and predicate logic, formal proof techniques (direct, contradiction, induction), set theory, relations, functions, combinatorics and counting principles, graph theory (trees, connectivity, Euler and Hamiltonian paths), and an introduction to automata theory. Weekly problem sets required writing rigorous formal proofs. The written final mixed theoretical derivations with applied graph problems and combinatorics puzzles, emphasizing the ability to construct clear, logically sound arguments.",
          questions: ["什么是图的欧拉路径？给出存在条件。", "集合论中的容斥原理能举例说明吗？"],
          answers: [
            "An Eulerian path visits every edge exactly once. It exists in an undirected graph if and only if the graph is connected and has exactly zero or two vertices of odd degree. Exactly two odd-degree vertices means the path starts at one and ends at the other.",
            "The inclusion-exclusion principle counts elements in unions by adding individual sets then subtracting overlaps. For example, to count integers from 1–100 divisible by 2 or 3: |A∪B| = 50 + 33 − 16 = 67.",
          ],
        },
      ],
    },
    {
      name: "第三学期",
      courses: [
        {
          id: "2-0", name: "操作系统", nameEn: "Operating Systems", grade: 83, credits: 4, risk: "medium",
          reason: "CS必修专业课，进程管理、内存管理是高频考点。",
          summary: "This course examines how operating systems manage hardware resources and provide abstractions to application programs. Core topics include process creation and lifecycle, CPU scheduling algorithms (FCFS, SJF, Round Robin, priority-based), inter-process communication, thread synchronization (mutexes, semaphores, monitors), deadlock detection and prevention, virtual memory with paging and TLBs, file system design, and I/O management. Lab assignments involved modifying a simplified kernel to implement new scheduling policies. The written final presented realistic OS scenarios and asked students to analyze design tradeoffs and predict system behavior.",
          questions: ["进程和线程的区别是什么？", "什么是死锁？如何预防？", "虚拟内存的作用是什么？"],
          answers: [
            "A process is an independent program with its own memory space; a thread is a lightweight execution unit that shares memory with other threads in the same process. Threads are faster to create and communicate, but sharing memory introduces concurrency bugs.",
            "Deadlock occurs when processes wait on each other's resources in a cycle. Prevention strategies include resource ordering (always acquire locks in the same order), using try-lock with timeouts, and careful lock granularity design.",
            "Virtual memory lets programs use more address space than physical RAM by storing inactive pages on disk. It also provides memory isolation between processes and simplifies memory management for the programmer.",
          ],
        },
        {
          id: "2-1", name: "计算机网络", nameEn: "Computer Networks", grade: 76, credits: 4, risk: "medium",
          reason: "基础专业课，TCP/IP协议栈、HTTP等常见知识点。",
          summary: "This course provides a bottom-up study of computer networks using the TCP/IP model. Topics progress from physical layer signaling through data link (Ethernet, MAC addressing, ARP), network layer (IP addressing, subnetting, routing with RIP and OSPF), transport layer (TCP's three-way handshake, flow and congestion control, UDP), and application layer protocols (HTTP/HTTPS, DNS, SMTP). Lab sessions used Wireshark to capture and analyze live packet traces, reinforcing theoretical concepts with real traffic. The written final included protocol design questions, subnetting calculations, and error-analysis scenarios.",
          questions: ["TCP和UDP的核心区别是什么？", "HTTP和HTTPS有什么不同？", "什么是DNS？请描述域名解析过程。"],
          answers: [
            "TCP is connection-oriented and reliable — it guarantees delivery, ordering, and error correction via three-way handshake and ACKs. UDP is connectionless and faster but unreliable, suitable for real-time applications like video calls where speed trumps accuracy.",
            "HTTP sends data in plain text, making it vulnerable to interception. HTTPS wraps HTTP in TLS, providing encryption, server authentication, and data integrity. The TLS handshake negotiates keys before any application data flows.",
            "DNS translates domain names to IP addresses. When you query a domain, the resolver contacts a root server → TLD server → authoritative server, each pointing closer to the answer. Results are cached by TTL to reduce future lookup time.",
          ],
        },
        {
          id: "2-2", name: "数据库原理", nameEn: "Database Systems", grade: 92, credits: 3, risk: "high",
          reason: "成绩极高（92分），考官可能深入追问SQL优化、事务等高级话题。",
          summary: "This course covers the theory and practice of relational database systems. Topics include the relational model and relational algebra, SQL from basics through advanced joins, subqueries and window functions, database design and normalization (1NF through BCNF), physical storage and B-tree indexing, query execution plans and optimization, transaction management, ACID properties, concurrency control (locking, MVCC), and an introduction to NoSQL models. Two major projects required designing normalized schemas from real-world requirements and writing complex SQL queries. The written final tested theory including normalization proofs and transaction isolation scenarios.",
          questions: ["请解释数据库的ACID特性。", "什么是数据库索引？它如何提高查询效率？", "你在项目中设计过数据库吗？遇到过什么问题？"],
          answers: [
            "ACID stands for Atomicity (transaction fully completes or fully rolls back), Consistency (data always satisfies integrity constraints), Isolation (concurrent transactions don't interfere), and Durability (committed data survives crashes). Together these guarantee reliable transactions.",
            "An index is a data structure (usually a B-tree) built on one or more columns, allowing the database to find rows without a full table scan. It reduces lookup from O(n) to O(log n) at the cost of extra storage and slower writes.",
            "Yes — I designed a library management system with tables for books, members, loans, and fines. The main challenge was handling concurrent checkouts: I used row-level locking and tested edge cases where two users tried to borrow the last copy simultaneously.",
          ],
        },
        {
          id: "2-3", name: "体育", nameEn: "Physical Education", grade: 90, credits: 1, risk: "low",
          reason: "体育课与专业完全无关，不会被提问。",
          summary: "This mandatory physical education course develops overall fitness through a structured program combining cardiovascular endurance, muscular strength, and flexibility training. The curriculum included track running, circuit training, and elective sports sessions such as basketball and table tennis. Students were assessed on attendance, demonstrated improvement across three fitness benchmark tests (1500m run, push-ups, flexibility), and a practical skills assessment in a chosen sport. The course promotes sustainable exercise habits and stress management techniques relevant to student wellbeing throughout academic life.",
          questions: ["你平时喜欢做什么运动？"],
          answers: [
            "I enjoy running and table tennis. I find running helps me reset mentally after long coding sessions, and table tennis sharpens my reflexes and focus. I run about three times a week when my schedule allows.",
          ],
        },
      ],
    },
    {
      name: "第四学期",
      courses: [
        {
          id: "3-0", name: "算法设计与分析", nameEn: "Algorithm Design and Analysis", grade: 79, credits: 4, risk: "high",
          reason: "CS核心课，面试中最常被考到的内容之一，动态规划、贪心算法等必须熟悉。",
          summary: "This course develops systematic techniques for designing efficient algorithms and rigorously analyzing their correctness and complexity. Topics include divide-and-conquer (merge sort, binary search, Strassen's matrix multiplication), dynamic programming (knapsack, longest common subsequence, edit distance), greedy algorithms (Huffman coding, Kruskal's and Prim's MST), graph algorithms (BFS/DFS applications, Dijkstra, Bellman-Ford, topological sort), network flow, and an introduction to NP-completeness and approximation algorithms. Assignments required designing novel algorithms and proving their correctness. The written final emphasized formal complexity analysis and reductions between problems.",
          questions: ["请解释动态规划的核心思想，并举一个例子。", "什么是NP问题？你知道P=NP这个问题吗？", "快速排序的平均时间复杂度是多少？最坏情况呢？"],
          answers: [
            "Dynamic programming solves problems by breaking them into overlapping subproblems, solving each once, and storing results. The classic example is the knapsack problem: instead of trying all 2^n combinations, we build a table of optimal values for each weight limit, reducing complexity to O(n·W).",
            "NP is the class of problems whose solutions can be verified in polynomial time, even if finding the solution may take longer. P=NP asks whether easy-to-verify problems are also easy to solve — most researchers believe P≠NP, but it remains unproven and is one of the Millennium Prize Problems.",
            "Quicksort's average-case time complexity is O(n log n), achieved when pivots split the array roughly in half. The worst case is O(n²) — when the pivot is always the smallest or largest element, causing maximally unbalanced splits, as in a sorted array with naive pivot selection.",
          ],
        },
        {
          id: "3-1", name: "软件工程", nameEn: "Software Engineering", grade: 85, credits: 3, risk: "medium",
          reason: "专业综合课，可能被问到开发流程、设计模式等话题。",
          summary: "This course bridges the gap between individual programming and professional software development. Topics covered include software development lifecycles (Waterfall, Agile/Scrum, DevOps), requirements engineering, UML modeling (use case, class, sequence diagrams), object-oriented design principles (SOLID), 23 Gang-of-Four design patterns, unit and integration testing, code review practices, and version control workflows with Git. The main deliverable was a semester-long team project (four members) building a full-stack web application with complete documentation, sprint reviews, and a final demo. A written exam tested design pattern recognition and UML interpretation.",
          questions: ["你了解哪些软件开发方法论？", "什么是设计模式？你用过哪些？"],
          answers: [
            "I'm familiar with Agile (Scrum) and Waterfall. Scrum breaks work into sprints with daily standups and retrospectives — great for evolving requirements. Waterfall is sequential and suits projects with fixed, well-understood specifications. I've used Scrum in team projects and found it effective for managing scope changes.",
            "Design patterns are reusable solutions to common software design problems. I've used the Observer pattern (for event-driven UI updates), Singleton (for a global config manager), and Strategy pattern (swapping sorting algorithms at runtime). They improve code maintainability and communication within teams.",
          ],
        },
        {
          id: "3-2", name: "编译原理", nameEn: "Compiler Principles", grade: 68, credits: 3, risk: "high",
          reason: "成绩偏低，且是较难的理论课，考官可能以此了解你的学习态度。",
          summary: "This course walks through every phase of building a compiler for a simplified imperative language. Starting with lexical analysis using regular expressions and finite automata (NFA to DFA conversion), we moved through top-down parsing (recursive descent, LL(1)), bottom-up parsing (SLR, LR(1) item sets and parse tables), semantic analysis with symbol tables and type checking, intermediate code generation (three-address code), and basic optimizations such as constant folding and dead-code elimination. Lab projects implemented each compiler phase incrementally in Java. The written final was heavily theoretical, testing grammar classification and parse table construction.",
          questions: ["词法分析和语法分析的作用分别是什么？", "这门课你觉得最难的部分是什么？你是怎么应对的？"],
          answers: [
            "Lexical analysis (scanning) breaks source code into tokens — keywords, identifiers, operators. Syntax analysis (parsing) checks whether those tokens form grammatically valid structures according to the language grammar, typically building a parse tree or AST.",
            "Constructing LR(1) parse tables was the hardest part — the state explosion was difficult to reason about manually. I addressed this by working through small grammar examples step by step, studying annotated solutions, and asking my TA for feedback on my item sets until the process clicked.",
          ],
        },
        {
          id: "3-3", name: "人工智能导论", nameEn: "Introduction to AI", grade: 88, credits: 3, risk: "medium",
          reason: "热门课程，成绩良好，可能会被问到AI的基本概念和应用。",
          summary: "This survey course introduces the major paradigms of artificial intelligence. The first half covers classical AI: uninformed and informed search (BFS, DFS, A*, heuristic design), constraint satisfaction, game-playing (minimax, alpha-beta pruning), knowledge representation with logic, and probabilistic reasoning with Bayesian networks. The second half introduces modern machine learning: supervised learning (linear/logistic regression, decision trees, SVMs), unsupervised learning (k-means), and a conceptual overview of deep neural networks. Programming projects included implementing A* for a pathfinding problem and training a classifier on a real dataset. The final exam covered both classical and ML theory plus an essay on AI ethics.",
          questions: ["机器学习和深度学习的关系是什么？", "你了解哪些AI伦理问题？"],
          answers: [
            "Machine learning is the broader field of systems that learn from data; deep learning is a subset using multi-layer neural networks. Deep learning excels at unstructured data (images, text) but requires large datasets and compute — classical ML methods often outperform it on small tabular datasets.",
            "Key AI ethics issues include: algorithmic bias (models inheriting societal biases from training data), lack of explainability in high-stakes decisions, data privacy concerns, job displacement, and misuse in surveillance. I'm particularly interested in fairness metrics and how to audit models for disparate impact.",
          ],
        },
      ],
    },
  ],
};

function StepBadge({ num, label, active, done }: { num: string; label: string; active: boolean; done: boolean }) {
  return (
    <div className={`flex items-center gap-2 transition-opacity ${active ? "opacity-100" : done ? "opacity-70" : "opacity-30"}`}>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all
        ${done ? "bg-success text-white" : active ? "bg-foreground text-background scale-105" : "bg-border text-muted"}`}>
        {done ? "✓" : num}
      </div>
      <span className={`text-sm font-semibold hidden sm:block ${active ? "text-foreground" : "text-muted"}`}>{label}</span>
    </div>
  );
}

export default function DashboardPage() {
  const [major, setMajor] = useState("");
  const [university, setUniversity] = useState("");
  const [examLang, setExamLang] = useState<"english" | "german">("english");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activeSemester, setActiveSemester] = useState(0);
  const [error, setError] = useState("");

  const [introForm, setIntroForm] = useState({ name: "", background: "", motivation: "" });
  const [intro, setIntro] = useState("");
  const [introLoading, setIntroLoading] = useState(false);

  const [completedCourses, setCompletedCourses] = useState<Set<string>>(new Set());
  const [skippedCount, setSkippedCount] = useState<Record<string, number>>({});
  const [currentAchievement, setCurrentAchievement] = useState<AchievementData | null>(null);
  const [earnedAchievements, setEarnedAchievements] = useState<Set<string>>(new Set());
  const [todayCompleted, setTodayCompleted] = useState(0);

  const [tier, setTier] = useState<Tier | "none">("none");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeTier, setUpgradeTier] = useState<Tier>("pro");

  const isBasic = tier !== "none";
  const isPro = tier === "pro" || tier === "max";

  // Persist tier across page reloads
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aps_tier") as Tier | null;
      if (saved) setTier(saved);
    }
  }, []);

  const activateTier = useCallback((t: Tier) => {
    setTier(t);
    if (typeof window !== "undefined") localStorage.setItem("aps_tier", t);
  }, []);

  const openUpgrade = useCallback((defaultTier: Tier = "pro") => {
    setUpgradeTier(defaultTier);
    setShowUpgrade(true);
  }, []);

  const totalCourses = analysis?.semesters.flatMap((s) => s.courses).length ?? 0;
  const completedCount = completedCourses.size;
  const progressPct = totalCourses > 0 ? Math.round((completedCount / totalCourses) * 100) : 0;

  const remainingCourses = analysis
    ? analysis.semesters[activeSemester]?.courses.filter((c) => !completedCourses.has(c.id)) ?? []
    : [];

  const triggerAchievement = useCallback((id: string) => {
    if (earnedAchievements.has(id)) return;
    const achievement = ACHIEVEMENTS[id];
    if (!achievement) return;
    setCurrentAchievement(achievement);
    setEarnedAchievements((prev) => new Set(prev).add(id));
  }, [earnedAchievements]);

  const handleSwipe = useCallback((courseId: string, direction: "left" | "right") => {
    if (direction === "right") {
      setCompletedCourses((prev) => {
        const next = new Set(prev);
        next.add(courseId);
        const newCount = next.size;
        setTimeout(() => {
          if (newCount === 1) triggerAchievement("first_course");
          else if (newCount === 5) triggerAchievement("five_courses");
          if (analysis) {
            const semesterCourses = analysis.semesters[activeSemester]?.courses ?? [];
            if (semesterCourses.every((c) => next.has(c.id))) triggerAchievement("semester_done");
            const highRisk = analysis.semesters.flatMap((s) => s.courses).filter((c) => c.risk === "high");
            if (highRisk.length > 0 && highRisk.every((c) => next.has(c.id))) triggerAchievement("high_risk_done");
            if (analysis.semesters.flatMap((s) => s.courses).every((c) => next.has(c.id))) triggerAchievement("all_done");
          }
        }, 400);
        return next;
      });
      setTodayCompleted((prev) => {
        const next = prev + 1;
        if (next >= 10) setTimeout(() => triggerAchievement("speed_demon"), 500);
        return next;
      });
    } else {
      setSkippedCount((prev) => {
        const count = (prev[courseId] ?? 0) + 1;
        if (count >= 3) setTimeout(() => triggerAchievement("stubborn"), 400);
        return { ...prev, [courseId]: count };
      });
    }
  }, [analysis, activeSemester, triggerAchievement]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const ext = f.name.split(".").pop()?.toLowerCase();
      if (ext !== "pdf" && ext !== "docx" && ext !== "doc") {
        setError("请上传PDF或Word格式的成绩单");
        return;
      }
      setFile(f);
      setError("");
    }
  };

  const handleLoadSample = () => {
    const withIds: AnalysisResult = {
      ...SAMPLE_ANALYSIS,
      semesters: SAMPLE_ANALYSIS.semesters.map((sem) => ({
        ...sem,
        courses: sem.courses.map((c) => ({ ...c })),
      })),
    };
    setAnalysis(withIds);
    setActiveSemester(0);
    setCompletedCourses(new Set());
    setError("");
    if (!major) setMajor("计算机科学");
  };

  const handleAnalyze = async () => {
    if (!file) { setError("请先上传成绩单"); return; }
    if (!major) { setError("请选择专业方向"); return; }
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("major", major);
      formData.append("university", university);
      formData.append("examLang", examLang);
      const res = await fetch("/api/analyze-transcript", { method: "POST", body: formData });
      if (!res.ok) throw new Error("分析失败，请重试");
      const data = await res.json();
      const withIds: AnalysisResult = {
        ...data,
        semesters: data.semesters.map((sem: Semester, si: number) => ({
          ...sem,
          courses: sem.courses.map((c: CourseCard, ci: number) => ({ ...c, id: `${si}-${ci}` })),
        })),
      };
      setAnalysis(withIds);
      setActiveSemester(0);
      setCompletedCourses(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "分析失败");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateIntro = async () => {
    if (!major) { setError("请先选择专业方向"); return; }
    setIntroLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-intro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ major, university, examLang, ...introForm }),
      });
      if (!res.ok) throw new Error("生成失败");
      const data = await res.json();
      setIntro(data.intro);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败");
    } finally {
      setIntroLoading(false);
    }
  };

  const step1Done = !!major;
  const step2Done = !!intro;
  const step3Done = !!analysis;
  const step4Done = completedCount > 0 && completedCount === totalCourses;

  return (
    <>
      {/* Nav */}
      <nav className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b border-border/50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            AP<span className="text-accent">Slay</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            {tier !== "none" && (
              <span className="bg-lime/20 text-foreground text-xs font-bold px-3 py-1.5 rounded-full capitalize">
                {tier === "basic" ? "Basic" : tier === "pro" ? "Pro" : "Max"} ✓
              </span>
            )}
            <Link href="/tips" className="text-muted hover:text-foreground transition hidden sm:block">APS攻略</Link>
            <Link href="/mock-interview" className="bg-foreground text-background px-4 py-2 rounded-full font-semibold hover:opacity-90 transition text-xs">
              Mock面试 ¥300
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight mb-2">备考工作台</h1>
          <p className="text-muted">4步完成备考，Slay your APS</p>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-1">
          <StepBadge num="01" label="选专业" active={!step1Done} done={step1Done} />
          <div className="flex-1 h-px bg-border min-w-[16px]" />
          <StepBadge num="02" label="生成介绍" active={step1Done && !step2Done} done={step2Done} />
          <div className="flex-1 h-px bg-border min-w-[16px]" />
          <StepBadge num="03" label="分析成绩单" active={step1Done && !step3Done} done={step3Done} />
          <div className="flex-1 h-px bg-border min-w-[16px]" />
          <StepBadge num="04" label="Swipe刷课" active={step3Done && !step4Done} done={step4Done} />
        </div>

        {/* ─── Step 1: 专业 & 院校 ─── */}
        <section className="mb-5 bg-card rounded-3xl border-2 border-border overflow-hidden">
          <div className="flex items-center gap-3 px-7 pt-7 pb-5">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-black
              ${step1Done ? "bg-success text-white" : "bg-foreground text-background"}`}>
              {step1Done ? "✓" : "01"}
            </div>
            <h2 className="text-lg font-bold">选择申请方向的专业和院校</h2>
          </div>
          <div className="px-7 pb-7 grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wide">专业方向 *</label>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full border-2 border-border rounded-2xl px-4 py-3 text-sm bg-background focus:outline-none focus:border-foreground transition"
              >
                <option value="">请选择</option>
                {MAJORS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wide">目标大学</label>
              <select
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full border-2 border-border rounded-2xl px-4 py-3 text-sm bg-background focus:outline-none focus:border-foreground transition"
              >
                <option value="">可选</option>
                {UNIVERSITIES.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wide">面试语言</label>
              <select
                value={examLang}
                onChange={(e) => setExamLang(e.target.value as "english" | "german")}
                className="w-full border-2 border-border rounded-2xl px-4 py-3 text-sm bg-background focus:outline-none focus:border-foreground transition"
              >
                <option value="english">英语审核</option>
                <option value="german">德语审核</option>
              </select>
            </div>
          </div>
        </section>

        {/* ─── Step 2: AI自我介绍 ─── */}
        <section className="mb-5 bg-card rounded-3xl border-2 border-border overflow-hidden">
          <div className="flex items-center justify-between px-7 pt-7 pb-5">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-black
                ${step2Done ? "bg-success text-white" : "bg-foreground text-background"}`}>
                {step2Done ? "✓" : "02"}
              </div>
              <h2 className="text-lg font-bold">AI生成自我介绍</h2>
            </div>
            {!isPro && (
              <span className="text-xs text-muted bg-border px-3 py-1.5 rounded-full font-medium">Basic · 1次</span>
            )}
          </div>
          <div className="px-7 pb-7">
            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              <input
                type="text"
                value={introForm.name}
                onChange={(e) => setIntroForm({ ...introForm, name: e.target.value })}
                placeholder="姓名"
                className="border-2 border-border rounded-2xl px-4 py-3 text-sm bg-background focus:outline-none focus:border-foreground transition"
              />
              <input
                type="text"
                value={introForm.background}
                onChange={(e) => setIntroForm({ ...introForm, background: e.target.value })}
                placeholder="学校和专业背景"
                className="border-2 border-border rounded-2xl px-4 py-3 text-sm bg-background focus:outline-none focus:border-foreground transition"
              />
              <input
                type="text"
                value={introForm.motivation}
                onChange={(e) => setIntroForm({ ...introForm, motivation: e.target.value })}
                placeholder="留德动机"
                className="border-2 border-border rounded-2xl px-4 py-3 text-sm bg-background focus:outline-none focus:border-foreground transition"
              />
            </div>
            <button
              onClick={handleGenerateIntro}
              disabled={introLoading || !major}
              className="bg-foreground text-background px-6 py-3 rounded-2xl text-sm font-bold hover:opacity-90 transition disabled:opacity-40 active:scale-95"
            >
              {introLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  生成中...
                </span>
              ) : "✦ 生成自我介绍"}
            </button>

            {intro && (
              <div className="mt-5 bg-background border-2 border-border rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                  <span className="text-xs font-bold text-muted uppercase tracking-wide">生成结果</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(intro)}
                    className="text-xs font-bold text-foreground hover:opacity-60 transition"
                  >
                    复制全文
                  </button>
                </div>
                <div className="p-5">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/80">{intro}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ─── Step 3: 上传成绩单 ─── */}
        <section className="mb-5 bg-card rounded-3xl border-2 border-border overflow-hidden">
          <div className="flex items-center justify-between px-7 pt-7 pb-5">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-black
                ${step3Done ? "bg-success text-white" : "bg-foreground text-background"}`}>
                {step3Done ? "✓" : "03"}
              </div>
              <h2 className="text-lg font-bold leading-tight">上传成绩单</h2>
            </div>
            {!analysis && (
              <button
                onClick={handleLoadSample}
                className="text-xs text-muted font-medium hover:text-foreground transition border border-border rounded-full px-3 py-1.5 hover:border-foreground/40"
              >
                跳过，稍后再来 →
              </button>
            )}
          </div>
          <div className="px-7 pb-7">
            <label htmlFor="transcript-upload" className="cursor-pointer block mb-4">
              <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition
                ${file ? "border-success bg-success-light/50" : "border-border hover:border-foreground/40 hover:bg-border/20"}`}>
                <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center text-xl font-black
                  ${file ? "bg-success/20 text-success" : "bg-border text-muted"}`}>
                  {file ? "✓" : "↑"}
                </div>
                <p className="text-sm font-bold mb-1">
                  {file ? file.name : "点击上传成绩单"}
                </p>
                <p className="text-xs text-muted">支持 PDF、Word（来自教务系统）</p>
              </div>
            </label>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" id="transcript-upload" />

            {/* Tier notice */}
            {!isBasic && (
              <div className="flex items-start gap-3 p-4 bg-border/30 rounded-2xl mb-4 text-sm">
                <span className="text-muted/80 leading-relaxed">
                  上传成绩单需 <strong className="text-foreground">Basic（¥29）</strong>。体验示例成绩单无需付费。
                </span>
                <button
                  onClick={() => openUpgrade("basic")}
                  className="shrink-0 text-xs font-bold bg-foreground text-background px-3 py-1.5 rounded-full hover:opacity-90 transition"
                >
                  解锁
                </button>
              </div>
            )}
            {isBasic && !isPro && (
              <div className="flex items-start gap-3 p-4 bg-border/30 rounded-2xl mb-4 text-sm">
                <span className="text-muted/80 leading-relaxed">
                  可查看风险等级。<strong className="text-foreground">预测题目需升级Pro</strong>（¥59）。
                </span>
                <button
                  onClick={() => openUpgrade("pro")}
                  className="shrink-0 text-xs font-bold bg-foreground text-background px-3 py-1.5 rounded-full hover:opacity-90 transition"
                >
                  升级
                </button>
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-danger-light text-danger text-sm rounded-2xl font-medium">{error}</div>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleAnalyze}
                disabled={loading || !file || !major}
                className="bg-foreground text-background px-6 py-3 rounded-2xl text-sm font-bold hover:opacity-90 transition disabled:opacity-40 active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    AI分析中...
                  </span>
                ) : "开始AI分析"}
              </button>
              <button
                onClick={handleLoadSample}
                className="px-6 py-3 rounded-2xl text-sm font-bold border-2 border-border hover:border-foreground/40 transition text-muted hover:text-foreground active:scale-95"
              >
                跳过，稍后再来 →
              </button>
            </div>
          </div>
        </section>

        {/* ─── Step 4: Swipe刷课 ─── */}
        {analysis && (
          <section className="mb-8">
            {/* Progress header */}
            <div className="bg-foreground text-background rounded-3xl p-6 mb-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 bg-lime/20 rounded-2xl flex items-center justify-center text-xs font-black text-lime">04</div>
                    <h2 className="text-lg font-bold">Swipe刷课</h2>
                  </div>
                  <p className="text-background/50 text-sm pl-12">
                    {completedCount === totalCourses && totalCourses > 0
                      ? "全部搞定！考官请注意 →"
                      : `还剩 ${totalCourses - completedCount} 门课 · 往上滚可选专业/上传成绩单`}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-lime">{progressPct}%</div>
                  <div className="text-background/40 text-xs">{completedCount}/{totalCourses}</div>
                </div>
              </div>
              <div className="h-2 bg-background/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-lime rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Must-review highlight */}
            {analysis.mustReview.length > 0 && (
              <div className="bg-coral-light border border-coral/20 rounded-2xl px-5 py-4 mb-4">
                <p className="text-xs font-bold text-coral uppercase tracking-widest mb-2">重点必看</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.mustReview.map((name) => (
                    <span key={name} className="bg-coral/15 text-coral text-xs font-bold px-3 py-1.5 rounded-full">{name}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Semester tabs */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              {analysis.semesters.map((sem, idx) => {
                const semCompleted = sem.courses.filter((c) => completedCourses.has(c.id)).length;
                return (
                  <button
                    key={sem.name}
                    onClick={() => setActiveSemester(idx)}
                    className={`px-4 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition flex items-center gap-2
                      ${activeSemester === idx
                        ? "bg-foreground text-background"
                        : "bg-card border-2 border-border text-muted hover:border-foreground/30"
                      }`}
                  >
                    {sem.name}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${activeSemester === idx ? "bg-white/15" : "bg-border"}`}>
                      {semCompleted}/{sem.courses.length}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Swipe area */}
            {remainingCourses.length > 0 ? (
              <div>
                <div className="relative h-[560px]">
                  <AnimatePresence>
                    {remainingCourses.slice(0, 2).reverse().map((course, i) => (
                      <SwipeCard
                        key={course.id}
                        course={course}
                        isTop={i === (Math.min(remainingCourses.length, 2) - 1)}
                        onSwipe={(dir) => handleSwipe(course.id, dir)}
                        tier={tier}
                        onUpgrade={(target) => openUpgrade(target)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
                <SwipeButtons onSwipe={(dir) => handleSwipe(remainingCourses[0].id, dir)} />
                <p className="text-center text-xs text-muted mt-3">拖拽卡片 或 点击按钮</p>
              </div>
            ) : (
              <div className="bg-card border-2 border-border rounded-3xl p-10 text-center">
                <div className="w-16 h-16 mx-auto bg-lime/20 rounded-full flex items-center justify-center text-2xl font-black mb-4">GG</div>
                <h3 className="text-2xl font-black mb-2">本学期全部搞定！</h3>
                <p className="text-muted text-sm">考官翻到这学期会感到一阵空虚</p>
              </div>
            )}

            {/* Earned achievements */}
            {earnedAchievements.size > 0 && (
              <div className="mt-6 bg-card p-6 rounded-3xl border-2 border-border">
                <h3 className="text-xs font-bold text-muted mb-3 uppercase tracking-widest">已解锁成就</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(earnedAchievements).map((id) => {
                    const a = ACHIEVEMENTS[id];
                    if (!a) return null;
                    return (
                      <div key={id} className="bg-border/50 px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                        <span className="w-6 h-6 bg-foreground/10 rounded-lg flex items-center justify-center text-[10px] font-black">{a.icon}</span>
                        {a.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Upsell — shown for non-Pro users */}
            {!isPro && (
              <div className="mt-6 bg-foreground text-background rounded-3xl p-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-bold text-background/40 uppercase tracking-widest mb-1">
                      {isBasic ? "Pro 版" : "Basic / Pro 版"}
                    </div>
                    <p className="text-lg font-black mb-1">解锁完整Q&A预测</p>
                    <p className="text-sm text-background/50">
                      {isBasic ? "¥59 一次付费 · 永久Slay" : "Basic ¥29 · Pro ¥59"}
                    </p>
                  </div>
                  <button
                    onClick={() => openUpgrade(isBasic ? "pro" : "basic")}
                    className="bg-lime text-foreground px-6 py-3 rounded-full text-sm font-black hover:scale-105 transition-transform shrink-0"
                  >
                    升级{isBasic ? "Pro" : ""}
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      <AchievementPopup achievement={currentAchievement} onClose={() => setCurrentAchievement(null)} />
      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        onSuccess={activateTier}
        defaultTier={upgradeTier}
      />
    </>
  );
}
