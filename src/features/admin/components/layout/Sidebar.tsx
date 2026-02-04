"use client";

import { useState } from "react";
import {
  UserCog,
  Hospital,
  Settings,
  Search,
  Loader2,
  Map,
  ChevronRight,
  MailOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { useFacility } from "@/hooks/use-facilities";
import ProfileModal from "../modals/ProfileModal";

const adminMenuItems = [
  { label: "Overview", icon: MailOpen, href: "/admin" },
  // { label: "Patients & Capacities", icon: Users, href: "/admin/patients" },
  // { label: "Appointments", icon: Calendar, href: "/admin/appointment" },
  { label: "Staff", icon: UserCog, href: "/admin/staff" },
  { label: "Facility Profile", icon: Hospital, href: "/admin/facility" },
  { label: "Equipments & Facility", icon: Hospital, href: "/admin/equipments" },
  // { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

const userMenuItems = [{ label: "User Dashboard", icon: Map, href: "/user" }];
const SuperAdminMenuItems = [
  { label: "Super Admin", icon: Map, href: "/super-admin/map" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { facilityIds, user } = useAuthStore();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Get the first facility ID (admin may manage multiple facilities)
  const facilityId = facilityIds?.[0] || "";

  // Check if user is super admin
  const isSuperAdmin = user?.role === "super_admin";

  // Fetch facility details
  const { data: facilityData, isLoading: isFacilityLoading } =
    useFacility(facilityId);
  const facility = facilityData?.facility;

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col bg-white shadow-lg">
      {/* Brand */}
      <Link href="/" className="group flex items-center gap-2 sm:gap-2.5">
        <div className="flex h-16 items-center gap-4 px-4">
          <Image
            src="/img/image.png"
            alt="Healthcare facility background"
            priority
            width={40}
            height={40}
            quality={75}
          />
          <h1 className="text-sm font-bold tracking-tight text-[#0aa150] drop-shadow-lg transition-transform group-hover:scale-105 sm:text-base md:text-xl">
            RSPHCMB
          </h1>
        </div>
      </Link>
      {/* Search Bar */}
      <div className="px-4 py-4">
        <div className="focus-within:border-primary flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 transition-all duration-200 focus-within:bg-white">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Admin Menu Header */}
      <div className="px-4 pb-2">
        <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
          Admin Menu
        </p>
      </div>

      {/* Admin Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        <div className="flex flex-col gap-1">
          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-primary bg-gray-100"
                    : "text-gray-700 hover:translate-x-1 hover:bg-gray-200",
                )}
              >
                <Icon size={18} />
                <span className="truncate">{item.label}</span>
              </a>
            );
          })}
        </div>

        {/* User Menu Header */}
        <div className="px-2 pt-6 pb-2">
          <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
            User Portal
          </p>
        </div>

        {/* User Navigation */}
        <div className="flex flex-col gap-1">
          {userMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-primary bg-gray-100"
                    : "text-gray-700 hover:translate-x-1 hover:bg-gray-200",
                )}
              >
                <Icon size={18} />
                <span className="truncate">{item.label}</span>
              </a>
            );
          })}
        </div>

        {/* Super Admin Menu - Only visible to super admins */}
        {isSuperAdmin && (
          <>
            <div className="px-2 pt-6 pb-2">
              <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Super Admin Portal
              </p>
            </div>

            <div className="flex flex-col gap-1">
              {SuperAdminMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-primary bg-gray-100"
                        : "text-gray-700 hover:translate-x-1 hover:bg-gray-200",
                    )}
                  >
                    <Icon size={18} />
                    <span className="truncate">{item.label}</span>
                  </a>
                );
              })}
            </div>
          </>
        )}
      </nav>

      {/* Facility Profile - Clickable */}
      <div className="p-4">
        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="group flex w-full items-center gap-3 rounded-lg p-2 transition-all duration-200 hover:bg-gray-100"
        >
          <div className="flex-shrink-0">
            {isFacilityLoading ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <Loader2 size={16} className="animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
                {facility?.facility_name
                  ?.split(" ")
                  .slice(0, 2)
                  .map((n: string) => n[0])
                  .join("") || "F"}
              </div>
            )}
          </div>
          <div className="flex-1 overflow-hidden text-left">
            {isFacilityLoading ? (
              <>
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                <div className="mt-1 h-3 w-16 animate-pulse rounded bg-gray-100" />
              </>
            ) : (
              <>
                <p className="truncate text-sm font-medium text-gray-900">
                  {facility?.facility_name || "No Facility"}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {facility?.facility_category || "Unknown Category"}
                </p>
              </>
            )}
          </div>
          <ChevronRight
            size={16}
            className="group-hover:text-primary text-gray-400 transition-all duration-200 group-hover:translate-x-0.5"
          />
        </button>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        facility={facility}
        isFacilityLoading={isFacilityLoading}
      />
    </aside>
  );
}
