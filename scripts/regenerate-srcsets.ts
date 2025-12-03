#!/usr/bin/env tsx
/**
 * Regenerate srcset attributes for existing images in content.
 *
 * This script:
 * 1. Finds all content items with images in the body
 * 2. For each image that doesn't have srcset, attempts to generate sizes
 * 3. Updates the content body with proper srcset and sizes attributes
 *
 * Usage:
 *   npx tsx scripts/regenerate-srcsets.ts [--dry-run] [--content-id=123]
 *
 * Options:
 *   --dry-run: Preview changes without saving to database
 *   --content-id=N: Only process specific content item by ID
 *   --force: Regenerate srcset even if it already exists
 */

import { PrismaClient } from "@prisma/client";
import { JSDOM } from "jsdom";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

interface ImageSizes {
  thumbnail: { url: string; width: number; height: number };
  small: { url: string; width: number; height: number };
  medium: { url: string; width: number; height: number };
  large: { url: string; width: number; height: number };
  original: { url: string; width: number; height: number };
}

const SIZE_CONFIGS = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 640, height: 480 },
  medium: { width: 1024, height: 768 },
  large: { width: 1920, height: 1440 },
};

async function generateImageSizes(originalPath: string): Promise<ImageSizes | null> {
  try {
    const fullPath = path.join(process.cwd(), "public", originalPath);
    const exists = await fs
      .access(fullPath)
      .then(() => true)
      .catch(() => false);

    if (!exists) {
      console.warn(`  ⚠️  File not found: ${fullPath}`);
      return null;
    }

    // Check if it's SVG (no processing needed)
    if (originalPath.toLowerCase().endsWith(".svg")) {
      const metadata = await sharp(fullPath).metadata();
      return {
        thumbnail: { url: originalPath, width: metadata.width || 150, height: metadata.height || 150 },
        small: { url: originalPath, width: metadata.width || 640, height: metadata.height || 480 },
        medium: { url: originalPath, width: metadata.width || 1024, height: metadata.height || 768 },
        large: { url: originalPath, width: metadata.width || 1920, height: metadata.height || 1440 },
        original: { url: originalPath, width: metadata.width || 0, height: metadata.height || 0 },
      };
    }

    const image = sharp(fullPath);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      console.warn(`  ⚠️  Could not get dimensions for: ${originalPath}`);
      return null;
    }

    const dir = path.dirname(fullPath);
    const ext = path.extname(originalPath);
    const basename = path.basename(originalPath, ext);
    const relativeDir = path.dirname(originalPath);

    const sizes: ImageSizes = {
      thumbnail: { url: originalPath, width: metadata.width, height: metadata.height },
      small: { url: originalPath, width: metadata.width, height: metadata.height },
      medium: { url: originalPath, width: metadata.width, height: metadata.height },
      large: { url: originalPath, width: metadata.width, height: metadata.height },
      original: { url: originalPath, width: metadata.width, height: metadata.height },
    };

    // Generate each size if it doesn't exist and image is large enough
    for (const [sizeName, config] of Object.entries(SIZE_CONFIGS)) {
      const key = sizeName as keyof typeof SIZE_CONFIGS;

      if (metadata.width <= config.width && metadata.height <= config.height) {
        // Image is smaller than this size, use original
        continue;
      }

      const sizeFilename = `${basename}-${sizeName}.webp`;
      const sizePath = path.join(dir, sizeFilename);
      const sizeUrl = path.join(relativeDir, sizeFilename);

      // Check if size already exists
      const sizeExists = await fs
        .access(sizePath)
        .then(() => true)
        .catch(() => false);

      if (!sizeExists) {
        console.log(`    Generating ${sizeName} (${config.width}x${config.height})...`);
        const resized = await image
          .clone()
          .resize(config.width, config.height, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 80, effort: 2 })
          .toBuffer();

        await fs.writeFile(sizePath, resized);

        const resizedMeta = await sharp(resized).metadata();
        sizes[key] = {
          url: sizeUrl,
          width: resizedMeta.width || config.width,
          height: resizedMeta.height || config.height,
        };
      } else {
        // Size exists, get its metadata
        const existingMeta = await sharp(sizePath).metadata();
        sizes[key] = {
          url: sizeUrl,
          width: existingMeta.width || config.width,
          height: existingMeta.height || config.height,
        };
      }
    }

    return sizes;
  } catch (error) {
    console.error(`  ❌ Error generating sizes for ${originalPath}:`, error);
    return null;
  }
}

