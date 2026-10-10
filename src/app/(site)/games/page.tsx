import type { Metadata } from "next";
import { Gamepad2 } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "游戏兴趣导航",
  description: "游戏资讯、攻略社区、二次元、手游端游主机游戏平台",
  path: "/games",
});
import { CategorySection } from "@/components/site/category-section";
import { getCategoriesByType } from "@/content/categories";
import { SearchAndFilter } from "@/components/search/search-and-filter";
import { getSitesByType } from "@/content/sites";

export default function GamesPage() {
  const cats = getCategoriesByType("game");
  const allSites = getSitesByType("game");

  return (
    <div className="container py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
            <Gamepad2 className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">游戏兴趣导航</h1>
        </div>
        <p className="text-muted-foreground">
          游戏资讯、攻略社区、二次元、手游端游主机游戏平台
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
