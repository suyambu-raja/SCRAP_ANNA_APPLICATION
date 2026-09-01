import { Bell, CheckCircle2, Clock, Truck, IndianRupee, ShieldCheck } from 'lucide-react';
import styles from './HouseholdHistory.module.css';

const NOTIFICATIONS = [
  {
    id: 'n-1',
    title: 'Payment Credited: ₹1,850 for Order SA123456',
    desc: 'UPI payment transferred directly to your bank account ending in 4421.',
    time: 'Today, 10:45 AM',
    unread: true,
    icon: IndianRupee,
    iconBg: '#ecfdf5',
    iconColor: '#059669',
  },
  {
    id: 'n-2',
    title: 'Pickup Executive Assigned',
    desc: 'Driver Murugan (Tata 407 • TN 09 BX 4421) assigned for order SA123455.',
    time: 'Today, 09:30 AM',
    unread: true,
    icon: Truck,
    iconBg: '#eff6ff',
    iconColor: '#2563eb',
  },
  {
    id: 'n-3',
    title: 'Copper Scrap Prices Rose by +₹12/kg',
    desc: 'Current copper market rate is ₹720/kg. Book your pickup today to lock in rates!',
    time: 'Yesterday, 04:00 PM',
    unread: true,
    icon: Bell,
    iconBg: '#fffbeb',
    iconColor: '#f59e0b',
  },
  {
    id: 'n-4',
    title: 'Order SA123453 Completed Successfully',
    desc: 'Thank you for recycling 32.1 kg of scrap materials with Scrap Anna.',
    time: '22 Apr 2025',
    unread: false,
    icon: CheckCircle2,
    iconBg: '#f1f5f9',
    iconColor: '#475569',
  },
];

export function HouseholdNotifications() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerBlock}>
        <div className={styles.headerIconCircle} style={{ background: '#fffbeb', color: '#d97706' }}>
          <Bell size={24} />
        </div>
        <div className={styles.headerTitles}>
          <h2 className={styles.mainTitle}>Notifications & Alerts</h2>
          <p className={styles.mainSubtitle}>Stay updated on your scrap pickup statuses, price surges, and payments.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {NOTIFICATIONS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              style={{
                background: item.unread ? '#ffffff' : '#f8fafc',
                border: item.unread ? '1px solid #fde68a' : '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1.15rem 1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                boxShadow: item.unread ? '0 2px 8px rgba(245,158,11,0.08)' : 'none',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: item.iconBg,
                  color: item.iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={20} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                    {item.title}
                  </h4>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{item.time}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569', lineHeight: 1.4 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HouseholdNotifications;
