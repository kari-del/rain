"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Sparkles, Wrench, Languages, Star, Heart, Gamepad2, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";

const navItems = [
  { href: "/ai", label: "AI 网站", icon: Sparkles },
  { href: "/tools", label: "快捷工具", icon: Wrench },
  { href: "/language", label: "外语学习", icon: Languages },
  { href: "/kaoyan", label: "考研资料", icon: GraduationCap },
  { href: "/games", label: "游戏兴趣", icon: Gamepad2 },
  { href: "/help", label: "学生互助", icon: Heart },
];

export function SiteHeader() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/ai") return pathname.startsWith("/ai") || pathname.startsWith("/category") && pathname.includes("ai");
    if (href === "/tools") return pathname.startsWith("/tools");
    if (href === "/language") return pathname.startsWith("/language");
    if (href === "/kaoyan") return pathname.startsWith("/kaoyan");
    if (href === "/games") return pathname.startsWith("/games");
    if (href === "/help") return pathname.startsWith("/help");
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
          <img src="/logo-sheep.png" alt="xiaoyang.com" className="h-8 w-8 rounded-lg" />
          <span className="hidden sm:inline">xiaoyang.com</span>
        </Link>

        {/* 桌面端导航 Tab */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 搜索框 */}
        <div className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索 AI 工具、学习网站..."
              className="pl-10 w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Link href="/favorites">
            <Button variant="ghost" size="icon" aria-label="我的收藏">
              <Star className="h-5 w-5" />
            </Button>
          </Link>
          <UserNav />
          <ThemeToggle />
        </div>
      </div>

      {/* 移动端底部导航 Tab */}
      <nav className="md:hidden flex items-center justify-around border-t bg-background px-2 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-md text-xs font-medium transition-colors",
                isActive(item.href)
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
