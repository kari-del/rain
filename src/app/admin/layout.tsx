import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Globe,
  Send,
  Flag,
  Users,
  LogOut,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }
  if (session.user.role !== "admin") {
    redirect("/");
  }

  const navItems = [
    { href: "/admin", label: "概览", icon: LayoutDashboard },
    { href: "/admin/sites", label: "站点管理", icon: Globe },
    { href: "/admin/submissions", label: "投稿审核", icon: Send },
    { href: "/admin/reports", label: "举报处理", icon: Flag },
    { href: "/admin/users", label: "用户管理", icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* 侧边栏 */}
      <aside className="hidden md:flex md:w-56 md:flex-col md:fixed md:inset-y-0 bg-card border-r">
        <div className="flex items-center gap-2 h-14 px-4 border-b">
          <img src="/logo-sheep-admin.png" alt="后台管理" className="h-6 w-6" />
          <span className="font-bold">后台管理</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t">
          <div className="px-3 py-2 text-sm text-muted-foreground mb-1">
            {session.user.name}
          </div>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
              退出登录
            </button>
          </form>
        </div>
      </aside>

      {/* 主内容 */}
      <main className="flex-1 md:ml-56">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
