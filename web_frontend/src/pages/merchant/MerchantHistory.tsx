import { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight,
  ArrowLeft,
  Calendar,
  MapPin,
  Printer,
  Receipt,
  ShieldCheck,
  Scale,
  FileText,
} from 'lucide-react';
import styles from './MerchantHistory.module.css';

interface VerifiedMaterialItem {
  id: string;
  materialName: string;
  weightKg: number;
  ratePerKg: number;
  unit: string;
  subtotal: number;
}

export interface MerchantHistoryRecord {
  id: string;
  orderNumber: string;
  billNumber: string;
  customerName: string;
  customerType: 'Industry' | 'Household';
  address: string;
  area: string;
  dateTime: string;
  completedDate: string;
  status: 'completed' | 'cancelled';
  statusHeading: string;
  totalWeightKg: number;
  materialsSummary: string;
  items: VerifiedMaterialItem[];
  finalAmount: number | null; // null for cancelled orders
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Settled' | 'Cancelled' | '-';
  cancellationReason?: string;
  image: string;
}

const MERCHANT_HISTORY_DATA: MerchantHistoryRecord[] = [
  {
    id: 'HIST-250511-00074',
    orderNumber: 'ORD-250511-00074',
    billNumber: 'BILL-250511-0074',
    customerName: 'Evergreen Packaging Aggregators',
    customerType: 'Industry',
    address: 'No. 45, Velachery 100 Feet Road, Velachery, Chennai – 600042',
    area: 'Velachery · Chennai',
    dateTime: '11 May 2025 • 04:00 PM',
    completedDate: '11 May 2025',
    status: 'completed',
    statusHeading: 'Settled & Completed',
    totalWeightKg: 300,
    materialsSummary: 'Cardboard',
    items: [
      {
        id: 'it-1',
        materialName: 'Cardboard',
        weightKg: 300,
        ratePerKg: 13,
        unit: 'KG',
        subtotal: 3900,
      },
    ],
    finalAmount: 3900,
    paymentMethod: 'UPI Instant Payout',
    paymentStatus: 'Paid',
    image: '/scrap-cardboard.jpg',
  },
  {
    id: 'HIST-250510-00072',
    orderNumber: 'ORD-250510-00072',
    billNumber: 'BILL-250510-0072',
    customerName: 'Karthik Raja (Household)',
    customerType: 'Household',
    address: 'Flat 4B, Green Acres, Anna Nagar West, Chennai – 600040',
    area: 'Anna Nagar · Chennai',
    dateTime: '10 May 2025 • 11:30 AM',
    completedDate: '10 May 2025',
    status: 'completed',
    statusHeading: 'Digital Scale Verified & Paid',
    totalWeightKg: 28.5,
    materialsSummary: 'Copper Scrap + 2 more',
    items: [
      {
        id: 'it-2',
        materialName: 'Copper Scrap',
        weightKg: 3.5,
        ratePerKg: 720,
        unit: 'KG',
        subtotal: 2520,
      },
      {
        id: 'it-3',
        materialName: 'Scrap Iron',
        weightKg: 15.0,
        ratePerKg: 42,
        unit: 'KG',
        subtotal: 630,
      },
      {
        id: 'it-4',
        materialName: 'White Paper',
        weightKg: 10.0,
        ratePerKg: 18,
        unit: 'KG',
        subtotal: 180,
      },
    ],
    finalAmount: 3330,
    paymentMethod: 'UPI Direct Transfer',
    paymentStatus: 'Paid',
    image: '/industry-copper-scrap.jpg',
  },
  {
    id: 'HIST-250509-00070',
    orderNumber: 'ORD-250509-00070',
    billNumber: 'BILL-250509-0070',
    customerName: 'Apex Precision Engineering',
    customerType: 'Industry',
    address: 'Plot 18, SIDCO Industrial Estate, Guindy, Chennai – 600032',
    area: 'Guindy · Chennai',
    dateTime: '09 May 2025 • 03:45 PM',
    completedDate: '09 May 2025',
    status: 'completed',
    statusHeading: 'Commercial Batch Cleared',
    totalWeightKg: 450,
    materialsSummary: 'Commercial Aluminium + 1 more',
    items: [
      {
        id: 'it-5',
        materialName: 'Commercial Aluminium',
        weightKg: 350,
        ratePerKg: 165,
        unit: 'KG',
        subtotal: 57750,
      },
      {
        id: 'it-6',
        materialName: 'MA - Solid Alloy',
        weightKg: 100,
        ratePerKg: 185,
        unit: 'KG',
        subtotal: 18500,
      },
    ],
    finalAmount: 76250,
    paymentMethod: 'Bank Transfer (NEFT)',
    paymentStatus: 'Settled',
    image: '/industry-aluminium-scrap.jpg',
  },
  {
    id: 'HIST-250508-00067',
    orderNumber: 'ORD-250508-00067',
    billNumber: 'BILL-250508-0067',
    customerName: 'Sri Venkatesh Heavy Industries',
    customerType: 'Industry',
    address: '24, 5th Main Road, SIDCO Industrial Estate, Guindy, Chennai',
    area: 'Guindy · Chennai',
    dateTime: '08 May 2025 • 10:15 AM',
    completedDate: '08 May 2025',
    status: 'completed',
    statusHeading: 'Gate Pass & Payout Completed',
    totalWeightKg: 650,
    materialsSummary: 'Scrap Iron',
    items: [
      {
        id: 'it-7',
        materialName: 'Scrap Iron',
        weightKg: 650,
        ratePerKg: 42,
        unit: 'KG',
        subtotal: 27300,
      },
    ],
    finalAmount: 27300,
    paymentMethod: 'Bank RTGS',
    paymentStatus: 'Settled',
    image: '/industry-steel-scrap.jpg',
  },
  {
    id: 'HIST-250506-00063',
    orderNumber: 'ORD-250506-00063',
    billNumber: 'BILL-250506-0063',
    customerName: 'Precision Tools & Castings Pvt Ltd',
    customerType: 'Industry',
    address: '16, Porur Main Road, Porur, Chennai – 600116, Tamil Nadu',
    area: 'Porur · Chennai',
    dateTime: '06 May 2025 • 01:30 PM',
    completedDate: '06 May 2025',
    status: 'completed',
    statusHeading: 'Verified Payout Complete',
    totalWeightKg: 92,
    materialsSummary: 'Brass Scrap',
    items: [
      {
        id: 'it-8',
        materialName: 'Brass Scrap',
        weightKg: 92,
        ratePerKg: 490,
        unit: 'KG',
        subtotal: 45080,
      },
    ],
    finalAmount: 45080,
    paymentMethod: 'Bank Transfer (IMPS)',
    paymentStatus: 'Paid',
    image: '/scrap-brass.jpg',
  },
  {
    id: 'HIST-250510-00071',
    orderNumber: 'ORD-250510-00071',
    billNumber: 'BILL-250510-0071',
    customerName: 'Priya Packaging & Boxes',
    customerType: 'Industry',
    address: '101, Thiru Vi Ka Street, Perambur, Chennai – 600011',
    area: 'Perambur · Chennai',
    dateTime: '10 May 2025 • 10:30 AM',
    completedDate: '10 May 2025',
    status: 'cancelled',
    statusHeading: 'Cancelled by Customer',
    totalWeightKg: 70,
    materialsSummary: 'Plastic & Mixed Scrap',
    items: [],
    finalAmount: null,
    paymentMethod: '-',
    paymentStatus: 'Cancelled',
    cancellationReason: 'Customer postponed clearance to next month due to warehouse restructuring.',
    image: '/scrap-plastic-barrel.jpg',
  },
  {
    id: 'HIST-250509-00068',
    orderNumber: 'ORD-250509-00068',
    billNumber: 'BILL-250509-0068',
    customerName: 'Kaveri Metal Fabrication Works',
    customerType: 'Industry',
    address: 'Plot 42, SIDCO Industrial Complex, Thirumazhisai, Chennai – 600124',
    area: 'Thirumazhisai · Chennai',
    dateTime: '09 May 2025 • 01:15 PM',
    completedDate: '09 May 2025',
    status: 'cancelled',
    statusHeading: 'Cancelled by Merchant Dispatch',
    totalWeightKg: 850,
    materialsSummary: 'Heavy Melting Steel & Lathe Waste',
    items: [],
    finalAmount: null,
    paymentMethod: '-',
    paymentStatus: 'Cancelled',
    cancellationReason: 'Factory overhead crane undergoing emergency maintenance; rebooked for next week.',
    image: '/industry-steel-scrap.jpg',
  },
];

