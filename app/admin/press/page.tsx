"use client";

import { Calendar, ExternalLink, ImageIcon, Newspaper, Plus, Search, Trash2 } from "lucide-react";
import * as React from "react";
import { z } from "zod";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type PressItem = {
  id: string;
  title: string;
  dateReleased: string;
  description: string;
  thumbnailUrl: string | null;
  link: string | null;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
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
];

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  dateReleased: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Description is required"),
  thumbnailUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  link: z.string().url("Invalid URL").optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
});

type FormValues = z.infer<typeof formSchema>;

const defaultFormValues: FormValues = {
  title: "",
  dateReleased: "",
  description: "",
  thumbnailUrl: "",
  link: "",
  status: "draft",
};

export default function PressManagementPage() {
  const [pressItems, setPressItems] = React.useState<PressItem[]>([]);
  const [isListLoading, setIsListLoading] = React.useState(true);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingPress, setEditingPress] = React.useState<PressItem | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [pressToDelete, setPressToDelete] = React.useState<string | null>(null);

  const [formValues, setFormValues] = React.useState<FormValues>(defaultFormValues);
  const [formErrors, setFormErrors] = React.useState<Partial<Record<keyof FormValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    fetchPressItems();
  }, [searchQuery, statusFilter]);

  const fetchPressItems = React.useCallback(async () => {
    try {
      setIsListLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const url = `/api/admin/press${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (data.success) {
        setPressItems(data.data || []);
      } else {
        showFeedback("error", data.error || "Failed to fetch press items");
      }
    } catch (error) {
      showFeedback("error", "An error occurred while fetching press items");
    } finally {
      setIsListLoading(false);
    }
  }, [searchQuery, statusFilter]);

  const showFeedback = (type: "success" | "error", message: string) => {
    if (type === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const resetUploadInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const normalizeUploadPayload = (payload: any): UploadedAsset => {
    const url = payload?.url || payload?.path || "";
    const absoluteUrl = payload?.absoluteUrl || payload?.url || payload?.path || "";
    const assetUrl = absoluteUrl.startsWith("http") ? absoluteUrl : url;

    return {
      url: assetUrl,
      absoluteUrl: assetUrl,
      filename: payload?.filename || "uploaded-file",
      size: payload?.size || 0,
      uploadedAt: payload?.uploadedAt || new Date().toISOString(),
    };
  };

  const compressImage = async (file: File): Promise<File> => {
    // Skip compression for SVG files
    if (file.type === "image/svg+xml") {
      return file;
    }

    // Skip compression if file is already small (< 2MB)
    const twoMB = 2 * 1024 * 1024;
    if (file.size < twoMB) {
      return file;
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Maximum dimensions for press thumbnails (Full HD)
          const maxWidth = 1920;
          const maxHeight = 1080;

          // Calculate new dimensions if image is too large
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(file);
            return;
          }

          // Draw image with smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob with quality setting
          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Create new File object with same name
                const compressedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            "image/jpeg",
            0.85, // 85% quality
          );
        };

        img.onerror = () => {
          resolve(file);
        };

        img.src = e.target?.result as string;
      };

      reader.onerror = () => {
        resolve(file);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      resetUploadInput();
      return;
    }

    console.time("press-upload");
    console.log(`[Press Upload] Starting upload: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);

    setIsUploadingImage(true);
    try {
      // Compress image if needed
      let fileToUpload = file;
      if (file.size > 2 * 1024 * 1024) {
        setUploadProgress(`Compressing ${(file.size / (1024 * 1024)).toFixed(1)}MB image...`);
        console.log("[Press Upload] Compressing image...");
        fileToUpload = await compressImage(file);
        const savedSpace = file.size - fileToUpload.size;
        const savedPercent = Math.round((savedSpace / file.size) * 100);
        console.log(
          `[Press Upload] Compressed: ${(file.size / (1024 * 1024)).toFixed(1)}MB → ${(fileToUpload.size / (1024 * 1024)).toFixed(1)}MB (${savedPercent}% reduction)`,
        );
      }

      setUploadProgress("Uploading...");

      const formData = new FormData();
      formData.append("file", fileToUpload);

      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to upload image");
      }

      console.timeEnd("press-upload");
      console.log(`[Press Upload] Success: ${payload.url}`);

      const asset = normalizeUploadPayload(payload);
      setFormValues((prev) => ({ ...prev, thumbnailUrl: asset.url }));
      setUploadProgress("");
      showFeedback("success", "Image uploaded successfully");
    } catch (error) {
      console.timeEnd("press-upload");
      console.error("[Press Upload] Error:", error);
      setUploadProgress("");
      showFeedback("error", error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
      resetUploadInput();
    }
  };

  const handleAdd = () => {
    setEditingPress(null);
    setFormValues(defaultFormValues);
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleEdit = (press: PressItem) => {
    setEditingPress(press);
    const dateValue = press.dateReleased ? new Date(press.dateReleased).toISOString().slice(0, 16) : "";
    setFormValues({
      title: press.title,
      dateReleased: dateValue,
      description: press.description,
      thumbnailUrl: press.thumbnailUrl || "",
      link: press.link || "",
      status: press.status,
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setPressToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!pressToDelete) return;

    try {
      const response = await fetch(`/api/admin/press?id=${pressToDelete}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        showFeedback("success", "Press item deleted successfully");
        fetchPressItems();
      } else {
        showFeedback("error", result.error || "Failed to delete press item");
      }
    } catch (error) {
      showFeedback("error", "An error occurred while deleting the press item");
    } finally {
      setDeleteDialogOpen(false);
      setPressToDelete(null);
    }
  };

  const validateForm = (): boolean => {
    try {
      formSchema.parse(formValues);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof FormValues, string>> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as keyof FormValues] = err.message;
          }
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const onSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        ...formValues,
        ...(editingPress && { id: editingPress.id }),
        dateReleased: new Date(formValues.dateReleased).toISOString(),
        thumbnailUrl: formValues.thumbnailUrl || undefined,
      };

      const response = await fetch("/api/admin/press", {
        method: editingPress ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (result.success) {
        showFeedback("success", editingPress ? "Press item updated successfully" : "Press item created successfully");
        setIsFormOpen(false);
        fetchPressItems();
      } else {
        showFeedback("error", result.error || "Failed to save press item");
      }
    } catch (error) {
      showFeedback("error", "An error occurred while saving the press item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingPress(null);
    setFormValues(defaultFormValues);
    setFormErrors({});
  };

  const formatDateDisplay = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Press About Us</h1>
          <p className="text-muted-foreground mt-2">Manage press releases and media coverage</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Press Item
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search press items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Press Items List */}
      <Card>
        <CardHeader>
          <CardTitle>Press Items ({pressItems.length})</CardTitle>
          <CardDescription>All press releases and media coverage</CardDescription>
        </CardHeader>
        <CardContent>
          {isListLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Loading press items...</div>
            </div>
          ) : pressItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Newspaper className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No press items found</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first press item</p>
              <Button onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Add Press Item
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {pressItems.map((press) => (
                <div
                  key={press.id}
                  className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  {press.thumbnailUrl && (
                    <div className="w-full md:w-32 h-32 flex-shrink-0">
                      <img src={press.thumbnailUrl} alt={press.title} className="w-full h-full object-cover rounded" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold mb-1 truncate">{press.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDateDisplay(press.dateReleased)}</span>
                          <span className="mx-2">•</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              press.status === "published"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : press.status === "draft"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {press.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{press.description}</p>
                        {press.link && (
                          <a
                            href={press.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View press page
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(press)}>
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteClick(press.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPress ? "Edit Press Item" : "Add Press Item"}</DialogTitle>
            <DialogDescription>
              {editingPress ? "Update the press item details below" : "Fill in the details for the new press item"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formValues.title}
                onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                placeholder="Enter press item title"
              />
              {formErrors.title && <p className="text-sm text-red-500">{formErrors.title}</p>}
            </div>

            {/* Date Released */}
            <div className="space-y-2">
              <Label htmlFor="dateReleased">
                Date Released <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dateReleased"
                type="datetime-local"
                value={formValues.dateReleased}
                onChange={(e) => setFormValues({ ...formValues, dateReleased: e.target.value })}
              />
              {formErrors.dateReleased && <p className="text-sm text-red-500">{formErrors.dateReleased}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formValues.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormValues({ ...formValues, description: e.target.value })
                }
                placeholder="Enter press item description"
                rows={4}
              />
              {formErrors.description && <p className="text-sm text-red-500">{formErrors.description}</p>}
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">Thumbnail Image</Label>
              <div className="flex gap-2">
                <Input
                  id="thumbnailUrl"
                  value={formValues.thumbnailUrl}
                  onChange={(e) => setFormValues({ ...formValues, thumbnailUrl: e.target.value })}
                  placeholder="Enter image URL or upload"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageFileChange}
                />
                <Button type="button" variant="outline" onClick={handleUploadButtonClick} disabled={isUploadingImage}>
                  {isUploadingImage ? (
                    <>
                      <div className="h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      {uploadProgress || "Uploading..."}
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
              {formErrors.thumbnailUrl && <p className="text-sm text-red-500">{formErrors.thumbnailUrl}</p>}
              {formValues.thumbnailUrl && (
                <div className="mt-2">
                  <img
                    src={formValues.thumbnailUrl}
                    alt="Thumbnail preview"
                    className="w-32 h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>

            {/* Link */}
            <div className="space-y-2">
              <Label htmlFor="link">Link to Press Page</Label>
              <Input
                id="link"
                type="url"
                value={formValues.link}
                onChange={(e) => setFormValues({ ...formValues, link: e.target.value })}
                placeholder="https://example.com/press-release"
              />
              {formErrors.link && <p className="text-sm text-red-500">{formErrors.link}</p>}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formValues.status}
                onValueChange={(value: any) => setFormValues({ ...formValues, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.status && <p className="text-sm text-red-500">{formErrors.status}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editingPress ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the press item from the database.
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
