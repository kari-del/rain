import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ code: 403, message: "无权限" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);
  const status = searchParams.get("status") || undefined;
  const q = searchParams.get("q") || undefined;

  const where: Prisma.SiteWhereInput = {};
  if (status) where.status = status;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { url: { contains: q, mode: "insensitive" } },
    ] as unknown as Prisma.SiteWhereInput[];
  }

  const [total, list] = await Promise.all([
    prisma.site.count({ where }),
    prisma.site.findMany({
      where,
      include: { category: { select: { id: true, name: true } } },
      orderBy: [{ id: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({
    code: 0,
    data: { list, total, page, pageSize },
  });
}

const createSchema = z.object({
  slug: z.string().min(2),
  name: z.string().min(1),
  url: z.string().url(),
  categoryId: z.string(),
  tagline: z.string(),
  aliases: z.string().default(""),
  logo: z.string().optional(),
  description: z.string().optional(),
  tags: z.string().default(""),
  region: z.enum(["domestic", "foreign"]),
  language: z.string().optional(),
  isFree: z.coerce.boolean().default(false),
  isHot: z.coerce.boolean().default(false),
  isNew: z.coerce.boolean().default(false),
  status: z.enum(["online", "offline", "pending"]).default("online"),
  sortOrder: z.coerce.number().default(0),
});

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ code: 403, message: "无权限" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { code: 400, message: parsed.error.issues[0]?.message || "参数错误" },
        { status: 400 }
      );
    }

    const existing = await prisma.site.findUnique({ where: { slug: parsed.data.slug } });
    if (existing) {
      return NextResponse.json(
        { code: 400, message: "该 slug 已存在" },
        { status: 400 }
      );
    }

    const site = await prisma.site.create({ data: parsed.data });
    return NextResponse.json({ code: 0, data: site, message: "创建成功" });
  } catch (error) {
    console.error("创建站点失败：", error);
    return NextResponse.json(
      { code: 500, message: "服务器错误" },
      { status: 500 }
    );
  }
}
