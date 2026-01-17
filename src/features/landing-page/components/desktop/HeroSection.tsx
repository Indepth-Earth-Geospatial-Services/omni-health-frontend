"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./Navbar";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/landingpage/heroimage.png"
          alt="Healthcare facility background"
          fill
          sizes="100vw"
          className="object-cover"
          priority
          quality={75}
        />

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      </div>

      {/* Navbar overlaying the hero */}
      <Navbar />

      {/* Hero Content - Text and Buttons on the right */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center justify-start">
        <div className="w-full lg:max-w-4xl">
          {/* Headline */}
          <div>
            <div>
              <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6 drop-shadow-2xl">
                Find the Right Medical Facility <br className="hidden sm:block" /> Based on Location, Capacity, <br className="hidden sm:block" /> and Performance
              </h1>
            </div>

            {/* Subheadline */}
            <div>
              <p className="text-white/90 text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 drop-shadow-lg">
                Centralized, GIS-powered transparency for patients <br className="hidden sm:block" /> and healthcare providers
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary text-white hover:bg-primary/90 font-semibold px-6 sm:px-8 md:px-10 py-5 md:py-6 transition-all hover:scale-105 rounded-full text-sm sm:text-base md:text-lg w-52 md:w-76"
            >
              <Link href="/user">Explore Facilities Near You</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-transparent border-white border-2 text-white hover:bg-white hover:text-primary font-semibold px-6 sm:px-8 md:px-10 py-5 md:py-6 transition-all hover:scale-105 rounded-full text-sm sm:text-base md:text-lg w-52 md:w-76"
            >
              <Link href="/user">Compare Facility</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
