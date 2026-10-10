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
    <div className="container py-6 md:py-10 px-4 md:px-6">
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </div>
          <h1 className="text-xl md:text-3xl font-bold">AI 网站导航</h1>
        </div>
        <p className="text-muted-foreground text-sm md:text-base">
          精选国内外主流 AI 工具，涵盖对话写作、绘画、视频、编程、办公等场景
        </p>
      </div>

      {/* 搜索 + 全局列表 */}
      <div className="mb-8 md:mb-12">
        <SearchAndFilter sites={allSites} />
      </div>

      {/* 按分类浏览 */}
      <div className="mt-10 md:mt-16">
        <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">按分类浏览</h2>
        {cats.map((cat) => (
          <CategorySection key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}
