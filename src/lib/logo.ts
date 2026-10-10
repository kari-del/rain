import { extractDomain } from "./utils";

/**
 * 获取网站 favicon 的 URL
 * 优先使用国内稳定服务 iowen.cn，失败时回退
 */
export function getFaviconUrl(url: string): string {
  const domain = extractDomain(url);
  return `https://api.iowen.cn/favicon/${domain}.png`;
}

/**
 * 备用 favicon 服务（第二级回退）
 */
export function getFaviconFallbackUrl(url: string): string {
  const domain = extractDomain(url);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

/**
 * 第三级回退：直接访问网站根目录 favicon
 */
export function getFaviconDirectUrl(url: string): string {
  const domain = extractDomain(url);
  return `https://${domain}/favicon.ico`;
}
