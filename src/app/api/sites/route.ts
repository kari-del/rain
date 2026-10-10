import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const querySchema = z.object({
  type: z.enum(["ai", "tool", "language"]).optional(),
  category: z.string().optional(),
  language: z.string().optional(),
  region: z.enum(["domestic", "foreign"]).optional(),
  isFree: z.coerce.boolean().optional(),
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
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

    const { type, category, language, region, isFree, q, page, pageSize } = parsed.data;

    const where: Prisma.SiteWhereInput = { status: "online" };

    if (category) {
      where.categoryId = category;
    } else if (type) {
      where.category = { type };
    }

    if (language) {
      where.language = language;
    }
    if (region) {
      where.region = region;
    }
    if (isFree !== undefined) {
      where.isFree = isFree;
    }
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { aliases: { contains: q, mode: "insensitive" } },
        { tags: { contains: q, mode: "insensitive" } },
        { tagline: { contains: q, mode: "insensitive" } },
      ] as unknown as Prisma.SiteWhereInput[];
    }

    const [total, rawSites] = await Promise.all([
      prisma.site.count({ where }),
      prisma.site.findMany({
        where,
        include: { category: { select: { id: true, name: true, type: true } } },
        orderBy: [
          { isHot: "desc" },
          { sortOrder: "asc" },
          { clickCount: "desc" },
        ],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const sites = rawSites.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      aliases: s.aliases ? s.aliases.split(",").filter(Boolean) : [],
      url: s.url,
      logo: s.logo,
      tagline: s.tagline,
      categoryId: s.categoryId,
      category: s.category,
      tags: s.tags ? s.tags.split(",").filter(Boolean) : [],
      region: s.region,
      language: s.language,
      isFree: s.isFree,
      isHot: s.isHot,
      isNew: s.isNew,
      clickCount: s.clickCount,
      sortOrder: s.sortOrder,
    }));

    return NextResponse.json({
      code: 0,
      data: {
        list: sites,
        total,
        page,
        pageSize,
      },
    });
  } catch (error) {
    console.error("获取站点列表失败：", error);
    return NextResponse.json(
      { code: 500, message: "服务器错误" },
      { status: 500 }
    );
  }
}
