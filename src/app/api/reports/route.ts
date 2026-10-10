import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const reportSchema = z.object({
  targetType: z.enum(["site", "resource", "question", "answer", "buddy"]),
  targetId: z.coerce.number().int().positive(),
  reason: z.string().min(5, "举报理由至少 5 个字符").max(500, "最多 500 字"),
  contact: z.string().email().optional().or(z.literal("")),
});

// 公开可访问：未登录也能举报
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = reportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          code: 400,
          message: parsed.error.issues[0]?.message || "参数错误",
        },
        { status: 400 }
      );
    }

    const report = await prisma.report.create({
      data: {
        targetType: parsed.data.targetType,
        targetId: parsed.data.targetId,
        reason: parsed.data.reason,
        contact: parsed.data.contact || null,
        status: "pending",
      },
    });

    return NextResponse.json({
      code: 0,
      data: { id: report.id },
      message: "举报已提交，我们会尽快处理",
    });
  } catch (error) {
    console.error("举报失败：", error);
    return NextResponse.json(
      { code: 500, message: "服务器错误" },
      { status: 500 }
    );
  }
}
