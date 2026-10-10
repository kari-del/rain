import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "外语学习导航",
  description: "英语、日语、韩语、西班牙语、法语多语种学习资源，覆盖课程、词典、听力、口语、官方考试报名",
  path: "/language",
});
import { Languages, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getCategoriesByType } from "@/content/categories";
import { getSitesByCategory } from "@/content/sites";

const langColors: Record<string, string> = {
  "lang-general": "from-blue-500 to-cyan-500",
  "lang-en": "from-rose-500 to-pink-500",
  "lang-ja": "from-amber-500 to-orange-500",
  "lang-ko": "from-emerald-500 to-teal-500",
  "lang-es": "from-violet-500 to-purple-500",
  "lang-fr": "from-indigo-500 to-blue-500",
};

export default function LanguagePage() {
  const langCats = getCategoriesByType("language");

  return (
    <div className="container py-10">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
            <Languages className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">外语学习导航</h1>
        </div>
        <p className="text-muted-foreground">
          多语种综合学习资源，覆盖课程、词典、听力、口语、语法、官方考试报名
        </p>
      </div>

      {/* 6 大语种卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-16">
        {langCats.map((cat) => {
          const count = getSitesByCategory(cat.id).length;
          const colorClass = langColors[cat.id] || "from-blue-500 to-cyan-500";
          return (
            <Link key={cat.id} href={`/language/${cat.id}`}>
              <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <CardContent className="p-6">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Languages className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3 min-h-[2.5rem]">
                    {cat.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{count} 个站点</span>
                    <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* 提示 */}
      <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground mb-1">💡 使用提示</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>官方考试报名网站已标注「官方」角标，请认准教育考试院 neea 域名，谨防钓鱼</li>
          <li>搜索支持组合关键词，例如「日语 词典」「英语 听力」「韩语 考试」</li>
          <li>境外站点仅客观展示，不提供任何绕过网络管制的方法</li>
        </ul>
      </div>
    </div>
  );
}
