"use client";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";

// Colors constants
const COLORS = {
  doctor: "#15D0BD",
  patient: "#7086FD",
  grid: "#00000040",
  text: "#000000B2",
} as const;

// Chart configuration
const chartConfig = {
  percentage: { label: "Percentage" },
  doctors: { label: "Doctors", color: COLORS.doctor },
  patients: { label: "Patients", color: COLORS.patient },
} as const;

interface DoctorPatientRatioChartProps {
  doctorCount?: number;
  patientCount?: number;
  title?: string;
}

export function DoctorPatientRatioChart({
  doctorCount = 60,
  patientCount = 79,
  title = "Doctor to Patient Ratio",
}: DoctorPatientRatioChartProps) {
  const total = doctorCount + patientCount;
  const doctorPercentage = (doctorCount / total) * 100;
  const patientPercentage = (patientCount / total) * 100;

  const chartData = [
    {
      category: "Doctors",
      count: doctorCount,
      percentage: Math.round(doctorPercentage * 100) / 100,
      fill: COLORS.doctor,
    },
    {
      category: "Patients",
      count: patientCount,
      percentage: Math.round(patientPercentage * 100) / 100,
      fill: COLORS.patient,
    },
  ];

  return (
    <Card className="pt-0">
      <div className="flex h-10 items-center justify-between px-3 pt-1">
        <h3 className="text-[15px] font-medium">{title}</h3>
        <button className="text-[10px] text-[#00000080]">MORE</button>
      </div>
      <CardContent>
        <div className="space-y-4">
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{ left: 0, right: 20 }}
              barSize={57}
              barCategoryGap={50}
            >
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <YAxis
                dataKey="category"
                type="category"
                tickLine={false}
                tickMargin={10}
                tickFormatter={(value) =>
                  chartConfig[value.toLowerCase() as keyof typeof chartConfig]
                    ?.label || value
                }
              />
              <XAxis
                tickLine={false}
                axisLine={false}
                orientation="top"
                dataKey="percentage"
                type="number"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => {
                      if (name === "percentage")
                        return [`${value}%`, "Percentage"];
                      return [value, "Count"];
                    }}
                  />
                }
              />
              <Bar dataKey="percentage" layout="vertical" radius={5}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>

          <div
            className="flex justify-center gap-4 text-sm"
            style={{ color: COLORS.text }}
          >
            <div className="flex items-center gap-2">
              <div
                className="size-2"
                style={{ backgroundColor: COLORS.doctor }}
              />
              <span>Doctors</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="size-2"
                style={{ backgroundColor: COLORS.patient }}
              />
              <span>Patients</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
