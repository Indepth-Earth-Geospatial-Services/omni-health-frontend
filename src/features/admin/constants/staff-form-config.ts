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

// Maps schema field names to user-friendly labels
export const FIELD_LABEL_MAP: Record<string, string> = {
  full_name: "Full Name",
  gender: "Gender",
  rank_cadre: "Rank/Cadre",
  grade_level: "Grade Level",
  phone_number: "Phone Number",
  email: "Email Address",
  date_first_appointment: "Date of First Appointment",
  date_of_birth: "Date of Birth",
  qualifications: "Qualifications",
  is_active: "Status",
  remark: "Remark",
  presentAppt: "Date of Present Appointment",
  stateOrigin: "State/LGA of Origin",
  yearsInStation: "Years in Present Station",
};

// Maps schema field names to input types
export const FIELD_TYPE_MAP: Record<string, FieldConfig["type"]> = {
  full_name: "text",
  gender: "select",
  rank_cadre: "text",
  grade_level: "text",
  phone_number: "tel",
  email: "email",
  date_first_appointment: "date",
  date_of_birth: "date",
  qualifications: "text",
  is_active: "select",
  remark: "textarea",
  presentAppt: "date",
  stateOrigin: "text",
  yearsInStation: "number",
};

// Field options for select fields
export const FIELD_OPTIONS_MAP: Record<string, string[]> = {
  gender: ["M", "F"],
  is_active: ["Active", "Inactive"],
};

// Validation rules for fields
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

// Fields that should be full width
export const FULL_WIDTH_FIELDS = ["full_name", "remark", "qualifications"];

// Fields that are required
export const REQUIRED_FIELDS = ["full_name"];

// Field display order
export const FIELD_ORDER = [
  "full_name",
  "gender",
  "rank_cadre",
  "grade_level",
  "phone_number",
  "email",
  "date_first_appointment",
  "presentAppt",
  "date_of_birth",
  "stateOrigin",
  "yearsInStation",
  "qualifications",
  "is_active",
  "remark",
];

// Generate field config from schema key
export function generateFieldConfig(key: string): FieldConfig {
  return {
    name: key,
    label:
      FIELD_LABEL_MAP[key] ||
      key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    type: FIELD_TYPE_MAP[key] || "text",
    placeholder: `Enter ${FIELD_LABEL_MAP[key]?.toLowerCase() || key.replace(/_/g, " ")}`,
    required: REQUIRED_FIELDS.includes(key),
    options: FIELD_OPTIONS_MAP[key],
    fullWidth: FULL_WIDTH_FIELDS.includes(key),
    validation: FIELD_VALIDATION_MAP[key],
  };
}

// Generate sorted form fields from schema
export function generateFormFields(schema: Record<string, unknown>): FieldConfig[] {
  const schemaKeys = Object.keys(schema);

  // Sort fields based on predefined order
  const sortedKeys = [...schemaKeys].sort((a, b) => {
    const indexA = FIELD_ORDER.indexOf(a);
    const indexB = FIELD_ORDER.indexOf(b);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return sortedKeys.map(generateFieldConfig);
}

// Transform form data for API submission
export function transformFormDataForApi(
  formData: Record<string, unknown>
): Record<string, unknown> {
  return Object.entries(formData).reduce(
    (acc, [key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        // Convert qualifications string to object format
        if (key === "qualifications" && typeof value === "string" && value.trim()) {
          const qualArray = value.split(",").map((q) => q.trim()).filter(Boolean);
          acc[key] = qualArray.reduce(
            (obj, qual) => {
              obj[qual] = {};
              return obj;
            },
            {} as Record<string, unknown>
          );
        }
        // Convert gender display value to API format
        else if (key === "gender") {
          acc[key] = value === "Male" ? "M" : value === "Female" ? "F" : value;
        }
        // Convert is_active to boolean
        else if (key === "is_active") {
          acc[key] = value === "Active";
        } else {
          acc[key] = value;
        }
      }
      return acc;
    },
    {} as Record<string, unknown>
  );
}
