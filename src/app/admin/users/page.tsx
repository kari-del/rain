import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Users, Shield, User } from "lucide-react";

export default async function AdminUsersPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") return null;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: { submissions: true, favorites: true },
      },
    },
  });

  const roleIcon = (role: string) => {
    if (role === "admin") return <Shield className="h-4 w-4 text-primary" />;
    return <User className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          共 {users.length} 个用户（最近 50 个）
        </div>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">用户</th>
                <th className="text-left px-4 py-3 font-medium">角色</th>
                <th className="text-right px-4 py-3 font-medium">投稿数</th>
                <th className="text-right px-4 py-3 font-medium">收藏数</th>
                <th className="text-right px-4 py-3 font-medium">注册时间</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    暂无用户
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-medium text-xs">
                            {user.name?.[0]?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {roleIcon(user.role)}
                        <span className="capitalize">{user.role === "admin" ? "管理员" : "普通用户"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {user._count.submissions}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {user._count.favorites}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString("zh-CN")}
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
