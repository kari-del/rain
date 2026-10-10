/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出模式：部署到任何静态托管（Vercel / Netlify / GitHub Pages）
  // 注意：静态模式下 API 路由、登录注册、后台管理等全栈功能不可用
  // 如需完整功能，请使用全栈部署（见 README）
  output: "export",
  // 静态导出时图片优化需要关闭
  images: {
    unoptimized: true,
  },
  // 不结尾斜杠，兼容更多托管平台
  trailingSlash: false,
};

export default nextConfig;
