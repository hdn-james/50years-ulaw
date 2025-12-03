"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Edit, Eye, EyeOff, ImagePlus, Loader2, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { cn, slugify } from "@/lib/utils";

type ContentItem = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  content: string;
  status: "draft" | "published" | "archived";
  publishedAt?: string | null;
  updatedAt: string;
  createdAt: string;
  seoDescription?: string | null;
  seoImageUrl?: string | null;
  seoImageAlt?: string | null;
  thumbnailUrl?: string | null;
  images: Array<{ url: string; alt?: string | null }>;
  tags: string[];
  author?: { id: string; username: string } | null;
};

type UploadedAsset = {
  url: string;
  absoluteUrl: string;
  filename: string;
  size: number;
  uploadedAt: string;
};

const statusOptions = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
] as const;

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z
    .string()
    .min(3, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  content: z.string().min(1, "Page content is required"),
  status: z.enum(["draft", "published", "archived"]),
  publishedAt: z.string().optional(),
  seoDescription: z.string().optional(),
  seoImageUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  seoImageAlt: z.string().optional(),
  thumbnailUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  tagsText: z.string().optional(),
  imagesText: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const defaultFormValues: FormValues = {
  title: "",
  slug: "",
  description: "",
  category: "",
  content: "",
  status: "draft",
  publishedAt: "",
  seoDescription: "",
  seoImageUrl: "",
  seoImageAlt: "",
  thumbnailUrl: "",
  tagsText: "",
  imagesText: "",
};

export default function ContentManagementPage() {
  const [contents, setContents] = React.useState<ContentItem[]>([]);
  const [isListLoading, setIsListLoading] = React.useState(true);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingContent, setEditingContent] = React.useState<ContentItem | null>(null);

  const [slugLocked, setSlugLocked] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("");
  const [uploadedAssets, setUploadedAssets] = React.useState<UploadedAsset[]>([]);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [contentToDelete, setContentToDelete] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });
  const isSubmitting = form.formState.isSubmitting;

  const fetchContents = React.useCallback(async () => {
    try {
      setIsListLoading(true);
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (statusFilter) params.set("status", statusFilter);
      if (categoryFilter.trim()) params.set("category", categoryFilter.trim());
      const url = params.toString() ? `/api/admin/content?${params.toString()}` : `/api/admin/content`;
      const response = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } });
      if (!response.ok) throw new Error((await response.json()).error ?? "Failed to load content");
      const data = await response.json();
      setContents(data.data ?? []);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Unable to load content");
    } finally {
      setIsListLoading(false);
    }
  }, [searchQuery, statusFilter, categoryFilter]);

  React.useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "title" && !slugLocked && !editingContent) {
        const titleValue = value?.title ?? "";
        form.setValue("slug", titleValue ? slugify(titleValue) : "");
      }
    });
    return () => subscription.unsubscribe();
  }, [form, slugLocked, editingContent]);

  const showFeedback = React.useCallback((type: "success" | "error", message: string) => {
    if (type === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }
  }, []);

  const handleUploadButtonClick = React.useCallback(() => {
    if (isUploadingImage) return;
    fileInputRef.current?.click();
  }, [isUploadingImage]);

  const resetUploadInput = React.useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const registerUploadedAsset = React.useCallback((asset: UploadedAsset) => {
    setUploadedAssets((prev) => [asset, ...prev.filter((existing) => existing.url !== asset.url)]);
  }, []);

  const ensureThumbnailValue = React.useCallback(
    (asset: UploadedAsset) => {
      if (!form.getValues("thumbnailUrl")) {
        form.setValue("thumbnailUrl", asset.url, { shouldDirty: true, shouldValidate: true });
      }
    },
    [form],
  );

  const appendAssetToImages = React.useCallback(
    (asset: UploadedAsset) => {
      const current = form.getValues("imagesText")?.trim();
      const nextValue = current ? `${current}\n${asset.url}` : asset.url;
      form.setValue("imagesText", nextValue, { shouldDirty: true });
    },
    [form],
  );

  const handleUploadedAsset = React.useCallback(
    (asset: UploadedAsset) => {
      registerUploadedAsset(asset);
      ensureThumbnailValue(asset);
      appendAssetToImages(asset);
    },
    [appendAssetToImages, ensureThumbnailValue, registerUploadedAsset],
  );

  const normalizeUploadPayload = React.useCallback((payload: Record<string, unknown>): UploadedAsset => {
    const url = typeof payload.url === "string" ? payload.url : undefined;
    const absoluteUrl = typeof payload.absoluteUrl === "string" ? payload.absoluteUrl : undefined;
    const assetUrl = url ?? absoluteUrl;
    if (!assetUrl) {
      throw new Error("Upload response missing URL");
    }
    return {
      url: assetUrl,
      absoluteUrl: absoluteUrl ?? assetUrl,
      filename: typeof payload.filename === "string" ? payload.filename : (assetUrl.split("/").pop() ?? assetUrl),
      size: typeof payload.size === "number" ? payload.size : 0,
      uploadedAt: typeof payload.uploadedAt === "string" ? payload.uploadedAt : new Date().toISOString(),
    };
  }, []);

  const handleImageFileChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        resetUploadInput();
        return;
      }
      setIsUploadingImage(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/admin/uploads", { method: "POST", body: formData });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error ?? "Failed to upload image");
        }
        const asset = normalizeUploadPayload(payload);
        handleUploadedAsset(asset);
        showFeedback("success", "Image uploaded successfully");
      } catch (error) {
        console.error(error);
        showFeedback("error", error instanceof Error ? error.message : "Failed to upload image");
      } finally {
        setIsUploadingImage(false);
        resetUploadInput();
      }
    },
    [handleUploadedAsset, normalizeUploadPayload, resetUploadInput, showFeedback],
  );

  const handleEditorImageUploaded = React.useCallback(
    (asset: UploadedAsset) => {
      handleUploadedAsset(asset);
      showFeedback("success", "Image inserted into content");
    },
    [handleUploadedAsset, showFeedback],
  );

  const handleEditorImageUploadError = React.useCallback(
    (error: Error) => {
      showFeedback("error", error.message ?? "Failed to upload image");
    },
    [showFeedback],
  );

  const handleAdd = () => {
    setEditingContent(null);
    setSlugLocked(false);
    form.reset(defaultFormValues);
    setIsFormOpen(true);
  };

  const handleEdit = (content: ContentItem) => {
    setEditingContent(content);
    setSlugLocked(true);
    form.reset({
      title: content.title,
      slug: content.slug,
      description: content.description ?? "",
      category: content.category ?? "",
      content: content.content,
      status: content.status,
      publishedAt: content.publishedAt ? content.publishedAt.split("T")[0] : "",
      seoDescription: content.seoDescription ?? "",
      seoImageUrl: content.seoImageUrl ?? "",
      seoImageAlt: content.seoImageAlt ?? "",
      thumbnailUrl: content.thumbnailUrl ?? "",
      tagsText: (content.tags ?? []).join(", "),
      imagesText: formatImagesText(content.images ?? []),
    });
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setContentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!contentToDelete) return;

    try {
      const response = await fetch(`/api/admin/content?id=${contentToDelete}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error((await response.json()).error ?? "Failed to delete content");
      }
      showFeedback("success", "Content deleted successfully");
      fetchContents();
    } catch (error) {
      console.error(error);
      showFeedback("error", error instanceof Error ? error.message : "Unable to delete content");
    } finally {
      setDeleteDialogOpen(false);
      setContentToDelete(null);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = transformFormValues(values, editingContent?.id);
      const response = await fetch("/api/admin/content", {
        method: editingContent ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Failed to save content");
      }
      showFeedback("success", editingContent ? "Content updated successfully" : "Content created successfully");
      setIsFormOpen(false);
      setEditingContent(null);
      setSlugLocked(false);
      form.reset(defaultFormValues);
      fetchContents();
    } catch (error) {
      console.error(error);
      showFeedback("error", error instanceof Error ? error.message : "Unable to save content");
    }
  };

  const handleCancel = () => {
    setEditingContent(null);
    setIsFormOpen(false);
    setSlugLocked(false);
    form.reset(defaultFormValues);
  };

  const uniqueCategories = React.useMemo(() => {
    const categories = new Set<string>();
    contents.forEach((item) => {
      if (item.category) categories.add(item.category);
    });
    return Array.from(categories);
  }, [contents]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
          <p className="text-muted-foreground mt-2">Create, edit, and publish news pages</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            onChange={handleImageFileChange}
          />
          <Button variant="outline" onClick={fetchContents} disabled={isListLoading} className="gap-2">
            <RefreshCw className={cn("h-4 w-4", isListLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleUploadButtonClick}
            disabled={isUploadingImage}
            className="gap-2"
          >
            {isUploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            {isUploadingImage ? "Uploading..." : "Upload Image"}
          </Button>
          {!isFormOpen && (
            <Button variant="ulaw" className="gap-2" onClick={handleAdd}>
              <Plus className="h-4 w-4" />
              Add Content
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Find content quickly using search and filters</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-1">
            <label className="text-sm font-medium">Search</label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title, description, or body"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">All statuses</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">All categories</option>
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>{editingContent ? "Edit Content" : "Create Content"}</CardTitle>
            <CardDescription>
              {editingContent
                ? "Update the details below and save your changes."
                : "Fill out the details to publish a new page."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FieldSet>
                <FieldGroup>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Controller
                      control={form.control}
                      name="title"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="content-title">Title</FieldLabel>
                          <Input id="content-title" placeholder="Enter page title" disabled={isSubmitting} {...field} />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name="slug"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="content-slug">Slug</FieldLabel>
                          <Input
                            id="content-slug"
                            placeholder="my-awesome-article"
                            disabled={isSubmitting}
                            {...field}
                            onChange={(event) => {
                              setSlugLocked(true);
                              field.onChange(event.target.value);
                            }}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>

                  <Controller
                    control={form.control}
                    name="description"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="content-description">Description</FieldLabel>
                        <Input
                          id="content-description"
                          placeholder="Short summary for listings and SEO"
                          disabled={isSubmitting}
                          {...field}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="category"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="content-category">Category</FieldLabel>
                        <Input
                          id="content-category"
                          placeholder="e.g., News, Campus, Alumni"
                          disabled={isSubmitting}
                          {...field}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="content"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="content-body">Page Content</FieldLabel>
                        <div className="space-y-2">
                          <RichTextEditor
                            key={editingContent?.id || "new"}
                            id="content-body"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            placeholder="Write the main content, format text, or paste HTML"
                            enableImageUploads
                            generateSizes={true}
                            onImageUploaded={handleEditorImageUploaded}
                            onImageUploadError={handleEditorImageUploadError}
                          />
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                              Rich text output is stored as HTML and is sanitized on the server before persisting or
                              rendering.
                            </span>
                            <Button
                              type="button"
                              size="xs"
                              variant="ghost"
                              onClick={() => navigator.clipboard.writeText(field.value)}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy HTML
                            </Button>
                          </div>
                        </div>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <Controller
                      control={form.control}
                      name="status"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="content-status">Status</FieldLabel>
                          <select
                            id="content-status"
                            disabled={isSubmitting}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            {...field}
                          >
                            {statusOptions.map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name="publishedAt"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="content-published-at">Publish Date</FieldLabel>
                          <Input type="date" id="content-published-at" disabled={isSubmitting} {...field} />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>

                  <Controller
                    control={form.control}
                    name="seoDescription"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel htmlFor="content-seo-description">SEO Description</FieldLabel>
                        <Input
                          id="content-seo-description"
                          placeholder="155-character description for search engines"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </Field>
                    )}
                  />

                  <div className="flex flex-col gap-3 rounded-md border border-dashed p-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <ImagePlus className="h-4 w-4" />
                      Recent Uploads
                    </div>
                    {uploadedAssets.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Upload images to see quick actions here.</p>
                    ) : (
                      <div className="grid gap-3">
                        {uploadedAssets.slice(0, 5).map((asset) => (
                          <div key={asset.url} className="flex flex-col rounded border p-2 text-sm">
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate font-medium">{asset.filename}</span>
                              <span className="text-xs text-muted-foreground">
                                {(asset.size / 1024).toFixed(1)} KB • {new Date(asset.uploadedAt).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-2">
                              <Button
                                type="button"
                                size="xs"
                                variant="outline"
                                onClick={() => form.setValue("thumbnailUrl", asset.url, { shouldDirty: true })}
                              >
                                Set as Thumbnail
                              </Button>
                              <Button
                                type="button"
                                size="xs"
                                variant="outline"
                                onClick={() => appendAssetToImages(asset)}
                              >
                                Append to Images
                              </Button>
                              <Button
                                type="button"
                                size="xs"
                                variant="outline"
                                onClick={() => navigator.clipboard.writeText(asset.url)}
                              >
                                Copy URL
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Controller
                      control={form.control}
                      name="seoImageUrl"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="content-seo-image">Open Graph Image URL</FieldLabel>
                          <Input
                            id="content-seo-image"
                            placeholder="https://example.com/og-image.jpg"
                            disabled={isSubmitting}
                            {...field}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name="seoImageAlt"
                      render={({ field }) => (
                        <Field>
                          <FieldLabel htmlFor="content-seo-image-alt">Open Graph Image Alt Text</FieldLabel>
                          <Input
                            id="content-seo-image-alt"
                            placeholder="Describe the SEO image for accessibility"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </Field>
                      )}
                    />
                  </div>

                  <Controller
                    control={form.control}
                    name="thumbnailUrl"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="content-thumbnail">Thumbnail URL</FieldLabel>
                        <div className="flex gap-2">
                          <Input
                            id="content-thumbnail"
                            placeholder="https://example.com/thumb.jpg"
                            disabled={isSubmitting}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (uploadedAssets.length > 0) {
                                field.onChange(uploadedAssets[0].url);
                              }
                            }}
                          >
                            Use Last Upload
                          </Button>
                        </div>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="tagsText"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel htmlFor="content-tags">Tags</FieldLabel>
                        <Input
                          id="content-tags"
                          placeholder="Comma-separated tags (e.g., campus, alumni, news)"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="imagesText"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel htmlFor="content-images">Additional Images</FieldLabel>
                        <textarea
                          id="content-images"
                          rows={4}
                          placeholder='One image per line. Use "URL | alt text" format.'
                          disabled={isSubmitting}
                          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          {...field}
                        />
                      </Field>
                    )}
                  />

                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="ulaw" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : editingContent ? "Update Content" : "Create Content"}
                    </Button>
                  </div>
                </FieldGroup>
              </FieldSet>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Existing Content</CardTitle>
          <CardDescription>Manage and monitor all news entries</CardDescription>
        </CardHeader>
        <CardContent>
          {isListLoading ? (
            <div className="py-16 text-center text-muted-foreground">Loading content...</div>
          ) : contents.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              No content found. Try adjusting your filters or create a new entry.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {contents.map((content) => (
                <Card key={content.id} className="flex flex-col border shadow-sm transition-shadow hover:shadow-md">
                  <div className="p-5 pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold leading-tight">{content.title}</h3>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-1 text-xs font-semibold capitalize",
                          content.status === "published"
                            ? "bg-green-600/10 text-green-600 dark:text-green-400"
                            : content.status === "draft"
                              ? "bg-yellow-600/10 text-yellow-700 dark:text-yellow-400"
                              : "bg-slate-600/10 text-slate-600 dark:text-slate-300",
                        )}
                      >
                        {content.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {content.description ?? "No description provided"}
                    </p>
                  </div>
                  <CardContent className="flex flex-1 flex-col text-sm">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-[80px_1fr] gap-1">
                        <span className="text-muted-foreground">Slug</span>
                        <span className="truncate font-medium">{content.slug}</span>
                      </div>
                      <div className="grid grid-cols-[80px_1fr] gap-1">
                        <span className="text-muted-foreground">Category</span>
                        <span className="font-medium">{content.category || "—"}</span>
                      </div>
                      <div className="grid grid-cols-[80px_1fr] gap-1 items-start">
                        <span className="text-muted-foreground">Tags</span>
                        <div className="flex flex-wrap gap-1">
                          {content.tags && content.tags.length > 0 ? (
                            content.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground"
                              >
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="font-medium">—</span>
                          )}
                          {content.tags && content.tags.length > 3 && (
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                              +{content.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-[80px_1fr] gap-1">
                        <span className="text-muted-foreground">Updated</span>
                        <span className="font-medium">{formatDateDisplay(content.updatedAt)}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 border-t pt-4">
                      {content.status === "published" ? (
                        <Eye className="h-4 w-4 text-green-500" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-muted-foreground text-xs">
                        {content.status === "published" ? "Visible to visitors" : "Hidden from visitors"}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => handleEdit(content)}>
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteClick(content.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the content from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function transformFormValues(values: FormValues, id?: string) {
  const tags = values.tagsText
    ? values.tagsText
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
    : [];
  const images = values.imagesText && values.imagesText.trim().length ? parseImages(values.imagesText) : [];
  const payload: Record<string, unknown> = {
    title: values.title,
    slug: values.slug,
    description: values.description,
    category: values.category,
    content: values.content,
    status: values.status,
    publishedAt: values.publishedAt ? new Date(values.publishedAt).toISOString() : undefined,
    seoDescription: values.seoDescription || undefined,
    seoImageUrl: values.seoImageUrl || undefined,
    seoImageAlt: values.seoImageAlt || undefined,
    thumbnailUrl: values.thumbnailUrl || undefined,
    tags,
    images,
  };
  if (id) {
    payload.id = id;
  }
  return payload;
}

function parseImages(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const [url, alt] = line.split("|").map((part) => part.trim());
      return { url, alt: alt || undefined };
    });
}

function formatImagesText(images: Array<{ url: string; alt?: string | null }> = []) {
  if (!images.length) {
    return "";
  }
  return images.map((image) => (image.alt ? `${image.url} | ${image.alt}` : image.url)).join("\n");
}

function formatDateDisplay(value?: string | null) {
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
