import HeaderProps from "@/features/super-admin/components/layouts/HeaderProps";
import Registrypage from "@/features/super-admin/components/pages/FacilityRegistry";
// import Header from "@/features/admin/components/layout/Header";
export default function Analytics() {
    return (
        <>
            {/* <Header name="Facility Regsistry" /> */}
            <div className="flex-1 overflow-y-auto bg-white p-6">
                <main className="flex min-h-screen flex-col">
                    <HeaderProps title="Facility Registry" description="Manage and monitor all registered healthcare facilities" />
                    <Registrypage />
                </main>
            </div>
        </>
    );
}