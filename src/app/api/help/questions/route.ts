import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const querySchema = z.object({
  subject: z.string().optional(),
  q: z.string().optional(),
  sort: z.enum(["new", "hot", "unanswered"]).default("new"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = querySchema.safeParse(Object.fromEntries(searchParams));
    if (!parsed.success) {
      return NextResponse.json(
        { code: 400, message: "参数错误" },
        { status: 400 }
      );
    }

    const { subject, q, sort, page, pageSize } = parsed.data;

    const where: Prisma.QuestionWhereInput = { status: "online" };

    if (subject) where.subject = subject;
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
        { subject: { contains: q, mode: "insensitive" } },
      ] as unknown as Prisma.QuestionWhereInput[];
    }
    if (sort === "unanswered") {
      where.answerCount = 0;
    }

    let orderBy: Prisma.QuestionOrderByWithRelationInput = { createdAt: "desc" };
    if (sort === "hot") {
      orderBy = { likeCount: "desc" };
    }

    const [total, rawList] = await Promise.all([
      prisma.question.count({ where }),
      prisma.question.findMany({
        where,
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const list = rawList.map((q) => ({
      id: q.id,
      title: q.title,
      content: q.content,
      subject: q.subject,
      answerCount: q.answerCount,
      likeCount: q.likeCount,
      createdAt: q.createdAt,
      user: {
        id: q.user.id,
        name: q.user.name,
        avatar: q.user.avatar,
      },
    }));

    return NextResponse.json({
      code: 0,
      data: { list, total, page, pageSize },
    });
  } catch (error) {
    console.error("获取问题列表失败：", error);
    return NextResponse.json(
      { code: 500, message: "服务器错误" },
      { status: 500 }
    );
  }
}

const createSchema = z.object({
  title: z.string().min(5, "标题至少 5 个字符").max(100, "标题最多 100 个字符"),
  content: z.string().min(10, "问题描述至少 10 个字符").max(2000, "最多 2000 字"),
  subject: z.string().max(30, "科目/标签最多 30 字").optional().or(z.literal("")),
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
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { code: 400, message: parsed.error.issues[0]?.message || "参数错误" },
        { status: 400 }
      );
    }

    const userId = parseInt(session.user.id as string, 10);

    // 限频：每天最多 10 个问题
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayCount = await prisma.question.count({
      where: { userId, createdAt: { gte: todayStart } },
    });
    if (todayCount >= 10) {
      return NextResponse.json(
        { code: 429, message: "今天提问太多啦，先消化一下吧～" },
        { status: 429 }
      );
    }

    const question = await prisma.question.create({
      data: {
        userId,
        title: parsed.data.title,
        content: parsed.data.content,
        subject: parsed.data.subject || null,
      },
    });

    return NextResponse.json({
      code: 0,
      data: { id: question.id },
      message: "发布成功",
    });
  } catch (error) {
    console.error("发布问题失败：", error);
    return NextResponse.json(
      { code: 500, message: "服务器错误" },
      { status: 500 }
    );
  }
}
