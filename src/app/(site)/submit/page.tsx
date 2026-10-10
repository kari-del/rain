"use client";

import { useState } from "react";
import { Send, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories } from "@/content/categories";

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    categorySlug: "",
    reason: "",
    contact: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.code === 0) {
        setSuccess(true);
        setFormData({ name: "", url: "", categorySlug: "", reason: "", contact: "" });
      } else {
        setError(data.message || "提交失败，请稍后重试");
      }
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Send className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">提交网站</h1>
            <p className="text-muted-foreground text-sm">
              发现好的学习网站？欢迎分享给更多同学
            </p>
          </div>
        </div>
      </div>

      {/* 收录原则 */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            收录原则
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              合法公开的学习类网站、工具、资源平台
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              内容质量较高、对学生学习有实际帮助
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              有正规运营主体，无恶意广告和诱导下载
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✕</span>
              盗版教材/影视/破解软件/付费资料分享站
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✕</span>
              网盘搜书、Sci-Hub、Z-Library 等侵权类
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✕</span>
              涉嫌翻墙、VPN、违规内容的网站
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* 提交表单 */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="font-semibold text-lg mb-4">投稿表单</h2>

          {success && (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm mb-4">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              提交成功！我们会尽快审核，感谢你的分享 🎉
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">网站名称 *</label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="例如：DeepSeek"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">网站地址 *</label>
                <Input
                  type="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  placeholder="https://..."
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">所属分类 *</label>
              <select
                className="w-full h-10 px-3 rounded-lg border bg-background text-sm"
                value={formData.categorySlug}
                onChange={(e) =>
                  setFormData({ ...formData, categorySlug: e.target.value })
                }
                required
              >
                <option value="">请选择分类</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.type === "ai" ? "AI · " : cat.type === "tool" ? "工具 · " : "外语 · "}
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">推荐理由</label>
              <textarea
                className="w-full min-h-[100px] px-3 py-2 rounded-lg border bg-background text-sm resize-y"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                placeholder="简单介绍一下这个网站好在哪里，为什么值得收录..."
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.reason.length}/500
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">联系邮箱（选填）</label>
              <Input
                type="email"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                placeholder="用于审核结果通知"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  提交中...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  提交投稿
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-3 text-center">
            提交后一般 1-3 个工作日内审核
          </p>
        </CardContent>
      </Card>

      {/* 问题反馈 */}
      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            失效举报
          </h2>
          <p className="text-sm text-muted-foreground mb-3">
            如果你发现某个网站无法访问、内容违规或有其他问题，欢迎在对应网站页面点击举报，或通过以下方式联系我们：
          </p>
          <p className="text-sm">
            举报邮箱：
            <a
              href="mailto:report@studenthub.example.com"
              className="text-primary hover:underline"
            >
              report@studenthub.example.com
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
