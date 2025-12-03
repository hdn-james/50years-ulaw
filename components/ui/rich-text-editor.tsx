"use client";

import { Loader2 } from "lucide-react";
import type QuillType from "quill";
import * as React from "react";

import { cn } from "@/lib/utils";

export type RichTextEditorUploadedAsset = {
  url: string;
  absoluteUrl: string;
  filename: string;
  size: number;
  uploadedAt: string;
  sizes?: {
    thumbnail?: { url: string; width: number; height: number };
    small?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    large?: { url: string; width: number; height: number };
  };
  dimensions?: {
    width: number;
    height: number;
  };
};

type BaseDivProps = Omit<React.ComponentPropsWithoutRef<"div">, "children">;

type RichTextEditorProps = BaseDivProps & {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  editable?: boolean;
  enableImageUploads?: boolean;
  uploadEndpoint?: string;
  uploadInputAccept?: string;
  generateSizes?: boolean;
  onImageUploaded?: (asset: RichTextEditorUploadedAsset) => void;
  onImageUploadError?: (error: Error) => void;
};

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ size: ["small", false, "large", "huge"] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],
  [{ align: [] }],
  ["blockquote", "code-block"],
  ["link", "image", "video"],
  ["clean"],
];

export function RichTextEditor({
  id,
  label,
  value,
  onChange,
  placeholder,
  className,
  wrapperClassName,
  labelClassName,
  editable = true,
  enableImageUploads = false,
  uploadEndpoint = "/api/admin/uploads",
  uploadInputAccept = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml",
  generateSizes = false,
  onImageUploaded,
  onImageUploadError,
  onFocus: externalOnFocus,
  onBlur: externalOnBlur,
  ...divProps
}: RichTextEditorProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const quillRef = React.useRef<QuillType | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const isUploadingRef = React.useRef(false);
  const isInternalChangeRef = React.useRef(false);
  const isAddingAttributesRef = React.useRef(false);

  const [isEditorReady, setIsEditorReady] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<string>("");

  // Debug: Log when component mounts/unmounts and value changes
  React.useEffect(() => {
    console.log("[RichTextEditor] Component mounted, initial value length:", value?.length || 0);
    return () => {
      console.log("[RichTextEditor] Component unmounting");
    };
  }, []);

  React.useEffect(() => {
    console.log("[RichTextEditor] Value prop changed, length:", value?.length || 0, "isEditorReady:", isEditorReady);
  }, [value, isEditorReady]);

  const compressImage = React.useCallback(async (file: File): Promise<File> => {
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

          // Maximum dimensions for upload (4K resolution)
          const maxWidth = 3840;
          const maxHeight = 2160;

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
  }, []);

  const handleImageUpload = React.useCallback(
    async (file: File) => {
      if (!enableImageUploads || isUploadingRef.current) return;

      const quill = quillRef.current;
      if (!quill) return;

      isUploadingRef.current = true;
      setIsUploading(true);
      setUploadProgress("Preparing image...");

      try {
        // Compress image if it's large
        let fileToUpload = file;
        if (file.size > 2 * 1024 * 1024) {
          setUploadProgress(`Compressing ${(file.size / (1024 * 1024)).toFixed(1)}MB image...`);
          fileToUpload = await compressImage(file);
          const savedSpace = file.size - fileToUpload.size;
          const savedPercent = Math.round((savedSpace / file.size) * 100);
          console.log(
            `Image compressed: ${(file.size / (1024 * 1024)).toFixed(1)}MB → ${(fileToUpload.size / (1024 * 1024)).toFixed(1)}MB (${savedPercent}% reduction)`,
          );
        }

        setUploadProgress("Uploading image...");

        const formData = new FormData();
        formData.append("file", fileToUpload);
        if (generateSizes) {
          formData.append("generateSizes", "true");
        }

        const response = await fetch(uploadEndpoint, {
          method: "POST",
          body: formData,
        });

        setUploadProgress("Processing image...");

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error ?? "Failed to upload image");
        }

        const url = typeof payload.url === "string" ? payload.url : payload.absoluteUrl;
        const absoluteUrl = typeof payload.absoluteUrl === "string" ? payload.absoluteUrl : url;
        const finalUrl = url ?? absoluteUrl;

        if (!finalUrl) {
          throw new Error("Upload response missing URL");
        }

        const asset: RichTextEditorUploadedAsset = {
          url: finalUrl,
          absoluteUrl: absoluteUrl ?? finalUrl,
          filename:
            typeof payload.filename === "string"
              ? payload.filename
              : (finalUrl.split("/").pop() ?? `uploaded-${Date.now()}`),
          size: typeof payload.size === "number" ? payload.size : 0,
          uploadedAt: typeof payload.uploadedAt === "string" ? payload.uploadedAt : new Date().toISOString(),
          sizes: payload.sizes,
          dimensions: payload.dimensions,
        };

        const range = quill.getSelection(true);
        const insertIndex = range ? range.index : quill.getLength();

        // Insert the image first with just the URL
        quill.insertEmbed(insertIndex, "image", asset.url, "user");
        quill.setSelection(insertIndex + 1, 0, "user");

        // Then add all attributes to the image element
        window.requestAnimationFrame(() => {
          const images = quill.root.querySelectorAll("img");
          let targetImage: HTMLImageElement | null = null;

          // Find the image we just inserted
          for (let i = images.length - 1; i >= 0; i--) {
            const img = images[i] as HTMLImageElement;
            if (img.src.includes(asset.url.split("/").pop() || "")) {
              targetImage = img;
              break;
            }
          }

          if (targetImage) {
            // Add alt text
            const altText = asset.filename
              .replace(/\.[^/.]+$/, "")
              .replace(/[-_]+/g, " ")
              .trim();
            targetImage.setAttribute("alt", altText || "Uploaded image");

            // Add dimensions if available
            if (asset.dimensions) {
              targetImage.setAttribute("width", asset.dimensions.width.toString());
              targetImage.setAttribute("height", asset.dimensions.height.toString());
            }

            // Add srcset for responsive images if sizes are available
            if (asset.sizes) {
              const srcsetParts: string[] = [];

              if (asset.sizes.small) {
                srcsetParts.push(`${asset.sizes.small.url} ${asset.sizes.small.width}w`);
              }
              if (asset.sizes.medium) {
                srcsetParts.push(`${asset.sizes.medium.url} ${asset.sizes.medium.width}w`);
              }
              if (asset.sizes.large) {
                srcsetParts.push(`${asset.sizes.large.url} ${asset.sizes.large.width}w`);
              }

              // Add original size if dimensions are available
              if (asset.dimensions?.width) {
                srcsetParts.push(`${asset.url} ${asset.dimensions.width}w`);
              }

              if (srcsetParts.length > 0) {
                targetImage.setAttribute("srcset", srcsetParts.join(", "));
                targetImage.setAttribute("sizes", "(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px");
              }
            }

            // Add lazy loading
            targetImage.setAttribute("loading", "lazy");

            // Trigger onChange to save the updated HTML with all attributes
            const updatedHtml = quill.root.innerHTML;
            onChange(updatedHtml);
          }
        });

        setUploadProgress("Upload complete!");
        setTimeout(() => {
          setUploadProgress("");
        }, 2000);

        onImageUploaded?.(asset);
      } catch (error) {
        console.error(error);
        const normalizedError = error instanceof Error ? error : new Error("Failed to upload image");
        setUploadProgress("Upload failed!");
        setTimeout(() => {
          setUploadProgress("");
        }, 3000);
        onImageUploadError?.(normalizedError);
      } finally {
        isUploadingRef.current = false;
        setIsUploading(false);
      }
    },
    [enableImageUploads, uploadEndpoint, generateSizes, onImageUploaded, onImageUploadError, compressImage],
  );

  const imageHandler = React.useCallback(() => {
    if (!enableImageUploads) {
      const quill = quillRef.current;
      if (!quill) return;

      const url = prompt("Enter image URL:");
      if (url) {
        const range = quill.getSelection(true);
        quill.insertEmbed(range ? range.index : quill.getLength(), "image", url, "user");
      }
      return;
    }

    fileInputRef.current?.click();
  }, [enableImageUploads]);

  const handleFileInputChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;

      await handleImageUpload(file);
    },
    [handleImageUpload],
  );

  // Initialize Quill once
  React.useEffect(() => {
    if (!containerRef.current || quillRef.current) return;

    let mounted = true;

    async function initQuill() {
      try {
        const { default: QuillClass } = await import("quill");
        if (!mounted || !containerRef.current) return;

        // Configure Quill to preserve image attributes
        const ImageBlot = QuillClass.import("formats/image") as any;
        ImageBlot.sanitize = (url: string) => url;
        ImageBlot.tagName = "IMG";
        ImageBlot.blotName = "image";
        ImageBlot.className = undefined;

        // Add custom attributes to preserve
        const ATTRIBUTES = ["alt", "height", "width", "srcset", "sizes", "loading"];
        ImageBlot.ATTRIBUTES = ATTRIBUTES;

        // Override the formats method to include all attributes
        ImageBlot.formats = function (domNode: HTMLImageElement) {
          return ATTRIBUTES.reduce((formats: any, attribute) => {
            if (domNode.hasAttribute(attribute)) {
              formats[attribute] = domNode.getAttribute(attribute);
            }
            return formats;
          }, {});
        };

        // Override the create method to set all attributes
        const originalCreate = ImageBlot.create;
        ImageBlot.create = function (value: any) {
          const node = originalCreate.call(this, value);
          if (typeof value === "object") {
            Object.keys(value).forEach((key) => {
              if (ATTRIBUTES.includes(key)) {
                node.setAttribute(key, value[key]);
              }
            });
          }
          return node;
        };

        // Re-register the modified ImageBlot
        QuillClass.register(ImageBlot, true);

        const quillInstance = new QuillClass(containerRef.current, {
          theme: "snow",
          readOnly: !editable,
          placeholder: placeholder || "Start typing...",
          modules: {
            toolbar: {
              container: TOOLBAR_OPTIONS,
              handlers: {
                image: imageHandler,
              },
            },
          },
        });

        quillRef.current = quillInstance;

        // Listen to text changes
        quillInstance.on("text-change", (delta, oldDelta, source) => {
          if (source === "user" && !isInternalChangeRef.current) {
            const html = quillInstance.root.innerHTML;
            onChange(html);
          }
        });

        // Listen to selection changes
        quillInstance.on("selection-change", (range) => {
          setIsFocused(Boolean(range));
        });

        setIsEditorReady(true);
      } catch (error) {
        console.error("Failed to initialize Quill editor:", error);
      }
    }

    void initQuill();

    return () => {
      mounted = false;
      const quill = quillRef.current;
      if (quill) {
        quill.off("text-change");
        quill.off("selection-change");
        quillRef.current = null;
      }
    };
  }, []); // Only run once on mount

  // Update imageHandler reference when it changes
  React.useEffect(() => {
    const quill = quillRef.current;
    if (!quill || !isEditorReady) return;

    const toolbar = quill.getModule("toolbar") as any;
    if (toolbar) {
      toolbar.addHandler("image", imageHandler);
    }
  }, [imageHandler, isEditorReady]);

  // Update editor when readOnly changes
  React.useEffect(() => {
    const quill = quillRef.current;
    if (!quill || !isEditorReady) return;
    quill.enable(editable);
  }, [editable, isEditorReady]);

  // Update placeholder when it changes
  React.useEffect(() => {
    const quill = quillRef.current;
    if (!quill || !isEditorReady) return;
    quill.root.setAttribute("data-placeholder", placeholder ?? "");
  }, [placeholder, isEditorReady]);

  // Sync value to editor whenever it changes and editor is ready
  React.useEffect(() => {
    const quill = quillRef.current;
    if (!quill || !isEditorReady || isAddingAttributesRef.current) {
      return;
    }

    // Get current content
    const currentHtml = quill.root.innerHTML;
    const normalizedCurrent = normalizeHtml(currentHtml);
    const normalizedIncoming = normalizeHtml(value ?? "");

    // Check if both are empty
    const isCurrentEmpty = normalizedCurrent === "" || currentHtml === "<p><br></p>";
    const isIncomingEmpty = normalizedIncoming === "";

    // If both empty, no need to update
    if (isCurrentEmpty && isIncomingEmpty) return;

    // If content is different, update it
    if (normalizedCurrent !== normalizedIncoming) {
      isInternalChangeRef.current = true;

      if (value) {
        // Set innerHTML directly to preserve all HTML attributes
        quill.root.innerHTML = value;
      } else {
        quill.setText("", "silent");
      }

      // Reset cursor to start
      setTimeout(() => {
        if (quill && quillRef.current) {
          quill.setSelection(0, 0, "silent");
        }
        isInternalChangeRef.current = false;
      }, 0);
    }
  }, [value, isEditorReady]);

  const handleFocusCapture = React.useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      externalOnFocus?.(event);
    },
    [externalOnFocus],
  );

  const handleBlurCapture = React.useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      const nextTarget = event.relatedTarget as Node | null;
      if (nextTarget && event.currentTarget.contains(nextTarget)) {
        return;
      }
      externalOnBlur?.(event);
    },
    [externalOnBlur],
  );

  return (
    <div className={cn("flex flex-col gap-2", wrapperClassName)}>
      {label ? (
        <label htmlFor={id} className={cn("text-sm font-medium leading-none text-foreground", labelClassName)}>
          {label}
        </label>
      ) : null}

      {enableImageUploads && (
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={uploadInputAccept}
          onChange={handleFileInputChange}
        />
      )}

      <div
        id={id}
        role="textbox"
        aria-multiline="true"
        aria-disabled={!editable}
        aria-busy={!isEditorReady}
        className={cn(
          "relative rounded-md border border-input bg-background shadow-sm transition focus-within:ring-2 focus-within:ring-ring",
          isFocused && "ring-2 ring-ring",
          className,
        )}
        onFocusCapture={handleFocusCapture}
        onBlurCapture={handleBlurCapture}
        {...divProps}
      >
        <div ref={containerRef} className="min-h-[400px]" />

        {!isEditorReady ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading editor...
            </div>
          </div>
        ) : null}

        {isUploading ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm z-50">
            <div className="flex flex-col items-center gap-3 rounded-lg bg-card p-6 shadow-lg border">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="text-sm font-medium text-foreground">{uploadProgress}</div>
              <div className="text-xs text-muted-foreground">Please wait...</div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function normalizeHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/\s+/g, " ")
    .replace(/<p>\s*<br>\s*<\/p>/gi, "")
    .replace(/<p><\/p>/gi, "")
    .trim();
}
