import { facilityService } from "@/services/facility.service";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export function useAllFacilities({
  selectedLga,
  selectedCategory,
}: {
  selectedLga?: string;
  selectedCategory?: string;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-facilities"],
    queryFn: () => facilityService.getAllFacilities({ limit: 400, page: 1 }),
  });

  const facilities = useMemo(() => data?.facilities || [], [data]);

  const { lgaCounts, totalLgaCount } = useMemo(() => {
    const facilitiesToCount = facilities.filter((facility) => {
      return (
        !selectedCategory ||
        selectedCategory === "all" ||
        facility.facility_category === selectedCategory
      );
    });

    const counts = facilitiesToCount.reduce(
      (acc, facility) => {
        const lga = facility.facility_lga || "Unknown LGA";
        acc[lga] = (acc[lga] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const total = facilitiesToCount.length;
    return {
      lgaCounts: Object.entries(counts).map(([name, count]) => ({
        name,
        count,
      })),
      totalLgaCount: total,
    };
  }, [facilities, selectedCategory]);

  const { categoryCounts, totalCategoryCount } = useMemo(() => {
    const facilitiesToCount = facilities.filter((facility) => {
      return (
        !selectedLga ||
        selectedLga === "all" ||
        facility.facility_lga === selectedLga
      );
    });

    const counts = facilitiesToCount.reduce(
      (acc, facility) => {
        const category = facility.facility_category || "Unknown Category";
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const total = facilitiesToCount.length;
    return {
      categoryCounts: Object.entries(counts).map(([name, count]) => ({
        name,
        count,
      })),
      totalCategoryCount: total,
    };
  }, [facilities, selectedLga]);

  const filteredFacilities = useMemo(() => {
    return facilities.filter((facility) => {
      const lgaMatch =
        !selectedLga ||
        selectedLga === "all" ||
        facility.facility_lga === selectedLga;
      const categoryMatch =
        !selectedCategory ||
        selectedCategory === "all" ||
        facility.facility_category === selectedCategory;
      return lgaMatch && categoryMatch;
    });
  }, [facilities, selectedLga, selectedCategory]);

  return {
    facilities: filteredFacilities,
    isLoading,
    isError,
    lgaCounts,
    totalLgaCount,
    categoryCounts,
    totalCategoryCount,
  };
}
