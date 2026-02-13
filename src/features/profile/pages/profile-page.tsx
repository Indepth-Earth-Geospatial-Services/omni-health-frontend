"use client";

import { UserAvatar } from "@/components/shared/atoms/UserAvatar";
import { useAuthStore } from "@/store/auth-store";
import {
  ArrowLeft,
  Camera,
  Check,
  Loader2,
  Mail,
  Phone,
  Save,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

const PRIMARY_COLOR = "#51a199";

function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [initialData, setInitialData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    image: null as string | null,
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    if (!user) return;

    const normalizedData = {
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      phone: (user?.phone as string) || "+2340000000000",
    };

    setFormData({
      ...normalizedData,
      email: user.email || "",
      image: user?.image || null,
    });

    setInitialData(normalizedData);
  }, [user]);

  // The "Dirty Check" Logic
  const hasChanges = useMemo(() => {
    if (imageFile) return true;

    // Compare fields strictly
    return (
      formData.firstName.trim() !== initialData.firstName ||
      formData.lastName.trim() !== initialData.lastName ||
      formData.phone.trim() !== initialData.phone
    );
  }, [formData, initialData, imageFile]);

  const handleEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const handleStageChange = (field: keyof typeof formData) => {
    const sanitizedValue = tempValue.trim();
    setFormData((prev) => ({ ...prev, [field]: sanitizedValue }));
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, image: previewUrl }));
  };

  const handleGlobalSave = async () => {
    if (!hasChanges) return; // Guard clause

    setIsSaving(true);

    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
      };

      console.log("Creating Payload...", payload);

      // TODO: Replace with actual mutation
      // const formDataToSend = new FormData();
      // formDataToSend.append('data', JSON.stringify(payload));
      // if (imageFile) formDataToSend.append('file', imageFile);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setInitialData({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });
      setImageFile(null);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Save failed", error);
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex h-dvh flex-col bg-white p-4">
      <div className="mb-1 flex items-center gap-3">
        <Link href="/user">
          <ArrowLeft size={24} className="text-slate-700" />
        </Link>
        <div>
          <h1 className="text-[23px] font-medium text-slate-800">Profile</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mt-8 flex flex-col items-center">
          <div className="group relative size-24">
            {/* Note: UserAvatar props adapted to match your state shape */}
            <UserAvatar
              user={{
                firstName: formData.firstName,
                lastName: formData.lastName,
                image: formData.image,
              }}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Change profile picture"
            >
              <Camera size={28} />
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">Click image to change</p>
        </div>

        <div className="mt-7.5 flex flex-col gap-1 pb-5">
          <EditableRow
            label="First Name"
            value={formData.firstName}
            fieldKey="firstName"
            icon={<UserRound size={20} color="#868C98" />}
            isEditing={editingField === "firstName"}
            tempValue={tempValue}
            onEdit={() => handleEdit("firstName", formData.firstName)}
            onSave={() => handleStageChange("firstName")}
            onCancel={handleCancel}
            onChange={setTempValue}
            primaryColor={PRIMARY_COLOR}
          />

          <EditableRow
            label="Last Name"
            value={formData.lastName}
            fieldKey="lastName"
            icon={<UserRound size={20} color="#868C98" />}
            isEditing={editingField === "lastName"}
            tempValue={tempValue}
            onEdit={() => handleEdit("lastName", formData.lastName)}
            onSave={() => handleStageChange("lastName")}
            onCancel={handleCancel}
            onChange={setTempValue}
            primaryColor={PRIMARY_COLOR}
          />

          <EditableRow
            label="Phone"
            value={formData.phone}
            fieldKey="phone"
            icon={<Phone size={20} color="#868C98" />}
            inputType="tel"
            isEditing={editingField === "phone"}
            tempValue={tempValue}
            onEdit={() => handleEdit("phone", formData.phone)}
            onSave={() => handleStageChange("phone")}
            onCancel={handleCancel}
            onChange={setTempValue}
            primaryColor={PRIMARY_COLOR}
          />

          <div className="flex h-16 items-center justify-between border-b border-[#E2E4E9] py-2">
            <div className="flex flex-col">
              <span className="mb-1 text-xs text-slate-400">
                Email (Uneditable)
              </span>
              <div className="flex cursor-not-allowed items-center gap-3 text-[#343434] opacity-70">
                <Mail size={20} color="#868C98" />
                <span>{formData.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 mt-auto w-full bg-white pt-2 pb-5">
        <button
          onClick={handleGlobalSave}
          // Button is disabled if: (Saving OR No Changes)
          disabled={isSaving || !hasChanges}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg text-white shadow-md transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: !hasChanges ? "#ccc" : PRIMARY_COLOR }}
        >
          {isSaving ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Save size={20} />
              <span className="font-medium">
                {hasChanges ? "Save Changes" : "No Changes"}
              </span>
            </>
          )}
        </button>
      </div>
    </main>
  );
}

const EditableRow = ({
  label,
  value,
  fieldKey,
  icon,
  isEditing,
  tempValue,
  onEdit,
  onSave,
  onCancel,
  onChange,
  inputType = "text",
  primaryColor,
}) => (
  <div className="flex h-16 items-center justify-between border-b border-[#E2E4E9] py-2">
    <div className="mr-4 flex w-full flex-col">
      {!isEditing && (
        <span className="mb-1 text-xs text-slate-400">{label}</span>
      )}

      <div className="flex items-center gap-3 text-[#343434]">
        {icon}
        {isEditing ? (
          <input
            type={inputType}
            value={tempValue}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border-b-2 bg-transparent pb-1 outline-none"
            style={{ borderColor: primaryColor }}
            autoFocus
          />
        ) : (
          <span className="truncate font-medium">{value}</span>
        )}
      </div>
    </div>

    {isEditing ? (
      <div className="flex shrink-0 gap-4">
        <button
          onClick={onSave}
          className="rounded p-1 transition-colors hover:bg-green-50"
          style={{ color: "green" }}
        >
          <Check size={20} />
        </button>
        <button
          onClick={onCancel}
          className="rounded p-1 transition-colors hover:bg-red-50"
          style={{ color: "red" }}
        >
          <X size={20} />
        </button>
      </div>
    ) : (
      <button
        onClick={onEdit}
        className="shrink-0 text-sm font-medium transition-opacity hover:opacity-80"
        style={{ color: primaryColor }}
      >
        Edit
      </button>
    )}
  </div>
);

export default ProfilePage;
