import Link from "next/link";
import { Info, Shield, Heart, Mail, BookOpen, Globe, Sparkles, Wrench, Languages } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SUBMISSION_CONFIG } from "@/lib/config";

export default function AboutPage() {
  return (
    <div className="container py-10 max-w-3xl">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Info className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">关于 xiaoyang.com</h1>
            <p className="text-muted-foreground text-sm">
              一个面向学生的一站式学习导航平台
            </p>
          </div>
        </div>
      </div>

      {/* 平台介绍 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          平台介绍
        </h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            xiaoyang.com（小羊学习导航）是一个由学生打造、为学生服务的学习资源导航平台。
            我们精选优质的 AI 工具、效率工具和外语学习资源，帮助同学们快速找到所需，
            把时间花在真正的学习上，而不是找工具。
          </p>
          <p>
            平台采用<strong className="text-foreground">静态生成 + 数据驱动</strong>的方式构建，
            新增网站只需修改数据文件，零成本可运行。
          </p>
        </div>
      </section>

      {/* 三大板块 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">三大板块</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5">
              <Sparkles className="h-6 w-6 text-blue-500 mb-2" />
              <h3 className="font-semibold mb-1">AI 网站</h3>
              <p className="text-sm text-muted-foreground">
                AI 对话、绘画、视频、编程、办公等 9 大分类
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <Wrench className="h-6 w-6 text-emerald-500 mb-2" />
              <h3 className="font-semibold mb-1">快捷工具</h3>
              <p className="text-sm text-muted-foreground">
                PDF、图片、翻译、思维导图、学术资料等 10 大分类
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <Languages className="h-6 w-6 text-violet-500 mb-2" />
              <h3 className="font-semibold mb-1">外语学习</h3>
              <p className="text-sm text-muted-foreground">
                多语种综合 + 英日韩西法 5 个语种，覆盖课程到考试
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 收录原则 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-emerald-500" />
          收录原则
        </h2>
        <Card>
          <CardContent className="p-6">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 mt-0.5 text-lg">✓</span>
                <div>
                  <p className="font-medium text-foreground">只收合法公开站点</p>
                  <p className="text-muted-foreground">所有收录网站均为公开可访问的正规网站</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-0.5 text-lg">✕</span>
                <div>
                  <p className="font-medium text-foreground">不收盗版破解</p>
                  <p className="text-muted-foreground">
                    不收录 Sci-Hub、Z-Library、盗版教材、破解软件、网盘搜书等侵权类资源
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 mt-0.5 text-lg">✓</span>
                <div>
                  <p className="font-medium text-foreground">考试报名只认官方</p>
                  <p className="text-muted-foreground">
                    语言考试报名只收录教育考试院 neea.cn 等官方域名，谨防钓鱼
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 mt-0.5 text-lg">✓</span>
                <div>
                  <p className="font-medium text-foreground">境外站点客观标注</p>
                  <p className="text-muted-foreground">
                    对境外可直连的站点标注「国内可直连」，不提供任何绕过网络管制的方法
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* 外语板块说明 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-violet-500" />
          外语学习板块说明
        </h2>
        <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
          <p>
            外语学习板块覆盖<strong className="text-foreground">多语种综合 + 英语、日语、韩语、西班牙语、法语</strong>
            共 6 个分类，每个语种下按用途分为：
          </p>
          <div className="flex flex-wrap gap-2">
            {["课程入门", "词典", "听力", "口语", "语法阅读", "官方考试"].map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-medium"
              >
                {t}
              </span>
            ))}
          </div>
          <p>
            搜索支持「语种 + 功能」组合关键词，例如输入「日语 词典」「法语 听力」「韩语 考试」都能快速命中。
          </p>
        </div>
      </section>

      {/* 联系方式 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5 text-blue-500" />
          联系方式
        </h2>
        <Card>
          <CardContent className="p-6 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">合作/建议</span>
              <a
                href={`mailto:${SUBMISSION_CONFIG.contactEmail}`}
                className="text-primary hover:underline"
              >
                {SUBMISSION_CONFIG.contactEmail}
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">失效举报</span>
              <a
                href={`mailto:${SUBMISSION_CONFIG.reportEmail}`}
                className="text-primary hover:underline"
              >
                {SUBMISSION_CONFIG.reportEmail}
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">提交网站</span>
              <Link href="/submit" className="text-primary hover:underline">
                前往投稿 →
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 免责声明 */}
      <section id="disclaimer" className="mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-amber-500" />
          免责声明
        </h2>
        <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/10">
          <CardContent className="p-6 text-sm text-muted-foreground space-y-3">
            <p>
              1. 本平台仅提供网站导航服务，所有外部网站的内容、服务、合法性均由其运营方负责。
            </p>
            <p>
              2. 我们尽力筛选优质资源，但不对外部网站的内容准确性、可用性、安全性做任何担保。
            </p>
            <p>
              3. 用户使用外部网站所产生的任何后果，本平台不承担责任。使用前请自行甄别。
            </p>
            <p>
              4. 如任何网站侵犯了您的权益，请通过举报邮箱联系我们，我们会及时处理。
            </p>
            <p>
              5. 本平台仅供学习交流使用，请勿用于任何商业或非法用途。
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 致谢 */}
      <section className="text-center">
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
          用 <Heart className="h-4 w-4 text-red-500 fill-red-500" /> 为学生打造
        </p>
      </section>
    </div>
  );
}
