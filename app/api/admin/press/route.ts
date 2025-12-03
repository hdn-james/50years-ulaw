import { ContentStatus, UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

const STATUS_MAP = {
  draft: ContentStatus.DRAFT,
  published: ContentStatus.PUBLISHED,
  archived: ContentStatus.ARCHIVED,
} as const satisfies Record<string, ContentStatus>;

const querySchema = z.object({
  search: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

const pressSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3, "Title must be at least 3 characters long"),
  dateReleased: z.string().datetime("Invalid date format"),
  description: z.string().min(1, "Description is required"),
  thumbnailUrl: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : val),
    z.string().url("Invalid thumbnail URL").optional(),
  ),
  link: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : val),
    z.string().url("Invalid link URL").optional(),
  ),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

const WRITE_ROLES = new Set<UserRole>([UserRole.ADMIN, UserRole.EDITOR]);

export async function GET(request: NextRequest) {
  try {
    await ensureAuthorized(request, { allowViewOnly: true });

    const parsed = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().formErrors.join(", ") }, { status: 400 });
    }

    const { search, status } = parsed.data;
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = STATUS_MAP[status];
    }

    const data = await prisma.pressAboutUs.findMany({
      where,
      orderBy: { dateReleased: "desc" },
    });

    return NextResponse.json(
      {
        success: true,
        total: data.length,
        data: data.map(normalizePressResponse),
      },
      { status: 200 },
    );
  } catch (error) {
    return handleRouteError(error, "Failed to fetch press items");
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureAuthorized(request);

    const body = await request.json();
    console.log("[Press API] POST body:", JSON.stringify(body, null, 2));

    const parsed = pressSchema.safeParse(body);

    if (!parsed.success) {
      console.error("[Press API] Validation error:", parsed.error.issues);
      return NextResponse.json(
        {
          error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", "),
          details: parsed.error.issues,
        },
        { status: 400 },
      );
    }

    const payload = parsed.data;
    console.log("[Press API] Parsed payload:", payload);

    const created = await prisma.pressAboutUs.create({
      data: {
        title: payload.title,
        dateReleased: new Date(payload.dateReleased),
        description: payload.description,
        thumbnailUrl: payload.thumbnailUrl || null,
        link: payload.link || null,
        status: STATUS_MAP[payload.status],
      },
    });

    console.log("[Press API] Created successfully:", created.id);

    return NextResponse.json(
      {
        success: true,
        message: "Press item created successfully",
        data: normalizePressResponse(created),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[Press API] POST error:", error);
    return handleRouteError(error, "Failed to create press item");
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureAuthorized(request);

    const body = await request.json();
    const parsed = pressSchema.extend({ id: z.string().uuid() }).safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().formErrors.join(", ") }, { status: 400 });
    }

    const payload = parsed.data;

    const updated = await prisma.pressAboutUs.update({
      where: { id: payload.id },
      data: {
        title: payload.title,
        dateReleased: new Date(payload.dateReleased),
        description: payload.description,
        thumbnailUrl: payload.thumbnailUrl || null,
        link: payload.link || null,
        status: STATUS_MAP[payload.status],
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Press item updated successfully",
        data: normalizePressResponse(updated),
      },
      { status: 200 },
    );
  } catch (error) {
    return handleRouteError(error, "Failed to update press item");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await ensureAuthorized(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Press item ID is required" }, { status: 400 });
    }

    const deleted = await prisma.pressAboutUs.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Press item deleted successfully",
        data: normalizePressResponse(deleted),
      },
      { status: 200 },
    );
  } catch (error) {
    return handleRouteError(error, "Failed to delete press item");
  }
}

async function ensureAuthorized(request: NextRequest, options: { allowViewOnly?: boolean } = {}) {
  const session = await requireSession(request);

  if (options.allowViewOnly) {
    return session;
  }

  if (!WRITE_ROLES.has(session.user.role)) {
    throw new Error("Forbidden");
  }

  return session;
}

function normalizePressResponse(press: any) {
  return {
    id: press.id,
    title: press.title,
    dateReleased: press.dateReleased.toISOString(),
    description: press.description,
    thumbnailUrl: press.thumbnailUrl,
    link: press.link,
    status: press.status.toLowerCase(),
    createdAt: press.createdAt.toISOString(),
    updatedAt: press.updatedAt.toISOString(),
  };
}

function handleRouteError(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Return detailed error message in development
    console.error(fallbackMessage, error);
    return NextResponse.json(
      {
        error: fallbackMessage,
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }

  console.error(fallbackMessage, error);
  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}
