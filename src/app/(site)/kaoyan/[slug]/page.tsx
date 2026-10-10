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
    .filter((c) => c.type === "kaoyan")
    .map((c) => ({ slug: c.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const category = getCategoryById(params.slug);
  if (!category) {
    return buildMetadata({ title: "分类不存在", path: `/kaoyan/${params.slug}` });
  }
  return buildMetadata({
    title: `${category.name} - 考研资料导航`,
    description: category.description,
    path: `/kaoyan/${params.slug}`,
  });
}

export default function KaoyanCategoryPage({ params }: PageProps) {
  const category = getCategoryById(params.slug);
  if (!category || category.type !== "kaoyan") notFound();
  return <CategoryDetailClient />;
}
