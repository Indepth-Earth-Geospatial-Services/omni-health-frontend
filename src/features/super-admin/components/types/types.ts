// types.ts

export type ExportFormat = "CSV" | "EXCEL";

export interface FacilityOption {
  facility_id: string;
  facility_name: string;
  facility_lga?: string;
  facility_category?: string;
}

export interface FacilityFilterState {
  searchQuery: string;
  selectedCategory: string;
  selectedLGA: string;
  selectedFacility: string;
  sortBy: string;
  sortDirection: "asc" | "desc";
}

export const INITIAL_FILTER_STATE: FacilityFilterState = {
  searchQuery: "",
  selectedCategory: "all",
  selectedLGA: "all",
  selectedFacility: "all",
  sortBy: "",
  sortDirection: "asc",
};

export const SORT_OPTIONS = [
  { value: "name_asc", label: "Name (A-Z)" },
  { value: "name_desc", label: "Name (Z-A)" },
  { value: "lga_asc", label: "LGA (A-Z)" },
  { value: "category_asc", label: "Category (A-Z)" },
  { value: "updated_desc", label: "Recently Updated" },
  { value: "updated_asc", label: "Oldest Updated" },
];

export const CATEGORY_OPTIONS = [
  { value: "hospital", label: "Hospital" },
  { value: "hospital post", label: "Hospital Post" },
  { value: "model healthcare", label: "Model Healthcare" },
  { value: "Health clinic", label: "Health Clinic" },
];

export const LGA_OPTIONS = [
  { value: "Port Harcourt", label: "Port Harcourt" },
  { value: "Obio/Akpor", label: "Obio/Akpor" },
  { value: "Eleme", label: "Eleme" },
  { value: "Ikwerre", label: "Ikwerre" },
  { value: "Emohua", label: "Emohua" },
  { value: "Ahoada East", label: "Ahoada East" },
  { value: "Ahoada West", label: "Ahoada West" },
  { value: "Ogba/Egbema/Ndoni", label: "Ogba/Egbema/Ndoni" },
  { value: "Okrika", label: "Okrika" },
  { value: "Ogu/Bolo", label: "Ogu/Bolo" },
  { value: "Tai", label: "Tai" },
  { value: "Gokana", label: "Gokana" },
  { value: "Khana", label: "Khana" },
  { value: "Oyigbo", label: "Oyigbo" },
  { value: "Etche", label: "Etche" },
  { value: "Omuma", label: "Omuma" },
  { value: "Abua/Odual", label: "Abua/Odual" },
  { value: "Akuku-Toru", label: "Akuku-Toru" },
  { value: "Asari-Toru", label: "Asari-Toru" },
  { value: "Degema", label: "Degema" },
  { value: "Bonny", label: "Bonny" },
  { value: "Andoni", label: "Andoni" },
];
