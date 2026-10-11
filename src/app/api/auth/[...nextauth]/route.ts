import { handlers } from "@/auth";

// 静态导出模式：返回空数组（API 路由在静态站点中不可用）
export function generateStaticParams() {
  return [{ nextauth: [] }];
}

export const { GET, POST } = handlers;
