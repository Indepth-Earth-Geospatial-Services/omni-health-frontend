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
        <section className="w-full bg-white py-26 md:py-40">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-12 md:mb-16">
                    <ScrollReveal direction="up">
                        <h2 className="text-xl md:text-2xl lg:text-4xl font-medium text-[#0A0D14] leading-tight">
                            Built on Trust & <br />
                            Transparency
                        </h2>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={200}>
                        <p className="text-sm md:text-base text-gray-600 w-72 md:w-96">
                            Our commitment to data integrity, security, and compliance ensures reliable healthcare information for everyone
                        </p>
                    </ScrollReveal>
                </div>

                {/* Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-2xl">
                    {features.map((item, index) => (
                        <ScrollReveal key={item.id} direction="up" delay={index * 100}>
                            <div
                                style={{ backgroundColor: item.theme }}
                                className="px-6 py-10 md:px-10 md:py-16 flex items-start gap-4 md:gap-6"
                            >
                                {/* Number Badge */}
                                <div className="shrink-0">
                                    <span className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary text-white font-bold text-lg md:text-xl">
                                        {item.id}
                                    </span>
                                </div>

                                {/* Text Content */}
                                <div className="flex-1">
                                    <h3 className="text-lg md:text-xl lg:text-2xl font-medium text-[#0A0D14] mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
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
