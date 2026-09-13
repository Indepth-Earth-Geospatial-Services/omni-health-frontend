"use client";

import { ScrollReveal } from "../shared/ScrollReveal";

export default function Trust() {
  const features = [
    {
      id: "01",
      title: "Centralized, Single Source of Truth",
      description:
        "All facility data is maintained in one authoritative registry by the Rivers State Primary Healthcare Management Board",
      theme: "#B9D9D6",
    },
    {
      id: "02",
      title: "Government Alignment",
      description:
        "Compliant with national health standards and regulatory frameworks",
      theme: "#EEF6F5",
    },
    {
      id: "03",
      title: "Privacy & Compliance",
      description:
        "NDPR-compliant data protection with secure, role-based access control, aligned with Nigeria's data protection standards",
      theme: "#EEF6F5",
    },
    {
      id: "04",
      title: "Actively Maintained Records",
      description:
        "Facility records are kept current by registered facility administrators, with visible last-updated timestamps",
      theme: "#B9D9D6",
    },
  ];

  return (
    <section className="w-full overflow-x-hidden bg-white py-20 sm:py-24 md:py-32 lg:py-40">
      <div className="container mx-auto max-w-fit px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Header Section */}
        <div className="mb-8 flex flex-col items-center gap-4 sm:mb-12 sm:gap-6 md:mb-16 md:gap-8">
          <ScrollReveal direction="up">
            <h2 className="max-w-2xl text-center text-2xl leading-tight font-medium text-[#0A0D14] sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl">
              Built on Trust & Transparency
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <p className="max-w-2xl text-center text-sm text-gray-600 sm:text-base md:text-base lg:text-lg">
              Our commitment to data integrity, security, and compliance ensures
              reliable healthcare information for everyone
            </p>
          </ScrollReveal>
        </div>

        {/* Grid Section */}
        <div className="grid w-full grid-cols-1 gap-0 overflow-hidden rounded-xl md:grid-cols-2 md:rounded-2xl">
          {features.map((item, index) => (
            <ScrollReveal
              key={item.id}
              direction="up"
              delay={index * 100}
              className="h-full"
            >
              <div
                style={{ backgroundColor: item.theme }}
                className="flex h-full w-full items-start gap-3 px-5 py-8 sm:gap-4 sm:px-6 sm:py-10 md:gap-4 md:px-6 md:py-10 lg:gap-5 lg:px-8 lg:py-12 xl:gap-6 xl:px-10 xl:py-14"
              >
                {/* Number Badge */}
                <div className="shrink-0">
                  <span className="bg-primary flex h-10 w-10 items-center justify-center rounded-full text-base font-bold text-white sm:h-12 sm:w-12 sm:text-lg md:h-12 md:w-12 md:text-lg lg:h-13 lg:w-13 lg:text-lg xl:h-14 xl:w-14 xl:text-xl">
                    {item.id}
                  </span>
                </div>

                {/* Text Content */}
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1.5 text-base leading-snug font-medium text-[#0A0D14] sm:mb-2 sm:text-lg md:mb-2 md:text-lg lg:text-xl xl:text-2xl">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-gray-600 sm:text-sm md:text-sm lg:text-base">
                    {item.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
