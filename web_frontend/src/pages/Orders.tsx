import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Calendar, MapPin } from 'lucide-react';
import { Card, StatusBadge, SkeletonCard, EmptyState } from '@/components/common';
import { getHouseholdOrders, getHouseholdTransactions } from '@/services';
import { useAuthStore } from '@/store/useAuthStore';
import type { HouseholdOrder, Transaction } from '@/types';

export default function Orders() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<HouseholdOrder[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getHouseholdOrders(user?.id || 'USR001'),
      getHouseholdTransactions(user?.id || 'USR001'),
    ]).then(([orderData, txnData]) => {
      setOrders(orderData);
      setTransactions(txnData);
      setLoading(false);
    });
  }, [user?.id]);

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-h2)', fontWeight: 700, marginBottom: '0.25rem' }}>{t('orders.title')}</h1>
        <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-muted)' }}>
          Track your scrap sale pickups and payment receipts
        </p>
      </div>

      {/* Orders List */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h2 style={{ fontSize: 'var(--text-h4)', fontWeight: 600 }}>Active & Recent Orders</h2>
        {loading ? (
          <SkeletonCard />
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <Card key={order.id} padding="md" hoverable>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--text-body)', fontWeight: 600 }}>
                    {order.items.map((i) => `${i.name} (${i.quantity} ${i.unit})`).join(', ')}
                  </h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                    <Calendar size={12} /> Scheduled: {order.pickup.date} ({order.pickup.timeSlot})
                  </p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={12} /> {order.pickup.address}
                  </p>
                </div>
                <StatusBadge
                  status={order.status === 'completed' ? 'success' : order.status === 'pickup_scheduled' ? 'info' : 'warning'}
                  label={order.status.replace('_', ' ').toUpperCase()}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-small)', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>Order #{order.id}</span>
                <strong style={{ color: 'var(--color-success)', fontSize: 'var(--text-body)' }}>₹{order.totalAmount}</strong>
              </div>
            </Card>
          ))
        ) : (
          <EmptyState
            icon={<ShoppingCart size={48} />}
            title={t('orders.empty')}
            description={t('orders.emptyDesc')}
          />
        )}
      </section>

      {/* Transaction History */}
      {transactions.length > 0 && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h2 style={{ fontSize: 'var(--text-h4)', fontWeight: 600 }}>Settlement & Payment History</h2>
          {transactions.map((txn) => (
            <Card key={txn.id} padding="sm">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-small)' }}>
                <div>
                  <strong>{txn.category} ({txn.quantity} {txn.unit})</strong>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    Paid on {txn.date} • Order Ref: {txn.orderId}
                  </p>
                </div>
                <StatusBadge status="success" label={`+ ₹${txn.amount.toLocaleString()}`} />
              </div>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
