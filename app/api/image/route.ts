import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const CACHE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days in seconds
const DEFAULT_QUALITY = 85;
const MAX_WIDTH = 3840; // 4K width
const MAX_HEIGHT = 2160; // 4K height

/**
 * Dynamic image resize endpoint
 *
 * Usage:
 * /api/image?src=/uploads/image.webp&w=400&h=300&q=85&fit=cover
 *
 * Query parameters:
 * - src: Image path (required) - e.g., /uploads/image.webp
 * - w: Width in pixels (optional)
 * - h: Height in pixels (optional)
 * - q: Quality 1-100 (optional, default: 85)
 * - fit: Resize fit mode (optional, default: inside)
 *   - cover: Crop to fill dimensions
 *   - contain: Fit within dimensions
 *   - fill: Ignore aspect ratio
 *   - inside: Fit within dimensions (default)
 *   - outside: Fit outside dimensions
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.url ? new URL(request.url) : request.nextUrl;

    // Get query parameters
    const src = searchParams.get("src");
    const widthParam = searchParams.get("w");
    const heightParam = searchParams.get("h");
    const qualityParam = searchParams.get("q");
    const fitParam = searchParams.get("fit") || "inside";

    // Validate src parameter
    if (!src) {
      return NextResponse.json({ error: "Missing src parameter" }, { status: 400 });
    }

    // Security: Only allow images from /uploads directory
    if (!src.startsWith("/uploads/")) {
      return NextResponse.json({ error: "Invalid image path" }, { status: 400 });
    }

    // Parse dimensions
    const width = widthParam ? Math.min(Number.parseInt(widthParam, 10), MAX_WIDTH) : undefined;
    const height = heightParam ? Math.min(Number.parseInt(heightParam, 10), MAX_HEIGHT) : undefined;
    const quality = qualityParam ? Math.max(1, Math.min(100, Number.parseInt(qualityParam, 10))) : DEFAULT_QUALITY;

    // Validate dimensions
    if ((width && Number.isNaN(width)) || (height && Number.isNaN(height))) {
      return NextResponse.json({ error: "Invalid dimensions" }, { status: 400 });
    }

    // Validate fit parameter
    const validFits = ["cover", "contain", "fill", "inside", "outside"];
    if (!validFits.includes(fitParam)) {
      return NextResponse.json({ error: "Invalid fit parameter" }, { status: 400 });
    }

    // Get file path
    const filename = path.basename(src);
    const filePath = path.join(UPLOAD_DIR, filename);

    // Read the file
    let buffer: Buffer;
    try {
      buffer = await readFile(filePath);
    } catch (error) {
      console.error("File read error:", error);
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Process image with sharp
    let sharpInstance = sharp(buffer);

    // Apply resize if dimensions provided
    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: fitParam as "cover" | "contain" | "fill" | "inside" | "outside",
        withoutEnlargement: true,
      });
    }

    // Get original format
    const metadata = await sharp(buffer).metadata();
    const originalFormat = metadata.format;

    // Convert to WebP (or keep original format for SVG)
    let processedBuffer: Buffer;
    let contentType: string;

    if (originalFormat === "svg") {
      processedBuffer = buffer;
      contentType = "image/svg+xml";
    } else {
      processedBuffer = await sharpInstance
        .webp({
          quality,
          effort: 4,
        })
        .toBuffer();
      contentType = "image/webp";
    }

    // Return the processed image with caching headers
    return new NextResponse(new Uint8Array(processedBuffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, immutable`,
        "Content-Length": processedBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Image processing error:", error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}
