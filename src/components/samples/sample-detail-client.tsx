"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sample, Event, SampleStatus } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, SearchCheck, Thermometer, BoxIcon, Trash2, PenTool, Eraser, Fingerprint, ActivitySquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ElectronicSignatureDialog, SignatureResult } from "@/components/ui/electronic-signature-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SampleDetailClient({ initialSample, initialEvents }: { initialSample: Sample, initialEvents: Event[] }) {
  const [sample, setSample] = useState<Sample>(initialSample);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  
  const [newStatus, setNewStatus] = useState<SampleStatus | "">( "");

  const handleUpdateClick = () => {
    setIsUpdateModalOpen(true);
  };

  const handleStatusSubmit = () => {
    if (!newStatus) return;
    setIsUpdateModalOpen(false);
    setIsSignatureModalOpen(true);
  };

  const handleSignatureComplete = (result: SignatureResult) => {
    // 1. Create the new audit trail event
    const newEvent: Event = {
      id: `EVT-${Date.now()}`,
      sample_id: sample.id,
      type: `Status Update: ${newStatus}`,
      timestamp: new Date().toISOString(),
      handler: result.userId,
      location: sample.location, // Assuming location stays same for this POC
      validation_status: "Valid",
      reason: result.reason,
      signature: {
        printed_name: result.userId, // POC simplification
        meaning: result.meaning,
        timestamp: new Date().toISOString(),
      },
      changes: [{
        field: "status",
        old_value: sample.status,
        new_value: newStatus as string,
      }]
    };

    // 2. Update state
    setEvents([newEvent, ...events]);
    setSample({ ...sample, status: newStatus as SampleStatus });
  };

  const handleErasure = () => {
    if (confirm("Are you sure you want to trigger Right to Erasure? This will permanently anonymize PII for this sample.")) {
      setSample(prev => ({
        ...prev,
        abha_id: "[ANONYMIZED]",
        collector_id: "[ANONYMIZED]"
      }));
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Ruined': return 'bg-purple-500 hover:bg-purple-600 text-white border-transparent';
      case 'Collected': return 'bg-green-500 hover:bg-green-600 text-white border-transparent';
      case 'Analysis': return 'bg-yellow-500 hover:bg-yellow-600 text-white border-transparent';
      case 'Disposed': return 'bg-red-500 hover:bg-red-600 text-white border-transparent';
      case 'In-Transit': return 'bg-blue-500 hover:bg-blue-600 text-white border-transparent';
      default: return 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
    }
  };

  const getIcon = (type: string) => {
    if (type.includes('Collection')) return <BoxIcon className="w-4 h-4 text-primary" />;
    if (type.includes('Transit')) return <MapPin className="w-4 h-4 text-blue-500" />;
    if (type.includes('Temperature')) return <Thermometer className="w-4 h-4 text-amber-500" />;
    if (type.includes('Disposal')) return <Trash2 className="w-4 h-4 text-destructive" />;
    return <SearchCheck className="w-4 h-4 text-primary" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/samples">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chain of Custody: {sample.id}</h1>
            <p className="text-muted-foreground mt-1">Immutable timeline of events and handler signatures.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10" onClick={handleErasure}>
            <Eraser className="h-4 w-4" />
            Right to Erasure
          </Button>
          <Button onClick={handleUpdateClick} className="gap-2">
            <PenTool className="h-4 w-4" />
            Update Status
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 border-primary/20 bg-primary/5 h-fit">
          <CardHeader>
            <CardTitle>Sample Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Type</p>
              <p className="font-medium">{sample.type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Status</p>
              <Badge className={getStatusBadgeColor(sample.status)}>{sample.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Latest Location</p>
              <p className="font-medium flex items-center gap-2"><MapPin className="h-4 w-4"/> {sample.location}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Temp</p>
              <p className="font-medium flex items-center gap-2"><Thermometer className="h-4 w-4"/> {sample.temperature}°C</p>
            </div>
            {sample.abha_id && (
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-1">Patient ABHA ID</p>
                <p className={`font-medium flex items-center gap-2 ${sample.abha_id === '[ANONYMIZED]' ? 'text-destructive italic' : ''}`}>
                  <Fingerprint className="h-4 w-4"/> {sample.abha_id}
                </p>
              </div>
            )}
            {(sample.magnetic_field_gradient || sample.paramagnetic_fluid_density) ? (
              <div className="border-t pt-4 border-amber-200 dark:border-amber-900/50 mt-4 bg-amber-50 dark:bg-amber-950/20 -mx-6 px-6 pb-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-500 mb-3 flex items-center gap-2">
                  <ActivitySquare className="h-4 w-4" /> Antigravity Metrics
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1">Magnetic Gradient</p>
                    <p className="font-medium text-sm text-amber-700 dark:text-amber-400">{sample.magnetic_field_gradient} T/m</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1">Paramagnetic Density</p>
                    <p className="font-medium text-sm text-amber-700 dark:text-amber-400">{sample.paramagnetic_fluid_density} mg/mL</p>
                  </div>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Event Lineage</CardTitle>
            <CardDescription>All signed and recorded interactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {events.map((event) => (
                <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-slate-100 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 z-10">
                    {getIcon(event.type)}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white dark:bg-card p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 ml-14 md:ml-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">{event.type}</span>
                      <Badge variant={event.validation_status === 'Valid' ? 'outline' : 'destructive'} className="text-[10px]">
                        {event.validation_status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{new Date(event.timestamp).toLocaleString()}</p>
                    
                    {event.changes && event.changes.length > 0 && (
                      <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-md">
                        <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-1">State Changes:</p>
                        <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
                          {event.changes.map((c, i) => (
                            <li key={i}>
                              <span className="capitalize">{c.field}</span>: <span className="line-through opacity-70">{c.old_value}</span> &rarr; <strong>{c.new_value}</strong>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {event.reason && (
                      <div className={`p-3 rounded-md mb-2 text-sm border bg-red-50/50 dark:bg-red-950/20  ${
                        event.validation_status === 'Failed' 
                          ? 'border-red-200 text-red-800 dark:border-red-900/50 dark:text-red-300' 
                          : 'border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-300'
                      }`}>
                        <span className="font-semibold">{event.validation_status === 'Failed' ? 'Failure Reason: ' : 'Reason: '}</span>
                        {event.reason}
                      </div>
                    )}

                    <div className="mt-3 flex flex-col gap-1 text-xs bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-500">Handler:</span> {event.handler}
                      </div>
                      {event.signature && (
                        <div className="pt-1 mt-1 border-t border-slate-200 dark:border-slate-800 text-green-700 dark:text-green-500 flex flex-col gap-1">
                          <div className="flex justify-between items-center">
                            <span><span className="font-medium opacity-80 text-slate-500">Signed by:</span> {event.signature.printed_name}</span>
                            <Badge variant="outline" className="text-[9px] h-4 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-500">{event.signature.meaning}</Badge>
                          </div>
                          <span className="text-[10px] opacity-70 italic">{new Date(event.signature.timestamp).toLocaleString()} (Part 11 Compliant)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Sample Status</DialogTitle>
            <DialogDescription>
              Select the new status for {sample.id}. This action requires an electronic signature.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="status">New Status</Label>
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as SampleStatus)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Collected">Collected</SelectItem>
                  <SelectItem value="In-Transit">In-Transit</SelectItem>
                  <SelectItem value="Storage">Storage</SelectItem>
                  <SelectItem value="Analysis">Analysis</SelectItem>
                  <SelectItem value="Ruined">Ruined</SelectItem>
                  <SelectItem value="Disposed">Disposed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleStatusSubmit} disabled={!newStatus || newStatus === sample.status}>Proceed to Sign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ElectronicSignatureDialog
        open={isSignatureModalOpen}
        onOpenChange={setIsSignatureModalOpen}
        title={`Authorize status change to '${newStatus}'`}
        description={`You are electronically signing the state change for sample ${sample.id}. This action will be permanently recorded in the audit trail.`}
        defaultMeaning="Approval"
        onSign={handleSignatureComplete}
      />
    </div>
  );
}
