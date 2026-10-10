"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Search,
  Plus,
  Clock,
  ThumbsUp,
  MessageSquare,
  User,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Question {
  id: number;
  title: string;
  content: string;
  subject: string | null;
  answerCount: number;
  likeCount: number;
  createdAt: string;
  user: { id: number; name: string; avatar: string | null };
}

export default function QuestionsPage() {
  const [list, setList] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"new" | "hot" | "unanswered">("new");
  const [showAsk, setShowAsk] = useState(false);

  const fetchList = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      sort,
    });
    if (q) params.set("q", q);

    const res = await fetch(`/api/help/questions?${params}`);
    const data = await res.json();
    if (data.code === 0) {
      setList(data.data.list);
      setTotal(data.data.total);
    }
    setLoading(false);
  }, [page, pageSize, q, sort]);

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
            <span>问答留言</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <MessageCircle className="h-7 w-7 text-purple-500" />
            问答留言板
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            共 {total} 个问题，有问题尽管问
          </p>
        </div>
        <Button onClick={() => setShowAsk(true)}>
          <Plus className="h-4 w-4 mr-2" />
          我要提问
        </Button>
      </div>

      {/* 搜索 + 排序 */}
      <div className="bg-card rounded-xl p-4 border mb-6 space-y-4">
        <form onSubmit={handleSearch} className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索问题..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-10"
          />
        </form>

        <div className="flex items-center gap-1">
          {[
            { v: "new", label: "最新" },
            { v: "hot", label: "最热" },
            { v: "unanswered", label: "待回答" },
          ].map((t) => (
            <button
              key={t.v}
              onClick={() => { setSort(t.v as "new" | "hot" | "unanswered"); setPage(1); }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                sort === t.v
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 问题列表 */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">暂无问题，来提第一个吧～</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((q) => (
            <Link key={q.id} href={`/help/questions/${q.id}`}>
              <Card className="group hover:border-primary/30 hover:shadow-sm transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* 回答数 */}
                    <div className="w-12 text-center shrink-0">
                      <div className={`text-xl font-bold ${
                        q.answerCount > 0 ? "text-green-500" : "text-muted-foreground"
                      }`}>
                        {q.answerCount}
                      </div>
                      <div className="text-[10px] text-muted-foreground">回答</div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm md:text-base group-hover:text-primary transition-colors line-clamp-1 mb-1">
                        {q.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {q.content}
                      </p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          {q.subject && (
                            <Badge variant="secondary" className="text-[10px] font-normal">
                              {q.subject}
                            </Badge>
                          )}
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {q.user.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {timeAgo(q.createdAt)}
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {q.likeCount}
                        </span>
                      </div>
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

      {/* 提问弹窗 */}
      {showAsk && (
        <AskQuestionModal
          onClose={() => setShowAsk(false)}
          onSuccess={() => {
            setShowAsk(false);
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

function AskQuestionModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    subject: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/help/questions", {
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
        <h2 className="text-xl font-bold mb-4">提问</h2>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">问题标题 *</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="用一句话描述你的问题"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">科目/标签（选填）</label>
            <Input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="如：高等数学、英语四级"
            />
          </div>

          <div>
            <label className="text-sm font-medium">问题描述 *</label>
            <textarea
              className="w-full min-h-[120px] px-3 py-2 rounded-lg border bg-background text-sm resize-y"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="详细描述你的问题，方便大家更好地帮助你..."
              maxLength={2000}
              required
            />
            <p className="text-xs text-muted-foreground text-right mt-1">
              {form.content.length}/2000
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "发布中..." : "发布问题"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
