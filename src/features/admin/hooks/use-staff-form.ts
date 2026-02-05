"use client";

import { useState, useMemo, useCallback } from "react";
import {
  generateFormFields,
  transformFormDataForApi,
  type FieldConfig,
} from "@/features/admin/constants/staff-form-config";

interface FieldError {
  [key: string]: string;
}

interface UseStaffFormOptions {
  schema: Record<string, unknown> | undefined;
  isOpen: boolean;
  isSubmitting: boolean;
  onSubmit?: (data: Record<string, unknown>) => void;
  onClose: () => void;
}

export function useStaffForm({
  schema,
  isOpen,
  isSubmitting,
  onSubmit,
  onClose,
}: UseStaffFormOptions) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<FieldError>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Generate form fields from schema
  const formFields = useMemo(() => {
    if (!schema) return [];
    return generateFormFields(schema);
  }, [schema]);

  // Initial form data based on schema
  const initialFormData = useMemo(() => {
    if (!schema) return {};
    const data: Record<string, string> = {};
    Object.keys(schema).forEach((key) => {
      data[key] = "";
    });
    return data;
  }, [schema]);

  // Initialize form when modal opens
  if (isOpen && !isInitialized && Object.keys(initialFormData).length > 0) {
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
    setIsInitialized(true);
  }

  // Reset initialized flag when modal closes
  if (!isOpen && isInitialized) {
    setIsInitialized(false);
  }

  // Validate a single field
  const validateField = useCallback(
    (name: string, value: unknown): string => {
      const field = formFields.find((f) => f.name === name);
      if (!field) return "";

      const strValue = value?.toString() || "";

      // Required validation
      if (field.required && strValue.trim() === "") {
        return `${field.label} is required`;
      }

      // Skip other validations if field is empty and not required
      if (strValue.trim() === "") return "";

      // Pattern validation
      if (field.validation?.pattern && !field.validation.pattern.test(strValue)) {
        return field.validation.message || `Invalid ${field.label.toLowerCase()}`;
      }

      // Min length validation
      if (field.validation?.minLength && strValue.length < field.validation.minLength) {
        return (
          field.validation.message ||
          `${field.label} must be at least ${field.validation.minLength} characters`
        );
      }

      // Max length validation
      if (field.validation?.maxLength && strValue.length > field.validation.maxLength) {
        return `${field.label} must be at most ${field.validation.maxLength} characters`;
      }

      return "";
    },
    [formFields]
  );

  // Validate all fields
  const validateForm = useCallback((): boolean => {
    const newErrors: FieldError = {};
    let isValid = true;

    formFields.forEach((field) => {
      const error = validateField(field.name, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formFields, formData, validateField]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => {
          const { [name]: _, ...rest } = prev;
          return rest;
        });
      }
    },
    [errors]
  );

  const handleBlur = useCallback(
    (name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      const error = validateField(name, formData[name]);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [formData, validateField]
  );

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Clear error when user selects
    setErrors((prev) => {
      if (prev[name]) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Mark all fields as touched
      const allTouched: Record<string, boolean> = {};
      formFields.forEach((field) => {
        allTouched[field.name] = true;
      });
      setTouched(allTouched);

      // Validate form
      if (!validateForm()) return;

      // Transform and submit
      const cleanedData = transformFormDataForApi(formData);
      onSubmit?.(cleanedData);
    },
    [formFields, formData, validateForm, onSubmit]
  );

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      setFormData({});
      setErrors({});
      setTouched({});
      setIsInitialized(false);
      onClose();
    }
  }, [isSubmitting, onClose]);

  return {
    formData,
    errors,
    touched,
    formFields,
    handleInputChange,
    handleBlur,
    handleSelectChange,
    handleSubmit,
    handleClose,
  };
}

export type { FieldConfig };
