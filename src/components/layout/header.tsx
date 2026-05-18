"use client";

import { Bell, WifiOff, Wifi, GraduationCap, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { usePocContext } from '@/lib/poc-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    <header className="flex flex-col xl:flex-row min-h-16 items-start xl:items-center justify-between border-b bg-background pl-14 pr-4 py-3 xl:px-6 xl:py-0 gap-3 xl:gap-0 w-full">
      <div className="flex w-full xl:w-auto items-center gap-2 xl:gap-4 overflow-x-auto pb-1 xl:pb-0 scrollbar-hide shrink-0">
        
        {/* Tenant Context Selector */}
        <div className="flex items-center space-x-1 xl:space-x-2 xl:border-r pr-2 xl:pr-4 shrink-0">
          <span className="text-xs font-semibold text-muted-foreground uppercase hidden sm:inline">Tenant:</span>
          <Select 
            value={activeTenant.sponsor_id} 
            onValueChange={(val) => {
              const t = MOCK_TENANTS.find(x => x.sponsor_id === val);
              if (t) setActiveTenant(t);
            }}
          >
            <SelectTrigger className="w-[140px] xl:w-[180px] h-8 text-xs">
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
        <div className="flex items-center space-x-1 xl:space-x-2 xl:border-r pr-2 xl:pr-4 shrink-0">
          <span className="text-xs font-semibold text-muted-foreground uppercase hidden sm:inline">Study:</span>
          <Select 
            value={activeStudyId} 
            onValueChange={(val) => {
              if (val) setActiveStudyId(val);
            }}
          >
            <SelectTrigger className="w-[110px] xl:w-[120px] h-8 text-xs">
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
          className="h-8 text-xs gap-1.5 shrink-0"
          onClick={() => setIsOffline(!isOffline)}
        >
          {isOffline ? <WifiOff className="h-3 w-3" /> : <Wifi className="h-3 w-3 text-green-500" />}
          <span className="hidden sm:inline">{isOffline ? "Offline (Syncing...)" : "Online"}</span>
          <span className="inline sm:hidden">{isOffline ? "Offline" : "Online"}</span>
        </Button>

      </div>
      
      <div className="flex w-full xl:w-auto items-center justify-between xl:justify-end gap-2 xl:gap-4 shrink-0">
        
        {/* Training Lock Toggle */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-xs gap-1.5 shrink-0 px-2"
          onClick={() => setIsTrainingExpired(!isTrainingExpired)}
        >
          <GraduationCap className={`h-4 w-4 ${isTrainingExpired ? 'text-red-500' : 'text-green-500'}`} />
          <span className="hidden sm:inline">{isTrainingExpired ? "Training Expired" : "Training Current"}</span>
          <span className="inline sm:hidden">{isTrainingExpired ? "Expired" : "Current"}</span>
        </Button>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="icon" className="relative h-8 w-8 xl:h-9 xl:w-9">
            <Bell className="h-4 w-4 xl:h-5 xl:w-5 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 xl:h-4 xl:w-4 items-center justify-center rounded-full bg-red-500 text-[9px] xl:text-[10px] font-bold text-white">
              1
            </span>
          </Button>
          <Avatar className="h-8 w-8 xl:h-10 xl:w-10">
            <AvatarImage src="https://github.com/shadcn.png" alt="@labmanager" />
            <AvatarFallback>LM</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" onClick={logout} title="Secure Logout" className="h-8 w-8 xl:h-9 xl:w-9">
            <LogOut className="h-4 w-4 text-slate-500" />
          </Button>
        </div>
      </div>
    </header>
  );
}
