function StaffInventoryCard({
  number,
  staff,
}: {
  number: number;
  staff:
    | "Doctors"
    | "Nurses"
    | "Pharmacists"
    | "Lab Technicians"
    | "Specialists"
    | "Admin Staff"
    | string;
}) {
  return (
    <div className="flex h-35 flex-col items-center justify-center gap-y-2 rounded-2xl border border-[#E2E4E9] bg-[#F6F8FA] p-1 text-center">
      <span className="text-[24px] font-medium text-[#0A0D14]">
        {number || "N/A"}
      </span>
      <span className="text-base text-[#868C98]">{staff}</span>
    </div>
  );
}

export default StaffInventoryCard;
