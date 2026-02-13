import { FilterCategory } from "@/types/search-filter";

export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export const FACILITY_KEYS = {
  facility: (id: string) => ["facility", id] as const,
  lgaFacilities: (latitude: number, longitude: number) =>
    [
      "lgaFacilities",
      Math.round(latitude * 100) / 100,
      Math.round(longitude * 100) / 100,
    ] as const,
  nearestFacility: (latitude: number, longitude: number) =>
    [
      "nearestFacility",
      Math.round(latitude * 100) / 100,
      Math.round(longitude * 100) / 100,
    ] as const,
  allFacilities: (filters?: any) => ["allFacilities", filters] as const,
  all: ["facilitySearch"] as const,
  search: (filters: any) =>
    [...FACILITY_KEYS.all, JSON.stringify(filters)] as const,
};

export const FILTERCATEGORIES: FilterCategory[] = [
  {
    title: "Facility Type",
    storeKey: "facilityType",
    selectionType: "single",
    options: [
      {
        id: "general-hospital",
        icon: "🏥",
        label: "General Hospital",
        value: "General Hospital",
      },
      {
        id: "primary-health-center",
        icon: "🏥",
        label: "Primary Health Center",
        value: "Primary Health Center",
      },
      {
        id: "cottage-hospital",
        icon: "🏥",
        label: "Cottage Hospital",
        value: "Cottage Hospital",
      },
      {
        id: "health-post",
        icon: "🩺",
        label: "Health Post",
        value: "Health Post",
      },
      {
        id: "secondary",
        icon: "🏥",
        label: "Secondary",
        value: "Secondary",
      },
    ],
  },

  {
    title: "Service Availability",
    storeKey: "serviceAvailability",
    selectionType: "multiple",
    options: [
      {
        id: "routine-immunization",
        label: "Routine Immunization",
        value: "routine immunization",
      },
      {
        id: "malaria-screening",
        label: "Malaria Screening",
        value: "malaria screening",
      },
      {
        id: "family-planning",
        label: "Family Planning",
        value: "family planning",
      },
      {
        id: "antenatal-care",
        label: "Antenatal Care (ANC)",
        value: "antenatal care (anc)",
      },
      {
        id: "labour-delivery",
        label: "Labour & Delivery",
        value: "labour delivery",
      },
      { id: "pharmacy", label: "Pharmacy", value: "pharmacy" },
      {
        id: "diabetes-screening",
        label: "Diabetes Screening",
        value: "diabetes screening",
      },
      { id: "hiv-screening", label: "HIV Screening", value: "hiv screening" },
      {
        id: "tuberculosis-screening",
        label: "Tuberculosis Screening",
        value: "tuberculosis screening",
      },
      {
        id: "ncd-screening",
        label: "Non-Communicable Diseases",
        value: "non communicable diseases",
      },
      { id: "nutrition", label: "Nutrition", value: "nutrition" },
      {
        id: "emergency",
        label: "Emergency Services",
        value: "accidents and emergency",
      },
      {
        id: "growth-monitoring",
        label: "Growth Monitoring",
        value: "growth monitoring",
      },
      { id: "sti-screening", label: "STI Screening", value: "sti screening" },
    ],
  },
  {
    title: "Local Government",
    storeKey: "lga",
    selectionType: "single",
    options: [
      { id: "abua-odual", label: "Abua/Odual", value: "Abua-Odual" },
      { id: "ahoada-east", label: "Ahoada East", value: "Ahoada-East" },
      { id: "ahoada-west", label: "Ahoada West", value: "Ahoada-West" },
      { id: "akuku-toru", label: "Akuku Toru", value: "Akuku Toru" },
      { id: "andoni", label: "Andoni", value: "Andoni" },
      { id: "asari-toru", label: "Asari-Toru", value: "Asari-Toru" },
      { id: "bonny", label: "Bonny", value: "Bonny" },
      { id: "degema", label: "Degema", value: "Degema" },
      { id: "eleme", label: "Eleme", value: "Eleme" },
      { id: "emohua", label: "Emohua", value: "Emohua" },
      { id: "etche", label: "Etche", value: "Etche" },
      { id: "gokana", label: "Gokana", value: "Gokana" },
      { id: "ikwerre", label: "Ikwerre", value: "Ikwerre" },
      { id: "khana", label: "Khana", value: "Khana" },
      { id: "obio-akpor", label: "Obio/Akpor", value: "Obio-Akpor" },
      {
        id: "ogba-egbema-ndoni",
        label: "Ogba/Egbema/Ndoni",
        value: "Ogba-Egbema-Ndoni",
      },
      { id: "ogu-bolo", label: "Ogu/Bolo", value: "Ogu-Bolo" },
      { id: "okrika", label: "Okrika", value: "Okrika" },
      { id: "omuma", label: "Omuma", value: "Omuma" },
      { id: "opobo-nkoro", label: "Opobo/Nkoro", value: "Opobo-Nkoro" },
      { id: "oyigbo", label: "Oyigbo", value: "Oyigbo" },
      { id: "port-harcourt", label: "Port Harcourt", value: "Port-Harcourt" },
      { id: "tai", label: "Tai", value: "Tai" },
    ],
  },
];
