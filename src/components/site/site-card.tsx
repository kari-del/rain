"use client";

import Link from "next/link";
import { Star, ExternalLink, Globe } from "lucide-react";
import { useState } from "react";
import { cn, getInitials, extractDomain } from "@/lib/utils";
import { getFaviconUrl, getFaviconFallbackUrl, getFaviconDirectUrl } from "@/lib/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import type { Site } from "@/lib/types";

interface SiteCardProps {
  site: Site;
  className?: string;
  /** 数据库站点 ID，存在时会上报点击统计 */
  dbId?: number;
}

const regionMap = {
  domestic: { label: "国内", variant: "success" as const },
  foreign: { label: "国外", variant: "info" as const },
};

const languageMap: Record<string, string> = {
  en: "英语",
  ja: "日语",
  ko: "韩语",
  es: "西语",
  fr: "法语",
  multi: "多语种",
};

export function SiteCard({ site, className, dbId }: SiteCardProps) {
  const [faviconStage, setFaviconStage] = useState(0); // 0=primary, 1=fallback, 2=direct, 3=emoji/initials
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const faved = isFavorite(site.id);
  const region = regionMap[site.region];
  const domain = extractDomain(site.url);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(site.id);
  };

  const handleFaviconError = () => {
    setFaviconStage((s) => Math.min(s + 1, 3));
  };

  const handleLinkClick = () => {
    if (dbId && typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(`/api/sites/${dbId}/click`);
    }
  };

  return (
    <Link
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleLinkClick}
      className={cn(
        "group block rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5",
        className
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          {/* Logo / Favicon / Emoji */}
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
            {site.logo && faviconStage < 3 ? (
              <img
                src={site.logo}
                alt={site.name}
                className="w-8 h-8 object-contain"
                onError={handleFaviconError}
                loading="lazy"
              />
            ) : faviconStage === 0 && (!site.emoji || site.categoryId.startsWith("game-")) ? (
              <img
                src={getFaviconUrl(site.url)}
                alt={site.name}
                className="w-6 h-6 object-contain"
                onError={handleFaviconError}
                loading="lazy"
              />
            ) : faviconStage === 1 ? (
              <img
                src={getFaviconFallbackUrl(site.url)}
                alt={site.name}
                className="w-6 h-6 object-contain"
                onError={handleFaviconError}
                loading="lazy"
              />
            ) : faviconStage === 2 ? (
              <img
                src={getFaviconDirectUrl(site.url)}
                alt={site.name}
                className="w-6 h-6 object-contain"
                onError={handleFaviconError}
                loading="lazy"
              />
            ) : site.emoji ? (
              <span className="text-2xl leading-none">{site.emoji}</span>
            ) : (
              <span className="text-sm font-bold text-muted-foreground">
                {getInitials(site.name)}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                {site.name}
              </h3>
              {site.isHot && (
                <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
                  HOT
                </Badge>
              )}
              {site.isNew && (
                <Badge variant="success" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
                  NEW
                </Badge>
              )}
              {site.isOfficial && (
                <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4 shrink-0 bg-blue-600 hover:bg-blue-700">
                  官方
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{site.tagline}</p>
          </div>

          {/* 收藏按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 -mr-2 -mt-1"
            onClick={handleFavoriteClick}
            aria-label={faved ? "取消收藏" : "收藏"}
          >
            <Star
              className={cn(
                "h-4 w-4 transition-all",
                faved ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
              )}
            />
          </Button>
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {region && (
            <Badge variant={region.variant} className="text-[10px] font-normal">
              {region.label}
            </Badge>
          )}
          {site.language && site.language !== "multi" && (
            <Badge variant="info" className="text-[10px] font-normal">
              {languageMap[site.language] || site.language}
            </Badge>
          )}
          {site.isFree && (
            <Badge variant="success" className="text-[10px] font-normal">
              免费
            </Badge>
          )}
          {site.tags.includes("官方") && (
            <Badge variant="warning" className="text-[10px] font-normal">
              官方
            </Badge>
          )}
          {site.tags.slice(0, 2).map((tag) => {
            if (["免费", "官方", "国内可直连"].includes(tag)) return null;
            return (
              <Badge key={tag} variant="secondary" className="text-[10px] font-normal">
                {tag}
              </Badge>
            );
          })}
        </div>

        {/* 底部：域名 + 外链图标 */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
          <div className="flex items-center gap-1 truncate">
            <Globe className="h-3 w-3 shrink-0" />
            <span className="truncate">{domain}</span>
          </div>
          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>
      </div>
    </Link>
  );
}
