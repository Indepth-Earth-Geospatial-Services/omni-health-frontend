// Field configuration types
export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "select" | "date" | "tel" | "number" | "textarea" | "email";
  placeholder?: string;
  required?: boolean;
  options?: string[];
  fullWidth?: boolean;
  validation?: {
    pattern?: RegExp;
    message?: string;
    minLength?: number;
    maxLength?: number;
  };
}

// Maps API field names to user-friendly labels
export const FIELD_LABEL_MAP: Record<string, string> = {
  full_name: "Full Name",
  gender: "Sex",
  rank_cadre: "Rank/Cadre",
  grade_level: "Grade Level (G/L)",
  qualifications: "Qualifications",
  date_first_appointment: "Date of First Appointment",
  date_confirmation: "Confirmation of Appointment",
  date_present_appointment: "Date of Present Appointment",
  date_of_birth: "Date of Birth",
  lga_origin: "LGA of Origin",
  years_in_present_station: "Years in Present Station",
  phone_number: "Phone Number",
  email: "Email Address",
  is_active: "Status",
  remark: "Remark",
};

// Maps API field names to input types
export const FIELD_TYPE_MAP: Record<string, FieldConfig["type"]> = {
  full_name: "text",
  gender: "select",
  rank_cadre: "text",
  grade_level: "text",
  qualifications: "text",
  date_first_appointment: "date",
  date_confirmation: "date",
  date_present_appointment: "date",
  date_of_birth: "date",
  lga_origin: "text",
  years_in_present_station: "text",
  phone_number: "tel",
  email: "email",
  is_active: "select",
  remark: "textarea",
};

// Field options for select fields
export const FIELD_OPTIONS_MAP: Record<string, string[]> = {
  gender: ["M", "F"],
  is_active: ["Active", "Inactive"],
};

// Validation rules
export const FIELD_VALIDATION_MAP: Record<string, FieldConfig["validation"]> = {
  full_name: {
    minLength: 2,
    message: "Full name must be at least 2 characters",
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  },
  phone_number: {
    pattern: /^[\d\s+()-]{7,20}$/,
    message: "Please enter a valid phone number",
  },
};

// Fields that span the full width of the form
export const FULL_WIDTH_FIELDS = ["full_name", "qualifications", "remark"];

// Only full_name is required — all other fields are optional
export const REQUIRED_FIELDS = ["full_name"];

// Controls display order — matches the table column order
export const FIELD_ORDER = [
  "full_name",
  "gender",
  "rank_cadre",
  "grade_level",
  "qualifications",
  "date_first_appointment",
  "date_confirmation",
  "date_present_appointment",
  "date_of_birth",
  "lga_origin",
  "years_in_present_station",
  "phone_number",
  "email",
  "is_active",
  "remark",
];

const FIELD_PLACEHOLDER_MAP: Record<string, string> = {
  qualifications: "e.g. MBBS:2010, BSc:2015 (name:year, comma separated)",
  phone_number: "e.g. 08012345678",
};

// Generate a single field config from a schema key
export function generateFieldConfig(key: string): FieldConfig {
  const label = FIELD_LABEL_MAP[key] || key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  return {
    name: key,
    label,
    type: FIELD_TYPE_MAP[key] || "text",
    placeholder: FIELD_PLACEHOLDER_MAP[key] ?? `Enter ${label.toLowerCase()}`,
    required: REQUIRED_FIELDS.includes(key),
    options: FIELD_OPTIONS_MAP[key],
    fullWidth: FULL_WIDTH_FIELDS.includes(key),
    validation: FIELD_VALIDATION_MAP[key],
  };
}

// Generate all form fields always using FIELD_ORDER as the authoritative list.
// The schema parameter is accepted for API compatibility but the field list
// is never gated on what the API happens to return for a given facility.
export function generateFormFields(
  _schema: Record<string, unknown>,
): FieldConfig[] {
  return FIELD_ORDER.map(generateFieldConfig);
}

// Transform form data into the shape the API expects
export function transformFormDataForApi(
  formData: Record<string, unknown>,
): Record<string, unknown> {
  return Object.entries(formData).reduce(
    (acc, [key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        if (key === "qualifications" && typeof value === "string" && value.trim()) {
          // Convert "name:year" comma-separated string to [{qualification, year}]
          acc[key] = value
            .split(",")
            .map((q) => q.trim())
            .filter(Boolean)
            .map((q) => {
              const [qualification, yearStr] = q.split(":").map((s) => s.trim());
              const year = yearStr ? parseInt(yearStr, 10) : 0;
              return { qualification, year };
            });
        } else if (key === "phone_number" && typeof value === "string" && value.trim()) {
          // Send phone_number as string[]
          acc[key] = value.split(",").map((p) => p.trim()).filter(Boolean);
        } else if (key === "gender") {
          acc[key] = value === "Male" ? "M" : value === "Female" ? "F" : value;
        } else if (key === "is_active") {
          acc[key] = value === "Active";
        } else {
          acc[key] = value;
        }
      }
      return acc;
    },
    {} as Record<string, unknown>,
  );
}
