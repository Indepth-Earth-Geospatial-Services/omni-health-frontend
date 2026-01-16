"use client";

import { ScrollReveal } from "../shared/ScrollReveal";

export default function Trust() {
    const features = [
        {
            id: "01",
            title: "Data Integrity & Audit Trails",
            description: "Every data point is timestamped and traceable with comprehensive audit logging",
            theme: "#B9D9D6",
        },
        {
            id: "02",
            title: "Government Alignment",
            description: "Compliant with national health standards and regulatory frameworks",
            theme: "#EEF6F5",
        },
        {
            id: "03",
            title: "Privacy & Compliance",
            description: "HIPAA-compliant data protection with end-to-end encryption",
            theme: "#EEF6F5",
        },
        {
            id: "04",
            title: "Real-Time Verification",
            description: "Continuous facility verification and credential validation processes",
            theme: "#B9D9D6",
        },
    ];

    return (
        <section className="w-full bg-white py-20 sm:py-24 md:py-32 lg:py-40 overflow-x-hidden">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-fit">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16">
                    <ScrollReveal direction="up">
                        <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-medium text-[#0A0D14] leading-tight max-w-md">
                            Built on Trust & <br />
                            Transparency
                        </h2>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={200}>
                        <p className="text-sm sm:text-base md:text-base lg:text-lg text-gray-600 max-w-xs sm:max-w-sm lg:max-w-md">
                            Our commitment to data integrity, security, and compliance ensures reliable healthcare information for everyone
                        </p>
                    </ScrollReveal>
                </div>

                {/* Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-xl md:rounded-2xl w-full">
                    {features.map((item, index) => (
                        <ScrollReveal key={item.id} direction="up" delay={index * 100} className="h-full">
                            <div
                                style={{ backgroundColor: item.theme }}
                                className="h-full w-full px-5 py-8 sm:px-6 sm:py-10 md:px-6 md:py-10 lg:px-8 lg:py-12 xl:px-10 xl:py-14 flex items-start gap-3 sm:gap-4 md:gap-4 lg:gap-5 xl:gap-6"
                            >
                                {/* Number Badge */}
                                <div className="shrink-0">
                                    <span className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-13 lg:h-13 xl:w-14 xl:h-14 rounded-full bg-primary text-white font-bold text-base sm:text-lg md:text-lg lg:text-lg xl:text-xl">
                                        {item.id}
                                    </span>
                                </div>

                                {/* Text Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base sm:text-lg md:text-lg lg:text-xl xl:text-2xl font-medium text-[#0A0D14] mb-1.5 sm:mb-2 md:mb-2 leading-snug">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm md:text-sm lg:text-base text-gray-600 leading-relaxed">
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
