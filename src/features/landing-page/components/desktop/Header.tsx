"use client";

import { Mail, MapPin, Phone } from "lucide-react";

// Contact information - centralized for easy updates
const CONTACT_INFO = {
  location: "Rivers State, 50001",
  email: "rvs-healthcare@gmail.com",
  phone: "+234 XXX XXX XXXX", // Replace with actual phone number
} as const;

interface ContactItemProps {
  icon: React.ReactNode;
  text: string;
  ariaLabel: string;
}

function ContactItem({ icon, text, ariaLabel }: ContactItemProps) {
  return (
    <div className="flex items-center gap-1.5 text-white/95" aria-label={ariaLabel}>
      <span className="flex-shrink-0" aria-hidden="true">
        {icon}
      </span>
      <small className="text-[13px] font-normal">{text}</small>
    </div>
  );
}

function Divider() {
  return (
    <div className="text-white/40 text-[18px] select-none" aria-hidden="true">
      |
    </div>
  );
}

export default function Header() {
  return (
    <header className="bg-primary">
      {/* Top Bar - Contact Info */}
      <div className="block">
        <div className="container mx-auto px-4 py-5 md:py-2.5">
          {/* Desktop Layout - All info in one row */}
          <div className="hidden md:flex items-center justify-center gap-4 lg:gap-6">
            <ContactItem
              icon={<MapPin size={16} strokeWidth={2} />}
              text={CONTACT_INFO.location}
              ariaLabel="Location"
            />
            <Divider />
            <ContactItem
              icon={<Mail size={16} strokeWidth={2} />}
              text={CONTACT_INFO.email}
              ariaLabel="Email address"
            />
            <Divider />
            <ContactItem
              icon={<Phone size={16} strokeWidth={2} />}
              text={CONTACT_INFO.phone}
              ariaLabel="Phone number"
            />
          </div>
        </div>
      </div>
    </header>
  );
}