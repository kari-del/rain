import { handlers } from "@/auth";

export const { GET, POST } = handlers;

// 静态导出模式：返回空数组（API 路由在静态站点中不可用）
export function generateStaticParams() {
  return [{ nextauth: [] }];
}
