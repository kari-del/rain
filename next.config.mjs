/** @type {import('next').NextConfig} */
const isStatic = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

const nextConfig = {
  // 静态导出模式：部署到 Cloudflare Pages / Netlify / GitHub Pages
  // 通过环境变量 NEXT_PUBLIC_STATIC_EXPORT=true 控制
  ...(isStatic && {
    output: "export",
    images: {
      unoptimized: true,
    },
    trailingSlash: false,
  }),
};

export default nextConfig;
