"use client";

import { useState } from "react";
import {
  UserCog,
  Hospital,
  Settings,
  Map,
  ChevronRight,
  MailOpen,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore, useCurrentFacilityId } from "@/features/auth/auth-store";
import { useFacility } from "@/hooks/use-facilities";
import { useSidebarCollapse } from "@/hooks/use-sidebar-collapse";
import ProfileModal from "../../../profile/pages/ProfileModal";
import { ProfileAvatar } from "../../../profile/components/ProfileAvatar";

interface MenuItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

const adminMenuItems: MenuItem[] = [
  { label: "Overview", icon: MailOpen, href: "/admin" },
  { label: "Staff", icon: UserCog, href: "/admin/staff" },
  { label: "Facility Profile", icon: Hospital, href: "/admin/facility" },
  { label: "Equipments & Facility", icon: Hospital, href: "/admin/equipments" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

const userMenuItems: MenuItem[] = [
  { label: "User Dashboard", icon: Map, href: "/user" },
];

const superAdminMenuItems: MenuItem[] = [
  { label: "Super Admin", icon: Map, href: "/super-admin/map" },
];

/** The rotating conic-gradient that rings the active-facility card. */
const ACTIVE_FACILITY_RING =
  "conic-gradient(rgba(81,161,153,0.12) 0deg, rgba(81,161,153,0.85) 90deg, rgba(10,161,80,0.95) 180deg, rgba(81,161,153,0.85) 270deg, rgba(81,161,153,0.12) 360deg)";

/**
 * A single nav row. Collapsed it is an icon centred in the rail, with the label
 * moved to the native tooltip — a custom one would be clipped by the nav's own
 * overflow-y-auto.
 */
function SidebarLink({
  item,
  isActive,
  isCollapsed,
}: {
  item: MenuItem;
  isActive: boolean;
  isCollapsed: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      title={isCollapsed ? item.label : undefined}
      aria-label={isCollapsed ? item.label : undefined}
      className={cn(
        "flex items-center rounded-md py-2.5 text-sm font-medium transition-all duration-200",
        isCollapsed ? "justify-center px-0" : "gap-3 px-3",
        isActive
          ? "text-primary bg-gray-100"
          : "text-gray-700 hover:bg-gray-200",
        // The nudge reads as jitter once the icon is centred in a narrow rail.
        !isActive && !isCollapsed && "hover:translate-x-1",
      )}
    >
      <Icon size={18} className="shrink-0" />
      {!isCollapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

/** Section label when open, a plain rule when collapsed. */
function SectionHeading({
  label,
  isCollapsed,
  className,
}: {
  label: string;
  isCollapsed: boolean;
  className?: string;
}) {
  if (isCollapsed) {
    return <div className="mx-auto my-3 h-px w-8 bg-gray-200" />;
  }
  return (
    <div className={className}>
      <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
        {label}
      </p>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { isCollapsed, toggle } = useSidebarCollapse();

  // Get the currently selected facility ID
  const facilityId = useCurrentFacilityId();

  // Check if user is super admin
  const isSuperAdmin = user?.role === "super_admin";

  // Fetch facility details
  const { data: facilityData, isLoading: isFacilityLoading } =
    useFacility(facilityId);
  const facility = facilityData?.facility;

  const facilityName = facility?.facility_name || "No Facility";

  const displayName =
    user?.first_name || user?.last_name
      ? `${user?.first_name || ""} ${user?.last_name || ""}`.trim()
      : "My Account";

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col bg-white shadow-lg",
        "transition-[width] duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      {/* Brand — the wordmark drops away when collapsed, leaving just the mark */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-gray-100",
          isCollapsed ? "justify-center px-2" : "px-4",
        )}
      >
        <Link
          href="/"
          title={isCollapsed ? "RSPHCMB" : undefined}
          className="group flex min-w-0 items-center gap-3"
        >
          <Image
            src="/img/image.png"
            alt="RSPHCMB logo"
            priority
            width={40}
            height={40}
            quality={75}
            className="shrink-0"
          />
          {!isCollapsed && (
            <h1 className="truncate text-base font-bold tracking-tight text-[#0aa150] drop-shadow-lg transition-transform group-hover:scale-105 md:text-xl">
              RSPHCMB
            </h1>
          )}
        </Link>
      </div>

      {/* Collapse toggle */}
      <div
        className={cn(
          "flex px-2 pt-3",
          isCollapsed ? "justify-center" : "justify-end",
        )}
      >
        <button
          type="button"
          onClick={toggle}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!isCollapsed}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hover:text-primary rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100"
        >
          {isCollapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </div>

      {/* Active Facility — which facility an admin is acting on matters enough
          to survive collapsing, so it shrinks to a ringed initial rather than
          disappearing. The rotating gradient is kept at both sizes. */}
      {isCollapsed ? (
        <div className="flex justify-center px-2 py-3">
          <div
            className="relative h-10 w-10 overflow-hidden rounded-full p-0.5"
            title={`Active Facility: ${facilityName}`}
          >
            <div
              className="absolute -inset-1/2 animate-spin"
              style={{
                background: ACTIVE_FACILITY_RING,
                animationDuration: "4s",
              }}
            />
            <div className="relative flex h-full w-full items-center justify-center rounded-full bg-white">
              {isFacilityLoading ? (
                <div className="h-4 w-4 animate-pulse rounded-full bg-gray-100" />
              ) : (
                <span className="text-primary text-xs font-bold">
                  {facilityName[0]?.toUpperCase() ?? "?"}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="my-4 px-4 py-3">
          <div className="relative overflow-hidden rounded-xl p-0.5">
            {/* Spinning conic-gradient — forms the animated rotating border */}
            <div
              className="absolute -inset-[50%] animate-spin"
              style={{
                background: ACTIVE_FACILITY_RING,
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
                    {facilityName}
                  </p>
                  <p className="truncate text-[9px] text-gray-500">
                    {facility?.facility_category || "Unknown Category"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Menu Header */}
      <SectionHeading
        label="Admin Menu"
        isCollapsed={isCollapsed}
        className="px-4 pb-2"
      />

      {/* Navigation */}
      <nav className="flex-1 overflow-x-hidden overflow-y-auto px-2 pb-4">
        <div className="flex flex-col gap-1">
          {adminMenuItems.map((item) => (
            <SidebarLink
              key={item.label}
              item={item}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>

        {/* User Portal */}
        <SectionHeading
          label="User Portal"
          isCollapsed={isCollapsed}
          className="px-2 pt-6 pb-2"
        />

        <div className="flex flex-col gap-1">
          {userMenuItems.map((item) => (
            <SidebarLink
              key={item.label}
              item={item}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>

        {/* Super Admin Menu - Only visible to super admins */}
        {isSuperAdmin && (
          <>
            <SectionHeading
              label="Super Admin Portal"
              isCollapsed={isCollapsed}
              className="px-2 pt-6 pb-2"
            />

            <div className="flex flex-col gap-1">
              {superAdminMenuItems.map((item) => (
                <SidebarLink
                  key={item.label}
                  item={item}
                  isActive={pathname === item.href}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          </>
        )}
      </nav>

      {/* User Profile - Clickable */}
      <div className="shrink-0 p-1">
        <button
          onClick={() => setIsProfileModalOpen(true)}
          title={isCollapsed ? displayName : undefined}
          aria-label={isCollapsed ? displayName : undefined}
          className={cn(
            "group flex w-full items-center rounded-lg p-2 transition-all duration-200 hover:bg-gray-100",
            isCollapsed ? "justify-center" : "gap-2",
          )}
        >
          {/* Uploaded picture, falling back to initials */}
          <ProfileAvatar className="h-10 w-10" textClassName="text-sm" />

          {!isCollapsed && (
            <>
              <div className="flex-1 overflow-hidden text-left">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {displayName}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {user?.email || ""}
                </p>
              </div>
              <ChevronRight
                size={16}
                className="group-hover:text-primary shrink-0 text-gray-400 transition-all duration-200 group-hover:translate-x-0.5"
              />
            </>
          )}
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
