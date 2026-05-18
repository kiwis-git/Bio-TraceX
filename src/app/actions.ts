"use server";

import { mockSamples, mockEvents, Sample, Event } from "@/lib/mock-data";
import { verifyAccess } from "@/access/access";
import { createAuditLog } from "@/audit-log/audit";
import { applySignature } from "@/lib/e-signature";

export async function registerSampleAction(data: { 
  type: string, 
  location: string, 
  temperature: number, 
  collectorId: string,
  sponsor_id?: string,
  study_id?: string,
  abhaId?: string,
  consent?: boolean,
  signatureData?: { userId: string; meaning: string; reason: string; }
}) {
  // 1. Access Control
  await verifyAccess(data.collectorId, "Collector");

  // 2. Electronic Signature (if provided)
  let signature = undefined;
  if (data.signatureData) {
    signature = await applySignature(data.signatureData);
  }

  const newSampleId = `SMPL-${Math.floor(Math.random() * 90000) + 10000}`;

  // @ts-ignore
  const newSample: Sample = {
    id: newSampleId,
    type: data.type,
    status: 'Collected',
    location: data.location,
    temperature: data.temperature,
    collector_id: data.collectorId,
    created_at: new Date().toISOString(),
    sponsor_id: data.sponsor_id || '',
    study_id: data.study_id || '',
    abha_id: data.abhaId || '',
    magnetic_field_gradient: 1.0,
    paramagnetic_fluid_density: 50.0
  };

  const newEvent: Event = {
    id: `EVT-${Math.floor(Math.random() * 90000) + 10000}`,
    sample_id: newSampleId,
    type: "Manual Registration",
    timestamp: new Date().toISOString(),
    handler: data.collectorId,
    location: data.location,
    validation_status: 'Valid',
    ...(signature && { signature })
  };

  // Mutate in-memory arrays on the server
  mockSamples.unshift(newSample);
  mockEvents.unshift(newEvent);

  // 3. Audit Log
  await createAuditLog("REGISTER_SAMPLE", data.collectorId, { 
    sampleId: newSampleId, 
    type: data.type 
  });

  return newSample;
}
