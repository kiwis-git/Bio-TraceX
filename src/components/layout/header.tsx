"use client";

import { Bell, Search, WifiOff, Wifi, GraduationCap, LockKeyhole, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { usePocContext } from '@/lib/poc-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { MOCK_TENANTS } from '@/lib/mock-data';

export function Header() {
  const { 
    activeTenant, 
    setActiveTenant, 
    activeStudyId, 
    setActiveStudyId,
    isOffline,
    setIsOffline,
    isTrainingExpired,
    setIsTrainingExpired,
    logout
  } = usePocContext();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex w-full items-center space-x-4">
        
        {/* Tenant Context Selector */}
        <div className="flex items-center space-x-2 border-r pr-4">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Tenant:</span>
          <Select 
            value={activeTenant.sponsor_id} 
            onValueChange={(val) => {
              const t = MOCK_TENANTS.find(x => x.sponsor_id === val);
              if (t) setActiveTenant(t);
            }}
          >
            <SelectTrigger className="w-[180px] h-8 text-xs">
              <SelectValue placeholder="Select Sponsor" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_TENANTS.map(t => (
                <SelectItem key={t.sponsor_id} value={t.sponsor_id} className="text-xs">
                  {t.sponsor_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Study Context Selector */}
        <div className="flex items-center space-x-2 border-r pr-4">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Study:</span>
          <Select 
            value={activeStudyId} 
            onValueChange={(val) => {
              if (val) setActiveStudyId(val);
            }}
          >
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue placeholder="Select Study" />
            </SelectTrigger>
            <SelectContent>
              {activeTenant.studies.map(s => (
                <SelectItem key={s} value={s} className="text-xs">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Offline Toggle */}
        <Button 
          variant={isOffline ? "destructive" : "outline"} 
          size="sm" 
          className="h-8 text-xs gap-2"
          onClick={() => setIsOffline(!isOffline)}
        >
          {isOffline ? <WifiOff className="h-3 w-3" /> : <Wifi className="h-3 w-3 text-green-500" />}
          {isOffline ? "Offline (Syncing Outbox...)" : "Online"}
        </Button>

      </div>
      
      <div className="flex items-center gap-4">
        
        {/* Training Lock Toggle */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-xs gap-2"
          onClick={() => setIsTrainingExpired(!isTrainingExpired)}
        >
          <GraduationCap className={`h-4 w-4 ${isTrainingExpired ? 'text-red-500' : 'text-green-500'}`} />
          {isTrainingExpired ? "Training Expired" : "Training Current"}
        </Button>

        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            1
          </span>
        </Button>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@labmanager" />
          <AvatarFallback>LM</AvatarFallback>
        </Avatar>
        <Button variant="ghost" size="icon" onClick={logout} title="Secure Logout">
          <LogOut className="h-4 w-4 text-slate-500" />
        </Button>
      </div>
    </header>
  );
}
