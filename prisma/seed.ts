import { PrismaClient } from "@prisma/client";
import { categories } from "../src/content/categories";
import { sites } from "../src/content/sites";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 开始种子数据导入...");

  // 1. 导入分类
  console.log("  → 导入分类...");
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {
        name: cat.name,
        type: cat.type,
        icon: cat.icon,
        emoji: cat.emoji || null,
        sortOrder: cat.sortOrder,
      },
      create: {
        id: cat.id,
        type: cat.type,
        name: cat.name,
        icon: cat.icon,
        emoji: cat.emoji || null,
        sortOrder: cat.sortOrder,
      },
    });
  }
  console.log(`    ✓ 共 ${categories.length} 个分类`);

  // 2. 导入网站
  console.log("  → 导入网站...");
  let siteCount = 0;
  for (const site of sites) {
    await prisma.site.upsert({
      where: { slug: site.id },
      update: {
        name: site.name,
        aliases: site.aliases.join(","),
        url: site.url,
        logo: site.logo || null,
        emoji: site.emoji || null,
        tagline: site.tagline,
        description: site.description || null,
        categoryId: site.categoryId,
        tags: site.tags.join(","),
        region: site.region,
        language: site.language || null,
        isFree: site.isFree,
        isHot: site.isHot || false,
        isNew: site.isNew || false,
        isOfficial: site.isOfficial || false,
        sortOrder: site.sortOrder,
        status: "online",
      },
      create: {
        slug: site.id,
        name: site.name,
        aliases: site.aliases.join(","),
        url: site.url,
        logo: site.logo || null,
        emoji: site.emoji || null,
        tagline: site.tagline,
        description: site.description || null,
        categoryId: site.categoryId,
        tags: site.tags.join(","),
        region: site.region,
        language: site.language || null,
        isFree: site.isFree,
        isHot: site.isHot || false,
        isNew: site.isNew || false,
        isOfficial: site.isOfficial || false,
        sortOrder: site.sortOrder,
        status: "online",
      },
    });
    siteCount++;
  }
  console.log(`    ✓ 共 ${siteCount} 个网站`);

  // 3. 创建初始 admin 用户
  console.log("  → 创建初始管理员...");
  const adminEmail = "admin@example.com";
  const adminPassword = "admin123456";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "管理员",
        passwordHash,
        role: "admin",
      },
    });
    console.log(`    ✓ 管理员已创建：${adminEmail} / ${adminPassword}`);
  } else {
    console.log("    - 管理员已存在，跳过");
  }

  console.log("\n🎉 种子数据导入完成！");
  console.log(`   管理员账号：${adminEmail} / ${adminPassword}`);
  console.log("   请尽快修改默认密码！");
}

main()
  .catch((e) => {
    console.error("❌ 种子导入失败：", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
