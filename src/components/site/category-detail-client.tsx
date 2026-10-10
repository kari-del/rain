"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";

function getIcon(name: string): LucideIcon {
  const map = Icons as unknown as Record<string, LucideIcon>;
  return map[name] || Icons.Box;
}
import { getCategoryById } from "@/content/categories";
import { getSitesByCategory } from "@/content/sites";
import { SearchAndFilter } from "@/components/search/search-and-filter";

export function CategoryDetailClient() {
  const params = useParams();
  const slug = params.slug as string;

  const category = getCategoryById(slug);
  const sites = getSitesByCategory(slug);

  if (!category) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">分类不存在</p>
        <Link href="/" className="text-primary text-sm">
          ← 返回首页
        </Link>
      </div>
    );
  }

  const IconComp = getIcon(category.icon);
  const backHref =
    category.type === "ai"
      ? "/ai"
      : category.type === "tool"
      ? "/tools"
      : category.type === "game"
      ? "/games"
      : category.type === "kaoyan"
      ? "/kaoyan"
      : "/language";
  const backLabel =
    category.type === "ai"
      ? "AI 网站"
      : category.type === "tool"
      ? "快捷工具"
      : category.type === "game"
      ? "游戏兴趣"
      : category.type === "kaoyan"
      ? "考研资料"
      : "外语学习";

  const colorClass =
    category.type === "ai"
      ? "from-blue-500 to-cyan-500"
      : category.type === "tool"
      ? "from-emerald-500 to-teal-500"
      : category.type === "game"
      ? "from-rose-500 to-orange-500"
      : category.type === "kaoyan"
      ? "from-blue-500 to-indigo-600"
      : "from-violet-500 to-purple-500";

  return (
    <div className="container py-10">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        返回{backLabel}
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center`}
          >
            {category.emoji ? (
              <span className="text-2xl leading-none">{category.emoji}</span>
            ) : (
              <IconComp className="h-6 w-6 text-white" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground text-sm">{category.description}</p>
          </div>
        </div>
      </div>

      <SearchAndFilter sites={sites} />
    </div>
  );
}
