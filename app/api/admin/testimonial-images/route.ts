import { mkdir, readdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

// Route segment config for handling large file uploads
export const maxDuration = 60; // 60 seconds timeout
export const dynamic = "force-dynamic";

// Separate upload directory for testimonial images
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "testimonials");
const MAX_UPLOAD_BYTES = Number.parseInt(process.env.UPLOAD_MAX_BYTES ?? `${50 * 1024 * 1024}`, 10); // 50MB for original quality
const ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const WRITE_ROLES = new Set<UserRole>([UserRole.ADMIN, UserRole.EDITOR]);

// GET - List all testimonial images
export async function GET(request: NextRequest) {
  try {
    await requireSession(request);

    const images = await prisma.testimonialImage.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ files: images });
  } catch (error) {
    console.error("Error fetching testimonial images:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch testimonial images";
    return NextResponse.json(
      { error: errorMessage },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 },
    );
  }
}

// POST - Upload new testimonial image (keeps original quality, no compression)
export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(request);

    if (!WRITE_ROLES.has(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file payload" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Unsupported file type. Only PNG, JPEG, WebP, and GIF are allowed." }, { status: 415 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: `File exceeds ${Math.floor(MAX_UPLOAD_BYTES / (1024 * 1024))}MB limit` },
        { status: 413 },
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
        message: "Upload successful",
        id: testimonialImage.id,
        url: relativeUrl,
        absoluteUrl,
        filename,
        originalName: file.name,
        size: buffer.length,
        mimeType: file.type,
        uploadedAt: testimonialImage.createdAt.toISOString(),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Upload error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to upload image";
    return NextResponse.json(
      { error: errorMessage },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 },
    );
  }
}

// DELETE - Delete a testimonial image
export async function DELETE(request: NextRequest) {
  try {
    const session = await requireSession(request);

    if (!WRITE_ROLES.has(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 });
    }

    // Find the image record
    const image = await prisma.testimonialImage.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Delete file from disk
    try {
      const filePath = path.join(UPLOAD_DIR, image.filename);
      await unlink(filePath);
    } catch (fileError) {
      console.error("Error deleting file from disk:", fileError);
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await prisma.testimonialImage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to delete image";
    return NextResponse.json(
      { error: errorMessage },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 },
    );
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
