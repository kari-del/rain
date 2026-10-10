"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, X, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Report {
  id: number;
  targetType: string;
  targetId: number;
  reason: string;
  contact: string | null;
  status: string;
  createdAt: string;
}

export default function AdminReportsPage() {
  const [items, setItems] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("pending");

  const fetchList = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/reports?status=${status}`);
    const data = await res.json();
    if (data.code === 0) setItems(data.data.list);
    setLoading(false);
  }, [status]);

  useEffect(() => { fetchList(); }, [fetchList]);

  const handleResolve = async (id: number) => {
    if (!confirm("确认处理此举报？（站点类举报会自动下架）")) return;
    const res = await fetch(`/api/admin/reports/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "resolve" }),
    });
    if (res.ok) fetchList();
  };

  const handleDismiss = async (id: number) => {
    const res = await fetch(`/api/admin/reports/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "dismiss" }),
    });
    if (res.ok) fetchList();
  };

  const typeLabel: Record<string, string> = {
    site: "网站",
    resource: "资源",
    question: "问题",
    answer: "回答",
    buddy: "搭子帖",
  };

  const tabs = [
    { value: "pending", label: "待处理" },
    { value: "resolved", label: "已处理" },
    { value: "dismissed", label: "已忽略" },
    { value: "all", label: "全部" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">举报处理</h1>

      <div className="flex gap-2 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              status === tab.value
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-8 text-muted-foreground">加载中...</p>
        ) : items.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">暂无举报</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-card rounded-xl p-5 border">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Flag className="h-4 w-4 text-destructive" />
                    <span className="font-medium">
                      {typeLabel[item.targetType] || item.targetType} #{item.targetId}
                    </span>
                    <Badge
                      variant={
                        item.status === "pending"
                          ? "secondary"
                          : item.status === "resolved"
                          ? "default"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {item.status === "pending"
                        ? "待处理"
                        : item.status === "resolved"
                        ? "已处理"
                        : "已忽略"}
                    </Badge>
                  </div>
                  <p className="text-sm mt-2">{item.reason}</p>
                  <div className="text-xs text-muted-foreground mt-3">
                    {item.contact && `联系邮箱：${item.contact} · `}
                    {new Date(item.createdAt).toLocaleString("zh-CN")}
                  </div>
                </div>
                {item.status === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" onClick={() => handleResolve(item.id)}>
                      <Check className="h-4 w-4 mr-1" /> 处理
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDismiss(item.id)}>
                      <X className="h-4 w-4 mr-1" /> 忽略
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
