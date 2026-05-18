export type SampleStatus = 'Collected' | 'In-Transit' | 'Storage' | 'Analysis' | 'Ruined' | 'Disposed';

export interface Sample {
  id: string;
  type: string;
  status: SampleStatus;
  location: string;
  temperature: number;
  collector_id: string;
  created_at: string;
  sponsor_id: string;
  study_id: string;
  abha_id: string;
  magnetic_field_gradient: number;
  paramagnetic_fluid_density: number;
}

export interface Event {
  id: string;
  sample_id: string;
  type: string;
  timestamp: string;
  handler: string;
  location: string;
  validation_status: 'Valid' | 'Flagged' | 'Failed';
  reason?: string;
  signature?: {
    printed_name: string;
    meaning: string;
    timestamp: string;
  };
  changes?: {
    field: string;
    old_value: string;
    new_value: string;
  }[];
}

export interface Alert {
  id: string;
  sample_id: string;
  message: string;
  severity: 'High' | 'Medium' | 'Low';
  timestamp: string;
  resolved: boolean;
}

// Simple Linear Congruential Generator for seeded random numbers
const lcg = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};
const random = lcg(12345);

export const MOCK_TENANTS = [
  { sponsor_id: "SPN-101", sponsor_name: "Apex BioPharma", studies: ["STD-101A", "STD-101B"] },
  { sponsor_id: "SPN-202", sponsor_name: "Zenith Therapeutics", studies: ["STD-202X"] },
  { sponsor_id: "SPN-303", sponsor_name: "NovaGenetics", studies: ["STD-303A", "STD-303B", "STD-303C"] }
];

