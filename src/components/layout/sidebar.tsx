"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FlaskConical, AlertTriangle, Settings, LogOut, PackageSearch, BarChart3, X, Menu } from 'lucide-react';
import { useState } from 'react';

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const getLinkClass = (path: string) => {
    const isActive = path === '/' ? pathname === '/' : pathname.startsWith(path);
    return `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive
        ? 'bg-primary/10 text-primary font-medium'
        : 'text-muted-foreground hover:bg-muted font-medium'
      }`;
  };

  const NavContent = () => (
    <>
      <div className="flex items-center gap-2 px-2 mb-10">
        <div className="bg-primary/10 p-2 rounded-lg">
          <FlaskConical className="h-6 w-6 text-primary" />
        </div>
        <span className="text-xl font-bold tracking-tight">BioTraceX</span>
      </div>

      <nav className="flex-1 space-y-2">
        <Link href="/" className={getLinkClass('/')} onClick={() => setIsOpen(false)}>
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
        <Link href="/samples" className={getLinkClass('/samples')} onClick={() => setIsOpen(false)}>
          <PackageSearch className="h-5 w-5" />
          <span>Sample Tracking</span>
        </Link>
        <Link href="/alerts" className={getLinkClass('/alerts')} onClick={() => setIsOpen(false)}>
          <AlertTriangle className="h-5 w-5" />
          <span>Alerts</span>
        </Link>
        <Link href="/analytics" className={getLinkClass('/analytics')} onClick={() => setIsOpen(false)}>
          <BarChart3 className="h-5 w-5" />
          <span>Analytics</span>
        </Link>
      </nav>

      <div className="mt-auto pt-8 border-t">
        <nav className="space-y-2">
          <Link href="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted transition-all" onClick={() => setIsOpen(false)}>
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </Link>
          <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </div>
    </>
  );

  return (
    <>
      {/* Hamburger button - mobile only */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-background border shadow-sm"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Dark overlay - mobile only */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={`
        md:hidden fixed top-0 left-0 z-50 h-screen w-72 flex flex-col
        border-r bg-background px-4 py-8
        transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <button
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
        <NavContent />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex h-screen w-64 flex-col border-r bg-background px-4 py-8">
        <NavContent />
      </div>
    </>
  );
}