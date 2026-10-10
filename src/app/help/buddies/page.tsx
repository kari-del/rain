"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Clock,
  UserPlus,
  User,
  Target,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface BuddyPost {
  id: number;
  title: string;
  buddyType: string;
  target: string;
  description: string;
  maxMembers: number;
  currentMembers: number;
  status: string;
  createdAt: string;
  user: { id: number; name: string; avatar: string | null };
}

const typeLabels: Record<string, string> = {
  exam: "考试备考",
  daily: "日常监督",
  language: "语言学习",
  project: "项目组队",
  other: "其他",
};

const typeColors: Record<string, string> = {
  exam: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  daily: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  language: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  project: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  other: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

export default function BuddiesPage() {
  const [list, setList] = useState<BuddyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [q, setQ] = useState("");
  const [activeType, setActiveType] = useState("");
  const [showPublish, setShowPublish] = useState(false);

  const fetchList = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (q) params.set("q", q);
    if (activeType) params.set("buddyType", activeType);

    const res = await fetch(`/api/help/buddies?${params}`);
    const data = await res.json();
    if (data.code === 0) {
      setList(data.data.list);
      setTotal(data.data.total);
    }
    setLoading(false);
  }, [page, pageSize, q, activeType]);

  useEffect(() => { fetchList(); }, [fetchList]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchList();
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="container py-8">
      {/* 顶部 */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/help" className="hover:text-primary">互助社区</Link>
            <span>/</span>
            <span>学习搭子</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Users className="h-7 w-7 text-green-500" />
            学习搭子招募
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            共 {total} 个招募中，找个搭子一起进步
          </p>
        </div>
        <Button onClick={() => setShowPublish(true)}>
          <Plus className="h-4 w-4 mr-2" />
          发布招募
        </Button>
      </div>

      {/* 搜索 + 分类 */}
      <div className="bg-card rounded-xl p-4 border mb-6 space-y-4">
        <form onSubmit={handleSearch} className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索招募..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-10"
          />
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => { setActiveType(""); setPage(1); }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              !activeType
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            全部
          </button>
          {Object.entries(typeLabels).map(([k, v]) => (
            <button
              key={k}
              onClick={() => { setActiveType(k); setPage(1); }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeType === k
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* 列表 */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-16">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">暂无招募，来发布第一个吧～</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map((b) => (
            <Link key={b.id} href={`/help/buddies/${b.id}`}>
              <Card className="h-full group hover:border-primary/30 hover:shadow-sm transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <Badge
                      className={`text-[10px] ${typeColors[b.buddyType] || ""}`}
                      variant="outline"
                    >
                      {typeLabels[b.buddyType] || b.buddyType}
                    </Badge>
                    <Badge
                      variant={b.status === "open" ? "default" : "secondary"}
                      className="text-[10px]"
                    >
                      {b.status === "open" ? "招募中" : b.status === "full" ? "已满员" : "已结束"}
                    </Badge>
                  </div>

                  <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors mb-2">
                    {b.title}
                  </h3>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <Target className="h-3.5 w-3.5" />
                    <span className="line-clamp-1">{b.target}</span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                    {b.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-3 w-3" />
                      </div>
                      <span>{b.user.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <UserPlus className="h-3 w-3" />
                        {b.currentMembers}/{b.maxMembers} 人
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {timeAgo(b.createdAt)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            上一页
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            下一页
          </Button>
        </div>
      )}

      {/* 发布弹窗 */}
      {showPublish && (
        <PublishBuddyModal
          onClose={() => setShowPublish(false)}
          onSuccess={() => {
            setShowPublish(false);
            fetchList();
          }}
        />
      )}
    </div>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "刚刚";
  if (mins < 60) return `${mins} 分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} 天前`;
  return new Date(dateStr).toLocaleDateString("zh-CN");
}

function PublishBuddyModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    title: "",
    buddyType: "exam",
    target: "",
    description: "",
    maxMembers: 5,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/help/buddies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok && data.code === 0) {
        onSuccess();
      } else {
        setError(data.message || "发布失败");
      }
    } catch {
      setError("网络错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">发布招募</h2>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">标题 *</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="例如：找个考研英语搭子"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">类型 *</label>
              <select
                className="w-full h-10 px-3 rounded-lg border bg-background text-sm"
                value={form.buddyType}
                onChange={(e) => setForm({ ...form, buddyType: e.target.value })}
              >
                {Object.entries(typeLabels).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">人数 *</label>
              <input
                type="number"
                min={2}
                max={50}
                className="w-full h-10 px-3 rounded-lg border bg-background text-sm"
                value={form.maxMembers}
                onChange={(e) => setForm({ ...form, maxMembers: parseInt(e.target.value, 10) })}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">目标 *</label>
            <Input
              value={form.target}
              onChange={(e) => setForm({ ...form, target: e.target.value })}
              placeholder="例如：考研英语 70+"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">描述 *</label>
            <textarea
              className="w-full min-h-[100px] px-3 py-2 rounded-lg border bg-background text-sm resize-y"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="说说你的情况、期望的搭子是什么样的、怎么联系..."
              maxLength={1000}
              required
            />
            <p className="text-xs text-muted-foreground text-right mt-1">
              {form.description.length}/1000
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "发布中..." : "发布"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
