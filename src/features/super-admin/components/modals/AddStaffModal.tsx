"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  ChevronDown,
  ArrowRight,
  User,
  Phone,
  Mail,
  Building2,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/features/admin/components/ui/button";
import { apiClient } from "@/lib/client";
import { cn } from "@/lib/utils";
import { superAdminService } from "@/features/super-admin/services/super-admin.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateStaffRequest } from "@/features/super-admin/services/super-admin.service";
import { toast } from "sonner";

interface Facility {
  facility_id: string;
  facility_name: string;
}

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    gender: "",
    rank_cadre: "",
    grade_level: "",
    date_of_birth: "",
    date_first_appointment: "",
    facility_id: "",
  });

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);
  const [isFacilityDropdownOpen, setIsFacilityDropdownOpen] = useState(false);
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const facilityDropdownRef = useRef<HTMLDivElement>(null);
  const genderDropdownRef = useRef<HTMLDivElement>(null);

  const genderOptions = [
    { value: "M", label: "Male" },
    { value: "F", label: "Female" },
  ];

  // Create staff mutation
  const createStaffMutation = useMutation({
    mutationFn: async (data: {
      facilityId: string;
      staffData: CreateStaffRequest;
    }) => {
      return await superAdminService.createStaff(
        data.facilityId,
        data.staffData,
      );
    },
    onSuccess: (data) => {
      // Show success toast
      toast.success("Staff member added successfully!", {
        description: `${data.full_name} has been added to the facility.`,
      });

      // Invalidate and refetch staff list
      queryClient.invalidateQueries({ queryKey: ["all-staff"] });
      onSuccess?.();
      handleClose();
    },
    onError: (error: any) => {
      console.error("Failed to add staff:", error);

      // Show error toast
      toast.error("Failed to add staff member", {
        description:
          error.response?.data?.message ||
          "Please check the form and try again.",
      });

      // Handle validation errors from API
      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          const newErrors: Record<string, string> = {};
          error.response.data.detail.forEach((err: any) => {
            const field = err.loc[err.loc.length - 1];
            newErrors[field] = err.msg;
          });
          setErrors(newErrors);
        }
      }
    },
  });

  // Fetch facilities when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchFacilities();
    }
  }, [isOpen]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        facilityDropdownRef.current &&
        !facilityDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFacilityDropdownOpen(false);
      }
      if (
        genderDropdownRef.current &&
        !genderDropdownRef.current.contains(event.target as Node)
      ) {
        setIsGenderDropdownOpen(false);
      }
    }

    if (isFacilityDropdownOpen || isGenderDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFacilityDropdownOpen, isGenderDropdownOpen]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.facility_id) {
      newErrors.facility_id = "Facility is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Prepare staff data (exclude facility_id from the data object)
    const staffData: CreateStaffRequest = {
      full_name: formData.full_name,
      email: formData.email,
      ...(formData.phone_number && { phone_number: formData.phone_number }),
      ...(formData.gender && { gender: formData.gender }),
      ...(formData.rank_cadre && { rank_cadre: formData.rank_cadre }),
      ...(formData.grade_level && { grade_level: formData.grade_level }),
      ...(formData.date_of_birth && { date_of_birth: formData.date_of_birth }),
      ...(formData.date_first_appointment && {
        date_first_appointment: formData.date_first_appointment,
      }),
    };

    createStaffMutation.mutate({
      facilityId: formData.facility_id,
      staffData,
    });
  };

  const handleClose = () => {
    setFormData({
      full_name: "",
      email: "",
      phone_number: "",
      gender: "",
      rank_cadre: "",
      grade_level: "",
      date_of_birth: "",
      date_first_appointment: "",
      facility_id: "",
    });
    setErrors({});
    setIsFacilityDropdownOpen(false);
    setIsGenderDropdownOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  const selectedFacility = facilities.find(
    (f) => f.facility_id === formData.facility_id,
  );
  const selectedGender = genderOptions.find((g) => g.value === formData.gender);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Add New Staff
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className={cn(
                    "focus:border-primary focus:ring-primary/20 w-full rounded-lg border bg-white py-3 pr-4 pl-10 text-sm text-slate-600 transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:ring-2 focus:outline-none",
                    errors.full_name ? "border-red-500" : "border-slate-300",
                  )}
                />
              </div>
              {errors.full_name && (
                <p className="mt-1 text-xs text-red-500">{errors.full_name}</p>
              )}
            </div>

            {/* Email */}
            <div className="col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className={cn(
                    "focus:border-primary focus:ring-primary/20 w-full rounded-lg border bg-white py-3 pr-4 pl-10 text-sm text-slate-600 transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:ring-2 focus:outline-none",
                    errors.email ? "border-red-500" : "border-slate-300",
                  )}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-300 bg-white py-3 pr-4 pl-10 text-sm text-slate-600 transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:ring-2 focus:outline-none"
                />
              </div>
            </div>

            {/* Gender */}
            <div ref={genderDropdownRef}>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Gender
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                  className="focus:border-primary focus:ring-primary/20 flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 transition-colors hover:border-slate-400 focus:ring-2 focus:outline-none"
                >
                  <span
                    className={
                      selectedGender ? "text-slate-800" : "text-slate-400"
                    }
                  >
                    {selectedGender?.label || "Select gender"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "text-slate-400 transition-transform",
                      isGenderDropdownOpen && "rotate-180",
                    )}
                  />
                </button>

                {isGenderDropdownOpen && (
                  <div className="absolute top-full z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
                    {genderOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            gender: option.value,
                          }));
                          setIsGenderDropdownOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50",
                          formData.gender === option.value &&
                            "bg-primary/5 text-primary font-medium",
                        )}
                      >
                        <span>{option.label}</span>
                        {formData.gender === option.value && (
                          <Check size={16} />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Facility */}
            <div className="col-span-2" ref={facilityDropdownRef}>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Facility <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setIsFacilityDropdownOpen(!isFacilityDropdownOpen)
                  }
                  disabled={loadingFacilities}
                  className={cn(
                    "focus:border-primary focus:ring-primary/20 flex w-full items-center justify-between rounded-lg border bg-white px-4 py-3 text-sm text-slate-600 transition-colors hover:border-slate-400 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                    errors.facility_id ? "border-red-500" : "border-slate-300",
                  )}
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
                        <span className="text-slate-800">
                          {selectedFacility.facility_name}
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-400">Select a facility</span>
                    )}
                  </span>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "text-slate-400 transition-transform",
                      isFacilityDropdownOpen && "rotate-180",
                    )}
                  />
                </button>

                {isFacilityDropdownOpen && !loadingFacilities && (
                  <div className="absolute top-full z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                    {facilities.length === 0 ? (
                      <div className="px-4 py-3 text-center text-sm text-slate-500">
                        No facilities available
                      </div>
                    ) : (
                      facilities.map((facility) => (
                        <button
                          key={facility.facility_id}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              facility_id: facility.facility_id,
                            }));
                            setIsFacilityDropdownOpen(false);
                            if (errors.facility_id) {
                              setErrors((prev) => ({
                                ...prev,
                                facility_id: "",
                              }));
                            }
                          }}
                          className={cn(
                            "flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50",
                            formData.facility_id === facility.facility_id &&
                              "bg-primary/5 text-primary font-medium",
                          )}
                        >
                          <Building2
                            size={16}
                            className="shrink-0 text-slate-400"
                          />
                          {facility.facility_name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              {errors.facility_id && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.facility_id}
                </p>
              )}
            </div>

            {/* Rank/Cadre */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Rank/Cadre
              </label>
              <input
                type="text"
                name="rank_cadre"
                value={formData.rank_cadre}
                onChange={handleInputChange}
                placeholder="Enter rank/cadre"
                className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:ring-2 focus:outline-none"
              />
            </div>

            {/* Grade Level */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Grade Level
              </label>
              <input
                type="text"
                name="grade_level"
                value={formData.grade_level}
                onChange={handleInputChange}
                placeholder="Enter grade level"
                className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:ring-2 focus:outline-none"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 transition-colors hover:border-slate-400 focus:ring-2 focus:outline-none"
              />
            </div>

            {/* Date of First Appointment */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Date of 1st Appt
              </label>
              <input
                type="date"
                name="date_first_appointment"
                value={formData.date_first_appointment}
                onChange={handleInputChange}
                className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 transition-colors hover:border-slate-400 focus:ring-2 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 p-6">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={createStaffMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createStaffMutation.isPending}
            className="flex items-center gap-2"
          >
            {createStaffMutation.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Adding...
              </>
            ) : (
              <>
                Add Staff
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AddStaffModal;
