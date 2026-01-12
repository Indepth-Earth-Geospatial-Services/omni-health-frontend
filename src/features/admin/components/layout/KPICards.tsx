"use client";
import React from "react";
import { ChevronRight, TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    showViewDetails?: boolean;
}

export default function KPICard({ title, value, subtitle, icon, trend, showViewDetails = true }: KPICardProps) {
    return (
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-gray-300">
            {/* Trend and View Details */}
            {(trend || showViewDetails) && (
                <div className="mb-4 flex items-center justify-between border-b bg-gray-50 border-gray-200 overflow-hidden py-4 px-4 pb-3 transition-all ">
                    {trend ? (
                        <div className={`flex items-center gap-1 text-sm font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"
                            }`}>
                            {trend.isPositive ? (
                                <TrendingUp size={16} />
                            ) : (
                                <TrendingDown size={16} />
                            )}
                            <span>{trend.value}</span>
                        </div>
                    ) : (
                        <div />
                    )}

                    {showViewDetails && (
                        <button className="flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
                            <span>View details</span>
                            <ChevronRight size={16} />
                        </button>
                    )}
                </div>
            )}

            {/* Icon and Value */}
            <div className="flex items-center gap-4 px-4 py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                    {icon}
                </div>
                <div>
                    {/* Title */}
                    <div className="mb-2 text-sm font-medium text-gray-600">{title}</div>
                    <div className={`text-3xl font-bold text-gray-900 ${!subtitle ? 'mb-4' : ''}`}>{value}</div>
                    {subtitle && (
                        <div className="mt-1 text-sm text-gray-500">{subtitle}</div>
                    )}
                </div>
            </div>
        </div>
    );
}
