"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, Mail, Phone, UserRound, Check, X } from "lucide-react";
import profileImage from "@assets/img/profile-image.jpg";
import Link from "next/link";

function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Tee Godwin",
    phone: "+2348149175895",
    email: "mmorgrace@gmail.com",
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

  const handleEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const handleSave = (field: keyof typeof profile) => {
    setProfile((prev) => ({ ...prev, [field]: tempValue }));
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue("");
  };

  return (
    <main className="h-dvh p-5">
      <div className="mb-3 flex items-center gap-3">
        <Link href="/">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-[23px] font-medium">Profile</h1>
        </div>
      </div>

      <div className="relative mx-auto mt-8.25 size-37.5 overflow-hidden rounded-full">
        <Image
          src={profileImage}
          alt="profile image"
          fill
          className="object-cover"
        />
      </div>

      {/* PROFILE DETAILS */}
      <div className="mt-7.5 text-[15px] *:flex *:h-12 *:items-center *:justify-between *:border-b *:border-[#E2E4E9]">
        {/* NAME */}
        <div>
          <label className="flex items-center gap-3 text-[#343434]">
            <UserRound size={24} color="#868C98" />
            {editingField === "name" ? (
              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="border-primary border-b bg-transparent outline-none"
                autoFocus
              />
            ) : (
              profile.name
            )}
          </label>
          {editingField === "name" ? (
            <div className="flex gap-2">
              <button
                onClick={() => handleSave("name")}
                className="text-green-600"
              >
                <Check size={20} />
              </button>
              <button onClick={handleCancel} className="text-red-600">
                <X size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleEdit("name", profile.name)}
              className="text-primary"
            >
              Edit
            </button>
          )}
        </div>

        {/* PHONE */}
        <div>
          <label className="flex items-center gap-3 text-[#343434]">
            <Phone size={24} color="#868C98" />
            {editingField === "phone" ? (
              <input
                type="tel"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="border-primary border-b bg-transparent outline-none"
                autoFocus
              />
            ) : (
              profile.phone
            )}
          </label>
          {editingField === "phone" ? (
            <div className="flex gap-2">
              <button
                onClick={() => handleSave("phone")}
                className="text-green-600"
              >
                <Check size={20} />
              </button>
              <button onClick={handleCancel} className="text-red-600">
                <X size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleEdit("phone", profile.phone)}
              className="text-primary"
            >
              Edit
            </button>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label className="flex items-center gap-3 text-[#343434]">
            <Mail size={24} color="#868C98" />
            {editingField === "email" ? (
              <input
                type="email"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="border-primary border-b bg-transparent outline-none"
                autoFocus
              />
            ) : (
              profile.email
            )}
          </label>
          {editingField === "email" ? (
            <div className="flex gap-2">
              <button
                onClick={() => handleSave("email")}
                className="text-green-600"
              >
                <Check size={20} />
              </button>
              <button onClick={handleCancel} className="text-red-600">
                <X size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleEdit("email", profile.email)}
              className="text-primary"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default ProfilePage;
