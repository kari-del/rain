import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryDetailClient } from "@/components/site/category-detail-client";
import { categories, getCategoryById } from "@/content/categories";
import { buildMetadata } from "@/lib/metadata";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return categories
    .filter((c) => c.type === "ai" || c.type === "tool")
    .map((c) => ({ slug: c.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const category = getCategoryById(params.slug);
  if (!category) {
    return buildMetadata({ title: "分类不存在", path: `/category/${params.slug}` });
  }
  return buildMetadata({
    title: `${category.name} - ${category.type === "ai" ? "AI工具" : "快捷工具"}`,
    description: category.description,
    path: `/category/${params.slug}`,
  });
}

export default function CategoryPage({ params }: PageProps) {
  const category = getCategoryById(params.slug);
  if (!category) notFound();
  return <CategoryDetailClient />;
}
