import Header from "@/features/admin/components/layout/Header";
import Overview from "@/features/admin/components/page/overview";

export default function Home() {
  return (
    <>
      <Header name="Overview" />
      <div className="flex-1 overflow-y-auto bg-white p-6">
        <Overview />
      </div>
    </>
  );
}
