import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, Check, Send } from 'lucide-react';
import { Card, Button, Input, SkeletonCard, EmptyState } from '@/components/common';
import { getNearbyIndustryRequests, submitMerchantOffer, getDb } from '@/services';
import { useAuthStore } from '@/store/useAuthStore';
import type { IndustryRequest } from '@/types';
import styles from './Opportunities.module.css';

export default function Opportunities() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [opportunities, setOpportunities] = useState<IndustryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState<IndustryRequest | null>(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00 AM - 12:00 PM');
  const [notes, setNotes] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  useEffect(() => {
    getNearbyIndustryRequests().then((data) => {
      setOpportunities(data);
      setLoading(false);
    });
  }, []);

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq || !quotePrice) return;

    await submitMerchantOffer({
      requestId: selectedReq.id,
      merchantId: user?.id || 'USR002',
      pricePerUnit: Number(quotePrice),
      unit: selectedReq.unit,
      totalAmount: Number(quotePrice) * selectedReq.quantity,
      pickupDate: pickupDate || selectedReq.preferredPickupDate,
      pickupTime: pickupTime || '10:00 AM - 12:00 PM',
      distanceKm: 5.5,
      message: notes,
    });

    setSubmittedId(selectedReq.id);
    setSelectedReq(null);
    setQuotePrice('');
    setNotes('');
  };

  const getIndustryName = (industryId: string) => {
    const db = getDb();
    const ind = db.users.find((u) => u.id === industryId);
    return ind ? ind.name : 'Chennai Engineering Industries';
  };

  return (
    <div className="page-enter">
      <div className={styles.header}>
        <h1 className={styles.title}>{t('dashboard.aggregator.opportunities')}</h1>
        <p className={styles.subtitle}>Open bulk scrap requirements from industrial facilities across Tamil Nadu</p>
      </div>

      {submittedId && (
        <div className={styles.successBanner}>
          <Check size={18} /> Offer quote sent to industrial buyer! They will review in their private portal.
        </div>
      )}

      <div className={styles.grid}>
        {loading
          ? Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
          : opportunities.length > 0
          ? opportunities.map((opp) => (
              <Card key={opp.id} padding="lg" hoverable className={styles.oppCard}>
                <div className={styles.oppTop}>
                  <div className={styles.catWrap}>
                    <span className={styles.icon}>🔩</span>
                    <div>
                      <h3 className={styles.catName}>{opp.title}</h3>
                      <p className={styles.company}>{getIndustryName(opp.industryId)}</p>
                    </div>
                  </div>
                  <div className={styles.reqBadge}>{opp.quantity.toLocaleString()} {opp.unit}</div>
                </div>

                <p className={styles.desc}>{opp.description}</p>

                <div className={styles.metaRow}>
                  <span className={styles.meta}><MapPin size={14} /> {opp.location.area}, {opp.location.city}</span>
                  <span className={styles.meta}><Calendar size={14} /> Pickup: {opp.preferredPickupDate}</span>
                </div>

                <div className={styles.bottomRow}>
                  <span className={styles.bidsText}>Sealed Private Quoting</span>
                  <Button size="sm" icon={<Send size={14} />} onClick={() => setSelectedReq(opp)}>
                    Submit Quote
                  </Button>
                </div>
              </Card>
            ))
          : <EmptyState title="No active bulk opportunities" description="Check back soon for new high-tonnage industrial requisitions." />}
      </div>

      {/* Quote Modal */}
      {selectedReq && (
        <div className={styles.modalOverlay} onClick={() => setSelectedReq(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Submit Quote for {selectedReq.title}</h2>
            <p className={styles.modalSub}>Buyer: {getIndustryName(selectedReq.industryId)} ({selectedReq.quantity.toLocaleString()} {selectedReq.unit})</p>
            <form onSubmit={handleQuoteSubmit} className={styles.form}>
              <Input
                label="Offer Price per kg (₹)"
                type="number"
                step="0.5"
                placeholder="e.g. 45"
                value={quotePrice}
                onChange={(e) => setQuotePrice(e.target.value)}
                required
              />
              <Input
                label="Earliest Pickup Date"
                type="date"
                value={pickupDate || selectedReq.preferredPickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                required
              />
              <Input
                label="Pickup Time Slot"
                placeholder="e.g. 09:00 AM - 11:00 AM"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
              />
              <Input
                label="Notes / Logistics Details"
                placeholder="e.g. Clean sorted scrap with weighbridge slips..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <div className={styles.modalActions}>
                <Button type="button" variant="secondary" onClick={() => setSelectedReq(null)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Send Private Quote
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
