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
  onDelete: (staff: StaffMember) => void;
  onEdit?: (staff: StaffMember) => void; // Added for future use
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

export const StaffRow = ({ item, index, onDelete, onEdit }: StaffRowProps) => {
  const gradient = gradients[index % gradients.length];
  const formattedName = toSentenceCase(item.full_name);
  const initials = getInitials(item.full_name);

  return (
    <motion.tr
      variants={rowVars}
      initial="initial"
      animate="animate"
      whileHover={{ backgroundColor: "#f8fafc" }}
      className="group border-b border-slate-100 transition-colors last:border-0"
    >
      <td className="p-4">
        <input
          type="checkbox"
          className="text-primary focus:ring-primary h-4 w-4 rounded border-slate-300"
        />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br ${gradient} text-xs font-bold text-white shadow-sm`}
          >
            {initials}
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[13.69px] font-medium text-slate-900">
              {formattedName}
            </p>
            <p className="mt-0.5 text-[12.64px] font-normal text-[#475467]">
              {item.email || "-"}
            </p>
          </div>
        </div>
      </td>
      <td className="p-4 text-sm text-slate-600">
        <span
          className={`rounded-md px-2 py-1 text-xs font-medium ${
            item.gender?.toLowerCase() === "male"
              ? "bg-blue-100 text-blue-700"
              : item.gender?.toLowerCase() === "female"
                ? "bg-pink-100 text-pink-700"
                : "bg-slate-100 text-slate-700"
          }`}
        >
          {toSentenceCase(item.gender) || "-"}
        </span>
      </td>
      <td className="p-4 text-sm text-slate-600">
        {toSentenceCase(item.rank_cadre) || "-"}
      </td>
      <td className="p-4 text-sm text-slate-600">{item.grade_level || "-"}</td>
      <td className="p-4 text-sm text-slate-600">{item.phone_number || "-"}</td>
      <td className="p-4 text-sm text-slate-600">
        {item.date_first_appointment || "-"}
      </td>
      <td className="p-4 text-sm text-slate-600">
        {item.date_of_birth || "-"}
      </td>
      <td className="max-w-48 truncate p-4 text-sm text-slate-600">
        {item.qualifications
          ? Object.keys(item.qualifications).join(", ")
          : "-"}
      </td>
      <td className="p-4 text-sm text-slate-600">
        <span
          className={`rounded-md px-2 py-1 text-xs font-medium ${
            item.is_active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {item.is_active ? "Active" : "Inactive"}
        </span>
      </td>
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
