import Link from "next/link";
import {
  BookOpen,
  MessageCircle,
  Users,
  Wrench,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    href: "/help/resources",
    icon: BookOpen,
    title: "资源共享板",
    desc: "笔记、试卷、电子书、教程链接，优质学习资源互相分享",
    color: "from-blue-500 to-cyan-500",
  },
  {
    href: "/help/questions",
    icon: MessageCircle,
    title: "问答留言板",
    desc: "有问题随时问，学长学姐和同学们一起帮你解答",
    color: "from-purple-500 to-pink-500",
  },
  {
    href: "/help/buddies",
    icon: Users,
    title: "学习搭子招募",
    desc: "找同桌、组队备考、互相监督，一个人走得快一群人走得远",
    color: "from-green-500 to-emerald-500",
  },
  {
    href: "/help/tools",
    icon: Wrench,
    title: "学习小工具",
    desc: "番茄钟、倒计时、GPA 计算器，实用小工具随手用",
    color: "from-orange-500 to-amber-500",
  },
];

export default function HelpHomePage() {
  return (
    <div className="container py-10 md:py-16">
      {/* Hero */}
      <div className="text-center mb-12 md:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
          <GraduationCap className="h-3.5 w-3.5" />
          学生互助社区
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          一个人学习，不如<span className="text-primary">一群人同行</span>
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          分享资源、答疑解惑、寻找学习搭子——在这里，每个问题都有人回答，每份努力都有人陪伴。
        </p>
      </div>

      {/* 四大功能卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
        {features.map((f) => (
          <Link key={f.href} href={f.href}>
            <Card className="h-full group hover:border-primary/30 hover:shadow-md transition-all">
              <CardContent className="p-6 md:p-8">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}
                >
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {f.title}
                </h2>
                <p className="text-muted-foreground text-sm mb-4">{f.desc}</p>
                <div className="flex items-center gap-1 text-sm text-primary">
                  进入 <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* 底部说明 */}
      <div className="mt-16 text-center">
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          💡 所有内容均由用户自发分享，请遵守社区规范，不发布违规、侵权、广告内容。
          <br />
          遇到不良内容请及时举报，共同维护友好的学习环境。
        </p>
      </div>
    </div>
  );
}
