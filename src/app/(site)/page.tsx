import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Wrench, Languages, ArrowRight, TrendingUp, Gamepad2, GraduationCap } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "首页",
  description: "学生专属一站式学习导航，精选200+优质AI工具、快捷工具与外语学习资源",
});
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CategorySection } from "@/components/site/category-section";
import { SiteGrid } from "@/components/site/site-grid";
import { categories, getCategoriesByType } from "@/content/categories";
import { getHotSites, getSitesByCategory } from "@/content/sites";

const sections = [
  {
    href: "/ai",
    title: "AI 网站",
    description: "AI 对话、绘画、视频、编程、办公，精选国内外主流 AI 工具",
    icon: Sparkles,
    color: "from-blue-500 to-cyan-500",
    type: "ai" as const,
  },
  {
    href: "/tools",
    title: "快捷工具",
    description: "PDF、图片、翻译、思维导图、学术资料、学习效率工具",
    icon: Wrench,
    color: "from-emerald-500 to-teal-500",
    type: "tool" as const,
  },
  {
    href: "/language",
    title: "外语学习",
    description: "英语、日语、韩语、西班牙语、法语，多语种综合学习资源",
    icon: Languages,
    color: "from-violet-500 to-purple-500",
    type: "language" as const,
  },
  {
    href: "/games",
    title: "游戏兴趣",
    description: "游戏资讯、攻略社区、二次元、手游端游主机游戏平台",
    icon: Gamepad2,
    color: "from-rose-500 to-orange-500",
    type: "game" as const,
  },
  {
    href: "/kaoyan",
    title: "考研资料",
    description: "研招网、408 计算机考研、公共课、真题笔记与社区论坛",
    icon: GraduationCap,
    color: "from-blue-500 to-indigo-600",
    type: "kaoyan" as const,
  },
];

export default function HomePage() {
  const hotSites = getHotSites(8);
  const aiCats = getCategoriesByType("ai");
  const toolCats = getCategoriesByType("tool");
  const langCats = getCategoriesByType("language");
  const gameCats = getCategoriesByType("game");
  const kaoyanCats = getCategoriesByType("kaoyan");

  return (
    <div className="container py-10 md:py-16">
      {/* Hero */}
      <section className="text-center mb-16 animate-fade-in">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
          <Sparkles className="h-4 w-4" />
          学生专属学习导航
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
          一站式学习入口，
          <span className="text-primary">高效学习每一天</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          面向学生的一站式学习入口，精选优质 AI 工具、快捷工具、游戏兴趣、考研资料与外语学习资源
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link href="/ai" className={buttonVariants({ size: "lg" })}>
              开始探索 <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/about" className={buttonVariants({ variant: "outline", size: "lg" })}>
            了解更多
          </Link>
        </div>
      </section>

      {/* 三大板块入口 */}
      <section className="mb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            const catCount = categories.filter((c) => c.type === section.type).length;
            const siteCount = categories
              .filter((c) => c.type === section.type)
              .reduce((sum, c) => sum + getSitesByCategory(c.id).length, 0);
            return (
              <Link key={section.href} href={section.href}>
                <Card className="h-full overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {section.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {catCount} 分类 · {siteCount} 站点
                      </span>
                      <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        浏览 <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 热门推荐 */}
      {hotSites.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">热门推荐</h2>
          </div>
          <SiteGrid sites={hotSites} />
        </section>
      )}

      {/* AI 板块预览 */}
      {aiCats.slice(0, 2).map((cat) => (
        <CategorySection key={cat.id} category={cat} limit={4} />
      ))}

      {/* 工具板块预览 */}
      {toolCats.slice(0, 2).map((cat) => (
        <CategorySection key={cat.id} category={cat} limit={4} />
      ))}

      {/* 外语板块预览入口 */}
      <section className="mt-12 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">外语学习</h2>
          </div>
          <Link
            href="/language"
            className="text-sm text-primary flex items-center gap-1 hover:gap-2 transition-all"
          >
            查看全部 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {langCats.map((cat, idx) => {
            const colors = [
              "from-blue-500 to-cyan-500",
              "from-rose-500 to-pink-500",
              "from-amber-500 to-orange-500",
              "from-emerald-500 to-teal-500",
              "from-violet-500 to-purple-500",
              "from-indigo-500 to-blue-500",
            ];
            const count = getSitesByCategory(cat.id).length;
            return (
              <Link key={cat.id} href={`/language/${cat.id}`}>
                <Card className="h-full group hover:shadow-md transition-all hover:-translate-y-0.5">
                  <CardContent className="p-4 text-center">
                    <div
                      className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                    >
                      {cat.emoji ? (
                        <span className="text-2xl leading-none">{cat.emoji}</span>
                      ) : (
                        <Languages className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <h3 className="font-semibold text-sm">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{count} 个站点</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 游戏兴趣板块预览入口 */}
      <section className="mt-12 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">游戏兴趣</h2>
          </div>
          <Link
            href="/games"
            className="text-sm text-primary flex items-center gap-1 hover:gap-2 transition-all"
          >
            查看全部 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {gameCats.map((cat, idx) => {
            const colors = [
              "from-rose-500 to-orange-500",
              "from-pink-500 to-rose-500",
              "from-amber-500 to-yellow-500",
              "from-purple-500 to-indigo-500",
              "from-teal-500 to-emerald-500",
            ];
            const count = getSitesByCategory(cat.id).length;
            return (
              <Link key={cat.id} href={`/games/${cat.id}`}>
                <Card className="h-full group hover:shadow-md transition-all hover:-translate-y-0.5">
                  <CardContent className="p-4 text-center">
                    <div
                      className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                    >
                      {cat.emoji ? (
                        <span className="text-2xl leading-none">{cat.emoji}</span>
                      ) : (
                        <Gamepad2 className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <h3 className="font-semibold text-sm">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{count} 个站点</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 考研资料板块预览入口 */}
      <section className="mt-12 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">考研资料</h2>
          </div>
          <Link
            href="/kaoyan"
            className="text-sm text-primary flex items-center gap-1 hover:gap-2 transition-all"
          >
            查看全部 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {kaoyanCats.map((cat, idx) => {
            const colors = [
              "from-blue-500 to-indigo-600",
              "from-sky-500 to-blue-600",
              "from-indigo-500 to-purple-600",
              "from-cyan-500 to-blue-500",
              "from-blue-600 to-sky-600",
            ];
            const count = getSitesByCategory(cat.id).length;
            return (
              <Link key={cat.id} href={`/kaoyan/${cat.id}`}>
                <Card className="h-full group hover:shadow-md transition-all hover:-translate-y-0.5">
                  <CardContent className="p-4 text-center">
                    <div
                      className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                    >
                      {cat.emoji ? (
                        <span className="text-2xl leading-none">{cat.emoji}</span>
                      ) : (
                        <GraduationCap className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <h3 className="font-semibold text-sm">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{count} 个站点</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
