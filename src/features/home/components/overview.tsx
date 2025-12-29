// import { Mail, Phone } from "lucide-react";
// import FacilityCapacity from "./facility-capacity";
// import StaffInventoryCard from "./staff-inventory-card";
// import FacilityDetails from "./facility-details";
// import { NearestFacilityResponse } from "../types/apiResponse";

// function Overview({ facilityDetails }: NearestFacilityResponse | null) {
//   return (
//     <div>
//       {/* HEADER */}
//       <div className="px-5">
//         <h3 className="mb-2 text-[19px] font-normal">Officer in Charge</h3>
//         <h4 className="text-[15px] font-medium">
//           Dr Fola Adeleke
//           <span className="block text-[13px] text-[#868C98]">Head Doctor</span>
//         </h4>
//         {/* contact details */}
//         <div className="text-primary mt-3 space-y-1.5 text-[13px] *:flex *:items-center *:gap-x-2">
//           <p>
//             <Phone size={15} /> +23490556789
//           </p>
//           <p>
//             <Mail size={15} /> folamedical@gmail.com
//           </p>
//         </div>
//       </div>

//       {/* BODY */}
//       <div className="mt-[23.74px] border-t border-[#E2E4E9] px-5">
//         <div className="mt-[24.26px] grid grid-cols-3 divide-x divide-[#E2E4E9] text-center">
//           <FacilityCapacity attr="Staff" value={39} />
//           <FacilityCapacity attr="Beds" value={23} />
//           <FacilityCapacity attr="Specialists" value={5} />
//         </div>

//         {/* STAFF INVENTORY */}
//         <div className="mt-6">
//           <h3 className="mb-3 text-[19px]">Staff Inventory</h3>
//           <div className="grid grid-cols-2 gap-3">
//             <StaffInventoryCard staff="Doctors" number={8} />
//             <StaffInventoryCard staff="Nurses" number={22} />
//             <StaffInventoryCard staff="Pharmacists" number={2} />
//             <StaffInventoryCard staff="Lab Technicians" number={4} />
//             <StaffInventoryCard staff="Specialists" number={5} />
//             <StaffInventoryCard staff="Admin Staff" number={8} />
//           </div>
//         </div>
//       </div>

//       {/* FOOTER */}
//       <div className="mt-6 grid">
//         <FacilityDetails detail="Type" value="Hospital" line={1} />
//         <FacilityDetails detail="Ownership" value="Private" line={2} />
//         <FacilityDetails detail="LGA" value="Ikwerre" line={1} />
//         <FacilityDetails
//           detail="Working Hours"
//           value="07:00am - 6:00pm"
//           line={2}
//         />
//         <FacilityDetails detail="Phone Number" value="+234906733567" line={1} />
//         <FacilityDetails
//           detail="Email Address"
//           value="shammahcare@gmail.com"
//           line={2}
//         />
//         <FacilityDetails
//           detail="Address"
//           value="78 Queens Drive, Yaba"
//           line={1}
//         />
//       </div>
//     </div>
//   );
// }

// export default Overview;
"use client";
import { Mail, Phone } from "lucide-react";
import FacilityCapacity from "./facility-capacity";
import StaffInventoryCard from "./staff-inventory-card";
import FacilityDetails from "./facility-details";
import { NearestFacilityResponse } from "../types/apiResponse";

interface OverviewProps {
  facility: NearestFacilityResponse | null;
}

function Overview({ facility }: OverviewProps) {
  if (!facility) {
    return <div className="px-5 py-4">Loading facility details...</div>;
  }

  // Calculate total staff
  const totalStaff = facility.total_doctors || 0;

  // Extract working hours (using Monday as default, or first available day)
  const workingHoursText =
    facility.working_hours?.monday ||
    facility.working_hours?.tuesday ||
    facility.working_hours?.wednesday ||
    facility.working_hours?.thursday ||
    facility.working_hours?.friday ||
    "N/A";

  return (
    <div>
      {/* HEADER */}
      <div className="px-5">
        <h3 className="mb-2 text-[19px] font-normal">Officer in Charge</h3>
        <h4 className="text-[15px] font-medium">
          N/A
          <span className="block text-[13px] text-[#868C98]">Head Doctor</span>
        </h4>
        {/* contact details */}
        <div className="text-primary mt-3 space-y-1.5 text-[13px] *:flex *:items-center *:gap-x-2">
          <p>
            <Phone size={15} /> {facility.contact_info?.phone || "N/A"}
          </p>
          <p>
            <Mail size={15} /> {facility.contact_info?.email || "N/A"}
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="mt-[23.74px] border-t border-[#E2E4E9] px-5">
        <div className="mt-[24.26px] grid grid-cols-3 divide-x divide-[#E2E4E9] text-center">
          <FacilityCapacity attr="Staff" value={totalStaff} />
          <FacilityCapacity attr="Beds" value={0} />
          <FacilityCapacity
            attr="Specialists"
            value={facility.specialists?.length || 0}
          />
        </div>

        {/* STAFF INVENTORY */}
        <div className="mt-6">
          <h3 className="mb-3 text-[19px]">Staff Inventory</h3>
          <div className="grid grid-cols-2 gap-3">
            <StaffInventoryCard
              staff="Doctors"
              number={facility.total_doctors || 0}
            />
            <StaffInventoryCard staff="Nurses" number={0} />
            <StaffInventoryCard staff="Pharmacists" number={0} />
            <StaffInventoryCard staff="Lab Technicians" number={0} />
            <StaffInventoryCard
              staff="Specialists"
              number={facility.specialists?.length || 0}
            />
            <StaffInventoryCard staff="Admin Staff" number={0} />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-6 grid">
        <FacilityDetails
          detail="Type"
          value={facility.facility_category || "N/A"}
          line={1}
        />
        <FacilityDetails detail="Ownership" value="N/A" line={2} />
        <FacilityDetails detail="LGA" value={facility.town || "N/A"} line={1} />
        <FacilityDetails
          detail="Working Hours"
          value={workingHoursText}
          line={2}
        />
        <FacilityDetails
          detail="Phone Number"
          value={facility.contact_info?.phone || "N/A"}
          line={1}
        />
        <FacilityDetails
          detail="Email Address"
          value={facility.contact_info?.email || "N/A"}
          line={2}
        />
        <FacilityDetails
          detail="Address"
          value={facility.address || "N/A"}
          line={1}
        />
      </div>
    </div>
  );
}

export default Overview;
