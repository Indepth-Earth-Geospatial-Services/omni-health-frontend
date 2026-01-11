"use client";

import { ScrollReveal } from "../shared/ScrollReveal";
import { FeatureCard } from "../shared/FeatureCard";
import { MapPin, Building2, BarChart3, UserCheck } from "lucide-react";

export default function DemoSection() {
  return (
    <section className="py-16 md:py-20 bg-[#EEF6F5]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <h2 className="text-xl md:text-2xl lg:text-4xl font-bold text-center text-[#0A0D14] mb-3">
            How It Works
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200}>
          <p className="text-sm md:text-base lg:text-lg text-center text-gray-600 max-w-2xl mx-auto mb-12 md:mb-16">
            Four simple steps from search to appointment
          </p>
        </ScrollReveal>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ScrollReveal direction="up" delay={0}>
            <FeatureCard
              icon={<MapPin className="text-primary" size={24} />}
              title="Detect Location"
              description="LGA-based automatic location detection or manual area selection"
              size="md"
              bgColor="bg-[#B8D8D4]"
            />
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <FeatureCard
              icon={<Building2 className="text-primary" size={24} />}
              title="Explore Nearby Facilities"
              description="Browse verified facilities within proximity with real-time status"
              size="md"
              bgColor="bg-[#B8D8D4]"
            />
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <FeatureCard
              icon={<BarChart3 className="text-primary" size={24} />}
              title="Compare Performance Metrics"
              description="Review ratings, capacity, wait times, and specialization data"
              size="md"
              bgColor="bg-[#B8D8D4]"
            />
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <FeatureCard
              icon={<UserCheck className="text-primary" size={24} />}
              title="Request Specialist Appointment"
              description="Direct booking requests with available specialists at your chosen facility"
              size="md"
              bgColor="bg-[#B8D8D4]"
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
