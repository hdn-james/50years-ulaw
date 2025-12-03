"use client";

import { useState, useEffect, useRef, useCallback, useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Heart, Loader2, Upload, X, ImagePlus } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee";
import { QuoteIcon } from "../svgs/quote";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Static testimonials (original data)
const staticTestimonials = [
  {
    body: '50 năm truyền thống, 30 năm phát triển! Chúc mừng Trường Đại học Luật TP.HCM tiếp tục vững bước trên chặng đường vẻ vang, phát huy tối đa giá trị cốt lõi: "Đoàn kết - Năng động - Sáng tạo - Trách nhiệm".',
    isStatic: true,
  },
  {
    body: "Trân trọng và biết ơn những thế hệ thầy cô, cán bộ đã dày công vun đắp nên một HCMULAW uy tín, chất lượng như ngày hôm nay. Chúc Trường mãi là cái nôi đào tạo nhân lực pháp luật hàng đầu đất nước.",
    isStatic: true,
  },
  {
    body: "Chúc Trường Đại học Luật TP.HCM luôn giữ vững và phát huy tinh thần tiên phong trong nghiên cứu và giảng dạy luật học, đóng góp tích cực vào sự nghiệp xây dựng Nhà nước pháp quyền.",
    isStatic: true,
  },
  {
    body: "Hành trình nửa thế kỷ là minh chứng hùng hồn cho sự kiên trì, nỗ lực không ngừng nghỉ. Chúc Trường tiếp tục là điểm tựa vững chắc cho khát vọng cống hiến của các thế hệ sinh viên.",
    isStatic: true,
  },
  {
    body: "Mừng Trường vững vàng trong truyền thống, mạnh mẽ trong đổi mới. Chúc HCMULAW tiếp tục là niềm tự hào của hàng vạn cựu sinh viên.",
    isStatic: true,
  },
  {
    body: "Chúc Trường ngày càng phát triển vượt bậc, đạt được nhiều thành tựu hơn nữa trong hội nhập quốc tế, khẳng định vị thế là một trung tâm đào tạo và nghiên cứu luật ngang tầm khu vực.",
    isStatic: true,
  },
  {
    body: "Giảng đường tri thức – Khởi nguồn công lý. Chúc các thầy cô luôn dồi dào sức khỏe, nhiệt huyết để tiếp tục là người truyền lửa, chắp cánh cho những luật sư, thẩm phán, kiểm sát viên tương lai.",
    isStatic: true,
  },
  {
    body: "Chúc HCMULAW sẽ tiếp tục là môi trường học tập năng động, sáng tạo, nơi ươm mầm những tài năng pháp lý có tâm, có tầm cho đất nước.",
    isStatic: true,
  },
  {
    body: "Kính chúc tập thể cán bộ, giảng viên Trường Đại học Luật TP.HCM luôn đoàn kết, đạt nhiều thắng lợi mới trong công cuộc đổi mới giáo dục đại học.",
    isStatic: true,
  },
  {
    body: "Chúc các công trình nghiên cứu khoa học của Trường sẽ ngày càng ứng dụng sâu rộng vào thực tiễn đời sống và công tác lập pháp.",
    isStatic: true,
  },
  {
    body: "Xin gửi lời tri ân sâu sắc đến Trường, nơi đã trang bị kiến thức và đạo đức nghề nghiệp cho bao thế hệ. Chúc Trường bách niên trường tồn!",
    isStatic: true,
  },
  {
    body: "Cựu sinh viên mãi hướng về Trường! Chúc mối liên kết giữa Trường và các thế hệ học viên ngày càng chặt chẽ, cùng nhau xây dựng thương hiệu HCMULAW rực rỡ hơn nữa.",
    isStatic: true,
  },
  {
    body: "Chúc các em sinh viên đang học tại Trường tiếp tục nỗ lực, gặt hái thành công và trở thành những công dân ưu tú mang tinh thần Luật TP.HCM.",
    isStatic: true,
  },
  {
    body: "Chúc Trường Đại học Luật TP.HCM sẽ là ngọn hải đăng dẫn lối cho thế hệ trẻ yêu mến và muốn dấn thân vào con đường pháp luật.",
    isStatic: true,
  },
  {
    body: "50 năm tỏa sáng, 30 năm định danh. Chúc Trường không ngừng vươn lên, đóng góp xứng đáng vào sự nghiệp cải cách tư pháp và phát triển đất nước.",
    isStatic: true,
  },
];

const wishSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên của bạn").max(100, "Tên quá dài"),
  body: z.string().min(10, "Lời chúc phải có ít nhất 10 ký tự").max(1000, "Lời chúc không được quá 1000 ký tự"),
});

type WishFormData = z.infer<typeof wishSchema>;

type UploadingFile = {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
  url?: string;
  error?: string;
};

type Testimonial = {
  body: string;
  name?: string;
  images?: string[];
  isStatic?: boolean;
};

const MAX_FILES = 5;
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

function TestimonialCard({ body, name }: Testimonial) {
  return (
    <div className="w-96 py-4 px-6 bg-white rounded-2xl shadow">
      <div>
        <QuoteIcon className="size-14 text-ulaw-blue" />
        <blockquote className="mt-4 text-secondary-foreground text-justify">{body}</blockquote>
        {name && <p className="mt-3 text-sm font-medium text-ulaw-blue text-right">— {name}</p>}
      </div>
    </div>
  );
}

function ImageUploadProgress({ file, onRemove }: { file: UploadingFile; onRemove: () => void }) {
  return (
    <div className="relative border rounded-lg p-3 bg-muted/30">
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted shrink-0">
          {file.status === "completed" && file.url ? (
            <Image src={file.url} alt={file.file.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImagePlus className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.file.name}</p>
          <p className="text-xs text-muted-foreground">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
          {file.status === "uploading" && (
            <div className="mt-1 w-full bg-muted rounded-full h-2">
              <div
                className="bg-ulaw-blue h-2 rounded-full transition-all duration-300"
                style={{ width: `${file.progress}%` }}
              />
            </div>
          )}
          {file.status === "error" && <p className="text-xs text-destructive mt-1">{file.error || "Lỗi tải lên"}</p>}
          {file.status === "completed" && <p className="text-xs text-green-600 mt-1">Tải lên thành công</p>}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 hover:bg-muted rounded-full transition-colors"
          disabled={file.status === "uploading"}
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

function WishDialog() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ensure component only renders on client to avoid hydration mismatch with Radix IDs
  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<WishFormData>({
    resolver: zodResolver(wishSchema),
    defaultValues: {
      name: "",
      body: "",
    },
  });

  const uploadFile = useCallback(async (uploadingFile: UploadingFile) => {
    const formData = new FormData();
    formData.append("file", uploadingFile.file);

    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadingFiles((prev) => prev.map((f) => (f.id === uploadingFile.id ? { ...f, progress } : f)));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            setUploadingFiles((prev) =>
              prev.map((f) =>
                f.id === uploadingFile.id ? { ...f, status: "completed", progress: 100, url: response.url } : f,
              ),
            );
            resolve(response.url);
          } catch {
            setUploadingFiles((prev) =>
              prev.map((f) =>
                f.id === uploadingFile.id ? { ...f, status: "error", error: "Lỗi phân tích phản hồi" } : f,
              ),
            );
            reject(new Error("Parse error"));
          }
        } else {
          let errorMessage = "Lỗi tải lên";
          try {
            const response = JSON.parse(xhr.responseText);
            errorMessage = response.error || errorMessage;
          } catch {}
          setUploadingFiles((prev) =>
            prev.map((f) => (f.id === uploadingFile.id ? { ...f, status: "error", error: errorMessage } : f)),
          );
          reject(new Error(errorMessage));
        }
      });

      xhr.addEventListener("error", () => {
        setUploadingFiles((prev) =>
          prev.map((f) => (f.id === uploadingFile.id ? { ...f, status: "error", error: "Lỗi kết nối" } : f)),
        );
        reject(new Error("Network error"));
      });

      xhr.open("POST", "/api/testimonials/upload");
      xhr.send(formData);
    });
  }, []);

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const currentCount = uploadingFiles.length;
      const remainingSlots = MAX_FILES - currentCount;

      if (remainingSlots <= 0) {
        toast.error(`Chỉ được tải lên tối đa ${MAX_FILES} hình ảnh`);
        return;
      }

      const filesToUpload = Array.from(files).slice(0, remainingSlots);
      const invalidFiles: string[] = [];
      const validFiles: File[] = [];

      for (const file of filesToUpload) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          invalidFiles.push(`${file.name}: Loại file không hỗ trợ`);
          continue;
        }
        if (file.size > MAX_FILE_SIZE) {
          invalidFiles.push(`${file.name}: Vượt quá 20MB`);
          continue;
        }
        validFiles.push(file);
      }

      if (invalidFiles.length > 0) {
        toast.error(invalidFiles.join("\n"));
      }

      if (validFiles.length === 0) return;

      // Create uploading file entries
      const newUploadingFiles: UploadingFile[] = validFiles.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        progress: 0,
        status: "uploading" as const,
      }));

      setUploadingFiles((prev) => [...prev, ...newUploadingFiles]);

      // Upload files
      for (const uploadingFile of newUploadingFiles) {
        try {
          await uploadFile(uploadingFile);
        } catch (error) {
          console.error("Upload error:", error);
        }
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [uploadingFiles.length, uploadFile],
  );

  const removeFile = useCallback((id: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const onSubmit = async (data: WishFormData) => {
    // Check if any files are still uploading
    const stillUploading = uploadingFiles.some((f) => f.status === "uploading");
    if (stillUploading) {
      toast.error("Vui lòng đợi tất cả hình ảnh tải lên xong");
      return;
    }

    setSubmitting(true);
    try {
      // Collect successfully uploaded image URLs
      const imageUrls = uploadingFiles.filter((f) => f.status === "completed" && f.url).map((f) => f.url as string);

      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          images: imageUrls,
        }),
      });

      if (response.ok) {
        toast.success("Cảm ơn bạn đã gửi lời chúc! Lời chúc sẽ được xét duyệt và hiển thị sớm.");
        form.reset();
        setUploadingFiles([]);
        setOpen(false);
      } else {
        const error = await response.json();
        toast.error(error.error || "Không thể gửi lời chúc. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error submitting wish:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  const isAnyUploading = uploadingFiles.some((f) => f.status === "uploading");

  // Render a placeholder button during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button
        size="lg"
        className="bg-ulaw-blue hover:bg-ulaw-blue/90 text-white gap-2 shadow-lg hover:shadow-xl transition-all"
      >
        <Heart className="h-5 w-5" />
        Gửi lời chúc của bạn
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-ulaw-blue hover:bg-ulaw-blue/90 text-white gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <Heart className="h-5 w-5" />
          Gửi lời chúc của bạn
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-ulaw-blue">Gửi lời chúc đến Trường ĐH Luật TP.HCM</DialogTitle>
          <DialogDescription>
            Chia sẻ lời chúc và kỷ niệm của bạn nhân dịp kỷ niệm 50 năm thành lập Trường. Lời chúc của bạn sẽ được xét
            duyệt trước khi hiển thị.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Tên của bạn</FieldLabel>
              <Input id="name" placeholder="Nguyễn Văn A" {...form.register("name")} disabled={submitting} />
              {form.formState.errors.name && <FieldError>{form.formState.errors.name.message}</FieldError>}
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="body">Lời chúc</FieldLabel>
              <textarea
                id="body"
                placeholder="Nhập lời chúc của bạn dành cho Trường..."
                rows={6}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
                {...form.register("body")}
                disabled={submitting}
              />
              {form.formState.errors.body && <FieldError>{form.formState.errors.body.message}</FieldError>}
              <p className="text-xs text-muted-foreground mt-1">{form.watch("body")?.length || 0}/1000 ký tự</p>
            </Field>
          </FieldGroup>

          {/* Image Upload Section */}
          <FieldGroup>
            <Field>
              <FieldLabel>Hình ảnh kỷ niệm (tùy chọn)</FieldLabel>
              <p className="text-xs text-muted-foreground mb-2">
                Tải lên tối đa {MAX_FILES} hình ảnh (PNG, JPEG, WebP, GIF - tối đa 20MB mỗi file)
              </p>

              {/* Upload Button */}
              <div className="space-y-3">
                {uploadingFiles.length < MAX_FILES && (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={ALLOWED_TYPES.join(",")}
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      disabled={submitting || isAnyUploading}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={submitting || isAnyUploading}
                      className={cn(
                        "w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center gap-2 transition-colors",
                        "hover:border-ulaw-blue hover:bg-ulaw-blue/5",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                      )}
                    >
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Nhấn để chọn hoặc kéo thả hình ảnh</span>
                      <span className="text-xs text-muted-foreground">
                        Còn lại {MAX_FILES - uploadingFiles.length} vị trí
                      </span>
                    </button>
                  </div>
                )}

                {/* Uploading Files List */}
                {uploadingFiles.length > 0 && (
                  <div className="space-y-2">
                    {uploadingFiles.map((file) => (
                      <ImageUploadProgress key={file.id} file={file} onRemove={() => removeFile(file.id)} />
                    ))}
                  </div>
                )}
              </div>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={submitting || isAnyUploading} className="gap-2">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Đang gửi..." : "Gửi lời chúc"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const ITEMS_PER_LINE = 15;

// Helper function to split array into chunks
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

export function Testimonials() {
  const [dynamicTestimonials, setDynamicTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/api/testimonials");
        if (response.ok) {
          const data = await response.json();
          // Filter out static ones and add name
          const newTestimonials = data
            .filter((t: any) => !t.isStatic)
            .map((t: any) => ({
              body: t.body,
              name: t.name,
              images: t.images || [],
              isStatic: false,
            }));
          setDynamicTestimonials(newTestimonials);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Split dynamic testimonials into chunks of 15 for multiple lines
  const dynamicChunks = chunkArray(dynamicTestimonials, ITEMS_PER_LINE);

  return (
    <section id="loi-chuc">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-bold text-2xl text-ulaw-blue leading-normal tracking-wide sm:text-4xl lg:text-5xl">
              Lời chúc và chia sẻ kỷ niệm về Trường ĐH Luật TP.HCM
            </h2>
            <p className="text-muted-foreground my-2">Gửi lời chúc mừng nhân dịp kỷ niệm 50 năm thành lập Trường</p>
            <WishDialog />
          </div>
        </div>
      </div>
      <div className="relative flex w-full flex-col items-center justify-center gap-0 overflow-hidden py-8">
        {/* First line: Static testimonials only */}
        <Marquee pauseOnHover repeat={3} className="[--duration:120s]">
          {staticTestimonials.map((review, index) => (
            <TestimonialCard key={`static-${index}`} {...review} />
          ))}
        </Marquee>

        {/* Dynamic lines: 15 items per line, alternating direction */}
        {dynamicChunks.map((chunk, lineIndex) => {
          // Calculate repeat count to ensure full screen coverage
          // More repeats for fewer items to fill the screen
          const repeatCount = Math.max(3, Math.ceil(15 / chunk.length) * 3);
          const totalItems = chunk.length * repeatCount;
          return (
            <Marquee
              key={`dynamic-line-${lineIndex}`}
              pauseOnHover
              reverse={lineIndex % 2 === 0}
              repeat={repeatCount}
              style={{ "--duration": `${120 / (chunk.length * 3)}s` } as React.CSSProperties}
            >
              {chunk.map((review, index) => (
                <TestimonialCard key={`dynamic-${lineIndex}-${index}`} {...review} />
              ))}
            </Marquee>
          );
        })}
      </div>
    </section>
  );
}
