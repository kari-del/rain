import Link from "next/link";
import { Mail, Shield, Heart } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background pb-20 md:pb-0">
      <div className="container py-6 md:py-10 px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-base md:text-lg mb-2 md:mb-3">
              <img src="/logo-sheep.png" alt="xiaoyang.com" className="h-6 w-6 rounded-md" />
              xiaoyang.com
            </Link>
            <p className="text-xs md:text-sm text-muted-foreground">
              面向学生的一站式学习入口，精选优质 AI 工具、快捷工具、游戏兴趣与外语学习资源。
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 md:mb-3 text-sm">资源导航</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-muted-foreground">
              <li><Link href="/ai" className="hover:text-foreground transition-colors">AI 网站</Link></li>
              <li><Link href="/tools" className="hover:text-foreground transition-colors">快捷工具</Link></li>
              <li><Link href="/language" className="hover:text-foreground transition-colors">外语学习</Link></li>
              <li><Link href="/favorites" className="hover:text-foreground transition-colors">我的收藏</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 md:mb-3 text-sm">关于</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">关于我们</Link></li>
              <li><Link href="/submit" className="hover:text-foreground transition-colors">提交网站</Link></li>
              <li><Link href="/about#disclaimer" className="hover:text-foreground transition-colors">免责声明</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold mb-2 md:mb-3 text-sm">联系与反馈</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <a href="mailto:Y081024@outlook.com" className="hover:text-foreground transition-colors">举报邮箱：Y081024@outlook.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] md:text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} xiaoyang.com. 仅供学习交流使用
          </p>
          <p className="flex items-center gap-1">
            用 <Heart className="h-3 w-3 text-red-500 fill-red-500" /> 为学生打造
          </p>
        </div>
      </div>
    </footer>
  );
}
