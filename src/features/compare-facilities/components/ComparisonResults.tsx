"use client";

import { Facility } from "@/types/api-response";
import {
  useFacilityComparison,
  ComparisonResult,
} from "../hooks/useFacilityComparison";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Minus, Replace, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DirectionsRoute } from "@/services/mapbox.service";
import { Spinner } from "@/components/ui/spinner";

interface ComparisonResultsProps {
  facilityA: Facility;
  facilityB: Facility;
  removeFacility: (index: number) => void;
  directionsA: DirectionsRoute | null | undefined;
  directionsB: DirectionsRoute | null | undefined;
  isLoadingDirections: boolean;
  locationError: boolean;
}

function ReasonsList({ reasons }: { reasons: string[] }) {
  if (reasons.length === 0) {
    return <p className="text-sm text-gray-500">No specific advantages.</p>;
  }
  return (
    <ul className="space-y-2">
      {reasons.map((reason) => (
        <li key={reason} className="flex items-start">
          <CheckCircle className="mr-2 mt-1 h-4 w-4 flex-shrink-0 text-green-500" />
          <span>{reason}</span>
        </li>
      ))}
    </ul>
  );
}

function ServicesList({ services }: { services: string[] }) {
  if (services.length === 0) {
    return <p className="text-sm text-gray-500">No services listed.</p>;
  }
  return (
    <div className="mt-4">
      <h4 className="mb-2 font-semibold">Services Offered</h4>
      <div className="flex flex-wrap gap-2">
        {services.map((service) => (
          <Badge key={service} variant="secondary">
            {service}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function ComparisonRow({
  result,
  isLoading,
  error,
}: {
  result: ComparisonResult;
  isLoading: boolean;
  error: boolean;
}) {
  const { key, label, valueA, valueB, winner } = result;

  const displayValue = (value: any) => {
    if (Array.isArray(value)) {
      return `${value.length} items`;
    }
    return value;
  };

  const isLocationDependent = key === "travel_time" || key === "distance";

  if (isLocationDependent) {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center gap-1 py-3 text-center text-xs text-gray-500">
          <HelpCircle className="h-4 w-4" />
          Enable location for insights
        </div>
      );
    }
    if (isLoading) {
      return (
        <div className="flex justify-center py-3">
          <Spinner />
        </div>
      );
    }
  }

  return (
    <div className="flex items-center justify-between py-3">
      <div className={cn("w-1/3 text-left font-semibold", winner === "A" && "text-green-600")}>
        {displayValue(valueA)}
      </div>
      <div className="w-1/3 text-center text-sm text-gray-500">{label}</div>
      <div className={cn("w-1/3 text-right font-semibold", winner === "B" && "text-green-600")}>
        {displayValue(valueB)}
      </div>
    </div>
  );
}

export function ComparisonResults({
  facilityA,
  facilityB,
  removeFacility,
  directionsA,
  directionsB,
  isLoadingDirections,
  locationError,
}: ComparisonResultsProps) {
  const comparisonData = useFacilityComparison(
    facilityA,
    facilityB,
    directionsA,
    directionsB
  );

  if (!comparisonData) {
    return <div>Loading comparison...</div>; // Should not be visible for long
  }

  const { reasonsA, reasonsB, detailedResults } = comparisonData;

  return (
    <div className="mt-6">
      <h2 className="text-center text-lg font-bold">
        {facilityA.facility_name} vs {facilityB.facility_name}
      </h2>

      <Tabs defaultValue="overview" className="mt-4 w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="facilityA" className="truncate">
            {facilityA.facility_name}
          </TabsTrigger>
          <TabsTrigger value="facilityB" className="truncate">
            {facilityB.facility_name}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-t-4 border-[#51a199]">
              <CardHeader className="relative">
                <CardTitle className="pr-8 text-base text-[#51a199]">
                  {facilityA.facility_name}
                </CardTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1 h-7 w-7"
                  onClick={() => removeFacility(0)}
                >
                  <Replace className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <ReasonsList reasons={reasonsA} />
              </CardContent>
            </Card>
            <Card className="border-t-4 border-gray-300">
              <CardHeader className="relative">
                <CardTitle className="pr-8 text-base">
                  {facilityB.facility_name}
                </CardTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1 h-7 w-7"
                  onClick={() => removeFacility(1)}
                >
                  <Replace className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <ReasonsList reasons={reasonsB} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="facilityA">
          <Card>
            <CardContent className="pt-6">
              <ReasonsList reasons={reasonsA} />
              <ServicesList services={facilityA.services_list ?? []} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="facilityB">
          <Card>
            <CardContent className="pt-6">
              <ReasonsList reasons={reasonsB} />
              <ServicesList services={facilityB.services_list ?? []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-bold">Detailed Comparison</h3>
        <Card>
          <CardContent className="divide-y divide-gray-200 p-0">
            {detailedResults.map((result) => (
              <div key={result.key} className="px-6">
                <ComparisonRow
                  result={result}
                  isLoading={isLoadingDirections}
                  error={locationError}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
