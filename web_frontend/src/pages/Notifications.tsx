import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, CheckCheck, Truck, Tag, TrendingUp, IndianRupee } from 'lucide-react';
import { SkeletonCard, EmptyState } from '@/components/common';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/services';
import { useAuthStore } from '@/store/useAuthStore';
import type { Notification } from '@/types';
import styles from './Notifications.module.css';

type NotificationGroup = 'TODAY' | 'YESTERDAY' | 'EARLIER';

const GROUPS: NotificationGroup[] = ['TODAY', 'YESTERDAY', 'EARLIER'];

const getNotificationGroup = (dateStr: string): NotificationGroup => {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return 'TODAY';
  if (isYesterday) return 'YESTERDAY';
  return 'EARLIER';
};

export default function Notifications() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserNotifications(user?.id || 'USR001').then((data) => {
      setNotifications(data);
      setLoading(false);
    });
  }, [user?.id]);

  const handleMarkRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    await markAllNotificationsAsRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return <Truck size={18} strokeWidth={2.2} />;
      case 'industry_request':
        return <Tag size={18} strokeWidth={2.2} />;
      case 'merchant_offer':
        return <IndianRupee size={18} strokeWidth={2.4} />;
      case 'opportunity':
        return <TrendingUp size={18} strokeWidth={2.2} />;
      default:
        return <Bell size={18} strokeWidth={2.2} />;
    }
  };

  const getIconClass = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return styles.iconOrder;
      case 'industry_request':
        return styles.iconIndustry;
      case 'merchant_offer':
        return styles.iconMerchant;
      case 'opportunity':
        return styles.iconOpportunity;
      default:
        return styles.iconDefault;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className={`page-enter ${styles.pageContainer}`}>
      <div className={styles.headerRow}>
        <div className={styles.headerTitles}>
          <h1 className={styles.pageTitle}>{t('notifications.title', 'Notifications')}</h1>
          <p className={styles.pageSubtitle}>
            Stay updated on your pickups, payments &amp; rates.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            className={styles.markAllReadBtn}
            onClick={handleMarkAllRead}
            aria-label="Mark all notifications as read"
          >
            <CheckCheck size={15} />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : notifications.length > 0 ? (
        GROUPS.map((group) => {
          const groupItems = notifications.filter(
            (n) => getNotificationGroup(n.createdAt) === group
          );
          if (groupItems.length === 0) return null;

          return (
            <section key={group} className={styles.notificationGroup} aria-label={group}>
              <div className={styles.groupHeadingRow}>
                <span className={styles.groupHeadingText}>{group}</span>
                <span className={styles.groupCountBadge}>{groupItems.length}</span>
              </div>

              <div className={styles.notificationList}>
                {groupItems.map((notif) => (
                  <div
                    key={notif.id}
                    className={`${styles.notificationRow} ${
                      !notif.read ? styles.notificationRowUnread : styles.notificationRowRead
                    }`}
                    onClick={() => handleMarkRead(notif.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleMarkRead(notif.id);
                      }
                    }}
                  >
                    <div
                      className={`${styles.iconContainer} ${getIconClass(notif.type)}`}
                      aria-hidden="true"
                    >
                      {getIcon(notif.type)}
                    </div>

                    <div className={styles.contentCol}>
                      <div className={styles.titleTimestampRow}>
                        <h2 className={styles.notificationTitle}>{notif.title}</h2>
                        <span className={styles.timestampText}>
                          {new Date(notif.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className={styles.notificationDesc}>{notif.message}</p>
                    </div>

                    {!notif.read && (
                      <span className={styles.unreadDot} aria-label="Unread notification" />
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })
      ) : (
        <EmptyState
          icon={<Bell size={44} />}
          title="You're all caught up"
          description="New pickup, payment and rate updates will appear here."
        />
      )}
    </div>
  );
}
