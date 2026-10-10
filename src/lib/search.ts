import Fuse from "fuse.js";
import type { Site } from "@/lib/types";

// 常用词的拼音首字母映射（简化版，覆盖常见站点关键词）
const pinyinMap: Record<string, string> = {
  // 板块
  ai: "AI",
  // 通用
  对话: "dh",
  写作: "xz",
  搜索: "ss",
  绘画: "hh",
  视频: "sp",
  编程: "bc",
  办公: "bg",
  音乐: "yy",
  音频: "yp",
  设计: "sj",
  学习: "xx",
  翻译: "fy",
  词典: "cd",
  听力: "tl",
  口语: "ky",
  语法: "yf",
  阅读: "yd",
  考试: "ks",
  课程: "kc",
  入门: "rm",
  // 语种
  英语: "yy",
  日语: "ry",
  韩语: "hy",
  西班牙语: "xb",
  法语: "fy",
  多语种: "dyy",
  // 工具
  图片: "tp",
  压缩: "ys",
  抠图: "kt",
  转换: "zh",
  思维导图: "swdt",
  学术: "xs",
  论文: "lw",
  免费: "mf",
  官方: "gf",
  报名: "bm",
};

/**
 * 为搜索生成扩展字段：把中文标签转成拼音首字母加到 aliases 里
 */
export function buildSearchIndex(sites: Site[]): Site[] {
  return sites.map((site) => {
    const extraAliases: string[] = [];
    // 从 tags 里提取拼音首字母
    for (const tag of site.tags) {
      if (pinyinMap[tag]) {
        extraAliases.push(pinyinMap[tag]);
      }
    }
    // 从 name 里简单尝试
    if (pinyinMap[site.name]) {
      extraAliases.push(pinyinMap[site.name]);
    }
    return {
      ...site,
      aliases: [...site.aliases, ...extraAliases],
    };
  });
}

export function createFuseInstance(sites: Site[]) {
  return new Fuse(sites, {
    keys: [
      { name: "name", weight: 0.4 },
      { name: "aliases", weight: 0.3 },
      { name: "tags", weight: 0.2 },
      { name: "tagline", weight: 0.1 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
    includeScore: true,
    minMatchCharLength: 1,
  });
}

/**
 * 搜索：支持多关键词空格分隔（例如 "日语 词典"）
 */
export function searchSites(
  fuse: Fuse<Site>,
  query: string,
  filters?: {
    type?: "ai" | "tool" | "language";
    region?: "domestic" | "foreign";
    isFree?: boolean;
    language?: string;
    categoryId?: string;
  }
): Site[] {
  const trimmed = query.trim();
  let results: Site[];

  if (!trimmed) {
    results = [];
  } else {
    // 多关键词：空格分隔，分别搜索取交集
    const keywords = trimmed.split(/\s+/).filter(Boolean);
    if (keywords.length === 1) {
      results = fuse.search(keywords[0]).map((r) => r.item);
    } else {
      const sets = keywords.map((kw) => new Set(fuse.search(kw).map((r) => r.item.id)));
      const intersection = sets.reduce((a, b) => {
        return new Set(Array.from(a).filter((x) => b.has(x)));
      });
      const idSet = new Set(intersection);
      results = fuse.search(keywords[0])
        .map((r) => r.item)
        .filter((s) => idSet.has(s.id));
    }
  }

  // 应用筛选
  if (filters) {
    results = results.filter((site) => {
      if (filters.categoryId && site.categoryId !== filters.categoryId) return false;
      if (filters.region && site.region !== filters.region) return false;
      if (filters.isFree !== undefined && site.isFree !== filters.isFree) return false;
      if (filters.language && site.language !== filters.language) return false;
      return true;
    });
  }

  return results;
}
