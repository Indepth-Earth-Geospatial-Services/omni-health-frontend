import Link from "next/link";

function HelpLine({
  title,
  value,
  icon,
}: {
  title: "Helpline" | "Email Support";
  value: string | number;
  icon: any;
}) {
  const href = title === "Helpline" ? `tel:${value}` : `mailto:${value}`;

  return (
    <Link
      href={href}
      className="flex h-20 items-center gap-2 rounded-3xl border border-[#E2E4E9] bg-white p-4 transition-colors hover:bg-gray-50"
    >
      <div className="flex size-12 items-center justify-center rounded-lg border border-[#E2E4E9] bg-[#F6F8FA]">
        {icon}
      </div>
      <div>
        <h4 className="text-[15px] font-normal">{title}</h4>
        <p className="text-[#868C98]">{value}</p>
      </div>
    </Link>
  );
}

export default HelpLine;
