import { Inventory } from "@/types";
import { AdditionalInfoSection } from "./additional-info-section";
import { ContactSection } from "./contact-section";
import { ImageGallery } from "./image-gallery";
import { InventorySection } from "./inventory-section";
import { ServicesSection } from "./service-section";
import { SpecialistsSection } from "./specialists-section";
import { StatsCards } from "./stats-cards";
import { WorkingHoursSection } from "./working-hours-section";
import { memo, Suspense } from "react";
interface OverviewContentProps {
  image_urls: string[];
  avgDailyPatients: number | string;
  doctorPatientRatio: number | string;
  totalBeds: number | string;
  serviceList: string[];
  specialist: string[];
  phone: number | string;
  email: string;
  address: string;
  // eslint-disable-next-line
  workingHours: any;
  inventory: Inventory;
  hfrId: string;
  facilityLga: string;
  town: string;
  facilityCategory: string;
  isLoading?: boolean;
}

export const OverviewContent = memo<OverviewContentProps>(
  ({
    image_urls,
    avgDailyPatients,
    doctorPatientRatio,
    totalBeds,
    serviceList,
    specialist,
    phone,
    email,
    address,
    workingHours,
    inventory,
    hfrId,
    facilityLga,
    town,
    facilityCategory,
    isLoading,
  }) => (
    <div className="px-5 pb-24">
      <ImageGallery image_urls={image_urls} />
      <StatsCards
        avg_daily_patients={avgDailyPatients as number}
        doctor_patient_ratio={doctorPatientRatio as number}
        totalBeds={totalBeds as number}
        baby_cots={inventory?.infrastructure.baby_cots}
        isLoading={isLoading}
      />
      <ServicesSection services_list={serviceList} />
      <SpecialistsSection specialists={specialist} />
      <ContactSection phone={phone as string} email={email} address={address} />
      <WorkingHoursSection working_hours={workingHours} />
      <InventorySection inventory={inventory} />
      <AdditionalInfoSection
        hfr_id={hfrId}
        facility_lga={facilityLga}
        town={town}
        facility_category={facilityCategory}
      />
    </div>
  ),
);
OverviewContent.displayName = "OverviewContent";
