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
          src="/img/landingpage/heroimage.jpg"
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
      <div className="relative z-10 container mx-auto px-4 h-screen flex items-center justify-start">
        <div className="">
          {/* Headline */}
          <div>
            <div>
              <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 drop-shadow-2xl">
                Find the Right Medical Facility <br /> Based on Location, Capacity, <br /> and Performance
              </h1>
            </div>

            {/* Subheadline */}
            <div>
              <p className="text-white/90 md:text-xl lg:text-2xl mb-8 drop-shadow-lg">
                Centralized, GIS-powered transparency for patients <br /> and healthcare providers
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary text-white hover:bg-primary/90 font-semibold px-10 py-6 transition-all hover:scale-105 rounded-full text-[14px] md:text-[18px] w-64 md:w-80"
            >
              <Link href="/user">Explore Facilities near you</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-transparent border-white border-2 text-white hover:bg-white hover:text-primary font-semibold px-10 py-6 transition-all hover:scale-105 rounded-full text-[14px] md:text-[18px] w-64 md:w-80"
            >
              <Link href="/user">Book Appointment</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