function buildSrcset(sizes: ImageSizes): string {
  const entries: string[] = [];

  if (sizes.thumbnail.url !== sizes.original.url) {
    entries.push(`${sizes.thumbnail.url} ${sizes.thumbnail.width}w`);
  }
  if (sizes.small.url !== sizes.original.url) {
    entries.push(`${sizes.small.url} ${sizes.small.width}w`);
  }
  if (sizes.medium.url !== sizes.original.url) {
    entries.push(`${sizes.medium.url} ${sizes.medium.width}w`);
  }
  if (sizes.large.url !== sizes.original.url) {
    entries.push(`${sizes.large.url} ${sizes.large.width}w`);
  }
  entries.push(`${sizes.original.url} ${sizes.original.width}w`);

  return entries.join(", ");
}

async function processContent(contentId: string, dryRun: boolean, force: boolean) {
  const content = await prisma.content.findUnique({
    where: { id: contentId },
    select: { id: true, title: true, body: true },
  });

  if (!content || !content.body) {
    console.log(`⏭️  Skipping content #${contentId}: No body found`);
    return;
  }

  console.log(`\n📄 Processing: "${content.title}" (ID: ${content.id})`);

  const dom = new JSDOM(content.body);
  const document = dom.window.document;
  const images = document.querySelectorAll("img");

  if (images.length === 0) {
    console.log(`  ⏭️  No images found`);
    return;
  }

  let modified = false;

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const src = img.getAttribute("src");
    const existingSrcset = img.getAttribute("srcset");

    if (!src) {
      console.log(`  ⏭️  Image ${i + 1}: No src attribute`);
      continue;
    }

    if (existingSrcset && !force) {
      console.log(`  ✓ Image ${i + 1}: Already has srcset (${src})`);
      continue;
    }

    console.log(`  🔄 Image ${i + 1}: Processing ${src}...`);

    // Generate sizes for this image
    const sizes = await generateImageSizes(src);

    if (!sizes) {
      console.log(`  ⚠️  Image ${i + 1}: Could not generate sizes`);
      continue;
    }

    // Build srcset
    const srcset = buildSrcset(sizes);
    const sizesAttr = "(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px";

    // Update image attributes
    img.setAttribute("srcset", srcset);
    img.setAttribute("sizes", sizesAttr);

    if (!img.getAttribute("width")) {
      img.setAttribute("width", sizes.original.width.toString());
    }
    if (!img.getAttribute("height")) {
      img.setAttribute("height", sizes.original.height.toString());
    }
    if (!img.getAttribute("loading")) {
      img.setAttribute("loading", "lazy");
    }

    console.log(`  ✅ Image ${i + 1}: Added srcset with ${srcset.split(",").length} sizes`);
    modified = true;
  }

  if (modified) {
    const newBody = document.body.innerHTML;

    if (dryRun) {
      console.log(`\n  🔍 DRY RUN - Would update content #${content.id}`);
      console.log(`  📝 Preview of changes:`);

      // Show a snippet of the first changed image
      const firstImg = document.querySelector("img[srcset]");
      if (firstImg) {
        console.log(`     ${firstImg.outerHTML.substring(0, 200)}...`);
      }
    } else {
      await prisma.content.update({
        where: { id: content.id },
        data: { body: newBody },
      });
      console.log(`  💾 Saved changes to database`);
    }
  } else {
    console.log(`  ℹ️  No changes needed`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const force = args.includes("--force");
  const contentIdArg = args.find((arg) => arg.startsWith("--content-id="));
  const specificContentId = contentIdArg ? contentIdArg.split("=")[1] : null;

  console.log("🚀 Regenerating srcset for content images\n");
  console.log(`Mode: ${dryRun ? "DRY RUN (no changes will be saved)" : "LIVE (changes will be saved)"}`);
  console.log(`Force: ${force ? "YES (will regenerate existing srcsets)" : "NO (skip images with srcset)"}\n`);

  if (specificContentId) {
    console.log(`Processing only content ID: ${specificContentId}\n`);
    await processContent(specificContentId, dryRun, force);
  } else {
    const allContent = await prisma.content.findMany({
      where: {
        body: {
          contains: "<img",
        },
      },
      select: { id: true },
      orderBy: { id: "asc" },
    });

    console.log(`Found ${allContent.length} content items with images\n`);

    for (const content of allContent) {
      await processContent(content.id, dryRun, force);
    }
  }

  console.log("\n✨ Done!");
}

main()
  .catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
