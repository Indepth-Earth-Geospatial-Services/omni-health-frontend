"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  MapPin,
  Star,
  Loader2,
  AlertCircle,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMultipleFacilities } from "@/hooks/use-facilities";
import { useAuthStore } from "@/store/auth-store";
import { Facility } from "@/types/api-response";
import QueryProvider from "@/providers/query.provider";

interface FacilitySelectionModalProps {
  isOpen: boolean;
  facilityIds: string[];
  onSelect: (facilityId: string) => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 25, stiffness: 300 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 20 },
  },
};

function FacilitySelectCard({
  facility,
  onSelect,
}: {
  facility: Facility;
  onSelect: (id: string) => void;
}) {
  const rating = facility.average_rating ?? 0;

  return (
    <motion.button
      variants={cardVariants}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(facility.facility_id)}
      className="hover:border-primary/50 hover:bg-primary/5 flex w-full cursor-pointer flex-col rounded-xl border-2 border-slate-200 bg-white p-5 text-left transition-colors"
    >
      <h3 className="text-base font-semibold text-slate-900">
        {facility.facility_name}
      </h3>
      <span className="mt-1.5 inline-block w-fit rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
        {facility.facility_category}
      </span>

      <div className="mt-3 flex items-start gap-2 text-sm text-slate-500">
        <MapPin size={14} className="mt-0.5 shrink-0 text-slate-400" />
        <span className="line-clamp-1">
          {[facility.town, facility.facility_lga].filter(Boolean).join(", ")}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        <Star size={13} className="fill-amber-400 text-amber-400" />
        <span className="text-sm font-medium text-slate-600">
          {rating.toFixed(1)}
        </span>
        <span className="text-xs text-slate-400">
          ({facility.total_reviews ?? 0}{" "}
          {facility.total_reviews === 1 ? "review" : "reviews"})
        </span>
      </div>
    </motion.button>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border-2 border-slate-100 bg-slate-50 p-5">
      <div className="h-5 w-3/4 rounded bg-slate-200" />
      <div className="mt-2 h-4 w-1/3 rounded bg-slate-200" />
      <div className="mt-4 h-4 w-2/3 rounded bg-slate-200" />
      <div className="mt-3 h-4 w-1/4 rounded bg-slate-200" />
    </div>
  );
}

export default function FacilitySelectionModal(
  props: FacilitySelectionModalProps,
) {
  return (
    <QueryProvider>
      <FacilitySelectionModalInner {...props} />
    </QueryProvider>
  );
}

function FacilitySelectionModalInner({
  isOpen,
  facilityIds,
  onSelect,
}: FacilitySelectionModalProps) {
  const logout = useAuthStore((state) => state.logout);
  const facilityQueries = useMultipleFacilities(facilityIds);

  const isLoading = facilityQueries.some((q) => q.isLoading);
  const allFailed =
    facilityQueries.length > 0 && facilityQueries.every((q) => q.isError);
  const facilities = facilityQueries
    .map((q) => q.data?.facility)
    .filter((f): f is Facility => !!f);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="border-b border-slate-100 px-6 py-5 text-center">
              <div className="bg-primary/10 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                <Building2 size={24} className="text-primary" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Select a Facility
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose which facility you&apos;d like to manage
              </p>
            </div>

            {/* Body */}
            <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
              {isLoading ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {facilityIds.map((id) => (
                    <SkeletonCard key={id} />
                  ))}
                </div>
              ) : allFailed ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <AlertCircle size={40} className="mb-3 text-red-400" />
                  <p className="text-sm font-medium text-slate-700">
                    Failed to load facilities
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Please check your connection and try again
                  </p>
                  <Button
                    onClick={() => facilityQueries.forEach((q) => q.refetch())}
                    variant="outline"
                    size="sm"
                    className="mt-4"
                  >
                    <Loader2 size={14} className="mr-1.5" />
                    Retry
                  </Button>
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 gap-4 md:grid-cols-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {facilities.map((facility) => (
                    <FacilitySelectCard
                      key={facility.facility_id}
                      facility={facility}
                      onSelect={onSelect}
                    />
                  ))}
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 px-6 py-4 text-center">
              <p className="text-xs text-slate-400">
                You can switch facilities later from Settings
              </p>
              <button
                onClick={handleLogout}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-red-500"
              >
                <LogOut size={12} />
                Log out instead
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
