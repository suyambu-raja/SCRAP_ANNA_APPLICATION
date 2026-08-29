import { getDb, simulateNetwork } from './mockDataService';
import type { Notification } from '@/types';

export async function getUserNotifications(userId: string): Promise<Notification[]> {
  return simulateNetwork(() => {
    return getDb().notifications.filter((n) => n.userId === userId);
  });
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  return simulateNetwork(() => {
    const notif = getDb().notifications.find((n) => n.id === notificationId);
    if (notif) {
      notif.read = true;
    }
  });
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  return simulateNetwork(() => {
    getDb()
      .notifications.filter((n) => n.userId === userId)
      .forEach((n) => {
        n.read = true;
      });
  });
}
