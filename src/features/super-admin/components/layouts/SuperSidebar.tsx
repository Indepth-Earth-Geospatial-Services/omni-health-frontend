"use client";

import { useState } from "react";
import {
  UserCog,
  Hospital,
  Settings,
  BarChart3,
  Map,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/auth-store";
import ProfileModal from "../../../profile/pages/ProfileModal";

const adminMenuItems = [
  {
    label: "Dashboard",
    icon: Hospital,
    href: "/super-admin/dashboard",
  },
  { label: "Map", icon: UserCog, href: "/super-admin/map" },
  {
    label: "Facility Registry",
    icon: Hospital,
    href: "/super-admin/facility-registry",
  },
  { label: "Staff", icon: Hospital, href: "/super-admin/staff" },
  { label: "Users", icon: BarChart3, href: "/super-admin/allUsers" },
  {
    label: "Equipments & Infrastructure",
    icon: Hospital,
    href: "/super-admin/all-equipments",
  },
  // {
  //   label: "Analytics",
  //   icon: Hospital,
  //   href: "/super-admin/analytics",
  // },
  { label: "Settings", icon: Settings, href: "/super-admin/settings" },
];

const userMenuItems = [
  { label: "Admin Dashboard", icon: Map, href: "/admin" },
  { label: "User Dashboard", icon: Map, href: "/user" },
];

export default function SuperSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const userInitials =
    user?.first_name && user?.last_name
      ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
      : user?.email?.[0]?.toUpperCase() || "U";

  const displayName =
    user?.first_name || user?.last_name
      ? `${user?.first_name || ""} ${user?.last_name || ""}`.trim()
      : "My Account";

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

      {/* Admin Menu Header */}
      <div className="px-4 pt-6 pb-2">
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
              <Link
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
              </Link>
            );
          })}
        </div>

        {/* User Portal Header */}
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
              <Link
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
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile — opens ProfileModal */}
      <div className="border-t border-gray-100 p-4">
        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="group flex w-full items-center gap-3 rounded-lg p-2 transition-all duration-200 hover:bg-gray-100"
        >
          <div className="bg-primary/10 text-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold">
            {userInitials}
          </div>

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
            className="group-hover:text-primary text-gray-400 transition-all duration-200 group-hover:translate-x-0.5"
          />
        </button>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </aside>
  );
}
