export const toParticipantResponse = (data, isOnline = false, lastSeen = new Date()) => ({
  id: data.id,
  accountId: data.accountId || data.id,
  avatarUrl: data.avatarUrl || null,
  fullName: data.fullName || null,
  isVerified: data.isVerified ?? false,
  isOnline: isOnline,
  lastSeen: lastSeen
});
