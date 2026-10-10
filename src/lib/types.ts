// ============================================================
// 学生互助服务平台 - 数据类型定义
// 对应 Prisma Schema，一期纯静态用
// ============================================================

// ---------- 板块类型 ----------
export type SiteType = "ai" | "tool" | "language" | "game" | "kaoyan";

// ---------- 地区 ----------
export type SiteRegion = "domestic" | "foreign";

// ---------- 语种 ----------
export type SiteLanguage = "multi" | "en" | "ja" | "ko" | "es" | "fr";

// ---------- 分类 ----------
export interface Category {
  id: string;           // 如 ai-chat / tool-pdf / lang-ja
  type: SiteType;       // ai | tool | language
  name: string;         // 显示名
  icon: string;         // lucide icon 名称
  emoji?: string;       // emoji 图标（优先显示，适用于语言分类等）
  sortOrder: number;
  description?: string; // 分类简介（可选）
}

// ---------- 网站 ----------
export interface Site {
  id: string;           // 英文 slug，唯一
  name: string;
  aliases: string[];    // 别名，用于搜索
  url: string;
  logo?: string;        // logo 地址，留空则自动按域名获取
  emoji?: string;       // emoji 图标，作为站点标识
  tagline: string;      // 一句话简介
  description?: string; // 详细描述（可选）
  categoryId: string;   // 对应 Category.id
  tags: string[];       // 功能标签：如"免费"、"官方"、"国内可直连"、"课程入门"、"词典"等
  region: SiteRegion;   // domestic 国内 / foreign 国外
  language?: SiteLanguage; // 外语板块用：multi/en/ja/ko/es/fr
  isFree: boolean;      // 是否免费
  isHot?: boolean;      // 是否热门
  isNew?: boolean;      // 是否新收录
  isOfficial?: boolean; // 是否官方站点（用于报名/考试，防钓鱼）
  clickCount?: number;  // 点击数（二期统计用）
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ---------- 二三期：用户 ----------
export interface User {
  id: number;
  email?: string;
  phone?: string;
  name: string;
  role: "admin" | "user";
  avatar?: string;
  createdAt: string;
}

// ---------- 二三期：投稿 ----------
export interface Submission {
  id: number;
  userId: number;
  name: string;
  url: string;
  categorySlug: string;
  reason?: string;
  contact?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

// ---------- 二三期：收藏（已登录用户） ----------
export interface Favorite {
  id: number;
  userId: number;
  siteId: number;
  createdAt: string;
}

// ---------- 二三期：举报 ----------
export interface Report {
  id: number;
  targetType: "site" | "resource" | "question" | "answer" | "buddy";
  targetId: number;
  reason: string;
  contact?: string;
  status: "pending" | "resolved" | "rejected";
  createdAt: string;
}

// ---------- 三期：学习资源 ----------
export type ResourceType = "note" | "paper" | "ebook" | "tutorial" | "link" | "other";

export interface Resource {
  id: number;
  userId: number;
  title: string;
  subject: string;          // 科目/标签：英语四级、高等数学、日语N2…
  resourceType: ResourceType;
  cover?: string;
  summary: string;
  fileUrl?: string;        // 一期只做链接，不做文件上传
  viewCount: number;
  likeCount: number;
  status: "pending" | "online" | "offline";
  createdAt: string;
}

// ---------- 三期：问答 ----------
export interface Question {
  id: number;
  userId: number;
  title: string;
  content: string;
  subject?: string;
  answerCount: number;
  likeCount: number;
  status: "online" | "pending" | "offline";
  answers: Answer[];
  createdAt: string;
}

export interface Answer {
  id: number;
  userId: number;
  questionId: number;
  content: string;
  isAccepted: boolean;
  likeCount: number;
  createdAt: string;
}

// ---------- 三期：学习搭子 ----------
export type BuddyStatus = "open" | "closed" | "offline";

export interface BuddyPost {
  id: number;
  userId: number;
  examType: string;    // 四六级、考研、教资、雅思、JLPT、TOPIK、DELE…
  goal: string;        // 目标一句话
  description: string;
  contact: string;
  status: BuddyStatus;
  createdAt: string;
}

// ---------- 小工具：番茄钟 ----------
export interface PomodoroSettings {
  focusMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
}

// ---------- 小工具：考试倒数日 ----------
export interface ExamCountdown {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
}

// ---------- 小工具：课程表 ----------
export interface CourseItem {
  id: string;
  name: string;
  teacher?: string;
  location?: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=周日
  startSection: number;
  endSection: number;
  color?: string;
}

// ---------- 小工具：GPA ----------
export type GpaSystem = "4" | "5"; // 四分制 / 五分制

export interface GpaCourse {
  id: string;
  name: string;
  credit: number;
  score: number;
}

// ---------- 小工具：单词卡 ----------
export interface WordCard {
  id: string;
  front: string;
  back: string;
  nextReview: string; // ISO date
  level: number;      // 艾宾浩斯 0-6
}
