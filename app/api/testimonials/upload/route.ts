import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

// Route segment config for handling large file uploads
export const maxDuration = 60; // 60 seconds timeout
export const dynamic = "force-dynamic";

// Separate upload directory for testimonial images
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "testimonials");
const MAX_UPLOAD_BYTES = Number.parseInt(process.env.UPLOAD_MAX_BYTES ?? `${20 * 1024 * 1024}`, 10); // 20MB
const MAX_FILES_PER_SUBMISSION = 5;
const ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

// POST - Upload testimonial image from public form (keeps original quality, no compression)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file payload" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Loại file không hỗ trợ. Chỉ chấp nhận PNG, JPEG, WebP và GIF." },
        { status: 415 }
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: `File vượt quá giới hạn ${Math.floor(MAX_UPLOAD_BYTES / (1024 * 1024))}MB` },
        { status: 413 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get file extension from original filename or mime type
    const originalExtension = path.extname(file.name).toLowerCase() || getExtensionFromMimeType(file.type);

    // Generate unique filename preserving original extension
    const filename = `${Date.now()}-${randomBytes(8).toString("hex")}${originalExtension}`;

    await mkdir(UPLOAD_DIR, { recursive: true });

    // Write file without any processing (keep original quality)
    await writeFile(path.join(UPLOAD_DIR, filename), buffer);

    const relativeUrl = `/uploads/testimonials/${filename}`;
    const absoluteUrl = buildAbsoluteUrl(relativeUrl, request);

    // Save to database
    const testimonialImage = await prisma.testimonialImage.create({
      data: {
        filename,
        url: relativeUrl,
        originalName: file.name,
        size: buffer.length,
        mimeType: file.type,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Tải lên thành công",
        id: testimonialImage.id,
        url: relativeUrl,
        absoluteUrl,
        filename,
        originalName: file.name,
        size: buffer.length,
        mimeType: file.type,
        uploadedAt: testimonialImage.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Không thể tải lên hình ảnh" }, { status: 500 });
  }
}

function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
    "image/gif": ".gif",
  };
  return mimeToExt[mimeType] || ".jpg";
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
