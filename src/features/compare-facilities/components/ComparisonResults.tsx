"use client";

import { Facility } from "@/types/api-response";
import {
  useFacilityComparison,
  ComparisonData,
} from "../hooks/useFacilityComparison";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Replace } from "lucide-react";
import { DirectionsRoute } from "@/services/mapbox.service";
import { useState } from "react";
import { CircularProgress } from "@/components/ui/circular-progress";
import { ReasonsList } from "./ReasonsList";
import { ServicesList } from "./ServicesList";
import { ComparisonRow } from "./ComparisonRow";
import { getInitials } from "@/lib/utils"; // Imported

interface ComparisonResultsProps {
  facilityA: Facility;
  facilityB: Facility;
  removeFacility: (index: number) => void;
  directionsA: DirectionsRoute | null | undefined;
  directionsB: DirectionsRoute | null | undefined;
  isLoadingDirections: boolean;
  locationError: boolean;
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
  const [activeTab, setActiveTab] = useState("overview");

  const comparisonData: ComparisonData | null = useFacilityComparison(
    facilityA,
    facilityB,
    directionsA,
    directionsB,
  );

  if (!comparisonData) {
    return <div>Loading comparison...</div>;
  }

  const { reasonsA, reasonsB, detailedResults, scoreA, scoreB } =
    comparisonData;

  return (
    <div className="mt-6">
      <h2 className="text-center text-lg font-bold text-[#36454F]">
        {facilityA.facility_name} vs {facilityB.facility_name}
      </h2>

      <div className="mt-4 text-center">
        <h3 className="text-md font-semibold text-[#36454F]">
          Overall Comparison Score
        </h3>
        <p className="text-sm text-slate-500">
          A higher score suggests a better overall choice based on our metrics.
        </p>
        <div className="mt-4 flex justify-around">
          <div className="flex flex-col items-center">
            <CircularProgress score={scoreA} color="#51a199" />
            <p className="mt-2 font-semibold text-primary">
              {facilityA.facility_name}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <CircularProgress score={scoreB} color="#36454F" />
            <p className="mt-2 font-semibold text-[#36454F]">
              {facilityB.facility_name}
            </p>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="mt-8 w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="facilityA" className="truncate">
            {getInitials(facilityA.facility_name)}
          </TabsTrigger>
          <TabsTrigger value="facilityB" className="truncate">
            {getInitials(facilityB.facility_name)}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-2 gap-4">
            <Card
              className="cursor-pointer border-t-4 border-primary bg-[#F5F5DC]"
              onClick={() => setActiveTab("facilityA")}
            >
              <CardHeader className="relative">
                <CardTitle className="pr-8 text-base text-primary">
                  {facilityA.facility_name}
                </CardTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1 h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFacility(0);
                  }}
                >
                  <Replace className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <ReasonsList reasons={reasonsA} />
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer border-t-4 border-slate-300 bg-[#F8F8F8]"
              onClick={() => setActiveTab("facilityB")}
            >
              <CardHeader className="relative">
                <CardTitle className="pr-8 text-base text-[#36454F]">
                  {facilityB.facility_name}
                </CardTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1 h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFacility(1);
                  }}
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
          <Card className="bg-[#F5F5DC]">
            <CardContent className="pt-6">
              <ReasonsList reasons={reasonsA} />
              <ServicesList services={facilityA.services_list ?? []} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="facilityB">
          <Card className="bg-[#F8F8F8]">
            <CardContent className="pt-6">
              <ReasonsList reasons={reasonsB} />
              <ServicesList services={facilityB.services_list ?? []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-bold text-[#36454F]">
          Detailed Comparison
        </h3>
        <Card className="bg-[#F8F8F8]">
          <CardContent className="divide-y divide-slate-200 p-0">
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
