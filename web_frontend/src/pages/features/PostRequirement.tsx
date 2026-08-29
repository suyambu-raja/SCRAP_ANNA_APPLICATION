import { useEffect, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '@/components/common';
import { Check, ShieldCheck } from 'lucide-react';
import { getScrapCategories, createIndustryRequest } from '@/services';
import { useAuthStore } from '@/store/useAuthStore';
import type { ScrapCategory } from '@/types';
import styles from './Features.module.css';

export default function PostRequirement() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [categories, setCategories] = useState<ScrapCategory[]>([]);
  const [selectedCat, setSelectedCat] = useState<ScrapCategory | null>(null);
  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState('');
  const [deadline, setDeadline] = useState(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getScrapCategories().then((cats) => {
      setCategories(cats);
      if (cats.length > 0) {
        setSelectedCat(cats[0]);
        setTitle(`Industrial ${cats[0].name} Scrap`);
      }
    });
  }, []);

  const handleSelectCat = (cat: ScrapCategory) => {
    setSelectedCat(cat);
    if (!title || title.startsWith('Industrial')) {
      setTitle(`Industrial ${cat.name} Scrap`);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCat || !quantity) return;

    setLoading(true);
    try {
      await createIndustryRequest({
        industryId: user?.id || 'USR003',
        title: title || `${selectedCat.name} Requirement`,
        categoryId: selectedCat.id,
        description: description || `Looking for ${quantity} ${selectedCat.unit} of sorted ${selectedCat.name}.`,
        quantity: Number(quantity),
        unit: selectedCat.unit,
        area: user?.location.area || 'Guindy Industrial Estate',
        city: user?.location.city || 'Chennai',
        pincode: user?.location.pincode || '600032',
        preferredPickupDate: deadline,
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
        <h2 style={{ marginBottom: '0.5rem' }}>Requirement Posted!</h2>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: 420, margin: '0 auto 1.5rem' }}>
          Nearby verified scrap merchants will receive notifications and submit private quotes directly to your portal.
        </p>
        <Button onClick={() => setSubmitted(false)}>Post Another Requirement</Button>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <h1 className={styles.pageTitle}>{t('features.postRequirement.title')}</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>{t('features.postRequirement.scrapType')}</label>
          <div className={styles.chipGrid}>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                className={[styles.chip, selectedCat?.id === c.id ? styles.chipActive : ''].join(' ')}
                onClick={() => handleSelectCat(c)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Requirement Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Mixed Iron Scrap"
          required
        />

        <Input
          label={t('features.postRequirement.quantity')}
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="e.g., 850 kg"
          required
        />

        <Input
          label={t('features.postRequirement.deadline')}
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />

        <Input
          label={t('features.postRequirement.description')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Material specifications, purity, packaging..."
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', padding: '0.5rem 0' }}>
          <ShieldCheck size={16} style={{ color: 'var(--color-primary-hover)' }} />
          <span>{t('features.merchantOffers.private')}</span>
        </div>

        <Button type="submit" fullWidth loading={loading}>
          {t('features.postRequirement.post')}
        </Button>
      </form>
    </div>
  );
}
