"use client";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Bell, Check, Search, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

interface HeaderProps {
    name?: string;
    className?: string;
}

interface Notification {
    id: number;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
}

// LGA data for super admin filter
const LGAs = [
    { value: "all", label: "All LGAs" },
    { value: "port-harcourt", label: "Port Harcourt" },
    { value: "obio-akpor", label: "Obio/Akpor" },
    { value: "eleme", label: "Eleme" },
    { value: "ikwerre", label: "Ikwerre" },
    { value: "emohua", label: "Emohua" },
    { value: "ahoada-east", label: "Ahoada East" },
    { value: "ahoada-west", label: "Ahoada West" },
    { value: "ogba-egbema-ndoni", label: "Ogba/Egbema/Ndoni" },
];

export default function Header({ name, className }: HeaderProps) {
    const { user } = useAuthStore();
    const isSuperAdmin = user?.role === "super_admin";

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLGADropdownOpen, setIsLGADropdownOpen] = useState(false);
    const [selectedLGA, setSelectedLGA] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: 1,
            title: isSuperAdmin ? "New Facility Registered" : "New Patient Registered",
            message: isSuperAdmin ? "General Hospital Lagos has been registered" : "John Doe has been registered successfully",
            timestamp: "5 min ago",
            read: false,
        },
        {
            id: 2,
            title: isSuperAdmin ? "System Update" : "Appointment Scheduled",
            message: isSuperAdmin ? "Platform maintenance scheduled for tonight" : "Appointment for Jane Smith at 2:00 PM",
            timestamp: "15 min ago",
            read: false,
        },
        {
            id: 3,
            title: isSuperAdmin ? "Analytics Report Ready" : "Bed Capacity Alert",
            message: isSuperAdmin ? "Monthly analytics report is available" : "ICU capacity at 85%",
            timestamp: "1 hour ago",
            read: false,
        },
        {
            id: 4,
            title: isSuperAdmin ? "New Admin Added" : "Lab Results Ready",
            message: isSuperAdmin ? "Dr. Smith assigned as facility admin" : "Lab results for Patient ID #12345",
            timestamp: "2 hours ago",
            read: true,
        },
    ]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const lgaDropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (lgaDropdownRef.current && !lgaDropdownRef.current.contains(event.target as Node)) {
                setIsLGADropdownOpen(false);
            }
        }

        if (isDropdownOpen || isLGADropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen, isLGADropdownOpen]);

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    return (
        <header
            className={cn(
                "sticky top-0 z-10 h-16 w-full border-b border-gray-200 bg-white",
                "flex items-center justify-between px-6",
                className
            )}
        >
            {/* Left Section: Title (Admin only) */}
            {/* {!isSuperAdmin && name && (
                <div className="flex items-center ">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {name}
                    </h2>
                </div>)} */}


            {/* Center Section: Search & LGA Filter (Super Admin only) */}
            {isSuperAdmin && (
                <div className="flex items-center justify-start gap-4">
                    {/* Search Bar */}
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search facilities, staff, or analytics..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    {/* LGA Filter Dropdown */}
                    <div className="relative" ref={lgaDropdownRef}>
                        <button
                            onClick={() => setIsLGADropdownOpen(!isLGADropdownOpen)}
                            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
                        >
                            {LGAs.find((lga) => lga.value === selectedLGA)?.label}
                            <ChevronDown size={16} className="text-gray-400" />
                        </button>

                        {/* LGA Dropdown Menu */}
                        {isLGADropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 rounded-xl border-2 border-slate-200 bg-white shadow-lg z-50">
                                <div className="border-b border-slate-200 px-4 py-3">
                                    <h3 className="text-sm font-semibold text-slate-900">Filter by LGA</h3>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {LGAs.map((lga) => (
                                        <button
                                            key={lga.value}
                                            onClick={() => {
                                                setSelectedLGA(lga.value);
                                                setIsLGADropdownOpen(false);
                                            }}
                                            className={cn(
                                                "w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50",
                                                selectedLGA === lga.value && "bg-primary/5 font-medium text-primary"
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{lga.label}</span>
                                                {selectedLGA === lga.value && <Check size={16} />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Right Section: Notifications */}
            <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="relative rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                        aria-label="Notifications"
                    >
                        <Bell size={20} />
                        {/* Notification Badge */}
                        {unreadCount > 0 && (
                            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-96 rounded-xl border-2 border-slate-200 bg-white shadow-lg">
                            {/* Dropdown Header */}
                            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Notifications</h3>
                                    <p className="text-xs text-slate-500">{unreadCount} unread notifications</p>
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                                    >
                                        <Check size={14} />
                                        <span>Mark all read</span>
                                    </button>
                                )}
                            </div>

                            {/* Notification List */}
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="px-4 py-8 text-center">
                                        <p className="text-sm text-slate-500">No notifications</p>
                                    </div>
                                ) : (
                                    notifications.map((notification) => (
                                        <button
                                            key={notification.id}
                                            onClick={() => markAsRead(notification.id)}
                                            className={cn(
                                                "w-full border-b border-slate-100 px-4 py-3 text-left transition-colors hover:bg-slate-50",
                                                !notification.read && "bg-blue-50/50"
                                            )}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                                                    <p className="mt-0.5 text-xs text-slate-600">{notification.message}</p>
                                                    <p className="mt-1 text-xs text-slate-400">{notification.timestamp}</p>
                                                </div>
                                                {!notification.read && (
                                                    <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                                                )}
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>

                            {/* Dropdown Footer */}
                            {notifications.length > 0 && (
                                <div className="border-t border-slate-200 px-4 py-3">
                                    <button className="w-full text-center text-sm font-medium text-primary hover:underline">
                                        View all notifications
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}