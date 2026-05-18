export async function createAuditLog(action: string, user: string, details: any) {
  // Mock audit log creation
  console.log(`[AUDIT LOG] ${new Date().toISOString()} - ${user} performed ${action}`, details);
  return true;
}
