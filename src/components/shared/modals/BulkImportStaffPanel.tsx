"use client";

import React, { useCallback, useRef, useState } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/features/admin/components/ui/button";
import { cn } from "@/lib/utils";
import { useBulkImportStaff } from "@/features/admin/hooks/useAdminStaff";

const ACCEPTED_EXTENSIONS = [".xlsx", ".xls", ".csv"];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface BulkImportStaffPanelProps {
  /** Facility the uploaded staff sheet is imported into. */
  facilityId: string;
  /** Rendered above the dropzone — used by super admin to pick a facility first. */
  facilitySelector?: React.ReactNode;
  /** Disables the dropzone, e.g. until a facility has been selected. */
  disabled?: boolean;
  /** Message shown in place of the dropzone while disabled. */
  disabledMessage?: string;
  /** Called after a successful import so the caller can close the modal/refresh. */
  onSuccess?: () => void;
}

const BulkImportStaffPanel: React.FC<BulkImportStaffPanelProps> = ({
  facilityId,
  facilitySelector,
  disabled = false,
  disabledMessage = "Select a facility to continue",
  onSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const bulkImportMutation = useBulkImportStaff(facilityId);

  const handleFileSelected = useCallback((selected: File | undefined) => {
    if (!selected) return;
    const extension = selected.name
      .slice(selected.name.lastIndexOf("."))
      .toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      toast.error("Unsupported file type", {
        description: "Please upload an .xlsx, .xls, or .csv file.",
      });
      return;
    }
    setFile(selected);
  }, []);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    handleFileSelected(e.dataTransfer.files?.[0]);
  };

  const handleUpload = () => {
    if (!file) return;
    bulkImportMutation.mutate(file, {
      onSuccess: () => {
        toast.success("Staff imported successfully!");
        setFile(null);
        onSuccess?.();
      },
      onError: (error: unknown) => {
        const err = error as { message?: string };
        toast.error("Bulk import failed", {
          description: err?.message || "Please check the file and try again.",
        });
      },
    });
  };

  const isUploading = bulkImportMutation.isPending;

  return (
    <div className="space-y-4">
      {facilitySelector}

      {disabled ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center">
          <UploadCloud className="h-8 w-8 text-slate-300" />
          <p className="text-sm text-slate-500">{disabledMessage}</p>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-10 text-center transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-slate-200 bg-slate-50 hover:border-slate-300",
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS.join(",")}
            className="hidden"
            onChange={(e) => handleFileSelected(e.target.files?.[0])}
          />
          <UploadCloud className="text-primary h-8 w-8" />
          <p className="text-sm font-medium text-slate-700">
            Drag and drop a file here, or click to browse
          </p>
          <p className="text-xs text-slate-400">
            Supports {ACCEPTED_EXTENSIONS.join(", ")}
          </p>
        </div>
      )}

      {file && (
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <FileSpreadsheet className="text-primary h-5 w-5 shrink-0" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-700">
                {file.name}
              </p>
              <p className="text-xs text-slate-400">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFile(null)}
            disabled={isUploading}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {bulkImportMutation.isError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p className="text-xs text-red-600">
            {(bulkImportMutation.error as { message?: string })?.message ||
              "Import failed. Please check the file and try again."}
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleUpload}
          disabled={!file || disabled || isUploading}
          className="gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Importing...
            </>
          ) : (
            "Import Staff"
          )}
        </Button>
      </div>
    </div>
  );
};

export default BulkImportStaffPanel;
