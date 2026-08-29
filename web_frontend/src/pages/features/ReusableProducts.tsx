import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Plus, Check } from 'lucide-react';
import { Card, Button, Input, SkeletonCard, EmptyState } from '@/components/common';
import { getReusableProducts, createReusableProduct, getDb } from '@/services';
import { useAuthStore } from '@/store/useAuthStore';
import type { ReusableProduct } from '@/types';
import styles from './ReusableProducts.module.css';

export default function ReusableProducts() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [products, setProducts] = useState<ReusableProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [form, setForm] = useState({
    title: '',
    category: 'Industrial Parts',
    condition: 'Good',
    price: '',
    quantity: '1',
    area: user?.location.area || 'Ambattur',
    description: '',
  });

  useEffect(() => {
    getReusableProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.price) return;

    const created = await createReusableProduct({
      merchantId: user?.id || 'USR002',
      title: form.title,
      category: form.category,
      condition: form.condition,
      price: Number(form.price),
      quantity: Number(form.quantity) || 1,
      unit: 'units',
      negotiable: true,
      area: form.area,
      city: 'Chennai',
      state: 'Tamil Nadu',
      description: form.description,
    });

    setProducts((prev) => [created, ...prev]);
    setShowAddModal(false);
    setSavedSuccess(true);
    setForm({
      title: '',
      category: 'Industrial Parts',
      condition: 'Good',
      price: '',
      quantity: '1',
      area: user?.location.area || 'Ambattur',
      description: '',
    });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const getMerchantName = (merchantId: string) => {
    const db = getDb();
    const u = db.users.find((user) => user.id === merchantId);
    return u ? u.name : merchantId === 'MERCHANT002' ? 'Ravi Metals' : 'Local Merchant';
  };

  return (
    <div className="page-enter">
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>{t('features.reusableProducts.title')}</h1>
          <p className={styles.subtitle}>Browse second-hand items and refurbished inventory across Chennai</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setShowAddModal(true)}>
          {t('features.reusableProducts.addNew')}
        </Button>
      </div>

      {savedSuccess && (
        <div className={styles.successNotice}>
          <Check size={18} /> Product successfully added to marketplace!
        </div>
      )}

      {/* Grid */}
      <div className={styles.grid}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : products.length > 0
          ? products.map((prod) => (
              <Card key={prod.id} padding="md" hoverable className={styles.prodCard}>
                <div className={styles.prodHeader}>
                  <span className={styles.badge}>{prod.condition}</span>
                  <span className={styles.category}>{prod.category}</span>
                </div>
                <h3 className={styles.prodTitle}>{prod.title}</h3>
                <p className={styles.prodDesc}>{prod.description}</p>
                <div className={styles.prodMeta}>
                  <div className={styles.price}>₹{prod.price.toLocaleString()}</div>
                  <div className={styles.location}>
                    <MapPin size={14} /> {prod.location.area}, {prod.location.city}
                  </div>
                </div>
                <div className={styles.merchantRow}>
                  <span className={styles.merchantName}>Merchant: {getMerchantName(prod.merchantId)}</span>
                  <span className={styles.qty}>Qty: {prod.quantity} {prod.unit}</span>
                </div>
              </Card>
            ))
          : <EmptyState title="No reusable products found" description="List your refurbished goods to start selling." />}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Add Reusable Product</h2>
            <form onSubmit={handleCreate} className={styles.modalForm}>
              <Input
                label="Product Title"
                placeholder="e.g. Used Industrial Motor or Steel Gate"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <div className={styles.formRow}>
                <Input
                  label="Category"
                  placeholder="e.g. Industrial Parts"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                />
                <Input
                  label="Condition"
                  placeholder="e.g. Good / Fair / Like New"
                  value={form.condition}
                  onChange={(e) => setForm({ ...form, condition: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formRow}>
                <Input
                  label="Price (₹)"
                  type="number"
                  placeholder="e.g. 8500"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
                <Input
                  label="Quantity"
                  type="number"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Location Area in Chennai"
                placeholder="e.g. Ambattur / Guindy"
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                required
              />
              <Input
                label="Description"
                placeholder="Describe item condition, dimensions, material..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <div className={styles.modalActions}>
                <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Publish Item
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
