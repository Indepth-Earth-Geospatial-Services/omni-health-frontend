"use client";

import { useState } from "react";
import { Menu, X, User, List, GitCompareArrows, HelpCircle, LogOut } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
    brandName?: string;
    userEmail?: string;
    userName?: string;
    userImage?: string;
    onLogout?: () => void;
}

export default function Navbar({
    brandName = "OMNI HEALTH",
    userEmail = "user@example.com",
    userName = "John Doe",
    userImage = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    onLogout = () => console.log("Logout"),
}: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        {
            id: "account",
            label: "Your Account",
            icon: User,
            color: "text-black",
        },
        {
            id: "facilities",
            label: "Facilities",
            icon: List,
            color: "text-black",
        },
        {
            id: "compare",
            label: "Compare",
            icon: GitCompareArrows,
            color: "text-black",
        },
        {
            id: "help",
            label: "Help",
            icon: HelpCircle,
            color: "text-black",
        },
    ];

    return (
        <>
            {/* Hamburger Button - Always visible on top left */}
            <div className={`fixed  top-5 z-50 ${isOpen ? "right-5" : "left-5"}`}>
                <Button
                    size="icon"
                    className="rounded-full bg-white text-black hover:bg-white/90 shadow-md"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
            </div>

            {/* Overlay when menu is open */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Navigation Drawer */}
            <nav
                className={cn(
                    "fixed left-0 top-0 h-dvh w-80 overflow-y-auto overflow-x-hidden bg-white transition-transform duration-300 ease-in-out z-40",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Navbar Content */}
                <div className="flex h-full flex-col">
                    {/* Header Section - Brand */}
                    <div className="px-5 py-8">
                        <h1 className="text-xl font-bold text-primary">{brandName}</h1>
                    </div>

                    {/* Profile Section */}
                    <div className="px-5 py-6">
                        <div className="flex items-center gap-4">
                            {/* Profile Image */}
                            <div className="shrink-0">
                                <Image
                                    src={userImage}
                                    alt={userName}
                                    width={56}
                                    height={56}
                                    className="rounded-full object-cover"
                                />
                            </div>

                            {/* User Info */}
                            <div className="flex flex-1 flex-col gap-1 min-w-0">
                                <p className="truncate text-sm font-semibold text-gray-900">
                                    {userName}
                                </p>
                                <p className="truncate text-xs text-gray-500">{userEmail}</p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="flex-1 space-y-2 px-3 py-6">
                        {menuItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 active:bg-gray-200"
                                    onClick={() => {
                                        // Handle menu item click
                                        console.log(`${item.label} clicked`);
                                        setIsOpen(false);
                                    }}
                                >
                                    <IconComponent size={20} className={item.color} />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Logout Button - Bottom */}
                    <div className="border-t border-gray-100 px-3 py-4">
                        <button
                            onClick={onLogout}
                            className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 active:bg-red-100"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
}
