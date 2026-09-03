import { useState, useMemo } from 'react';
import {
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Truck,
  IndianRupee,
  MapPin,
  Calendar,
  Printer,
  Scale,
  ShieldCheck,
  Eye,
  ChevronRight,
} from 'lucide-react';
import styles from './HouseholdHistory.module.css';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

interface OrderItemSummary {
  material: string;
  weightKg: number;
  ratePerKg: number;
  imageUrl: string;
}

interface OrderHistoryRecord {
  id: string;
  orderNumber: string;
  billSlipNumber: string;
  dateTime: string;
  itemsCount: number;
  totalWeightKg: number;
  items: OrderItemSummary[];
  amount: number;
  status: 'completed' | 'cancelled' | 'pending';
  paymentStatus: 'Paid' | 'COD' | 'Pending' | '-';
  paymentMethod: 'UPI' | 'Cash on Delivery' | 'Card' | '-';
  executiveName?: string;
  executivePhone?: string;
  pickupAddress?: string;
  cancellationReason?: string;
}

const HISTORY_DATA: OrderHistoryRecord[] = [
  {
    id: 'ord-1',
    orderNumber: 'SA123456',
    billSlipNumber: 'SLP-2025-05-SA123456',
    dateTime: '01 May 2025 • 10:30 AM',
    itemsCount: 3,
    totalWeightKg: 28.6,
    items: [
      { material: 'Copper Wire Scrap', weightKg: 2.2, ratePerKg: 720, imageUrl: '/scrap-copper-wire.jpg' },
      { material: 'Scrap Iron Rods', weightKg: 18.4, ratePerKg: 38.5, imageUrl: '/scrap-iron.png' },
      { material: 'Household Aluminium', weightKg: 8.0, ratePerKg: 135, imageUrl: '/scrap-household-aluminium.png' },
    ],
    amount: 2580.4,
    status: 'completed',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    executiveName: 'Murugan K. (Tata 407 • TN 09 BX 4421)',
    executivePhone: '+91 98401 23456',
    pickupAddress: 'No. 42, 2nd Main Road, Anna Nagar, Chennai - 600040',
  },
  {
    id: 'ord-2',
    orderNumber: 'SA123455',
    billSlipNumber: 'SLP-2025-04-SA123455',
    dateTime: '28 Apr 2025 • 04:15 PM',
    itemsCount: 3,
    totalWeightKg: 12.4,
    items: [
      { material: 'Scrap Iron Rods', weightKg: 8.4, ratePerKg: 38.5, imageUrl: '/scrap-iron.png' },
      { material: 'Brass Fittings & Taps', weightKg: 1.0, ratePerKg: 490, imageUrl: '/scrap-brass.jpg' },
      { material: 'Corrugated Cardboard', weightKg: 3.0, ratePerKg: 13, imageUrl: '/scrap-cardboard.png' },
    ],
    amount: 780.0,
    status: 'completed',
    paymentStatus: 'Paid',
    paymentMethod: 'Cash on Delivery',
    executiveName: 'Selva Kumar (Eco Logistics)',
    executivePhone: '+91 98840 99881',
    pickupAddress: 'No. 42, 2nd Main Road, Anna Nagar, Chennai - 600040',
  },
  {
    id: 'ord-3',
    orderNumber: 'SA123454',
    billSlipNumber: 'SLP-2025-04-SA123454',
    dateTime: '25 Apr 2025 • 11:20 AM',
    itemsCount: 2,
    totalWeightKg: 18.7,
    items: [
      { material: 'Bright Copper Coils', weightKg: 1.5, ratePerKg: 720, imageUrl: '/scrap-copper.jpg' },
      { material: 'Corrugated Cardboard', weightKg: 17.2, ratePerKg: 13, imageUrl: '/scrap-cardboard.png' },
    ],
    amount: 1303.6,
    status: 'completed',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    executiveName: 'Karthik Raja (Eco Van)',
    executivePhone: '+91 97910 54321',
    pickupAddress: 'No. 42, 2nd Main Road, Anna Nagar, Chennai - 600040',
  },
  {
    id: 'ord-4',
    orderNumber: 'SA123453',
    billSlipNumber: 'SLP-2025-04-SA123453',
    dateTime: '22 Apr 2025 • 09:05 AM',
    itemsCount: 3,
    totalWeightKg: 32.1,
    items: [
      { material: 'Household Aluminium', weightKg: 6.5, ratePerKg: 135, imageUrl: '/scrap-household-aluminium.png' },
      { material: 'Brass Scrap', weightKg: 1.8, ratePerKg: 490, imageUrl: '/scrap-brass.jpg' },
      { material: 'Old Newspapers', weightKg: 23.8, ratePerKg: 14, imageUrl: '/scrap-color-papers.png' },
    ],
    amount: 2092.7,
    status: 'completed',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    executiveName: 'Murugan (Tata 407)',
    executivePhone: '+91 98401 23456',
    pickupAddress: 'No. 42, 2nd Main Road, Anna Nagar, Chennai - 600040',
  },
  {
    id: 'ord-5',
    orderNumber: 'SA123452',
    billSlipNumber: 'SLP-2025-04-SA123452',
    dateTime: '18 Apr 2025 • 02:45 PM',
    itemsCount: 2,
    totalWeightKg: 8.3,
    items: [
      { material: 'Computer Motherboard / CPU', weightKg: 2.5, ratePerKg: 320, imageUrl: '/scrap-cpu.jpg' },
      { material: 'Copper Tubes', weightKg: 0.2, ratePerKg: 720, imageUrl: '/scrap-copper-wire.jpg' },
    ],
    amount: 944.0,
    status: 'cancelled',
    paymentStatus: '-',
    paymentMethod: '-',
    executiveName: 'Unassigned',
    pickupAddress: 'No. 42, 2nd Main Road, Anna Nagar, Chennai - 600040',
    cancellationReason: 'Material changed / already sold',
  },
];

