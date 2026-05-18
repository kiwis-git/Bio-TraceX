import { TrackingChart } from "@/components/charts/tracking-chart";

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Analytics & Movement Tracking</h1>
        <p className="text-muted-foreground mt-2">Comprehensive data visualizations for sample statuses globally.</p>
      </div>

      <div className="grid gap-6">
        <TrackingChart />
      </div>
    </div>
  );
}
