"use client";

import { ScrollReveal } from "../shared/ScrollReveal";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

// Statistics data
const STATS_DATA = [
    {
        end: 2400,
        suffix: "+",
        description: "Verified facilities",
        decimals: 0,
    },
    {
        end: 62,
        suffix: "+",
        description: "Patient Searches",
        decimals: 0,
    },
    {
        end: 99.9,
        suffix: "%",
        description: "Data Accuracy",
        decimals: 1,
    },
    {
        value: "24/7",
        description: "Platform Availability",
        isStatic: true,
    },
] as const;

interface StatsItemProps {
    end?: number;
    suffix?: string;
    decimals?: number;
    value?: string;
    description: string;
    delay?: number;
    isStatic?: boolean;
}

function StatsItem({ end, suffix, decimals = 0, value, description, delay = 0, isStatic = false }: StatsItemProps) {
    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true,
    });

    return (
        <ScrollReveal direction="up" delay={delay}>
            <div ref={ref} className="flex flex-col items-center text-center py-6 md:py-0">
                <h3 className="text-2xl md:text-4xl lg:text-4xl font-inter font-bold text-[#0A0D14] mb-2">
                    {isStatic ? (
                        value
                    ) : (
                        <CountUp
                            start={0}
                            end={end || 0}
                            duration={2.5}
                            decimals={decimals}
                            suffix={suffix}
                            enableScrollSpy={false}
                            redraw={false}
                        >
                            {({ countUpRef, start }) => {
                                if (inView) {
                                    start();
                                }
                                return <span ref={countUpRef} />;
                            }}
                        </CountUp>
                    )}
                </h3>
                <p className="text-sm md:text-base text-gray-600 font-normal">
                    {description}
                </p>
            </div>
        </ScrollReveal>
    );
}

export default function Stats() {
    return (
        <section className="bg-white py-8 md:py-16 md:my-30">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:gap-12">
                    {STATS_DATA.map((stat, index) => (
                        <StatsItem
                            key={stat.description}
                            end={'end' in stat ? stat.end : undefined}
                            suffix={'suffix' in stat ? stat.suffix : undefined}
                            decimals={'decimals' in stat ? stat.decimals : undefined}
                            value={'value' in stat ? stat.value : undefined}
                            isStatic={'isStatic' in stat ? stat.isStatic : false}
                            description={stat.description}
                            delay={index * 100}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}


