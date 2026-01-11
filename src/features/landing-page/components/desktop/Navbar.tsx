"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Check if user scrolled more than 100px
          setIsScrolled(window.scrollY > 100);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Add scroll event listener with passive flag for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-primary/95 backdrop-blur-md shadow-lg py-2"
        : "bg-transparent py-4 top-15"
        }`}
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-8 w-8 md:h-10 md:w-10">
              <Image
                src="/img/icons/svg/logo.svg"
                alt="RVS Healthcare Logo"
                fill
                className="object-contain transition-transform group-hover:scale-105 brightness-0 invert"
                priority
              />
            </div>
            <h1 className="text-white text-[14px] md:text-[18px] font-semibold tracking-tight drop-shadow-lg transition-transform group-hover:scale-105">
              RVS-HealthCare
            </h1>
          </Link>

          {/* CTA Button - Hidden on mobile */}
          <div className="hidden md:flex gap-4 items-center">
            <div className="h-12 w-px bg-white/40" aria-hidden="true" />
            <Button
              asChild
              size="lg"
              className="bg-transparent border hover:border-none font-semibold transition-all hover:scale-105 rounded-full py-6 text-[18px]"
            >
              <Link href="/register-facility">Explore Facility</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
