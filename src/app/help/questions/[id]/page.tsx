import { QuestionDetailClient } from "@/components/help/question-detail-client";

interface PageProps {
  params: { id: string };
}

// 静态导出：问答详情页依赖 API，静态模式下返回空数组
export function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export default function QuestionDetailPage({ params }: PageProps) {
  return <QuestionDetailClient />;
}
