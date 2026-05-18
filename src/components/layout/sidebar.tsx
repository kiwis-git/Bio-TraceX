"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FlaskConical, AlertTriangle, Settings, LogOut, PackageSearch, BarChart3 } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    // Exact match for dashboard, partial match for others (e.g., /samples/123 counts as active)
    const isActive = path === '/' ? pathname === '/' : pathname.startsWith(path);
    return `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
      isActive 
        ? 'bg-primary/10 text-primary font-medium' 
        : 'text-muted-foreground hover:bg-muted font-medium'
    }`;
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background px-4 py-8">
      <div className="flex items-center gap-2 px-2 mb-10">
        <div className="bg-primary/10 p-2 rounded-lg">
          <FlaskConical className="h-6 w-6 text-primary" />
        </div>
        <span className="text-xl font-bold tracking-tight">BioTraceX</span>
      </div>

      <nav className="flex-1 space-y-2">
        <Link href="/" className={getLinkClass('/')}>
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
        <Link href="/samples" className={getLinkClass('/samples')}>
          <PackageSearch className="h-5 w-5" />
          <span>Sample Tracking</span>
        </Link>
        <Link href="/alerts" className={getLinkClass('/alerts')}>
          <AlertTriangle className="h-5 w-5" />
          <span>Alerts</span>
        </Link>
        <Link href="/analytics" className={getLinkClass('/analytics')}>
          <BarChart3 className="h-5 w-5" />
          <span>Analytics</span>
        </Link>
      </nav>

      <div className="mt-auto pt-8 border-t">
        <nav className="space-y-2">
          <Link href="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted transition-all">
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </Link>
          <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
