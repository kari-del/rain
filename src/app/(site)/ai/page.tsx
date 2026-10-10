import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "AI 网站导航",
  description: "精选国内外主流AI工具，涵盖对话写作、绘画、视频、编程、办公等9大分类",
  path: "/ai",
});
import { CategorySection } from "@/components/site/category-section";
import { getCategoriesByType } from "@/content/categories";
import { SearchAndFilter } from "@/components/search/search-and-filter";
import { getSitesByType } from "@/content/sites";

export default function AIPage() {
  const cats = getCategoriesByType("ai");
  const allSites = getSitesByType("ai");

  return (
    <div className="container py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">AI 网站导航</h1>
        </div>
        <p className="text-muted-foreground">
          精选国内外主流 AI 工具，涵盖对话写作、绘画、视频、编程、办公等场景
        </p>
      </div>

      {/* 搜索 + 全局列表 */}
      <div className="mb-12">
        <SearchAndFilter sites={allSites} />
      </div>

      {/* 按分类浏览 */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">按分类浏览</h2>
        {cats.map((cat) => (
          <CategorySection key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}
