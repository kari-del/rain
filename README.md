# xiaoyang.com · 小羊学习导航

面向学生的一站式学习入口，包含 **AI 网站 / 快捷工具 / 外语学习 / 考研资料 / 游戏兴趣 / 学生互助** 六大板块。

## ✨ 功能特性

### 六大板块
- **AI 网站**：AI 对话、搜索、绘画、视频、编程、办公、音乐、设计、学习（9 类 / 52 个）
- **快捷工具**：PDF、格式转换、图片处理、翻译、思维导图、网盘、开发工具、学术、效率、生活、影音娱乐（11 类）
- **外语学习**：多语种综合、英语、日语、韩语、西语、法语（6 类 / 61 个）
- **考研资料**：官方报考、408 社区、408 资料、公共课、专业课（5 类 / 11 个）
- **游戏兴趣**：游戏平台、游戏本体、游戏资料、游戏资讯社区（4 类 / 60 个）
- **学生互助**：资源共享板、问答留言板、学习搭子招募、学习小工具（4 个子功能）

### 核心功能
- 🔍 模糊搜索（Fuse.js + 拼音首字母 + 多关键词交集）
- ⭐ 收藏夹（Zustand + localStorage 持久化）
- 🌓 明暗模式切换
- 📱 移动端优先响应式设计
- 🎯 211 个精选网站 + 35 个分类

### 全栈功能（需数据库）
- 👤 用户注册 / 登录（邮箱密码 + bcrypt）
- 📝 网站投稿 + 后台审核
- 🚩 举报处理
- 📊 点击统计（sendBeacon）
- 🔧 后台管理系统（Dashboard / 站点管理 / 投稿审核 / 举报处理 / 用户管理）

## 🛠 技术栈

- **框架**：Next.js 14 (App Router) + TypeScript
- **样式**：Tailwind CSS + 自定义 shadcn 风格组件
- **图标**：lucide-react
- **状态**：Zustand + persist（localStorage）
- **搜索**：Fuse.js（模糊搜索 + 拼音首字母）
- **主题**：next-themes（明暗模式）
- **数据库**：Prisma ORM + SQLite（本地）/ PostgreSQL（生产）
- **认证**：NextAuth v5 (Auth.js) + Credentials + bcrypt
- **校验**：Zod

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 9+

### 本地开发（全栈模式）

```bash
# 安装依赖
npm install

# 生成 Prisma Client + 创建数据库 + 导入种子数据
npm run db:push
npm run db:seed

# 启动开发服务器
npm run dev
# 打开 http://localhost:3000
```

**默认管理员账号**：`admin@example.com` / `admin123456`
（登录后访问 `/admin` 进入后台，请尽快修改密码）

### 常用命令

```bash
npm run dev          # 开发模式
npm run build        # 生产构建
npm start            # 预览生产构建
npm run lint         # 代码检查
npm run db:push      # 同步 schema 到数据库
npm run db:seed      # 导入种子数据
npm run db:generate  # 生成 Prisma Client
```

## 📁 目录结构

```
src/
├─ app/
│  ├─ (site)/          # 前台页面路由组
│  │  ├─ page.tsx      # 首页
│  │  ├─ ai/           # AI 网站
│  │  ├─ tools/        # 快捷工具
│  │  ├─ language/     # 外语学习
│  │  ├─ category/     # 分类详情
│  │  ├─ favorites/    # 我的收藏
│  │  ├─ submit/       # 提交网站
│  │  └─ about/        # 关于
│  ├─ admin/           # 后台管理
│  ├─ login/           # 登录页
│  ├─ register/        # 注册页
│  ├─ api/             # API 路由
│  │  ├─ auth/         # NextAuth
│  │  ├─ sites/        # 站点查询/点击统计
│  │  ├─ submissions/  # 投稿
│  │  ├─ reports/      # 举报
│  │  └─ admin/        # 后台管理 API
│  ├─ sitemap.ts
│  ├─ robots.ts
│  └─ layout.tsx
├─ components/
│  ├─ layout/          # 布局组件
│  ├─ site/            # 网站卡片、分类组件
│  ├─ search/          # 搜索筛选
│  ├─ ui/              # 基础 UI 组件
│  └─ user-nav.tsx     # 用户菜单
├─ content/            # 静态数据（备用）
│  ├─ categories.ts
│  └─ sites.ts
├─ lib/                # 工具函数
│  ├─ prisma.ts        # Prisma 单例
│  ├─ types.ts         # 类型定义
│  ├─ utils.ts
│  ├─ search.ts
│  └─ config.ts
└─ store/              # 状态管理
   └─ useFavoritesStore.ts
```

