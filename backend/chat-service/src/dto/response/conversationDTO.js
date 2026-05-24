export class ConversationDTO {
  constructor(data, name, avatarUrl, isVerified, isOnline = false, lastSeen = new Date()) {
    this.id = data.id;
    this.participantsHash = data.participantsHash;
    this.name = name || 'User';
    this.avatarUrl = avatarUrl || '';
    this.isVerified = isVerified || false;
    this.isOnline = isOnline;
    this.lastSeen = lastSeen;
    this.type = data.type;
    this.lastMessage = data.lastMessage || '';
    this.lastMessageDate = data.lastMessageDate || '';
    this.participants = data.participants || [];
    this.group = data.group || null;
    this.createdDate = data.createdDate;
    this.modifiedDate = data.modifiedDate;
  }
}
