import { SiteCard } from "./site-card";
import type { Site } from "@/lib/types";

interface SiteGridProps {
  sites: Site[];
  className?: string;
}

export function SiteGrid({ sites, className }: SiteGridProps) {
  return (
    <div
      className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className || ""}`}
    >
      {sites.map((site) => (
        <SiteCard key={site.id} site={site} />
      ))}
    </div>
  );
}
