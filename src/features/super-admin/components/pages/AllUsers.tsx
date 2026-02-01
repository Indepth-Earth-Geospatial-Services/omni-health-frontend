"use client";
import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import KPIStatsCards from "@/features/admin/components/layout/KPICards";
import { Calendar, Users } from "lucide-react";
import StaffTableHeader, {
  type FilterState,
} from "@/features/super-admin/components/layouts/StaffTableHeader";
import Tabs from "@/features/super-admin/components/ui/Tabs";
import UserAndRoleList from "../layouts/UserAndRoleList";
import { useSuperAdminUsers } from "../../hooks/useSuperAdminUsers";
import { superAdminService } from "../../services/super-admin.service";
import UserPermissionTab from "../layouts/User.PermissionTab";
import { toast } from "sonner";

export default function AllUserPage() {
  const searchParams = useSearchParams();
  const actionParam = searchParams.get("action");
  const [activeTab, setActiveTab] = useState("user-directory");
  const [isExporting, setIsExporting] = useState(false);

  // Show toast message based on action query parameter
  useEffect(() => {
    if (actionParam) {
      const actionMessages: Record<string, string> = {
        add: "Click 'Add New User' button to create a new account",
        changeRole: "Select a user from the list and click the edit icon, then 'Change Role'",
        suspend: "Select a user from the list and click the edit icon, then 'Suspend Account'",
        deactivate: "Select a user from the list and click the edit icon, then 'Deactivate'",
      };

      const message = actionMessages[actionParam];
      if (message) {
        toast.info(message, { duration: 5000 });
      }
    }
  }, [actionParam]);

  // Filter state for user search and filtering
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    selectedFacility: "all",
    selectedLGA: "all",
    selectedGender: "all",
    selectedStatus: "all",
  });

  // Fetch all users for KPI calculations (using a large limit to get all users)
  const { data: allUsersData } = useSuperAdminUsers({ page: 1, limit: 100 });

  const tabs = [
    { label: "User Directory", value: "user-directory" },
    { label: "Roles & Permissions", value: "roles-permissions" },
  ];

  // Calculate KPI metrics
  const totalUsers = allUsersData?.pagination?.total_records ?? 0;
  const activeUsers =
    allUsersData?.users?.filter((user) => user.is_active).length ?? 0;
  const totalSuperAdmins =
    allUsersData?.users?.filter((user) => user.role === "super_admin").length ??
    0;

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  // Handle search
  const handleSearch = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: value }));
  }, []);

  // Handle status filter
  const handleStatusFilter = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, selectedStatus: value }));
  }, []);

  // Handle export users
  const handleExport = useCallback(async () => {
    if (isExporting) return;

    setIsExporting(true);
    try {
      const blob = await superAdminService.exportUsers({ format: "EXCEL" });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `users_export_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Users exported successfully!");
    } catch (error) {
      console.error("Failed to export users:", error);
      toast.error("Failed to export users. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }, [isExporting]);

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <main className="flex min-h-screen flex-col">
        <div className="mb-4 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <KPIStatsCards
            title="Total Users"
            value={totalUsers}
            subtitle=""
            icon={<Users size={24} />}
            trend={{ value: "20%", isPositive: true }}
          />
          <KPIStatsCards
            title="Active Users"
            value={activeUsers}
            subtitle=""
            icon={<Users size={24} />}
            trend={{ value: "2% Decrease", isPositive: false }}
          />
          <KPIStatsCards
            title="Pending Approvals"
            value={1}
            subtitle=""
            icon={<Calendar size={24} />}
            trend={{ value: "80%", isPositive: true }}
          />
          <KPIStatsCards
            title="Super Admins"
            value={totalSuperAdmins}
            subtitle=""
            icon={<Calendar size={24} />}
            trend={{ value: "80%", isPositive: true }}
          />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Conditionally render content based on active tab */}
        {activeTab === "user-directory" && (
          <>
            <StaffTableHeader
              title="Users List"
              searchPlaceholder="Search users..."
              onSearch={handleSearch}
              buttonLabel="Add New User"
              onButtonClick={() => console.log("Add new user")}
              showGenderFilter={false}
              showStatusFilter={true}
              onStatusFilter={handleStatusFilter}
              showExport={true}
              onExport={handleExport}
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
            <UserAndRoleList
              searchQuery={filters.searchQuery}
              statusFilter={filters.selectedStatus}
            />
          </>
        )}

        {activeTab === "roles-permissions" && <UserPermissionTab />}
      </main>
    </div>
  );
}
