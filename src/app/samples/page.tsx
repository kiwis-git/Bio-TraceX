"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockSamples, Sample } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Eye, Search, FilterX, Plus, Camera } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { registerSampleAction } from "@/app/actions";
import { usePocContext } from "@/lib/poc-context";

export default function SamplesList() {
  const { activeStudyId, isTrainingExpired, activeTenant } = usePocContext();
  const [localSamples, setLocalSamples] = useState<Sample[]>(mockSamples);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  
  // Registration Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "Blood Serum",
    location: "Receiving Bay 1",
    temperature: 4.0,
    collectorId: "TECH-001",
    abhaId: "",
    consent: false
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newSample = await registerSampleAction({
        ...formData,
        sponsor_id: activeTenant.sponsor_id,
        study_id: activeStudyId,
      });
      setLocalSamples(prev => [newSample, ...prev]);
      setIsDialogOpen(false);
      setFormData({ type: "Blood Serum", location: "Receiving Bay 1", temperature: 4.0, collectorId: "TECH-001", abhaId: "", consent: false });
    } catch (error) {
      console.error("Registration failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSamples = useMemo(() => localSamples.filter((sample) => {
    if (sample.study_id !== activeStudyId) return false;

    // 1. Text Search Filter (UID, Location)
    let matchesSearch = true;
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      matchesSearch = 
        sample.id.toLowerCase().includes(lowerQuery) ||
        sample.location.toLowerCase().includes(lowerQuery);
    }
    
    // 2. Dropdown Filters
    const matchesStatus = statusFilter === "all" || sample.status === statusFilter;
    const matchesType = typeFilter === "all" || sample.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  }), [searchQuery, statusFilter, typeFilter, localSamples, activeStudyId]);

  const uniqueTypes = useMemo(() => Array.from(new Set(mockSamples.map(s => s.type))), []);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sample Repository</h1>
          <p className="text-muted-foreground mt-2">View and manage the comprehensive biological sample database.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled={isTrainingExpired}>Register New Sample (OCR Mock)</Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger render={<Button disabled={isTrainingExpired} className={isTrainingExpired ? "opacity-50 cursor-not-allowed" : ""} />}>
              <Plus className="mr-2 h-4 w-4" />
              {isTrainingExpired ? "Training Expired - Locked" : "Manual Entry"}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Register Biological Sample</DialogTitle>
                <DialogDescription>
                  Enter the required metadata for the new sample. A new unique ID and tracking timeline will be generated.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col sm:flex-row items-center gap-2 py-2">
                <Button 
                  type="button" 
                  variant="secondary" 
                  className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-foreground"
                  onClick={() => alert("Initializing device camera... (POC feature)")}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Scan with Camera
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={() => alert("Simulating SAP S/4HANA connection to pull Inspection Lot data...")}
                >
                  Import from SAP
                </Button>
              </div>
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or enter manually</span>
                </div>
              </div>
              <form onSubmit={handleRegister}>
                <div className="flex flex-col gap-4 py-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v || formData.type})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      value={formData.location} 
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="temperature">Temp (°C)</Label>
                    <Input 
                      id="temperature" 
                      type="number"
                      step="0.1"
                      value={formData.temperature} 
                      onChange={(e) => setFormData({...formData, temperature: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="collector">Collector</Label>
                    <Input 
                      id="collector" 
                      value={formData.collectorId} 
                      onChange={(e) => setFormData({...formData, collectorId: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="abha" className="text-xs leading-tight">Patient ABHA ID</Label>
                    <Input 
                      id="abha" 
                      placeholder="XX-XXXX-XXXX-XXXX"
                      value={formData.abhaId} 
                      onChange={(e) => setFormData({...formData, abhaId: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mt-2 p-3 bg-muted/50 rounded-md border text-xs">
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="consent" 
                        checked={formData.consent} 
                        onCheckedChange={(c) => setFormData({...formData, consent: c as boolean})} 
                        required 
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label htmlFor="consent" className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          DPDPA 2023 Consent Declaration
                        </label>
                        <p className="text-muted-foreground text-[11px]">
                          I consent to the collection and processing of my ABHA identifier and biometric data solely for the purpose of biological sample tracking. I understand I have the Right to Erasure as per the <a href="#" className="underline text-primary">Privacy Notice</a>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting || !formData.consent}>
                    {isSubmitting ? "Registering..." : "Create Registry Entry"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Samples</CardTitle>
              <CardDescription>Live data reflecting current global inventory.</CardDescription>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search UID or location..."
                  className="pl-8 w-full sm:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v || "all")}>
                <SelectTrigger className="w-[140px] flex-1 sm:flex-none">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Collected">Collected</SelectItem>
                  <SelectItem value="In-Transit">In-Transit</SelectItem>
                  <SelectItem value="Storage">Storage</SelectItem>
                  <SelectItem value="Analysis">Analysis</SelectItem>
                  <SelectItem value="Ruined">Ruined</SelectItem>
                  <SelectItem value="Disposed">Disposed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v || "all")}>
                <SelectTrigger className="w-[140px] flex-1 sm:flex-none">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(searchQuery || statusFilter !== 'all' || typeFilter !== 'all') && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setTypeFilter("all");
                  }}
                  title="Clear Filters"
                  className="shrink-0"
                >
                  <FilterX className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sample UID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Location</TableHead>
                <TableHead>Temp</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSamples.length > 0 ? (
                filteredSamples.map((sample) => (
                  <TableRow key={sample.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      {sample.id}
                      <Copy className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-foreground" />
                    </TableCell>
                    <TableCell>{sample.type}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(sample.status)}>
                        {sample.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{sample.location}</TableCell>
                    <TableCell>
                      <span className={sample.temperature > 0 ? "text-amber-600 font-medium" : "text-blue-600 font-medium"}>
                        {sample.temperature}°C
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/samples/${sample.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    No samples found matching "{searchQuery}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
