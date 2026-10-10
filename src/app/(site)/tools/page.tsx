import type { Metadata } from "next";
import { Wrench } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "快捷工具导航",
  description: "PDF处理、图片编辑、格式转换、翻译、思维导图、学术资料等实用学习工具",
  path: "/tools",
});
import { CategorySection } from "@/components/site/category-section";
import { getCategoriesByType } from "@/content/categories";
import { SearchAndFilter } from "@/components/search/search-and-filter";
import { getSitesByType } from "@/content/sites";

export default function ToolsPage() {
  const cats = getCategoriesByType("tool");
  const allSites = getSitesByType("tool");

  return (
    <div className="container py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">快捷工具导航</h1>
        </div>
        <p className="text-muted-foreground">
          PDF 处理、图片编辑、格式转换、翻译工具、思维导图、学术资料等实用工具
        </p>
      </div>

      <div className="mb-12">
        <SearchAndFilter sites={allSites} />
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">按分类浏览</h2>
        {cats.map((cat) => (
          <CategorySection key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}
