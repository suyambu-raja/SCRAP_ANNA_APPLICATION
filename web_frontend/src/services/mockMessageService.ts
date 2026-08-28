import { getDb, simulateNetwork } from './mockDataService';
import type { Message, User } from '@/types';

export interface ChatConversation {
  conversationId: string;
  otherUser: User;
  lastMessage: Message;
  unreadCount: number;
}

export async function getUserConversations(userId: string): Promise<ChatConversation[]> {
  return simulateNetwork(() => {
    const db = getDb();
    const userMessages = db.messages.filter(
      (m) => m.senderId === userId || m.receiverId === userId
    );

    const convMap = new Map<string, Message[]>();
    userMessages.forEach((m) => {
      if (!convMap.has(m.conversationId)) {
        convMap.set(m.conversationId, []);
      }
      convMap.get(m.conversationId)!.push(m);
    });

    const conversations: ChatConversation[] = [];
    convMap.forEach((msgs, convId) => {
      const lastMsg = msgs[msgs.length - 1];
      const otherUserId = lastMsg.senderId === userId ? lastMsg.receiverId : lastMsg.senderId;
      const otherUser = db.users.find((u) => u.id === otherUserId) || {
        id: otherUserId,
        role: 'merchant' as const,
        name: 'Scrap Partner',
        email: 'partner@example.com',
        phone: '+91XXXXXXXXXX',
        language: 'en' as const,
        location: { area: 'Chennai', city: 'Chennai', state: 'Tamil Nadu', pincode: '600001' },
        avatar: null,
        verified: true,
        status: 'active' as const,
      };

      const unreadCount = msgs.filter((m) => m.receiverId === userId && !m.read).length;

      conversations.push({
        conversationId: convId,
        otherUser,
        lastMessage: lastMsg,
        unreadCount,
      });
    });

    return conversations;
  });
}

export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  return simulateNetwork(() => {
    return getDb().messages.filter((m) => m.conversationId === conversationId);
  });
}

export async function sendMessage(data: {
  conversationId: string;
  senderId: string;
  receiverId: string;
  message: string;
}): Promise<Message> {
  return simulateNetwork(() => {
    const db = getDb();
    const newMsg: Message = {
      id: `MSG${String(db.messages.length + 1).padStart(3, '0')}`,
      conversationId: data.conversationId,
      senderId: data.senderId,
      receiverId: data.receiverId,
      message: data.message,
      timestamp: new Date().toISOString(),
      read: false,
    };

    db.messages.push(newMsg);
    return newMsg;
  });
}
