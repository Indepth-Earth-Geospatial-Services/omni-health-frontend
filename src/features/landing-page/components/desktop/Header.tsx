"use client";

import { Mail, MapPin, Phone, LogIn } from "lucide-react";
import Link from "next/link";

const CONTACT_INFO = {
  location: "Rivers State, 500101",
  email: "support@geohealth.ng",
  phone: "+234 803 123 4567",
} as const;

interface ContactItemProps {
  icon: React.ReactNode;
  text: string;
  ariaLabel: string;
}

function ContactItem({ icon, text, ariaLabel }: ContactItemProps) {
  return (
    <div
      className="flex items-center gap-1.5 text-white/95"
      aria-label={ariaLabel}
    >
      <span className="flex-shrink-0" aria-hidden="true">
        {icon}
      </span>
      {/* whitespace-nowrap prevents the label from breaking mid-word */}
      <small className="text-[13px] font-normal whitespace-nowrap">
        {text}
      </small>
    </div>
  );
}

function Divider() {
  return (
    <div className="text-[18px] text-white/40 select-none" aria-hidden="true">
      |
    </div>
  );
}

function AdminLoginButton() {
  return (
    <Link
      href="/login"
      className="flex items-center gap-1.5 bg-transparent px-4 py-1 text-[13px] font-normal text-white/95 transition hover:scale-105"
      aria-label="Administrator login"
    >
      <LogIn size={14} strokeWidth={2} aria-hidden="true" />
      Login
    </Link>
  );
}

export default function Header() {
  return (
    <header className="bg-primary">
      {/* ── Utility Bar ── */}
      <div className="container mx-auto px-4 py-5 md:py-2.5">
        {/* Desktop: cols shrink to content — contact info gets all remaining space in the middle */}
        <div className="hidden md:grid md:grid-cols-[auto_1fr_auto] md:items-center">
          {/* Col 1 — shrinks to zero, pure optical spacer */}
          <div aria-hidden="true" />

          {/* Col 2 — contact info, centred, never wraps */}
          <div className="flex items-center justify-center gap-4 lg:gap-6">
            <ContactItem
              icon={<MapPin size={16} strokeWidth={2} />}
              text={CONTACT_INFO.location}
              ariaLabel="Office location"
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

          {/* Col 3 — shrinks to button width, pinned right */}
          <div className="flex justify-end">
            <AdminLoginButton />
          </div>
        </div>
      </div>
      {/* ── End Utility Bar ── */}
    </header>
  );
}
