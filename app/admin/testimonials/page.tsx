"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, Pencil, Plus, Search, Trash2, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
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
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Testimonial = {
  id: string;
  name: string;
  body: string;
  images: string[] | null;
  isPublished: boolean;
  isStatic: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

type TestimonialImage = {
  id: string;
  filename: string;
  url: string;
  originalName: string;
  size: number;
  mimeType: string;
  createdAt: string;
};

type UploadingFile = {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
  url?: string;
  error?: string;
};

const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  body: z.string().min(10, "Wish must be at least 10 characters").max(1000, "Wish is too long"),
  isPublished: z.boolean(),
  isStatic: z.boolean(),
  order: z.number().int().min(0, "Order must be 0 or greater"),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB for admin
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export default function TestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showForm, setShowForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = React.useState<string | null>(null);
  const [filterStatus, setFilterStatus] = React.useState<"all" | "published" | "pending">("all");

  // Image management state
  const [activeTab, setActiveTab] = React.useState<"testimonials" | "images">("testimonials");
  const [testimonialImages, setTestimonialImages] = React.useState<TestimonialImage[]>([]);
  const [imagesLoading, setImagesLoading] = React.useState(true);
  const [imageToDelete, setImageToDelete] = React.useState<string | null>(null);
  const [imageDeleteDialogOpen, setImageDeleteDialogOpen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: "",
      body: "",
      isPublished: false,
      isStatic: false,
      order: 0,
    },
  });

  const fetchTestimonials = React.useCallback(async () => {
    try {
      const response = await fetch("/api/admin/testimonials", {
        credentials: "include",
      });
      if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        router.push("/login?redirect=/admin/testimonials");
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchTestimonialImages = React.useCallback(async () => {
    try {
      const response = await fetch("/api/admin/testimonial-images", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setTestimonialImages(data.files || []);
      }
    } catch (error) {
      console.error("Error fetching testimonial images:", error);
    } finally {
      setImagesLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTestimonials();
    fetchTestimonialImages();
  }, [fetchTestimonials, fetchTestimonialImages]);

  const onSubmit = async (data: TestimonialFormData) => {
    setSubmitting(true);
    try {
      const url = "/api/admin/testimonials";
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...data } : data;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast.success(editingId ? "Testimonial updated successfully" : "Testimonial created successfully");
        form.reset();
        setShowForm(false);
        setEditingId(null);
        fetchTestimonials();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to save testimonial");
      }
    } catch (error) {
      console.error("Error saving testimonial:", error);
      toast.error("An error occurred while saving");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    form.reset({
      name: testimonial.name,
      body: testimonial.body,
      isPublished: testimonial.isPublished,
      isStatic: testimonial.isStatic,
      order: testimonial.order,
    });
    setShowForm(true);
  };

  const handleDeleteClick = (id: string) => {
    setTestimonialToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!testimonialToDelete) return;

    try {
      const response = await fetch(`/api/admin/testimonials?id=${testimonialToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Testimonial deleted successfully");
        fetchTestimonials();
      } else {
        toast.error("Failed to delete testimonial");
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("An error occurred while deleting");
    } finally {
      setDeleteDialogOpen(false);
      setTestimonialToDelete(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    form.reset();
  };

  const togglePublishStatus = async (testimonial: Testimonial) => {
    try {
      const response = await fetch("/api/admin/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: testimonial.id,
          isPublished: !testimonial.isPublished,
        }),
      });

      if (response.ok) {
        toast.success(testimonial.isPublished ? "Testimonial unpublished" : "Testimonial published");
        fetchTestimonials();
      } else {
        toast.error("Failed to update testimonial status");
      }
    } catch (error) {
      console.error("Error updating testimonial:", error);
      toast.error("An error occurred");
    }
  };

  const handleImageDeleteClick = (id: string) => {
    setImageToDelete(id);
    setImageDeleteDialogOpen(true);
  };

  const handleImageDeleteConfirm = async () => {
    if (!imageToDelete) return;

    try {
      const response = await fetch(`/api/admin/testimonial-images?id=${imageToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Image deleted successfully");
        fetchTestimonialImages();
      } else {
        toast.error("Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("An error occurred while deleting");
    } finally {
      setImageDeleteDialogOpen(false);
      setImageToDelete(null);
    }
  };

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Image URL copied to clipboard");
  };

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch =
      testimonial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testimonial.body.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "published" && testimonial.isPublished) ||
      (filterStatus === "pending" && !testimonial.isPublished);

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: testimonials.length,
    published: testimonials.filter((t) => t.isPublished).length,
    pending: testimonials.filter((t) => !t.isPublished).length,
    static: testimonials.filter((t) => t.isStatic).length,
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testimonials Management</h1>
          <p className="text-muted-foreground mt-2">Manage wishes, testimonials and uploaded images</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("testimonials")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px",
            activeTab === "testimonials"
              ? "border-ulaw-blue text-ulaw-blue"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          Testimonials
        </button>
        <button
          onClick={() => setActiveTab("images")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px",
            activeTab === "images"
              ? "border-ulaw-blue text-ulaw-blue"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          <span className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Image Management
          </span>
        </button>
      </div>

      {activeTab === "testimonials" && (
        <>
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">All testimonials</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.published}</div>
                <p className="text-xs text-muted-foreground">Visible to public</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Static</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.static}</div>
                <p className="text-xs text-muted-foreground">Original content</p>
              </CardContent>
            </Card>
          </div>

          {/* Add Testimonial Button */}
          <div className="flex justify-end">
            {!showForm && (
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Testimonial
              </Button>
            )}
          </div>

          {showForm && (
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? "Edit Testimonial" : "Add New Testimonial"}</CardTitle>
                <CardDescription>
                  {editingId ? "Update the testimonial details below." : "Fill in the form to add a new testimonial."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="name">Name</FieldLabel>
                      <Input id="name" placeholder="Enter name" {...form.register("name")} disabled={submitting} />
                      {form.formState.errors.name && <FieldError>{form.formState.errors.name.message}</FieldError>}
                    </Field>
                  </FieldGroup>

                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="body">Testimonial / Wish</FieldLabel>
                      <textarea
                        id="body"
                        placeholder="Enter the testimonial or wish"
                        rows={6}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
                        {...form.register("body")}
                        disabled={submitting}
                      />
                      {form.formState.errors.body && <FieldError>{form.formState.errors.body.message}</FieldError>}
                      <p className="text-xs text-muted-foreground mt-1">
                        {form.watch("body")?.length || 0}/1000 characters
                      </p>
                    </Field>
                  </FieldGroup>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="order">Display Order</FieldLabel>
                        <Input
                          id="order"
                          type="number"
                          min="0"
                          {...form.register("order", { valueAsNumber: true })}
                          disabled={submitting}
                        />
                        {form.formState.errors.order && <FieldError>{form.formState.errors.order.message}</FieldError>}
                      </Field>
                    </FieldGroup>

                    <FieldGroup>
                      <Field className="flex items-center space-x-2 pt-6">
                        <input
                          id="isPublished"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          {...form.register("isPublished")}
                          disabled={submitting}
                        />
                        <FieldLabel htmlFor="isPublished" className="!mt-0 cursor-pointer">
                          Published
                        </FieldLabel>
                      </Field>
                    </FieldGroup>

                    <FieldGroup>
                      <Field className="flex items-center space-x-2 pt-6">
                        <input
                          id="isStatic"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          {...form.register("isStatic")}
                          disabled={submitting}
                        />
                        <FieldLabel htmlFor="isStatic" className="!mt-0 cursor-pointer">
                          Static Content
                        </FieldLabel>
                      </Field>
                    </FieldGroup>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={submitting} className="gap-2">
                      {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                      {submitting ? "Saving..." : editingId ? "Update Testimonial" : "Add Testimonial"}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancel} disabled={submitting}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Testimonials List</CardTitle>
                <CardDescription>View and manage all testimonials</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="border-b pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search testimonials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === "all" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterStatus === "published" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("published")}
                  >
                    Published
                  </Button>
                  <Button
                    variant={filterStatus === "pending" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("pending")}
                  >
                    Pending
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredTestimonials.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery || filterStatus !== "all"
                    ? "No testimonials found matching your criteria."
                    : "No testimonials yet."}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTestimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className={cn(
                        "border rounded-lg p-4 space-y-3 transition-colors",
                        testimonial.isPublished ? "bg-background" : "bg-muted/50",
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                            <div className="flex gap-1">
                              {testimonial.isPublished && (
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                  Published
                                </span>
                              )}
                              {!testimonial.isPublished && (
                                <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                                  Pending
                                </span>
                              )}
                              {testimonial.isStatic && (
                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                                  Static
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{testimonial.body}</p>

                          {/* Show images if any */}
                          {testimonial.images && testimonial.images.length > 0 && (
                            <div className="flex gap-2 flex-wrap mt-2">
                              {testimonial.images.map((img, idx) => (
                                <div key={idx} className="relative w-16 h-16 rounded-md overflow-hidden border">
                                  <Image src={img} alt={`Image ${idx + 1}`} fill className="object-cover" />
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>Order: {testimonial.order}</span>
                            <span>Created: {new Date(testimonial.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => togglePublishStatus(testimonial)}
                            title={testimonial.isPublished ? "Unpublish" : "Publish"}
                          >
                            {testimonial.isPublished ? (
                              <X className="h-4 w-4 text-orange-600" />
                            ) : (
                              <Check className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(testimonial)} title="Edit">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(testimonial.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === "images" && (
        <>
          {/* Image Gallery */}
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Images</CardTitle>
              <CardDescription>
                All testimonial images. Click on URL to copy. Images are stored in /uploads/testimonials/
              </CardDescription>
            </CardHeader>
            <CardContent>
              {imagesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : testimonialImages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No images uploaded yet. Upload some images above.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {testimonialImages.map((image) => (
                    <div key={image.id} className="group relative border rounded-lg overflow-hidden bg-muted">
                      <div className="aspect-square relative">
                        <Image src={image.url} alt={image.originalName} fill className="object-cover" />
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => copyImageUrl(image.url)}
                          className="text-xs"
                        >
                          Copy URL
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleImageDeleteClick(image.id)}
                          className="text-xs"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                      <div className="p-2 border-t bg-background">
                        <p className="text-xs truncate font-medium">{image.originalName}</p>
                        <p className="text-xs text-muted-foreground">{(image.size / 1024 / 1024).toFixed(2)} MB</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(image.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Delete Testimonial Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the testimonial.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Image Dialog */}
      <AlertDialog open={imageDeleteDialogOpen} onOpenChange={setImageDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the image from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleImageDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
