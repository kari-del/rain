"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SearchAndFilter } from "@/components/search/search-and-filter";
import { getCategoryById } from "@/content/categories";
import { getSitesByCategory } from "@/content/sites";
import { cn } from "@/lib/utils";

// 外语板块的功能标签筛选选项
const functionTags = [
  { key: "all", label: "全部" },
  { key: "课程入门", label: "课程入门" },
  { key: "词典", label: "词典" },
  { key: "听力", label: "听力" },
  { key: "口语", label: "口语" },
  { key: "语法阅读", label: "语法阅读" },
  { key: "官方考试", label: "官方考试" },
];

const langColors: Record<string, string> = {
  "lang-general": "from-blue-500 to-cyan-500",
  "lang-en": "from-rose-500 to-pink-500",
  "lang-ja": "from-amber-500 to-orange-500",
  "lang-ko": "from-emerald-500 to-teal-500",
  "lang-es": "from-violet-500 to-purple-500",
  "lang-fr": "from-indigo-500 to-blue-500",
};

export function LanguageDetailClient() {
  const params = useParams();
  const slug = params.slug as string;
  const [activeTag, setActiveTag] = useState("all");

  const category = getCategoryById(slug);
  const allSites = getSitesByCategory(slug);

  const filteredSites = useMemo(() => {
    if (activeTag === "all") return allSites;
    return allSites.filter((s) => s.tags.includes(activeTag));
  }, [allSites, activeTag]);

  if (!category) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">语种不存在</p>
        <Link href="/language" className="text-primary text-sm">
          ← 返回外语首页
        </Link>
      </div>
    );
  }

  const colorClass = langColors[slug] || "from-blue-500 to-cyan-500";

  return (
    <div className="container py-10">
      <Link
        href="/language"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        返回外语首页
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center`}
          >
            {category.emoji ? (
              <span className="text-2xl leading-none">{category.emoji}</span>
            ) : (
              <span className="text-2xl">📚</span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground text-sm">{category.description}</p>
          </div>
        </div>
      </div>

      {/* 功能标签筛选条 */}
      <div className="flex flex-wrap gap-2 mb-6 scrollbar-thin overflow-x-auto pb-2">
        {functionTags.map((tag) => (
          <button
            key={tag.key}
            onClick={() => setActiveTag(tag.key)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              activeTag === tag.key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            )}
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* 搜索 + 筛选 + 列表 */}
      <SearchAndFilter sites={filteredSites} />

      {/* 官方考试提示 */}
      {activeTag === "官方考试" && (
        <div className="mt-8 rounded-lg border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20 p-4 text-sm">
          <p className="font-medium text-amber-800 dark:text-amber-300 mb-1">⚠️ 报名注意</p>
          <p className="text-amber-700 dark:text-amber-400">
            考试报名请认准教育部教育考试院 neea.cn 官方域名，警惕钓鱼网站和代报名诈骗。
          </p>
        </div>
      )}
    </div>
  );
}
