"use client";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/features/auth/auth-store";
import logo from "@assets/img/image.png";
import {
  GitCompareArrows,
  Info,
  List,
  MapIcon,
  Menu,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    icon: List,
    label: "Facilities",
    href: "/facilities",
  },
  {
    icon: GitCompareArrows,
    label: "Compare",
    href: "/compare-facilities",
  },
  {
    icon: MapIcon,
    label: "Explore",
    href: "/explore-facilities",
  },
  {
    icon: Info,
    label: "Help",
    href: "/help",
  },
] as const;

export function DesktopSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const isActive = (href: string) => pathname === href;

  return (
    <aside
      className={cn(
        "hidden h-dvh flex-col border-r border-[#E2E4E9] bg-white lg:flex lg:w-[72px] xl:w-[220px]",
        className,
      )}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex h-16 items-center gap-2 border-b border-[#E2E4E9] px-4"
      >
        <div className="relative size-9 shrink-0">
          <Image
            src={logo}
            alt="RVS Healthcare"
            fill
            className="object-contain"
          />
        </div>
        <span className="hidden text-sm font-semibold text-black xl:inline">
          RSPHCMB
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="flex flex-col gap-1 px-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-lg px-3 text-[14px] transition-colors",
                    isActive(link.href)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-[#5A5F6B] hover:bg-gray-100",
                  )}
                >
                  <Icon size={20} className="shrink-0" />
                  <span className="hidden xl:inline">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Admin links */}
        {(user?.role === "admin" || user?.role === "super_admin") && (
          <>
            <div className="mx-3 my-3 border-t border-gray-200" />
            <ul className="flex flex-col gap-1 px-2">
              {user.role === "super_admin" && (
                <li>
                  <Link
                    href="/super-admin/map"
                    className={cn(
                      "flex h-10 items-center gap-3 rounded-lg px-3 text-[14px] transition-colors",
                      isActive("/super-admin/map")
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-[#5A5F6B] hover:bg-gray-100",
                    )}
                  >
                    <MapIcon size={20} className="shrink-0" />
                    <span className="hidden xl:inline">Super Admin</span>
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/admin"
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-lg px-3 text-[14px] transition-colors",
                    isActive("/admin")
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-[#5A5F6B] hover:bg-gray-100",
                  )}
                >
                  <MapIcon size={20} className="shrink-0" />
                  <span className="hidden xl:inline">Admin</span>
                </Link>
              </li>
            </ul>
          </>
        )}
      </nav>

      {/* Collapse indicator */}
      <div className="hidden border-t border-[#E2E4E9] p-3 lg:flex xl:hidden">
        <button
          className="flex h-8 w-full items-center justify-center rounded-lg text-[#5A5F6B] hover:bg-gray-100"
          title="Expand sidebar"
        >
          <Menu size={18} />
        </button>
      </div>
    </aside>
  );
}
