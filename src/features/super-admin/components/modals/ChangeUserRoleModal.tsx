"use client";
import { useState, useEffect } from "react";
import { X, ChevronDown, ArrowRight, Building2, Loader2 } from "lucide-react";
import { User } from "../../services/super-admin.service";
import { Button } from "@/features/admin/components/ui/button";
import { apiClient } from "@/lib/client";

interface Facility {
  facility_id: string;
  facility_name: string;
}

interface ChangeUserRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSubmit: (userId: number, facilityId: string) => void;
  isLoading?: boolean;
}

const ChangeUserRoleModal: React.FC<ChangeUserRoleModalProps> = ({
  isOpen,
  onClose,
  user,
  onSubmit,
  isLoading = false,
}) => {
  const [selectedFacilityId, setSelectedFacilityId] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);

  // Fetch facilities when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchFacilities();
    }
  }, [isOpen]);

  const fetchFacilities = async () => {
    setLoadingFacilities(true);
    try {
      const response = await apiClient.get("/facilities", {
        params: { limit: 100 },
      });
      setFacilities(response.data.facilities || response.data || []);
    } catch (error) {
      console.error("Failed to fetch facilities:", error);
      setFacilities([]);
    } finally {
      setLoadingFacilities(false);
    }
  };

  if (!isOpen || !user) return null;

  const handleSubmit = () => {
    if (!selectedFacilityId) {
      return;
    }

    // Convert user_id to number as required by API
    const userId = typeof user.user_id === "string"
      ? parseInt(user.user_id, 10)
      : user.user_id;

    onSubmit(userId as number, selectedFacilityId);
  };

  const handleClose = () => {
    setSelectedFacilityId("");
    setIsDropdownOpen(false);
    onClose();
  };

  // Get selected facility name
  const selectedFacility = facilities.find(
    (f) => f.facility_id === selectedFacilityId
  );

  // Get user's currently managed facilities
  const managedFacilityIds = user.managed_facilities?.map((f) => f.facility_id) || [];

  // Filter out facilities user already manages
  const availableFacilities = facilities.filter(
    (f) => !managedFacilityIds.includes(f.facility_id)
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Assign User to Facility
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Info */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
              {user.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {user.full_name}
              </p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>

          {/* Current Role */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Current Role
            </label>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              {user.role.replace("_", " ").toUpperCase()}
            </div>
          </div>

          {/* Currently Managed Facilities */}
          {user.managed_facilities && user.managed_facilities.length > 0 && (
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Currently Managing
              </label>
              <div className="flex flex-wrap gap-2">
                {user.managed_facilities.map((facility) => (
                  <span
                    key={facility.facility_id}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                  >
                    <Building2 size={12} />
                    {facility.facility_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Facility Selection Dropdown */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Assign to Facility <span className="text-red-500">*</span>
            </label>
            <p className="mb-2 text-xs text-slate-500">
              This will promote the user to Admin for the selected facility
            </p>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={loadingFacilities}
                className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 transition-colors hover:border-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="flex items-center gap-2">
                  {loadingFacilities ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Loading facilities...
                    </>
                  ) : selectedFacility ? (
                    <>
                      <Building2 size={16} className="text-primary" />
                      <span className="text-slate-800">{selectedFacility.facility_name}</span>
                    </>
                  ) : (
                    <span className="text-slate-400">Select a facility</span>
                  )}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && !loadingFacilities && (
                <div className="absolute top-full z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                  {availableFacilities.length === 0 ? (
                    <div className="px-4 py-3 text-center text-sm text-slate-500">
                      No facilities available
                    </div>
                  ) : (
                    availableFacilities.map((facility) => (
                      <button
                        key={facility.facility_id}
                        onClick={() => {
                          setSelectedFacilityId(facility.facility_id);
                          setIsDropdownOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 px-4 py-3 text-left text-sm transition-colors hover:bg-slate-50 ${
                          selectedFacilityId === facility.facility_id
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-slate-700"
                        }`}
                      >
                        <Building2 size={16} className="shrink-0 text-slate-400" />
                        {facility.facility_name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Assigning a user to a facility will grant them Admin
              privileges for that facility. They will be able to manage staff, equipment,
              and other facility resources.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !selectedFacilityId}
            size="lg"
            className="flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                Assign to Facility
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ChangeUserRoleModal;
