"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SignatureMeaning = "Approval" | "Review" | "Authorship" | "Responsibility Transfer";

export interface SignatureResult {
  userId: string;
  meaning: SignatureMeaning;
  reason: string;
}

interface ElectronicSignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onSign: (result: SignatureResult) => void;
  defaultMeaning?: SignatureMeaning;
}

export function ElectronicSignatureDialog({
  open,
  onOpenChange,
  title,
  description,
  onSign,
  defaultMeaning = "Approval",
}: ElectronicSignatureDialogProps) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  const [meaning, setMeaning] = useState<SignatureMeaning>(defaultMeaning);
  const [error, setError] = useState("");

  const handleSign = () => {
    setError("");
    
    if (!userId.trim()) {
      setError("User ID is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }
    if (!reason.trim()) {
      setError("Reason for change is mandatory per 21 CFR Part 11.");
      return;
    }
    
    // In a real application, you would validate the ID/Password against a backend here.
    // For this POC, we simulate success if both are provided.
    
    onSign({
      userId: userId.trim(),
      meaning,
      reason: reason.trim(),
    });
    
    // Reset form
    setUserId("");
    setPassword("");
    setReason("");
    setMeaning(defaultMeaning);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <DialogTitle>Electronic Signature</DialogTitle>
          </div>
          <DialogDescription className="text-xs pt-1">
            {title}
            <br/>
            <span className="text-muted-foreground">{description}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          
          {error && (
            <div className="bg-red-50 text-red-600 p-2 text-sm rounded flex items-center gap-2 border border-red-200">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="meaning">Signature Meaning</Label>
            <Select value={meaning} onValueChange={(v) => setMeaning(v as SignatureMeaning)}>
              <SelectTrigger id="meaning">
                <SelectValue placeholder="Select meaning" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Approval">Approval</SelectItem>
                <SelectItem value="Review">Review</SelectItem>
                <SelectItem value="Authorship">Authorship</SelectItem>
                <SelectItem value="Responsibility Transfer">Responsibility Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reason">Reason for Change (Mandatory)</Label>
            <textarea
              id="reason"
              className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Provide a detailed reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
            <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Authentication</p>
            <div className="grid gap-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                placeholder="Enter your assigned User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className="text-[10px] text-muted-foreground italic leading-tight">
              By executing this signature, you acknowledge that this electronic signature is the legally binding equivalent of your handwritten signature per 21 CFR Part 11 Subpart C.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSign} className="gap-2">
            <ShieldCheck className="h-4 w-4" />
            Execute Signature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
