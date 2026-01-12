"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, ArrowUpDown, ChevronLeft, ChevronRight, MinusSquare, PenIcon, } from 'lucide-react';
import TableHeaders from './TableHeaders';
import AddStaffModal from './AddStaffModal';
import { staffDatabase, type StaffMember } from '@/features/admin/data/staffData';

const StaffList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [staffs, setStaffs] = useState<StaffMember[]>(staffDatabase);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Calculate pagination
    const totalPages = Math.ceil(staffs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentStaffs = staffs.slice(startIndex, endIndex);

    // Pagination handlers
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Handle form submission
    const handleAddStaff = (staffData: {
        fullName: string;
        staffId: string;
        mobileNumber: string;
        emailAddress: string;
        address: string;
        designation: string;
        dateOfAppointment: string;
    }) => {
        const newStaff = {
            sno: staffs.length + 1,
            name: staffData.fullName,
            sex: "",
            rank: staffData.designation,
            gl: "",
            qualification: "",
            dateOfFirstApp: staffData.dateOfAppointment,
            confirmationOfAppt: "",
            dateOfPresentApp: staffData.dateOfAppointment,
            dateOfBirth: "",
            lgaOfOrigin: "",
            yearsInPresentStation: "",
            phone: staffData.mobileNumber
        };
        setStaffs([...staffs, newStaff]);
        console.log('New staff added:', newStaff);
    };

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
                title="Staff Management"
                searchPlaceholder="Search staff..."
                onSearch={(value) => console.log(value)}
                buttonLabel="Add New Staff"
                onButtonClick={() => setIsModalOpen(true)}
            />
            <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        {/* Table Header */}
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr className="text-slate-500 text-sm font-medium">
                                <th className="p-4 w-12"><MinusSquare size={18} className="text-primary bg-primary/10 rounded" /></th>
                                <th className="p-4">S/NO</th>
                                <th className="p-4 cursor-pointer hover:text-slate-800 transition-colors">
                                    <div className="flex items-center gap-2">Name <ArrowUpDown size={14} /></div>
                                </th>
                                <th className="p-4">Sex</th>
                                <th className="p-4">Rank</th>
                                <th className="p-4">G/L</th>
                                <th className="p-4">Qualification</th>
                                <th className="p-4">Date of 1st App</th>
                                <th className="p-4">Confirmation</th>
                                <th className="p-4">Date of Present App</th>
                                <th className="p-4">Date of Birth</th>
                                <th className="p-4">LGA of Origin</th>
                                <th className="p-4">Years in Station</th>
                                <th className="p-4">Phone Number</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <motion.tbody
                            variants={containerVars}
                            initial="initial"
                            animate="animate"
                        >
                            {currentStaffs.map((item, idx) => {
                                // Generate gradient colors based on index for visual variety
                                const gradients = [
                                    'from-blue-500 to-indigo-600',
                                    'from-purple-500 to-pink-600',
                                    'from-green-500 to-teal-600',
                                    'from-orange-500 to-red-600',
                                    'from-cyan-500 to-blue-600',
                                    'from-violet-500 to-purple-600',
                                    'from-emerald-500 to-green-600',
                                    'from-rose-500 to-pink-600',
                                    'from-amber-500 to-orange-600',
                                    'from-sky-500 to-cyan-600'
                                ];
                                const gradient = gradients[idx % gradients.length];

                                return (
                                    <motion.tr
                                        key={idx}
                                        variants={rowVars}
                                        whileHover={{ backgroundColor: "#f8fafc" }}
                                        className="border-b border-slate-100 last:border-0 transition-colors group"
                                    >
                                        <td className="p-4">
                                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">{item.sno}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full bg-linear-to-br ${gradient} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                                                    {item.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">
                                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${item.sex === 'M' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                                                {item.sex}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">{item.rank}</td>
                                        <td className="p-4 text-sm text-slate-600">{item.gl}</td>
                                        <td className="p-4 text-sm text-slate-600 max-w-xs truncate" title={item.qualification}>
                                            {item.qualification}
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">{item.dateOfFirstApp}</td>
                                        <td className="p-4 text-sm text-slate-600">{item.confirmationOfAppt}</td>
                                        <td className="p-4 text-sm text-slate-600">{item.dateOfPresentApp}</td>
                                        <td className="p-4 text-sm text-slate-600">{item.dateOfBirth}</td>
                                        <td className="p-4 text-sm text-slate-600">
                                            <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                                                {item.lgaOfOrigin}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">{item.yearsInPresentStation}</td>
                                        <td className="p-4 text-sm text-slate-600">{item.phone}</td>

                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="p-2 text-slate-400 hover:text-primary hover:bg-teal-50 rounded-lg transition-all">
                                                    <PenIcon size={18} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </motion.tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-4 flex flex-col md:flex-row items-center justify-between border-t border-slate-100 gap-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg transition-colors flex items-center gap-2 ${currentPage === 1
                                ? 'text-slate-400 bg-slate-50 cursor-not-allowed'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <ChevronLeft size={16} /> Previous
                    </button>
                    <p className="text-sm text-slate-500 font-medium italic">
                        Page {currentPage} of {totalPages}
                    </p>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg transition-colors flex items-center gap-2 ${currentPage === totalPages
                                ? 'text-slate-400 bg-slate-50 cursor-not-allowed'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Add Staff Modal */}
            <AddStaffModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddStaff}
            />
        </>
    );
};

export default StaffList;