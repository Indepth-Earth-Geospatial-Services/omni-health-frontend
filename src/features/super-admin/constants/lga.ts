// Single source of truth for Rivers State LGAs
const RIVERS_LGA_NAMES = [
  "Abua/Odual",
  "Ahoada East",
  "Ahoada West",
  "Akuku-Toru",
  "Andoni",
  "Asari-Toru",
  "Bonny",
  "Degema",
  "Eleme",
  "Emohua",
  "Etche",
  "Gokana",
  "Ikwerre",
  "Khana",
  "Obio/Akpor",
  "Ogba/Egbema/Ndoni",
  "Ogu/Bolo",
  "Okrika",
  "Omuma",
  "Opobo/Nkoro",
  "Oyigbo",
  "Port Harcourt",
  "Tai",
] as const;

// Helper to create slug from name
const toSlug = (name: string) =>
  name.toLowerCase().replace(/[/\s]+/g, "-");

// LGA data for multi-select (with numeric values)
export const RIVERS_STATE_LGAS = RIVERS_LGA_NAMES.map((name, idx) => ({
  value: String(idx + 1),
  label: name,
}));

export type LGA = (typeof RIVERS_STATE_LGAS)[number];

// LGA string list for select dropdowns
export const LGA_OPTIONS = [...RIVERS_LGA_NAMES];

// LGA filter options with slug values (includes "All LGAs" option)
export const LGA_FILTER_OPTIONS = [
  { value: "all", label: "All LGAs" },
  ...RIVERS_LGA_NAMES.map((name) => ({
    value: toSlug(name),
    label: name,
  })),
];

// Facility types for healthcare facilities
export const FACILITY_TYPES = [
  "Health Post",
  "Health Clinic",
  "Model Primary Health Care",
];

// Nigerian states (limited for now)
export const NIGERIAN_STATES = ["Rivers"];

// Gender filter options
export const GENDER_FILTER_OPTIONS = [
  { value: "all", label: "All Genders" },
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
];

// Status filter options
export const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];
