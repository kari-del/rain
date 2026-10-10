"use client";

import Link from "next/link";
import { Star, Plus } from "lucide-react";
import { SiteGrid } from "@/components/site/site-grid";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { getSiteById } from "@/content/sites";
import { buttonVariants } from "@/components/ui/button";

export default function FavoritesPage() {
  const { favoriteIds } = useFavoritesStore();
  const favoriteSites = favoriteIds
    .map((id) => getSiteById(id))
    .filter((s): s is NonNullable<typeof s> => !!s);

  return (
    <div className="container py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
            <Star className="h-5 w-5 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">我的收藏</h1>
            <p className="text-muted-foreground text-sm">
              共收藏 {favoriteSites.length} 个网站
            </p>
          </div>
        </div>
      </div>

      {favoriteSites.length > 0 ? (
        <SiteGrid sites={favoriteSites} />
      ) : (
        <div className="text-center py-20 border rounded-xl bg-card">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
            <Star className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">还没有收藏</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            浏览网站时点击卡片右上角的星标，即可把常用网站收藏到这里
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/ai" className={buttonVariants({})}>
                <Plus className="h-4 w-4 mr-1" />
                去发现网站
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
