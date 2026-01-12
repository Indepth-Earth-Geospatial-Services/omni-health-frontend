"use client";

import { ScrollReveal } from "../shared/ScrollReveal";
import { FeatureCard } from "../shared/FeatureCard";
import { Syringe, MapPin, Hospital } from "lucide-react";

export default function Transparency() {
    return (
        <section className="py-16 md:py-20 bg-[#EEF6F5]">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <ScrollReveal direction="up">
                    <h2 className="text-xl md:text-2xl lg:text-4xl font-medium text-center text-[#0A0D14] mb-3">
                        Healthcare Transparency Platform
                    </h2>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={200}>
                    <p className="text-sm md:text-base lg:text-lg text-center text-gray-600 max-w-3xl mx-auto mb-12 md:mb-16">
                        Bridging the information gap between patients and healthcare providers through location intelligence and data transparency
                    </p>
                </ScrollReveal>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ScrollReveal direction="up" delay={0}>
                        <FeatureCard
                            icon={<Syringe className="text-primary" size={28} />}
                            title="Centralized Health Facility Registry"
                            description="Complete database of verified medical facilities with real-time operational status and service offerings"
                            size="lg"
                            bgColor="bg-[#B8D8D4]"
                        />
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={100}>
                        <FeatureCard
                            icon={<MapPin className="text-primary" size={28} />}
                            title="GIS-Based Discovery"
                            description="Location-intelligent search powered by geographic data to find the nearest appropriate healthcare facility"
                            size="lg"
                            bgColor="bg-primary"
                            iconBgColor="bg-[#B8D8D4]"
                            titleColor="text-white"
                            descriptionColor="text-white/90"
                        />
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={200}>
                        <FeatureCard
                            icon={<Hospital className="text-primary" size={28} />}
                            title="Specialist Access"
                            description="Direct access to specialist availability, qualifications, and appointment scheduling across facilities"
                            size="lg"
                            bgColor="bg-[#B8D8D4]"
                        />
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
