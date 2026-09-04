import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Eye, Calendar, MapPin } from 'lucide-react';
import { Card, Button, StatusBadge, SkeletonCard, EmptyState } from '@/components/common';
import { getIndustryRequests, getOffersForRequest, getScrapCategories } from '@/services';
import { useAuthStore } from '@/store/useAuthStore';
import type { IndustryRequest, ScrapCategory } from '@/types';
import styles from './MyRequests.module.css';

export default function MyRequests() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [requests, setRequests] = useState<IndustryRequest[]>([]);
  const [categories, setCategories] = useState<ScrapCategory[]>([]);
  const [offersMap, setOffersMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getIndustryRequests(user?.id || 'USR003'),
      getScrapCategories(),
    ]).then(async ([reqData, catData]) => {
      setRequests(reqData);
      setCategories(catData);

      // Load offers count for each request
      const counts: Record<string, number> = {};
      for (const req of reqData) {
        const offers = await getOffersForRequest(req.id);
        counts[req.id] = offers.length;
      }
      setOffersMap(counts);
      setLoading(false);
    });
  }, [user?.id]);

  const getCategory = (catId: string) => {
    return categories.find((c) => c.id === catId) || { name: 'Scrap Metal', icon: '🔩', unit: 'kg' };
  };

  return (
    <div className="page-enter">
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('dashboard.industry.activeRequests')}</h1>
          <p className={styles.subtitle}>Manage your posted scrap requirements and review private quotes</p>
        </div>
        <Link to="/post-requirement">
          <Button icon={<Plus size={16} />}>{t('dashboard.industry.postRequirement')}</Button>
        </Link>
      </div>

      <div className={styles.list}>
        {loading
          ? Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
          : requests.length > 0
          ? requests.map((req) => {
              const cat = getCategory(req.categoryId);
              const offersCount = offersMap[req.id] || 0;

              return (
                <Card key={req.id} padding="lg" className={styles.card}>
                  <div className={styles.topRow}>
                    <div className={styles.categoryWrap}>
                      <span className={styles.icon}>🔩</span>
                      <div>
                        <h3 className={styles.categoryName}>{req.title} ({cat.name})</h3>
                        <p className={styles.qty}>Quantity: <strong>{req.quantity.toLocaleString()} {req.unit}</strong></p>
                      </div>
                    </div>
                    <StatusBadge
                      status={req.status === 'open' ? 'info' : req.status === 'offers_received' ? 'success' : 'neutral'}
                      label={req.status.replace('_', ' ').toUpperCase()}
                    />
                  </div>

                  <p className={styles.desc}>{req.description}</p>

                  <div className={styles.metaRow}>
                    <div className={styles.metaItem}>
                      <MapPin size={14} /> {req.location.area}, {req.location.city}
                    </div>
                    <div className={styles.metaItem}>
                      <Calendar size={14} /> Preferred Pickup: {req.preferredPickupDate}
                    </div>
                  </div>

                  <div className={styles.bottomRow}>
                    <span className={styles.offersTag}>
                      {offersCount} Merchant Offer{offersCount === 1 ? '' : 's'} Received
                    </span>
                    {offersCount > 0 ? (
                      <Link to="/merchant-offers">
                        <Button size="sm" icon={<Eye size={14} />}>
                          Compare Offers ({offersCount})
                        </Button>
                      </Link>
                    ) : (
                      <Button size="sm" variant="secondary" disabled>
                        Waiting for Quotes
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })
          : <EmptyState title="No posted requirements" description="Post what scrap materials your industrial facility needs collected." />}
      </div>
    </div>
  );
}
