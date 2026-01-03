"use client";
import logo from "@assets/img/icons/svg/logo.svg";
import Link from "next/link";
import profileImage from "@assets/img/facilities/shammah.jpg";
import Image from "next/image";
import {
  GitCompareArrows,
  Info,
  List,
  LogOut,
  Menu,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
  {
    icons: <GitCompareArrows size={24} />,
    name: "Compare",
    href: "/compare-facilities",
  },
  {
    icons: <Info size={24} />,
    name: "Help",
    href: "/help",
  },
] as const;
function SideBar() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  return (
    <>
      {/* OVERLAY */}
      {isSideBarOpen && (
        <div
          onClick={() => setIsSideBarOpen(false)}
          className="fixed z-90 h-dvh w-dvw bg-[#0000004D]"
        ></div>
      )}

      {/* TRIGGER */}
      <button
        onClick={() => setIsSideBarOpen(true)}
        className="absolute top-[59px] left-5 z-10 flex size-12 items-center justify-center rounded-full bg-white shadow-[0_24px_56px_-4px_#585C5F29]"
      >
        <Menu size={20} />
      </button>

      {/* SIDEBAR */}
      <aside
        className={cn(
          "fixed z-100 flex h-dvh w-[80dvw] flex-col bg-white px-5 pb-4.5 transition-all duration-300",
          !isSideBarOpen && "w-0 px-0",
        )}
      >
        {isSideBarOpen && (
          <>
            <Link href="/" className="mt-10 flex h-[57px] items-center gap-3">
              <Image src={logo} alt="logo" />
              <h1 className="text-primary text-[19px] font-normal">
                RVS-HealthCare
              </h1>
            </Link>

            {/* PROFILE DETAILS */}
            <div className="mt-8 flex items-center gap-2.5 py-3">
              <div className="relative size-20 overflow-hidden rounded-full">
                <Image
                  src={profileImage}
                  alt="profile image"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-[15px] font-medium">Tee Godwin</h3>
                <p className="text-[13px] text-[#868C98]">
                  toksgodwin@gmail.com
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

            <div className="mt-auto">
              <Button
                variant="ghost"
                className="text-[15px] font-normal text-[#E11414]"
              >
                <LogOut /> Log out
              </Button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export default SideBar;
