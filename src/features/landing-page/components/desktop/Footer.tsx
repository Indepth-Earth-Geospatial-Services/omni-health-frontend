"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { FaTelegram, FaWhatsapp } from "react-icons/fa";

const FOOTER_INFO = {
  phone: "+234 803 123 4567,\n+234 805 987 6543",
  email: "info@rsphcmb.gov.ng",
  address:
    "323 Port Harcourt - Aba Expy, Rumueme, Port Harcourt 500101, Rivers State, Nigeria",
  lat: 4.817228782038779,
  lng: 7.008422601850561,
} as const;

const MAPS_EMBED_URL =
  `https://maps.google.com/maps?q=${FOOTER_INFO.lat},${FOOTER_INFO.lng}&z=16&output=embed` as const;

const MAPS_LINK_URL =
  `https://www.google.com/maps?q=${FOOTER_INFO.lat},${FOOTER_INFO.lng}` as const;

// const NAV_LINKS = [
//   { label: "Services", href: "#services" },
//   { label: "About us", href: "#about" },
//   { label: "Blog", href: "#blog" },
//   { label: "Contacts", href: "#contacts" },
// ] as const;

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative overflow-hidden bg-[#F6F8FA] pt-8 pb-16 sm:pt-12 sm:pb-20">
      <div className="container mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="flex w-full flex-col items-start justify-center gap-8 lg:flex-row lg:gap-12">
          {/* Left Section */}
          <div className="flex w-full flex-col items-start justify-between gap-8 sm:gap-12 lg:w-1/2 lg:gap-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex w-full flex-row items-center gap-3 py-3 md:justify-start"
            >
              <div className="relative h-8 w-9 flex-shrink-0">
                <Image
                  src="/img/icons/svg/logo.svg"
                  alt="RVS Healthcare Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-primary font-geist text-base font-normal sm:text-lg">
                RVS-HealthCare
              </span>
            </Link>

            {/* Map */}
            <div className="h-48 w-full overflow-hidden rounded-lg sm:h-56 md:h-64">
              <iframe
                src={MAPS_EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Rivers State Primary Healthcare Management Board location"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex w-full flex-col items-start justify-between gap-8 sm:gap-12 lg:w-1/2 lg:gap-16">
            {/* Top */}
            <div className="flex w-full items-start justify-between gap-8 sm:gap-12">
              {/* Info Links */}
              {/* <div className="flex flex-col items-start gap-4 sm:gap-5">
                <h3 className="font-inter text-[10px] leading-[15px] font-medium tracking-[0.04em] text-[#14181F] uppercase opacity-40">
                  INFO
                </h3>
                <div className="flex flex-col items-start gap-1">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="hover:text-primary font-inter text-sm leading-[20px] font-medium text-[#14181F] transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div> */}

              {/* Social Media */}
              <div className="flex flex-row items-center gap-2">
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary hover:bg-primary/90 flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-full transition-colors"
                  aria-label="Telegram"
                >
                  <FaTelegram className="h-4 w-5 text-[#FCFCFD]" />
                </a>
                <a
                  href="https://wa.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary hover:bg-primary/90 flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-full transition-colors"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp className="h-5 w-5 text-[#FCFCFD]" />
                </a>
              </div>
            </div>

            {/* Bottom */}
            <div className="flex w-full flex-col items-start justify-between gap-6 sm:gap-8">
              {/* Contact Us */}
              <div className="flex w-full flex-col items-start gap-3 sm:gap-4">
                <h3 className="font-inter text-[10px] leading-[15px] font-medium tracking-[0.04em] text-[#14181F] uppercase opacity-40">
                  CONTACT US
                </h3>
                <a
                  href={`tel:${FOOTER_INFO.phone}`}
                  className="hover:text-primary font-inter text-sm leading-[20px] font-medium text-[#14181F] transition-colors"
                >
                  {FOOTER_INFO.phone}
                </a>
              </div>

              {/* Location and Email Group */}
              <div className="flex w-full flex-col items-start gap-6 sm:flex-row sm:gap-8">
                {/* Location */}
                <div className="flex w-full flex-col items-start gap-3 sm:w-1/2 sm:gap-4">
                  <h3 className="font-inter text-[10px] leading-[15px] font-medium tracking-[0.04em] text-[#14181F] uppercase opacity-40">
                    LOCATION
                  </h3>
                  <a
                    href={MAPS_LINK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary font-inter text-sm leading-5 font-medium text-[#14181F] transition-colors"
                  >
                    {FOOTER_INFO.address}
                  </a>
                </div>

                {/* Email */}
                <div className="flex w-full flex-col items-start gap-3 sm:w-1/2 sm:gap-4">
                  <h3 className="font-inter text-[10px] leading-[15px] font-medium tracking-[0.04em] text-[#14181F] uppercase opacity-40">
                    EMAIL
                  </h3>
                  <a
                    href={`mailto:${FOOTER_INFO.email}`}
                    className="hover:text-primary font-inter text-sm leading-[20px] font-medium break-words text-[#14181F] transition-colors"
                  >
                    {FOOTER_INFO.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright - Rotated on right side (all screen sizes) */}
      <div className="pointer-events-none fixed right-2 bottom-28 z-40 sm:right-4 sm:bottom-32 md:right-6 md:bottom-36 lg:right-8 lg:bottom-40">
        <div className="flex items-center justify-center">
          <p className="font-inter -rotate-90 text-[10px] leading-[14px] font-medium whitespace-nowrap text-[#14181F] opacity-40 sm:text-[11px]">
            © 2026 — Copyright
          </p>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="bg-primary hover:bg-primary/90 fixed bottom-4 left-4 z-50 flex h-10 w-10 flex-col items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 sm:bottom-8 sm:left-8"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-3.5 w-3 text-[#F9FAFB]" strokeWidth={1.4} />
      </button>
    </footer>
  );
}
