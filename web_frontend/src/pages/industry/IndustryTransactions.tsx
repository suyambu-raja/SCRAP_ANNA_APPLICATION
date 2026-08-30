import { useState } from 'react';
import {
  Receipt,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  Building2,
  FileText,
  CreditCard,
  ArrowUpRight,
  Sparkles,
  Search,
  Filter,
  Check,
  ChevronDown,
  X,
  ExternalLink,
  Layers,
  ArrowDownRight,
  History,
} from 'lucide-react';
import styles from './IndustryTransactions.module.css';

interface IndustryTransaction {
  id: string;
  txId: string;
  orderId: string;
  material: string;
  category: string;
  merchantName: string;
  quantity: string;
  amount: number;
  paymentMode: string;
  status: 'Completed' | 'Pending' | 'Failed';
  time: string;
  dateGroupKey: 'today' | 'yesterday' | '3_days_ago' | 'earlier_this_month' | 'before';
  dateGroupTitle: string;
  dateFormatted: string;
  billSlipNumber: string;
  gstInvoiceNumber: string;
  timeline: {
    step: string;
    time: string;
    completed: boolean;
  }[];
}

const TRANSACTIONS_DATA: IndustryTransaction[] = [
  // 1. TODAY (Most Recent First)
  {
    id: 'tx-1',
    txId: 'TXN-SA-20250513-9901',
    orderId: 'ORD-250513-00078',
    material: 'Steel Turnings & Lathe Chips (650 KG) + Armored Copper Cables (180 KG)',
    category: 'Multi-Material Truck Visit',
    merchantName: 'Ramesh Metal Traders & Foundry',
    quantity: '2 Materials (~830 KG)',
    amount: 151600,
    paymentMode: 'Instant NEFT Direct Settlement',
    status: 'Completed',
    time: 'Today, 04:30 PM',
    dateGroupKey: 'today',
    dateGroupTitle: 'TODAY',
    dateFormatted: '13 May 2025',
    billSlipNumber: 'SLP-8890-GUINDY',
    gstInvoiceNumber: 'GST-INV-2025-4412',
    timeline: [
      { step: 'Order Accepted & Truck Dispatched', time: 'Today, 09:30 AM', completed: true },
      { step: 'Factory Gate Entry OTP Verified (#8492)', time: 'Today, 10:15 AM', completed: true },
      { step: 'Gross & Tare Measurement Verified', time: 'Today, 03:45 PM', completed: true },
      { step: 'Digital Bill Approved by Industry (#4190)', time: 'Today, 04:10 PM', completed: true },
      { step: 'Settlement of ₹1,51,600 Credited via NEFT', time: 'Today, 04:30 PM', completed: true },
    ],
  },
  {
    id: 'tx-2',
    txId: 'TXN-SA-20250513-8824',
    orderId: 'ORD-250513-00076',
    material: 'Industrial HDPE Blue Chemical Drums (15 Pcs)',
    category: 'Plastic Scrap',
    merchantName: 'Metro Polymers & Recycling',
    quantity: '15 Units (Count Verified)',
    amount: 14250,
    paymentMode: 'Instant IMPS Business Settlement',
    status: 'Completed',
    time: 'Today, 11:15 AM',
    dateGroupKey: 'today',
    dateGroupTitle: 'TODAY',
    dateFormatted: '13 May 2025',
    billSlipNumber: 'SLP-8884-GUINDY',
    gstInvoiceNumber: 'GST-INV-2025-4408',
    timeline: [
      { step: 'Pickup Scheduled', time: 'Today, 08:30 AM', completed: true },
      { step: 'Gate Entry OTP Verified', time: 'Today, 09:45 AM', completed: true },
      { step: 'Quantity Verified on Site', time: 'Today, 10:30 AM', completed: true },
      { step: 'Digital Bill Approved', time: 'Today, 10:55 AM', completed: true },
      { step: 'Settlement of ₹14,250 Credited via IMPS', time: 'Today, 11:15 AM', completed: true },
    ],
  },

  // 2. YESTERDAY
  {
    id: 'tx-3',
    txId: 'TXN-SA-20250512-7712',
    orderId: 'ORD-250512-00065',
    material: 'Aluminium Architectural Extrusions & Profile Cutoffs (400 KG)',
    category: 'Aluminium Scrap',
    merchantName: 'Sri Balaji Non-Ferrous Alloys',
    quantity: '400 KG (Verified)',
    amount: 84000,
    paymentMode: 'RTGS Corporate Transfer',
    status: 'Completed',
    time: 'Yesterday, 03:45 PM',
    dateGroupKey: 'yesterday',
    dateGroupTitle: 'YESTERDAY',
    dateFormatted: '12 May 2025',
    billSlipNumber: 'SLP-8812-AMBATTUR',
    gstInvoiceNumber: 'GST-INV-2025-4395',
    timeline: [
      { step: 'Order Accepted & Truck Arrived', time: 'Yesterday, 11:00 AM', completed: true },
      { step: 'Factory Gate Entry OTP Verified', time: 'Yesterday, 11:30 AM', completed: true },
      { step: 'Measurement Slip #SLP-8812 Generated', time: 'Yesterday, 02:45 PM', completed: true },
      { step: 'Digital Bill Authorized', time: 'Yesterday, 03:15 PM', completed: true },
      { step: 'Settlement of ₹84,000 Credited via RTGS', time: 'Yesterday, 03:45 PM', completed: true },
    ],
  },

  // 3. 3 DAYS AGO / BEFORE
  {
    id: 'tx-4',
    txId: 'TXN-SA-20250510-4412',
    orderId: 'ORD-250510-00052',
    material: 'Mixed Electronic Circuit Boards & Copper Wire (320 KG)',
    category: 'E-Waste',
    merchantName: 'EcoTech E-Waste Processors',
    quantity: '320 KG (Verified)',
    amount: 28000,
    paymentMode: 'Instant NEFT Direct Settlement',
    status: 'Completed',
    time: '10 May 2025, 01:15 PM',
    dateGroupKey: '3_days_ago',
    dateGroupTitle: '3 DAYS AGO',
    dateFormatted: '10 May 2025',
    billSlipNumber: 'SLP-8740-GUINDY',
    gstInvoiceNumber: 'GST-INV-2025-4370',
    timeline: [
      { step: 'Order Accepted', time: '09 May, 04:00 PM', completed: true },
      { step: 'Truck Arrival & Gate OTP Verified', time: '10 May, 10:30 AM', completed: true },
      { step: 'Measurement Slip #SLP-8740 Generated', time: '10 May, 12:15 PM', completed: true },
      { step: 'Digital Bill Authorized', time: '10 May, 12:50 PM', completed: true },
      { step: 'Settlement of ₹28,000 Credited via NEFT', time: '10 May, 01:15 PM', completed: true },
    ],
  },

  // 4. EARLIER THIS MONTH / BEFORE
  {
    id: 'tx-5',
    txId: 'TXN-SA-20250505-1109',
    orderId: 'ORD-250505-00018',
    material: 'Corrugated Packaging Boxes & Production Cardboard (850 KG)',
    category: 'Paper Scrap',
    merchantName: 'GreenEarth Paper Mills',
    quantity: '850 KG Baled',
    amount: 12850,
    paymentMode: 'Instant NEFT Direct Settlement',
    status: 'Completed',
    time: '05 May 2025, 11:30 AM',
    dateGroupKey: 'earlier_this_month',
    dateGroupTitle: 'EARLIER THIS MONTH',
    dateFormatted: '05 May 2025',
    billSlipNumber: 'SLP-8692-GUINDY',
    gstInvoiceNumber: 'GST-INV-2025-4310',
    timeline: [
      { step: 'Order Accepted', time: '04 May, 02:00 PM', completed: true },
      { step: 'Truck Arrival & Gate OTP Verified', time: '05 May, 09:30 AM', completed: true },
      { step: 'Measurement Slip Generated', time: '05 May, 10:45 AM', completed: true },
      { step: 'Digital Bill Authorized', time: '05 May, 11:05 AM', completed: true },
      { step: 'Settlement of ₹12,850 Credited via NEFT', time: '05 May, 11:30 AM', completed: true },
    ],
  },

  // 5. BEFORE / LAST MONTH
  {
    id: 'tx-6',
    txId: 'TXN-SA-20250428-0922',
    orderId: 'ORD-250428-00009',
    material: 'Heavy Machinery Dismantled Iron Offcuts (1.2 Tons)',
    category: 'Metal Scrap',
    merchantName: 'Guindy Heavy Scrap Smelters',
    quantity: '1.2 Tons (Verified)',
    amount: 38400,
    paymentMode: 'RTGS Corporate Transfer',
    status: 'Completed',
    time: '28 Apr 2025, 04:00 PM',
    dateGroupKey: 'before',
    dateGroupTitle: 'PREVIOUS MONTH (APRIL 2025)',
    dateFormatted: '28 Apr 2025',
    billSlipNumber: 'SLP-8550-GUINDY',
    gstInvoiceNumber: 'GST-INV-2025-4201',
    timeline: [
      { step: 'Order Accepted', time: '27 Apr, 03:00 PM', completed: true },
      { step: 'Truck Arrival & Gate OTP Verified', time: '28 Apr, 10:00 AM', completed: true },
      { step: 'Measurement Slip Generated', time: '28 Apr, 02:30 PM', completed: true },
      { step: 'Digital Bill Authorized', time: '28 Apr, 03:15 PM', completed: true },
      { step: 'Settlement of ₹38,400 Credited via RTGS', time: '28 Apr, 04:00 PM', completed: true },
    ],
  },
];

