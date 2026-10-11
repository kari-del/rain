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

const handleSchema = z.object({
  action: z.enum(["resolve", "dismiss"]),
});

export async function POST(req: Request, { params }: Params) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ code: 403, message: "无权限" }, { status: 403 });
  }

  try {
    const id = parseInt(params.id, 10);
    const body = await req.json();
    const parsed = handleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { code: 400, message: "参数错误" },
        { status: 400 }
      );
    }

    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) {
      return NextResponse.json(
        { code: 404, message: "举报不存在" },
        { status: 404 }
      );
    }

    if (parsed.data.action === "resolve") {
      // 如果举报的是站点，可以先下架
      if (report.targetType === "site") {
        await prisma.site.update({
          where: { id: report.targetId },
          data: { status: "offline" },
        });
      }
      await prisma.report.update({
        where: { id },
        data: { status: "resolved" },
      });
      return NextResponse.json({ code: 0, message: "已处理" });
    } else {
      await prisma.report.update({
        where: { id },
        data: { status: "dismissed" },
      });
      return NextResponse.json({ code: 0, message: "已忽略" });
    }
  } catch (error) {
    console.error("处理举报失败：", error);
    return NextResponse.json(
      { code: 500, message: "服务器错误" },
      { status: 500 }
    );
  }
}
