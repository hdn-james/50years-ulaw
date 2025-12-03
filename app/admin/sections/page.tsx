"use client";

import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, Eye, EyeOff, Loader2, Save, RotateCcw } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionOrder {
  id: string;
  sectionId: string;
  name: string;
  order: number;
  isVisible: boolean;
}

export default function SectionsPage() {
  const [sections, setSections] = React.useState<SectionOrder[]>([]);
  const [originalSections, setOriginalSections] = React.useState<SectionOrder[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [draggedId, setDraggedId] = React.useState<string | null>(null);
  const [dragOverId, setDragOverId] = React.useState<string | null>(null);

  const fetchSections = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/sections", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setSections(data);
        setOriginalSections(data);
      }
    } catch (error) {
      console.error("Failed to fetch sections:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, sectionId: string) => {
    setDraggedId(sectionId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", sectionId);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, sectionId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (sectionId !== draggedId && sectionId !== dragOverId) {
      setDragOverId(sectionId);

      // Reorder immediately on drag over for smooth preview
      if (draggedId) {
        const draggedIndex = sections.findIndex((s) => s.sectionId === draggedId);
        const targetIndex = sections.findIndex((s) => s.sectionId === sectionId);

        if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
          const newSections = [...sections];
          const [draggedItem] = newSections.splice(draggedIndex, 1);
          newSections.splice(targetIndex, 0, draggedItem);
          setSections(newSections);
        }
      }
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggedId(null);
    setDragOverId(null);
  };

  const toggleVisibility = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.sectionId === sectionId ? { ...section, isVisible: !section.isVisible } : section,
      ),
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updates = sections.map((section, index) => ({
        sectionId: section.sectionId,
        order: index,
        isVisible: section.isVisible,
      }));

      const response = await fetch("/api/admin/sections", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const data = await response.json();
        setSections(data);
        setOriginalSections(data);
        toast.success("Section order saved successfully");
      } else {
        const error = await response.json().catch(() => ({ error: "Failed to save sections" }));
        toast.error(error.error || "Failed to save sections");
      }
    } catch (error) {
      console.error("Failed to save sections:", error);
      toast.error("Failed to save sections. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSections([...originalSections]);
  };

  const hasChanges = React.useMemo(() => {
    if (sections.length !== originalSections.length) return true;
    return sections.some((section, index) => {
      const original = originalSections[index];
      if (!original) return true;
      return section.sectionId !== original.sectionId || section.isVisible !== original.isVisible;
    });
  }, [sections, originalSections]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Section Order</h1>
          <p className="text-muted-foreground mt-2">Manage the order and visibility of sections on the homepage</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Section Order</h1>
          <p className="text-muted-foreground mt-2">
            Drag and drop to reorder sections. Toggle visibility to show/hide sections.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges || saving}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How to use</CardTitle>
          <CardDescription>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Drag sections using the handle on the left to reorder them</li>
              <li>Click the eye icon to toggle section visibility</li>
              <li>Hidden sections will not appear on the homepage</li>
              <li>Click &quot;Save Changes&quot; to apply your changes</li>
            </ul>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Sections List */}
      <Card>
        <CardHeader>
          <CardTitle>Homepage Sections</CardTitle>
          <CardDescription>
            {sections.filter((s) => s.isVisible).length} of {sections.length} sections visible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {sections.map((section, index) => (
                <motion.div
                  key={section.sectionId}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: draggedId === section.sectionId ? 0.5 : 1,
                    scale: draggedId === section.sectionId ? 1.02 : 1,
                    boxShadow: draggedId === section.sectionId ? "0 8px 20px rgba(0,0,0,0.15)" : "0 0 0 rgba(0,0,0,0)",
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    layout: { type: "spring", stiffness: 500, damping: 40 },
                    opacity: { duration: 0.15 },
                    scale: { duration: 0.15 },
                  }}
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(e as unknown as React.DragEvent<HTMLDivElement>, section.sectionId)
                  }
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e as unknown as React.DragEvent<HTMLDivElement>, section.sectionId)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e as unknown as React.DragEvent<HTMLDivElement>)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border bg-card",
                    "hover:border-primary/50 hover:shadow-sm",
                    "cursor-grab active:cursor-grabbing",
                    dragOverId === section.sectionId &&
                      draggedId !== section.sectionId &&
                      "border-primary border-2 bg-primary/5",
                    !section.isVisible && "opacity-60 bg-muted/50",
                  )}
                >
                  {/* Drag Handle */}
                  <div className="flex-shrink-0 text-muted-foreground hover:text-foreground">
                    <GripVertical className="h-5 w-5" />
                  </div>

                  {/* Order Number */}
                  <motion.div
                    layout="position"
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium"
                  >
                    {index + 1}
                  </motion.div>

                  {/* Section Name */}
                  <div className="flex-1 min-w-0">
                    <p className={cn("font-medium truncate", !section.isVisible && "text-muted-foreground")}>
                      {section.name}
                    </p>
                    <p className="text-xs text-muted-foreground">ID: {section.sectionId}</p>
                  </div>

                  {/* Visibility Toggle */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVisibility(section.sectionId);
                    }}
                    className={cn(
                      "flex-shrink-0",
                      section.isVisible
                        ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {section.isVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Change Indicator */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg text-sm font-medium"
          >
            You have unsaved changes
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
