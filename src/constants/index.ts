import { FilterCategory } from "@/types/search-filter";

export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export const FILTERCATEGORIES: FilterCategory[] = [
  {
    title: "Facility Type",
    options: [
      {
        id: "hospital",
        icon: "🏥",
        label: "Hospital",
        value: "hospital",
      },
      {
        id: "pharmacy",
        icon: "💊",
        label: "Pharmacy",
        value: "pharmacy",
      },
      {
        id: "clinic",
        icon: "🩺",
        label: "Clinic",
        value: "clinic",
      },
      {
        id: "teaching-hospital",
        label: "Teaching Hospital",
        value: "teaching_hospital",
      },
      {
        id: "healthcare-center",
        label: "Healthcare Center",
        value: "healthcare_center",
      },
    ],
  },
  {
    title: "Performance Tier",
    options: [
      { id: "high-performance", label: "High Performance", value: "high" },
      { id: "moderate", label: "Moderate", value: "moderate" },
      { id: "average", label: "Average", value: "average" },
    ],
  },
  {
    title: "Service Availability",
    options: [
      { id: "cardiology", label: "Cardiology", value: "cardiology" },
      { id: "dentistry", label: "Dentistry", value: "dentistry" },
      { id: "dermatology", label: "Dermatology", value: "dermatology" },
      { id: "emergency", label: "Emergency", value: "emergency" },
      { id: "ent", label: "ENT", value: "ent" },
      { id: "maternity", label: "Maternity", value: "maternity" },
      {
        id: "general-practice",
        label: "General Practice",
        value: "general_practice",
      },
      { id: "gynaecology", label: "Gynaecology", value: "gynaecology" },
      { id: "pediatrics", label: "Pediatrics", value: "pediatrics" },
      { id: "neurology", label: "Neurology", value: "neurology" },
    ],
  },
];
