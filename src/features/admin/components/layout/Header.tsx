"use client";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Bell, Check } from "lucide-react";
import { useCurrentFacilityId } from "@/features/auth/auth-store";
import { useFacility } from "@/hooks/use-facilities";
import FacilityImageButton from "@/features/admin/components/ui/proifleImage";

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
  const facilityId = useCurrentFacilityId();
  const { data: facilityData } = useFacility(facilityId);
  const facility = facilityData?.facility;

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

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-10 h-16 w-full border-b border-gray-200 bg-white",
        "flex items-center justify-between px-6",
        className,
      )}
    >
      <div className="flex items-center">
        <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
      </div>
      <div>
        <div className="flex items-center gap-4">
          {/* Facility Image */}
          <FacilityImageButton
            facilityId={facilityId ?? ""}
            facilityName={facility?.facility_name}
            imageUrls={facility?.image_urls ?? []}
            lastUpdated={facility?.last_updated}
          />
        </div>
      </div>
    </header>
  );
}
