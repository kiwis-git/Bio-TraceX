"use client";

import { useState } from "react";
import { usePocContext } from "@/lib/poc-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LockKeyhole, ShieldAlert } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, login } = usePocContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate network request
    setTimeout(() => {
      const validUsername = process.env.NEXT_PUBLIC_APP_USERNAME || "admin";
      const validPassword = process.env.NEXT_PUBLIC_APP_PASSWORD || "password";
      
      if (username === validUsername && password === validPassword) {
        login();
      } else {
        setError("Invalid ID or password. Please try again.");
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="w-full max-w-md p-6">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 text-white">
            <div className="flex items-center justify-center rounded-lg bg-blue-600 p-2">
              <ShieldAlert className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight">BioTraceX</span>
          </div>
        </div>

        <Card className="border-slate-800 bg-slate-900/80 text-white backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Authorized Access Only</CardTitle>
            <CardDescription className="text-center text-slate-400">
              21 CFR Part 11 Subpart C requires two-component identification.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 pt-4">
              {error && (
                <div className="p-3 text-sm bg-red-950/50 border border-red-900 text-red-400 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-300">User ID</Label>
                <Input 
                  id="username" 
                  placeholder="e.g. TECH-132" 
                  required 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                <LockKeyhole className="mr-2 h-4 w-4" />
                {isLoading ? "Authenticating..." : "Secure Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <p className="text-center text-xs text-slate-500 mt-8">
          Warning: This is a restricted system. All activities are monitored and logged.
        </p>
      </div>
    </div>
  );
}
