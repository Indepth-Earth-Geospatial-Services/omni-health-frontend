"use client";

import { ScrollReveal } from "../shared/ScrollReveal";
import { Star } from "lucide-react";
import Image from "next/image";

const TESTIMONIALS_DATA = [
    {
        id: 1,
        name: "Samantha Elizabeth",
        location: "Port Harcourt",
        image: "/img/landingpage/testi-1.jpg",
        testimonial: "I had an excellent experience at Rumueme HP during a recent emergency. The team was incredibly supportive and attentive, and I received prompt treatment. I truly felt cared for and reassured throughout the entire process.",
        rating: 5,
    },
    {
        id: 2,
        name: "Olivia Marie",
        location: "Port Harcourt",
        image: "/img/landingpage/testi-2.jpg",
        testimonial: "RVS-Healthcare has been my go-to for health consultations, and I am always impressed by the professionalism and genuine care from the doctors. They take the time to listen and explain things, making every visit feel personal.",
        rating: 5,
    },
    {
        id: 3,
        name: "Jessica Claire",
        location: "Port Harcourt",
        image: "/img/landingpage/testi-3.jpg",
        testimonial: "The specialists at RVS-Healthcare provided me with the guidance I needed to manage my health condition. Their expertise and timely support made a huge difference in my recovery, and I'm grateful for the comprehensive care I received.",
        rating: 5,
    },
];

function TestimonialCard({ name, location, image, testimonial, rating, delay = 0 }: {
    name: string;
    location: string;
    image: string;
    testimonial: string;
    rating: number;
    delay?: number;
}) {
    return (
        <ScrollReveal direction="up" delay={delay}>
            <div className="relative">
                {/* Card Content */}
                <div className="bg-transparent">
                    {/* Profile Section */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-white">
                            <Image
                                src={image}
                                alt={name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h3 className="text-lg md:text-xl font-bold text-white">
                                {name}
                            </h3>
                            <p className="text-sm text-white/80">
                                {location}
                            </p>
                        </div>

                        {/* Quote Icon */}
                        <div className="ml-auto">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#FF8C42] flex items-center justify-center">
                                <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-sm md:text-base text-white/90 leading-relaxed mb-6 italic">
                        {testimonial}
                    </p>

                    {/* Star Rating */}
                    <div className="flex gap-1">
                        {Array.from({ length: rating }).map((_, index) => (
                            <Star
                                key={index}
                                className="w-4 h-4 md:w-5 md:h-5 fill-[#FFB800] text-[#FFB800]"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </ScrollReveal>
    );
}

export default function Testimonials() {
    return (
        <section className="py-12 sm:py-16 md:py-20 bg-primary overflow-x-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <ScrollReveal direction="up">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-medium text-center text-white mb-3">
                        Hear from Those Who Trust Care Link
                    </h2>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={200}>
                    <p className="text-sm md:text-base text-center text-white/90 max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16 px-4">
                        Our patients experiences speak volumes. Hear how CareLink has provided compassionate, expert care and made a difference in their lives.
                    </p>
                </ScrollReveal>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-6 lg:gap-8">
                    {TESTIMONIALS_DATA.map((testimonial, index) => (
                        <TestimonialCard
                            key={testimonial.id}
                            name={testimonial.name}
                            location={testimonial.location}
                            image={testimonial.image}
                            testimonial={testimonial.testimonial}
                            rating={testimonial.rating}
                            delay={index * 100}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
