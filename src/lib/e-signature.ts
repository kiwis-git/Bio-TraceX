export interface SignatureData {
  userId: string;
  meaning: string;
  reason: string;
}

export async function applySignature(data: SignatureData) {
  // Mock signature validation/application
  console.log(`[E-SIGNATURE] Applied signature for ${data.userId}: ${data.meaning} - ${data.reason}`);
  
  if (!data.userId || !data.reason) {
    throw new Error("Invalid signature data");
  }

  return {
    printed_name: `User ${data.userId}`,
    meaning: data.meaning,
    timestamp: new Date().toISOString()
  };
}
