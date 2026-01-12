import Header from "@/features/admin/components/layout/Header";
import KPIStatsCards from "@/features/admin/components/layout/KPICards";
import QuickStatsHeader from "@/features/admin/components/layout/QuickStatsHeader";
import { KPISmallCard } from "@/features/admin/components/layout/KPISmallCards";
import { Users, Star, Calendar, ChevronRight, CheckCircle2, Clock, } from "lucide-react";
import AdmissionsRateChart from "@/features/admin/components/layout/AdmissionsRateChartProps";

export default function Home() {

  const appointments = [
    { name: 'John Smith', type: 'General Checkup', time: '9:00 AM', status: 'Approved', statusColor: 'text-emerald-500', icon: CheckCircle2, initials: 'JS' },
    { name: 'Lila Ramirez', type: 'General Checkup', time: '9:00 AM', status: 'Pending', statusColor: 'text-orange-400', icon: Clock, initials: 'LR' },
    { name: 'Joe Lammens', type: 'Pediatrics', time: '9:00 AM', status: 'Rescheduled', statusColor: 'text-blue-500', icon: Calendar, initials: 'JL' },
    { name: 'Lila Ramirez', type: 'Pediatrics', time: '8:00 AM', status: 'Approved', statusColor: 'text-emerald-500', icon: CheckCircle2, initials: 'LR' },
  ];


  return (
    <>
      <Header name="Overview" />
      <div className="flex-1 overflow-y-auto bg-white p-6">
        <main className="flex min-h-screen flex-col">
          <QuickStatsHeader />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 w-full mb-4">
            <KPIStatsCards title="Today's Patient" value={127} subtitle="42 outpatient, 83 inpatient" icon={<Users size={24} />} trend={{ value: "20%", isPositive: true }} />
            <KPIStatsCards title="Available Beds" value={29} subtitle="of 120 total beds" icon={<Users size={24} />} trend={{ value: "2% Decrease", isPositive: false }} />
            <KPIStatsCards title="Pending Appointments" value={17} subtitle="5 urgent request" icon={<Users size={24} />} trend={{ value: "80%", isPositive: true }} />
            <KPIStatsCards title="Completion Rate" value={94} subtitle="Appointment fulfilled" icon={<Users size={24} />} trend={{ value: "80%", isPositive: true }} />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 w-full mb-4">
            <KPISmallCard value={127} subtitle="Accepted today" icon={<Users size={24} />} />
            <KPISmallCard value={29} subtitle="Rescheduled" icon={<Calendar size={24} />} />
            <KPISmallCard value={156} subtitle="Staff on Duty" icon={<Users size={24} />} />
            <KPISmallCard value={12} subtitle="Agr. Rating" icon={<Star size={24} />} />
          </div>
          <AdmissionsRateChart />

          {/* todays appointment */}
          <section>
            <div className="mt-6 w-full flex justify-between gap-4 md:flex-row flex-col">

              {/* --- Card 1: Today's Appointments --- */}
              <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-700">{`Today's Appointment`}</h2>
                  <button className="text-sm font-medium text-slate-500 flex items-center hover:text-slate-800 transition-colors">
                    View all <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>

                <div className="space-y-6">
                  {appointments.map((apt, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold">
                          {apt.initials}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-700">{apt.name}</h3>
                          <p className="text-sm text-slate-400">{apt.type}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-slate-400 mb-1">{apt.time}</p>
                        <div className={`flex items-center gap-1 text-xs font-semibold ${apt.statusColor}`}>
                          <apt.icon size={14} />
                          {apt.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* --- Card 2: Teaching Sessions (Analytics) --- */}
              <div className="flex-[1.2] bg-white border border-gray-200 rounded-xl p-8 flex flex-col xl:flex-row items-center justify-between gap-8">

                {/* Radial Chart Section - Increased to w-80 h-80 */}
                <div className="relative w-80 h-80 flex items-center justify-center">
                  <svg
                    viewBox="0 0 256 256"
                    className="w-full h-full transform -rotate-90"
                  >
                    {/* Background Rings - Adjusted radii for larger scale */}
                    <circle cx="128" cy="128" r="110" stroke="#f1f5f9" strokeWidth="14" fill="transparent" />
                    <circle cx="128" cy="128" r="88" stroke="#f1f5f9" strokeWidth="14" fill="transparent" />
                    <circle cx="128" cy="128" r="66" stroke="#f1f5f9" strokeWidth="14" fill="transparent" />

                    {/* Progress Rings - Values recalculated for the new circumference */}
                    {/* Utilization (Outer) - 54% of 691 circ */}
                    <circle
                      cx="128" cy="128" r="110"
                      stroke="#2D5A5A" strokeWidth="14" fill="transparent"
                      strokeDasharray="691" strokeDashoffset="318" strokeLinecap="round"
                    />
                    {/* Occupied (Middle) - 32% of 553 circ */}
                    <circle
                      cx="128" cy="128" r="88"
                      stroke="#14B8A6" strokeWidth="14" fill="transparent"
                      strokeDasharray="553" strokeDashoffset="177" strokeLinecap="round"
                    />
                    {/* Available (Inner) - 14% of 414 circ */}
                    <circle
                      cx="128" cy="128" r="66"
                      stroke="#5EEAD4" strokeWidth="14" fill="transparent"
                      strokeDasharray="414" strokeDashoffset="58" strokeLinecap="round"
                    />
                  </svg>

                  {/* Center Text - Scaled up slightly */}
                  <div className="absolute text-center">
                    <p className="text-slate-400 text-base">Ongoing</p>
                    <p className="text-2xl font-bold text-slate-800 leading-tight">Teaching<br />Sessions</p>
                  </div>
                </div>

                {/* Legend Section */}
                <div className="flex flex-col justify-center space-y-5 min-w-40">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full bg-teal-300"></span>
                      <span className="text-base text-slate-500 font-medium">
                        <b className="text-slate-800 font-bold">14%</b> Available
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full bg-teal-500"></span>
                      <span className="text-base text-slate-500 font-medium">
                        <b className="text-slate-800 font-bold">32%</b> Occupied
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full bg-[#2D5A5A]"></span>
                      <span className="text-base text-slate-500 font-medium">
                        <b className="text-slate-800 font-bold">54%</b> Utilization
                      </span>
                    </div>
                  </div>

                  <button className="mt-4 w-fit px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-slate-600 flex items-center hover:bg-gray-50 transition-colors">
                    View all <ChevronRight size={16} className="ml-2 text-slate-400" />
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
