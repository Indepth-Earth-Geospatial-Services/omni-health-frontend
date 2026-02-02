import React from "react";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { ExportFormat } from "@/features/super-admin/components/types/types";

interface ExportDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onExport?: (format: ExportFormat) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({
  isOpen,
  onToggle,
  onExport,
  dropdownRef,
}) => {
  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
      >
        <Download size={16} />
        Export
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg ring-1 ring-black/5">
          <div className="border-b border-slate-200 px-4 py-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Export Format
            </h3>
          </div>
          <div className="py-1">
            <button
              onClick={() => {
                onExport?.("CSV");
                onToggle();
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50"
            >
              <FileText size={16} className="text-blue-500" />
              CSV
            </button>
            <button
              onClick={() => {
                onExport?.("EXCEL");
                onToggle();
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50"
            >
              <FileSpreadsheet size={16} className="text-green-600" />
              Excel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
