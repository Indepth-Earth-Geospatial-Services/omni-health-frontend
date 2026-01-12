"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, ArrowUpDown, ChevronLeft, ChevronRight, MinusSquare, } from 'lucide-react';
import TableHeaders from './TableHeaders';

const PatientTables = () => {
    const patients = [
        { name: "Adewale Ogunleye", email: "adewale.ogunleye@gmail.com", phone: "+234 803 456 7890", urgency: "High", status: "Pending", date: "2025-12-29" },
        { name: "Chioma Nwankwo", email: "chioma.nwankwo@yahoo.com", phone: "+234 816 234 5678", urgency: "Medium", status: "Administered", date: "2025-12-28" },
        { name: "Yusuf Abdullahi", email: "yusuf.abdullahi@gmail.com", phone: "+234 809 876 5432", urgency: "Low", status: "Administered", date: "2025-12-27" },
        { name: "Blessing Okeke", email: "blessing.okeke@outlook.com", phone: "+234 813 567 8901", urgency: "Medium", status: "Administered", date: "2025-12-26" },
        { name: "Babatunde Adeyemi", email: "babatunde.adeyemi@gmail.com", phone: "+234 805 432 1098", urgency: "High", status: "Pending", date: "2025-12-29" },
        { name: "Hauwa Ibrahim", email: "hauwa.ibrahim@gmail.com", phone: "+234 817 654 3210", urgency: "Medium", status: "Pending", date: "2025-12-30" },
        { name: "Emeka Nnaji", email: "emeka.nnaji@yahoo.com", phone: "+234 806 789 0123", urgency: "Low", status: "Administered", date: "2025-12-25" },
        { name: "Folake Ajayi", email: "folake.ajayi@gmail.com", phone: "+234 814 890 1234", urgency: "High", status: "Pending", date: "2025-12-31" },
        { name: "Ikechukwu Obi", email: "ikechukwu.obi@gmail.com", phone: "+234 809 012 3456", urgency: "Medium", status: "Administered", date: "2025-12-24" },
        { name: "Zainab Mohammed", email: "zainab.mohammed@outlook.com", phone: "+234 818 123 4567", urgency: "Low", status: "Pending", date: "2025-12-30" },
    ];

    // Animation Variants
    const containerVars = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const rowVars = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 }
    };

    return (
        <>
            <TableHeaders
                title="Patients List"
                searchPlaceholder="Search patients..."
                onSearch={(value) => console.log(value)}
            />
            <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        {/* Table Header */}
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr className="text-slate-500 text-sm font-medium">
                                <th className="p-4 w-12"><MinusSquare size={18} className="text-indigo-500 bg-indigo-50 rounded" /></th>
                                <th className="p-4 cursor-pointer hover:text-slate-800 transition-colors">
                                    <div className="flex items-center gap-2">Patient Name <ArrowUpDown size={14} /></div>
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
                                    className="border-b border-slate-100 last:border-0 transition-colors group"
                                >
                                    <td className="p-4">
                                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                                                {item.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                                                <p className="text-xs text-slate-400">{item.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">{item.phone}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-4 py-1 rounded-full text-xs font-medium border ${
                                            item.urgency === 'High'
                                                ? 'text-red-600 border-red-200 bg-red-50'
                                                : item.urgency === 'Medium'
                                                ? 'text-orange-500 border-orange-200 bg-orange-50'
                                                : 'text-green-600 border-green-200 bg-green-50'
                                            }`}>
                                            {item.urgency}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-4 py-1 rounded-full text-xs font-medium border ${item.status === 'Pending'
                                            ? 'text-orange-500 border-orange-200 bg-orange-50'
                                            : 'text-blue-500 border-blue-200 bg-blue-50'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600 font-medium">{item.date}</td>
                                    <td className="p-4 text-center">
                                        <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </motion.tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-4 flex flex-col md:flex-row items-center justify-between border-t border-slate-100 gap-4">
                    <button className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <ChevronLeft size={16} /> Previous
                    </button>
                    <p className="text-sm text-slate-500 font-medium italic">Page 1 of 10</p>
                    <button className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default PatientTables;