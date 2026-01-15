import Header from "@/features/admin/components/layout/Header";
import StaffList from "@/features/admin/components/layout/Staff";

// TODO: Replace with actual facility ID from auth/context
const FACILITY_ID = "75588a51-efc2-4754-ad08-7726ff976664";

export default function Staff() {
    return (
        <>
            <Header name="Staff Management" />
            <div className="flex-1 overflow-y-auto bg-white p-6">
                <main className="flex min-h-screen flex-col">
                    <StaffList facilityId={FACILITY_ID} />
                </main>
            </div>
        </>
    );
}
