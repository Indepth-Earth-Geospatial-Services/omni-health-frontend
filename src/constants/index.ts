import { FilterCategory } from "@/types/search-filter";

export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// export const FILTERCATEGORIES: FilterCategory[] = [
//   {
//     title: "Facility Type",
//     options: [
//       {
//         id: "hospital",
//         icon: "🏥",
//         label: "Hospital",
//         value: "hospital",
//       },
//       {
//         id: "pharmacy",
//         icon: "💊",
//         label: "Pharmacy",
//         value: "pharmacy",
//       },
//       {
//         id: "clinic",
//         icon: "🩺",
//         label: "Clinic",
//         value: "clinic",
//       },
//       {
//         id: "teaching-hospital",
//         label: "Teaching Hospital",
//         value: "teaching_hospital",
//       },
//       {
//         id: "healthcare-center",
//         label: "Healthcare Center",
//         value: "healthcare_center",
//       },
//     ],
//   },
//   {
//     title: "Performance Tier",
//     options: [
//       { id: "high-performance", label: "High Performance", value: "high" },
//       { id: "moderate", label: "Moderate", value: "moderate" },
//       { id: "average", label: "Average", value: "average" },
//     ],
//   },
//   {
//     title: "Service Availability",
//     options: [
//       { id: "cardiology", label: "Cardiology", value: "cardiology" },
//       { id: "dentistry", label: "Dentistry", value: "dentistry" },
//       { id: "dermatology", label: "Dermatology", value: "dermatology" },
//       { id: "emergency", label: "Emergency", value: "emergency" },
//       { id: "ent", label: "ENT", value: "ent" },
//       { id: "maternity", label: "Maternity", value: "maternity" },
//       {
//         id: "general-practice",
//         label: "General Practice",
//         value: "general_practice",
//       },
//       { id: "gynaecology", label: "Gynaecology", value: "gynaecology" },
//       { id: "pediatrics", label: "Pediatrics", value: "pediatrics" },
//       { id: "neurology", label: "Neurology", value: "neurology" },
//     ],
//   },
// ];

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
  {
    title: "Local Government",
    options: [
      { id: "abua-odual", label: "Abua/Odual", value: "abua_odual" },
      { id: "ahoada-east", label: "Ahoada East", value: "ahoada_east" },
      { id: "ahoada-west", label: "Ahoada West", value: "ahoada_west" },
      { id: "akuku-toru", label: "Akuku-Toru", value: "akuku_toru" },
      { id: "andoni", label: "Andoni", value: "andoni" },
      { id: "asari-toru", label: "Asari-Toru", value: "asari_toru" },
      { id: "bonny", label: "Bonny", value: "bonny" },
      { id: "degema", label: "Degema", value: "degema" },
      { id: "eleme", label: "Eleme", value: "eleme" },
      { id: "emohua", label: "Emohua", value: "emohua" },
      { id: "etche", label: "Etche", value: "etche" },
      { id: "gokana", label: "Gokana", value: "gokana" },
      { id: "ikwerre", label: "Ikwerre", value: "ikwerre" },
      { id: "khana", label: "Khana", value: "khana" },
      { id: "obio-akpor", label: "Obio/Akpor", value: "obio_akpor" },
      {
        id: "ogba-egbema-ndoni",
        label: "Ogba/Egbema/Ndoni",
        value: "ogba_egbema_ndoni",
      },
      { id: "ogu-bolo", label: "Ogu/Bolo", value: "ogu_bolo" },
      { id: "okrika", label: "Okrika", value: "okrika" },
      { id: "omuma", label: "Omuma", value: "omuma" },
      { id: "opobo-nkoro", label: "Opobo/Nkoro", value: "opobo_nkoro" },
      { id: "oyigbo", label: "Oyigbo", value: "oyigbo" },
      { id: "port-harcourt", label: "Port Harcourt", value: "port_harcourt" },
      { id: "tai", label: "Tai", value: "tai" },
    ],
  },
];
