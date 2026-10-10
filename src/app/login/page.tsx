"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const errorParam = searchParams.get("error");

  const [showPassword, setShowPassword] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    // 获取 CSRF token
    fetch("/api/auth/csrf")
      .then((res) => res.json())
      .then((data) => {
        if (data?.csrfToken) setCsrfToken(data.csrfToken);
      })
      .catch(() => {});

    if (errorParam) {
      if (errorParam === "CredentialsSignin") {
        setErrMsg("邮箱或密码错误");
      } else {
        setErrMsg("登录失败，请稍后重试");
      }
    }
  }, [errorParam]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl mb-2">
              <img src="/logo-sheep.png" alt="xiaoyang.com" className="h-8 w-8 rounded-lg" />
              xiaoyang.com
            </Link>
            <h1 className="text-2xl font-bold mt-4">欢迎回来</h1>
            <p className="text-muted-foreground text-sm mt-1">登录你的账号</p>
          </div>

          {errMsg && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errMsg}
            </div>
          )}

          <form
            action="/api/auth/callback/credentials"
            method="POST"
            className="space-y-4"
          >
            <input type="hidden" name="csrfToken" value={csrfToken} />
            <input type="hidden" name="callbackUrl" value={callbackUrl} />

            <div className="space-y-2">
              <label className="text-sm font-medium">邮箱</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">密码</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={!csrfToken}>
              登录
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            还没有账号？
            <Link href="/register" className="text-primary hover:underline ml-1">
              立即注册
            </Link>
          </div>

          <div className="mt-4 pt-4 border-t text-xs text-muted-foreground text-center">
            测试账号：admin@example.com / admin123456
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
