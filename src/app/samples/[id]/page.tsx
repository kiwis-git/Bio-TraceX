import { mockEvents, mockSamples } from "@/lib/mock-data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SampleDetailClient } from "@/components/samples/sample-detail-client";

export default async function SampleTimeline({ params }: { params: Promise<{ id: string }> }) {
  // Since this is a POC we'll use the ID from the URL.
  const { id } = await params;
  const sampleId = id || 'SMPL-84920'; 
  const sample = mockSamples.find(s => s.id === sampleId);
  const events = mockEvents.filter(e => e.sample_id === sampleId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (!sample) return (
    <div className="p-10 text-center">
      <h2 className="text-2xl font-bold">Sample Not Found</h2>
      <Link href="/samples"><Button className="mt-4">Back to Registry</Button></Link>
    </div>
  );

  return <SampleDetailClient initialSample={sample} initialEvents={events} />;
}
