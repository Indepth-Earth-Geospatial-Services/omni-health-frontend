// StaffTable.tsx
import React from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, MinusSquare, PenIcon, Trash2 } from "lucide-react";
import { type StaffMember } from "@/features/admin/hooks/useAdminStaff";

// --- Utils ---
const toSentenceCase = (str: string | undefined | null): string => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const rowVars = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

interface StaffTableProps {
  staffs: StaffMember[];
  columnVisibility: {
    hasGender: boolean;
    hasRank: boolean;
    hasGradeLevel: boolean;
    hasPhone: boolean;
    hasEmail: boolean;
    hasDateFirstAppt: boolean;
    hasDateOfBirth: boolean;
    hasQualifications: boolean;
    hasStatus: boolean;
  };
  onEdit: (staff: StaffMember) => void;
  onDelete: (id: string, name: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  currentPage: number;
  itemsPerPage: number;
}

const StaffTable: React.FC<StaffTableProps> = ({
  staffs,
  columnVisibility,
  onEdit,
  onDelete,
  isUpdating,
  isDeleting,
  currentPage,
  itemsPerPage,
}) => {
  const {
    hasGender,
    hasRank,
    hasGradeLevel,
    hasPhone,
    hasEmail,
    hasDateFirstAppt,
    hasDateOfBirth,
    hasQualifications,
    hasStatus,
  } = columnVisibility;

  return (
    <div className="relative overflow-x-auto" style={{ minHeight: "720px" }}>
      <table className="w-full border-collapse text-left">
        {/* --- Header --- */}
        <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50">
          <tr className="text-sm font-medium text-slate-500">
            <th className="w-12 p-4 text-[11.38px] text-[#475467]">S/N</th>
            <th className="cursor-pointer p-4 transition-colors hover:text-slate-800">
              <div className="flex items-center gap-2 text-[11.38px] text-[#475467]">
                Staff Name <ArrowUpDown size={14} />
              </div>
            </th>
            {hasGender && (
              <th className="p-4 text-[11.38px] text-[#475467]">Gender</th>
            )}
            {hasRank && (
              <th className="p-4 text-[11.38px] text-[#475467]">Rank/Cadre</th>
            )}
            {hasGradeLevel && (
              <th className="p-4 text-[11.38px] text-[#475467]">Grade Level</th>
            )}
            {hasPhone && (
              <th className="p-4 text-[11.38px] text-[#475467]">
                Phone Number
              </th>
            )}
            {hasDateFirstAppt && (
              <th className="p-4 text-[11.38px] text-[#475467]">
                Date of 1st Appt
              </th>
            )}
            {hasDateOfBirth && (
              <th className="p-4 text-[11.38px] text-[#475467]">
                Date of Birth
              </th>
            )}
            {hasQualifications && (
              <th className="p-4 text-[11.38px] text-[#475467]">
                Qualifications
              </th>
            )}
            {hasStatus && (
              <th className="p-4 text-[11.38px] text-[#475467]">Status</th>
            )}
            <th className="sticky right-0 bg-slate-50 p-4 text-center text-[11.38px] text-[#475467] shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">
              Actions
            </th>
          </tr>
        </thead>

        {/* --- Body --- */}
        <tbody>
          {staffs.length === 0 ? (
            <tr>
              <td
                colSpan={20}
                className="p-8 text-center text-slate-500"
                style={{ height: "668px" }}
              >
                <div className="flex h-full flex-col items-center justify-center">
                  <p>No staff members found</p>
                </div>
              </td>
            </tr>
          ) : (
            staffs.map((item, idx) => {
              const gradients = [
                "from-blue-500 to-indigo-600",
                "from-purple-500 to-pink-600",
                "from-green-500 to-teal-600",
                "from-orange-500 to-red-600",
              ];
              const gradient = gradients[idx % gradients.length];
              const formattedName = toSentenceCase(item.full_name);
              const initials =
                formattedName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase() || "?";

              return (
                <motion.tr
                  key={item.staff_id || idx}
                  variants={rowVars}
                  whileHover={{ backgroundColor: "#f8fafc" }}
                  className="group border-b border-slate-100 transition-colors last:border-0"
                >
                  <td className="p-4 text-sm font-medium text-slate-500">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-xs font-bold text-white shadow-sm`}
                      >
                        {initials}
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-[13.69px] font-medium text-slate-900">
                          {formattedName}
                        </p>
                        {hasEmail && (
                          <p className="mt-0.5 text-[12.64px] font-normal text-[#475467]">
                            {item.email &&
                            typeof item.email === "string" &&
                            item.email !== "NaN" &&
                            item.email.trim() !== ""
                              ? item.email
                              : "No email provided"}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {hasGender && (
                    <td className="p-4 text-sm text-slate-600">
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-medium ${item.gender?.toLowerCase() === "m" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"}`}
                      >
                        {toSentenceCase(item.gender) || "-"}
                      </span>
                    </td>
                  )}
                  {hasRank && (
                    <td className="p-4 text-sm text-slate-600">
                      {toSentenceCase(item.rank_cadre) || "-"}
                    </td>
                  )}
                  {hasGradeLevel && (
                    <td className="p-4 text-sm text-slate-600">
                      {/* {item.grade_level || "-"} */}
                      {item.grade_level &&
                      typeof item.grade_level === "string" &&
                      item.grade_level !== "NaN" &&
                      item.grade_level.trim() !== ""
                        ? item.grade_level
                        : "-"}
                    </td>
                  )}
                  {hasPhone && (
                    <td className="p-4 text-sm text-slate-600">
                      {item.phone_number || "-"}
                    </td>
                  )}
                  {hasDateFirstAppt && (
                    <td className="p-4 text-sm text-slate-600">
                      {item.date_first_appointment || "-"}
                    </td>
                  )}
                  {hasDateOfBirth && (
                    <td className="p-4 text-sm text-slate-600">
                      {item.date_of_birth || "-"}
                    </td>
                  )}
                  {hasQualifications && (
                    <td className="max-w-48 truncate p-4 text-sm text-slate-600">
                      {item.qualifications &&
                      Object.keys(item.qualifications).length > 0
                        ? Object.values(item.qualifications).join(", ")
                        : "-"}
                    </td>
                  )}
                  {hasStatus && (
                    <td className="p-4 text-sm text-slate-600">
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-medium ${item.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {item.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  )}

                  <td className="sticky right-0 bg-white p-4 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] group-hover:bg-slate-50">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        disabled={isUpdating}
                        className="hover:text-primary rounded-lg p-2 text-slate-400 transition-all hover:bg-teal-50 disabled:opacity-50"
                      >
                        <PenIcon size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(item.staff_id, formattedName)}
                        disabled={isDeleting}
                        className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StaffTable;
