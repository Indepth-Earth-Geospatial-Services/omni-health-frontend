function FacilityCapacity({
  attr,
  value,
}: {
  attr: "Staff" | "Beds" | "Specialists";
  value: number;
}) {
  return (
    <div className="*:block">
      <span className="text-[23px]">{value || "N/A"}</span>
      <span className="text-[13px] text-[#868C98]">{attr}</span>
    </div>
  );
}

export default FacilityCapacity;
