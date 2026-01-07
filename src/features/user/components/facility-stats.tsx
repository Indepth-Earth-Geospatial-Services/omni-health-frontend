"use client";
import { DoctorPatientRatioChart } from "./doctor-patient-ratio";
import FacilityStatCard from "./facility-stat-card";

function FacilityStats() {
  return (
    <div>
      <div className="mt-3 grid grid-cols-3 divide-x divide-[#E2E4E9] text-center">
        <FacilityStatCard attr="Ratings" value={4.9} />
        <FacilityStatCard attr="Dr:Patient" value={"1:34"} />
        <FacilityStatCard attr="Specialists" value={5} />
      </div>

      {/* CHART */}
      <div className="mt-8">
        <DoctorPatientRatioChart />
      </div>
    </div>
  );
}

export default FacilityStats;
