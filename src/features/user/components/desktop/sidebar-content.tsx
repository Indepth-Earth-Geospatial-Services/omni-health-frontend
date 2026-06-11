"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapIcon } from "lucide-react";
import { useAuthStore } from "@/features/auth/auth-store";
import logo from "@assets/img/image.png";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { navLinks } from "./nav-links";

export function SidebarContentNav() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          href="/user"
          className="border-sidebar-border flex h-14 items-center gap-2 border-b"
        >
          <div className="relative size-9 shrink-0">
            <Image
              src={logo}
              alt="RVS Healthcare"
              fill
              className="object-contain"
            />
          </div>
          <span className="truncate text-sm font-semibold group-data-[collapsible=icon]:hidden">
            RSPHCMB
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    asChild
                    tooltip={link.label}
                    isActive={active}
                  >
                    <Link href={link.href}>
                      <Icon />
                      <span>{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {(user?.role === "admin" || user?.role === "super_admin") && (
        <SidebarFooter>
          <SidebarMenu>
            {user?.role === "super_admin" && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Super Admin"
                  isActive={pathname === "/super-admin/map"}
                >
                  <Link href="/super-admin/map">
                    <MapIcon />
                    <span>Super Admin</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Admin"
                isActive={pathname === "/admin"}
              >
                <Link href="/admin">
                  <MapIcon />
                  <span>Admin</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}

      <SidebarRail />
    </Sidebar>
  );
}
