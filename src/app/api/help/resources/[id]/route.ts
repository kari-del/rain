import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function GET(_req: Request, { params }: Params) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { code: 400, message: "无效的 ID" },
        { status: 400 }
      );
    }

    const resource = await prisma.resource.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    if (!resource || resource.status !== "online") {
      return NextResponse.json(
        { code: 404, message: "资源不存在或未通过审核" },
        { status: 404 }
      );
    }

    // 增加浏览量
    await prisma.resource.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({
      code: 0,
      data: {
        id: resource.id,
        title: resource.title,
        subject: resource.subject,
        resourceType: resource.resourceType,
        cover: resource.cover,
        summary: resource.summary,
        fileUrl: resource.fileUrl,
        viewCount: resource.viewCount + 1,
        likeCount: resource.likeCount,
        createdAt: resource.createdAt,
        user: {
          id: resource.user.id,
          name: resource.user.name,
          avatar: resource.user.avatar,
        },
      },
    });
  } catch (error) {
    console.error("获取资源详情失败：", error);
    return NextResponse.json(
      { code: 500, message: "服务器错误" },
      { status: 500 }
    );
  }
}

export async function POST(_req: Request, { params }: Params) {
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

    const resource = await prisma.resource.findUnique({ where: { id } });
    if (!resource) {
      return NextResponse.json(
        { code: 404, message: "资源不存在" },
        { status: 404 }
      );
    }

    // 简单点赞：每次点都+1（完整版应该用独立的 like 表防重复）
    await prisma.resource.update({
      where: { id },
      data: { likeCount: { increment: 1 } },
    });

    return NextResponse.json({
      code: 0,
      data: { likeCount: resource.likeCount + 1 },
      message: "点赞成功",
    });
  } catch (error) {
    console.error("点赞失败：", error);
    return NextResponse.json(
      { code: 500, message: "服务器错误" },
      { status: 500 }
    );
  }
}
