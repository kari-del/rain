import Link from "next/link";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SiteGrid } from "@/components/site/site-grid";
import { getSitesByCategory } from "@/content/sites";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

function getIcon(name: string): LucideIcon {
  const map = Icons as unknown as Record<string, LucideIcon>;
  return map[name] || Icons.Box;
}

interface CategorySectionProps {
  category: Category;
  limit?: number;
  showViewAll?: boolean;
}

export function CategorySection({ category, limit = 6, showViewAll = true }: CategorySectionProps) {
  const sites = getSitesByCategory(category.id).slice(0, limit);
  const IconComponent = getIcon(category.icon);

  if (sites.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <IconComponent className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{category.name}</h2>
            {category.description && (
              <p className="text-sm text-muted-foreground">{category.description}</p>
            )}
          </div>
        </div>
        {showViewAll && (
          <Link
            href={
              category.type === "language"
                ? `/language/${category.id}`
                : category.type === "game"
                ? `/games/${category.id}`
                : `/category/${category.id}`
            }
            className="text-sm text-primary flex items-center gap-1 hover:gap-2 transition-all shrink-0"
          >
            查看全部 <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <SiteGrid sites={sites} />
    </section>
  );
}

// 大分类卡片（用于外语首页的语种卡片）
interface CategoryCardProps {
  category: Category;
  count?: number;
  href?: string;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
}

export function CategoryCard({
  category,
  count,
  href,
  colorFrom = "from-blue-500",
  colorTo = "to-cyan-500",
  className,
}: CategoryCardProps) {
  const IconComponent = getIcon(category.icon);
  const defaultHref =
    category.type === "language"
      ? `/language/${category.id}`
      : category.type === "game"
      ? `/games/${category.id}`
      : category.type === "kaoyan"
      ? `/kaoyan/${category.id}`
      : `/category/${category.id}`;
  const linkHref = href || defaultHref;

  return (
    <Link href={linkHref} className={cn("block group", className)}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
        <CardContent className="p-6">
          <div
            className={cn(
              "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform",
              colorFrom,
              colorTo
            )}
          >
            {category.emoji ? (
              <span className="text-3xl leading-none">{category.emoji}</span>
            ) : (
              <IconComponent className="h-7 w-7 text-white" />
            )}
          </div>
          <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 min-h-[2.5rem]">
            {category.description}
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {count !== undefined ? `${count} 个站点` : "浏览 →"}
            </span>
            <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
