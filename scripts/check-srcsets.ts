#!/usr/bin/env tsx
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const content = await prisma.content.findMany({
    select: { id: true, title: true, body: true },
  });

  console.log(`Total content items: ${content.length}\n`);

  content.forEach((c) => {
    const hasImg = c.body?.includes("<img");
    const hasSrcset = c.body?.includes("srcset");
    const status = hasImg ? (hasSrcset ? "✅ HAS SRCSET" : "❌ NEEDS SRCSET") : "ℹ️  NO IMAGES";
    console.log(`- "${c.title}"`);
    console.log(`  ID: ${c.id}`);
    console.log(`  Status: ${status}`);

    if (c.body) {
      const bodySnippet = c.body.substring(0, 200).replace(/\n/g, " ");
      console.log(`  Body preview: ${bodySnippet}${c.body.length > 200 ? "..." : ""}`);
    } else {
      console.log(`  Body preview: (empty)`);
    }
    console.log();
  });

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
