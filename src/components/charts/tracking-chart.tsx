"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

// Data representing real-time movement for key statuses over a 24hr simulated period
const data = [
  // Historical
  { time: '06:00', collected: 15, transit: 5, analysis: 2, disposed: 0, ruined: 0 },
  { time: '08:00', collected: 45, transit: 15, analysis: 8, disposed: 2, ruined: 0 },
  { time: '10:00', collected: 52, transit: 30, analysis: 15, disposed: 5, ruined: 1 },
  { time: '12:00', collected: 78, transit: 42, analysis: 28, disposed: 12, ruined: 2 },
  { time: '14:00', collected: 90, transit: 55, analysis: 40, disposed: 20, ruined: 2 },
  { time: '16:00', collected: 105, transit: 61, analysis: 58, disposed: 35, ruined: 4 },
  
  // Current Point (Connects solid and dashed lines)
  { time: '18:00', collected: 120, transit: 45, analysis: 75, disposed: 48, ruined: 5,
    collected_proj: 120, transit_proj: 45, analysis_proj: 75, disposed_proj: 48, ruined_proj: 5 },
  
  // Projections
  { time: '20:00', collected_proj: 135, transit_proj: 50, analysis_proj: 80, disposed_proj: 55, ruined_proj: 8 },
  { time: '22:00', collected_proj: 150, transit_proj: 65, analysis_proj: 85, disposed_proj: 60, ruined_proj: 11 },
  { time: '00:00', collected_proj: 160, transit_proj: 40, analysis_proj: 90, disposed_proj: 65, ruined_proj: 12 },
];

export function TrackingChart() {
  const handleChartClick = (e: any) => {
    if (e && e.activePayload) {
      const time = e.activeLabel;
      const isProjected = e.activePayload.some((p: any) => p.dataKey.includes('_proj') && p.value > 0);
      
      if (isProjected) {
        alert(`[Anomaly Investigation Artifact]\n\nTime: ${time}\nForecasted Ruined: ${e.activePayload.find((p:any)=>p.dataKey==='ruined_proj')?.value}\nThreshold Exceeded! Drill-down unavailable for future state.`);
      } else {
        alert(`Drilling down into ${time} samples...\n(Simulated Modal)`);
      }
    }
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Continuous Tracking & Predictive Forecaster</CardTitle>
        <CardDescription>Visualizing global volume and 12-hour projected trends (dotted) with threshold anomaly alerts.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 10, bottom: 5 }} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted opacity-50" />
              <XAxis dataKey="time" className="text-xs fill-muted-foreground" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis className="text-xs fill-muted-foreground" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'var(--background)' }}
                itemStyle={{ color: 'var(--foreground)' }}
              />
              <Legend verticalAlign="top" height={36} />
              
              {/* Threshold Lines */}
              <ReferenceLine y={10} label="Critical Ruined Threshold" stroke="red" strokeDasharray="3 3" />
              <ReferenceLine y={60} label="Max Transit Capacity" stroke="orange" strokeDasharray="3 3" />

              {/* Historical Lines */}
              <Line type="monotone" dataKey="collected" name="Collected" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="analysis" name="In Analysis" stroke="#eab308" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="ruined" name="Ruined" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="disposed" name="Disposed" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="transit" name="In-Transit" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />

              {/* Projected Lines */}
              <Line type="monotone" dataKey="collected_proj" name="Proj. Collected" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              <Line type="monotone" dataKey="analysis_proj" name="Proj. Analysis" stroke="#eab308" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              <Line type="monotone" dataKey="ruined_proj" name="Proj. Ruined" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              <Line type="monotone" dataKey="transit_proj" name="Proj. In-Transit" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
