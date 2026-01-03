// import { ListFilter, Search } from "lucide-react";
// import { Input } from "../ui/input";
// interface SearchBarProps {
//   filter: boolean;
// }
// function SearchBar({ filter = false }) {
//   return (
//     <div className="relative w-full">
//       <Input
//         className="h-12 rounded-full border border-[#E2E4E9] px-12 placeholder:text-[15px] placeholder:text-[#868C98]"
//         placeholder="Search for Facilities"
//       />
//       <div className="absolute top-1/2 left-4 -translate-y-1/2">
//         <Search color="#868C98" size={24} />
//       </div>
//       {filter && (
//         <div
//           role="button"
//           className="absolute top-1/2 right-4 -translate-y-1/2"
//         >
//           <ListFilter size={20} color="#868C98" />
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import { ListFilter, Search, X, ChevronDown } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";

interface SearchBarProps {
  filter?: boolean;
}

function SearchBar({ filter = false }: SearchBarProps) {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedTier, setSelectedTier] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>("type");

  const facilityTypes = [
    "Hospital",
    "Pharmacy",
    "Clinic",
    "Teaching Hospital",
    "Healthcare Center",
  ];
  const performanceTiers = ["High Performance", "Moderate", "Average"];
  const services = [
    "Cardiology",
    "Dentistry",
    "Dermatology",
    "Emergency",
    "ENT",
    "Maternity",
    "General Practice",
    "Gynaecology",
    "Paediatrics",
    "Neurology",
  ];

  const toggleSelection = (
    item: string,
    list: string[],
    setter: (val: string[]) => void,
  ) => {
    setter(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item],
    );
  };

  const handleClearAll = () => {
    setSelectedTypes([]);
    setSelectedTier([]);
    setSelectedServices([]);
  };

  const handleApply = () => {
    console.log({ selectedTypes, selectedTier, selectedServices });
    setShowFilter(false);
  };

  return (
    <>
      <div className="relative w-full">
        <Input
          className="h-12 rounded-full border border-[#E2E4E9] px-12 placeholder:text-[15px] placeholder:text-[#868C98]"
          placeholder="Search for Facilities"
        />
        <div className="absolute top-1/2 left-4 -translate-y-1/2">
          <Search color="#868C98" size={24} />
        </div>
        {filter && (
          <button
            onClick={() => setShowFilter(true)}
            className="absolute top-1/2 right-4 -translate-y-1/2"
          >
            <ListFilter size={20} color="#868C98" />
          </button>
        )}
      </div>

      {/* Filter Overlay */}
      {showFilter && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setShowFilter(false)}
          />

          {/* Filter Panel */}
          <div className="animate-in slide-in-from-right fixed top-0 right-0 z-50 h-full w-full max-w-[400px] bg-white shadow-xl">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b p-5">
                <h2 className="text-xl font-semibold">Filters</h2>
                <button onClick={() => setShowFilter(false)}>
                  <X size={24} />
                </button>
              </div>

              {/* Filter Content */}
              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                {/* Facility Type */}
                <div className="border-b pb-4">
                  <button
                    onClick={() =>
                      setExpandedSection(
                        expandedSection === "type" ? null : "type",
                      )
                    }
                    className="mb-3 flex w-full items-center justify-between"
                  >
                    <h3 className="text-sm font-medium">Facility Type</h3>
                    <ChevronDown
                      size={20}
                      className={`transition-transform ${expandedSection === "type" ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expandedSection === "type" && (
                    <div className="flex flex-wrap gap-2">
                      {facilityTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() =>
                            toggleSelection(
                              type,
                              selectedTypes,
                              setSelectedTypes,
                            )
                          }
                          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs ${
                            selectedTypes.includes(type)
                              ? "border-[#51A199] bg-[#51A199] text-white"
                              : "border-gray-300 bg-white text-gray-700"
                          }`}
                        >
                          <span className="text-lg">🏥</span>
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Performance Tier */}
                <div className="border-b pb-4">
                  <button
                    onClick={() =>
                      setExpandedSection(
                        expandedSection === "tier" ? null : "tier",
                      )
                    }
                    className="mb-3 flex w-full items-center justify-between"
                  >
                    <h3 className="text-sm font-medium">Performance Tier</h3>
                    <ChevronDown
                      size={20}
                      className={`transition-transform ${expandedSection === "tier" ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expandedSection === "tier" && (
                    <div className="flex flex-wrap gap-2">
                      {performanceTiers.map((tier) => (
                        <button
                          key={tier}
                          onClick={() =>
                            toggleSelection(tier, selectedTier, setSelectedTier)
                          }
                          className={`rounded-full border px-4 py-2 text-xs ${
                            selectedTier.includes(tier)
                              ? "border-[#51A199] bg-[#51A199] text-white"
                              : "border-gray-300 bg-white text-gray-700"
                          }`}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Service Availability */}
                <div className="pb-4">
                  <button
                    onClick={() =>
                      setExpandedSection(
                        expandedSection === "services" ? null : "services",
                      )
                    }
                    className="mb-3 flex w-full items-center justify-between"
                  >
                    <h3 className="text-sm font-medium">
                      Service Availability
                    </h3>
                    <ChevronDown
                      size={20}
                      className={`transition-transform ${expandedSection === "services" ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expandedSection === "services" && (
                    <div className="flex flex-wrap gap-2">
                      {services.map((service) => (
                        <button
                          key={service}
                          onClick={() =>
                            toggleSelection(
                              service,
                              selectedServices,
                              setSelectedServices,
                            )
                          }
                          className={`rounded-full border px-4 py-2 text-xs ${
                            selectedServices.includes(service)
                              ? "border-[#51A199] bg-[#51A199] text-white"
                              : "border-gray-300 bg-white text-gray-700"
                          }`}
                        >
                          {service}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t p-5">
                <button
                  onClick={handleClearAll}
                  className="text-sm font-medium underline"
                >
                  Clear all
                </button>
                <Button
                  onClick={handleApply}
                  className="rounded-full bg-[#51A199] px-8 hover:bg-[#51A199]/90"
                >
                  Apply filters
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default SearchBar;
