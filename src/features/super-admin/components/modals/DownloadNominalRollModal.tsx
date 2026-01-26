"use client";

import React, { useState } from "react";
import { X, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/features/admin/components/ui/button";

interface DownloadNominalRollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (scope: string) => void;
  totalRecords?: number;
}

const DownloadNominalRollModal: React.FC<DownloadNominalRollModalProps> = ({
  isOpen,
  onClose,
  onDownload,
  totalRecords = 25,
}) => {
  const [selectedScope, setSelectedScope] = useState("All Facilities");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const scopeOptions = [
    "All Facilities",
    "Selected Facilities",
    "By LGA",
    "By Zone",
  ];

  if (!isOpen) return null;

  const handleDownload = () => {
    onDownload(selectedScope);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {/* Modal Title */}
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Download Nominal Roll
        </h2>

        {/* Download Scope Section */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Download Scope
          </label>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              {selectedScope}
              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                {scopeOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedScope(option);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-50 ${
                      selectedScope === option
                        ? "bg-teal-50 font-medium text-teal-700"
                        : "text-gray-700"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Records Count */}
        <p className="mb-6 text-sm text-gray-600">
          {totalRecords} staff records will be included
        </p>

        {/* Download Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleDownload}
            size="lg"
            className="flex items-center gap-2"
          >
            Download Nominal Role (PDF)
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DownloadNominalRollModal;
