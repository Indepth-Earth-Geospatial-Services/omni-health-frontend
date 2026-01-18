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
        : "bg-transparent py-3 sm:py-4 top-16 "
        }`}
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <div className="flex h-18 items-center px-4 gap-4">
              <Image
                src="/img/image.png"
                alt="Healthcare facility background"
                priority
                width={60}
                height={60}
                quality={75}
              />
              <h1 className="text-white text-sm sm:text-base md:text-xl font-bold tracking-tight drop-shadow-lg transition-transform group-hover:scale-105">
                RSPHCMB
              </h1>
            </div>
          </Link>

          {/* CTA Buttons - Hidden on mobile */}
          <div className="hidden md:flex gap-3 lg:gap-4 items-center">
            <div className="h-10 lg:h-12 w-px bg-white/40" aria-hidden="true" />
            {/* <Button
              asChild
              size="lg"
              className="bg-transparent border hover:border-none font-semibold transition-all hover:scale-105 rounded-full py-4 lg:py-6 text-base lg:text-lg px-6 lg:px-8"
            >
              <Link href="/user">Explore Facility</Link>
            </Button> */}
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold transition-all hover:scale-105 rounded-full py-4 lg:py-6 text-base lg:text-lg px-6 lg:px-8"
            >
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}