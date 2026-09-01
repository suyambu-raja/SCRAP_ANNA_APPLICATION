import { useState, useMemo } from 'react';
import {
  Clock,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Truck,
  IndianRupee,
  MapPin,
  Calendar,
  Download,
  Printer,
  Scale,
  ShieldCheck,
  Eye,
  Maximize2,
} from 'lucide-react';
import styles from './HouseholdHistory.module.css';

interface OrderItemSummary {
  material: string;
  type: 'copper' | 'aluminum' | 'brass' | 'iron' | 'plastic' | 'cardboard' | 'ewaste' | 'paper';
  weightKg: number;
  ratePerKg: number;
  imageUrl: string;
}

interface OrderPhotoItem {
  id: string;
  title: string;
  weight: string;
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
  photos: OrderPhotoItem[];
  amount: number;
  status: 'completed' | 'pending' | 'picked_up' | 'cancelled';
  paymentStatus: 'Paid' | 'COD' | 'Pending' | '-';
  paymentMethod: 'UPI' | 'Cash on Delivery' | 'Card' | 'Net Banking' | '-';
  executiveName?: string;
  executivePhone?: string;
  pickupAddress?: string;
}

const HISTORY_DATA: OrderHistoryRecord[] = [
  {
    id: 'ord-1',
    orderNumber: 'SA123456',
    billSlipNumber: 'SLP-2025-05-SA123456',
    dateTime: '01 May 2025 • 10:30 AM',
    itemsCount: 5,
    totalWeightKg: 28.6,
    items: [
      { material: 'Copper Wire Scrap', type: 'copper', weightKg: 2.2, ratePerKg: 720, imageUrl: '/scrap-copper-wire.jpg' },
      { material: 'Steel Castings & Rods', type: 'iron', weightKg: 18.4, ratePerKg: 28, imageUrl: '/scrap-iron.jpg' },
      { material: 'Aluminum Sections', type: 'aluminum', weightKg: 8.0, ratePerKg: 180, imageUrl: '/scrap-household-aluminium.jpg' },
    ],
    photos: [
      { id: 'p-1', title: 'Copper Wire Scrap', weight: '2.2 KG', imageUrl: '/scrap-copper-wire.jpg' },
      { id: 'p-2', title: 'Steel Castings', weight: '18.4 KG', imageUrl: '/scrap-iron.jpg' },
      { id: 'p-3', title: 'Aluminum Sections', weight: '8.0 KG', imageUrl: '/scrap-household-aluminium.jpg' },
      { id: 'p-4', title: 'Scrap Staging Bundle', weight: 'Total ~28.6 KG', imageUrl: '/household-scrap-bundle.jpg' },
    ],
    amount: 1850,
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
      { material: 'Iron Rods', type: 'iron', weightKg: 8.4, ratePerKg: 38.5, imageUrl: '/scrap-iron.jpg' },
      { material: 'Brass Fittings', type: 'brass', weightKg: 1.0, ratePerKg: 460, imageUrl: '/scrap-brass.jpg' },
      { material: 'Cardboard Box Stack', type: 'cardboard', weightKg: 3.0, ratePerKg: 14.5, imageUrl: '/scrap-cardboard.jpg' },
    ],
    photos: [
      { id: 'p-5', title: 'Iron Rods', weight: '8.4 KG', imageUrl: '/scrap-iron.jpg' },
      { id: 'p-6', title: 'Brass Fittings', weight: '1.0 KG', imageUrl: '/scrap-brass.jpg' },
      { id: 'p-7', title: 'Cardboard Cartons', weight: '3.0 KG', imageUrl: '/scrap-cardboard.jpg' },
      { id: 'p-8', title: 'Household Bundle', weight: 'Total ~12.4 KG', imageUrl: '/household-scrap-bundle.jpg' },
    ],
    amount: 780,
    status: 'pending',
    paymentStatus: 'COD',
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
    itemsCount: 3,
    totalWeightKg: 18.7,
    items: [
      { material: 'Copper Coils', type: 'copper', weightKg: 1.5, ratePerKg: 720, imageUrl: '/scrap-copper.jpg' },
      { material: 'Cardboard Cartons', type: 'cardboard', weightKg: 17.2, ratePerKg: 14.5, imageUrl: '/scrap-cardboard.jpg' },
    ],
    photos: [
      { id: 'p-9', title: 'Copper Coils', weight: '1.5 KG', imageUrl: '/scrap-copper.jpg' },
      { id: 'p-10', title: 'Cardboard Bundles', weight: '17.2 KG', imageUrl: '/scrap-cardboard.jpg' },
      { id: 'p-11', title: 'Tied Recyclables Bundle', weight: 'Total ~18.7 KG', imageUrl: '/copper-paper-scrap-bundle.jpg' },
    ],
    amount: 1250,
    status: 'picked_up',
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
    itemsCount: 6,
    totalWeightKg: 32.1,
    items: [
      { material: 'Aluminum Utensils', type: 'aluminum', weightKg: 6.5, ratePerKg: 180, imageUrl: '/scrap-household-aluminium.jpg' },
      { material: 'Brass Taps', type: 'brass', weightKg: 1.8, ratePerKg: 460, imageUrl: '/scrap-brass.jpg' },
      { material: 'Old Newspapers', type: 'paper', weightKg: 23.8, ratePerKg: 12.5, imageUrl: '/scrap-mixed-papers.jpg' },
    ],
    photos: [
      { id: 'p-12', title: 'Aluminum Utensils', weight: '6.5 KG', imageUrl: '/scrap-household-aluminium.jpg' },
      { id: 'p-13', title: 'Brass Taps', weight: '1.8 KG', imageUrl: '/scrap-brass.jpg' },
      { id: 'p-14', title: 'Old Newspapers', weight: '23.8 KG', imageUrl: '/scrap-mixed-papers.jpg' },
    ],
    amount: 2100,
    status: 'completed',
    paymentStatus: 'Paid',
    paymentMethod: 'Card',
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
      { material: 'Computer Motherboard', type: 'ewaste', weightKg: 2.5, ratePerKg: 150, imageUrl: '/scrap-cpu.jpg' },
      { material: 'Copper Tubes', type: 'copper', weightKg: 0.2, ratePerKg: 720, imageUrl: '/scrap-copper-wire.jpg' },
    ],
    photos: [
      { id: 'p-15', title: 'Computer Motherboard', weight: '2.5 KG', imageUrl: '/scrap-cpu.jpg' },
      { id: 'p-16', title: 'Copper Tubes', weight: '0.2 KG', imageUrl: '/scrap-copper-wire.jpg' },
    ],
    amount: 520,
    status: 'cancelled',
    paymentStatus: '-',
    paymentMethod: '-',
    executiveName: 'Unassigned',
    pickupAddress: 'No. 42, 2nd Main Road, Anna Nagar, Chennai - 600040',
  },
  {
    id: 'ord-6',
    orderNumber: 'SA123451',
    billSlipNumber: 'SLP-2025-04-SA123451',
    dateTime: '12 Apr 2025 • 10:15 AM',
    itemsCount: 4,
    totalWeightKg: 45.0,
    items: [
      { material: 'Heavy Iron Grill', type: 'iron', weightKg: 35.0, ratePerKg: 28, imageUrl: '/scrap-iron.jpg' },
      { material: 'Cardboard Bundles', type: 'cardboard', weightKg: 10.0, ratePerKg: 8, imageUrl: '/scrap-cardboard.jpg' },
    ],
    photos: [
      { id: 'p-17', title: 'Heavy Iron Grill', weight: '35.0 KG', imageUrl: '/scrap-iron.jpg' },
      { id: 'p-18', title: 'Cardboard Bundles', weight: '10.0 KG', imageUrl: '/scrap-cardboard.jpg' },
    ],
    amount: 1060,
    status: 'completed',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    executiveName: 'Murugan (Tata 407)',
    pickupAddress: 'No. 42, 2nd Main Road, Anna Nagar, Chennai - 600040',
  },
  {
    id: 'ord-7',
    orderNumber: 'SA123450',
    billSlipNumber: 'SLP-2025-04-SA123450',
    dateTime: '05 Apr 2025 • 03:30 PM',
    itemsCount: 3,
    totalWeightKg: 22.0,
    items: [
      { material: 'Aluminum Wire Scrap', type: 'aluminum', weightKg: 5.0, ratePerKg: 180, imageUrl: '/scrap-household-aluminium.jpg' },
      { material: 'Old Books Stack', type: 'paper', weightKg: 17.0, ratePerKg: 10, imageUrl: '/scrap-mixed-papers.jpg' },
    ],
    photos: [
      { id: 'p-19', title: 'Aluminum Wire Scrap', weight: '5.0 KG', imageUrl: '/scrap-household-aluminium.jpg' },
      { id: 'p-20', title: 'Old Books Stack', weight: '17.0 KG', imageUrl: '/scrap-mixed-papers.jpg' },
    ],
    amount: 1070,
    status: 'completed',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    executiveName: 'Murugan (Tata 407)',
    pickupAddress: 'No. 42, 2nd Main Road, Anna Nagar, Chennai - 600040',
  },
];