const generateMockData = (count: number) => {
  const types = ["Blood Serum", "Tissue Biopsy", "DNA Extract", "Plasma", "Urine", "Saliva", "Whole Blood"];
  const statuses: SampleStatus[] = ['Collected', 'In-Transit', 'Storage', 'Analysis', 'Ruined', 'Disposed'];
  const locations = ["Clinic 1", "Transport Unit A", "Freezer Unit B", "Lab Room 3", "Disposal Facility", "Field Clinic 4", "Storage Center C"];
  
  const generatedSamples: Sample[] = [];
  const generatedEvents: Event[] = [];

  let eventCounter = 10000;

  const generatedAlerts: Alert[] = [];
  let alertCounter = 100;

  for (let i = 0; i < count; i++) {
    const sampleId = `SMPL-${10000 + i}`;
    const status = statuses[Math.floor(random() * statuses.length)];
    const location = locations[Math.floor(random() * locations.length)];
    const baseTemp = Number(((random() * 40) - 20).toFixed(1));
    const collector = `TECH-${Math.floor(random() * 900) + 100}`;
    const baseTime = 1775174400000 - random() * 10000000000;
    
    const tenant = MOCK_TENANTS[Math.floor(random() * MOCK_TENANTS.length)];
    const studyId = tenant.studies[Math.floor(random() * tenant.studies.length)];
    const abhaId = `${Math.floor(random() * 90) + 10}-${Math.floor(random() * 9000) + 1000}-${Math.floor(random() * 9000) + 1000}-${Math.floor(random() * 9000) + 1000}`;

    generatedSamples.push({
      id: sampleId,
      type: types[Math.floor(random() * types.length)],
      status: status,
      location: location,
      temperature: baseTemp,
      collector_id: collector,
      created_at: new Date(baseTime).toISOString(),
      sponsor_id: tenant.sponsor_id,
      study_id: studyId,
      abha_id: abhaId,
      magnetic_field_gradient: Number((random() * 4 + 1).toFixed(2)),
      paramagnetic_fluid_density: Number((random() * 50 + 50).toFixed(1)),
    });

    // 1. Always start with a collection event
    generatedEvents.push({
      id: `EVT-${eventCounter++}`,
      sample_id: sampleId,
      type: "Collection (OCR Verified)",
      timestamp: new Date(baseTime).toISOString(),
      handler: collector,
      location: "Field Collection site",
      validation_status: "Valid",
      signature: {
        printed_name: `Tech ${collector.split('-')[1]}`,
        meaning: "Authorship",
        timestamp: new Date(baseTime).toISOString(),
      }
    });

    // 2. Add Transit history if beyond 'Collected'
    if (status !== 'Collected') {
      const handlerId = `DRVR-${Math.floor(random() * 90 + 10)}`;
      const timestamp = new Date(baseTime + 3600000).toISOString();
      generatedEvents.push({
        id: `EVT-${eventCounter++}`,
        sample_id: sampleId,
        type: "Transit Started",
        timestamp: timestamp, // +1 hour
        handler: handlerId,
        location: "Transport Unit Tracker",
        validation_status: "Valid",
        signature: {
          printed_name: `Driver ${handlerId.split('-')[1]}`,
          meaning: "Responsibility Transfer",
          timestamp: timestamp,
        },
        changes: [{ field: "status", old_value: "Collected", new_value: "In-Transit" }]
      });
    }

    // 3. Add Ruined tracking specifically
    if (status === 'Ruined' || (status === 'Disposed' && random() > 0.5)) {
      // It got ruined en route or in storage
      generatedEvents.push({
        id: `EVT-${eventCounter++}`,
        sample_id: sampleId,
        type: "Temperature Deviation (Spoiled)",
        timestamp: new Date(baseTime + 7200000).toISOString(),
        handler: "System (IoT)",
        location: location,
        validation_status: "Failed",
        reason: `Temperature exceeded safe limits. Spiked to ${Number(baseTemp + 15).toFixed(1)}°C. Sample integrity permanently compromised.`
      });

      // ALERTS GENERATION FOR RUINED SAMPLES
      generatedAlerts.push({
        id: `ALT-${alertCounter++}`,
        sample_id: sampleId,
        message: `CRITICAL: Temperature spiked to ${Number(baseTemp + 15).toFixed(1)}°C. Sample integrity lost.`,
        severity: 'High',
        timestamp: new Date(baseTime + 7200000).toISOString(),
        resolved: random() > 0.3 // 70% chance of being resolved by manager
      });

      const mgrId = `MGR-${Math.floor(random() * 900) + 100}`;
      const ruinTime = new Date(baseTime + 8000000).toISOString();
      generatedEvents.push({
        id: `EVT-${eventCounter++}`,
        sample_id: sampleId,
        type: "Status Update: Ruined",
        timestamp: ruinTime,
        handler: mgrId,
        location: location,
        validation_status: "Valid",
        reason: "Manager confirmed biological degradation. Marked for immediate disposal to prevent cross-contamination.",
        signature: {
          printed_name: `Manager ${mgrId.split('-')[1]}`,
          meaning: "Review and Approval",
          timestamp: ruinTime,
        },
        changes: [{ field: "status", old_value: "Storage", new_value: "Ruined" }]
      });

      if (status === 'Disposed') {
         const dispId = `TECH-DISP-${Math.floor(random() * 90 + 10)}`;
         const dispTime = new Date(baseTime + 10000000).toISOString();
         generatedEvents.push({
          id: `EVT-${eventCounter++}`,
          sample_id: sampleId,
          type: "Disposal",
          timestamp: dispTime,
          handler: dispId,
          location: "Disposal Facility",
          validation_status: "Valid",
          reason: "Bio-hazard waste protocol executed. Dual authorization approved.",
          signature: {
            printed_name: `Tech ${dispId.split('-')[2]}`,
            meaning: "Approval",
            timestamp: dispTime,
          },
          changes: [{ field: "status", old_value: "Ruined", new_value: "Disposed" }]
        });
      }
    } else if (status === 'Disposed') {
      // Normal disposal after analysis
      const sciId = `SCI-${Math.floor(random() * 90) + 10}`;
      const sciTime = new Date(baseTime + 7200000).toISOString();
      generatedEvents.push({
        id: `EVT-${eventCounter++}`,
        sample_id: sampleId,
        type: "Analysis Completed",
        timestamp: sciTime,
        handler: sciId,
        location: "Lab Main",
        validation_status: "Valid",
        signature: {
          printed_name: `Scientist ${sciId.split('-')[1]}`,
          meaning: "Authorship",
          timestamp: sciTime
        },
        changes: [{ field: "status", old_value: "Analysis", new_value: "Storage" }]
      });
      const techId = `TECH-${Math.floor(random() * 90) + 10}`;
      const techTime = new Date(baseTime + 10000000).toISOString();
      generatedEvents.push({
        id: `EVT-${eventCounter++}`,
        sample_id: sampleId,
        type: "Disposal (Routine)",
        timestamp: techTime,
        handler: techId,
        location: "Disposal Facility",
        validation_status: "Valid",
        reason: "Routine clearance post-analysis. Sample lifespan concluded.",
        signature: {
          printed_name: `Tech ${techId.split('-')[1]}`,
          meaning: "Approval",
          timestamp: techTime
        },
        changes: [{ field: "status", old_value: "Storage", new_value: "Disposed" }]
      });
    } else if (status === 'Storage' || status === 'Analysis') {
       generatedEvents.push({
        id: `EVT-${eventCounter++}`,
        sample_id: sampleId,
        type: "Check-in",
        timestamp: new Date(baseTime + 7200000).toISOString(),
        handler: `TECH-${Math.floor(random() * 900) + 100}`,
        location: location,
        validation_status: "Valid"
      });

      // OCCASIONAL MEDIUM ALERTS
      if (random() > 0.85) {
        generatedAlerts.push({
          id: `ALT-${alertCounter++}`,
          sample_id: sampleId,
          message: `Storage door left open during check-in longer than 60s.`,
          severity: 'Medium',
          timestamp: new Date(baseTime + 7200000).toISOString(),
          resolved: true
        });
      }

      // MISSED SCAN ALERT
      if (random() > 0.9) {
        generatedAlerts.push({
          id: `ALT-${alertCounter++}`,
          sample_id: sampleId,
          message: `Missed scan detected. Scan in ${location} was missed.`,
          severity: 'High',
          timestamp: new Date(baseTime + 7500000).toISOString(),
          resolved: false
        });
      }
    }

    // Occasional Contactless Transfer Event (Antigravity Tracking)
    if (random() > 0.95 && status !== 'Collected') {
      generatedEvents.push({
        id: `EVT-${eventCounter++}`,
        sample_id: sampleId,
        type: "Contactless Transfer (Acoustic Levitation)",
        timestamp: new Date(baseTime + 4000000).toISOString(),
        handler: "Robotics Unit AI-7",
        location: location,
        validation_status: "Valid",
        reason: "Magnetic field gradients maintained morphological integrity.",
        signature: {
          printed_name: "Automated Handler",
          meaning: "Responsibility Transfer",
          timestamp: new Date(baseTime + 4000000).toISOString(),
        }
      });
    }

    // Occasional Reagent Alert
    if (random() > 0.98 && status === 'Analysis') {
      generatedAlerts.push({
        id: `ALT-${alertCounter++}`,
        sample_id: sampleId,
        message: `CRITICAL: Result generated using expired reagent (Lot #RG-8842).`,
        severity: 'High',
        timestamp: new Date(baseTime + 7500000).toISOString(),
        resolved: false
      });
    }
  }
  return { generatedSamples, generatedEvents, generatedAlerts };
};

const { generatedSamples, generatedEvents, generatedAlerts } = generateMockData(500);

export const mockSamples: Sample[] = [
  ...generatedSamples
];

export const mockEvents: Event[] = [
  ...generatedEvents
];

export const mockAlerts: Alert[] = [
  ...generatedAlerts,
  {
    id: "ALT-001",
    sample_id: "SMPL-10020",
    message: "Temperature deviation detected: -18.5°C (Target: -20°C).",
    severity: "High",
    timestamp: "2026-04-01T10:00:25Z",
    resolved: false
  }
];
