import { BuddyDetailClient } from "@/components/help/buddy-detail-client";

// 静态导出：生成一个占位页面（详情页依赖 API，静态站点中不可用）
export function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export const dynamicParams = false;

export default function BuddyDetailPage() {
  return <BuddyDetailClient />;
}
