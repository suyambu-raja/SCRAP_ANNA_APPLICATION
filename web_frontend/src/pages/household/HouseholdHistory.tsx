import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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
  ChevronRight,
  ArrowLeft,
  LifeBuoy,
  Receipt,
} from 'lucide-react';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import styles from './HouseholdHistory.module.css';

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
    amount: 3372,
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
    amount: 852,
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
    amount: 1304,
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
    amount: 2093,
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
    amount: 944,
    status: 'cancelled',
    paymentStatus: '-',
    paymentMethod: '-',
    executiveName: 'Unassigned',
    pickupAddress: 'No. 42, 2nd Main Road, Anna Nagar, Chennai - 600040',
    cancellationReason: 'Material changed / already sold',
  },
];

const getShortMaterialName = (fullName: string): string => {
  if (!fullName) return '';
  const lower = fullName.toLowerCase();
  if (lower.includes('copper')) return 'Copper';
  if (lower.includes('iron')) return 'Iron';
  if (lower.includes('aluminium')) return 'Aluminium';
  if (lower.includes('brass')) return 'Brass';
  if (lower.includes('cardboard')) return 'Cardboard';
  if (lower.includes('newspaper') || lower.includes('paper')) return 'Newspaper';
  if (lower.includes('cpu') || lower.includes('motherboard')) return 'CPU/Board';
  return (
    fullName
      .replace(/\bscrap\b/gi, '')
      .replace(/\bhousehold\b/gi, '')
      .trim() || fullName
  );
};

const formatAmount = (val: number): string => {
  if (val == null || isNaN(val)) return '0';
  return Math.round(val).toString();
};

