"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import profileImage from "@assets/img/facilities/shammah.jpg";
import logo from "@assets/img/icons/svg/logo.svg";
import {
  GitCompareArrows,
  Info,
  List,
  LogOut,
  Menu,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
  return (
    <>
      {/* TRIGGER */}
      <Sheet>
        <SheetTrigger asChild>
          <button className="absolute top-[59px] left-5 z-10 flex size-12 items-center justify-center rounded-full bg-white shadow-[0_24px_56px_-4px_#585C5F29]">
            <Menu size={20} />
          </button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="flex h-dvh w-[80dvw] flex-col border-0 bg-white p-0 px-5 pb-4.5"
        >
          <div className="flex h-full flex-col">
            <Link
              href="/user"
              className="mt-10 flex h-[57px] items-center gap-3"
            >
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

            <div className="mt-auto pb-4.5">
              <Button
                variant="ghost"
                className="h-12 w-full justify-start gap-3 text-[15px] font-normal text-[#E11414]"
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
