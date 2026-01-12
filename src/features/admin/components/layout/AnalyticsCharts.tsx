import React from "react";

const DotGrid = () => {
    const spacing = 24;
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ bottom: '32px' }}>
            <svg width="100%" height="100%" className="absolute inset-0">
                <defs>
                    <pattern id="dotPattern" x="0" y="0" width={spacing} height={spacing} patternUnits="userSpaceOnUse">
                        <circle cx={spacing / 2} cy={spacing / 2} r="2" fill="#d1d5db" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dotPattern)" />
            </svg>
        </div>
    );
};

export default function AnalyticsCharts() {
    const patientVolumeData = [
        { day: "Mon", outpatient: 56, inpatient: 39 },
        { day: "Tues", outpatient: 64, inpatient: 80 },
        { day: "Weds", outpatient: 76, inpatient: 15 },
        { day: "Thurs", outpatient: 78, inpatient: 17 },
        { day: "Fri", outpatient: 70, inpatient: 65 },
        { day: "Sat", outpatient: 37, inpatient: 15 },
        { day: "Sun", outpatient: 37, inpatient: 15 },
    ];

    const bedUtilizationData = [
        { day: "Mon", value: 56 },
        { day: "Tues", value: 64 },
        { day: "Weds", value: 76 },
        { day: "Thurs", value: 78 },
        { day: "Fri", value: 70 },
        { day: "Sat", value: 37 },
        { day: "Sun", value: 37 },
    ];

    const responseTimeData = [
        { time: "8am", value: 11 },
        { time: "10am", value: 13 },
        { time: "12pm", value: 18 },
        { time: "2pm", value: 18 },
        { time: "4pm", value: 15 },
        { time: "6pm", value: 9 },
    ];

    const appointmentData = [
        { day: "Mon", cancelled: 56, fulfilled: 39 },
        { day: "Tues", cancelled: 64, fulfilled: 80 },
        { day: "Weds", cancelled: 76, fulfilled: 15 },
        { day: "Thurs", cancelled: 78, fulfilled: 17 },
        { day: "Fri", cancelled: 70, fulfilled: 65 },
        { day: "Sat", cancelled: 37, fulfilled: 15 },
        { day: "Sun", cancelled: 37, fulfilled: 15 },
    ];

    const maxValue = 100;
    const yAxisLabels = [100, 80, 60, 40, 20, 0];
    const responseYAxis = [24, 18, 12, 9, 6, 0];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-4">
            {/* Patient Volume Trends */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-5 bg-blue-500 rounded-full" />
                        <h3 className="text-base font-semibold text-slate-800">Patient Volume Trends</h3>
                    </div>
                    <button className="text-sm text-blue-500 font-medium hover:underline">MORE</button>
                </div>
                <div className="relative h-56">
                    <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-400 w-8">
                        {yAxisLabels.map((label, i) => (<span key={i}>{label}</span>))}
                    </div>
                    <div className="ml-8 h-full relative">
                        <DotGrid />
                        <div className="relative h-full flex items-end justify-between gap-1 pb-8 z-10">
                            {patientVolumeData.map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center flex-1">
                                    <div className="flex items-end gap-0.5 h-44 w-full justify-center">
                                        <div className="flex flex-col items-center" style={{ width: '18px' }}>
                                            <span className="text-xs font-semibold text-slate-600 mb-1">{item.outpatient}</span>
                                            <div className="w-full bg-blue-400 rounded-t-sm" style={{ height: `${(item.outpatient / maxValue) * 160}px` }} />
                                        </div>
                                        <div className="flex flex-col items-center" style={{ width: '18px' }}>
                                            <span className="text-xs font-semibold text-slate-600 mb-1">{item.inpatient}</span>
                                            <div className="w-full bg-emerald-400 rounded-t-sm" style={{ height: `${(item.inpatient / maxValue) * 160}px` }} />
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500 mt-2">{item.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-6 mt-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-400" />
                        <span className="text-sm text-gray-600">Out-Patient</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        <span className="text-sm text-gray-600">In-Patient</span>
                    </div>
                </div>
            </div>

            {/* Average Response Time */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-5 bg-purple-500 rounded-full" />
                        <h3 className="text-base font-semibold text-slate-800">Average Response Time</h3>
                    </div>
                    <button className="text-sm text-blue-500 font-medium hover:underline">MORE</button>
                </div>
                <div className="relative h-56">
                    <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-400 w-8">
                        {responseYAxis.map((label, i) => (<span key={i}>{label}</span>))}
                    </div>
                    <div className="ml-8 h-full relative">
                        <DotGrid />
                        <div className="relative h-full pb-8 z-10">
                            <svg className="w-full h-44" viewBox="0 0 500 180" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.5" />
                                        <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.1" />
                                    </linearGradient>
                                </defs>
                                <path d="M 0 135 Q 40 130, 80 120 T 160 45 T 240 45 T 320 65 T 400 75 Q 440 100, 500 145 L 500 180 L 0 180 Z" fill="url(#areaGrad)" />
                                <path d="M 0 135 Q 40 130, 80 120 T 160 45 T 240 45 T 320 65 T 400 75 Q 440 100, 500 145" stroke="#8b5cf6" strokeWidth="3" fill="none" strokeLinecap="round" />
                                {[[0, 135], [80, 120], [160, 45], [240, 45], [320, 65], [400, 75], [500, 145]].map(([cx, cy], i) => (
                                    <circle key={i} cx={cx} cy={cy} r="6" fill="#8b5cf6" stroke="white" strokeWidth="2" />
                                ))}
                                <circle cx="80" cy="100" r="4" fill="#ef4444" />
                            </svg>
                            <div className="flex justify-between mt-2 px-1">
                                {responseTimeData.map((item, i) => (
                                    <span key={i} className="text-xs text-gray-500">{item.time}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-sm text-gray-600">Time</span>
                </div>
            </div>

            {/* Bed Utilization Rate */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-5 bg-indigo-500 rounded-full" />
                        <h3 className="text-base font-semibold text-slate-800">Bed Utilization Rate</h3>
                    </div>
                    <button className="text-sm text-blue-500 font-medium hover:underline">MORE</button>
                </div>
                <div className="relative h-56">
                    <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-400 w-8">
                        {yAxisLabels.map((label, i) => (<span key={i}>{label}</span>))}
                    </div>
                    <div className="ml-8 h-full relative">
                        <DotGrid />
                        <div className="relative h-full flex items-end justify-between gap-2 pb-8 z-10">
                            {bedUtilizationData.map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center flex-1">
                                    <div className="flex flex-col items-center h-44 justify-end w-full">
                                        <span className="text-xs font-semibold text-slate-600 mb-1">{item.value}</span>
                                        <div className="w-8 bg-indigo-400 rounded-t-sm" style={{ height: `${(item.value / maxValue) * 160}px` }} />
                                    </div>
                                    <span className="text-xs text-gray-500 mt-2">{item.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="w-3 h-3 rounded-sm bg-indigo-400" />
                    <span className="text-sm text-gray-600">Days of the Week</span>
                </div>
            </div>

            {/* Appointment Fulfilment */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-5 bg-orange-400 rounded-full" />
                        <h3 className="text-base font-semibold text-slate-800">Appointment Fulfilment</h3>
                    </div>
                    <button className="text-sm text-blue-500 font-medium hover:underline">MORE</button>
                </div>
                <div className="relative h-56">
                    <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-400 w-8">
                        {yAxisLabels.map((label, i) => (<span key={i}>{label}</span>))}
                    </div>
                    <div className="ml-8 h-full relative">
                        <DotGrid />
                        <div className="relative h-full flex items-end justify-between gap-1 pb-8 z-10">
                            {appointmentData.map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center flex-1">
                                    <div className="flex items-end gap-0.5 h-44 w-full justify-center">
                                        <div className="flex flex-col items-center" style={{ width: '18px' }}>
                                            <span className="text-xs font-semibold text-slate-600 mb-1">{item.cancelled}</span>
                                            <div className="w-full bg-orange-400 rounded-t-sm" style={{ height: `${(item.cancelled / maxValue) * 160}px` }} />
                                        </div>
                                        <div className="flex flex-col items-center" style={{ width: '18px' }}>
                                            <span className="text-xs font-semibold text-slate-600 mb-1">{item.fulfilled}</span>
                                            <div className="w-full bg-emerald-400 rounded-t-sm" style={{ height: `${(item.fulfilled / maxValue) * 160}px` }} />
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500 mt-2">{item.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-6 mt-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-400" />
                        <span className="text-sm text-gray-600">Cancelled</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        <span className="text-sm text-gray-600">Fulfilled</span>
                    </div>
                </div>
            </div>
        </div>
    );
}