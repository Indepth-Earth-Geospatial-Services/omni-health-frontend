// components/StaffRow.tsx
import { motion } from "framer-motion";
import { PenIcon, Trash2 } from "lucide-react";
import { StaffMember } from "@/services/admin.service";

// Helper function
const toSentenceCase = (str: string | undefined | null): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

interface StaffRowProps {
  item: StaffMember;
  index: number;
  serialNumber: number;
  onDelete: (staff: StaffMember) => void;
  onEdit?: (staff: StaffMember) => void;
}

const gradients = [
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-green-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-cyan-500 to-blue-600",
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-green-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-sky-500 to-cyan-600",
];

const rowVars = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

const getInitials = (name: string) => {
  const formattedName = toSentenceCase(name);
  return (
    formattedName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "?"
  );
};

export const StaffRow = ({
  item,
  index,
  serialNumber,
  onDelete,
  onEdit,
}: StaffRowProps) => {
  const gradient = gradients[index % gradients.length];
  const formattedName = toSentenceCase(item.full_name);
  const initials = getInitials(item.full_name);

  // Format qualifications with date - show values not keys
  const formatQualifications = () => {
    if (!item.qualifications || Object.keys(item.qualifications).length === 0) {
      return "-";
    }
    const quals = Object.values(item.qualifications).filter(Boolean).join(", ");
    return item.qualification_date
      ? `${quals} (${item.qualification_date})`
      : quals;
  };

  return (
    <motion.tr
      variants={rowVars}
      initial="initial"
      animate="animate"
      whileHover={{ backgroundColor: "#f8fafc" }}
      className="group border-b border-slate-100 transition-colors last:border-0"
    >
      {/* S/NO */}
      <td className="p-4 text-sm text-slate-600">{serialNumber}</td>

      {/* Names of Officers */}
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-xs font-bold text-white shadow-sm`}
          >
            {initials}
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[13.69px] font-medium text-slate-900">
              {formattedName}
            </p>
            <p className="mt-0.5 text-[12.64px] font-normal text-[#475467]">
              {item.email &&
              typeof item.email === "string" &&
              item.email !== "NaN" &&
              item.email.trim() !== ""
                ? item.email
                : "No email provided"}
            </p>
          </div>
        </div>
      </td>

      {/* Sex */}
      <td className="p-4 text-sm text-slate-600">
        <span
          className={`rounded-md px-2 py-1 text-xs font-medium ${
            item.gender?.toLowerCase() === "male" ||
            item.gender?.toLowerCase() === "m"
              ? "bg-blue-100 text-blue-700"
              : item.gender?.toLowerCase() === "female" ||
                  item.gender?.toLowerCase() === "f"
                ? "bg-pink-100 text-pink-700"
                : "bg-slate-100 text-slate-700"
          }`}
        >
          {toSentenceCase(item.gender) || "-"}
        </span>
      </td>

      {/* Rank */}
      <td className="p-4 text-sm text-slate-600">
        {toSentenceCase(item.rank_cadre) || "-"}
      </td>

      {/* G/L (Grade Level) */}
      <td className="p-4 text-sm text-slate-600">
        {/* {item.grade_level || "-"} */}
        {item.grade_level &&
        typeof item.grade_level === "string" &&
        item.grade_level !== "NaN" &&
        item.grade_level.trim() !== ""
          ? item.grade_level
          : "-"}
      </td>

      {/* Qualification with Date */}
      <td className="max-w-48 truncate p-4 text-sm text-slate-600">
        {formatQualifications()}
      </td>

      {/* Date of 1st Appt */}
      <td className="p-4 text-sm text-slate-600">
        {item.date_first_appointment || "-"}
      </td>

      {/* Confirmation of Appt */}
      <td className="p-4 text-sm text-slate-600">
        {item.confirmation_of_appointment || "-"}
      </td>

      {/* Date of Present Appt */}
      <td className="p-4 text-sm text-slate-600">
        {item.date_of_present_appointment || "-"}
      </td>

      {/* Date of Birth */}
      <td className="p-4 text-sm text-slate-600">
        {item.date_of_birth || "-"}
      </td>

      {/* LGA of Origin */}
      <td className="p-4 text-sm text-slate-600">
        {item.lga_of_origin || "-"}
      </td>

      {/* Years in Present Station */}
      <td className="p-4 text-sm text-slate-600">
        {item.years_in_present_station || "-"}
      </td>

      {/* Phone Number */}
      <td className="p-4 text-sm text-slate-600">{item.phone_number || "-"}</td>

      {/* Remark */}
      <td className="max-w-32 truncate p-4 text-sm text-slate-600">
        {item.remark || "-"}
      </td>

      {/* Actions */}
      <td className="sticky right-0 bg-white p-4 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] group-hover:bg-slate-50">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit?.(item)}
            className="hover:text-primary rounded-lg p-2 text-slate-400 transition-all hover:bg-teal-50"
          >
            <PenIcon size={18} />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
};
