import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  Globe,
  Users,
  Send,
  Flag,
  MousePointerClick,
  TrendingUp,
} from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth();

  const [siteCount, userCount, pendingSubmissions, pendingReports, totalClicks] =
    await Promise.all([
      prisma.site.count(),
      prisma.user.count(),
      prisma.submission.count({ where: { status: "pending" } }),
      prisma.report.count({ where: { status: "pending" } }),
      prisma.site.aggregate({ _sum: { clickCount: true } }),
    ]);

  const hotSites = await prisma.site.findMany({
    orderBy: { clickCount: "desc" },
    take: 10,
    select: { id: true, name: true, clickCount: true, categoryId: true },
  });

  const recentSubmissions = await prisma.submission.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { user: { select: { name: true } } },
  });

  const stats = [
    { label: "收录网站", value: siteCount, icon: Globe, color: "text-blue-500" },
    { label: "注册用户", value: userCount, icon: Users, color: "text-green-500" },
    { label: "总点击量", value: totalClicks._sum.clickCount || 0, icon: MousePointerClick, color: "text-purple-500" },
    { label: "待审投稿", value: pendingSubmissions, icon: Send, color: "text-orange-500" },
    { label: "待处举报", value: pendingReports, icon: Flag, color: "text-red-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">后台概览</h1>
        <p className="text-muted-foreground text-sm mt-1">
          欢迎回来，{session?.user?.name}
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl p-4 border shadow-sm"
          >
            <div className={`mb-2 ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 热门站点 */}
        <div className="bg-card rounded-xl p-5 border">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">热门站点 Top 10</h2>
          </div>
          <div className="space-y-3">
            {hotSites.map((site: { id: number; name: string; clickCount: number; categoryId: string | null }, i: number) => (
              <div key={site.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-5 text-center text-sm ${i < 3 ? "font-bold text-primary" : "text-muted-foreground"}`}>
                    {i + 1}
                  </span>
                  <span className="text-sm">{site.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {site.clickCount} 次
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 最新投稿 */}
        <div className="bg-card rounded-xl p-5 border">
          <div className="flex items-center gap-2 mb-4">
            <Send className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">最新投稿</h2>
          </div>
          <div className="space-y-3">
            {recentSubmissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">暂无投稿</p>
            ) : (
              recentSubmissions.map((sub: { id: number; name: string; url: string; status: string; user: { name: string } | null }) => (
                <div
                  key={sub.id}
                  className="flex items-start justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">
                      {sub.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {sub.url}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                      sub.status === "pending"
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        : sub.status === "approved"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {sub.status === "pending"
                      ? "待审"
                      : sub.status === "approved"
                      ? "已通过"
                      : "已拒绝"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
