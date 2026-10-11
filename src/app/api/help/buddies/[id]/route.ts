import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// 静态导出模式：返回空数组（API 路由在静态站点中不可用）
export function generateStaticParams() {
  return [];
}

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

    const post = await prisma.buddyPost.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });

    if (!post || post.status === "closed") {
      return NextResponse.json(
        { code: 404, message: "招募不存在或已结束" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      code: 0,
      data: {
        id: post.id,
        title: post.title,
        buddyType: post.buddyType,
        target: post.target,
        description: post.description,
        maxMembers: post.maxMembers,
        currentMembers: post.currentMembers,
        status: post.status,
        contact: post.contact,
        createdAt: post.createdAt,
        user: {
          id: post.user.id,
          name: post.user.name,
          avatar: post.user.avatar,
        },
      },
    });
  } catch (error) {
    console.error("获取搭子详情失败：", error);
    return NextResponse.json(
      { code: 500, message: "服务器错误" },
      { status: 500 }
    );
  }
}

// 报名加入
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

    const post = await prisma.buddyPost.findUnique({ where: { id } });
    if (!post || post.status !== "open") {
      return NextResponse.json(
        { code: 404, message: "招募不存在或已结束" },
        { status: 404 }
      );
    }

    const userId = parseInt(session.user.id as string, 10);

    if (userId === post.userId) {
      return NextResponse.json(
        { code: 400, message: "不能加入自己发布的招募" },
        { status: 400 }
      );
    }

    if (post.currentMembers >= post.maxMembers) {
      return NextResponse.json(
        { code: 400, message: "名额已满啦" },
        { status: 400 }
      );
    }

    const updated = await prisma.buddyPost.update({
      where: { id },
      data: {
        currentMembers: { increment: 1 },
        status: post.currentMembers + 1 >= post.maxMembers ? "full" : "open",
      },
    });

    return NextResponse.json({
      code: 0,
      data: { currentMembers: updated.currentMembers, status: updated.status },
      message: "报名成功！请留意联系方式～",
    });
  } catch (error) {
    console.error("报名失败：", error);
    return NextResponse.json(
      { code: 500, message: "服务器错误" },
      { status: 500 }
    );
  }
}
