"use client";

import { cn } from "@/lib/utils";
import { Menu, MapIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "./nav-links";
import { useAuthStore } from "@/features/auth/auth-store";
import logo from "@assets/img/image.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DesktopMobileNav() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const isActive = (href: string) => pathname === href;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className={cn(
            "flex size-9 items-center justify-center rounded-lg border border-[#E2E4E9] bg-white text-[#5A5F6B] shadow-sm transition-colors hover:bg-gray-100",
          )}
          aria-label="Open navigation menu"
        >
          <Menu size={18} />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex w-[260px] flex-col p-0"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

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
          <span className="text-sm font-semibold text-black">RSPHCMB</span>
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
                    <span>{link.label}</span>
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
                      <span>Super Admin</span>
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
                    <span>Admin</span>
                  </Link>
                </li>
              </ul>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
