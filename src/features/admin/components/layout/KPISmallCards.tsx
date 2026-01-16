"use client";
import React from "react";

interface KPICardProps {
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
}
export function KPISmallCard({ value, subtitle, icon }: KPICardProps) {
    return (
        // grid grid-cols-1 gap-6 md:grid-cols-4
        <div className="">
            <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300">
                {/* Icon and Value */}
                <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                        {icon}
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{value}</div>
                        {subtitle && (
                            <div className="mt-1 text-sm text-gray-500">{subtitle}</div>
                        )}
                    </div>
                </div>
            </div>
            {/* <KPICard
                title="Accepted today"
                value={156}
                icon={<UserCheck size={24} />}
                showViewDetails={false}
            /> */}

        </div>
    );
}