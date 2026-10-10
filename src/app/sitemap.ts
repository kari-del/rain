import type { MetadataRoute } from "next";
import { categories } from "@/content/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://studenthub.example.com";

  const routes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/ai`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/tools`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/language`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/games`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/kaoyan`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/favorites`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/submit`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.6 },
  ];

  // 分类页
  for (const cat of categories) {
    const url =
      cat.type === "language"
        ? `${baseUrl}/language/${cat.id}`
        : cat.type === "game"
        ? `${baseUrl}/games/${cat.id}`
        : cat.type === "kaoyan"
        ? `${baseUrl}/kaoyan/${cat.id}`
        : `${baseUrl}/category/${cat.id}`;
    routes.push({
      url,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return routes;
}
