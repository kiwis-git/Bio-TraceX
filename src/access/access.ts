export async function verifyAccess(userId: string, requiredRole: string) {
  // Mock access verification
  console.log(`[ACCESS CHECK] Verifying if ${userId} has role ${requiredRole}`);
  if (!userId) throw new Error("Unauthorized: User ID is required");
  return true;
}