export default function MerchantHistory() {
  const [historyData] = useState<MerchantHistoryRecord[]>(MERCHANT_HISTORY_DATA);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<MerchantHistoryRecord | null>(null);
  const [showBillModal, setShowBillModal] = useState(false);

  const filteredData = useMemo(() => {
    return historyData.filter((rec) => {
      if (statusFilter === 'COMPLETED' && rec.status !== 'completed') return false;
      if (statusFilter === 'CANCELLED' && rec.status !== 'cancelled') return false;

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchCustomer = rec.customerName.toLowerCase().includes(query);
        const matchMaterial = rec.materialsSummary.toLowerCase().includes(query);
        const matchArea = rec.area.toLowerCase().includes(query);
        const matchId = rec.orderNumber.toLowerCase().includes(query);
        if (!matchCustomer && !matchMaterial && !matchArea && !matchId) return false;
      }

      return true;
    });
  }, [historyData, statusFilter, searchTerm]);

  const handlePrintReceipt = (rec: MerchantHistoryRecord) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>BillScrap Merchant Receipt - ${rec.orderNumber}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #111827; }
          .header { border-bottom: 2px solid #20242D; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: baseline; }
          .brand { font-size: 22px; font-weight: 800; color: #111827; }
          .brand span { color: #fbc21a; }
          .bill-title { font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; font-size: 12px; line-height: 1.6; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
          th { background: #f1f5f9; padding: 8px 10px; text-align: left; font-size: 11px; text-transform: uppercase; border-bottom: 1.5px solid #cbd5e1; }
          td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
          .total-box { background: #20242D; color: #ffffff; padding: 12px 16px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 14px; font-weight: 800; }
          .total-box span:last-child { color: #fbc21a; font-size: 18px; }
          .footer { margin-top: 24px; font-size: 11px; color: #64748b; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">Bill<span>Scrap</span></div>
          <div class="bill-title">Digital Scale Settlement Bill</div>
        </div>
        <div class="meta-grid">
          <div>
            <div><strong>Order:</strong> ${rec.orderNumber}</div>
            <div><strong>Slip No:</strong> ${rec.billNumber}</div>
            <div><strong>Customer:</strong> ${rec.customerName} (${rec.customerType})</div>
          </div>
          <div>
            <div><strong>Date & Time:</strong> ${rec.dateTime}</div>
            <div><strong>Address:</strong> ${rec.address}</div>
            <div><strong>Payment:</strong> ${rec.paymentMethod} (${rec.paymentStatus})</div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Material</th>
              <th>Verified Weight</th>
              <th>Accepted Rate</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${rec.items
              .map(
                (it) => `
              <tr>
                <td><strong>${it.materialName}</strong></td>
                <td>${it.weightKg} ${it.unit}</td>
                <td>₹${it.ratePerKg} / ${it.unit}</td>
                <td style="text-align: right; font-weight: 800;">₹${it.subtotal.toLocaleString('en-IN')}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
        <div class="total-box">
          <span>FINAL SETTLEMENT PAID:</span>
          <span>₹${(rec.finalAmount || 0).toLocaleString('en-IN')}</span>
        </div>
        <div class="footer">
          Digitally verified on calibrated scale. BillScrap Merchant Operational Network.
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(receiptHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className={styles.pageContainer}>
      {selectedRecord ? (
        /* ====================================================================
           VIEW 2: FULL ORDER / BILL DETAILS RECORD VIEW
           ==================================================================== */
        <div className={styles.detailsViewContainer}>
          <div className={styles.detailsTopBar}>
            <button
              type="button"
              className={styles.backToListBtn}
              onClick={() => setSelectedRecord(null)}
            >
              <ArrowLeft size={16} />
              <span>Back to History</span>
            </button>
            {selectedRecord.status === 'completed' && (
              <button
                type="button"
                className={styles.printReceiptBtn}
                onClick={() => setShowBillModal(true)}
              >
                <Receipt size={15} />
                <span>View Bill &amp; Receipt</span>
              </button>
            )}
          </div>

          {/* 1. Header Card */}
          <section className={styles.detailsHeaderCard}>
            <div className={styles.detailsTitleRow}>
              <div>
                <h1 className={styles.detailsOrderNumber}>{selectedRecord.orderNumber}</h1>
                <div className={styles.detailsMetaSubrow}>
                  <Calendar size={13} className={styles.detailsMetaIcon} />
                  <span>{selectedRecord.dateTime}</span>
                  <span className={styles.detailsDotDivider}>•</span>
                  <span className={styles.billSlipTag}>{selectedRecord.billNumber}</span>
                </div>
              </div>

              <div>
                {selectedRecord.status === 'completed' ? (
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
            </div>

            {selectedRecord.status === 'completed' ? (
              <div className={styles.statusBannerCompleted}>
                <CheckCircle2 size={16} />
                <span>{selectedRecord.statusHeading} — Verified on digital scale</span>
              </div>
            ) : (
              <div className={styles.statusBannerCancelled}>
                <AlertCircle size={16} />
                <span>
                  {selectedRecord.statusHeading}
                  {selectedRecord.cancellationReason && ` — ${selectedRecord.cancellationReason}`}
                </span>
              </div>
            )}
          </section>

          {/* 2. Customer & Location Card */}
          <section className={styles.detailsSectionBox}>
            <div className={styles.detailsSectionHeader}>
              <h2 className={styles.detailsSectionTitle}>
                <FileText size={16} />
                <span>Order Information</span>
              </h2>
              <span
                className={`${styles.customerTypeBadge} ${
                  selectedRecord.customerType === 'Industry'
                    ? styles.customerTypeIndustry
                    : styles.customerTypeHousehold
                }`}
              >
                {selectedRecord.customerType}
              </span>
            </div>

            <div className={styles.detailsGridTwo}>
              <div className={styles.detailInfoCell}>
                <span className={styles.detailInfoLabel}>Customer / Facility</span>
                <span className={styles.detailInfoValue}>{selectedRecord.customerName}</span>
                <span className={styles.detailInfoSubtext}>{selectedRecord.area}</span>
              </div>

              <div className={styles.detailInfoCell}>
                <span className={styles.detailInfoLabel}>Pickup Address</span>
                <span className={styles.detailInfoValue}>{selectedRecord.address}</span>
              </div>
            </div>
          </section>

          {/* 3. Verified Materials & Final Breakdown (Completed Only) */}
          {selectedRecord.status === 'completed' && selectedRecord.items.length > 0 && (
            <section className={styles.detailsSectionBox}>
              <div className={styles.detailsSectionHeader}>
                <h2 className={styles.detailsSectionTitle}>
                  <Scale size={16} />
                  <span>Verified Scrap Materials &amp; Payout</span>
                </h2>
                <span className={styles.cardWeightPill}>
                  Total: {selectedRecord.totalWeightKg} KG
                </span>
              </div>

              <div className={styles.materialsTableWrap}>
                <table className={styles.materialsTable}>
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Verified Weight</th>
                      <th>Accepted Rate</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${selectedRecord.items.map((it) => (
                      <tr key={it.id}>
                        <td>{it.materialName}</td>
                        <td className={styles.tableWeightCol}>
                          {it.weightKg} {it.unit}
                        </td>
                        <td className={styles.tableRateCol}>
                          ₹{it.ratePerKg} / {it.unit}
                        </td>
                        <td className={styles.tableSubtotalCol}>
                          ₹{it.subtotal.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Final Payout Strip */}
              <div className={styles.finalPayoutStrip}>
                <div className={styles.payoutStripLeft}>
                  <span className={styles.payoutStripLabel}>Final Transaction Amount</span>
                  <span className={styles.payoutStripStatus}>
                    Payment: {selectedRecord.paymentMethod} ({selectedRecord.paymentStatus})
                  </span>
                </div>
                <strong className={styles.payoutStripAmount}>
                  ₹{(selectedRecord.finalAmount || 0).toLocaleString('en-IN')}
                </strong>
              </div>

              {/* Trust Badge */}
              <div className={styles.digitalScaleBadge}>
                <ShieldCheck size={16} className={styles.digitalScaleIcon} />
                <span>Calibrated digital weighing scale verified in real-time at customer doorstep.</span>
              </div>
            </section>
          )}

          {/* Bill Modal */}
          {showBillModal && selectedRecord && (
            <div className={styles.modalOverlay} onClick={() => setShowBillModal(false)}>
              <div className={styles.receiptModalCard} onClick={(e) => e.stopPropagation()}>
                <div className={styles.receiptModalHeader}>
                  <h3 className={styles.receiptModalTitle}>Settlement Bill &amp; Receipt</h3>
                  <button
                    type="button"
                    className={styles.receiptModalCloseBtn}
                    onClick={() => setShowBillModal(false)}
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className={styles.receiptModalBody}>
                  <div className={styles.detailsGridTwo}>
                    <div className={styles.detailInfoCell}>
                      <span className={styles.detailInfoLabel}>Order Reference</span>
                      <span className={styles.detailInfoValue}>{selectedRecord.orderNumber}</span>
                      <span className={styles.detailInfoSubtext}>{selectedRecord.billNumber}</span>
                    </div>
                    <div className={styles.detailInfoCell}>
                      <span className={styles.detailInfoLabel}>Customer</span>
                      <span className={styles.detailInfoValue}>{selectedRecord.customerName}</span>
                      <span className={styles.detailInfoSubtext}>{selectedRecord.dateTime}</span>
                    </div>
                  </div>

                  <div className={styles.materialsTableWrap}>
                    <table className={styles.materialsTable}>
                      <thead>
                        <tr>
                          <th>Material</th>
                          <th>Weight</th>
                          <th>Rate</th>
                          <th style={{ textAlign: 'right' }}>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRecord.items.map((it) => (
                          <tr key={it.id}>
                            <td>{it.materialName}</td>
                            <td>
                              {it.weightKg} {it.unit}
                            </td>
                            <td>₹{it.ratePerKg}</td>
                            <td className={styles.tableSubtotalCol}>
                              ₹{it.subtotal.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className={styles.finalPayoutStrip}>
                    <div className={styles.payoutStripLeft}>
                      <span className={styles.payoutStripLabel}>Final Amount Paid</span>
                      <span className={styles.payoutStripStatus}>{selectedRecord.paymentMethod}</span>
                    </div>
                    <strong className={styles.payoutStripAmount}>
                      ₹{(selectedRecord.finalAmount || 0).toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                <div className={styles.receiptModalFooter}>
                  <button
                    type="button"
                    className={styles.printReceiptActionBtn}
                    onClick={() => handlePrintReceipt(selectedRecord)}
                  >
                    <Printer size={15} />
                    <span>Print Receipt</span>
                  </button>
                  <button
                    type="button"
                    className={styles.closeReceiptModalBtn}
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
           VIEW 1: COMPACT ORDER HISTORY LIST
           ==================================================================== */
        <div className={styles.listViewContainer}>
          <header className={styles.headerBlock}>
            <h1 className={styles.mainTitle}>History</h1>
            <p className={styles.mainSubtitle}>View your completed and past orders.</p>
          </header>

          <div className={styles.controlsBar}>
            {/* Filter Pills */}
            <div className={styles.filterPillsRow}>
              {(
                [
                  { id: 'ALL', label: 'All' },
                  { id: 'COMPLETED', label: 'Completed' },
                  { id: 'CANCELLED', label: 'Cancelled' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`${styles.filterPillBtn} ${
                    statusFilter === tab.id ? styles.filterPillActive : ''
                  }`}
                  onClick={() => setStatusFilter(tab.id)}
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

          {/* List of Compact Order History Cards */}
          <div className={styles.orderCardsList}>
            {filteredData.length === 0 ? (
              <div className={styles.emptyStateContainer}>
                <Receipt size={32} className={styles.emptyStateIcon} />
                <h3 className={styles.emptyStateTitle}>No past orders found</h3>
                <p className={styles.emptyStateSubtext}>
                  No orders match your current filter or search criteria.
                </p>
              </div>
            ) : (
              filteredData.map((record) => (
                <div
                  key={record.id}
                  className={styles.compactOrderCard}
                  onClick={() => setSelectedRecord(record)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedRecord(record)}
                  aria-label={`Order ${record.orderNumber}, ${record.customerName}, ${record.status}`}
                >
                  {/* Top Row: Status badge & Customer type on left, Order ID on right */}
                  <div className={styles.cardTopRow}>
                    <div className={styles.cardStatusGroup}>
                      {record.status === 'completed' ? (
                        <span className={styles.statusBadgeCompleted}>
                          <CheckCircle2 size={11} />
                          <span>Completed</span>
                        </span>
                      ) : (
                        <span className={styles.statusBadgeCancelled}>
                          <AlertCircle size={11} />
                          <span>Cancelled</span>
                        </span>
                      )}
                      <span
                        className={`${styles.customerTypeBadge} ${
                          record.customerType === 'Industry'
                            ? styles.customerTypeIndustry
                            : styles.customerTypeHousehold
                        }`}
                      >
                        {record.customerType}
                      </span>
                    </div>

                    <span className={styles.cardOrderId}>#{record.orderNumber.replace('ORD-', '')}</span>
                  </div>

                  {/* Middle Row: Thumbnail + Customer Title + Material & Weight + Location & Date */}
                  <div className={styles.cardMiddleRow}>
                    <img
                      src={record.image}
                      alt={record.materialsSummary}
                      className={styles.cardThumbImg}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/logo-icon.png';
                      }}
                    />
                    <div className={styles.cardProductInfo}>
                      <h2 className={styles.cardCustomerTitle}>{record.customerName}</h2>
                      <div className={styles.cardMaterialSummary}>
                        <span className={styles.cardMaterialName}>{record.materialsSummary}</span>
                        {record.status === 'completed' && (
                          <span className={styles.cardWeightPill}>• {record.totalWeightKg} kg</span>
                        )}
                      </div>
                      <div className={styles.cardMetaSubrow}>
                        <span className={styles.cardAreaPill}>
                          <MapPin size={11} />
                          <span>{record.area}</span>
                        </span>
                        <span className={styles.cardMetaDot}>•</span>
                        <span className={styles.cardDatePill}>
                          <Calendar size={11} />
                          <span>{record.completedDate}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Final Amount & subtle chevron */}
                  <div className={styles.cardBottomRow}>
                    <div className={styles.cardAmountBlock}>
                      <span className={styles.cardAmountLabel}>Final Amount:</span>
                      {record.status === 'completed' && record.finalAmount !== null ? (
                        <strong className={styles.cardAmountValue}>
                          ₹{record.finalAmount.toLocaleString('en-IN')}
                        </strong>
                      ) : (
                        <span className={styles.cardAmountCancelled}>Order cancelled (no payment)</span>
                      )}
                    </div>

                    <div className={styles.cardActionBlock}>
                      <span>View</span>
                      <ChevronRight size={16} className={styles.cardChevronIcon} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