export function HouseholdHistory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [showBillModal, setShowBillModal] = useState(false);

  // Freeze background scrolling whenever the separate Bill & Receipt modal is open
  useBodyScrollLock(showBillModal);

  // Active selected order if viewing full order details
  const selectedOrder = useMemo(() => {
    if (!orderId) return null;
    return HISTORY_DATA.find((o) => o.id === orderId || o.orderNumber === orderId) || null;
  }, [orderId]);

  // Filter Data for the compact list
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

  const handleSelectOrder = (id: string) => {
    setSearchParams({ orderId: id });
    setShowBillModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setShowBillModal(false);
    setSearchParams({});
  };

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
                <td style="text-align: right; font-weight: 800;">₹${formatAmount(it.weightKg * it.ratePerKg)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-box">
          <span>TOTAL PAYOUT RECEIVED:</span>
          <span style="color: #fbc21a;">₹${formatAmount(order.amount)}</span>
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
      {/* ====================================================================
          VIEW 1: FULL ORDER DETAILS PAGE (WHEN AN ORDER IS SELECTED)
          ==================================================================== */}
      {selectedOrder ? (
        <div className={styles.detailsViewContainer}>
          {/* Top Bar Navigation */}
          <div className={styles.detailsTopBar}>
            <button
              type="button"
              className={styles.backToListBtn}
              onClick={handleBackToList}
            >
              <ArrowLeft size={18} />
              <span>Back to History</span>
            </button>
            <button
              type="button"
              className={styles.printReceiptBtn}
              onClick={() => setShowBillModal(true)}
            >
              <Receipt size={15} />
              <span>View Bill & Receipt</span>
            </button>
          </div>

          {/* 1. Order Identity & Status Banner */}
          <section className={styles.detailsHeaderCard}>
            <div className={styles.detailsHeaderMain}>
              <div className={styles.detailsHeaderLeft}>
                <div className={styles.detailsTitleRow}>
                  <h1 className={styles.detailsOrderNumber}>Order #{selectedOrder.orderNumber}</h1>
                  {selectedOrder.status === 'completed' ? (
                    <span className={styles.statusBadgeCompleted}>
                      <CheckCircle2 size={12} />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <span className={styles.statusBadgeCancelled}>
                      <AlertCircle size={12} />
                      <span>Cancelled</span>
                    </span>
                  )}
                </div>
                <div className={styles.detailsMetaSubrow}>
                  <Calendar size={13} className={styles.detailsMetaIcon} />
                  <span>{selectedOrder.dateTime}</span>
                  <span className={styles.detailsDotDivider}>•</span>
                  <span className={styles.billSlipTag}>{selectedOrder.billSlipNumber}</span>
                </div>
              </div>
            </div>

            {/* Contextual Status Banner */}
            <div
              className={
                selectedOrder.status === 'completed'
                  ? styles.statusBannerGreen
                  : styles.statusBannerRed
              }
            >
              {selectedOrder.status === 'completed' ? (
                <>
                  <CheckCircle2 size={16} className={styles.statusBannerIcon} />
                  <span>
                    Pickup completed at doorstep. Payout settled via {selectedOrder.paymentMethod}.
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} className={styles.statusBannerIcon} />
                  <span>
                    Order cancelled: {selectedOrder.cancellationReason || 'Cancelled by user'}.
                  </span>
                </>
              )}
            </div>
          </section>

          {/* 2. Executive & Pickup Location Cards */}
          <div className={styles.metaCardsGrid}>
            <section className={styles.metaCard}>
              <div className={styles.metaCardHeader}>
                <Truck size={17} className={styles.metaCardIcon} />
                <h3 className={styles.metaCardHeading}>Pickup Executive</h3>
              </div>
              <div className={styles.metaCardBody}>
                <p className={styles.metaPrimaryText}>
                  {selectedOrder.executiveName || 'Assigned Doorstep Executive'}
                </p>
                {selectedOrder.executivePhone && (
                  <p className={styles.metaSubText}>Contact: {selectedOrder.executivePhone}</p>
                )}
              </div>
            </section>

            <section className={styles.metaCard}>
              <div className={styles.metaCardHeader}>
                <MapPin size={17} className={styles.metaCardIcon} />
                <h3 className={styles.metaCardHeading}>Pickup Address</h3>
              </div>
              <div className={styles.metaCardBody}>
                <p className={styles.metaPrimaryText}>
                  {selectedOrder.pickupAddress || 'Customer Doorstep Address'}
                </p>
              </div>
            </section>
          </div>

          {/* 3. PROMPT CARD: View Bill & Payment Settlement */}
          <section className={styles.billPromptCard}>
            <div className={styles.billPromptContent}>
              <div className={styles.billPromptLeft}>
                <div className={styles.billPromptIconWrap}>
                  <Receipt size={24} className={styles.billPromptIcon} />
                </div>
                <div className={styles.billPromptTexts}>
                  <span className={styles.billPromptBadge}>FINAL SETTLEMENT BILL</span>
                  <h2 className={styles.billPromptTitle}>Pickup Bill & Scrap Breakdown</h2>
                  <p className={styles.billPromptMeta}>
                    {selectedOrder.items.length} materials weighed • Total: {selectedOrder.totalWeightKg} kg
                  </p>
                </div>
              </div>

              <div className={styles.billPromptRight}>
                <div className={styles.billPromptAmountBlock}>
                  <span className={styles.billPromptAmountLabel}>
                    {selectedOrder.status === 'completed' ? 'Total Payout Received' : 'Estimated Payout'}
                  </span>
                  <span className={styles.billPromptAmountValue}>₹{formatAmount(selectedOrder.amount)}</span>
                  <span className={styles.billPromptPayMethod}>Paid via {selectedOrder.paymentMethod}</span>
                </div>

                <button
                  type="button"
                  className={styles.viewBillCtaBtn}
                  onClick={() => setShowBillModal(true)}
                  aria-label="View the bill"
                >
                  <span>View Bill & Receipt</span>
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </section>

          {/* 4. Support / Helpdesk Strip */}
          <div className={styles.detailsHelpStrip}>
            <div className={styles.helpStripLeft}>
              <LifeBuoy size={18} className={styles.helpStripIcon} />
              <span>Need help or have a question about this past order?</span>
            </div>
            <Link to="/household/support" className={styles.helpStripBtn}>
              Get Support
            </Link>
          </div>

          {/* ====================================================================
              SEPARATE SCREEN / MODAL: CLASSIC PAYMENT RECEIPT & BILL
              ==================================================================== */}
          {showBillModal && (
            <div className={styles.modalOverlay} onClick={() => setShowBillModal(false)}>
              <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-bill-title"
              >
                {/* Modal Header */}
                <div className={styles.modalHeader}>
                  <div className={styles.modalTitleGroup}>
                    <span className={styles.modalOrderBadge}>#{selectedOrder.orderNumber}</span>
                    <h3 id="modal-bill-title" className={styles.modalTitle}>Pickup Summary & Receipt</h3>
                  </div>
                  <button
                    type="button"
                    className={styles.modalCloseBtn}
                    onClick={() => setShowBillModal(false)}
                    aria-label="Close receipt modal"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Body */}
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
                        <CheckCircle2 size={18} className={styles.bannerIconGreen} />
                        <span>Pickup completed on {selectedOrder.dateTime}. Spot payment paid via {selectedOrder.paymentMethod}.</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={18} className={styles.bannerIconRed} />
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
                    <div className={styles.breakdownHeadingRow}>
                      <div className={styles.scaleIconWrap}>
                        <Scale size={16} />
                      </div>
                      <div>
                        <h4 className={styles.breakdownHeading}>Scrap Materials Weighed</h4>
                        <span className={styles.breakdownSub}>
                          {selectedOrder.items.length} materials • Total Weight: {selectedOrder.totalWeightKg} kg
                        </span>
                      </div>
                    </div>

                    <div className={styles.tableResponsiveWrapper}>
                      <table className={styles.receiptTable}>
                        <thead>
                          <tr>
                            <th style={{ width: '40%' }}>Material</th>
                            <th style={{ width: '20%' }}>Qty</th>
                            <th style={{ width: '18%' }}>Rate</th>
                            <th style={{ width: '22%', textAlign: 'right' }}>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.items.map((item, idx) => (
                            <tr key={idx}>
                              <td className={styles.materialCell} title={item.material}>
                                <span className={styles.modalItemNameMobile}>
                                  {getShortMaterialName(item.material)}
                                </span>
                                <span className={styles.modalItemNameDesktop}>
                                  {item.material}
                                </span>
                              </td>
                              <td className={styles.modalWeightCol}>{item.weightKg} kg</td>
                              <td className={styles.modalRateCol}>₹{item.ratePerKg}</td>
                              <td className={styles.modalSubtotalCol}>
                                ₹{formatAmount(item.weightKg * item.ratePerKg)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Payout Summary Box */}
                  <div className={styles.modalTotalBox}>
                    <div>
                      <span className={styles.totalBoxLabel}>Total Payout</span>
                      <span className={styles.totalBoxSubtext}>Payment Status: {selectedOrder.paymentStatus}</span>
                    </div>
                    <span className={styles.totalBoxAmount}>₹{formatAmount(selectedOrder.amount)}</span>
                  </div>

                  {/* Digital Scale Trust Badge */}
                  <div className={styles.modalScaleTrust}>
                    <ShieldCheck size={16} className={styles.modalTrustIcon} />
                    <span>Calibrated digital weighing scale verified in real-time at your doorstep.</span>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.printReceiptBtnModal}
                    onClick={() => handlePrintReceipt(selectedOrder)}
                  >
                    <Printer size={15} />
                    <span>Print / Save Receipt</span>
                  </button>
                  <button
                    type="button"
                    className={styles.closeBtnModal}
                    onClick={() => setShowBillModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ====================================================================
           VIEW 2: COMPACT ORDER HISTORY LIST
           ==================================================================== */
        <div className={styles.listViewContainer}>
          {/* 1. Header with concise title and subtitle */}
          <header className={styles.headerBlock}>
            <div className={styles.headerTitles}>
              <h1 className={styles.mainTitle}>History</h1>
              <p className={styles.mainSubtitle}>View your past scrap pickups.</p>
            </div>
          </header>

          {/* 2. Filters & Compact Search */}
          <div className={styles.controlsBar}>
            {/* Filter Tabs: All, Completed, Cancelled */}
            <div className={styles.filterPillsRow}>
              {[
                { id: 'ALL', label: 'All' },
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

            {/* Compact Search Box */}
            <div className={styles.searchBoxWrap}>
              <Search size={15} className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search orders or scrap"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className={styles.clearSearchBtn}
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* 3. Compact Order Cards List */}
          <div className={styles.orderCardsList}>
            {filteredData.map((order) => {
              const primaryItem = order.items[0];
              const additionalCount = order.items.length - 1;
              const productSummaryText =
                additionalCount > 0
                  ? `${primaryItem?.material || 'Scrap'} + ${additionalCount} more`
                  : primaryItem?.material || 'Scrap Material';

              // Short formatted date e.g. "01 May 2025"
              const shortDate = order.dateTime.split(' • ')[0];

              return (
                <div
                  key={order.id}
                  className={styles.compactOrderCard}
                  onClick={() => handleSelectOrder(order.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleSelectOrder(order.id)}
                  aria-label={`Order #${order.orderNumber}, ${order.status}, Payout ₹${formatAmount(order.amount)}`}
                >
                  {/* Top Row: Status on left, Date and Order ID on right */}
                  <div className={styles.cardTopRow}>
                    <div className={styles.cardStatusGroup}>
                      {order.status === 'completed' ? (
                        <span className={styles.statusBadgeCompleted}>
                          <CheckCircle2 size={11} className={styles.statusIcon} />
                          <span>Completed</span>
                        </span>
                      ) : (
                        <span className={styles.statusBadgeCancelled}>
                          <AlertCircle size={11} className={styles.statusIcon} />
                          <span>Cancelled</span>
                        </span>
                      )}
                    </div>

                    <div className={styles.cardMetaRight}>
                      <span className={styles.cardDate}>{shortDate}</span>
                      <span className={styles.cardOrderId}>#{order.orderNumber}</span>
                    </div>
                  </div>

                  {/* Middle Row: Single thumbnail + Product summary + Total weight */}
                  <div className={styles.cardMiddleRow}>
                    <img
                      src={primaryItem?.imageUrl || '/household-scrap-bundle.jpg'}
                      alt={primaryItem?.material || 'Scrap'}
                      className={styles.cardThumbImg}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/household-scrap-bundle.jpg';
                      }}
                    />
                    <div className={styles.cardProductInfo}>
                      <h2 className={styles.cardProductTitle}>{productSummaryText}</h2>
                      <span className={styles.cardWeightText}>
                        Total: {order.totalWeightKg} kg
                      </span>
                    </div>
                  </div>

                  {/* Bottom Row: Payout & subtle chevron */}
                  <div className={styles.cardBottomRow}>
                    <div className={styles.cardPayoutBlock}>
                      <span className={styles.cardPayoutLabel}>Payout</span>
                      <span className={styles.cardPayoutValue}>
                        ₹{formatAmount(order.amount)}
                      </span>
                    </div>

                    <div className={styles.cardActionBlock}>
                      <ChevronRight size={18} className={styles.cardChevronIcon} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredData.length === 0 && (
            <div className={styles.emptyState}>
              <Clock size={32} className={styles.emptyIcon} />
              <h3 className={styles.emptyTitle}>No past pickups found</h3>
              <p className={styles.emptySubtitle}>
                {searchTerm
                  ? `No pickups match "${searchTerm}".`
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
        </div>
      )}
    </div>
  );
}

export default HouseholdHistory;
