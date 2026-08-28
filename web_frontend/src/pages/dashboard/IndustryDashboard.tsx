import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PackagePlus, ArrowRight, Eye, MapPin } from 'lucide-react';
import { Button, Card, StatusBadge, SkeletonCard, EmptyState } from '@/components/common';
import { useAuthStore } from '@/store/useAuthStore';
import { getIndustryRequests } from '@/services';
import type { IndustryRequest } from '@/types';
import styles from './Dashboard.module.css';

export default function IndustryDashboard() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [requests, setRequests] = useState<IndustryRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getIndustryRequests(user?.id || 'USR003').then((data) => {
      setRequests(data);
      setLoading(false);
    });
  }, [user?.id]);

  return (
    <div className={`page-enter ${styles.dashboard}`}>
      <section className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>{t('dashboard.welcome')}, {user?.name?.split(' ')[0]} 👋</h1>
        <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-muted)' }}>
          {user?.name} • {user?.location.area}, {user?.location.city}
        </p>
      </section>

      {/* Post Requirement CTA */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('dashboard.industry.postRequirement')}</h2>
        <Card padding="md">
          <p style={{ marginBottom: '1rem', color: 'var(--color-text-muted)', fontSize: 'var(--text-small)' }}>
            Post your scrap requirements and receive private offers from verified merchants across Chennai.
          </p>
          <Link to="/post-requirement">
            <Button icon={<PackagePlus size={16} />}>{t('dashboard.industry.postRequirement')}</Button>
          </Link>
        </Card>
      </section>

      {/* Active Requests */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t('dashboard.industry.activeRequests')}</h2>
          <Link to="/my-requests" className={styles.viewAll}>{t('common.viewAll')} <ArrowRight size={14} /></Link>
        </div>

        {loading ? (
          <SkeletonCard />
        ) : requests.length > 0 ? (
          <div className={styles.cardList}>
            {requests.map((req) => (
              <Card key={req.id} padding="md" hoverable>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-body)', fontWeight: 600 }}>{req.title}</h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      Quantity: <strong>{req.quantity} {req.unit}</strong> • Pickup: {req.preferredPickupDate}
                    </p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {req.location.area}, {req.location.city}
                    </p>
                  </div>
                  <StatusBadge
                    status={req.status === 'open' ? 'info' : req.status === 'offers_received' ? 'success' : 'neutral'}
                    label={req.status.replace('_', ' ').toUpperCase()}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
                  <Link to="/merchant-offers">
                    <Button size="sm" variant="secondary" icon={<Eye size={14} />}>
                      Review Offers
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState title="No active requests" description="Post a scrap requirement to get started." />
        )}
      </section>
    </div>
  );
}
