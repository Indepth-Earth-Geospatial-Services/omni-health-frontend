"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { FaTelegram, FaWhatsapp } from "react-icons/fa";

const FOOTER_INFO = {
    phone: "+1 999 888-76-54",
    email: "hello@logoipsum.com",
    address: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
} as const;

const NAV_LINKS = [
    { label: "Services", href: "#services" },
    { label: "About us", href: "#about" },
    { label: "Blog", href: "#blog" },
    { label: "Contacts", href: "#contacts" },
] as const;

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <footer className="relative bg-[#F6F8FA] pt-8 sm:pt-12 pb-16 sm:pb-20 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl w-full">
                {/* Main Content */}
                <div className="flex flex-col lg:flex-row justify-center items-start gap-8 lg:gap-12 w-full">
                    {/* Left Section */}
                    <div className="flex flex-col justify-between items-start w-full lg:w-1/2 gap-8 sm:gap-12 lg:gap-16">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex flex-row items-center py-3 gap-3 w-full md:justify-start"
                        >
                            <div className="relative w-9 h-8 flex-shrink-0">
                                <Image
                                    src="/img/icons/svg/logo.svg"
                                    alt="RVS Healthcare Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-primary text-base sm:text-lg font-normal font-geist">
                                RVS-HealthCare
                            </span>
                        </Link>

                        {/* Map */}
                        <div className="relative w-full h-48 sm:h-56 md:h-64">
                            <Image
                                src="/img/landingpage/footer-map.png"
                                alt="Location map"
                                fill
                                className="object-cover rounded-lg"
                            />
                            {/* Map Marker */}
                            <div className="absolute left-[48.35%] top-[39.77%]">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6 sm:w-7 sm:h-7"
                                >
                                    <path
                                        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                                        fill="#FF4646"
                                        stroke="#D73534"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <circle
                                        cx="12"
                                        cy="10"
                                        r="3"
                                        fill="#590000"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col justify-between items-start w-full lg:w-1/2 gap-8 sm:gap-12 lg:gap-16">
                        {/* Top */}
                        <div className="flex justify-between items-start w-full gap-8 sm:gap-12">
                            {/* Info Links */}
                            <div className="flex flex-col items-start gap-4 sm:gap-5">
                                <h3 className="text-[10px] leading-[15px] font-medium tracking-[0.04em] uppercase text-[#14181F] opacity-40 font-inter">
                                    INFO
                                </h3>
                                <div className="flex flex-col items-start gap-1">
                                    {NAV_LINKS.map((link) => (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            className="text-sm leading-[20px] font-medium text-[#14181F] hover:text-primary transition-colors font-inter"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="flex flex-row items-center gap-2">
                                <a
                                    href="https://t.me"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col justify-center items-center w-10 h-10 bg-primary rounded-full hover:bg-primary/90 transition-colors flex-shrink-0"
                                    aria-label="Telegram"
                                >
                                    <FaTelegram className="w-5 h-4 text-[#FCFCFD]" />
                                </a>
                                <a
                                    href="https://wa.me"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col justify-center items-center w-10 h-10 bg-primary rounded-full hover:bg-primary/90 transition-colors flex-shrink-0"
                                    aria-label="WhatsApp"
                                >
                                    <FaWhatsapp className="w-5 h-5 text-[#FCFCFD]" />
                                </a>
                            </div>
                        </div>

                        {/* Bottom */}
                        <div className="flex flex-col justify-between items-start gap-6 sm:gap-8 w-full">
                            {/* Contact Us */}
                            <div className="flex flex-col items-start gap-3 sm:gap-4 w-full">
                                <h3 className="text-[10px] leading-[15px] font-medium tracking-[0.04em] uppercase text-[#14181F] opacity-40 font-inter">
                                    CONTACT US
                                </h3>
                                <a
                                    href={`tel:${FOOTER_INFO.phone}`}
                                    className="text-sm leading-[20px] font-medium text-[#14181F] hover:text-primary transition-colors font-inter"
                                >
                                    {FOOTER_INFO.phone}
                                </a>
                            </div>

                            {/* Location and Email Group */}
                            <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8 w-full">
                                {/* Location */}
                                <div className="flex flex-col items-start gap-3 sm:gap-4 w-full sm:w-1/2">
                                    <h3 className="text-[10px] leading-[15px] font-medium tracking-[0.04em] uppercase text-[#14181F] opacity-40 font-inter">
                                        LOCATION
                                    </h3>
                                    <p className="text-sm leading-[20px] font-medium text-[#14181F] font-inter">
                                        {FOOTER_INFO.address}
                                    </p>
                                </div>

                                {/* Email */}
                                <div className="flex flex-col items-start gap-3 sm:gap-4 w-full sm:w-1/2">
                                    <h3 className="text-[10px] leading-[15px] font-medium tracking-[0.04em] uppercase text-[#14181F] opacity-40 font-inter">
                                        EMAIL
                                    </h3>
                                    <a
                                        href={`mailto:${FOOTER_INFO.email}`}
                                        className="text-sm leading-[20px] font-medium text-[#14181F] hover:text-primary transition-colors font-inter break-words"
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
            <div className="fixed right-2 sm:right-4 md:right-6 lg:right-8 bottom-28 sm:bottom-32 md:bottom-36 lg:bottom-40 pointer-events-none z-40">
                <div className="flex items-center justify-center">
                    <p className="text-[10px] sm:text-[11px] leading-[14px] font-medium text-[#14181F] opacity-40 -rotate-90 font-inter whitespace-nowrap">
                        © 2026 — Copyright
                    </p>
                </div>
            </div>

            {/* Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className="fixed left-4 sm:left-8 bottom-4 sm:bottom-8 w-10 h-10 bg-primary rounded-full flex flex-col justify-center items-center hover:bg-primary/90 transition-all hover:scale-105 z-50 shadow-lg"
                aria-label="Scroll to top"
            >
                <ArrowUp className="w-3 h-3.5 text-[#F9FAFB]" strokeWidth={1.4} />
            </button>
        </footer>
    );
}
