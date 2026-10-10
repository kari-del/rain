"use client";

import { useState, useMemo, useRef } from "react";
import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteGrid } from "@/components/site/site-grid";
import { createFuseInstance, searchSites, buildSearchIndex } from "@/lib/search";
import { cn } from "@/lib/utils";
import type { Site } from "@/lib/types";

interface SearchAndFilterProps {
  sites: Site[];
  categoryLabel?: string;
  showFilters?: boolean;
  className?: string;
}

type RegionFilter = "all" | "domestic" | "foreign";
type FreeFilter = "all" | "free" | "paid";

export function SearchAndFilter({
  sites,
  showFilters = true,
  className,
}: SearchAndFilterProps) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [free, setFree] = useState<FreeFilter>("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const indexedSites = useMemo(() => buildSearchIndex(sites), [sites]);
  const fuse = useMemo(() => createFuseInstance(indexedSites), [indexedSites]);

  const results = useMemo(() => {
    const trimmed = query.trim();
    let list: Site[];

    if (!trimmed) {
      list = sites;
    } else {
      list = searchSites(fuse, trimmed);
    }

    // 筛选
    if (region !== "all") {
      list = list.filter((s) => s.region === region);
    }
    if (free === "free") {
      list = list.filter((s) => s.isFree);
    } else if (free === "paid") {
      list = list.filter((s) => !s.isFree);
    }

    // 排序：isHot 优先，然后 sortOrder
    return list.sort((a, b) => {
      if (a.isHot && !b.isHot) return -1;
      if (!a.isHot && b.isHot) return 1;
      return a.sortOrder - b.sortOrder;
    });
  }, [query, region, free, sites, fuse]);

  const hasActiveFilters = region !== "all" || free !== "all";

  const clearFilters = () => {
    setRegion("all");
    setFree("all");
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className={className}>
      {/* 搜索框 + 筛选按钮 */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索名称、标签、功能，支持日语 词典 组合搜索"
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {showFilters && (
          <Button
            variant="outline"
            className="md:hidden shrink-0"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <Filter className="h-4 w-4 mr-1" />
            筛选
            {hasActiveFilters && (
              <Badge variant="destructive" className="ml-1 text-[10px] px-1 h-4">
                !
              </Badge>
            )}
          </Button>
        )}
      </div>

      {/* 桌面端筛选条 */}
      {showFilters && (
        <div className="hidden md:flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground mr-1">地区：</span>
          <FilterChip
            active={region === "all"}
            onClick={() => setRegion("all")}
          >
            全部
          </FilterChip>
          <FilterChip
            active={region === "domestic"}
            onClick={() => setRegion("domestic")}
          >
            国内
          </FilterChip>
          <FilterChip
            active={region === "foreign"}
            onClick={() => setRegion("foreign")}
          >
            国外
          </FilterChip>

          <span className="text-sm text-muted-foreground ml-4 mr-1">收费：</span>
          <FilterChip
            active={free === "all"}
            onClick={() => setFree("all")}
          >
            全部
          </FilterChip>
          <FilterChip
            active={free === "free"}
            onClick={() => setFree("free")}
          >
            免费
          </FilterChip>
          <FilterChip
            active={free === "paid"}
            onClick={() => setFree("paid")}
          >
            付费
          </FilterChip>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-xs"
              onClick={clearFilters}
            >
              <X className="h-3 w-3 mr-1" />
              清除筛选
            </Button>
          )}
        </div>
      )}

      {/* 移动端筛选面板 */}
      {showMobileFilters && showFilters && (
        <div className="md:hidden p-4 border rounded-lg mb-4 bg-card animate-fade-in">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-2">地区</p>
              <div className="flex flex-wrap gap-2">
                {["all", "domestic", "foreign"].map((r) => (
                  <FilterChip
                    key={r}
                    active={region === (r as RegionFilter)}
                    onClick={() => setRegion(r as RegionFilter)}
                  >
                    {r === "all" ? "全部" : r === "domestic" ? "国内" : "国外"}
                  </FilterChip>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">收费</p>
              <div className="flex flex-wrap gap-2">
                {["all", "free", "paid"].map((f) => (
                  <FilterChip
                    key={f}
                    active={free === (f as FreeFilter)}
                    onClick={() => setFree(f as FreeFilter)}
                  >
                    {f === "all" ? "全部" : f === "free" ? "免费" : "付费"}
                  </FilterChip>
                ))}
              </div>
            </div>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" className="w-full" onClick={clearFilters}>
                清除全部筛选
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 结果计数 */}
      <div className="text-sm text-muted-foreground mb-4">
        共 <span className="font-medium text-foreground">{results.length}</span> 个结果
        {query && <span>，关键词：「{query}」</span>}
      </div>

      {/* 结果列表 / 空状态 */}
      {results.length > 0 ? (
        <SiteGrid sites={results} />
      ) : (
        <div className="text-center py-16">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground mb-2">
            {query ? "没有找到匹配的网站" : "暂无网站"}
          </p>
          <p className="text-sm text-muted-foreground/70">
            试试其他关键词，或
            <Button variant="link" className="h-auto p-0 text-xs" onClick={clearFilters}>
              清除筛选条件
            </Button>
          </p>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1 rounded-full text-xs font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground hover:bg-accent"
      )}
    >
      {children}
    </button>
  );
}
