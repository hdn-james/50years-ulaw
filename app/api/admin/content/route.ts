import type { Prisma } from "@prisma/client";
import { ContentStatus, UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { requireSession } from "@/lib/session";
import { slugify } from "@/lib/utils";

const STATUS_MAP = {
  draft: ContentStatus.DRAFT,
  published: ContentStatus.PUBLISHED,
  archived: ContentStatus.ARCHIVED,
} as const satisfies Record<string, ContentStatus>;

const querySchema = z.object({
  search: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  category: z.string().optional(),
});

const contentSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3, "Title must be at least 3 characters long"),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers, or hyphens")
    .optional(),
  description: z.string().min(1, "Description is required").optional(),
  category: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  publishedAt: z.string().datetime().optional(),
  seoDescription: z.string().optional(),
  seoImageUrl: z.string().optional(),
  seoImageAlt: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  tags: z.array(z.string().min(1)).optional(),
  images: z
    .array(
      z.object({
        url: z.string().min(1),
        alt: z.string().optional(),
      }),
    )
    .optional(),
});

const CONTENT_INCLUDE = {
  tags: {
    include: {
      tag: true,
    },
  },
  author: {
    select: {
      id: true,
      username: true,
    },
  },
} satisfies Prisma.ContentInclude;

type ContentWithRelations = Prisma.ContentGetPayload<{ include: typeof CONTENT_INCLUDE }>;
type ContentWhereInput = Prisma.ContentWhereInput;

const WRITE_ROLES = new Set<UserRole>([UserRole.ADMIN, UserRole.EDITOR]);

export async function GET(request: NextRequest) {
  try {
    await ensureAuthorized(request, { allowViewOnly: true });

    const parsed = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().formErrors.join(", ") }, { status: 400 });
    }

    const { search, status, category } = parsed.data;
    const where: ContentWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { body: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = STATUS_MAP[status];
    }

    if (category) {
      where.category = { equals: category, mode: "insensitive" };
    }

    const data = await prisma.content.findMany({
      where,
      include: CONTENT_INCLUDE,
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(
      {
        success: true,
        total: data.length,
        data: data.map(normalizeContentResponse),
      },
      { status: 200 },
    );
  } catch (error) {
    return handleRouteError(error, "Failed to fetch contents");
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await ensureAuthorized(request);

    const body = await request.json();
    const normalizedBody = normalizeIncomingPayload(body);
    const parsed = contentSchema.safeParse(normalizedBody);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().formErrors.join(", ") }, { status: 400 });
    }

    const payload = parsed.data;
    const slug = payload.slug ?? slugify(payload.title);
    const sanitizedBody = sanitizeHtml(payload.content);

    const existing = await prisma.content.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const created = await prisma.content.create({
      data: {
        title: payload.title,
        slug,
        description: payload.description,
        category: payload.category,
        body: sanitizedBody,
        status: STATUS_MAP[payload.status],
        publishedAt: payload.publishedAt ? new Date(payload.publishedAt) : null,
        seoDescription: payload.seoDescription ?? payload.description ?? null,
        seoImageUrl: payload.seoImageUrl,
        seoImageAlt: payload.seoImageAlt,
        thumbnailUrl: payload.thumbnailUrl,
        images: payload.images ?? undefined,
        authorId: user.id,
        tags: payload.tags?.length
          ? {
              create: payload.tags.map((tagName) => ({
                tag: {
                  connectOrCreate: {
                    where: { slug: slugify(tagName) },
                    create: { name: tagName, slug: slugify(tagName) },
                  },
                },
              })),
            }
          : undefined,
      },
      include: CONTENT_INCLUDE,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Content created successfully",
        data: normalizeContentResponse(created),
      },
      { status: 201 },
    );
  } catch (error) {
    return handleRouteError(error, "Failed to create content");
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureAuthorized(request);

    const body = await request.json();
    const normalizedBody = normalizeIncomingPayload(body);
    const parsed = contentSchema.extend({ id: z.string().uuid() }).safeParse(normalizedBody);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().formErrors.join(", ") }, { status: 400 });
    }

    const payload = parsed.data;
    const slug = payload.slug ?? slugify(payload.title);
    const sanitizedBody = sanitizeHtml(payload.content);

    const slugOwner = await prisma.content.findUnique({ where: { slug } });
    if (slugOwner && slugOwner.id !== payload.id) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const tagsProvided = Object.prototype.hasOwnProperty.call(payload, "tags");

    const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      if (tagsProvided) {
        await tx.contentTag.deleteMany({ where: { contentId: payload.id } });
      }

      return tx.content.update({
        where: { id: payload.id },
        data: {
          title: payload.title,
          slug,
          description: payload.description,
          category: payload.category,
          body: sanitizedBody,
          status: STATUS_MAP[payload.status],
          publishedAt: payload.publishedAt ? new Date(payload.publishedAt) : null,
          seoDescription: payload.seoDescription ?? payload.description ?? null,
          seoImageUrl: payload.seoImageUrl,
          seoImageAlt: payload.seoImageAlt,
          thumbnailUrl: payload.thumbnailUrl,
          images: payload.images ?? undefined,
          tags: tagsProvided
            ? {
                create: (payload.tags ?? []).map((tagName) => ({
                  tag: {
                    connectOrCreate: {
                      where: { slug: slugify(tagName) },
                      create: { name: tagName, slug: slugify(tagName) },
                    },
                  },
                })),
              }
            : undefined,
        },
        include: CONTENT_INCLUDE,
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: "Content updated successfully",
        data: normalizeContentResponse(updated),
      },
      { status: 200 },
    );
  } catch (error) {
    return handleRouteError(error, "Failed to update content");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await ensureAuthorized(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Content ID is required" }, { status: 400 });
    }

    const deleted = await prisma.content.delete({
      where: { id },
      include: CONTENT_INCLUDE,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Content deleted successfully",
        data: normalizeContentResponse(deleted),
      },
      { status: 200 },
    );
  } catch (error) {
    return handleRouteError(error, "Failed to delete content");
  }
}

function normalizeIncomingPayload(body: unknown) {
  if (!body || typeof body !== "object") {
    return {};
  }

  const payload = { ...(body as Record<string, unknown>) };

  if (payload.publishedAt) {
    const normalizedDate = normalizeDateInput(payload.publishedAt);
    if (normalizedDate) {
      payload.publishedAt = normalizedDate;
    } else {
      delete payload.publishedAt;
    }
  }

  return payload;
}

function normalizeDateInput(value: unknown): string | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  if (typeof value === "string" && value.trim().length) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return undefined;
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

function normalizeContentResponse(content: ContentWithRelations) {
  const images = Array.isArray(content.images) ? content.images : [];
  const sanitizedBody = sanitizeHtml(content.body ?? "");

  return {
    id: content.id,
    title: content.title,
    slug: content.slug,
    description: content.description,
    category: content.category,
    content: sanitizedBody,
    seoDescription: content.seoDescription,
    seoImageUrl: content.seoImageUrl,
    seoImageAlt: content.seoImageAlt,
    thumbnailUrl: content.thumbnailUrl,
    images,
    status: content.status.toLowerCase(),
    publishedAt: content.publishedAt?.toISOString() ?? null,
    createdAt: content.createdAt.toISOString(),
    updatedAt: content.updatedAt.toISOString(),
    tags: content.tags.map((relation) => relation.tag.name),
    author: content.author ? { id: content.author.id, username: content.author.username } : null,
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
  }

  console.error(fallbackMessage, error);
  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}