## 🌐 部署指南

### 方式一：全栈部署（推荐，功能完整）

**平台**：Vercel + Neon PostgreSQL（均有免费层）

#### 步骤

**1. 准备 PostgreSQL 数据库**

推荐 [Neon](https://neon.tech/)（免费层足够）或 [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)：
- 注册账号，创建数据库
- 复制连接串（类似 `postgresql://user:pass@host:5432/dbname`）

**2. 修改 Prisma Schema 为 PostgreSQL**

打开 `prisma/schema.prisma`，修改 provider：

```prisma
datasource db {
  provider = "postgresql"   // 从 "sqlite" 改为 "postgresql"
  url      = env("DATABASE_URL")
}
```

**3. 推送到 GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <你的仓库地址>
git push -u origin main
```

**4. 在 Vercel 部署**

1. 登录 [vercel.com](https://vercel.com/)，New Project
2. 选择你的 GitHub 仓库
3. 配置环境变量：
   - `DATABASE_URL` = 你的 PostgreSQL 连接串
   - `NEXTAUTH_SECRET` = 运行 `openssl rand -hex 32` 生成
   - `NEXTAUTH_URL` = 你的 Vercel 域名（部署后再填也行）
4. 点击 Deploy

**5. 数据库迁移 + 种子数据**

部署完成后，在 Vercel 项目里打开 Console 或本地执行：

```bash
# 设置 DATABASE_URL 后执行
npx prisma db push
npx prisma db seed
```

或者使用 Vercel CLI：

```bash
npm i -g vercel
vercel link
vercel env pull
npx prisma db push
npx prisma db seed
```

---

### 方式二：纯静态部署（最快，零成本）

适合只需要导航功能的场景，不需要数据库和后端。

> ⚠️ 静态模式下：登录/注册/后台/投稿/举报等全栈功能不可用，收藏功能仍可用（存在本地浏览器）

#### 步骤

**1. 使用静态导出配置**

将 `next.config.export.mjs` 重命名为 `next.config.mjs`（覆盖原文件），或直接修改：

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
```

**2. 构建**

```bash
npm run build
```

生成的静态文件在 `out/` 目录。

**3. 部署到任意静态托管**

- **Vercel**：`output: 'export'` 模式下 Vercel 会自动识别为静态站点
- **Netlify**：拖拽 `out/` 目录到 Netlify Drop
- **GitHub Pages**：将 `out/` 推送到 `gh-pages` 分支
- **Cloudflare Pages**：连接 Git 仓库，构建命令 `npm run build`，输出目录 `out`

---

### 绑定自定义域名（xiaoyang.com）

无论哪种部署方式，绑定自定义域名的步骤都一样：

**1. 购买域名**
- 在 [阿里云](https://wanwang.aliyun.com/)、[腾讯云](https://dnspod.cloud.tencent.com/)、[Namecheap](https://www.namecheap.com/) 等平台购买 `xiaoyang.com`

**2. 在部署平台添加域名**
- **Vercel**：项目 → Settings → Domains → 添加 `xiaoyang.com` 和 `www.xiaoyang.com`
- **Netlify / Cloudflare Pages**：类似操作，在 Site Settings 里找 Custom Domains

**3. 配置 DNS 解析**

在域名服务商的 DNS 管理中添加记录：

| 类型 | 主机记录 | 记录值 |
|---|---|---|
| CNAME | www | `cname.vercel-dns.com`（Vercel 示例） |
| A | @ | Vercel 提供的服务器 IP |

> 不同平台的 DNS 记录值不同，以平台显示的为准。

**4. 等待生效**
- DNS 解析通常几分钟到几小时生效
- 部署平台会自动申请 HTTPS 证书
- 生效后通过 `https://xiaoyang.com` 访问

**国内备案提示**：
- 如果域名指向国内服务器，需要 [ICP 备案](https://beian.miit.gov.cn/)
- 如果部署在 Vercel / Cloudflare 等境外平台，不需要备案（但国内访问可能较慢）
- 如果想要国内访问快 + 备案，可以用阿里云/腾讯云服务器部署

## 🔐 环境变量

复制 `.env.example` 为 `.env` 并修改：

| 变量 | 说明 |
|---|---|
| `DATABASE_URL` | 数据库连接串（SQLite 或 PostgreSQL） |
| `NEXTAUTH_SECRET` | NextAuth 加密密钥（生产环境必须修改！） |
| `NEXTAUTH_URL` | 站点完整 URL（如 `https://xiaoyang.com`） |
| `NEXT_PUBLIC_SITE_URL` | 站点公开 URL（用于 SEO 和 sitemap） |

生成 NEXTAUTH_SECRET：
```bash
openssl rand -hex 32
```

## ➕ 如何新增网站

### 方式 A：后台管理（推荐）

1. 登录管理员账号
2. 进入 `/admin/sites`
3. 点击「新增站点」填写信息

### 方式 B：直接修改数据文件

打开 `src/content/sites.ts`，在数组末尾添加：

```typescript
{
  id: 'my-awesome-site',          // 英文唯一标识（小写+连字符）
  name: '网站中文名',
  aliases: ['别名1', '别名2'],
  url: 'https://example.com',
  tagline: '一句话简介',
  description: '详细描述（可选）',
  categoryId: 'ai-chat',
  tags: ['免费', '国内可直连'],
  region: 'domestic',             // domestic 国内 / foreign 国外
  language: 'en',                 // 外语站：multi/en/ja/ko/es/fr
  isFree: true,
  isHot: true,
  isNew: false,
  sortOrder: 99,
  createdAt: D,
  updatedAt: D,
},
```

导入到数据库：
```bash
npm run db:seed
```

### 分类 ID 对照

**AI 网站（9 类）**：
`ai-chat` AI对话写作 · `ai-search` AI搜索 · `ai-image` AI绘画 · `ai-video` AI视频 · `ai-code` AI编程 · `ai-office` AI PPT办公 · `ai-music` AI音乐音频 · `ai-design` AI设计 · `ai-learning` AI学习

**快捷工具（10 类）**：
`tool-pdf` PDF处理 · `tool-convert` 格式转换 · `tool-image` 图片处理 · `tool-translate` 翻译工具 · `tool-mindmap` 思维导图 · `tool-drive` 网盘与文档 · `tool-dev` 开发与素材 · `tool-academic` 学术资料 · `tool-efficiency` 学习效率 · `tool-life` 生活查询

**外语学习（6 类）**：
`lang-general` 多语种综合 · `lang-en` 英语 · `lang-ja` 日语 · `lang-ko` 韩语 · `lang-es` 西班牙语 · `lang-fr` 法语

## ⚖️ 合规提示

- 只收录合法公开站点，不收盗版/破解/侵权资源
- 考试报名类只认官方域名（neea.cn 等）
- 境外站点仅客观标注，不提供任何绕过网络管制的方法
- 所有外链均为第三方网站，使用前请自行甄别

## 📄 License

MIT
