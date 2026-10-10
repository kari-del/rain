import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const resourceTypes = [
  { value: "note", label: "笔记" },
  { value: "paper", label: "试卷/真题" },
  { value: "ebook", label: "电子书" },
  { value: "tutorial", label: "教程/指南" },
  { value: "link", label: "链接/网站" },
  { value: "other", label: "其他" },
];

const querySchema = z.object({
  subject: z.string().optional(),
  resourceType: z.string().optional(),
  q: z.string().optional(),
  sort: z.enum(["new", "hot", "likes"]).default("new"),
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

    const { subject, resourceType, q, sort, page, pageSize } = parsed.data;

    const where: Prisma.ResourceWhereInput = { status: "online" };

    if (subject) where.subject = subject;
    if (resourceType) where.resourceType = resourceType;
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } },
        { subject: { contains: q, mode: "insensitive" } },
      ] as unknown as Prisma.ResourceWhereInput[];
    }

    let orderBy: Prisma.ResourceOrderByWithRelationInput = { createdAt: "desc" };
    if (sort === "hot" || sort === "likes") {
      orderBy = { likeCount: "desc" };
    }

    const [total, rawList] = await Promise.all([
      prisma.resource.count({ where }),
      prisma.resource.findMany({
        where,
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const list = rawList.map((r) => ({
      id: r.id,
      title: r.title,
      subject: r.subject,
      resourceType: r.resourceType,
      cover: r.cover,
      summary: r.summary,
      fileUrl: r.fileUrl,
      viewCount: r.viewCount,
      likeCount: r.likeCount,
      createdAt: r.createdAt,
      user: {
        id: r.user.id,
        name: r.user.name,
        avatar: r.user.avatar,
      },
    }));

    return NextResponse.json({
      code: 0,
      data: { list, total, page, pageSize, types: resourceTypes },
    });
  } catch (error) {
    console.error("获取资源列表失败：", error);
    return NextResponse.json(
      { code: 500, message: "服务器错误" },
      { status: 500 }
    );
  }
}

const createSchema = z.object({
  title: z.string().min(2, "标题至少 2 个字符").max(100, "标题最多 100 个字符"),
  subject: z.string().min(2, "科目/标签至少 2 个字符").max(50, "最多 50 个字符"),
  resourceType: z.enum(["note", "paper", "ebook", "tutorial", "link", "other"]),
  cover: z.string().url("封面链接格式不正确").optional().or(z.literal("")),
  summary: z.string().min(10, "简介至少 10 个字符").max(500, "最多 500 字"),
  fileUrl: z.string().url("文件链接格式不正确").optional().or(z.literal("")),
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

    // 限频：同一用户每天最多发 5 个资源
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayCount = await prisma.resource.count({
      where: { userId, createdAt: { gte: todayStart } },
    });
    if (todayCount >= 5) {
      return NextResponse.json(
        { code: 429, message: "今天发得够多啦，明天再来分享吧～" },
        { status: 429 }
      );
    }

    const resource = await prisma.resource.create({
      data: {
        userId,
        title: parsed.data.title,
        subject: parsed.data.subject,
        resourceType: parsed.data.resourceType,
        cover: parsed.data.cover || null,
        summary: parsed.data.summary,
        fileUrl: parsed.data.fileUrl || null,
        status: "pending", // 需要审核（简化版可直接设 online）
      },
    });

    return NextResponse.json({
      code: 0,
      data: { id: resource.id },
      message: "发布成功，等待审核后展示",
    });
  } catch (error) {
    console.error("发布资源失败：", error);
    return NextResponse.json(
      { code: 500, message: "服务器错误" },
      { status: 500 }
    );
  }
}
