import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, CheckCheck, Truck, Tag } from 'lucide-react';
import { Card, Button, SkeletonCard, EmptyState } from '@/components/common';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/services';
import { useAuthStore } from '@/store/useAuthStore';
import type { Notification } from '@/types';

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
        return <Truck size={20} style={{ color: 'var(--color-primary-hover)' }} />;
      case 'industry_request':
        return <Tag size={20} style={{ color: 'var(--color-info)' }} />;
      case 'merchant_offer':
        return <Tag size={20} style={{ color: 'var(--color-success)' }} />;
      case 'opportunity':
        return <Bell size={20} style={{ color: 'var(--color-warning)' }} />;
      default:
        return <Bell size={20} />;
    }
  };

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-h2)', fontWeight: 700 }}>{t('notifications.title')}</h1>
          <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-muted)' }}>
            Updates on scrap orders, merchant offers, and market rates
          </p>
        </div>
        {notifications.some((n) => !n.read) && (
          <Button size="sm" variant="ghost" icon={<CheckCheck size={14} />} onClick={handleMarkAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
        ) : notifications.length > 0 ? (
          notifications.map((notif) => (
            <Card
              key={notif.id}
              padding="md"
              hoverable
              onClick={() => handleMarkRead(notif.id)}
              style={{
                background: notif.read ? 'var(--color-surface)' : 'var(--color-primary-light)',
                borderColor: notif.read ? 'var(--color-border)' : 'var(--color-primary-border)',
              }}
            >
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <div style={{ marginTop: '0.15rem' }}>{getIcon(notif.type)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <h3 style={{ fontSize: 'var(--text-body)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {notif.title}
                    </h3>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)' }}>
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                    {notif.message}
                  </p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <EmptyState
            icon={<Bell size={48} />}
            title={t('notifications.empty')}
            description={t('notifications.emptyDesc')}
          />
        )}
      </div>
    </div>
  );
}
