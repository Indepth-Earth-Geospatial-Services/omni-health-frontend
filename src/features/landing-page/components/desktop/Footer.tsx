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
        <footer className="relative bg-[#F6F8FA] pt-12 pb-0">
            <div className="max-w-[1512px] mx-auto px-4 md:px-40">
                {/* Main Content */}
                <div className="flex flex-col md:flex-row justify-center items-start gap-8 isolate">
                    {/* Left Section */}
                    <div className="flex flex-col justify-between items-start w-full md:w-[544px] gap-[197px] h-auto md:h-[493px]">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex flex-row items-center py-3 pr-5 gap-3 w-[301px] h-[57px] mx-auto md:mx-0"
                        >
                            <div className="relative w-9 h-[33px]">
                                <Image
                                    src="/img/icons/svg/logo.svg"
                                    alt="RVS Healthcare Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-primary text-[19px] leading-[25px] font-normal font-geist">
                                RVS-HealthCare
                            </span>
                        </Link>

                        {/* Map */}
                        <div className="relative w-full md:w-[544px] h-[264px] mx-auto md:mx-0">
                            <Image
                                src="/img/landingpage/footer-map.png"
                                alt="Location map"
                                fill
                                className="object-cover"
                            />
                            {/* Map Marker */}
                            <div className="absolute left-[48.35%] top-[39.77%]">
                                <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
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
                    <div className="flex flex-col justify-between items-start pb-6 gap-[125px] w-full md:w-[544px] h-auto md:h-[493px]">
                        {/* Top */}
                        <div className="flex flex-col md:flex-row justify-between items-start w-full gap-8 md:gap-[357px]">
                            {/* Info Links */}
                            <div className="flex flex-col items-start gap-5 w-[61px]">
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
                            <div className="flex flex-row items-center gap-2 w-[88px] h-10">
                                <a
                                    href="https://t.me"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col justify-center items-center w-10 h-10 bg-primary rounded-full hover:bg-primary/90 transition-colors"
                                    aria-label="Telegram"
                                >
                                    <FaTelegram className="w-5 h-4 text-[#FCFCFD]" />
                                </a>
                                <a
                                    href="https://wa.me"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col justify-center items-center w-10 h-10 bg-primary rounded-full hover:bg-primary/90 transition-colors"
                                    aria-label="WhatsApp"
                                >
                                    <FaWhatsapp className="w-5 h-5 text-[#FCFCFD]" />
                                </a>
                            </div>
                        </div>

                        {/* Bottom */}
                        <div className="flex flex-col justify-between items-start gap-[62px] w-full md:w-[544px]">
                            {/* Contact Us */}
                            <div className="flex flex-col items-start gap-4 w-[315px]">
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
                            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-8 w-full md:w-[544px]">
                                {/* Location */}
                                <div className="flex flex-col items-start gap-4 w-full md:w-64">
                                    <h3 className="text-[10px] leading-[15px] font-medium tracking-[0.04em] uppercase text-[#14181F] opacity-40 font-inter w-full">
                                        LOCATION
                                    </h3>
                                    <p className="text-sm leading-[20px] font-medium text-[#14181F] w-full font-inter">
                                        {FOOTER_INFO.address}
                                    </p>
                                </div>

                                {/* Email */}
                                <div className="flex flex-col items-start gap-4 w-full md:w-64">
                                    <h3 className="text-[10px] leading-[15px] font-medium tracking-[0.04em] uppercase text-[#14181F] opacity-40 font-inter w-full">
                                        EMAIL
                                    </h3>
                                    <a
                                        href={`mailto:${FOOTER_INFO.email}`}
                                        className="text-sm leading-[20px] font-medium text-[#14181F] hover:text-primary transition-colors w-full font-inter"
                                    >
                                        {FOOTER_INFO.email}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright - Rotated */}
            <div className="absolute -right-[51px] bottom-[110px] text-[10px] leading-[14px] font-medium text-[#14181F] opacity-40 -rotate-90 font-inter">
                © 2023 — Copyright
            </div>

            {/* Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className="absolute left-8 bottom-8 w-10 h-10 bg-primary rounded-full flex flex-col justify-center items-center hover:bg-primary/90 transition-all hover:scale-105"
                aria-label="Scroll to top"
            >
                <ArrowUp className="w-3 h-[14px] text-[#F9FAFB]" strokeWidth={1.4} />
            </button>
        </footer>
    );
}
