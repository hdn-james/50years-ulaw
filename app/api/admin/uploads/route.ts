import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import sharp from "sharp";

import { requireSession } from "@/lib/session";

// Route segment config for handling large file uploads
export const maxDuration = 60; // 60 seconds timeout
export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_UPLOAD_BYTES = Number.parseInt(process.env.UPLOAD_MAX_BYTES ?? `${20 * 1024 * 1024}`, 10);
const ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]);
const WRITE_ROLES = new Set<UserRole>([UserRole.ADMIN, UserRole.EDITOR]);

// WebP conversion settings
const WEBP_QUALITY = 85; // 0-100, higher = better quality but larger file size
const WEBP_EFFORT = 2; // 0-6, lower = faster processing (2 is fast with good compression)

// Image size presets
const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150, suffix: "-thumb" },
  small: { width: 400, height: 400, suffix: "-small" },
  medium: { width: 800, height: 800, suffix: "-medium" },
  large: { width: 1600, height: 1600, suffix: "-large" },
} as const;

type ImageSize = keyof typeof IMAGE_SIZES;

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(request);

    if (!WRITE_ROLES.has(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const generateSizes = formData.get("generateSizes") === "true"; // Default false for speed

    console.log("[Upload API] generateSizes parameter:", formData.get("generateSizes"));
    console.log("[Upload API] generateSizes boolean:", generateSizes);

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file payload" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: `File exceeds ${Math.floor(MAX_UPLOAD_BYTES / (1024 * 1024))}MB limit` },
        { status: 413 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate base filename (without extension)
    const baseFilename = `${Date.now()}-${randomBytes(8).toString("hex")}`;

    await mkdir(UPLOAD_DIR, { recursive: true });

    // Handle SVG files separately (no conversion or resizing)
    if (file.type === "image/svg+xml") {
      const filename = `${baseFilename}.svg`;
      await writeFile(path.join(UPLOAD_DIR, filename), buffer);

      const relativeUrl = `/uploads/${filename}`;
      const absoluteUrl = buildAbsoluteUrl(relativeUrl, request);

      return NextResponse.json(
        {
          success: true,
          message: "Upload successful",
          url: relativeUrl,
          absoluteUrl,
          filename,
          size: buffer.length,
          mimeType: file.type,
          uploadedAt: new Date().toISOString(),
          converted: false,
        },
        { status: 201 },
      );
    }

    // Process raster images (convert to WebP and optionally generate multiple sizes)
    try {
      const startTime = Date.now();

      // Get metadata once
      const metadata = await sharp(buffer).metadata();

      // Prepare all processing tasks
      const tasks: Promise<{ name: string; filename: string; buffer: Buffer } | null>[] = [];

      // Original size (always generated)
      const originalFilename = `${baseFilename}.webp`;
      tasks.push(
        sharp(buffer)
          .webp({
            quality: WEBP_QUALITY,
            effort: WEBP_EFFORT,
          })
          .toBuffer()
          .then((buf) => ({
            name: "original",
            filename: originalFilename,
            buffer: buf,
          })),
      );

      // Additional sizes (only if requested)
      if (generateSizes) {
        for (const [sizeName, config] of Object.entries(IMAGE_SIZES)) {
          const sizedFilename = `${baseFilename}${config.suffix}.webp`;
          tasks.push(
            sharp(buffer)
              .resize(config.width, config.height, {
                fit: "inside",
                withoutEnlargement: true,
              })
              .webp({
                quality: WEBP_QUALITY,
                effort: WEBP_EFFORT,
              })
              .toBuffer()
              .then((buf) => ({
                name: sizeName,
                filename: sizedFilename,
                buffer: buf,
              }))
              .catch((error) => {
                console.error(`Failed to generate ${sizeName} size:`, error);
                return null;
              }),
          );
        }
      }

      // Process all images in parallel
      const results = await Promise.all(tasks);

      // Write all files in parallel
      const writePromises = results
        .filter((result): result is { name: string; filename: string; buffer: Buffer } => result !== null)
        .map((result) => writeFile(path.join(UPLOAD_DIR, result.filename), result.buffer));

      await Promise.all(writePromises);

      const processingTime = Date.now() - startTime;
      console.log(`Image processing completed in ${processingTime}ms`);

      // Find original result
      const originalResult = results.find((r) => r?.name === "original");
      if (!originalResult) {
        throw new Error("Failed to process original image");
      }

      const relativeUrl = `/uploads/${originalResult.filename}`;
      const absoluteUrl = buildAbsoluteUrl(relativeUrl, request);

      const responseData: Record<string, unknown> = {
        success: true,
        message: "Upload successful",
        url: relativeUrl,
        absoluteUrl,
        filename: originalResult.filename,
        size: originalResult.buffer.length,
        originalSize: file.size,
        mimeType: "image/webp",
        originalMimeType: file.type,
        uploadedAt: new Date().toISOString(),
        converted: true,
        dimensions: {
          width: metadata.width,
          height: metadata.height,
        },
        processingTime: `${processingTime}ms`,
      };

      // Add sizes info if they were generated
      console.log("[Upload API] Should generate sizes?", generateSizes);
      if (generateSizes) {
        console.log("[Upload API] Generating sizes for response");
        const sizes: Record<string, { url: string; absoluteUrl: string; width: number; height: number; size: number }> =
          {};

        for (const result of results) {
          if (result && result.name !== "original") {
            const sizeConfig = IMAGE_SIZES[result.name as ImageSize];
            if (sizeConfig) {
              const sizedMetadata = await sharp(result.buffer).metadata();
              const sizedRelativeUrl = `/uploads/${result.filename}`;

              sizes[result.name] = {
                url: sizedRelativeUrl,
                absoluteUrl: buildAbsoluteUrl(sizedRelativeUrl, request),
                width: sizedMetadata.width || sizeConfig.width,
                height: sizedMetadata.height || sizeConfig.height,
                size: result.buffer.length,
              };
            }
          }
        }

        console.log("[Upload API] Sizes generated:", Object.keys(sizes));
        responseData.sizes = sizes;
      } else {
        console.log("[Upload API] Skipping size generation (generateSizes=false)");
      }

      return NextResponse.json(responseData, { status: 201 });
    } catch (conversionError) {
      console.error("Image conversion error:", conversionError);
      return NextResponse.json(
        { error: "Failed to process image. Please ensure the file is a valid image." },
        { status: 422 },
      );
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}

function buildAbsoluteUrl(relativeUrl: string, request: NextRequest): string {
  const origin =
    request.nextUrl?.origin ?? process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_ORIGIN ?? "http://localhost:3000";
  try {
    return new URL(relativeUrl, origin).toString();
  } catch {
    return relativeUrl;
  }
}
