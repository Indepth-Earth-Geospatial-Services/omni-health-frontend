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
          src="/img/landingpage/heroimage2.jpeg"
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
      <div className="relative z-10 container mx-auto flex h-screen items-center justify-start px-4 sm:px-6 lg:px-8">
        <div className="w-full lg:max-w-4xl">
          {/* Headline */}
          <div>
            <div>
              <h1 className="mb-4 text-3xl leading-tight font-bold text-white drop-shadow-2xl sm:text-4xl md:mb-6 md:text-5xl lg:text-6xl">
                Find the Right Medical Facility{" "}
                <br className="hidden sm:block" /> Based on Location, Capacity,{" "}
                <br className="hidden sm:block" /> and Performance
              </h1>
            </div>

            {/* Subheadline */}
            <div>
              <p className="mb-6 text-base text-white/90 drop-shadow-lg sm:text-lg md:mb-8 md:text-xl lg:text-2xl">
                Centralized, GIS-powered transparency for patients{" "}
                <br className="hidden sm:block" /> and healthcare providers
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 md:flex-row md:gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 w-52 rounded-full px-6 py-5 text-sm font-semibold text-white transition-all hover:scale-105 sm:px-8 sm:text-base md:w-76 md:px-10 md:py-6 md:text-lg"
            >
              <Link href="/login">Explore Facilities Near You</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="hover:text-primary w-52 rounded-full border-2 border-white bg-transparent px-6 py-5 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-white sm:px-8 sm:text-base md:w-76 md:px-10 md:py-6 md:text-lg"
            >
              <Link href="/login">Compare Facility</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
