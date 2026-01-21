import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export function ExploreFacilitiesLoader() {
  return (
    <div className="relative h-full w-full bg-slate-50/50 dark:bg-slate-900/50">
      <div className="absolute top-4 left-1/2 z-10 flex w-11/12 -translate-x-1/2 flex-wrap justify-center gap-4 rounded-lg bg-white/90 p-4 shadow-lg backdrop-blur-sm md:w-auto">
        <Skeleton className="h-10 w-full rounded-lg md:w-[200px]" />
        <Skeleton className="h-10 w-full rounded-lg md:w-[200px]" />
      </div>

      <div className="relative h-full w-full">
        <Skeleton className="h-full w-full" />
        <div className="text-muted-foreground absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-3 rounded-xl border bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:bg-black/80">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <p className="text-sm font-medium">Loading map data...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
