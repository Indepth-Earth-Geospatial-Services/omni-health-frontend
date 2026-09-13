// components/StaffPagination.tsx
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface StaffPaginationProps {
  page: number;
  totalPages: number;
  totalRecords: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  /** Background refetch in progress (page change, filter/search settling) —
   *  shown as a small spinner next to the page count rather than blanking
   *  the table, and disables paging until it resolves. */
  isFetching?: boolean;
}

export const StaffPagination = ({
  page,
  totalPages,
  totalRecords,
  onPrevPage,
  onNextPage,
  isFetching = false,
}: StaffPaginationProps) => {
  return (
    <div className="mt-auto flex flex-col items-center justify-between gap-4 border-t border-slate-100 p-4 md:flex-row">
      <button
        onClick={onPrevPage}
        disabled={page <= 1 || isFetching}
        className={`flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition-colors ${
          page <= 1 || isFetching
            ? "cursor-not-allowed bg-slate-50 text-slate-400"
            : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        <ChevronLeft size={16} /> Previous
      </button>
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-slate-500">
            Page {page} of {totalPages}
          </p>
          {isFetching && (
            <Loader2 className="text-primary h-3.5 w-3.5 animate-spin" />
          )}
        </div>
        <p className="text-xs text-slate-400">{totalRecords} total records</p>
      </div>
      <button
        onClick={onNextPage}
        disabled={page >= totalPages || isFetching}
        className={`flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition-colors ${
          page >= totalPages || isFetching
            ? "cursor-not-allowed bg-slate-50 text-slate-400"
            : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
};
