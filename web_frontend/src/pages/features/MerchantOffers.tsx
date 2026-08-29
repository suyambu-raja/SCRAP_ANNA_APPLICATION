import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Check, X, Calendar, MapPin } from 'lucide-react';
import { Card, Button, StatusBadge, SkeletonCard, EmptyState } from '@/components/common';
import { getOffersForRequest, acceptOffer, rejectOffer, getDb } from '@/services';
import type { MerchantOffer } from '@/types';
import styles from './MerchantOffers.module.css';

export default function MerchantOffers() {
  const { t } = useTranslation();
  const [offers, setOffers] = useState<MerchantOffer[]>([]);
  const [loading, setLoading] = useState(true);

  const db = getDb();
  const activeReq = db.industry_requests.find((r) => r.id === 'REQ001') || db.industry_requests[0];

  useEffect(() => {
    if (activeReq) {
      getOffersForRequest(activeReq.id).then((data) => {
        setOffers(data);
        setLoading(false);
      });
    }
  }, [activeReq]);

  const handleAccept = async (offerId: string) => {
    if (!activeReq) return;
    await acceptOffer(offerId, activeReq.id);
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'accepted' } : { ...o, status: 'rejected' }))
    );
  };

  const handleReject = async (offerId: string) => {
    await rejectOffer(offerId);
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'rejected' } : o))
    );
  };

  const getMerchantName = (merchantId: string) => {
    const user = db.users.find((u) => u.id === merchantId);
    return user ? user.name : merchantId === 'MERCHANT002' ? 'Kovai Metal Recyclers' : 'Verified Merchant';
  };

  return (
    <div className="page-enter">
      <div className={styles.header}>
        <h1 className={styles.title}>{t('features.merchantOffers.title')}</h1>
        <p className={styles.privacyNotice}>
          <ShieldCheck size={16} /> {t('features.merchantOffers.private')}
        </p>
      </div>

      {activeReq && (
        <div className={styles.requestContext}>
          <span className={styles.contextLabel}>Requirement:</span>
          <strong>{activeReq.quantity.toLocaleString()} {activeReq.unit} {activeReq.title}</strong> ({activeReq.location.area}, {activeReq.location.city})
        </div>
      )}

      <div className={styles.list}>
        {loading
          ? Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
          : offers.length > 0
          ? offers.map((offer) => (
              <Card key={offer.id} padding="lg" className={styles.offerCard}>
                <div className={styles.offerTop}>
                  <div>
                    <h3 className={styles.merchantName}>{getMerchantName(offer.merchantId)}</h3>
                    <span className={styles.date}>Submitted: {new Date(offer.createdAt).toLocaleDateString()}</span>
                  </div>
                  <StatusBadge
                    status={
                      offer.status === 'accepted'
                        ? 'success'
                        : offer.status === 'rejected'
                        ? 'error'
                        : 'warning'
                    }
                    label={offer.status.toUpperCase()}
                  />
                </div>

                <div className={styles.priceBreakdown}>
                  <div className={styles.metric}>
                    <span className={styles.metricLabel}>Offer Price</span>
                    <span className={styles.metricValue}>₹{offer.pricePerUnit} / {offer.unit}</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.metricLabel}>Distance</span>
                    <span className={styles.metricValue}><MapPin size={12} style={{ display: 'inline' }} /> {offer.distanceKm} km</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.metricLabel}>Total Quote Value</span>
                    <span className={styles.metricValueTotal}>₹{offer.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {offer.message && (
                  <p className={styles.notes}>
                    <strong>Note:</strong> {offer.message}
                  </p>
                )}

                <div className={styles.pickupDate}>
                  <Calendar size={14} /> Pickup slot: <strong>{offer.pickupDate} ({offer.pickupTime})</strong>
                </div>

                {offer.status === 'pending' && (
                  <div className={styles.actions}>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<X size={14} />}
                      onClick={() => handleReject(offer.id)}
                    >
                      {t('features.merchantOffers.reject')}
                    </Button>
                    <Button
                      size="sm"
                      icon={<Check size={14} />}
                      onClick={() => handleAccept(offer.id)}
                    >
                      {t('features.merchantOffers.accept')}
                    </Button>
                  </div>
                )}

                {offer.status === 'accepted' && (
                  <div className={styles.acceptedTag}>
                    <Check size={16} /> Offer Accepted! Contract generated and sent to merchant.
                  </div>
                )}
              </Card>
            ))
          : <EmptyState title="No offers received yet" description="Merchants will review your specification and submit private quotes." />}
      </div>
    </div>
  );
}
