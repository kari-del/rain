"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Submission {
  id: number;
  name: string;
  url: string;
  categorySlug: string;
  reason: string;
  contact: string | null;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
}

export default function AdminSubmissionsPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("pending");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [approveData, setApproveData] = useState({
    slug: "",
    categoryId: "",
    tagline: "",
    tags: "",
    region: "domestic",
    isFree: true,
  });

  const fetchList = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/submissions?status=${status}`);
    const data = await res.json();
    if (data.code === 0) setItems(data.data.list);
    setLoading(false);
  }, [status]);

  useEffect(() => { fetchList(); }, [fetchList]);

  const openApprove = (item: Submission) => {
    setCurrentId(item.id);
    const defaultSlug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setApproveData({
      slug: defaultSlug,
      categoryId: item.categorySlug,
      tagline: item.reason || "",
      tags: "",
      region: "domestic",
      isFree: true,
    });
    setShowApproveModal(true);
  };

  const handleApprove = async () => {
    if (!currentId) return;
    const res = await fetch(`/api/admin/submissions/${currentId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve", siteData: approveData }),
    });
    if (res.ok) {
      setShowApproveModal(false);
      fetchList();
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm("确定拒绝此投稿？")) return;
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject" }),
    });
    if (res.ok) fetchList();
  };

  const tabs = [
    { value: "pending", label: "待审核" },
    { value: "approved", label: "已通过" },
    { value: "rejected", label: "已拒绝" },
    { value: "all", label: "全部" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">投稿审核</h1>
      </div>

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

      {showApproveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">通过投稿</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Slug</label>
                <input
                  className="w-full h-10 px-3 rounded-lg border bg-background"
                  value={approveData.slug}
                  onChange={(e) => setApproveData({ ...approveData, slug: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">分类 slug</label>
                <input
                  className="w-full h-10 px-3 rounded-lg border bg-background"
                  value={approveData.categoryId}
                  onChange={(e) => setApproveData({ ...approveData, categoryId: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">一句话简介</label>
                <input
                  className="w-full h-10 px-3 rounded-lg border bg-background"
                  value={approveData.tagline}
                  onChange={(e) => setApproveData({ ...approveData, tagline: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">标签（逗号分隔）</label>
                <input
                  className="w-full h-10 px-3 rounded-lg border bg-background"
                  value={approveData.tags}
                  onChange={(e) => setApproveData({ ...approveData, tags: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">地区</label>
                  <select
                    className="w-full h-10 px-3 rounded-lg border bg-background"
                    value={approveData.region}
                    onChange={(e) => setApproveData({ ...approveData, region: e.target.value as "domestic" | "foreign" })}
                  >
                    <option value="domestic">国内</option>
                    <option value="foreign">国外</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 text-sm pt-6">
                  <input
                    type="checkbox"
                    checked={approveData.isFree}
                    onChange={(e) => setApproveData({ ...approveData, isFree: e.target.checked })}
                  />
                  免费
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowApproveModal(false)}>
                  取消
                </Button>
                <Button className="flex-1" onClick={handleApprove}>
                  确认通过
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-8 text-muted-foreground">加载中...</p>
        ) : items.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">暂无投稿</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-card rounded-xl p-5 border">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{item.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {item.categorySlug}
                    </Badge>
                    <Badge
                      variant={
                        item.status === "pending"
                          ? "secondary"
                          : item.status === "approved"
                          ? "default"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {item.status === "pending"
                        ? "待审核"
                        : item.status === "approved"
                        ? "已通过"
                        : "已拒绝"}
                    </Badge>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    {item.url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  {item.reason && (
                    <p className="text-sm text-muted-foreground mt-2">{item.reason}</p>
                  )}
                  <div className="text-xs text-muted-foreground mt-3">
                    提交者：{item.user.name}（{item.user.email}）
                    {item.contact && ` · 联系：${item.contact}`}
                    <span className="ml-2">
                      {new Date(item.createdAt).toLocaleString("zh-CN")}
                    </span>
                  </div>
                </div>
                {item.status === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" onClick={() => openApprove(item)}>
                      <Check className="h-4 w-4 mr-1" /> 通过
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleReject(item.id)}>
                      <X className="h-4 w-4 mr-1" /> 拒绝
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
