"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, Plus, Search, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import { cn } from "@/lib/utils";

type Sponsor = {
  id: string;
  name: string;
  logoUrl: string;
  alt: string;
  order: number;
  isActive: boolean;
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

const sponsorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logoUrl: z.string().min(1, "Logo URL is required"),
  alt: z.string().min(1, "Alt text is required"),
  order: z.number().int().min(0, "Order must be 0 or greater"),
  isActive: z.boolean(),
});

type SponsorFormData = z.infer<typeof sponsorSchema>;

export default function SponsorsPage() {
  const router = useRouter();
  const [sponsors, setSponsors] = React.useState<Sponsor[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showForm, setShowForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [uploadedAssets, setUploadedAssets] = React.useState<UploadedAsset[]>([]);
  const [showAssetPicker, setShowAssetPicker] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [sponsorToDelete, setSponsorToDelete] = React.useState<string | null>(null);

  const form = useForm<SponsorFormData>({
    resolver: zodResolver(sponsorSchema),
    defaultValues: {
      name: "",
      logoUrl: "",
      alt: "",
      order: 0,
      isActive: true,
    },
  });

  const fetchSponsors = React.useCallback(async () => {
    try {
      const response = await fetch("/api/admin/sponsors", {
        credentials: "include",
      });
      if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        router.push("/login?redirect=/admin/sponsors");
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setSponsors(data);
      }
    } catch (error) {
      console.error("Error fetching sponsors:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchUploadedAssets = React.useCallback(async () => {
    try {
      const response = await fetch("/api/admin/uploads", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUploadedAssets(data.files || []);
      }
    } catch (error) {
      console.error("Error fetching uploaded assets:", error);
    }
  }, []);

  React.useEffect(() => {
    fetchSponsors();
    fetchUploadedAssets();
  }, [fetchSponsors, fetchUploadedAssets]);

  const handleUploadFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadedAssets((prev) => [data, ...prev]);
        form.setValue("logoUrl", data.url);
        setShowAssetPicker(false);
      } else {
        toast.error("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: SponsorFormData) => {
    setSubmitting(true);
    try {
      const url = "/api/admin/sponsors";
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? JSON.stringify({ ...data, id: editingId }) : JSON.stringify(data);

      console.log("Submitting sponsor:", body);

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body,
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        await fetchSponsors();
        form.reset();
        setShowForm(false);
        setEditingId(null);
        toast.success("Sponsor saved successfully!");
      } else {
        const error = await response.json();
        console.error("Error response:", error);
        toast.error(`Failed to save sponsor: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving sponsor:", error);
      toast.error(`Error saving sponsor: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (sponsor: Sponsor) => {
    setEditingId(sponsor.id);
    form.reset({
      name: sponsor.name,
      logoUrl: sponsor.logoUrl,
      alt: sponsor.alt,
      order: sponsor.order,
      isActive: sponsor.isActive,
    });
    setShowForm(true);
  };

  const handleDeleteClick = (id: string) => {
    setSponsorToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!sponsorToDelete) return;

    try {
      const response = await fetch(`/api/admin/sponsors?id=${sponsorToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await fetchSponsors();
        toast.success("Sponsor deleted successfully!");
      } else {
        toast.error("Failed to delete sponsor");
      }
    } catch (error) {
      console.error("Error deleting sponsor:", error);
      toast.error("Error deleting sponsor");
    } finally {
      setDeleteDialogOpen(false);
      setSponsorToDelete(null);
    }
  };

  const handleCancel = () => {
    form.reset();
    setShowForm(false);
    setEditingId(null);
  };

  const filteredSponsors = sponsors.filter((sponsor) => sponsor.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sponsors Management</h1>
          <p className="text-muted-foreground mt-2">Manage sponsor logos and information</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Sponsor
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Sponsor" : "Add New Sponsor"}</CardTitle>
            <CardDescription>{editingId ? "Update sponsor information" : "Create a new sponsor entry"}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldSet>
                <FieldGroup>
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="name">Sponsor Name</FieldLabel>
                        <Input {...field} id="name" placeholder="Enter sponsor name" disabled={submitting} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="logoUrl"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="logoUrl">Logo URL</FieldLabel>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input {...field} id="logoUrl" placeholder="/uploads/logo.png" disabled={submitting} />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowAssetPicker(!showAssetPicker)}
                              disabled={submitting}
                            >
                              <ImagePlus className="h-4 w-4" />
                            </Button>
                          </div>

                          {field.value && (
                            <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-gray-50">
                              <Image src={field.value} alt="Preview" fill className="object-contain p-2" />
                            </div>
                          )}

                          {showAssetPicker && (
                            <div className="border rounded-lg p-4 space-y-4">
                              <div className="flex items-center gap-2">
                                <label htmlFor="file-upload" className="cursor-pointer">
                                  <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                                    <Upload className="h-4 w-4" />
                                    {uploading ? "Uploading..." : "Upload New"}
                                  </div>
                                  <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    disabled={uploading}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleUploadFile(file);
                                    }}
                                  />
                                </label>
                              </div>

                              <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                                {uploadedAssets.map((asset) => (
                                  <button
                                    key={asset.url}
                                    type="button"
                                    onClick={() => {
                                      form.setValue("logoUrl", asset.url);
                                      setShowAssetPicker(false);
                                    }}
                                    className="relative aspect-square border rounded-lg overflow-hidden hover:ring-2 ring-primary"
                                  >
                                    <Image src={asset.url} alt={asset.filename} fill className="object-cover" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="alt"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="alt">Alt Text</FieldLabel>
                        <Input
                          {...field}
                          id="alt"
                          placeholder="Logo description for accessibility"
                          disabled={submitting}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="order"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="order">Display Order</FieldLabel>
                        <Input
                          {...field}
                          id="order"
                          type="number"
                          min="0"
                          placeholder="0"
                          disabled={submitting}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="isActive"
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="isActive"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={submitting}
                            className="h-4 w-4"
                          />
                          <FieldLabel htmlFor="isActive" className="!mt-0">
                            Active (Display on public page)
                          </FieldLabel>
                        </div>
                      </Field>
                    )}
                  />

                  <div className="flex gap-2">
                    <Button type="submit" disabled={submitting}>
                      {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editingId ? "Update" : "Create"} Sponsor
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancel} disabled={submitting}>
                      Cancel
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
          <div>
            <CardTitle>All Sponsors</CardTitle>
            <CardDescription>View and manage all sponsor entries</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="border-b pb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sponsors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredSponsors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No sponsors found matching your search" : "No sponsors yet. Add your first sponsor!"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSponsors.map((sponsor) => (
                <Card key={sponsor.id} className={cn(!sponsor.isActive && "opacity-50")}>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="relative w-full h-32 border rounded-lg overflow-hidden bg-gray-50">
                        <Image src={sponsor.logoUrl} alt={sponsor.alt} fill className="object-contain p-2" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{sponsor.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">Order: {sponsor.order}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              sponsor.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700",
                            )}
                          >
                            {sponsor.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(sponsor)} className="flex-1">
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(sponsor.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
              This action cannot be undone. This will permanently delete the sponsor from the database.
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
