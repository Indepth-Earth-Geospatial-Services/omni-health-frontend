"use client";

import { useState } from "react";
import {
  UserCog,
  Hospital,
  Settings,
  Map,
  ChevronRight,
  MailOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore, useCurrentFacilityId } from "@/features/auth/auth-store";
import { useFacility } from "@/hooks/use-facilities";
import ProfileModal from "../modals/ProfileModal";

const adminMenuItems = [
  { label: "Overview", icon: MailOpen, href: "/admin" },
  { label: "Staff", icon: UserCog, href: "/admin/staff" },
  { label: "Facility Profile", icon: Hospital, href: "/admin/facility" },
  { label: "Equipments & Facility", icon: Hospital, href: "/admin/equipments" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

const userMenuItems = [{ label: "User Dashboard", icon: Map, href: "/user" }];
const SuperAdminMenuItems = [
  { label: "Super Admin", icon: Map, href: "/super-admin/map" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Get the currently selected facility ID
  const facilityId = useCurrentFacilityId();

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
      {/* Active Facility Badge */}
      <div className="my-4 px-4 py-3">
        <div className="relative overflow-hidden rounded-xl p-0.5">
          {/* Spinning conic-gradient — forms the animated rotating border */}
          <div
            className="absolute -inset-[50%] animate-spin"
            style={{
              background:
                "conic-gradient(rgba(81,161,153,0.12) 0deg, rgba(81,161,153,0.85) 90deg, rgba(10,161,80,0.95) 180deg, rgba(81,161,153,0.85) 270deg, rgba(81,161,153,0.12) 360deg)",
              animationDuration: "4s",
            }}
          />
          {/* Inner card */}
          <div className="relative rounded-[10px] bg-white px-3 py-2.5">
            <p className="text-primary/70 text-[9px] font-semibold tracking-widest uppercase">
              Active Facility
            </p>
            {isFacilityLoading ? (
              <div className="mt-1 h-4 w-32 animate-pulse rounded bg-gray-100" />
            ) : (
              <div>
                <p className="mt-0.5 truncate text-sm font-bold text-gray-800">
                  {facility?.facility_name || "No Facility"}
                </p>
                <p className="truncate text-[9px] text-gray-500">
                  {facility?.facility_category || "Unknown Category"}
                </p>
              </div>
            )}
          </div>
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

      {/* User Profile - Clickable */}
      <div className="border-t border-gray-100 p-4">
        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="group flex w-full items-center gap-3 rounded-lg p-2 transition-all duration-200 hover:bg-gray-100"
        >
          {/* User avatar — initials from name, falls back to email initial */}
          <div className="bg-primary/10 text-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold">
            {user?.first_name && user?.last_name
              ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
              : user?.email?.[0]?.toUpperCase() || "U"}
          </div>

          <div className="flex-1 overflow-hidden text-left">
            <p className="truncate text-sm font-semibold text-gray-900">
              {user?.first_name || user?.last_name
                ? `${user?.first_name || ""} ${user?.last_name || ""}`.trim()
                : "My Account"}
            </p>
            <p className="truncate text-xs text-gray-500">
              {user?.email || ""}
            </p>
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
