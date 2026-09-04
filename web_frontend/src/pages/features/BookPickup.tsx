import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '@/components/common';
import { Check } from 'lucide-react';
import { createHouseholdOrder } from '@/services';
import { useAuthStore } from '@/store/useAuthStore';
import styles from './Features.module.css';

export default function BookPickup() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [date, setDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [address, setAddress] = useState(user ? `${user.location.area}, ${user.location.city}` : '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const slots = ['09:00 AM - 11:00 AM', '10:00 AM - 12:00 PM', '02:00 PM - 04:00 PM', '04:00 PM - 06:00 PM'];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!date || !address) return;

    setLoading(true);
    try {
      await createHouseholdOrder({
        userId: user?.id || 'USR001',
        categoryId: 'CAT_IRON',
        categoryName: 'General Recyclables / Scrap Pickup',
        quantity: 1,
        unit: 'lot',
        estimatedAmount: 250,
        pickupDate: date,
        timeSlot: timeSlot || '10:00 AM - 12:00 PM',
        address,
      });
      setSubmitted(true);
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="page-enter" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-success)' }}>
          <Check size={48} style={{ margin: '0 auto' }} />
        </div>
        <h2 style={{ marginBottom: '0.5rem' }}>Doorstep Pickup Scheduled!</h2>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: 400, margin: '0 auto 1.5rem' }}>
          Pickup scheduled for {date} during {timeSlot}. A verified local agent will call you prior to arrival.
        </p>
        <Button onClick={() => setSubmitted(false)}>Book Another Pickup</Button>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <h1 className={styles.pageTitle}>{t('features.bookPickup.title')}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label={t('features.bookPickup.date')}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <div className={styles.field}>
          <label className={styles.label}>{t('features.bookPickup.timeSlot')}</label>
          <div className={styles.timeSlots}>
            {slots.map((s) => (
              <button
                key={s}
                type="button"
                className={[styles.chip, timeSlot === s ? styles.chipActive : ''].join(' ')}
                onClick={() => setTimeSlot(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <Input
          label={t('features.bookPickup.address')}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Pickup address in Chennai"
          required
        />
        <Input
          label={t('features.bookPickup.notes')}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Landmark or special instructions..."
        />
        <Button type="submit" fullWidth loading={loading}>
          {t('features.bookPickup.confirm')}
        </Button>
      </form>
    </div>
  );
}
