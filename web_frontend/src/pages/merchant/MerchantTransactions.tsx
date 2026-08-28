import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  CheckCircle2,
  Clock,
  BarChart3,
  Download,
  Search,
  ChevronDown,
  RotateCcw,
  Eye,
  X,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import styles from './MerchantTransactions.module.css';

interface TransactionItem {
  id: string;
  orderId: string;
  customerName: string;
  customerLocation: string;
  material: string;
  materialImg: string;
  quantity: string;
  ratePerKg: string;
  amount: string;
  scrapValue: string;
  platformCharges: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  dateTime: string;
  orderStatus: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  paymentMethod: string;
  timeline: {
    title: string;
    time: string;
  }[];
}

const TRANSACTIONS_DATA: TransactionItem[] = [
  {
    id: 'TXN-2025-00125',
    orderId: 'ORD-SA-1251',
    customerName: 'Sri Venkatesh Industries',
    customerLocation: 'Guindy Industrial Estate, Chennai',
    material: 'Iron Scrap',
    materialImg: '/scrap-iron.png',
    quantity: '2.5 TON',
    ratePerKg: '₹ 18.50 / kg',
    amount: '₹ 46,250',
    scrapValue: '₹ 46,250',
    platformCharges: '₹ 0',
    paymentStatus: 'Paid',
    dateTime: '16 May 2025, 10:30 AM',
    orderStatus: 'Completed',
    paymentMethod: 'UPI / Bank Transfer',
    timeline: [
      { title: 'Order Accepted', time: '16 May 2025, 09:15 AM' },
      { title: 'Scrap Collected', time: '16 May 2025, 09:45 AM' },
      { title: 'OTP Verified', time: '16 May 2025, 10:05 AM' },
      { title: 'Bill Generated', time: '16 May 2025, 10:20 AM' },
      { title: 'Payment Completed', time: '16 May 2025, 10:30 AM' },
    ],
  },
  {
    id: 'TXN-2025-00124',
    orderId: 'ORD-SA-1250',
    customerName: 'ABC Manufacturing',
    customerLocation: 'Ambattur Industrial Estate, Chennai',
    material: 'Copper Scrap',
    materialImg: '/scrap-copper.png',
    quantity: '850 KG',
    ratePerKg: '₹ 720.00 / kg',
    amount: '₹ 6,12,000',
    scrapValue: '₹ 6,12,000',
    platformCharges: '₹ 0',
    paymentStatus: 'Paid',
    dateTime: '15 May 2025, 04:15 PM',
    orderStatus: 'Completed',
    paymentMethod: 'NEFT / RTGS Transfer',
    timeline: [
      { title: 'Order Accepted', time: '15 May 2025, 02:30 PM' },
      { title: 'Scrap Collected', time: '15 May 2025, 03:20 PM' },
      { title: 'OTP Verified', time: '15 May 2025, 03:45 PM' },
      { title: 'Bill Generated', time: '15 May 2025, 04:00 PM' },
      { title: 'Payment Completed', time: '15 May 2025, 04:15 PM' },
    ],
  },
  {
    id: 'TXN-2025-00123',
    orderId: 'ORD-SA-1248',
    customerName: 'Sai Industries',
    customerLocation: 'Padi High Road, Chennai',
    material: 'Aluminium Scrap',
    materialImg: '/scrap-aluminium.png',
    quantity: '1.2 TON',
    ratePerKg: '₹ 90.00 / kg',
    amount: '₹ 1,08,000',
    scrapValue: '₹ 1,08,000',
    platformCharges: '₹ 0',
    paymentStatus: 'Paid',
    dateTime: '15 May 2025, 11:20 AM',
    orderStatus: 'Completed',
    paymentMethod: 'UPI / Bank Transfer',
    timeline: [
      { title: 'Order Accepted', time: '15 May 2025, 10:00 AM' },
      { title: 'Scrap Collected', time: '15 May 2025, 10:40 AM' },
      { title: 'OTP Verified', time: '15 May 2025, 11:00 AM' },
      { title: 'Bill Generated', time: '15 May 2025, 11:10 AM' },
      { title: 'Payment Completed', time: '15 May 2025, 11:20 AM' },
    ],
  },
  {
    id: 'TXN-2025-00122',
    orderId: 'ORD-SA-1246',
    customerName: 'VNR Enterprises',
    customerLocation: 'Porur Main Road, Chennai',
    material: 'Brass Scrap',
    materialImg: '/scrap-brass.png',
    quantity: '600 KG',
    ratePerKg: '₹ 460.00 / kg',
    amount: '₹ 2,76,000',
    scrapValue: '₹ 2,76,000',
    platformCharges: '₹ 0',
    paymentStatus: 'Pending',
    dateTime: '14 May 2025, 03:40 PM',
    orderStatus: 'Completed',
    paymentMethod: 'Bank Transfer (Awaiting Clearance)',
    timeline: [
      { title: 'Order Accepted', time: '14 May 2025, 02:00 PM' },
      { title: 'Scrap Collected', time: '14 May 2025, 02:45 PM' },
      { title: 'OTP Verified', time: '14 May 2025, 03:15 PM' },
      { title: 'Bill Generated', time: '14 May 2025, 03:30 PM' },
      { title: 'Payment Initiated', time: '14 May 2025, 03:40 PM' },
    ],
  },
  {
    id: 'TXN-2025-00121',
    orderId: 'ORD-SA-1245',
    customerName: 'Green Tech Solutions',
    customerLocation: 'Velachery 100 Feet Road, Chennai',
    material: 'Plastic Scrap',
    materialImg: '/scrap-plastic.png',
    quantity: '500 KG',
    ratePerKg: '₹ 25.00 / kg',
    amount: '₹ 12,500',
    scrapValue: '₹ 12,500',
    platformCharges: '₹ 0',
    paymentStatus: 'Paid',
    dateTime: '14 May 2025, 01:10 PM',
    orderStatus: 'Completed',
    paymentMethod: 'UPI Instant',
    timeline: [
      { title: 'Order Accepted', time: '14 May 2025, 11:30 AM' },
      { title: 'Scrap Collected', time: '14 May 2025, 12:15 PM' },
      { title: 'OTP Verified', time: '14 May 2025, 12:45 PM' },
      { title: 'Bill Generated', time: '14 May 2025, 01:00 PM' },
      { title: 'Payment Completed', time: '14 May 2025, 01:10 PM' },
    ],
  },
  {
    id: 'TXN-2025-00120',
    orderId: 'ORD-SA-1243',
    customerName: 'Chennai Auto Parts',
    customerLocation: 'Perambur, Chennai',
    material: 'Iron Scrap',
    materialImg: '/scrap-iron.png',
    quantity: '800 KG',
    ratePerKg: '₹ 18.00 / kg',
    amount: '₹ 14,400',
    scrapValue: '₹ 14,400',
    platformCharges: '₹ 0',
    paymentStatus: 'Failed',
    dateTime: '13 May 2025, 09:05 AM',
    orderStatus: 'Failed',
    paymentMethod: 'Bank Server Timeout',
    timeline: [
      { title: 'Order Accepted', time: '13 May 2025, 08:00 AM' },
      { title: 'Scrap Collected', time: '13 May 2025, 08:35 AM' },
      { title: 'OTP Verified', time: '13 May 2025, 08:50 AM' },
      { title: 'Bill Generated', time: '13 May 2025, 09:00 AM' },
      { title: 'Payment Failed', time: '13 May 2025, 09:05 AM' },
    ],
  },
  {
    id: 'TXN-2025-00119',
    orderId: 'ORD-SA-1242',
    customerName: 'Urban Infra Projects',
    customerLocation: 'Avadi, Chennai',
    material: 'E-Waste',
    materialImg: '/scrap-iron.png',
    quantity: '120 KG',
    ratePerKg: '₹ 40.00 / kg',
    amount: '₹ 4,800',
    scrapValue: '₹ 4,800',
    platformCharges: '₹ 0',
    paymentStatus: 'Refunded',
    dateTime: '12 May 2025, 06:25 PM',
    orderStatus: 'Refunded',
    paymentMethod: 'Original Source (Refunded)',
    timeline: [
      { title: 'Order Accepted', time: '12 May 2025, 04:30 PM' },
      { title: 'Scrap Collected', time: '12 May 2025, 05:15 PM' },
      { title: 'OTP Verified', time: '12 May 2025, 05:40 PM' },
      { title: 'Dispute Raised', time: '12 May 2025, 06:00 PM' },
      { title: 'Payment Refunded', time: '12 May 2025, 06:25 PM' },
    ],
  },
];

