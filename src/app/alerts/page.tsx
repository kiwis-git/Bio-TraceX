"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockAlerts, Alert } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Clock, FilterX, Search, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

export default function AlertsDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Local state for interactive resolution tracking (demo purposes)
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));

  const toggleResolve = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, resolved: !alert.resolved } : alert
    ));
  };

  const filteredAlerts = useMemo(() => alerts.filter((alert) => {
    let matchesSearch = true;
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      matchesSearch = 
        alert.sample_id.toLowerCase().includes(lowerQuery) ||
        alert.message.toLowerCase().includes(lowerQuery) ||
        alert.id.toLowerCase().includes(lowerQuery);
    }
    
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "resolved" ? alert.resolved : !alert.resolved);

    return matchesSearch && matchesSeverity && matchesStatus;
  }), [alerts, searchQuery, severityFilter, statusFilter]);

  const activeCount = alerts.filter(a => !a.resolved).length;
  const highSeverityCount = alerts.filter(a => a.severity === 'High' && !a.resolved).length;
  const mediumSeverityCount = alerts.filter(a => a.severity === 'Medium' && !a.resolved).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security & Compliance Alerts</h1>
        <p className="text-muted-foreground mt-1">Monitor real-time infrastructure, temperature, and security deviations.</p>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800 dark:text-red-300">Active High Priority</CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">{highSeverityCount}</div>
            <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>
        
        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-300">Active Warnings</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">{mediumSeverityCount}</div>
            <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">Review operational limits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Unresolved</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending systemic review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Clock className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.98%</div>
            <p className="text-xs text-emerald-600 mt-1">IoT sensor grid active</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Alert Feed</CardTitle>
              <CardDescription>Comprehensive log of all systemic deviations.</CardDescription>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-0">
              <div className="relative w-full max-w-sm sm:w-[250px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="ID, Sample, or Message..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v || "all")}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v || "all")}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>

              {(searchQuery || severityFilter !== 'all' || statusFilter !== 'all') && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    setSearchQuery("");
                    setSeverityFilter("all");
                    setStatusFilter("all");
                  }}
                  title="Clear Filters"
                >
                  <FilterX className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Alert ID</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Sample UID</TableHead>
                  <TableHead>Detailed Message</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No alerts match your filters.
                     </TableCell>
                  </TableRow>
                ) : (
                  filteredAlerts.map((alert) => (
                    <TableRow key={alert.id} className={!alert.resolved && alert.severity === 'High' ? 'bg-red-50/20 dark:bg-red-950/10' : ''}>
                      <TableCell className="font-medium text-xs font-mono">{alert.id}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={alert.severity === 'High' ? 'destructive' : 'secondary'}
                          className={alert.severity === 'Medium' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300' : ''}
                        >
                          {alert.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/samples/${alert.sample_id}`} className="text-blue-600 hover:underline">
                          {alert.sample_id}
                        </Link>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="truncate" title={alert.message}>
                           {alert.message}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(alert.timestamp).toLocaleString(undefined, {
                          month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
                        })}
                      </TableCell>
                      <TableCell>
                        {alert.resolved ? (
                          <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Resolved
                          </div>
                        ) : (
                          <div className="flex items-center text-amber-600 dark:text-amber-400 text-xs font-medium">
                            <AlertCircle className="mr-1 h-3 w-3" /> Active
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant={alert.resolved ? "ghost" : "outline"}
                          size="sm"
                          onClick={() => toggleResolve(alert.id)}
                          className={!alert.resolved && alert.severity === 'High' ? 'border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-950/50' : ''}
                        >
                          {alert.resolved ? "Reopen" : "Acknowledge"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
