"use client";

import { ScrollReveal } from "../shared/ScrollReveal";
import { FeatureCard } from "../shared/FeatureCard";
import { MapPin, Building2, GitCompareArrows, Navigation } from "lucide-react";

export default function DemoSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#EEF6F5] overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-[#0A0D14] mb-3">
            How It Works
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200}>
          <p className="text-sm md:text-base lg:text-lg text-center text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-16 px-4">
            Find the right healthcare facility in four simple steps no sign-up required
          </p>
        </ScrollReveal>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <ScrollReveal direction="up" delay={0}>
            <FeatureCard
              icon={<MapPin className="text-primary" size={24} />}
              title="Detect Your Location"
              description="Automatic location detection, or search any LGA manually to see facilities in that area"
              size="md"
              bgColor="bg-[#B8D8D4]"
            />
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <FeatureCard
              icon={<Building2 className="text-primary" size={24} />}
              title="Explore Nearby Facilities"
              description="Browse verified facilities with services, working hours, and contact details"
              size="md"
              bgColor="bg-[#B8D8D4]"
            />
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <FeatureCard
              icon={<GitCompareArrows className="text-primary" size={24} />}
              title="Compare Facilities Side-by-Side"
              description="Select two facilities to compare services, distance, and directions before you decide"
              size="md"
              bgColor="bg-[#B8D8D4]"
            />
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <FeatureCard
              icon={<Navigation className="text-primary" size={24} />}
              title="Get Directions or Call"
              description="Reach out directly call the facility or get turn-by-turn directions, no booking needed"
              size="md"
              bgColor="bg-[#B8D8D4]"
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
