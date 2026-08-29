import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Truck, Calendar, BarChart2, ArrowRight } from 'lucide-react';
import { Card, StatusBadge } from '@/components/common';
import { PriceCard } from '@/components/cards/PriceCard';
import { SkeletonCard } from '@/components/common/SkeletonLoader';
import { EmptyState } from '@/components/common/EmptyState';
import { useAuthStore } from '@/store/useAuthStore';
import { getMarketPrices, getHouseholdOrders } from '@/services';
import type { MarketPrice, HouseholdOrder } from '@/types';
import styles from './Dashboard.module.css';

export default function HouseholdDashboard() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [orders, setOrders] = useState<HouseholdOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getMarketPrices(),
      getHouseholdOrders(user?.id),
    ]).then(([priceData, orderData]) => {
      setPrices(priceData.slice(0, 4));
      setOrders(orderData);
      setLoading(false);
    });
  }, [user?.id]);

  return (
    <div className={`page-enter ${styles.dashboard}`}>
      {/* Welcome */}
      <section className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>
          {t('dashboard.welcome')}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-muted)' }}>
          {user?.location.area}, {user?.location.city}
        </p>
      </section>

      {/* Quick Actions */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('dashboard.household.quickActions')}</h2>
        <div className={styles.quickActions}>
          <Link to="/sell-scrap">
            <Card padding="md" hoverable>
              <div className={styles.quickAction}>
                <Truck size={24} className={styles.qaIcon} />
                <span>{t('dashboard.household.sellScrap')}</span>
              </div>
            </Card>
          </Link>
          <Link to="/book-pickup">
            <Card padding="md" hoverable>
              <div className={styles.quickAction}>
                <Calendar size={24} className={styles.qaIcon} />
                <span>{t('dashboard.household.bookPickup')}</span>
              </div>
            </Card>
          </Link>
          <Link to="/market-prices">
            <Card padding="md" hoverable>
              <div className={styles.quickAction}>
                <BarChart2 size={24} className={styles.qaIcon} />
                <span>{t('dashboard.household.viewPrices')}</span>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* Current Prices */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t('home.prices.title')}</h2>
          <Link to="/market-prices" className={styles.viewAll}>
            {t('common.viewAll')} <ArrowRight size={14} />
          </Link>
        </div>
        <div className={styles.priceGrid}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : prices.map((p) => <PriceCard key={p.id} price={p} />)
          }
        </div>
      </section>

      {/* Active Orders */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t('dashboard.household.activeOrders')}</h2>
          <Link to="/orders" className={styles.viewAll}>
            {t('common.viewAll')} <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <SkeletonCard />
        ) : orders.length > 0 ? (
          <div className={styles.cardList}>
            {orders.map((order) => (
              <Card key={order.id} padding="md" hoverable>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-body)', fontWeight: 600 }}>
                      {order.items.map((i) => `${i.name} (${i.quantity} ${i.unit})`).join(', ')}
                    </h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      Pickup: {order.pickup.date} • {order.pickup.timeSlot}
                    </p>
                  </div>
                  <StatusBadge
                    status={order.status === 'completed' ? 'success' : order.status === 'pickup_scheduled' ? 'info' : 'warning'}
                    label={order.status.replace('_', ' ').toUpperCase()}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-small)', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Est. Amount</span>
                  <strong style={{ color: 'var(--color-success)', fontSize: 'var(--text-body)' }}>₹{order.totalAmount}</strong>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState title={t('orders.empty')} description={t('orders.emptyDesc')} />
        )}
      </section>
    </div>
  );
}
