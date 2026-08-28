import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, Truck, Factory, Recycle, ArrowRight, Briefcase } from 'lucide-react';
import { Card, Button, SkeletonCard, EmptyState } from '@/components/common';
import { useAuthStore } from '@/store/useAuthStore';
import { getAggregatorData } from '@/services';
import type { AggregatorData } from '@/types';
import styles from './Dashboard.module.css';

export default function AggregatorDashboard() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [data, setData] = useState<AggregatorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAggregatorData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className={`page-enter ${styles.dashboard}`}>
      <section className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>{t('dashboard.welcome')}, {user?.name?.split(' ')[0]} 👋</h1>
        <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-muted)' }}>
          {user?.name} • {user?.location.city}, {user?.location.state}
        </p>
      </section>

      {/* Network Stats */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('dashboard.aggregator.networkActivity')}</h2>
        {loading ? (
          <SkeletonCard />
        ) : data ? (
          <div className={styles.quickActions}>
            <Card padding="md">
              <div className={styles.quickAction}>
                <Users size={24} style={{ color: 'var(--color-info)' }} />
                <strong style={{ fontSize: 'var(--text-h3)' }}>{data.network_statistics.activeHouseholds.toLocaleString()}</strong>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Households</span>
              </div>
            </Card>
            <Card padding="md">
              <div className={styles.quickAction}>
                <Truck size={24} style={{ color: 'var(--color-warning)' }} />
                <strong style={{ fontSize: 'var(--text-h3)' }}>{data.network_statistics.activeMerchants.toLocaleString()}</strong>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Merchants</span>
              </div>
            </Card>
            <Card padding="md">
              <div className={styles.quickAction}>
                <Factory size={24} style={{ color: 'var(--color-primary-hover)' }} />
                <strong style={{ fontSize: 'var(--text-h3)' }}>{data.network_statistics.connectedIndustries.toLocaleString()}</strong>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Industries</span>
              </div>
            </Card>
            <Card padding="md">
              <div className={styles.quickAction}>
                <Recycle size={24} style={{ color: 'var(--color-success)' }} />
                <strong style={{ fontSize: 'var(--text-h3)' }}>{data.network_statistics.recycledTons.toLocaleString()} T</strong>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Recycled</span>
              </div>
            </Card>
          </div>
        ) : null}
      </section>

      {/* Available Opportunities */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t('dashboard.aggregator.opportunities')}</h2>
          <Link to="/opportunities" className={styles.viewAll}>
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <SkeletonCard />
        ) : data && data.opportunities.length > 0 ? (
          <div className={styles.cardList}>
            {data.opportunities.map((opp) => (
              <Card key={opp.id} padding="md" hoverable>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-body)', fontWeight: 600 }}>{opp.title}</h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      Location: {opp.location} • Volume: {opp.quantity} {opp.unit}
                    </p>
                  </div>
                  <Link to="/opportunities">
                    <Button size="sm" icon={<Briefcase size={14} />}>
                      Explore
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState title="No opportunities yet" description="Available opportunities will be listed here." />
        )}
      </section>
    </div>
  );
}
