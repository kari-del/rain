"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Search, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Site {
  id: number;
  slug: string;
  name: string;
  url: string;
  status: string;
  category: { name: string };
  clickCount: number;
  isHot: boolean;
  isNew: boolean;
}

export default function AdminSitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    url: "",
    categoryId: "ai-chat",
    tagline: "",
    tags: "",
    region: "domestic",
    isFree: true,
    isHot: false,
    isNew: false,
    status: "online",
    sortOrder: 0,
  });

  const fetchSites = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/sites?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    if (data.code === 0) {
      setSites(data.data.list);
    }
    setLoading(false);
  }, [q]);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除这个站点吗？")) return;
    const res = await fetch(`/api/admin/sites/${id}`, { method: "DELETE" });
    if (res.ok) fetchSites();
  };

  const handleEdit = (site: Site) => {
    setEditingId(site.id);
    setShowForm(true);
    // 简化：只填充关键字段
    setFormData((prev) => ({
      ...prev,
      slug: site.slug,
      name: site.name,
      url: site.url,
      tagline: "",
      status: site.status,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId
      ? `/api/admin/sites/${editingId}`
      : "/api/admin/sites";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchSites();
    }
  };

  const resetForm = () => {
    setFormData({
      slug: "",
      name: "",
      url: "",
      categoryId: "ai-chat",
      tagline: "",
      tags: "",
      region: "domestic",
      isFree: true,
      isHot: false,
      isNew: false,
      status: "online",
      sortOrder: 0,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold">站点管理</h1>
        <Button onClick={() => { setShowForm(true); setEditingId(null); resetForm(); }}>
          <Plus className="h-4 w-4 mr-2" /> 新增站点
        </Button>
      </div>

      {/* 搜索 */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="搜索站点名称或网址..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 表单弹窗 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "编辑站点" : "新增站点"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Slug</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">名称</label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">网址</label>
                <Input
                  type="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">分类 slug</label>
                <Input
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">一句话简介</label>
                <Input
                  value={formData.tagline}
                  onChange={(e) =>
                    setFormData({ ...formData, tagline: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">标签（逗号分隔）</label>
                <Input
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">地区</label>
                  <select
                    className="w-full h-10 px-3 rounded-lg border bg-background"
                    value={formData.region}
                    onChange={(e) =>
                      setFormData({ ...formData, region: e.target.value as "domestic" | "foreign" })
                    }
                  >
                    <option value="domestic">国内</option>
                    <option value="foreign">国外</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">状态</label>
                  <select
                    className="w-full h-10 px-3 rounded-lg border bg-background"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as "online" | "offline" | "pending" })
                    }
                  >
                    <option value="online">上线</option>
                    <option value="offline">下架</option>
                    <option value="pending">待审</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.isFree}
                    onChange={(e) =>
                      setFormData({ ...formData, isFree: e.target.checked })
                    }
                  />
                  免费
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.isHot}
                    onChange={(e) =>
                      setFormData({ ...formData, isHot: e.target.checked })
                    }
                  />
                  热门
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) =>
                      setFormData({ ...formData, isNew: e.target.checked })
                    }
                  />
                  新站
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowForm(false)}>
                  取消
                </Button>
                <Button type="submit" className="flex-1">
                  {editingId ? "保存" : "创建"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 站点列表 */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">名称</th>
                <th className="text-left px-4 py-3 font-medium">分类</th>
                <th className="text-left px-4 py-3 font-medium">状态</th>
                <th className="text-right px-4 py-3 font-medium">点击</th>
                <th className="text-right px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    加载中...
                  </td>
                </tr>
              ) : sites.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    暂无数据
                  </td>
                </tr>
              ) : (
                sites.map((site) => (
                  <tr key={site.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{site.name}</span>
                        {site.isHot && <Badge variant="default" className="text-xs">热</Badge>}
                        {site.isNew && <Badge variant="secondary" className="text-xs">新</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {site.url}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {site.category?.name}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          site.status === "online"
                            ? "default"
                            : site.status === "offline"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {site.status === "online"
                          ? "上线"
                          : site.status === "offline"
                          ? "下架"
                          : "待审"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {site.clickCount}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(site)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(site.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
