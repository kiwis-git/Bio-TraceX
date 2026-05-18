"use client";

import React, { createContext, useContext, useState } from "react";
import { MOCK_TENANTS } from "./mock-data";

type Tenant = typeof MOCK_TENANTS[0];

interface PocContextType {
  activeTenant: Tenant;
  setActiveTenant: (tenant: Tenant) => void;
  activeStudyId: string;
  setActiveStudyId: (studyId: string) => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  isTrainingExpired: boolean;
  setIsTrainingExpired: (expired: boolean) => void;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const PocContext = createContext<PocContextType | undefined>(undefined);

export function PocProvider({ children }: { children: React.ReactNode }) {
  const [activeTenant, setActiveTenant] = useState<Tenant>(MOCK_TENANTS[0]);
  const [activeStudyId, setActiveStudyId] = useState<string>(MOCK_TENANTS[0].studies[0]);
  const [isOffline, setIsOffline] = useState(false);
  const [isTrainingExpired, setIsTrainingExpired] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // When tenant changes, default to their first study
  const handleSetTenant = (tenant: Tenant) => {
    setActiveTenant(tenant);
    setActiveStudyId(tenant.studies[0]);
  };

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <PocContext.Provider
      value={{
        activeTenant,
        setActiveTenant: handleSetTenant,
        activeStudyId,
        setActiveStudyId,
        isOffline,
        setIsOffline,
        isTrainingExpired,
        setIsTrainingExpired,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </PocContext.Provider>
  );
}

export function usePocContext() {
  const context = useContext(PocContext);
  if (context === undefined) {
    throw new Error("usePocContext must be used within a PocProvider");
  }
  return context;
}
