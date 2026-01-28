"use client";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Bell, Check } from "lucide-react";

interface HeaderProps {
    name: string;
    className?: string;
}

interface Notification {
    id: number;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
}

export default function Header({ name, className }: HeaderProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: 1,
            title: "New Patient Registered",
            message: "John Doe has been registered successfully",
            timestamp: "5 min ago",
            read: false,
        },
        {
            id: 2,
            title: "Appointment Scheduled",
            message: "Appointment for Jane Smith at 2:00 PM",
            timestamp: "15 min ago",
            read: false,
        },
        {
            id: 3,
            title: "Bed Capacity Alert",
            message: "ICU capacity at 85%",
            timestamp: "1 hour ago",
            read: false,
        },
        {
            id: 4,
            title: "Lab Results Ready",
            message: "Lab results for Patient ID #12345",
            timestamp: "2 hours ago",
            read: true,
        },
    ]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

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
            <div className="flex items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                    {name}
                </h2>
            </div>

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
                        <div className="absolute right-0 z-50 mt-2 w-96 rounded-xl border-2 border-slate-200 bg-white shadow-lg">
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