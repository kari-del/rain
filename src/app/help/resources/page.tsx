"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Filter,
  ThumbsUp,
  Eye,
  FileText,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Resource {
  id: number;
  title: string;
  subject: string;
  resourceType: string;
  cover: string | null;
  summary: string;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  user: { id: number; name: string; avatar: string | null };
}

const typeLabels: Record<string, string> = {
  note: "笔记",
  paper: "试卷",
  ebook: "电子书",
  tutorial: "教程",
  link: "链接",
  other: "其他",
};

const typeColors: Record<string, string> = {
  note: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  paper: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  ebook: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  tutorial: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  link: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  other: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

export default function ResourcesPage() {
  const [list, setList] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [q, setQ] = useState("");
  const [activeType, setActiveType] = useState("");
  const [sort, setSort] = useState<"new" | "hot">("new");
  const [showPublish, setShowPublish] = useState(false);

  const fetchList = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      sort,
    });
    if (q) params.set("q", q);
    if (activeType) params.set("resourceType", activeType);

    const res = await fetch(`/api/help/resources?${params}`);
    const data = await res.json();
    if (data.code === 0) {
      setList(data.data.list);
      setTotal(data.data.total);
    }
    setLoading(false);
  }, [page, pageSize, q, activeType, sort]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

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
            <span>资源共享</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-blue-500" />
            资源共享板
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            共 {total} 份优质学习资源，持续更新中
          </p>
        </div>
        <Button onClick={() => setShowPublish(true)}>
          <Plus className="h-4 w-4 mr-2" />
          分享资源
        </Button>
      </div>

      {/* 搜索 + 筛选 */}
      <div className="bg-card rounded-xl p-4 border mb-6 space-y-4">
        <form onSubmit={handleSearch} className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索资源名称、科目..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-10"
          />
        </form>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground" />
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

          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => setSort("new")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                sort === "new"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              最新
            </button>
            <button
              onClick={() => setSort("hot")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                sort === "hot"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              最热
            </button>
          </div>
        </div>
      </div>

      {/* 资源列表 */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">暂无资源，来分享第一个吧～</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((r) => (
            <Link key={r.id} href={`/help/resources/${r.id}`}>
              <Card className="h-full group hover:border-primary/30 hover:shadow-sm transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    {r.cover ? (
                      <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden shrink-0">
                        <img
                          src={r.cover}
                          alt={r.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                        <BookOpen className="h-7 w-7 text-blue-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <Badge
                        className={`text-[10px] mb-1 ${typeColors[r.resourceType] || ""}`}
                        variant="outline"
                      >
                        {typeLabels[r.resourceType] || r.resourceType}
                      </Badge>
                      <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {r.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {r.summary}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-[10px] font-normal">
                      {r.subject}
                    </Badge>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {r.viewCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {r.likeCount}
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
        <PublishResourceModal
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

function PublishResourceModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    title: "",
    subject: "",
    resourceType: "note",
    summary: "",
    fileUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/help/resources", {
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
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">分享资源</h2>

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
              placeholder="例如：高等数学期末复习笔记"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">科目/标签 *</label>
              <Input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="如：英语四级"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">类型 *</label>
              <select
                className="w-full h-10 px-3 rounded-lg border bg-background text-sm"
                value={form.resourceType}
                onChange={(e) => setForm({ ...form, resourceType: e.target.value })}
              >
                {Object.entries(typeLabels).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">简介 *</label>
            <textarea
              className="w-full min-h-[100px] px-3 py-2 rounded-lg border bg-background text-sm resize-y"
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="简单介绍一下资源内容、适用人群等..."
              maxLength={500}
              required
            />
            <p className="text-xs text-muted-foreground text-right mt-1">
              {form.summary.length}/500
            </p>
          </div>

          <div>
            <label className="text-sm font-medium">资源链接（选填）</label>
            <Input
              type="url"
              value={form.fileUrl}
              onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
              placeholder="https://..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              网盘链接、文档链接、外部网站等
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
