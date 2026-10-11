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

// 获取问题详情 + 回答列表
export async function GET(_req: Request, { params }: Params) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { code: 400, message: "无效的 ID" },
        { status: 400 }
      );
    }

    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        answers: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
          orderBy: [{ isAccepted: "desc" }, { createdAt: "asc" }],
        },
      },
    });

    if (!question || question.status !== "online") {
      return NextResponse.json(
        { code: 404, message: "问题不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      code: 0,
      data: {
        id: question.id,
        title: question.title,
        content: question.content,
        subject: question.subject,
        answerCount: question.answerCount,
        likeCount: question.likeCount,
        createdAt: question.createdAt,
        user: {
          id: question.user.id,
          name: question.user.name,
          avatar: question.user.avatar,
        },
        answers: question.answers.map((a) => ({
          id: a.id,
          content: a.content,
          isAccepted: a.isAccepted,
          likeCount: a.likeCount,
          createdAt: a.createdAt,
          user: {
            id: a.user.id,
            name: a.user.name,
            avatar: a.user.avatar,
          },
        })),
      },
    });
  } catch (error) {
    console.error("获取问题详情失败：", error);
    return NextResponse.json(
      { code: 500, message: "服务器错误" },
      { status: 500 }
    );
  }
}

const answerSchema = z.object({
  content: z.string().min(5, "回答至少 5 个字符").max(2000, "最多 2000 字"),
});

// 回答问题
export async function POST(req: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { code: 401, message: "请先登录" },
        { status: 401 }
      );
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { code: 400, message: "无效的 ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = answerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { code: 400, message: parsed.error.issues[0]?.message || "参数错误" },
        { status: 400 }
      );
    }

    const question = await prisma.question.findUnique({ where: { id } });
    if (!question || question.status !== "online") {
      return NextResponse.json(
        { code: 404, message: "问题不存在" },
        { status: 404 }
      );
    }

    const userId = parseInt(session.user.id as string, 10);

    // 不能回答自己的问题？可以回答，但是不能自己采纳自己的
    // 限频：每天最多 20 个回答
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayCount = await prisma.answer.count({
      where: { userId, createdAt: { gte: todayStart } },
    });
    if (todayCount >= 20) {
      return NextResponse.json(
        { code: 429, message: "今天回答够多啦，明天继续帮助同学吧～" },
        { status: 429 }
      );
    }

    const answer = await prisma.answer.create({
      data: {
        userId,
        questionId: id,
        content: parsed.data.content,
      },
    });

    // 更新问题的回答数
    await prisma.question.update({
      where: { id },
      data: { answerCount: { increment: 1 } },
    });

    return NextResponse.json({
      code: 0,
      data: { id: answer.id },
      message: "回答成功",
    });
  } catch (error) {
    console.error("回答失败：", error);
    return NextResponse.json(
      { code: 500, message: "服务器错误" },
      { status: 500 }
    );
  }
}
