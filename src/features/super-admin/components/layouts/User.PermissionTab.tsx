import { Pen } from "lucide-react";

export default function UserPermissionTab() {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 p-4">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-lg text-black">Super Admin Permissions</p>
            <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-slate-500 px-6 py-2">
              <Pen size={16} className="text-slate-500" />
              <span>Edit</span>
            </button>
          </div>
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
        <div className="rounded-lg border border-slate-200 p-4">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-lg text-black">Facility Admin</p>
            <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-slate-500 px-6 py-2">
              <Pen size={16} className="text-slate-500" />
              <span>Edit</span>
            </button>
          </div>
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
                  <p className="text-sm text-red-500">Denied</p>
                </div>
                <div className="mt-1 flex justify-between rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                  <p>Export reports</p>
                  <p className="text-primary text-sm">Granted</p>
                </div>
                <div className="mt-1 flex justify-between rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                  <p>Manage integrations</p>
                  <p className="text-sm text-red-500">Denied</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
