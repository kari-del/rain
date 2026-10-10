"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ThumbsUp,
  Eye,
  Clock,
  User,
  ExternalLink,
  Flag,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Resource {
  id: number;
  title: string;
  subject: string;
  resourceType: string;
  cover: string | null;
  summary: string;
  fileUrl: string | null;
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

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const id = params?.id as string;

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      const res = await fetch(`/api/help/resources/${id}`);
      const data = await res.json();
      if (data.code === 0) {
        setResource(data.data);
      } else {
        setError(data.message || "加载失败");
      }
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  const handleLike = async () => {
    if (!resource || liked) return;
    const res = await fetch(`/api/help/resources/${id}`, { method: "POST" });
    const data = await res.json();
    if (data.code === 0) {
      setLiked(true);
      setResource({ ...resource, likeCount: data.data.likeCount });
    }
  };

  if (loading) {
    return (
      <div className="container py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="container py-16 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground mb-4">{error || "资源不存在"}</p>
        <Link href="/help/resources">
          <Button variant="outline">返回列表</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-3xl">
      {/* 返回 */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        返回列表
      </button>

      <Card>
        <CardContent className="p-6 md:p-8">
          {/* 标题区 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="text-xs">
                {typeLabels[resource.resourceType] || resource.resourceType}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {resource.subject}
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{resource.title}</h1>

            {/* 作者信息 */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  {resource.user.avatar ? (
                    <img src={resource.user.avatar} alt="" className="w-full h-full rounded-full" />
                  ) : (
                    <User className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium">{resource.user.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(resource.createdAt).toLocaleDateString("zh-CN")}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {resource.viewCount} 浏览
                </span>
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1 transition-colors ${
                    liked ? "text-primary" : "hover:text-primary"
                  }`}
                >
                  <ThumbsUp className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                  {resource.likeCount} 点赞
                </button>
                <button
                  onClick={() => setShowReport(true)}
                  className="flex items-center gap-1 hover:text-destructive"
                >
                  <Flag className="h-4 w-4" />
                  举报
                </button>
              </div>
            </div>
          </div>

          {/* 封面图 */}
          {resource.cover && (
            <div className="rounded-lg overflow-hidden mb-6">
              <img
                src={resource.cover}
                alt={resource.title}
                className="w-full object-cover max-h-64"
              />
            </div>
          )}

          {/* 正文 */}
          <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
            <p className="whitespace-pre-wrap leading-relaxed">{resource.summary}</p>
          </div>

          {/* 资源链接 */}
          {resource.fileUrl && (
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mb-6">
              <div className="text-sm font-medium mb-2">资源链接</div>
              <a
                href={resource.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm break-all inline-flex items-center gap-1"
              >
                {resource.fileUrl}
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            </div>
          )}

          {/* 底部操作 */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t">
            <Button onClick={handleLike} variant="outline" disabled={liked}>
              <ThumbsUp className={`h-4 w-4 mr-2 ${liked ? "fill-current" : ""}`} />
              {liked ? "已点赞" : "点赞支持"}
            </Button>
            <Button
              onClick={() => setShowReport(true)}
              variant="outline"
            >
              <Flag className="h-4 w-4 mr-2" />
              举报
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 举报弹窗 */}
      {showReport && (
        <ReportModal
          targetType="resource"
          targetId={resource.id}
          onClose={() => setShowReport(false)}
          onSuccess={() => setShowReport(false)}
        />
      )}
    </div>
  );
}

function ReportModal({
  targetType,
  targetId,
  onClose,
  onSuccess,
}: {
  targetType: string;
  targetId: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [reason, setReason] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.length < 5) {
      setError("举报理由至少 5 个字");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId, reason, contact }),
      });
      const data = await res.json();
      if (res.ok && data.code === 0) {
        onSuccess();
        alert("举报已提交，感谢你的反馈");
      } else {
        setError(data.message || "提交失败");
      }
    } catch {
      setError("网络错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">举报内容</h2>
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">举报理由 *</label>
            <textarea
              className="w-full min-h-[100px] px-3 py-2 rounded-lg border bg-background text-sm resize-y"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="请描述举报原因..."
              maxLength={500}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">联系邮箱（选填）</label>
            <input
              type="email"
              className="w-full h-10 px-3 rounded-lg border bg-background text-sm"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="方便我们反馈处理结果"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" variant="destructive" className="flex-1" disabled={loading}>
              {loading ? "提交中..." : "提交举报"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
