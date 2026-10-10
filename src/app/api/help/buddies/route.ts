import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const buddyTypes = [
  { value: "exam", label: "考试备考" },
  { value: "daily", label: "日常监督" },
  { value: "language", label: "语言学习" },
  { value: "project", label: "项目组队" },
  { value: "other", label: "其他" },
];

const querySchema = z.object({
  buddyType: z.string().optional(),
  q: z.string().optional(),
  status: z.enum(["open", "full", "closed"]).optional(),
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

    const { buddyType, q, status, page, pageSize } = parsed.data;

    const where: Prisma.BuddyPostWhereInput = { status: { not: "closed" } };

    if (buddyType) where.buddyType = buddyType;
    if (status) where.status = status;
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { target: { contains: q, mode: "insensitive" } },
      ] as unknown as Prisma.BuddyPostWhereInput[];
    }

    const [total, rawList] = await Promise.all([
      prisma.buddyPost.count({ where }),
      prisma.buddyPost.findMany({
        where,
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: [{ status: "asc" }, { createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const list = rawList.map((b) => ({
      id: b.id,
      title: b.title,
      buddyType: b.buddyType,
      target: b.target,
      description: b.description,
      maxMembers: b.maxMembers,
      currentMembers: b.currentMembers,
      status: b.status,
      createdAt: b.createdAt,
      user: {
        id: b.user.id,
        name: b.user.name,
        avatar: b.user.avatar,
      },
    }));

    return NextResponse.json({
      code: 0,
      data: { list, total, page, pageSize, types: buddyTypes },
    });
  } catch (error) {
    console.error("获取搭子列表失败：", error);
    return NextResponse.json(
      { code: 500, message: "服务器错误" },
      { status: 500 }
    );
  }
}

const createSchema = z.object({
  title: z.string().min(3, "标题至少 3 个字符").max(50, "标题最多 50 个字符"),
  buddyType: z.enum(["exam", "daily", "language", "project", "other"]),
  target: z.string().min(2, "目标至少 2 个字符").max(100, "最多 100 字"),
  description: z.string().min(10, "描述至少 10 个字符").max(1000, "最多 1000 字"),
  maxMembers: z.coerce.number().int().min(2, "至少 2 人").max(50, "最多 50 人").default(5),
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

    // 限频：每人最多同时有 3 个进行中的招募
    const activeCount = await prisma.buddyPost.count({
      where: { userId, status: "open" },
    });
    if (activeCount >= 3) {
      return NextResponse.json(
        { code: 429, message: "你已经有 3 个进行中的招募啦，先完成一个再发新的吧～" },
        { status: 429 }
      );
    }

    const post = await prisma.buddyPost.create({
      data: {
        userId,
        title: parsed.data.title,
        buddyType: parsed.data.buddyType,
        target: parsed.data.target,
        description: parsed.data.description,
        maxMembers: parsed.data.maxMembers,
        currentMembers: 1,
        status: "open",
      },
    });

    return NextResponse.json({
      code: 0,
      data: { id: post.id },
      message: "发布成功，祝你找到合适的搭子！",
    });
  } catch (error) {
    console.error("发布搭子失败：", error);
    return NextResponse.json(
      { code: 500, message: "服务器错误" },
      { status: 500 }
    );
  }
}
