"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MinusSquare,
} from "lucide-react";
import TableHeaders from "./StaffTableHeader";
// import Staff from "@/app/(admin)/admin/staff/page";

const StaffTables = () => {
  const patients = [
    {
      name: "Adewale Ogunleye",
      email: "adewale.ogunleye@gmail.com",
      phone: "+234 803 456 7890",
      urgency: "High",
      status: "Pending",
      date: "2025-12-29",
    },
    {
      name: "Chioma Nwankwo",
      email: "chioma.nwankwo@yahoo.com",
      phone: "+234 816 234 5678",
      urgency: "Medium",
      status: "Administered",
      date: "2025-12-28",
    },
    {
      name: "Yusuf Abdullahi",
      email: "yusuf.abdullahi@gmail.com",
      phone: "+234 809 876 5432",
      urgency: "Low",
      status: "Administered",
      date: "2025-12-27",
    },
    {
      name: "Blessing Okeke",
      email: "blessing.okeke@outlook.com",
      phone: "+234 813 567 8901",
      urgency: "Medium",
      status: "Administered",
      date: "2025-12-26",
    },
    {
      name: "Babatunde Adeyemi",
      email: "babatunde.adeyemi@gmail.com",
      phone: "+234 805 432 1098",
      urgency: "High",
      status: "Pending",
      date: "2025-12-29",
    },
    {
      name: "Hauwa Ibrahim",
      email: "hauwa.ibrahim@gmail.com",
      phone: "+234 817 654 3210",
      urgency: "Medium",
      status: "Pending",
      date: "2025-12-30",
    },
    {
      name: "Emeka Nnaji",
      email: "emeka.nnaji@yahoo.com",
      phone: "+234 806 789 0123",
      urgency: "Low",
      status: "Administered",
      date: "2025-12-25",
    },
    {
      name: "Folake Ajayi",
      email: "folake.ajayi@gmail.com",
      phone: "+234 814 890 1234",
      urgency: "High",
      status: "Pending",
      date: "2025-12-31",
    },
    {
      name: "Ikechukwu Obi",
      email: "ikechukwu.obi@gmail.com",
      phone: "+234 809 012 3456",
      urgency: "Medium",
      status: "Administered",
      date: "2025-12-24",
    },
    {
      name: "Zainab Mohammed",
      email: "zainab.mohammed@outlook.com",
      phone: "+234 818 123 4567",
      urgency: "Low",
      status: "Pending",
      date: "2025-12-30",
    },
  ];

  // Animation Variants
  const containerVars = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const rowVars = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <>
      <TableHeaders
        title="Patients List"
        searchPlaceholder="Search patients..."
        onSearch={(value) => console.log(value)}
      />
      <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            {/* Table Header */}
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr className="text-sm font-medium text-slate-500">
                <th className="w-12 p-4">
                  <MinusSquare
                    size={18}
                    className="rounded bg-indigo-50 text-indigo-500"
                  />
                </th>
                <th className="cursor-pointer p-4 transition-colors hover:text-slate-800">
                  <div className="flex items-center gap-2">
                    Patient Name <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="p-4">Phone Number</th>
                <th className="p-4 text-center">Urgency</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4">Appointment Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <motion.tbody
              variants={containerVars}
              initial="initial"
              animate="animate"
            >
              {patients.map((item, idx) => (
                <motion.tr
                  key={idx}
                  variants={rowVars}
                  whileHover={{ backgroundColor: "#f8fafc" }}
                  className="group border-b border-slate-100 transition-colors last:border-0"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
                        {item.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-400">{item.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{item.phone}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`rounded-full border px-4 py-1 text-xs font-medium ${
                        item.urgency === "High"
                          ? "border-red-200 bg-red-50 text-red-600"
                          : item.urgency === "Medium"
                            ? "border-orange-200 bg-orange-50 text-orange-500"
                            : "border-green-200 bg-green-50 text-green-600"
                      }`}
                    >
                      {item.urgency}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`rounded-full border px-4 py-1 text-xs font-medium ${
                        item.status === "Pending"
                          ? "border-orange-200 bg-orange-50 text-orange-500"
                          : "border-blue-200 bg-blue-50 text-blue-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-600">
                    {item.date}
                  </td>
                  <td className="p-4 text-center">
                    <button className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 p-4 md:flex-row">
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50">
            <ChevronLeft size={16} /> Previous
          </button>
          <p className="text-sm font-medium text-slate-500 italic">
            Page 1 of 10
          </p>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50">
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
};

export default StaffTables;
