import { cn } from "@/lib/utils";

function FacilityDetails({
  detail,
  value,
  line,
}: {
  detail:
    | "Type"
    | "Ownership"
    | "LGA"
    | "Working Hours"
    | "Phone Number"
    | "Email Address"
    | "Address";
  value: string;
  line: 1 | 2;
}) {
  return (
    <div
      className={cn(
        "flex h-11 items-center justify-between px-5 text-[15px] text-[#343434]",
        line === 1 ? "bg-[#F6F8FA]" : "bg-white",
      )}
    >
      <span className="font-medium">{detail}:</span>
      <span className="font-normal">{value}</span>
    </div>
  );
}

export default FacilityDetails;
