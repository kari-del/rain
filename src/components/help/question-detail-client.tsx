"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  MessageCircle,
  ArrowLeft,
  ThumbsUp,
  Clock,
  User,
  Send,
  CheckCircle2,
  Flag,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Answer {
  id: number;
  content: string;
  isAccepted: boolean;
  likeCount: number;
  createdAt: string;
  user: { id: number; name: string; avatar: string | null };
}

interface Question {
  id: number;
  title: string;
  content: string;
  subject: string | null;
  answerCount: number;
  likeCount: number;
  createdAt: string;
  user: { id: number; name: string; avatar: string | null };
  answers: Answer[];
}

export function QuestionDetailClient() {
  const params = useParams();
  const router = useRouter();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const id = params?.id as string;

  useEffect(() => {
    // 获取当前用户
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
      const res = await fetch(`/api/help/questions/${id}`);
      const data = await res.json();
      if (data.code === 0) {
        setQuestion(data.data);
      } else {
        setError(data.message || "加载失败");
      }
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  const handleSubmitAnswer = async () => {
    if (!answerText.trim() || answerText.length < 5) return;
    setSubmitting(true);

    const res = await fetch(`/api/help/questions/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: answerText }),
    });
    const data = await res.json();

    if (res.ok && data.code === 0) {
      setAnswerText("");
      // 刷新
      const detailRes = await fetch(`/api/help/questions/${id}`);
      const detailData = await detailRes.json();
      if (detailData.code === 0) setQuestion(detailData.data);
    } else {
      alert(data.message || "提交失败");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="container py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="container py-16 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground mb-4">{error || "问题不存在"}</p>
        <Link href="/help/questions">
          <Button variant="outline">返回列表</Button>
        </Link>
      </div>
    );
  }

  const isAuthor = currentUserId === question.user.id;

  return (
    <div className="container py-8 max-w-3xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        返回列表
      </button>

      {/* 问题 */}
      <Card className="mb-6">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-3">
            {question.subject && (
              <Badge variant="outline" className="text-xs">{question.subject}</Badge>
            )}
            {question.answerCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {question.answerCount} 个回答
              </Badge>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-4">{question.title}</h1>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              {question.user.avatar ? (
                <img src={question.user.avatar} alt="" className="w-full h-full rounded-full" />
              ) : (
                <User className="h-4 w-4 text-primary" />
              )}
            </div>
            <div>
              <div className="text-sm font-medium">{question.user.name}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(question.createdAt).toLocaleString("zh-CN")}
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                {question.likeCount}
              </span>
            </div>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap leading-relaxed">{question.content}</p>
          </div>
        </CardContent>
      </Card>

      {/* 回答列表 */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          回答 ({question.answers.length})
        </h2>

        {question.answers.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border">
            <MessageCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-muted-foreground text-sm">暂无回答，来第一个回答吧～</p>
          </div>
        ) : (
          <div className="space-y-3">
            {question.answers.map((a) => (
              <Card key={a.id}>
                <CardContent className="p-4">
                  {a.isAccepted && (
                    <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-xs font-medium mb-3">
                      <CheckCircle2 className="h-4 w-4" />
                      已被采纳
                    </div>
                  )}

                  <div className="prose prose-sm dark:prose-invert max-w-none mb-3">
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">{a.content}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-3 w-3" />
                      </div>
                      <span>{a.user.name}</span>
                      <span>·</span>
                      <span>{new Date(a.createdAt).toLocaleDateString("zh-CN")}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1 hover:text-primary">
                        <ThumbsUp className="h-3.5 w-3.5" />
                        {a.likeCount}
                      </button>
                      {isAuthor && !a.isAccepted && (
                        <button className="text-green-600 dark:text-green-400 hover:underline">
                          采纳
                        </button>
                      )}
                      <button className="hover:text-destructive">
                        <Flag className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 回答输入框 */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-medium mb-3">写回答</h3>
          <textarea
            className="w-full min-h-[100px] px-3 py-2 rounded-lg border bg-background text-sm resize-y mb-3"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="分享你的见解，帮助同学解决问题..."
            maxLength={2000}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {answerText.length}/2000
            </span>
            <Button onClick={handleSubmitAnswer} disabled={submitting || answerText.length < 5}>
              <Send className="h-4 w-4 mr-2" />
              {submitting ? "提交中..." : "提交回答"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
