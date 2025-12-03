import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

// Route segment config
export const dynamic = "force-dynamic";

// MIME type mapping
const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

// Cache duration in seconds (30 days)
const CACHE_MAX_AGE = 60 * 60 * 24 * 30;

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path: pathSegments } = await params;

    if (!pathSegments || pathSegments.length === 0) {
      return NextResponse.json({ error: "File path required" }, { status: 400 });
    }

    // Construct the file path
    const relativePath = pathSegments.join("/");

    // Security: Prevent directory traversal attacks
    if (relativePath.includes("..") || relativePath.includes("~")) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public", "uploads", relativePath);

    // Verify the file is within the uploads directory
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const resolvedPath = path.resolve(filePath);
    if (!resolvedPath.startsWith(uploadsDir)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if file exists
    try {
      await stat(filePath);
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Read the file
    const fileBuffer = await readFile(filePath);

    // Determine MIME type
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    // Return the file with appropriate headers
    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, immutable`,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error serving uploaded file:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
