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
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-primary/95 py-2 shadow-lg backdrop-blur-md"
          : "top-16 bg-transparent py-3 sm:py-4"
      }`}
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2 sm:gap-2.5">
            <div className="flex items-center gap-4 px-4">
              <Image
                src="/img/image.png"
                alt="Healthcare facility background"
                priority
                width={60}
                height={60}
                quality={75}
                className="h-10 w-10 md:h-15 md:w-15"
              />
              <h1 className="text-sm font-bold tracking-tight text-white drop-shadow-lg transition-transform group-hover:scale-105 sm:text-base md:text-xl">
                RSPHCMB
              </h1>
            </div>
          </Link>

          {/* CTA Buttons - Hidden on mobile */}
          <div className="hidden items-center gap-3 md:flex lg:gap-4">
            <div className="h-10 w-px bg-white/40 lg:h-12" aria-hidden="true" />
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
              className="text-primary rounded-full bg-white px-6 py-4 text-base font-semibold transition-all hover:scale-105 hover:bg-white/90 lg:px-8 lg:py-6 lg:text-lg"
            >
              <Link href="/user">Find Facility</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
