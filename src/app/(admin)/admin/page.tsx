import Header from "@/features/admin/components/layout/Header";
import KPIStatsCards from "@/features/admin/components/layout/KPICards";
import QuickStatsHeader from "@/features/admin/components/layout/QuickStatsHeader";
import { KPISmallCard } from "@/features/admin/components/layout/KPISmallCards";
import {
  Users,
  Star,
  Calendar,
  ChevronRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import AdmissionsRateChart from "@/features/admin/components/charts/AdmissionsRateChartProps";

export default function Home() {
  const appointments = [
    {
      name: "John Smith",
      type: "General Checkup",
      time: "9:00 AM",
      status: "Approved",
      statusColor: "text-emerald-500",
      icon: CheckCircle2,
      initials: "JS",
    },
    {
      name: "Lila Ramirez",
      type: "General Checkup",
      time: "9:00 AM",
      status: "Pending",
      statusColor: "text-orange-400",
      icon: Clock,
      initials: "LR",
    },
    {
      name: "Joe Lammens",
      type: "Pediatrics",
      time: "9:00 AM",
      status: "Rescheduled",
      statusColor: "text-blue-500",
      icon: Calendar,
      initials: "JL",
    },
    {
      name: "Lila Ramirez",
      type: "Pediatrics",
      time: "8:00 AM",
      status: "Approved",
      statusColor: "text-emerald-500",
      icon: CheckCircle2,
      initials: "LR",
    },
  ];

  return (
    <>
      <Header name="Overview" />
      <div className="flex-1 overflow-y-auto bg-white p-6">
        <main className="flex min-h-screen flex-col">
          <QuickStatsHeader />
          <div className="mb-4 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <KPIStatsCards
              title="Today's Patient"
              value={127}
              subtitle="42 outpatient, 83 inpatient"
              icon={<Users size={24} />}
              trend={{ value: "20%", isPositive: true }}
            />
            <KPIStatsCards
              title="Available Beds"
              value={29}
              subtitle="of 120 total beds"
              icon={<Users size={24} />}
              trend={{ value: "2% Decrease", isPositive: false }}
            />
            <KPIStatsCards
              title="Pending Appointments"
              value={17}
              subtitle="5 urgent request"
              icon={<Users size={24} />}
              trend={{ value: "80%", isPositive: true }}
            />
            <KPIStatsCards
              title="Completion Rate"
              value={94}
              subtitle="Appointment fulfilled"
              icon={<Users size={24} />}
              trend={{ value: "80%", isPositive: true }}
            />
          </div>
          <div className="mb-4 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <KPISmallCard
              value={127}
              subtitle="Accepted today"
              icon={<Users size={24} />}
            />
            <KPISmallCard
              value={29}
              subtitle="Rescheduled"
              icon={<Calendar size={24} />}
            />
            <KPISmallCard
              value={156}
              subtitle="Staff on Duty"
              icon={<Users size={24} />}
            />
            <KPISmallCard
              value={12}
              subtitle="Agr. Rating"
              icon={<Star size={24} />}
            />
          </div>
          <AdmissionsRateChart />

          {/* todays appointment */}
          <section>
            <div className="mt-6 flex w-full flex-col justify-between gap-4 md:flex-row">
              {/* --- Card 1: Today's Appointments --- */}
              <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-700">{`Today's Appointment`}</h2>
                  <button className="flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-slate-800">
                    View all <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>

                <div className="space-y-6">
                  {appointments.map((apt, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-600">
                          {apt.initials}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-700">
                            {apt.name}
                          </h3>
                          <p className="text-sm text-slate-400">{apt.type}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="mb-1 text-sm text-slate-400">
                          {apt.time}
                        </p>
                        <div
                          className={`flex items-center gap-1 text-xs font-semibold ${apt.statusColor}`}
                        >
                          <apt.icon size={14} />
                          {apt.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* --- Card 2: Teaching Sessions (Analytics) --- */}
              <div className="flex flex-[1.2] flex-col items-center justify-between gap-8 rounded-xl border border-gray-200 bg-white p-8 xl:flex-row">
                {/* Radial Chart Section - Increased to w-80 h-80 */}
                <div className="relative flex h-80 w-80 items-center justify-center">
                  <svg
                    viewBox="0 0 256 256"
                    className="h-full w-full -rotate-90 transform"
                  >
                    {/* Background Rings - Adjusted radii for larger scale */}
                    <circle
                      cx="128"
                      cy="128"
                      r="110"
                      stroke="#f1f5f9"
                      strokeWidth="14"
                      fill="transparent"
                    />
                    <circle
                      cx="128"
                      cy="128"
                      r="88"
                      stroke="#f1f5f9"
                      strokeWidth="14"
                      fill="transparent"
                    />
                    <circle
                      cx="128"
                      cy="128"
                      r="66"
                      stroke="#f1f5f9"
                      strokeWidth="14"
                      fill="transparent"
                    />

                    {/* Progress Rings - Values recalculated for the new circumference */}
                    {/* Utilization (Outer) - 54% of 691 circ */}
                    <circle
                      cx="128"
                      cy="128"
                      r="110"
                      stroke="#2D5A5A"
                      strokeWidth="14"
                      fill="transparent"
                      strokeDasharray="691"
                      strokeDashoffset="318"
                      strokeLinecap="round"
                    />
                    {/* Occupied (Middle) - 32% of 553 circ */}
                    <circle
                      cx="128"
                      cy="128"
                      r="88"
                      stroke="#14B8A6"
                      strokeWidth="14"
                      fill="transparent"
                      strokeDasharray="553"
                      strokeDashoffset="177"
                      strokeLinecap="round"
                    />
                    {/* Available (Inner) - 14% of 414 circ */}
                    <circle
                      cx="128"
                      cy="128"
                      r="66"
                      stroke="#5EEAD4"
                      strokeWidth="14"
                      fill="transparent"
                      strokeDasharray="414"
                      strokeDashoffset="58"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Center Text - Scaled up slightly */}
                  <div className="absolute text-center">
                    <p className="text-base text-slate-400">Ongoing</p>
                    <p className="text-2xl leading-tight font-bold text-slate-800">
                      Teaching
                      <br />
                      Sessions
                    </p>
                  </div>
                </div>

                {/* Legend Section */}
                <div className="flex min-w-40 flex-col justify-center space-y-5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="h-4 w-4 rounded-full bg-teal-300"></span>
                      <span className="text-base font-medium text-slate-500">
                        <b className="font-bold text-slate-800">14%</b>{" "}
                        Available
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="h-4 w-4 rounded-full bg-teal-500"></span>
                      <span className="text-base font-medium text-slate-500">
                        <b className="font-bold text-slate-800">32%</b> Occupied
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="h-4 w-4 rounded-full bg-[#2D5A5A]"></span>
                      <span className="text-base font-medium text-slate-500">
                        <b className="font-bold text-slate-800">54%</b>{" "}
                        Utilization
                      </span>
                    </div>
                  </div>

                  <button className="mt-4 flex w-fit items-center rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-gray-50">
                    View all{" "}
                    <ChevronRight size={16} className="ml-2 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
