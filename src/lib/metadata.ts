import type { Metadata } from "next";

export const siteConfig = {
  name: "xiaoyang.com",
  description: "面向学生的一站式学习入口，精选 AI 工具、快捷工具、游戏兴趣、考研资料与外语学习资源",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://xiaoyang.com",
  ogImage: "/og-image.png",
};

export function buildMetadata({
  title,
  description,
  path = "/",
}: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  const desc = description || siteConfig.description;
  const url = `${siteConfig.url}${path}`;

  return {
    title: fullTitle,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: siteConfig.name,
      images: [{ url: siteConfig.ogImage }],
      locale: "zh_CN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [siteConfig.ogImage],
    },
  };
}
