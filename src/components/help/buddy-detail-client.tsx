"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Users,
  ArrowLeft,
  User,
  Clock,
  Target,
  UserPlus,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  contact: string | null;
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

export function BuddyDetailClient() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BuddyPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const id = params?.id as string;

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data?.user?.id) setCurrentUserId(parseInt(data.user.id, 10));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      const res = await fetch(`/api/help/buddies/${id}`);
      const data = await res.json();
      if (data.code === 0) {
        setPost(data.data);
      } else {
        setError(data.message || "加载失败");
      }
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  const handleJoin = async () => {
    if (!post) return;
    setJoining(true);

    const res = await fetch(`/api/help/buddies/${id}`, { method: "POST" });
    const data = await res.json();

    if (res.ok && data.code === 0) {
      setJoined(true);
      setPost({
        ...post,
        currentMembers: data.data.currentMembers,
        status: data.data.status,
      });
    } else {
      alert(data.message || "报名失败");
    }
    setJoining(false);
  };

  if (loading) {
    return (
      <div className="container py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container py-16 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground mb-4">{error || "招募不存在"}</p>
        <Link href="/help/buddies">
          <Button variant="outline">返回列表</Button>
        </Link>
      </div>
    );
  }

  const isFull = post.status === "full";
  const isAuthor = currentUserId === post.user.id;
  const progress = Math.min((post.currentMembers / post.maxMembers) * 100, 100);

  return (
    <div className="container py-8 max-w-3xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        返回列表
      </button>

      <Card>
        <CardContent className="p-6 md:p-8">
          {/* 状态 + 类型 */}
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="text-xs">
              {typeLabels[post.buddyType] || post.buddyType}
            </Badge>
            <Badge
              variant={post.status === "open" ? "default" : "secondary"}
              className="text-xs"
            >
              {post.status === "open" ? "招募中" : post.status === "full" ? "已满员" : "已结束"}
            </Badge>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-3">{post.title}</h1>

          {/* 目标 */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Target className="h-4 w-4" />
            <span>目标：{post.target}</span>
          </div>

          {/* 人数进度 */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-1">
                <Users className="h-4 w-4" />
                组队进度
              </span>
              <span className="text-sm font-bold">
                {post.currentMembers} / {post.maxMembers} 人
              </span>
            </div>
            <div className="w-full h-2 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 作者信息 */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              {post.user.avatar ? (
                <img src={post.user.avatar} alt="" className="w-full h-full rounded-full" />
              ) : (
                <User className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <div className="font-medium">{post.user.name}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(post.createdAt).toLocaleString("zh-CN")}
              </div>
            </div>
          </div>

          {/* 描述 */}
          <div className="prose prose-sm dark:prose-invert max-w-none mb-8">
            <p className="whitespace-pre-wrap leading-relaxed">{post.description}</p>
          </div>

          {/* 报名按钮 */}
          <div className="flex gap-3">
            {isAuthor ? (
              <div className="flex-1 p-4 rounded-lg bg-muted text-center text-sm text-muted-foreground">
                这是你发布的招募
              </div>
            ) : joined ? (
              <div className="flex-1 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-center">
                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-medium">
                  <CheckCircle2 className="h-5 w-5" />
                  报名成功！
                </div>
                <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-1">
                  请主动联系发起人沟通细节～
                </p>
              </div>
            ) : (
              <Button
                className="flex-1"
                size="lg"
                disabled={isFull || joining}
                onClick={handleJoin}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {isFull ? "已满员" : joining ? "报名中..." : "我要加入"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