export default function MerchantTransactions() {
  const [selectedTxn, setSelectedTxn] = useState<TransactionItem | null>(TRANSACTIONS_DATA[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [materialFilter, setMaterialFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('This Month');
  const [activePage, setActivePage] = useState(1);

  const filteredData = TRANSACTIONS_DATA.filter((txn) => {
    const matchesSearch =
      txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || txn.orderStatus === statusFilter;
    const matchesMaterial = materialFilter === 'All' || txn.material.includes(materialFilter);
    const matchesPayment = paymentFilter === 'All' || txn.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesMaterial && matchesPayment;
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setMaterialFilter('All');
    setPaymentFilter('All');
    setDateFilter('This Month');
  };

  return (
    <div className={styles.pageContainer}>
      {/* 1. Page Header */}
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <h1 className={styles.pageTitle}>Transactions</h1>
          <p className={styles.pageSubtitle}>
            Track your completed orders, payments and earnings.
          </p>
        </div>

        <div className={styles.headerActions}>
          <button type="button" className={styles.dateRangeBtn}>
            <span>16 May 2025 - 16 May 2025</span>
            <ChevronDown size={14} />
          </button>

          <button type="button" className={styles.downloadReportBtn}>
            <Download size={16} />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Summary Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIconCircle} ${styles.iconAmber}`}>
            <Wallet size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Total Earnings</span>
            <span className={styles.statValue}>₹3,65,780</span>
            <span className={styles.statTrend}>
              <strong className={styles.trendGreen}>↑ 24%</strong> vs last month
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIconCircle} ${styles.iconGreen}`}>
            <CheckCircle2 size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Completed Transactions</span>
            <span className={styles.statValue}>158</span>
            <span className={styles.statTrend}>
              <strong className={styles.trendGreen}>↑ 18%</strong> vs last month
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIconCircle} ${styles.iconOrange}`}>
            <Clock size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Pending Payments</span>
            <span className={styles.statValue}>₹18,500</span>
            <span className={styles.statTrend}>
              <strong className={styles.trendRed}>↓ 8%</strong> vs last month
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIconCircle} ${styles.iconBlue}`}>
            <BarChart3 size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>This Month Earnings</span>
            <span className={styles.statValue}>₹72,450</span>
            <span className={styles.statTrend}>
              <strong className={styles.trendGreen}>↑ 20%</strong> vs last month
            </span>
          </div>
        </div>
      </div>

      {/* 3. Two-Column Layout (Main Table/Charts + Right Detail Panel) */}
      <div
        className={`${styles.contentGrid} ${
          selectedTxn ? styles.contentGridWithDetail : ''
        }`}
      >
        {/* Main Content Column */}
        <div className={styles.mainCol}>
          {/* Filters Bar */}
          <div className={styles.filterCard}>
            <div className={styles.searchBox}>
              <Search size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search by Order ID, Transaction ID or Customer"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filterSelectsGroup}>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="This Month">Date: This Month</option>
                <option value="Last Month">Date: Last Month</option>
                <option value="Last 3 Months">Date: Last 3 Months</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="All">Status: All</option>
                <option value="Completed">Status: Completed</option>
                <option value="Pending">Status: Pending</option>
                <option value="Failed">Status: Failed</option>
                <option value="Refunded">Status: Refunded</option>
              </select>

              <select
                value={materialFilter}
                onChange={(e) => setMaterialFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="All">Material: All</option>
                <option value="Iron">Material: Iron</option>
                <option value="Copper">Material: Copper</option>
                <option value="Aluminium">Material: Aluminium</option>
                <option value="Brass">Material: Brass</option>
                <option value="Plastic">Material: Plastic</option>
              </select>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="All">Payment: All</option>
                <option value="Paid">Payment: Paid</option>
                <option value="Pending">Payment: Pending</option>
                <option value="Failed">Payment: Failed</option>
                <option value="Refunded">Payment: Refunded</option>
              </select>

              <button
                type="button"
                className={styles.clearFiltersBtn}
                onClick={handleClearFilters}
              >
                <RotateCcw size={13} />
                <span>Clear Filters</span>
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className={styles.tableContainer}>
            <div className={styles.tableWrapper}>
              <table className={styles.transactionsTable}>
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Order ID</th>
                    <th>Customer / Industry</th>
                    <th>Material</th>
                    <th>Quantity</th>
                    <th>Order Amount</th>
                    <th>Payment</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((txn) => {
                    const isSelected = selectedTxn?.id === txn.id;
                    return (
                      <tr
                        key={txn.id}
                        className={`${styles.tableRow} ${
                          isSelected ? styles.tableRowSelected : ''
                        }`}
                        onClick={() => setSelectedTxn(txn)}
                      >
                        <td className={styles.txnIdText}>{txn.id}</td>
                        <td className={styles.orderIdText}>{txn.orderId}</td>
                        <td className={styles.customerText}>{txn.customerName}</td>
                        <td>{txn.material}</td>
                        <td>{txn.quantity}</td>
                        <td className={styles.amountText}>{txn.amount}</td>
                        <td>
                          <span
                            className={
                              txn.paymentStatus === 'Paid'
                                ? styles.pillPaid
                                : txn.paymentStatus === 'Pending'
                                ? styles.pillPending
                                : txn.paymentStatus === 'Failed'
                                ? styles.pillFailed
                                : styles.pillRefunded
                            }
                          >
                            {txn.paymentStatus}
                          </span>
                        </td>
                        <td>{txn.dateTime}</td>
                        <td>
                          <span
                            className={
                              txn.orderStatus === 'Completed'
                                ? styles.pillCompleted
                                : txn.orderStatus === 'Pending'
                                ? styles.pillPending
                                : txn.orderStatus === 'Failed'
                                ? styles.pillFailed
                                : styles.pillRefunded
                            }
                          >
                            {txn.orderStatus}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className={styles.actionEyeBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTxn(txn);
                            }}
                            title="View Transaction Details"
                          >
                            <Eye size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className={styles.tableFooter}>
              <span>Showing 1 to 7 of 158 transactions</span>
              <div className={styles.paginationControls}>
                <button type="button" className={styles.pageBtn}>
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  className={`${styles.pageBtn} ${activePage === 1 ? styles.pageBtnActive : ''}`}
                  onClick={() => setActivePage(1)}
                >
                  1
                </button>
                <button
                  type="button"
                  className={`${styles.pageBtn} ${activePage === 2 ? styles.pageBtnActive : ''}`}
                  onClick={() => setActivePage(2)}
                >
                  2
                </button>
                <button
                  type="button"
                  className={`${styles.pageBtn} ${activePage === 3 ? styles.pageBtnActive : ''}`}
                  onClick={() => setActivePage(3)}
                >
                  3
                </button>
                <span className={styles.pageEllipsis}>...</span>
                <button
                  type="button"
                  className={`${styles.pageBtn} ${activePage === 23 ? styles.pageBtnActive : ''}`}
                  onClick={() => setActivePage(23)}
                >
                  23
                </button>
                <button type="button" className={styles.pageBtn}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* 4. Two Side-by-Side Analytics Charts */}
          <div className={styles.chartsGrid}>
            {/* Chart 1: Earnings Overview (Last 6 Months) */}
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>Earnings Overview (Last 6 Months)</h3>
                <a
                  href="#report"
                  className={styles.viewReportLink}
                  onClick={(e) => e.preventDefault()}
                >
                  <span>View Full Report</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              <div className={styles.svgChartWrapper}>
                <svg viewBox="0 0 450 180" width="100%" height="100%">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="430" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="40" y1="60" x2="430" y2="60" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="40" y1="100" x2="430" y2="100" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="40" y1="140" x2="430" y2="140" stroke="#e2e8f0" />

                  {/* Y-Axis Labels */}
                  <text x="5" y="24" fontSize="9" fill="#94a3b8">₹1,00,000</text>
                  <text x="12" y="64" fontSize="9" fill="#94a3b8">₹75,000</text>
                  <text x="12" y="104" fontSize="9" fill="#94a3b8">₹50,000</text>
                  <text x="12" y="144" fontSize="9" fill="#94a3b8">₹25,000</text>
                  <text x="28" y="160" fontSize="9" fill="#94a3b8">₹0</text>

                  {/* Bars (Soft Yellow) */}
                  <rect x="72" y="90" width="28" height="50" fill="#fef3c7" rx="4" />
                  <rect x="132" y="70" width="28" height="70" fill="#fef3c7" rx="4" />
                  <rect x="192" y="58" width="28" height="82" fill="#fef3c7" rx="4" />
                  <rect x="252" y="64" width="28" height="76" fill="#fef3c7" rx="4" />
                  <rect x="312" y="48" width="28" height="92" fill="#fef3c7" rx="4" />
                  <rect x="372" y="42" width="28" height="98" fill="#fef3c7" rx="4" />

                  {/* Trend Polyline */}
                  <polyline
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="86,90 146,70 206,58 266,64 326,48 386,42"
                  />

                  {/* Points and Values */}
                  <circle cx="86" cy="90" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                  <text x="86" y="80" fontSize="9.5" fontWeight="700" fill="#0f172a" textAnchor="middle">₹42,500</text>

                  <circle cx="146" cy="70" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                  <text x="146" y="60" fontSize="9.5" fontWeight="700" fill="#0f172a" textAnchor="middle">₹55,200</text>

                  <circle cx="206" cy="58" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                  <text x="206" y="48" fontSize="9.5" fontWeight="700" fill="#0f172a" textAnchor="middle">₹61,800</text>

                  <circle cx="266" cy="64" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                  <text x="266" y="54" fontSize="9.5" fontWeight="700" fill="#0f172a" textAnchor="middle">₹58,400</text>

                  <circle cx="326" cy="48" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                  <text x="326" y="38" fontSize="9.5" fontWeight="700" fill="#0f172a" textAnchor="middle">₹68,200</text>

                  <circle cx="386" cy="42" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                  <text x="386" y="32" fontSize="9.5" fontWeight="700" fill="#0f172a" textAnchor="middle">₹72,450</text>

                  {/* X-Axis Labels */}
                  <text x="86" y="165" fontSize="9.5" fill="#64748b" textAnchor="middle">Mar 2025</text>
                  <text x="146" y="165" fontSize="9.5" fill="#64748b" textAnchor="middle">Apr 2025</text>
                  <text x="206" y="165" fontSize="9.5" fill="#64748b" textAnchor="middle">May 2025</text>
                  <text x="266" y="165" fontSize="9.5" fill="#64748b" textAnchor="middle">Jun 2025</text>
                  <text x="326" y="165" fontSize="9.5" fill="#64748b" textAnchor="middle">Jul 2025</text>
                  <text x="386" y="165" fontSize="9.5" fill="#64748b" textAnchor="middle">Aug 2025</text>
                </svg>
              </div>

              <div className={styles.chartLegendBottom}>
                <div className={styles.legendColorBar} />
                <span>Earnings (₹)</span>
              </div>
            </div>

            {/* Chart 2: Earnings by Material (This Month) */}
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>Earnings by Material (This Month)</h3>
              </div>

              <div className={styles.donutLayout}>
                <div className={styles.donutSvgBox}>
                  <svg viewBox="0 0 160 160" width="100%" height="100%">
                    {/* Donut Segments (Total = 100, Circumference = 2 * PI * 55 = 345.57) */}
                    <circle cx="80" cy="80" r="55" fill="none" stroke="#f1f5f9" strokeWidth="22" />
                    
                    {/* Iron 45% (Blue) */}
                    <circle
                      cx="80"
                      cy="80"
                      r="55"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="22"
                      strokeDasharray="155.5 345.57"
                      strokeDashoffset="0"
                      transform="rotate(-90 80 80)"
                    />

                    {/* Copper 25% (Orange) */}
                    <circle
                      cx="80"
                      cy="80"
                      r="55"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="22"
                      strokeDasharray="86.4 345.57"
                      strokeDashoffset="-155.5"
                      transform="rotate(-90 80 80)"
                    />

                    {/* Aluminium 15% (Cyan) */}
                    <circle
                      cx="80"
                      cy="80"
                      r="55"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="22"
                      strokeDasharray="51.8 345.57"
                      strokeDashoffset="-241.9"
                      transform="rotate(-90 80 80)"
                    />

                    {/* Brass 8% (Yellow/Amber) */}
                    <circle
                      cx="80"
                      cy="80"
                      r="55"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="22"
                      strokeDasharray="27.6 345.57"
                      strokeDashoffset="-293.7"
                      transform="rotate(-90 80 80)"
                    />

                    {/* Others 7% (Purple) */}
                    <circle
                      cx="80"
                      cy="80"
                      r="55"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="22"
                      strokeDasharray="24.2 345.57"
                      strokeDashoffset="-321.3"
                      transform="rotate(-90 80 80)"
                    />
                  </svg>

                  <div className={styles.donutCenterText}>
                    <span className={styles.donutAmount}>₹72,450</span>
                    <span className={styles.donutLabel}>Total</span>
                  </div>
                </div>

                <div className={styles.donutLegendList}>
                  <div className={styles.donutLegendItem}>
                    <div className={styles.donutMaterialLeft}>
                      <span className={styles.donutDot} style={{ backgroundColor: '#2563eb' }} />
                      <span>Iron Scrap</span>
                    </div>
                    <div className={styles.donutValuesRight}>
                      <span className={styles.donutPercent}>45%</span>
                      <span className={styles.donutValue}>₹32,500</span>
                    </div>
                  </div>

                  <div className={styles.donutLegendItem}>
                    <div className={styles.donutMaterialLeft}>
                      <span className={styles.donutDot} style={{ backgroundColor: '#f97316' }} />
                      <span>Copper Scrap</span>
                    </div>
                    <div className={styles.donutValuesRight}>
                      <span className={styles.donutPercent}>25%</span>
                      <span className={styles.donutValue}>₹18,000</span>
                    </div>
                  </div>

                  <div className={styles.donutLegendItem}>
                    <div className={styles.donutMaterialLeft}>
                      <span className={styles.donutDot} style={{ backgroundColor: '#06b6d4' }} />
                      <span>Aluminium Scrap</span>
                    </div>
                    <div className={styles.donutValuesRight}>
                      <span className={styles.donutPercent}>15%</span>
                      <span className={styles.donutValue}>₹10,800</span>
                    </div>
                  </div>

                  <div className={styles.donutLegendItem}>
                    <div className={styles.donutMaterialLeft}>
                      <span className={styles.donutDot} style={{ backgroundColor: '#f59e0b' }} />
                      <span>Brass Scrap</span>
                    </div>
                    <div className={styles.donutValuesRight}>
                      <span className={styles.donutPercent}>8%</span>
                      <span className={styles.donutValue}>₹5,700</span>
                    </div>
                  </div>

                  <div className={styles.donutLegendItem}>
                    <div className={styles.donutMaterialLeft}>
                      <span className={styles.donutDot} style={{ backgroundColor: '#8b5cf6' }} />
                      <span>Others</span>
                    </div>
                    <div className={styles.donutValuesRight}>
                      <span className={styles.donutPercent}>7%</span>
                      <span className={styles.donutValue}>₹5,450</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Right-Side Detail Panel (Transaction Details) */}
        {selectedTxn && (
          <aside className={styles.detailPanel}>
            <div className={styles.detailHeader}>
              <h3 className={styles.detailTitle}>Transaction Details</h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setSelectedTxn(null)}
                aria-label="Close details"
              >
                <X size={18} />
              </button>
            </div>

            {/* Status Header */}
            <div className={styles.statusHeaderBlock}>
              <div className={styles.statusHeaderLeft}>
                <div className={styles.checkCircleGreen}>
                  <CheckCircle2 size={16} />
                </div>
                <div className={styles.txnHeadingText}>
                  <span className={styles.txnHeadingId}>{selectedTxn.id}</span>
                  <span className={styles.txnHeadingOrder}>Order ID: {selectedTxn.orderId}</span>
                </div>
              </div>
              <span className={styles.pillCompleted}>{selectedTxn.orderStatus}</span>
            </div>

            {/* Customer / Industry */}
            <div className={styles.detailSection}>
              <h4 className={styles.detailSectionTitle}>Customer / Industry</h4>
              <div className={styles.customerCardBox}>
                <span className={styles.customerNameText}>{selectedTxn.customerName}</span>
                <span className={styles.customerLocText}>
                  <MapPin size={13} color="#2563eb" />
                  <span>{selectedTxn.customerLocation}</span>
                </span>
              </div>
            </div>

            {/* Scrap Details */}
            <div className={styles.detailSection}>
              <h4 className={styles.detailSectionTitle}>Scrap Details</h4>
              <div className={styles.scrapDetailRow}>
                <img
                  src={selectedTxn.materialImg}
                  alt={selectedTxn.material}
                  className={styles.scrapImgMini}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.png';
                  }}
                />
                <div className={styles.scrapDetailMeta}>
                  <div className={styles.scrapMetaItem}>
                    <span className={styles.scrapMetaLabel}>Material</span>
                    <span className={styles.scrapMetaValue}>{selectedTxn.material}</span>
                  </div>
                  <div className={styles.scrapMetaItem}>
                    <span className={styles.scrapMetaLabel}>Quantity</span>
                    <span className={styles.scrapMetaValue}>{selectedTxn.quantity}</span>
                  </div>
                  <div className={styles.scrapMetaItem} style={{ gridColumn: 'span 2' }}>
                    <span className={styles.scrapMetaLabel}>Rate</span>
                    <span className={styles.scrapMetaValue}>{selectedTxn.ratePerKg}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className={styles.detailSection}>
              <h4 className={styles.detailSectionTitle}>Payment Summary</h4>
              <div className={styles.paymentSummaryBox}>
                <div className={styles.paymentSummaryRow}>
                  <span>Scrap Value</span>
                  <span>{selectedTxn.scrapValue}</span>
                </div>
                <div className={styles.paymentSummaryRow}>
                  <span>Platform Charges</span>
                  <span>{selectedTxn.platformCharges}</span>
                </div>
                <div className={styles.netAmountRow}>
                  <span>Net Amount</span>
                  <span className={styles.netAmountGreen}>{selectedTxn.amount}</span>
                </div>
              </div>

              <div className={styles.metaInfoList}>
                <div className={styles.metaInfoRow}>
                  <span>Payment Method</span>
                  <strong style={{ color: '#0f172a' }}>{selectedTxn.paymentMethod}</strong>
                </div>
                <div className={styles.metaInfoRow}>
                  <span>Payment Status</span>
                  <strong style={{ color: '#16a34a' }}>{selectedTxn.paymentStatus}</strong>
                </div>
                <div className={styles.metaInfoRow}>
                  <span>Transaction Date</span>
                  <span>{selectedTxn.dateTime}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={styles.detailActionsRow}>
              <button type="button" className={styles.downloadInvoiceBtn}>
                <Download size={14} />
                <span>Download Invoice</span>
              </button>
              <Link to="/orders" className={styles.viewOrderBtn}>
                <span>View Order</span>
                <ExternalLink size={13} />
              </Link>
            </div>

            {/* Order Timeline */}
            <div className={styles.detailSection}>
              <h4 className={styles.detailSectionTitle}>Order Timeline</h4>
              <div className={styles.timelineList}>
                {selectedTxn.timeline.map((step, idx) => (
                  <div key={idx} className={styles.timelineStep}>
                    <div className={styles.timelineIconCol}>
                      <div className={styles.stepCheckCircle}>
                        <CheckCircle2 size={13} />
                      </div>
                      {idx < selectedTxn.timeline.length - 1 && (
                        <div className={styles.timelineStepLine} />
                      )}
                    </div>
                    <div className={styles.timelineTextCol}>
                      <span className={styles.timelineTitle}>{step.title}</span>
                      <span className={styles.timelineTime}>{step.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
