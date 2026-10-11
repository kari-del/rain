import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// 静态导出模式：返回空数组（API 路由在静态站点中不可用）
export function generateStaticParams() {
  return [];
}

interface Params {
  params: { id: string };
}

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  url: z.string().url().optional(),
  categoryId: z.string().optional(),
  tagline: z.string().optional(),
  aliases: z.string().optional(),
  logo: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  tags: z.string().optional(),
  region: z.enum(["domestic", "foreign"]).optional(),
  language: z.string().optional().nullable(),
  isFree: z.coerce.boolean().optional(),
  isHot: z.coerce.boolean().optional(),
  isNew: z.coerce.boolean().optional(),
  status: z.enum(["online", "offline", "pending"]).optional(),
  sortOrder: z.coerce.number().optional(),
});

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ code: 403, message: "无权限" }, { status: 403 });
  }

  try {
    const id = parseInt(params.id, 10);
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { code: 400, message: parsed.error.issues[0]?.message || "参数错误" },
        { status: 400 }
      );
    }

    const site = await prisma.site.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ code: 0, data: site, message: "更新成功" });
  } catch (error) {
    console.error("更新站点失败：", error);
    return NextResponse.json(
      { code: 500, message: "服务器错误" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ code: 403, message: "无权限" }, { status: 403 });
  }

  try {
    const id = parseInt(params.id, 10);
    await prisma.site.delete({ where: { id } });
    return NextResponse.json({ code: 0, message: "删除成功" });
  } catch (error) {
    console.error("删除站点失败：", error);
    return NextResponse.json(
      { code: 500, message: "服务器错误" },
      { status: 500 }
    );
  }
}
