"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, User, LogOut, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SessionUser {
  name?: string | null;
  email?: string | null;
  role?: string;
  id?: string;
}

export function UserNav() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    setUser(null);
    setOpen(false);
    router.refresh();
  };

  if (!user) {
    return (
      <Link href="/login">
        <Button variant="ghost" size="icon" aria-label="登录">
          <LogIn className="h-5 w-5" />
        </Button>
      </Link>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label="用户菜单"
        onClick={() => setOpen(!open)}
      >
        <User className="h-5 w-5" />
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-card border rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="px-4 py-3 border-b">
              <div className="font-medium text-sm truncate">{user.name}</div>
              <div className="text-xs text-muted-foreground truncate">
                {user.email}
              </div>
            </div>
            <div className="p-1">
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <Shield className="h-4 w-4" />
                  后台管理
                </Link>
              )}
              <Link
                href="/favorites"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors"
                onClick={() => setOpen(false)}
              >
                <Settings className="h-4 w-4" />
                我的收藏
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors text-left"
              >
                <LogOut className="h-4 w-4" />
                退出登录
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
