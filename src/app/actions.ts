"use server";

import { mockSamples, mockEvents, Sample, Event } from "@/lib/mock-data";

export async function registerSampleAction(data: { type: string, location: string, temperature: number, collectorId: string }) {
  const newSampleId = `SMPL-${Math.floor(Math.random() * 90000) + 10000}`;

  // @ts-ignore
  const newSample: Sample = {
    id: newSampleId,
    type: data.type,
    status: 'Collected',
    location: data.location,
    temperature: data.temperature,
    collector_id: data.collectorId,
    created_at: new Date().toISOString()
  };

  const newEvent: Event = {
    id: `EVT-${Math.floor(Math.random() * 90000) + 10000}`,
    sample_id: newSampleId,
    type: "Manual Registration",
    timestamp: new Date().toISOString(),
    handler: data.collectorId,
    location: data.location,
    validation_status: 'Valid'
  };

  // Mutate in-memory arrays on the server
  mockSamples.unshift(newSample);
  mockEvents.unshift(newEvent);

  return newSample;
}
