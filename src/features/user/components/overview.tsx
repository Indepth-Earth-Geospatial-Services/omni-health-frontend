"use client";
import { Mail, Phone } from "lucide-react";
import { Facility } from "../types";
import FacilityDetails from "./facility-details";
import FacilityStatCard from "./facility-stat-card";
import StaffInventoryCard from "./staff-inventory-card";

interface OverviewProps {
  facility: Facility | null;
}

function Overview({ facility }: OverviewProps) {
  if (!facility) {
    return <div className="px-5 py-4">Loading facility details...</div>;
  }

  // Variables for component
  const totalStaff = facility?.specialists.length || 0;

  // Working hours variables
  const mondayHours = facility.working_hours?.monday;
  const tuesdayHours = facility.working_hours?.tuesday;
  const wednesdayHours = facility.working_hours?.wednesday;
  const thursdayHours = facility.working_hours?.thursday;
  const fridayHours = facility.working_hours?.friday;

  const workingHoursText =
    mondayHours ||
    tuesdayHours ||
    wednesdayHours ||
    thursdayHours ||
    fridayHours ||
    "N/A";

  // Inventory variables
  const deliveryBeds = facility?.inventory?.delivery_beds || 0;
  const babyCots = facility?.inventory?.baby_cots || 0;
  const inPatientBeds = facility?.inventory?.inpatient_beds || 0;
  const resuscitationBeds = facility?.inventory?.resuscitation_beds || 0;
  const totalBeds = deliveryBeds + babyCots + inPatientBeds + resuscitationBeds;

  // Contact variables
  const phoneNumber = facility.contact_info?.phone || "N/A";
  const emailAddress = facility.contact_info?.email || "N/A";
  const facilityAddress = facility.address || "N/A";
  const facilityCategory = facility.facility_category || "N/A";
  const town = facility.town || "N/A";

  // Staff variables
  const specialistsCount = facility.specialists?.length || 0;

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
            <Phone size={15} /> {phoneNumber}
          </p>
          <p>
            <Mail size={15} /> {emailAddress}
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="mt-[23.74px] border-t border-[#E2E4E9] px-5">
        <div className="mt-[24.26px] grid grid-cols-3 divide-x divide-[#E2E4E9] text-center">
          <FacilityStatCard attr="Staff" value={totalStaff} />
          <FacilityStatCard attr="Beds" value={totalBeds} />
          <FacilityStatCard attr="Specialists" value={specialistsCount} />
        </div>

        {/* STAFF INVENTORY */}
        <div className="mt-6">
          <h3 className="mb-3 text-[19px]">Staff Inventory</h3>
          <div className="grid grid-cols-2 gap-3">
            {facility.specialists.map((specialist, i) => (
              <StaffInventoryCard key={i} staff={specialist} number={1} />
            ))}
            <StaffInventoryCard staff="Nurses" number={0} />
            <StaffInventoryCard staff="Pharmacists" number={0} />
            <StaffInventoryCard staff="Lab Technicians" number={0} />
            <StaffInventoryCard staff="Admin Staff" number={0} />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-6 grid">
        <FacilityDetails detail="Type" value={facilityCategory} line={1} />
        <FacilityDetails detail="Ownership" value="N/A" line={2} />
        <FacilityDetails detail="LGA" value={town} line={1} />
        <FacilityDetails
          detail="Working Hours"
          value={workingHoursText}
          line={2}
        />
        <FacilityDetails detail="Phone Number" value={phoneNumber} line={1} />
        <FacilityDetails detail="Email Address" value={emailAddress} line={2} />
        <FacilityDetails detail="Address" value={facilityAddress} line={1} />
      </div>
    </div>
  );
}

export default Overview;
