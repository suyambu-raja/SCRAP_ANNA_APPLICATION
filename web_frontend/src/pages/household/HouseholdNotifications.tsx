import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IndianRupee,
  Truck,
  TrendingUp,
  CheckCircle2,
  CheckCheck,
  ChevronRight,
  BellCheck,
} from 'lucide-react';
import styles from './HouseholdNotifications.module.css';

type NotificationGroup = 'TODAY' | 'YESTERDAY' | 'EARLIER';
type NotificationType = 'payment' | 'pickup' | 'price_update' | 'general';

interface NotificationItem {
  id: string;
  group: NotificationGroup;
  type: NotificationType;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  actionLabel?: string;
  actionLink?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    group: 'TODAY',
    type: 'payment',
    title: 'Payment Credited',
    desc: '₹1,850 credited for Order SA123456. UPI spot transfer received.',
    time: '10:45 AM',
    unread: true,
    actionLabel: 'View Order',
    actionLink: '/household/orders',
  },
  {
    id: 'n-2',
    group: 'TODAY',
    type: 'pickup',
    title: 'Pickup Executive Assigned',
    desc: 'Murugan (Tata 407 • TN 09 BX 4421) assigned to Order SA123455.',
    time: '09:30 AM',
    unread: true,
    actionLabel: 'View Pickup',
    actionLink: '/household/orders',
  },
  {
    id: 'n-3',
    group: 'YESTERDAY',
    type: 'price_update',
    title: 'Copper Price Increased',
    desc: 'Copper is now ₹720/kg (+₹12/kg surge). Lock in today’s best rate.',
    time: 'Yesterday',
    unread: true,
    actionLabel: 'Check Rates',
    actionLink: '/household/rates',
  },
  {
    id: 'n-4',
    group: 'YESTERDAY',
    type: 'pickup',
    title: 'Doorstep Pickup Completed',
    desc: 'Digital scale verified 32.1 kg collected for Order SA123453.',
    time: 'Yesterday',
    unread: false,
    actionLabel: 'View Receipt',
    actionLink: '/household/history',
  },
  {
    id: 'n-5',
    group: 'EARLIER',
    type: 'payment',
    title: 'Payment Credited',
    desc: '₹2,845 credited for Order SA123450 via UPI payment.',
    time: '28 Apr',
    unread: false,
    actionLabel: 'View Order',
    actionLink: '/household/history',
  },
  {
    id: 'n-6',
    group: 'EARLIER',
    type: 'price_update',
    title: 'Aluminium Rates Updated',
    desc: 'Household aluminium wire rates updated to ₹135/kg in Chennai.',
    time: '25 Apr',
    unread: false,
    actionLabel: 'Check Rates',
    actionLink: '/household/rates',
  },
];

const GROUPS: NotificationGroup[] = ['TODAY', 'YESTERDAY', 'EARLIER'];

export function HouseholdNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  const handleNotificationClick = (item: NotificationItem) => {
    // Mark clicked item as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    );

    // Route to contextual action if provided
    if (item.actionLink) {
      navigate(item.actionLink);
    }
  };

  const getSemanticIcon = (type: NotificationType) => {
    switch (type) {
      case 'payment':
        return <IndianRupee size={18} strokeWidth={2.5} />;
      case 'pickup':
        return <Truck size={18} strokeWidth={2.2} />;
      case 'price_update':
        return <TrendingUp size={18} strokeWidth={2.2} />;
      default:
        return <CheckCircle2 size={18} strokeWidth={2.2} />;
    }
  };

  const getIconClass = (type: NotificationType) => {
    switch (type) {
      case 'payment':
        return styles.iconPayment;
      case 'pickup':
        return styles.iconPickup;
      case 'price_update':
        return styles.iconPrice;
      default:
        return styles.iconGeneral;
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* 1. Header Section */}
      <div className={styles.headerRow}>
        <div className={styles.headerTitles}>
          <h1 className={styles.pageTitle}>Notifications</h1>
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

      {/* 2. Notification Groups or Empty State */}
      {notifications.length === 0 ? (
        <div className={styles.emptyStateContainer}>
          <div className={styles.emptyStateIconCircle}>
            <BellCheck size={26} />
          </div>
          <h2 className={styles.emptyStateTitle}>You're all caught up</h2>
          <p className={styles.emptyStateDesc}>
            New pickup, payment and rate updates will appear here.
          </p>
        </div>
      ) : (
        GROUPS.map((group) => {
          const groupItems = notifications.filter((n) => n.group === group);
          if (groupItems.length === 0) return null;

          return (
            <section key={group} className={styles.notificationGroup} aria-label={group}>
              <div className={styles.groupHeadingRow}>
                <span className={styles.groupHeadingText}>{group}</span>
                <span className={styles.groupCountBadge}>{groupItems.length}</span>
              </div>

              <div className={styles.notificationList}>
                {groupItems.map((item) => (
                  <div
                    key={item.id}
                    className={`${styles.notificationRow} ${
                      item.unread ? styles.notificationRowUnread : styles.notificationRowRead
                    }`}
                    onClick={() => handleNotificationClick(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleNotificationClick(item);
                      }
                    }}
                  >
                    {/* Left Rounded Semantic Icon Container */}
                    <div
                      className={`${styles.iconContainer} ${getIconClass(item.type)}`}
                      aria-hidden="true"
                    >
                      {getSemanticIcon(item.type)}
                    </div>

                    {/* Content Column */}
                    <div className={styles.contentCol}>
                      <div className={styles.titleTimestampRow}>
                        <h2 className={styles.notificationTitle}>{item.title}</h2>
                        <span className={styles.timestampText}>{item.time}</span>
                      </div>

                      <p className={styles.notificationDesc}>{item.desc}</p>

                      {item.actionLabel && (
                        <div className={styles.actionRow}>
                          <span className={styles.actionChip}>
                            <span>{item.actionLabel}</span>
                            <ChevronRight size={12} strokeWidth={2.5} />
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Unread Accent Dot */}
                    {item.unread && (
                      <span
                        className={styles.unreadDot}
                        aria-label="Unread notification"
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
