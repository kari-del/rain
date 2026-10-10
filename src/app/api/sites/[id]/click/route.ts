import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function POST(_req: Request, { params }: Params) {
  try {
    const siteId = parseInt(params.id, 10);
    if (isNaN(siteId)) {
      return NextResponse.json(
        { code: 400, message: "无效的站点 ID" },
        { status: 400 }
      );
    }

    await prisma.site.update({
      where: { id: siteId },
      data: { clickCount: { increment: 1 } },
    });

    return NextResponse.json({ code: 0, message: "ok" });
  } catch (error) {
    console.error("点击计数失败：", error);
    return NextResponse.json(
      { code: 500, message: "服务器错误" },
      { status: 500 }
    );
  }
}
