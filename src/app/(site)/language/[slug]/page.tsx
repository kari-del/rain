import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LanguageDetailClient } from "@/components/language/language-detail-client";
import { getCategoryById } from "@/content/categories";
import { buildMetadata } from "@/lib/metadata";

interface PageProps {
  params: { slug: string };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const category = getCategoryById(params.slug);
  if (!category) {
    return buildMetadata({ title: "语种不存在", path: `/language/${params.slug}` });
  }
  return buildMetadata({
    title: `${category.name}学习 - 外语学习导航`,
    description: `${category.name}学习资源，覆盖课程、词典、听力、口语、语法、官方考试报名`,
    path: `/language/${params.slug}`,
  });
}

export default function LanguageDetailPage({ params }: PageProps) {
  const category = getCategoryById(params.slug);
  if (!category) notFound();
  return <LanguageDetailClient />;
}
