import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "考研资料导航",
  description: "研招网、408计算机考研、公共课、真题笔记与社区论坛",
  path: "/kaoyan",
});
import { CategorySection } from "@/components/site/category-section";
import { getCategoriesByType } from "@/content/categories";
import { SearchAndFilter } from "@/components/search/search-and-filter";
import { getSitesByType } from "@/content/sites";

export default function KaoyanPage() {
  const cats = getCategoriesByType("kaoyan");
  const allSites = getSitesByType("kaoyan");

  return (
    <div className="container py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">考研资料导航</h1>
        </div>
        <p className="text-muted-foreground">
          研招网、408 计算机考研、公共课、真题笔记与社区论坛
        </p>
        <p className="text-xs text-amber-600 mt-2 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 rounded-lg inline-block">
          ⚠️ 报名/调剂/查分请认准官方站点（带「官方」角标），警惕「代报名、内部名额、保过、付费调剂」等诈骗
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
