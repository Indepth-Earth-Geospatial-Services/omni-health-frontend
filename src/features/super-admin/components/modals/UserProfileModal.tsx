"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { User } from "../../services/super-admin.service";
import { Button } from "@/features/admin/components/ui/button";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [activeTab, setActiveTab] = useState("user-directory");

  if (!isOpen || !user) return null;

  // Format date for last active
  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return isToday ? `today, ${timeStr}` : date.toLocaleDateString();
  };

  // const handleEditFacility = () => {
  //   onClose();
  //   onEditFacility?.();
  // };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-0 right-0 z-50 h-[80%] w-full max-w-lg overflow-y-auto bg-white shadow-2xl">
        {/* Header */}
        <div className="border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                {user.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  {user.full_name}
                </h2>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        {/* <div className="flex flex-wrap items-center gap-2 px-6 py-3">
          <Button
            onClick={handleEditFacility}
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
          >
            <Edit size={14} />
            Edit Facility
          </Button>
          <Button
            onClick={handleContact}
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
            disabled={!facility.contact_info?.phone}
          >
            <MessageSquare size={14} />
            Contact
          </Button> */}
        {/* <Button size="sm" variant="outline" className="gap-1.5 text-xs">
            <FileText size={14} />
            Request Report
          </Button> */}
        {/* <Button
            onClick={handleOpenMap}
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
            disabled={!facility.facility_id}
          >
            <MapPinIcon size={14} />
            View on Map
          </Button>
        </div> */}

        {/* Tabs */}
        <div className="mx-4 rounded-lg border border-slate-200 bg-[#F6F8FA] px-2 py-2">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab("user-directory")}
              className={`px-6 py-3 text-center text-sm font-medium transition-colors ${
                activeTab === "user-directory"
                  ? "rounded-lg bg-[#E2E4E9] text-black"
                  : "bg-transparent text-[#868C98] hover:text-slate-700"
              }`}
            >
              User Directory
            </button>
            <button
              onClick={() => setActiveTab("roles-permissions")}
              className={`px-6 py-3 text-center text-sm font-medium transition-colors ${
                activeTab === "roles-permissions"
                  ? "rounded-lg bg-[#E2E4E9] text-black"
                  : "bg-transparent text-[#868C98] hover:text-slate-700"
              }`}
            >
              Roles & Permissions
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "user-directory" && (
            <div className="space-y-6">
              {/* User Details */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500">
                    User ID
                  </label>
                  <p className="mt-1 rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                    {user.user_id}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500">
                    Role
                  </label>
                  <p className="mt-1 rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                    {user.role.replace("_", " ").toUpperCase()}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500">
                    Last Active
                  </label>
                  <p className="mt-1 rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                    {formatLastActive(user.created_at)}
                  </p>
                </div>
              </div>

              {/* Managed Facilities */}
              {/* {user.managed_facilities.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-semibold text-slate-700">
                    Managed Facilities
                  </h3>
                  <div className="space-y-2">
                    {user.managed_facilities.map((facility) => (
                      <div
                        key={facility.facility_id}
                        className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                            <Building2 size={16} className="text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {facility.facility_name}
                            </p>
                            <p className="text-xs text-slate-500">
                              ID: {facility.facility_id}
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                          Access
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}

              {/* {user.managed_facilities.length === 0 && (
                <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
                  <Building2 size={32} className="mx-auto text-slate-300" />
                  <p className="mt-2 text-sm text-slate-500">
                    No facilities assigned
                  </p>
                </div>
              )} */}
            </div>
          )}

          {activeTab === "roles-permissions" && (
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="mb-2 text-lg text-black">Permissions</p>
              <div>
                <div className="space-y-6">
                  {/* User Details */}
                  <div className="space-y-4">
                    <div className="mt-1 flex justify-between rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                      <p>View all facilities</p>
                      <p className="text-primary text-sm">Granted</p>
                    </div>
                    <div className="mt-1 flex justify-between rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                      <p>Approve/reject facilities</p>
                      <p className="text-primary text-sm">Granted</p>
                    </div>
                    <div className="mt-1 flex justify-between rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                      <p>Annotate & request remediation</p>
                      <p className="text-primary text-sm">Granted</p>
                    </div>
                    <div className="mt-1 flex justify-between rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                      <p>View audit logs</p>
                      <p className="text-primary text-sm">Granted</p>
                    </div>
                    <div className="mt-1 flex justify-between rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                      <p>Configure system settings</p>
                      <p className="text-primary text-sm">Granted</p>
                    </div>
                    <div className="mt-1 flex justify-between rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                      <p>Export reports</p>
                      <p className="text-primary text-sm">Granted</p>
                    </div>
                    <div className="mt-1 flex justify-between rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                      <p>Manage integrations</p>
                      <p className="text-primary text-sm">Granted</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-slate-200 bg-white p-6">
          <Button onClick={onClose} size="lg" className="">
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
};

export default UserProfileModal;
