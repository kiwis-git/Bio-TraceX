"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockSamples, mockAlerts, mockEvents } from "@/lib/mock-data";
import { AlertCircle, Activity, Thermometer, ShieldCheck, Database, Server, RefreshCw, Zap, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePocContext } from "@/lib/poc-context";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { activeStudyId } = usePocContext();
  const [showRemediation, setShowRemediation] = useState(false);

  const tenantSamples = mockSamples.filter(s => s.study_id === activeStudyId);
  const tenantAlerts = mockAlerts.filter(a => tenantSamples.some(s => s.id === a.sample_id));
  const tenantEvents = mockEvents.filter(e => tenantSamples.some(s => s.id === e.sample_id));

  const activeAlerts = tenantAlerts.filter(a => !a.resolved);
  const inTransitSamples = tenantSamples.filter(s => s.status === 'In-Transit').length;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
        <p className="text-muted-foreground mt-2">Real-time biological sample tracking and chain of custody monitoring.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Samples</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenantSamples.length}</div>
            <p className="text-xs text-muted-foreground">+2 since yesterday (Study {activeStudyId})</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{activeAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Action required immediately</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inTransitSamples}</div>
            <p className="text-xs text-muted-foreground">Temp monitored continuously</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Compliant Events</CardTitle>
            <ShieldCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">Based on recent 48 hours</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Integrations Panel */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2"><Database className="h-4 w-4" /> SAP S/4HANA & CDS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2"><Server className="h-4 w-4 text-blue-500"/> SAP QM Synced</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">Online</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2"><Server className="h-4 w-4 text-purple-500"/> Chromeleon CDS</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">Online</Badge>
            </div>
            <Button variant="ghost" size="sm" className="w-full text-xs mt-2"><RefreshCw className="h-3 w-3 mr-2"/> Force Sync</Button>
          </CardContent>
        </Card>

        {/* AI Freezer Health Agent */}
        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-900/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Cpu className="w-24 h-24" />
          </div>
          <CardHeader className="pb-3 z-10 relative">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-amber-800 dark:text-amber-500"><Zap className="h-4 w-4" /> AI Freezer Health Score: 85%</CardTitle>
          </CardHeader>
          <CardContent className="z-10 relative">
            <p className="text-xs text-amber-700 dark:text-amber-400 mb-3">Anomaly detected in Unit B (31.6°C spike predicted).</p>
            {!showRemediation ? (
              <Button size="sm" variant="destructive" onClick={() => setShowRemediation(true)} className="w-full text-xs bg-amber-600 hover:bg-amber-700">
                Deploy Remediation Agent
              </Button>
            ) : (
              <div className="bg-white dark:bg-card p-3 rounded text-xs border shadow-sm">
                <span className="font-bold text-amber-600 flex items-center gap-1 mb-2"><Zap className="h-3 w-3"/> Agent Deployed</span>
                <ul className="space-y-1 list-disc pl-4 text-muted-foreground">
                  <li>Time-outside-range impact: 14 mins</li>
                  <li>Target: Move to Freezer Rack 4A</li>
                  <li>Checklist artifact generated for TECH-132</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Recent Activity / Alert Feed */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Actionable Alerts</CardTitle>
            <CardDescription>System flagged anomalies requiring secondary review.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tenantAlerts.slice(0, 5).map(alert => (
                <div key={alert.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${alert.severity === 'High' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{alert.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{alert.sample_id}</Badge>
                        <span className="text-xs text-muted-foreground">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={alert.resolved ? 'secondary' : 'destructive'}>
                    {alert.resolved ? 'Resolved' : 'Active'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Tracking Mini-feed */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Handlers</CardTitle>
            <CardDescription>Live chain of custody events.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {tenantEvents.slice(0, 4).map(event => (
                <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-primary bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 shadow" />
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] bg-white dark:bg-card p-3 rounded-lg shadow-sm border ml-6 md:ml-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{event.type}</span>
                      <span className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Sample: {event.sample_id}</p>
                    <p className="text-xs text-muted-foreground">Handler: {event.handler}</p>
                    {event.signature && (
                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-green-700 dark:text-green-500 flex flex-col gap-0.5">
                        <div className="flex justify-between items-center">
                          <span>Signed by: <span className="font-semibold">{event.signature.printed_name}</span></span>
                          <Badge variant="outline" className="text-[9px] h-4 px-1 py-0 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-500">{event.signature.meaning}</Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
