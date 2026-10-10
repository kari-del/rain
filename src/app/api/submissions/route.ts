import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const submissionSchema = z.object({
  name: z.string().min(2, "网站名称至少 2 个字符"),
  url: z.string().url("请输入正确的网址"),
  categorySlug: z.string().min(1, "请选择分类"),
  reason: z.string().max(500, "推荐理由最多 500 字").optional(),
  contact: z.string().email("请输入正确的邮箱").optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { code: 401, message: "请先登录" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = submissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          code: 400,
          message: parsed.error.issues[0]?.message || "参数错误",
        },
        { status: 400 }
      );
    }

    const userId = parseInt(session.user.id as string, 10);

    // 简单限频：同一用户 10 分钟内最多投 3 个
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recentCount = await prisma.submission.count({
      where: { userId, createdAt: { gte: tenMinutesAgo } },
    });
    if (recentCount >= 3) {
      return NextResponse.json(
        { code: 429, message: "提交太频繁了，休息一下再试吧" },
        { status: 429 }
      );
    }

    const submission = await prisma.submission.create({
      data: {
        userId,
        name: parsed.data.name,
        url: parsed.data.url,
        categorySlug: parsed.data.categorySlug,
        reason: parsed.data.reason,
        contact: parsed.data.contact,
        status: "pending",
      },
    });

    return NextResponse.json({
      code: 0,
      data: { id: submission.id },
      message: "提交成功，我们会尽快审核",
    });
  } catch (error) {
    console.error("投稿失败：", error);
    return NextResponse.json(
      { code: 500, message: "服务器错误" },
      { status: 500 }
    );
  }
}
