"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Building2,
  MapPin,
  Phone,
  Mail,
  Hash,
  Loader2,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { useUpdateFacilityProfile } from "@/features/admin/hooks/useAdminStaff";
import { UpdateFacilityProfileRequest } from "@/services/admin.service";

interface EditFacilityProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilityId: string;
  currentData: any; // The facility object from your useFacility hook
}

export default function EditFacilityProfileModal({
  isOpen,
  onClose,
  facilityId,
  currentData,
}: EditFacilityProfileModalProps) {
  const updateProfileMutation = useUpdateFacilityProfile();

  const [formData, setFormData] = useState<UpdateFacilityProfileRequest>({
    facility_name: "",
    hfr_id: "",
    facility_category: "",
    town: "",
    address: "",
    contact_info: {
      phone: "",
      email: "",
    },
    lat: 0,
    lon: 0,
  });

  // Load current data into form when modal opens
  useEffect(() => {
    if (isOpen && currentData) {
      setFormData({
        facility_name: currentData.facility_name || "",
        hfr_id: currentData.hfr_id || "",
        facility_category: currentData.facility_category || "",
        town: currentData.town || currentData.facility_lga || "", // Use town or fallback to facility_lga
        address: currentData.address || "",
        contact_info: {
          phone: currentData.contact_info?.phone || "",
          email: currentData.contact_info?.email || "",
        },
        lat: currentData.lat || 0,
        lon: currentData.lon || 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentData?.facility_id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle nested contact info
    if (name === "phone" || name === "email") {
      setFormData((prev) => ({
        ...prev,
        contact_info: {
          ...prev.contact_info,
          [name]: value,
        },
      }));
    } else if (name === "lat" || name === "lon") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = () => {
    updateProfileMutation.mutate(
      {
        facilityId,
        data: formData,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="animate-in fade-in zoom-in-95 fixed top-1/2 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Edit Facility Profile
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Facility Name */}
            <div className="col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Facility Name
              </label>
              <div className="relative">
                <Building2
                  size={18}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  name="facility_name"
                  value={formData.facility_name}
                  onChange={handleInputChange}
                  placeholder="Enter facility name"
                  className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-300 bg-white py-3 pr-4 pl-10 text-sm text-slate-600 transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:ring-2 focus:outline-none"
                />
              </div>
            </div>

            {/* HFR ID */}
            <div className="col-span-1">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                HFR ID
              </label>
              <div className="relative">
                <Hash
                  size={18}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  name="hfr_id"
                  value={formData.hfr_id}
                  onChange={handleInputChange}
                  placeholder="HFR ID"
                  className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-300 bg-white py-3 pr-4 pl-10 text-sm text-slate-600 transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:ring-2 focus:outline-none"
                />
              </div>
            </div>

            {/* Facility Category */}
            <div className="col-span-1">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Town / LGA
              </label>
              <div className="relative">
                <Layers
                  size={18}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  name="town"
                  value={formData.town}
                  onChange={handleInputChange}
                  placeholder="e.g. Primary Health Center"
                  className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-300 bg-white py-3 pr-4 pl-10 text-sm text-slate-600 transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:ring-2 focus:outline-none"
                />
              </div>
            </div>

            {/* Town (LGA) */}
            <div className="col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category
              </label>
              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  name="facility_category"
                  value={formData.facility_category}
                  onChange={handleInputChange}
                  placeholder="Town or Local Government Area"
                  className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-300 bg-white py-3 pr-4 pl-10 text-sm text-slate-600 transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:ring-2 focus:outline-none"
                />
              </div>
            </div>

            {/* Full Address */}
            <div className="col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Full Address
              </label>
              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute top-3 left-3 text-slate-400"
                />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter full address"
                  className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-300 bg-white py-3 pr-4 pl-10 text-sm text-slate-600 transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:ring-2 focus:outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div className="col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Contact Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.contact_info?.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-300 bg-white py-3 pr-4 pl-10 text-sm text-slate-600 transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:ring-2 focus:outline-none"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Contact Phone
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.contact_info?.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-300 bg-white py-3 pr-4 pl-10 text-sm text-slate-600 transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:ring-2 focus:outline-none"
                />
              </div>
            </div>

            {/* Coordinates */}
            <div className="col-span-1">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Latitude
              </label>
              <input
                type="number"
                name="lat"
                step="any"
                value={formData.lat}
                onChange={handleInputChange}
                className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:ring-2 focus:outline-none"
              />
            </div>
            <div className="col-span-1">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Longitude
              </label>
              <input
                type="number"
                name="lon"
                step="any"
                value={formData.lon}
                onChange={handleInputChange}
                className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:ring-2 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 p-6">
          {/* <Button
            variant="outline"
            onClick={onClose}
            disabled={updateProfileMutation.isPending}
          >
            Cancel
          </Button> */}
          <Button
            onClick={handleSubmit}
            disabled={updateProfileMutation.isPending}
            size="lg"
          >
            {updateProfileMutation.isPending ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Save Changes
                <ArrowRight size={18} />
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
