"use client";
import React, { useState } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

type TimeRange = "week" | "month" | "quarter" | "year";

export default function QuickStatsHeader() {
    const [selectedRange, setSelectedRange] = useState<TimeRange>("month");
    const [selectedPeriod, setSelectedPeriod] = useState("January 2024");
    const [showPeriodPicker, setShowPeriodPicker] = useState(false);
    const [showRangePicker, setShowRangePicker] = useState(false);
    const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

    // For custom date picker
    const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
    const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const timeRanges: { value: TimeRange; label: string }[] = [
        { value: "week", label: "Week" },
        { value: "month", label: "Month" },
        { value: "quarter", label: "Quarter" },
        { value: "year", label: "Year" },
    ];

    // Generate options based on selected range
    const getPeriodOptions = () => {
        const currentYear = new Date().getFullYear();

        switch (selectedRange) {
            case "year":
                // Show years from 2020 to current year
                return Array.from({ length: currentYear - 2019 }, (_, i) => ({
                    value: `${2020 + i}`,
                    label: `${2020 + i}`
                })).reverse();

            case "quarter":
                // Show quarters for the last 2 years
                const quarters: { value: string; label: string }[] = [];
                for (let year = currentYear; year >= currentYear - 1; year--) {
                    for (let q = 4; q >= 1; q--) {
                        quarters.push({
                            value: `Q${q} ${year}`,
                            label: `Q${q} ${year}`
                        });
                    }
                }
                return quarters;

            case "month":
                // Show months for the last 2 years
                const months = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];
                const monthOptions: { value: string; label: string }[] = [];
                for (let year = currentYear; year >= currentYear - 1; year--) {
                    for (let m = months.length - 1; m >= 0; m--) {
                        monthOptions.push({
                            value: `${months[m]} ${year}`,
                            label: `${months[m]} ${year}`
                        });
                    }
                }
                return monthOptions;

            case "week":
                // Show last 12 weeks
                const weeks: { value: string; label: string }[] = [];
                const today = new Date();
                for (let i = 0; i < 12; i++) {
                    const weekStart = new Date(today);
                    weekStart.setDate(today.getDate() - (i * 7));
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);

                    weeks.push({
                        value: `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
                        label: `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                    });
                }
                return weeks;

            default:
                return [];
        }
    };

    // Custom date picker helpers
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const formatDateRange = (start: Date | null, end: Date | null) => {
        if (!start && !end) return "Select dates";
        if (start && !end) return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ...`;
        if (start && end) {
            return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        }
        return "Select dates";
    };

    const handleDateClick = (day: number) => {
        const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

        if (!customStartDate || (customStartDate && customEndDate)) {
            setCustomStartDate(clickedDate);
            setCustomEndDate(null);
        } else if (customStartDate && !customEndDate) {
            if (clickedDate >= customStartDate) {
                setCustomEndDate(clickedDate);
            } else {
                setCustomEndDate(customStartDate);
                setCustomStartDate(clickedDate);
            }
        }
    };

    const isDateInRange = (day: number) => {
        if (!customStartDate) return false;
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        if (customEndDate) {
            return date >= customStartDate && date <= customEndDate;
        }
        return date.getTime() === customStartDate.getTime();
    };

    const isStartDate = (day: number) => {
        if (!customStartDate) return false;
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        return date.getTime() === customStartDate.getTime();
    };

    const isEndDate = (day: number) => {
        if (!customEndDate) return false;
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        return date.getTime() === customEndDate.getTime();
    };

    const renderCustomDatePicker = () => {
        const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const emptyDays = Array.from({ length: startingDayOfWeek }, (_, i) => i);

        return (
            <div className="absolute right-0 top-full z-20 mt-2 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                {/* Month Navigation */}
                <div className="mb-4 flex items-center justify-between">
                    <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                        className="rounded-md p-1 hover:bg-gray-100"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="font-medium text-gray-900">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                    <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                        className="rounded-md p-1 hover:bg-gray-100"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Weekday Headers */}
                <div className="mb-2 grid grid-cols-7 gap-1">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                        <div key={day} className="text-center text-xs font-medium text-gray-500">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                    {emptyDays.map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}
                    {days.map((day) => {
                        const inRange = isDateInRange(day);
                        const isStart = isStartDate(day);
                        const isEnd = isEndDate(day);

                        return (
                            <button
                                key={day}
                                onClick={() => handleDateClick(day)}
                                className={`
                                    aspect-square rounded-md text-sm transition-colors
                                    ${inRange ? 'bg-primary/10' : 'hover:bg-gray-100'}
                                    ${isStart || isEnd ? 'bg-primary font-medium text-white' : 'text-gray-700'}
                                `}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                    <button
                        onClick={() => {
                            setCustomStartDate(null);
                            setCustomEndDate(null);
                        }}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        Clear
                    </button>
                    <button
                        onClick={() => {
                            if (customStartDate && customEndDate) {
                                setSelectedPeriod(formatDateRange(customStartDate, customEndDate));
                                setShowCustomDatePicker(false);
                            }
                        }}
                        disabled={!customStartDate || !customEndDate}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Apply
                    </button>
                </div>
            </div>
        );
    };

    const periodOptions = getPeriodOptions();

    return (
        <div className="mb-6 flex w-full items-center justify-start gap-4">
            <h2 className="text-sm font-semibold text-gray-900">Quick Stats</h2>

            <div className="flex items-center gap-3">


                {/* Period Selector (Dynamic based on range) */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowPeriodPicker(!showPeriodPicker);
                            setShowRangePicker(false);
                            setShowCustomDatePicker(false);
                        }}
                        className="flex items-center gap-2 rounded-sm border border-gray-200 bg-gray-100 px-2 py-1 text-sm font-medium text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-200 active:scale-95"
                    >
                        <Calendar size={16} className="text-gray-500" />
                        <span>{selectedPeriod}</span>
                        <ChevronDown
                            size={16}
                            className={`text-gray-500 transition-transform ${showPeriodPicker ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {showPeriodPicker && (
                        <div className="absolute right-0 top-full z-20 mt-2 max-h-64 w-56 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                            {periodOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setSelectedPeriod(option.label);
                                        setShowPeriodPicker(false);
                                    }}
                                    className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${selectedPeriod === option.label
                                        ? "bg-gray-100 font-medium text-primary"
                                        : "text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}

                            {/* Custom Date Range Option */}
                            <div className="my-1 border-t border-gray-200" />
                            <button
                                onClick={() => {
                                    setShowPeriodPicker(false);
                                    setShowCustomDatePicker(true);
                                }}
                                className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
                            >
                                Custom range...
                            </button>
                        </div>
                    )}

                    {/* Custom Date Picker */}
                    {showCustomDatePicker && renderCustomDatePicker()}
                </div>

                {/* Time Range Selector (Week/Month/Quarter/Year) */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowRangePicker(!showRangePicker);
                            setShowPeriodPicker(false);
                            setShowCustomDatePicker(false);
                        }}
                        className="flex items-center gap-2 rounded-sm border border-gray-200 bg-gray-100 px-2 py-1 text-sm font-medium text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-200 active:scale-95"
                    >
                        <span className="capitalize">{selectedRange}</span>
                        <ChevronDown
                            size={16}
                            className={`text-gray-500 transition-transform ${showRangePicker ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {showRangePicker && (
                        <div className="absolute right-0 top-full z-20 mt-2 w-40 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                            {timeRanges.map((range) => (
                                <button
                                    key={range.value}
                                    onClick={() => {
                                        setSelectedRange(range.value);
                                        setShowRangePicker(false);
                                        // Reset to first option when changing range
                                        const newOptions = getPeriodOptions();
                                        if (newOptions.length > 0) {
                                            setSelectedPeriod(newOptions[0].label);
                                        }
                                    }}

                                    className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${selectedRange === range.value
                                        ? "bg-gray-100 font-medium text-primary"
                                        : "text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Overlay to close dropdowns */}
            {(showPeriodPicker || showRangePicker || showCustomDatePicker) && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => {
                        setShowPeriodPicker(false);
                        setShowRangePicker(false);
                        setShowCustomDatePicker(false);
                    }}
                />
            )}
        </div>
    );
}