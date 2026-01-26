import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  RefreshCcw,
  Map as MapIcon,
  List,
  Navigation,
} from "lucide-react";

interface ExploreFacilitiesErrorProps {
  onRetry?: () => void;
  onFindNearby?: string; // URL for "Near Me" logic
  allFacilitiesLink?: string; // URL for "View All"
}

export function ExploreFacilitiesError({
  onRetry,
  onFindNearby,
  allFacilitiesLink = "/facilities", // Default route
}: ExploreFacilitiesErrorProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50/50 p-6 text-center dark:bg-slate-900/50">
      {/* 1. Visual Icon Layering */}
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
          <MapIcon className="h-10 w-10 text-slate-300 dark:text-slate-600" />
        </div>
        <div className="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-100 ring-4 ring-slate-50 dark:bg-red-900/30 dark:ring-slate-900">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-500" />
        </div>
      </div>

      {/* 2. Clear Messaging */}
      <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        Unable to load map data
      </h3>
      <p className="mt-2 max-w-xs text-sm text-slate-500 dark:text-slate-400">
        We couldn't fetch the facilities. You can try refreshing or explore
        other views.
      </p>

      {/* 3. Action Group */}
      <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
        {/* Primary: Retry */}
        <Button
          onClick={onRetry}
          className="hover:text-primary w-full gap-2 border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-50 px-2 text-slate-400 dark:bg-slate-900">
              Or explore
            </span>
          </div>
        </div>

        {/* Secondary: Navigation Options */}
        <div className="grid grid-cols-2 gap-3">
          {/* Find Near Me */}
          <Button
            asChild
            variant="outline"
            className="hover:border-primary hover:text-primary hover:bg-primary/5 gap-2 border-dashed border-slate-300 dark:border-slate-700"
          >
            <Link href={onFindNearby}>
              <Navigation className="h-4 w-4" />
              Near Me
            </Link>
          </Button>

          {/* View All List */}
          <Button
            asChild
            variant="outline"
            className="hover:border-primary hover:text-primary hover:bg-primary/5 gap-2 border-dashed border-slate-300 dark:border-slate-700"
          >
            <Link href={allFacilitiesLink}>
              <List className="h-4 w-4" />
              List View
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