export function HouseholdHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<OrderHistoryRecord | null>(null);

  // Prevent background scrolling when receipt modal is open
  useBodyScrollLock(Boolean(selectedOrder));

  // Filter Data
  const filteredData = useMemo(() => {
    return HISTORY_DATA.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((i) => i.material.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === 'ALL' ||
        order.status.toUpperCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const handlePrintReceipt = (order: OrderHistoryRecord) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - #${order.orderNumber}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 2.5rem; color: #0f172a; max-width: 700px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 1rem; margin-bottom: 1.5rem; }
          .brand { font-size: 1.5rem; font-weight: 900; color: #d97706; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; background: #f8fafc; padding: 1rem; border-radius: 8px; font-size: 0.85rem; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 0.85rem; }
          th, td { padding: 0.65rem 0.5rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
          th { background: #f1f5f9; font-weight: 800; }
          .total-box { display: flex; justify-content: space-between; align-items: center; background: #0f172a; color: #ffffff; padding: 1rem 1.25rem; border-radius: 8px; font-size: 1.1rem; font-weight: 900; }
          .footer { margin-top: 2rem; text-align: center; font-size: 0.75rem; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 1rem; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">BILL SCRAP</div>
            <div style="font-size: 0.8rem; color: #64748b;">Verified Doorstep Scrap Recycler • Chennai</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.1rem; font-weight: 900;">PICKUP RECEIPT</div>
            <div style="font-size: 0.8rem; font-weight: 700;">#${order.orderNumber}</div>
          </div>
        </div>

        <div class="meta-grid">
          <div>
            <div><strong>Date & Time:</strong> ${order.dateTime}</div>
            <div><strong>Pickup Address:</strong> ${order.pickupAddress}</div>
          </div>
          <div>
            <div><strong>Executive:</strong> ${order.executiveName || 'Verified Partner'}</div>
            <div><strong>Payment:</strong> ${order.paymentMethod} (${order.paymentStatus})</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Material</th>
              <th>Weighed Qty</th>
              <th>Rate / KG</th>
              <th style="text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(it => `
              <tr>
                <td><strong>${it.material}</strong></td>
                <td>${it.weightKg} KG</td>
                <td>₹${it.ratePerKg}</td>
                <td style="text-align: right; font-weight: 800;">₹${(it.weightKg * it.ratePerKg).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-box">
          <span>TOTAL PAYOUT RECEIVED:</span>
          <span style="color: #fbc21a;">₹${order.amount.toFixed(2)}</span>
        </div>

        <div class="footer">
          Digital Weighing Scale Certified & Verified. Support: +91 98401 23456
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className={styles.pageContainer}>
      {/* ===================================================================
         DESKTOP HISTORY VIEW (UNTOUCHED, PRESERVED 100%)
         =================================================================== */}
      <div className={styles.desktopHistoryView}>
        {/* 1. Header with Clock Icon */}
      <div className={styles.headerBlock}>
        <div className={styles.headerIconCircle}>
          <Clock size={24} />
        </div>
        <div className={styles.headerTitles}>
          <h1 className={styles.mainTitle}>History</h1>
          <p className={styles.mainSubtitle}>
            View all your past completed and cancelled doorstep scrap pickups.
          </p>
        </div>
      </div>

      {/* 2. Filter Tabs & Search Bar */}
      <div className={styles.filterBar}>
        {/* Status Pills: All, Completed, Cancelled */}
        <div className={styles.statusPillsRow}>
          {[
            { id: 'ALL', label: 'All Pickups' },
            { id: 'COMPLETED', label: 'Completed' },
            { id: 'CANCELLED', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.filterPillBtn} ${
                statusFilter === tab.id ? styles.filterPillActive : ''
              }`}
              onClick={() => setStatusFilter(tab.id as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className={styles.searchBoxWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by order ID or scrap material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className={styles.clearSearchBtn}
              onClick={() => setSearchTerm('')}
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* 3. History Cards Grid (Clean, human-readable cards) */}
      <div className={styles.historyCardsGrid}>
        {filteredData.map((order) => (
          <div
            key={order.id}
            className={styles.historyCard}
            onClick={() => setSelectedOrder(order)}
            role="button"
            tabIndex={0}
          >
            {/* Top Row: Date & Status */}
            <div className={styles.cardTopRow}>
              <div className={styles.dateCol}>
                <span className={styles.dateText}>{order.dateTime}</span>
                <span className={styles.orderIdBadge}>#{order.orderNumber}</span>
              </div>

              {order.status === 'completed' ? (
                <span className={styles.statusBadgeGreen}>
                  <CheckCircle2 size={13} />
                  <span>Completed</span>
                </span>
              ) : (
                <span className={styles.statusBadgeRed}>
                  <AlertCircle size={13} />
                  <span>Cancelled</span>
                </span>
              )}
            </div>

            {/* Middle: Scrap Items Thumbnails & List */}
            <div className={styles.itemsRow}>
              <div className={styles.thumbsStack}>
                {order.items.slice(0, 3).map((item, idx) => (
                  <img
                    key={idx}
                    src={item.imageUrl}
                    alt={item.material}
                    className={styles.itemThumbImg}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/household-scrap-bundle.jpg';
                    }}
                  />
                ))}
              </div>

              <div className={styles.itemsSummaryCol}>
                <span className={styles.materialsText}>
                  {order.items.map((i) => i.material).join(', ')}
                </span>
                <span className={styles.weightText}>
                  Total: {order.totalWeightKg} KG ({order.items.length} items)
                </span>
              </div>
            </div>

            {/* Bottom Row: Merchant & Amount */}
            <div className={styles.cardBottomRow}>
              <div className={styles.merchantCol}>
                <span className={styles.merchantLabel}>EXECUTIVE</span>
                <span className={styles.merchantName}>{order.executiveName || 'Assigned Driver'}</span>
              </div>

              <div className={styles.payoutCol}>
                <span className={styles.payoutLabel}>
                  {order.status === 'completed' ? 'PAYOUT RECEIVED' : 'ESTIMATE'}
                </span>
                <span className={styles.payoutAmount}>₹{order.amount.toFixed(2)}</span>
              </div>
            </div>

            <div className={styles.viewDetailsBtnRow}>
              <span>View Details & Receipt</span>
              <ChevronRight size={15} />
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className={styles.emptyState}>
          <Clock size={36} color="#94A3B8" />
          <h4 className={styles.emptyTitle}>No past pickups found</h4>
          <p className={styles.emptySubtitle}>
            {searchTerm
              ? `No orders match "${searchTerm}".`
              : 'You have no pickups in this filter category.'}
          </p>
          <button
            type="button"
            className={styles.resetFilterBtn}
            onClick={() => {
              setStatusFilter('ALL');
              setSearchTerm('');
            }}
          >
            Show All Pickups
          </button>
        </div>
      )}
      </div> {/* /.desktopHistoryView */}

      {/* ===================================================================
         MOBILE HISTORY VIEW (MOBILE-ONLY REFINED UI)
         =================================================================== */}
      <div className={styles.mobileHistoryView}>
        {/* 1. Compact Headline */}
        <div className={styles.mobileHeaderBlock}>
          <h1 className={styles.mobileMainTitle}>History</h1>
          <p className={styles.mobileMainSubtitle}>View your past scrap pickups.</p>
        </div>

        {/* 2. Filter Row: All, Completed, Cancelled */}
        <div className={styles.mobileFiltersRow}>
          {[
            { id: 'ALL', label: 'All' },
            { id: 'COMPLETED', label: 'Completed' },
            { id: 'CANCELLED', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.mobileFilterPillBtn} ${
                statusFilter === tab.id ? styles.mobileFilterPillActive : ''
              }`}
              onClick={() => setStatusFilter(tab.id as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 3. Full-width Search Bar */}
        <div className={styles.mobileSearchBoxWrap}>
          <Search size={16} className={styles.mobileSearchIcon} />
          <input
            type="text"
            className={styles.mobileSearchInput}
            placeholder="Search orders or scrap"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className={styles.mobileClearSearchBtn}
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* 4. History Cards List */}
        <div className={styles.mobileHistoryCardsList}>
          {filteredData.map((order) => (
            <div
              key={order.id}
              className={styles.mobileHistoryCard}
              onClick={() => setSelectedOrder(order)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedOrder(order)}
            >
              {/* Section 1: Top Row */}
              <div className={styles.mobileCardTopRow}>
                <div className={styles.mobileDateCol}>
                  <Calendar size={13} className={styles.mobileDateIcon} />
                  <span className={styles.mobileDateText}>{order.dateTime}</span>
                </div>
                <div className={styles.mobileTopRightBadges}>
                  <span className={styles.mobileOrderIdBadge}>#{order.orderNumber}</span>
                  {order.status === 'completed' ? (
                    <span className={styles.mobileStatusBadgeGreen}>
                      <CheckCircle2 size={11} />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <span className={styles.mobileStatusBadgeRed}>
                      <AlertCircle size={11} />
                      <span>Cancelled</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Section 2: Scrap Summary */}
              <div className={styles.mobileScrapSummaryRow}>
                <div className={styles.mobileThumbsGroup}>
                  {order.items.slice(0, 3).map((item, idx) => (
                    <img
                      key={idx}
                      src={item.imageUrl}
                      alt={item.material}
                      className={styles.mobileThumbImg}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/household-scrap-bundle.jpg';
                      }}
                    />
                  ))}
                </div>

                <div className={styles.mobileScrapTextCol}>
                  <h3 className={styles.mobileScrapMaterialsTitle}>
                    {order.items.map((i) => i.material).join(', ')}
                  </h3>
                  <div className={styles.mobileScrapMetricsRow}>
                    <span className={styles.mobileWeightText}>
                      Total: {order.totalWeightKg} kg
                    </span>
                    <span className={styles.mobileItemsCountText}>
                      ({order.items.length} {order.items.length === 1 ? 'item' : 'items'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 3: Executive Area */}
              <div className={styles.mobileExecutiveBox}>
                <div className={styles.mobileExecutiveLeft}>
                  <span className={styles.mobileExecutiveLabel}>EXECUTIVE</span>
                  <span className={styles.mobileExecutiveName}>
                    {order.executiveName || 'Assigned Driver'}
                  </span>
                </div>
                <div className={styles.mobilePayoutRight}>
                  <span className={styles.mobilePayoutLabel}>
                    {order.status === 'completed' ? 'PAYOUT' : 'ESTIMATE'}
                  </span>
                  <span className={styles.mobilePayoutAmount}>
                    ₹{order.amount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Section 4: Action */}
              <div className={styles.mobileCardActionRow}>
                <span className={styles.mobileViewDetailsText}>View Details</span>
                <ChevronRight size={15} className={styles.mobileChevronIcon} />
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className={styles.mobileEmptyState}>
            <Clock size={32} color="#94A3B8" />
            <h4 className={styles.mobileEmptyTitle}>No past pickups found</h4>
            <p className={styles.mobileEmptySubtitle}>
              {searchTerm
                ? `No pickups match "${searchTerm}".`
                : 'No orders found in this category.'}
            </p>
            <button
              type="button"
              className={styles.mobileResetFilterBtn}
              onClick={() => {
                setStatusFilter('ALL');
                setSearchTerm('');
              }}
            >
              Show All
            </button>
          </div>
        )}
      </div>

      {/* 4. DETAIL RECEIPT MODAL */}
      {selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <span className={styles.modalOrderBadge}>#{selectedOrder.orderNumber}</span>
                <h3 className={styles.modalTitle}>Pickup Summary & Receipt</h3>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setSelectedOrder(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Status Banner */}
              <div
                className={
                  selectedOrder.status === 'completed'
                    ? styles.modalSuccessBanner
                    : styles.modalCancelledBanner
                }
              >
                {selectedOrder.status === 'completed' ? (
                  <>
                    <CheckCircle2 size={18} color="#059669" />
                    <span>Pickup completed on {selectedOrder.dateTime}. Spot payment paid via {selectedOrder.paymentMethod}.</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={18} color="#DC2626" />
                    <span>Pickup cancelled ({selectedOrder.cancellationReason || 'Cancelled'}).</span>
                  </>
                )}
              </div>

              {/* Order Meta Box */}
              <div className={styles.modalMetaGrid}>
                <div>
                  <span className={styles.metaLabel}>EXECUTIVE / MERCHANT</span>
                  <strong className={styles.metaValue}>{selectedOrder.executiveName}</strong>
                </div>
                <div>
                  <span className={styles.metaLabel}>PICKUP LOCATION</span>
                  <strong className={styles.metaValue}>{selectedOrder.pickupAddress}</strong>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div className={styles.itemsTableWrap}>
                <h4 className={styles.breakdownHeading}>Scrap Materials Weighed</h4>
                <table className={styles.receiptTable}>
                  <thead>
                    <tr>
                      <th style={{ width: '42%' }}>Material</th>
                      <th style={{ width: '20%' }}>Qty</th>
                      <th style={{ width: '18%' }}>Rate</th>
                      <th style={{ width: '20%', textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 700 }}>{item.material}</td>
                        <td>{item.weightKg} KG</td>
                        <td>₹{item.ratePerKg}</td>
                        <td style={{ textAlign: 'right', fontWeight: 800, color: '#059669' }}>
                          ₹{(item.weightKg * item.ratePerKg).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Payout Summary Box */}
              <div className={styles.modalTotalBox}>
                <div>
                  <span className={styles.totalBoxLabel}>Total Payout</span>
                  <span className={styles.totalBoxSubtext}>Payment Status: {selectedOrder.paymentStatus}</span>
                </div>
                <span className={styles.totalBoxAmount}>₹{selectedOrder.amount.toFixed(2)}</span>
              </div>

              <div className={styles.modalScaleTrust}>
                <ShieldCheck size={16} color="#15803D" />
                <span>Verified digital scale weighing recorded at customer doorstep.</span>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.printReceiptBtn}
                onClick={() => handlePrintReceipt(selectedOrder)}
              >
                <Printer size={15} />
                <span>Print / Save Receipt</span>
              </button>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HouseholdHistory;
