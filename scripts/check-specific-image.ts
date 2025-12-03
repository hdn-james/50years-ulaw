#!/usr/bin/env tsx
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const content = await prisma.content.findFirst({
    where: {
      body: {
        contains: "1764268977510-8b59095983d7b6bf",
      },
    },
    select: { id: true, title: true, body: true },
  });

  if (!content) {
    console.log("❌ Content with that image not found in database");
    await prisma.$disconnect();
    return;
  }

  console.log("Found content:", content.title);
  console.log("ID:", content.id);
  console.log("\n" + "=".repeat(80) + "\n");

  const img = content.body?.match(/<img[^>]+>/)?.[0];

  if (img) {
    console.log("Image tag from database:");
    console.log(img);
    console.log("\n" + "=".repeat(80) + "\n");

    const checks = [
      { attr: "srcset", present: img.includes("srcset=") },
      { attr: "sizes", present: img.includes("sizes=") },
      { attr: "loading", present: img.includes("loading=") },
      { attr: "width", present: img.includes("width=") },
      { attr: "height", present: img.includes("height=") },
    ];

    console.log("Attributes in database:");
    checks.forEach(({ attr, present }) => {
      console.log(`  ${present ? "✅" : "❌"} ${attr}`);
    });

    if (!img.includes("srcset=")) {
      console.log("\n⚠️  WARNING: srcset is NOT in the database!");
      console.log("This means the content was saved WITHOUT srcset.");
    } else {
      console.log("\n✅ SUCCESS: srcset IS in the database!");
      console.log("If you're not seeing it in the editor, the problem is in the frontend loading.");
    }
  } else {
    console.log("❌ No image found in content body");
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
