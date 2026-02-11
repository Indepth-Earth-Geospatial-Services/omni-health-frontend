"use client";

import { ScrollReveal } from "../shared/ScrollReveal";
import { Star } from "lucide-react";
import Image from "next/image";

const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: "Samantha Elizabeth",
    location: "Port Harcourt",
    image: "/img/testimonials/image1.jpg",
    testimonial:
      "I had an excellent experience at Rumueme HP during a recent emergency. The team was incredibly supportive and attentive, and I received prompt treatment. I truly felt cared for and reassured throughout the entire process.",
    rating: 5,
  },
  {
    id: 2,
    name: "Olivia Marie",
    location: "Port Harcourt",
    image: "/img/testimonials/image2.jpg",
    testimonial:
      "RVS-Healthcare has been my go-to for health consultations, and I am always impressed by the professionalism and genuine care from the doctors. They take the time to listen and explain things, making every visit feel personal.",
    rating: 5,
  },
  {
    id: 3,
    name: "Jessica Claire",
    location: "Port Harcourt",
    image: "/img/testimonials/image3.jpg",
    testimonial:
      "The specialists at RVS-Healthcare provided me with the guidance I needed to manage my health condition. Their expertise and timely support made a huge difference in my recovery, and I'm grateful for the comprehensive care I received.",
    rating: 5,
  },
];

function TestimonialCard({
  name,
  location,
  image,
  testimonial,
  rating,
  delay = 0,
}: {
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
          <div className="mb-6 flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-white md:h-20 md:w-20">
              <Image src={image} alt={name} fill className="object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white md:text-xl">
                {name}
              </h3>
              <p className="text-sm text-white/80">{location}</p>
            </div>

            {/* Quote Icon */}
            <div className="ml-auto">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF8C42] md:h-12 md:w-12">
                <svg
                  className="h-5 w-5 text-white md:h-6 md:w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Testimonial Text */}
          <p className="mb-6 text-sm leading-relaxed text-white/90 italic md:text-base">
            {testimonial}
          </p>

          {/* Star Rating */}
          <div className="flex gap-1">
            {Array.from({ length: rating }).map((_, index) => (
              <Star
                key={index}
                className="h-4 w-4 fill-[#FFB800] text-[#FFB800] md:h-5 md:w-5"
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
    <section className="bg-primary overflow-x-hidden py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <h2 className="mb-3 text-center text-2xl font-medium text-white sm:text-3xl md:text-4xl lg:text-4xl">
            Hear from Those Who Trust Care Link
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200}>
          <p className="mx-auto mb-8 max-w-3xl px-4 text-center text-sm text-white/90 sm:mb-12 md:mb-16 md:text-base">
            Our patients experiences speak volumes. Hear how CareLink has
            provided compassionate, expert care and made a difference in their
            lives.
          </p>
        </ScrollReveal>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
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
