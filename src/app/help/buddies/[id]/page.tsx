import { BuddyDetailClient } from "@/components/help/buddy-detail-client";

// 静态导出：互助详情页依赖 API，静态模式下返回空数组
export function generateStaticParams() {
  return [];
}

export const dynamicParams = false;

export default function BuddyDetailPage() {
  return <BuddyDetailClient />;
}
