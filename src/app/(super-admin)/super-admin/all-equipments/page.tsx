import HeaderProps from "@/features/super-admin/components/layouts/HeaderProps";
import EquipmentPage from "@/features/super-admin/components/pages/AllEquipments";

export default function AllEquipments() {
  return (
    <>
      <div className="flex-1 overflow-y-auto bg-white p-6">
        <main className="flex min-h-screen flex-col">
          <HeaderProps
            title="Equipment & Infrastructure"
            description="Track medical equipment and infrastructure across facilities"
          />
          <EquipmentPage />
        </main>
      </div>
    </>
  );
}