// Chronological group definitions in order: Today -> Yesterday -> 3 Days Ago -> Earlier -> Before
const DATE_GROUPS_CONFIG = [
  { key: 'today', label: '📌 TODAY', sub: '13 May 2025', isRecent: true },
  { key: 'yesterday', label: '📅 YESTERDAY', sub: '12 May 2025', isRecent: false },
  { key: '3_days_ago', label: '📅 3 DAYS AGO', sub: '10 May 2025', isRecent: false },
  { key: 'earlier_this_month', label: '📅 EARLIER THIS MONTH', sub: '05 May 2025', isRecent: false },
  { key: 'before', label: '📅 PREVIOUS TRANSACTIONS', sub: 'April 2025', isRecent: false },
] as const;

export default function IndustryTransactions() {
  const [transactions, setTransactions] = useState<IndustryTransaction[]>(TRANSACTIONS_DATA);
  const [activeTimelineFilter, setActiveTimelineFilter] = useState<'All' | 'today' | 'yesterday' | 'before'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTxDetail, setSelectedTxDetail] = useState<IndustryTransaction | null>(null);

  const filteredTransactions = transactions.filter((tx) => {
    // Timeline Filter
    let matchesTimeline = true;
    if (activeTimelineFilter === 'today') matchesTimeline = tx.dateGroupKey === 'today';
    else if (activeTimelineFilter === 'yesterday') matchesTimeline = tx.dateGroupKey === 'yesterday';
    else if (activeTimelineFilter === 'before') matchesTimeline = tx.dateGroupKey !== 'today' && tx.dateGroupKey !== 'yesterday';

    // Search Filter
    const matchesSearch =
      tx.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.txId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.billSlipNumber.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTimeline && matchesSearch;
  });

  const totalCompletedSettlement = transactions
    .filter((t) => t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const todaySettlement = transactions
    .filter((t) => t.dateGroupKey === 'today' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className={styles.pageContainer}>
      {/* 1. Top Header Banner with Total Highlights */}
      <div className={styles.headerBanner}>
        <div className={styles.headerTitleGroup}>
          <div className={styles.headerBadge}>
            <Sparkles size={13} fill="#0f172a" />
            <span>CHRONOLOGICAL FINANCIAL LEDGER</span>
          </div>
          <h1 className={styles.pageTitle}>Transactions &amp; Invoices</h1>
          <p className={styles.pageSubtitle}>
            Verified settlement records ordered chronologically from today to previous dispatches.
          </p>
        </div>

        {/* Top Summary Stats */}
        <div className={styles.summaryStatsRow}>
          <div className={styles.todaySettledCard}>
            <div className={styles.todayBadge}>TODAY'S PAYOUT</div>
            <span className={styles.todayAmount}>₹{todaySettlement.toLocaleString('en-IN')}</span>
            <span className={styles.todaySub}>2 Settlements Credited Today</span>
          </div>

          <div className={styles.summaryTotalBox}>
            <span className={styles.summaryTotalLabel}>Total Settled (All-Time)</span>
            <span className={styles.summaryTotalAmount}>₹{totalCompletedSettlement.toLocaleString('en-IN')}</span>
            <span className={styles.summaryTotalCount}>{transactions.length} Verified Dispatches</span>
          </div>
        </div>
      </div>

      {/* 2. Timeline Tabs & Search Bar */}
      <div className={styles.filterStrip}>
        <div className={styles.tabsRow}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTimelineFilter === 'All' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTimelineFilter('All')}
          >
            <span>All Chronological ({transactions.length})</span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTimelineFilter === 'today' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTimelineFilter('today')}
          >
            <span>📌 Today ({transactions.filter((t) => t.dateGroupKey === 'today').length})</span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTimelineFilter === 'yesterday' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTimelineFilter('yesterday')}
          >
            <span>📅 Yesterday ({transactions.filter((t) => t.dateGroupKey === 'yesterday').length})</span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTimelineFilter === 'before' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTimelineFilter('before')}
          >
            <span>⏳ Before / Past ({transactions.filter((t) => t.dateGroupKey !== 'today' && t.dateGroupKey !== 'yesterday').length})</span>
          </button>
        </div>

        <div className={styles.searchBox}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by order ID, merchant, material or slip..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* 3. Chronologically Grouped Transactions (Today -> Yesterday -> Before -> Before) */}
      <div className={styles.timelineGroupsContainer}>
        {DATE_GROUPS_CONFIG.map((group) => {
          const groupTransactions = filteredTransactions.filter(
            (tx) => tx.dateGroupKey === group.key
          );

          if (groupTransactions.length === 0) return null;

          const groupTotal = groupTransactions.reduce((sum, t) => sum + t.amount, 0);

          return (
            <div key={group.key} className={styles.dateGroupSection}>
              {/* Date Group Header */}
              <div className={`${styles.dateGroupHeader} ${group.isRecent ? styles.dateGroupHeaderToday : ''}`}>
                <div className={styles.dateGroupLeft}>
                  <div className={styles.dateGroupTitleRow}>
                    <strong className={styles.dateGroupMainTitle}>{group.label}</strong>
                    <span className={styles.dateGroupSubDate}>• {group.sub}</span>
                  </div>
                </div>

                <div className={styles.dateGroupRight}>
                  <span className={styles.groupCountBadge}>{groupTransactions.length} Settlement{groupTransactions.length > 1 ? 's' : ''}</span>
                  <span className={styles.groupTotalBadge}>Total: ₹{groupTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Transactions Table for this date */}
              <div className={styles.tableCard}>
                <table className={styles.transactionsTable}>
                  <thead>
                    <tr>
                      <th>TRANSACTION &amp; ORDER</th>
                      <th>MATERIAL &amp; QUANTITY</th>
                      <th>BUYER MERCHANT</th>
                      <th>SETTLEMENT AMOUNT</th>
                      <th>PAYMENT MODE</th>
                      <th>SLIP &amp; STATUS</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupTransactions.map((tx) => (
                      <tr key={tx.id} onClick={() => setSelectedTxDetail(tx)} className={styles.tableRow}>
                        {/* Transaction ID & Time */}
                        <td>
                          <div className={styles.idCellGroup}>
                            <strong className={styles.txIdText}>{tx.txId}</strong>
                            <span className={styles.orderIdSub}>{tx.orderId}</span>
                            <span className={styles.timeTag}>
                              <Clock size={11} />
                              {tx.time}
                            </span>
                          </div>
                        </td>

                        {/* Material & Quantity */}
                        <td>
                          <div className={styles.materialCellGroup}>
                            <strong className={styles.materialCellName}>{tx.material}</strong>
                            <span className={styles.qtyCellBadge}>{tx.quantity}</span>
                          </div>
                        </td>

                        {/* Merchant */}
                        <td>
                          <div className={styles.merchantCellGroup}>
                            <Building2 size={14} className={styles.buildingIcon} />
                            <span>{tx.merchantName}</span>
                          </div>
                        </td>

                        {/* Amount */}
                        <td>
                          <span className={styles.amountCellText}>
                            ₹{tx.amount.toLocaleString('en-IN')}
                          </span>
                        </td>

                        {/* Payment Mode */}
                        <td>
                          <div className={styles.paymentModeCell}>
                            <CreditCard size={13} className={styles.paymentIcon} />
                            <span>{tx.paymentMode}</span>
                          </div>
                        </td>

                        {/* Slip Number & Status */}
                        <td>
                          <div className={styles.statusCellGroup}>
                            <span className={styles.slipBadge}>{tx.billSlipNumber}</span>
                            <span
                              className={`${styles.statusBadge} ${
                                tx.status === 'Completed'
                                  ? styles.statusCompleted
                                  : styles.statusPending
                              }`}
                            >
                              ✓ Settled
                            </span>
                          </div>
                        </td>

                        {/* Action */}
                        <td>
                          <button
                            type="button"
                            className={styles.viewTimelineBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTxDetail(tx);
                            }}
                          >
                            <span>Timeline &amp; Slip</span>
                            <ArrowUpRight size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        {filteredTransactions.length === 0 && (
          <div className={styles.emptyStateCard}>
            <History size={36} className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No Transactions Found</h3>
            <p className={styles.emptySub}>No transaction records match your search or filter selection.</p>
          </div>
        )}
      </div>

      {/* 4. Transaction Details & Timeline Modal */}
      {selectedTxDetail && (
        <div className={styles.modalOverlay} onClick={() => setSelectedTxDetail(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderTitleGroup}>
                <Receipt size={22} className={styles.receiptIconGold} />
                <div>
                  <h3 className={styles.modalTitle}>Settlement Breakdown</h3>
                  <span className={styles.modalSub}>{selectedTxDetail.txId} • {selectedTxDetail.orderId}</span>
                </div>
              </div>

              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setSelectedTxDetail(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Top Amount Highlight */}
              <div className={styles.amountHighlightCard}>
                <span className={styles.highlightLabel}>Total Settlement Credited</span>
                <span className={styles.highlightAmount}>₹{selectedTxDetail.amount.toLocaleString('en-IN')}</span>
                <span className={styles.highlightMode}>{selectedTxDetail.paymentMode} • {selectedTxDetail.time}</span>
              </div>

              {/* Order & Merchant Info Strip */}
              <div className={styles.txInfoStrip}>
                <div className={styles.txInfoCol}>
                  <span className={styles.infoColLabel}>Material Description</span>
                  <strong className={styles.infoColVal}>{selectedTxDetail.material}</strong>
                </div>
                <div className={styles.txInfoCol}>
                  <span className={styles.infoColLabel}>Measured Quantity</span>
                  <strong className={styles.infoColVal}>{selectedTxDetail.quantity}</strong>
                </div>
                <div className={styles.txInfoCol}>
                  <span className={styles.infoColLabel}>Buyer Merchant</span>
                  <strong className={styles.infoColVal}>{selectedTxDetail.merchantName}</strong>
                </div>
                <div className={styles.txInfoCol}>
                  <span className={styles.infoColLabel}>Bill Slip Ref</span>
                  <strong className={styles.infoColVal}>{selectedTxDetail.billSlipNumber}</strong>
                </div>
                <div className={styles.txInfoColFull}>
                  <span className={styles.infoColLabel}>GST Tax Invoice</span>
                  <strong className={styles.infoColVal}>{selectedTxDetail.gstInvoiceNumber}</strong>
                </div>
              </div>

              {/* 5-Step Settlement Timeline */}
              <div className={styles.timelineSection}>
                <h4 className={styles.timelineHeading}>Discharge &amp; Payment Timeline</h4>

                <div className={styles.timelineList}>
                  {selectedTxDetail.timeline.map((item, idx) => (
                    <div key={idx} className={styles.timelineRowItem}>
                      <div
                        className={`${styles.timelineNodeCircle} ${
                          item.completed ? styles.nodeCompleted : styles.nodePending
                        }`}
                      >
                        {item.completed ? <Check size={12} strokeWidth={3} /> : idx + 1}
                      </div>

                      <div className={styles.timelineRowContent}>
                        <strong className={styles.timelineStepName}>{item.step}</strong>
                        <span className={styles.timelineStepTime}>{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.modalActionsRow}>
                <button
                  type="button"
                  className={styles.downloadInvoiceBtn}
                  onClick={() => alert(`Downloading GST Invoice #${selectedTxDetail.gstInvoiceNumber} (PDF)...`)}
                >
                  <Download size={14} />
                  <span>Download GST Tax Invoice (PDF)</span>
                </button>

                <button
                  type="button"
                  className={styles.closeModalBtn}
                  onClick={() => setSelectedTxDetail(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
