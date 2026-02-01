"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import profileImage from "@assets/img/facilities/shammah.jpg";
import {
  GitCompareArrows,
  Info,
  List,
  LogOut,
  MapIcon,
  Menu,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "@assets/img/image.png";
import { useAuthStore } from "@/store/auth-store"; // ✅ Import auth store
import { useRouter } from "next/navigation"; // ✅ Import router
import { toast } from "sonner";

const navLinks = [
  {
    icons: <UserRound size={24} />,
    name: "Your Account",
    href: "/profile",
  },
  {
    icons: <List size={24} />,
    name: "Facilities",
    href: "/facilities",
  },
  // {
  //   icons: <GitCompareArrows size={24} />,
  //   name: "Compare",
  //   href: "/compare-facilities",
  // },
  {
    icons: <MapIcon size={24} />,
    name: "Explore Map",
    href: "/explore-facilities",
  },
  {
    icons: <Info size={24} />,
    name: "Help",
    href: "/help",
  },
] as const;

// Admin Dashboard Links
const adminLinks = [
  {
    icons: <MapIcon size={24} />,
    name: "Admin Dashboard",
    href: "/admin",
  },
] as const;

// Super Admin Dashboard Links (includes both admin and super-admin)
const superAdminLinks = [
  {
    icons: <MapIcon size={24} />,
    name: "Admin Dashboard",
    href: "/admin",
  },
  {
    icons: <MapIcon size={24} />,
    name: "Super Admin Dashboard",
    href: "/super-admin/map",
  },
] as const;

function SideBar({ className }: { className?: string }) {
  // ✅ Get logout function and user from auth store
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  // ✅ Determine which dashboard links to show based on user role
  const getDashboardLinks = () => {
    if (user?.role === "super_admin") {
      return superAdminLinks;
    } else if (user?.role === "admin") {
      return adminLinks;
    }
    return [];
  };

  const dashboardLinks = getDashboardLinks();

  // ✅ Handle logout
  const handleLogout = () => {
    try {
      // Clear auth state
      logout();

      // Show success message
      toast.success("Logged out successfully");

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <>
      {/* TRIGGER */}
      <Sheet>
        <SheetTitle className="sr-only">RVS Health Care Side bar</SheetTitle>
        <SheetTrigger asChild>
          <button
            className={cn(
              "flex size-12 items-center justify-center rounded-full bg-white shadow-[0_24px_56px_-4px_#585C5F29]",
              className,
            )}
          >
            <Menu size={20} />
          </button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="flex h-dvh w-[80dvw] flex-col border-0 bg-white p-0 px-5 pb-4.5"
        >
          <div className="flex h-full flex-col">
            <Link href="/" className="mt-10 flex h-[57px] items-center gap-3">
              <div className="relative h-10 w-10">
                <Image
                  src={logo}
                  alt="RVS Healthcare Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-sm font-semibold text-black">RSPHCMB</h1>
            </Link>

            {/* PROFILE DETAILS */}
            <div className="mt-8 flex items-center gap-2.5 py-3">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={profileImage}
                  alt="profile image"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                {/* ✅ Display actual user data from auth store */}
                <h3 className="text-[15px] font-medium">
                  {user?.first_name && user?.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : "User"}
                </h3>
                <p className="text-[13px] text-[#868C98]">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>

            {/* NAVIGATION  */}
            <ul className="flex flex-col gap-3">
              {navLinks.map((nav) => (
                <li
                  key={nav.href}
                  className="flex h-12 items-center text-[15px]"
                >
                  <Link className="flex items-center gap-3" href={nav.href}>
                    {nav.icons} {nav.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* ✅ DASHBOARD LINKS - Role-based conditional rendering */}
            {dashboardLinks.length > 0 && (
              <>
                <div className="my-4 border-t border-gray-200" />
                <div className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Dashboard
                </div>
                <ul className="flex flex-col gap-3">
                  {dashboardLinks.map((nav) => (
                    <li
                      key={nav.href}
                      className="flex h-12 items-center text-[15px]"
                    >
                      <Link
                        className="hover:text-primary flex items-center gap-3 transition-colors"
                        href={nav.href}
                      >
                        {nav.icons} {nav.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* ✅ LOGOUT BUTTON */}
            <div className="mt-auto pb-4.5">
              <Button
                variant="ghost"
                onClick={handleLogout} // ✅ Added onClick handler
                className="h-12 w-full justify-start gap-3 text-[15px] font-normal text-[#E11414] hover:bg-red-50"
              >
                <LogOut size={24} /> Log out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default SideBar;
