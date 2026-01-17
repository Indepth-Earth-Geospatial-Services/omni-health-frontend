import { TrendingUp } from "lucide-react";
import { InfoCard } from "../atoms/info-card";

interface StatsContentProps {
  avgDailyPatients: number | string;
  doctorPatientRatio: number | string;
  formattedRating: string;
  totalReviews: number;
  isLoading?: boolean;
}

export const StatsContent = ({
  avgDailyPatients,
  doctorPatientRatio,
  formattedRating,
  totalReviews,
  isLoading,
}: StatsContentProps) => (
  <div className="px-5 pb-24">
    <div className="space-y-6">
      <InfoCard
        title="Overall Performance"
        value={formattedRating}
        icon={<TrendingUp className="h-6 w-6 text-green-600" />}
        color="green"
        size="lg"
      />

      <div className="space-y-4">
        <div className="rounded-lg border bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium">Average Daily Patients</span>
            <span className="text-lg font-bold">
              {avgDailyPatients || "N/A"}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-500"
              style={{
                width: `${Math.min(((Number(avgDailyPatients) || 0) / 100) * 100, 100)}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium">Doctor to Patient Ratio</span>
            <span className="text-lg font-bold">
              {doctorPatientRatio ? `1:${doctorPatientRatio}` : "N/A"}
            </span>
          </div>
          <p className="text-sm text-gray-600">Lower is better</p>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium">Total Reviews</span>
            <span className="text-lg font-bold">{totalReviews || 0}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
