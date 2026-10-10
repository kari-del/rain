import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

const actionSchema = z.object({
  action: z.enum(["approve", "reject"]),
  siteData: z
    .object({
      slug: z.string(),
      categoryId: z.string(),
      tagline: z.string(),
      tags: z.string().default(""),
      region: z.enum(["domestic", "foreign"]).default("domestic"),
      isFree: z.coerce.boolean().default(true),
    })
    .optional(),
});

export async function POST(req: Request, { params }: Params) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ code: 403, message: "无权限" }, { status: 403 });
  }

  try {
    const id = parseInt(params.id, 10);
    const body = await req.json();
    const parsed = actionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { code: 400, message: "参数错误" },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.findUnique({ where: { id } });
    if (!submission) {
      return NextResponse.json(
        { code: 404, message: "投稿不存在" },
        { status: 404 }
      );
    }

    if (parsed.data.action === "approve") {
      if (!parsed.data.siteData) {
        return NextResponse.json(
          { code: 400, message: "通过时需要站点信息" },
          { status: 400 }
        );
      }
      const { siteData } = parsed.data;

      // 创建站点
      await prisma.site.create({
        data: {
          slug: siteData.slug,
          name: submission.name,
          url: submission.url,
          categoryId: siteData.categoryId,
          tagline: siteData.tagline,
          aliases: "",
          tags: siteData.tags,
          region: siteData.region,
          isFree: siteData.isFree,
          status: "online",
          description: submission.reason,
        },
      });

      // 更新投稿状态
      await prisma.submission.update({
        where: { id },
        data: { status: "approved" },
      });

      return NextResponse.json({ code: 0, message: "已通过并收录" });
    } else {
      await prisma.submission.update({
        where: { id },
        data: { status: "rejected" },
      });
      return NextResponse.json({ code: 0, message: "已拒绝" });
    }
  } catch (error) {
    console.error("处理投稿失败：", error);
    return NextResponse.json(
      { code: 500, message: "服务器错误" },
      { status: 500 }
    );
  }
}