export function HouseholdHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateRangeFilter, setDateRangeFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderHistoryRecord | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<OrderPhotoItem | null>(null);

  const pageSize = 5;

  const handleCopy = (orderNum: string) => {
    navigator.clipboard.writeText(orderNum);
    setCopiedId(orderNum);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter Data
  const filteredData = useMemo(() => {
    return HISTORY_DATA.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((i) => i.material.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === 'ALL' ||
        order.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const currentRecords = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDownloadInvoice = (order: OrderHistoryRecord) => {
    // Generate styled printable invoice slip
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.orderNumber}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 2.5rem; color: #0f172a; max-width: 750px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 1rem; margin-bottom: 1.5rem; }
          .brand { font-size: 1.6rem; font-weight: 900; color: #d97706; }
          .title { font-size: 1.2rem; font-weight: 800; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; background: #f8fafc; padding: 1rem; border-radius: 8px; font-size: 0.9rem; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
          th, td { padding: 0.75rem 0.5rem; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 0.9rem; }
          th { background: #f1f5f9; font-weight: 800; text-transform: uppercase; font-size: 0.75rem; }
          .total-box { display: flex; justify-content: space-between; align-items: center; background: #0f172a; color: #ffffff; padding: 1rem 1.25rem; border-radius: 8px; font-size: 1.1rem; font-weight: 900; }
          .footer { margin-top: 2rem; text-align: center; font-size: 0.8rem; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 1rem; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">SCRAP ANNA</div>
            <div style="font-size: 0.8rem; color: #64748b;">Recycle More, Value More • Chennai, Tamil Nadu</div>
          </div>
          <div style="text-align: right;">
            <div class="title">SCRAP TAX INVOICE</div>
            <div style="font-size: 0.85rem; font-weight: 700;">${order.billSlipNumber}</div>
          </div>
        </div>

        <div class="meta-grid">
          <div>
            <div><strong>Order ID:</strong> ${order.orderNumber}</div>
            <div><strong>Date & Time:</strong> ${order.dateTime}</div>
            <div><strong>Status:</strong> ${order.status.toUpperCase()}</div>
          </div>
          <div>
            <div><strong>Pickup Address:</strong> ${order.pickupAddress || 'Anna Nagar, Chennai'}</div>
            <div><strong>Executive:</strong> ${order.executiveName || 'Verified Scrap Executive'}</div>
            <div><strong>Payment Mode:</strong> ${order.paymentMethod} (${order.paymentStatus})</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Material Description</th>
              <th>Weighed Quantity</th>
              <th>Benchmark Rate</th>
              <th style="text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(it => `
              <tr>
                <td><strong>${it.material}</strong></td>
                <td>${it.weightKg} KG</td>
                <td>₹${it.ratePerKg} / KG</td>
                <td style="text-align: right; font-weight: 800;">₹${(it.weightKg * it.ratePerKg).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-box">
          <span>TOTAL PAYOUT PAID TO USER:</span>
          <span style="color: #fbc21a;">₹${order.amount.toFixed(2)}</span>
        </div>

        <div class="footer">
          This is an official computer-generated receipt from Scrap Anna Doorstep Scrap Services.<br />
          Digital Weighing Scale Certified & Verified. Helpline: +91 98400 12345
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

  const renderStatusBadge = (status: OrderHistoryRecord['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className={`${styles.statusBadge} ${styles.statusCompleted}`}>
            <CheckCircle2 size={13} />
            <span>Completed</span>
          </span>
        );
      case 'pending':
        return (
          <span className={`${styles.statusBadge} ${styles.statusPending}`}>
            <Clock size={13} />
            <span>Pending</span>
          </span>
        );
      case 'picked_up':
        return (
          <span className={`${styles.statusBadge} ${styles.statusPickedUp}`}>
            <Truck size={13} />
            <span>Picked Up</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className={`${styles.statusBadge} ${styles.statusCancelled}`}>
            <AlertCircle size={13} />
            <span>Cancelled</span>
          </span>
        );
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* 1. Header with Clock Icon */}
      <div className={styles.headerBlock}>
        <div className={styles.headerIconCircle}>
          <Clock size={24} />
        </div>
        <div className={styles.headerTitles}>
          <h1 className={styles.mainTitle}>History</h1>
          <p className={styles.mainSubtitle}>View all your past scrap orders, payouts, and receipts.</p>
        </div>
      </div>

      {/* 2. Filter & Search Bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterLeftGroup}>
          <select
            className={styles.selectDropdown}
            value={dateRangeFilter}
            onChange={(e) => setDateRangeFilter(e.target.value)}
          >
            <option value="ALL">Select Date Range</option>
            <option value="THIS_MONTH">This Month</option>
            <option value="LAST_3_MONTHS">Last 3 Months</option>
            <option value="THIS_YEAR">This Year (2025)</option>
          </select>

          <select
            className={styles.selectDropdown}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="PICKED_UP">Picked Up</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className={styles.searchBoxWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by Order ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* 3. Order History Table Card (With Real Scrap Image Thumbnails) */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date & Time</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                    No orders found matching your search.
                  </td>
                </tr>
              ) : (
                currentRecords.map((order) => {
                  const dateParts = order.dateTime.split(' • ');
                  const remainingCount = order.itemsCount - order.items.length;

                  return (
                    <tr key={order.id} className={styles.orderRow}>
                      {/* Order ID */}
                      <td>
                        <div className={styles.orderIdCell}>
                          <span>{order.orderNumber}</span>
                          <button
                            type="button"
                            className={styles.copyBtn}
                            onClick={() => handleCopy(order.orderNumber)}
                            title="Copy Order ID"
                          >
                            {copiedId === order.orderNumber ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td>
                        <div className={styles.dateCell}>
                          <span className={styles.dateMain}>{dateParts[0]}</span>
                          <span className={styles.dateSub}>{dateParts[1]}</span>
                        </div>
                      </td>

                      {/* Items with Real Scrap Images */}
                      <td>
                        <div className={styles.itemsCell}>
                          <div className={styles.itemThumbRow}>
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className={styles.itemThumb}
                                title={`${item.material} (${item.weightKg} kg)`}
                              >
                                <img
                                  src={item.imageUrl}
                                  alt={item.material}
                                  className={styles.itemThumbImg}
                                />
                              </div>
                            ))}
                            {remainingCount > 0 && (
                              <span className={styles.moreItemsBadge}>+{remainingCount}</span>
                            )}
                          </div>
                          <span className={styles.itemSummaryText}>
                            {order.itemsCount} Items • {order.totalWeightKg} kg
                          </span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td>
                        <span className={styles.amountCell}>₹{order.amount.toLocaleString()}</span>
                      </td>

                      {/* Status */}
                      <td>{renderStatusBadge(order.status)}</td>

                      {/* Payment */}
                      <td>
                        <div className={styles.paymentCell}>
                          {order.paymentStatus === 'Paid' ? (
                            <span className={styles.paymentPaid}>Paid</span>
                          ) : order.paymentStatus === 'COD' ? (
                            <span className={styles.paymentCod}>COD</span>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>-</span>
                          )}
                          <span className={styles.paymentMode}>{order.paymentMethod}</span>
                        </div>
                      </td>

                      {/* Action Button: Opens Details Modal */}
                      <td>
                        <button
                          type="button"
                          className={styles.viewDetailsBtn}
                          onClick={() => setSelectedOrder(order)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Pagination Bar */}
        <div className={styles.paginationBar}>
          <span>
            Showing {filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
            {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} orders
          </span>

          <div className={styles.paginationControls}>
            <button
              type="button"
              className={styles.pageBtn}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`${styles.pageBtn} ${currentPage === idx + 1 ? styles.pageBtnActive : ''}`}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}

            <button
              type="button"
              className={styles.pageBtn}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 5. VIEW DETAILS & DETAIL INVOICE DOWNLOADING MODAL */}
      {selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>Order Details & Tax Invoice</h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                  Order #{selectedOrder.orderNumber} • Slip Ref: {selectedOrder.billSlipNumber}
                </span>
              </div>
              <button type="button" className={styles.closeBtn} onClick={() => setSelectedOrder(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {/* Order Status & Date Summary Card */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '0.85rem 1.15rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                    Pickup Date & Time
                  </span>
                  <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{selectedOrder.dateTime}</strong>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>
                    Order Status
                  </span>
                  {renderStatusBadge(selectedOrder.status)}
                </div>
              </div>

              {/* ALL UPLOADED SCRAP PHOTOS GALLERY */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                    Uploaded Scrap Photos ({selectedOrder.photos.length})
                  </h4>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Click photo for full view</span>
                </div>

                <div className={styles.modalPhotoGrid}>
                  {selectedOrder.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className={styles.modalPhotoCard}
                      onClick={() => setLightboxPhoto(photo)}
                      title={`Click to view ${photo.title}`}
                    >
                      <img src={photo.imageUrl} alt={photo.title} className={styles.modalPhotoImg} />
                      <div className={styles.modalPhotoTag}>{photo.title}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SCRAP MATERIALS BREAKDOWN TABLE */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                  Scrap Materials Breakdown
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.65rem 0.85rem',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <img
                          src={item.imageUrl}
                          alt={item.material}
                          style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                          {item.material} ({item.weightKg} kg @ ₹{item.ratePerKg}/kg)
                        </span>
                      </div>
                      <strong style={{ fontSize: '0.92rem', color: '#059669', fontWeight: 900 }}>
                        ₹{(item.weightKg * item.ratePerKg).toFixed(2)}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* LOGISTICS & EXECUTIVE INFO */}
              {selectedOrder.executiveName && (
                <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Truck size={16} color="#2563eb" />
                    <div>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>EXECUTIVE / VEHICLE</span>
                      <strong style={{ color: '#0f172a' }}>{selectedOrder.executiveName}</strong>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#059669', fontWeight: 700, fontSize: '0.76rem' }}>
                    <Scale size={14} />
                    <span>Scale Certified</span>
                  </div>
                </div>
              )}

              {/* TOTAL PAYOUT SUMMARY */}
              <div style={{ background: '#0f172a', color: '#ffffff', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                    Total Settled Payout
                  </span>
                  <span style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>Paid via {selectedOrder.paymentMethod}</span>
                </div>
                <strong style={{ fontSize: '1.45rem', fontWeight: 900, color: '#fbc21a' }}>
                  ₹{selectedOrder.amount.toFixed(2)}
                </strong>
              </div>

              {/* PROMINENT INVOICE DOWNLOADING ACTION BAR */}
              <div className={styles.invoiceActionBar}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={18} color="#d97706" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                    Official Digital Tax Invoice
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <button
                    type="button"
                    className={styles.printReceiptBtn}
                    onClick={() => handleDownloadInvoice(selectedOrder)}
                  >
                    <Printer size={14} />
                    <span>Print Receipt</span>
                  </button>

                  <button
                    type="button"
                    className={styles.downloadInvoiceBtn}
                    onClick={() => handleDownloadInvoice(selectedOrder)}
                  >
                    <Download size={15} />
                    <span>Download Invoice (PDF)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL VISION LIGHTBOX MODAL */}
      {lightboxPhoto && (
        <div className={styles.modalOverlay} style={{ zIndex: 10000 }} onClick={() => setLightboxPhoto(null)}>
          <div className={styles.modalBox} style={{ maxWidth: '640px', background: '#0f172a', color: '#ffffff', border: '1px solid #334155' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                  {lightboxPhoto.title}
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#fbc21a', fontWeight: 700 }}>
                  Verified Weight: {lightboxPhoto.weight}
                </span>
              </div>
              <button type="button" className={styles.closeBtn} style={{ color: '#ffffff' }} onClick={() => setLightboxPhoto(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ width: '100%', maxHeight: '420px', borderRadius: '12px', overflow: 'hidden', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={lightboxPhoto.imageUrl} alt={lightboxPhoto.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setLightboxPhoto(null)}
                style={{
                  background: '#fbc21a',
                  color: '#0f172a',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HouseholdHistory;
