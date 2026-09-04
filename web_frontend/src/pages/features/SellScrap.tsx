import { useEffect, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '@/components/common';
import { Camera, Check } from 'lucide-react';
import { getScrapCategories, createHouseholdOrder } from '@/services';
import { useAuthStore } from '@/store/useAuthStore';
import type { ScrapCategory } from '@/types';
import styles from './Features.module.css';

export default function SellScrap() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [categories, setCategories] = useState<ScrapCategory[]>([]);
  const [selectedCat, setSelectedCat] = useState<ScrapCategory | null>(null);
  const [weight, setWeight] = useState('');
  const [location, setLocation] = useState(user ? `${user.location.area}, ${user.location.city}` : '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getScrapCategories().then((cats) => {
      setCategories(cats);
      if (cats.length > 0) setSelectedCat(cats[0]);
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCat || !weight) return;

    setLoading(true);
    try {
      await createHouseholdOrder({
        userId: user?.id || 'USR001',
        categoryId: selectedCat.id,
        categoryName: selectedCat.name,
        quantity: Number(weight),
        unit: selectedCat.unit,
        estimatedAmount: Number(weight) * 40, // Base estimated rate
        pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        timeSlot: '10:00 AM - 12:00 PM',
        address: location || 'Guindy, Chennai',
      });
      setSubmitted(true);
    } catch {
      // Handle error
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
        <h2 style={{ marginBottom: '0.5rem' }}>Scrap Sale Order Created!</h2>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: 400, margin: '0 auto 1.5rem' }}>
          Your {selectedCat?.name} sale request ({weight} {selectedCat?.unit}) has been dispatched to local verified scrap merchants.
        </p>
        <Button onClick={() => setSubmitted(false)}>Sell More Scrap</Button>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <h1 className={styles.pageTitle}>{t('features.sellScrap.title')}</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>{t('features.sellScrap.category')}</label>
          <div className={styles.chipGrid}>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                className={[styles.chip, selectedCat?.id === c.id ? styles.chipActive : ''].join(' ')}
                onClick={() => setSelectedCat(c)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <Input
          label={t('features.sellScrap.weight')}
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="e.g., 50 kg"
          required
        />
        <Input
          label={t('features.sellScrap.location')}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Your pickup address in Chennai"
          required
        />

        <div className={styles.field}>
          <label className={styles.label}>{t('features.sellScrap.photos')}</label>
          <button type="button" className={styles.photoBtn}>
            <Camera size={20} />
            <span>Add Photos (Optional)</span>
          </button>
        </div>

        <Input
          label={t('features.sellScrap.notes')}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any notes for pickup agent..."
        />

        <Button type="submit" fullWidth loading={loading}>
          {t('features.sellScrap.submit')}
        </Button>
      </form>
    </div>
  );
}
