"use client";
import React from "react";
import { Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";
import { ChevronRight } from "lucide-react";

const data = [
    { month: "Jan", current: 70, previous: 79 },
    { month: "Feb", current: 18, previous: 60 },
    { month: "Mar", current: 32, previous: 74 },
    { month: "Apr", current: 20, previous: 68 },
    { month: "May", current: 41, previous: 73 },
    { month: "Jun", current: 10, previous: 87 },
    { month: "Jul", current: 58, previous: 98 },
    { month: "Aug", current: 15, previous: 72 },
    { month: "Sept", current: 58, previous: 74 },
    { month: "Oct", current: 51, previous: 75 },
    { month: "Nov", current: 90, previous: 93 },
    { month: "Dec", current: 43, previous: 63 },
];

interface AdmissionsRateChartProps {
    title?: string;
    showViewMore?: boolean;
}

export default function AdmissionsRateChart({
    title = "Admissions Rate",
    showViewMore = true
}: AdmissionsRateChartProps) {
    return (
        <div className="w-full rounded-xl border border-gray-200 bg-white p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                {showViewMore && (
                    <button className="flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
                        <span>View more</span>
                        <ChevronRight size={16} />
                    </button>
                )}
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={300}>
                <ComposedChart
                    data={data}
                    margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e5e7eb"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        domain={[0, 100]}
                        ticks={[0, 20, 40, 60, 80, 100]}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '8px 12px'
                        }}
                        labelStyle={{ color: '#111827', fontWeight: 600, marginBottom: '4px' }}
                        itemStyle={{ color: '#6b7280', fontSize: '12px' }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="square"
                        iconSize={10}
                        wrapperStyle={{
                            paddingTop: '20px',
                            fontSize: '12px'
                        }}
                    />
                    <Bar
                        dataKey="current"
                        fill="#51a199"
                        name="2024"
                        radius={[4, 4, 0, 0]}
                        barSize={30}
                    />
                    <Line
                        type="monotone"
                        dataKey="previous"
                        stroke="#9ca3af"
                        strokeWidth={2}
                        name="2023"
                        dot={{ fill: '#9ca3af', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}