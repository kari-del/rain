import { ResourceDetailClient } from "@/components/help/resource-detail-client";

// 静态导出：互助详情页依赖 API，静态模式下返回空数组
export function generateStaticParams() {
  return [];
}

export const dynamicParams = false;

export default function ResourceDetailPage() {
  return <ResourceDetailClient />;
}
