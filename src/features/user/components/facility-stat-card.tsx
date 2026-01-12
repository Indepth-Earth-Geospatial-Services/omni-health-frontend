function FacilityStatCard({
  attr,
  value,
}: {
  attr: "Staff" | "Beds" | "Specialists" | "Ratings" | "Dr:Patient" | string;
  value: number | string;
}) {
  return (
    <div className="*:block">
      <span className="text-[23px]">{value || "N/A"}</span>
      <span className="text-[13px] text-[#868C98]">{attr}</span>
    </div>
  );
}

export default FacilityStatCard;
