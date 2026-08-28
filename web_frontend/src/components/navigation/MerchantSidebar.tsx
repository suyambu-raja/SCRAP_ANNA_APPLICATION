import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Package,
  Truck,
  Receipt,
  Leaf,
  MessageSquare,
  User as UserIcon,
  PlusCircle,
  Gift,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import styles from './MerchantSidebar.module.css';

interface MerchantSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function MerchantSidebar({ isCollapsed, onToggle }: MerchantSidebarProps) {
  const location = useLocation();

  const mainNavLinks = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      to: '/dashboard/merchant',
      icon: <LayoutDashboard size={19} />,
      isActive: location.pathname === '/dashboard/merchant' || location.pathname === '/merchant' || location.pathname === '/app/home',
    },
    {
      id: 'market-prices',
      label: 'Market Prices',
      to: '/market-prices',
      icon: <TrendingUp size={19} />,
      isActive: location.pathname.includes('/market-prices'),
    },
    {
      id: 'requests',
      label: 'Requests',
      to: '/requests',
      icon: <ClipboardList size={19} />,
      badge: '18',
      isActive: location.pathname.includes('/requests'),
    },
    {
      id: 'quotes',
      label: 'My Quotes',
      to: '/quotes',
      icon: <FileText size={19} />,
      badge: '32',
      isActive: location.pathname.includes('/quotes') || location.pathname.includes('/merchant-offers'),
    },
    {
      id: 'orders',
      label: 'Orders',
      to: '/orders',
      icon: <Package size={19} />,
      badge: '56',
      isActive: location.pathname.includes('/orders'),
    },
    {
      id: 'ride',
      label: 'Ride / Pickups',
      to: '/ride',
      icon: <Truck size={19} />,
      isActive: location.pathname.includes('/ride'),
    },
    {
      id: 'transactions',
      label: 'Transactions',
      to: '/transactions',
      icon: <Receipt size={19} />,
      isActive: location.pathname.includes('/transactions'),
    },
    {
      id: 'reusable-products',
      label: 'Reusable Products',
      to: '/reusable-products',
      icon: <Leaf size={19} />,
      isActive: location.pathname.includes('/reusable-products') || location.pathname.includes('/marketplace'),
    },
    {
      id: 'profile',
      label: 'Profile',
      to: '/profile',
      icon: <UserIcon size={19} />,
      isActive: location.pathname === '/profile',
    },
  ];

  const quickActions = [
    {
      id: 'post-scrap',
      label: 'Post Scrap',
      to: '/reusable-products',
      icon: <PlusCircle size={17} />,
    },
    {
      id: 'refer-earn',
      label: 'Refer & Earn',
      to: '#refer',
      icon: <Gift size={17} />,
    },
    {
      id: 'support',
      label: 'Support',
      to: '#support',
      icon: <HelpCircle size={17} />,
    },
  ];

  return (
    <aside
      className={`${styles.sidebarContainer} ${
        isCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded
      }`}
      aria-label="Merchant Navigation Sidebar"
    >
      <div className={styles.sidebarTop}>
        {/* Brand Header */}
        <Link to="/dashboard/merchant" className={styles.brandHeader} title="Scrap Anna Merchant">
          <div className={styles.brandGroup}>
            <div className={styles.brandLogoBox}>
              <img
                src="/logo.png"
                alt="Scrap Anna Logo"
                className={styles.logoImg}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo-icon.png';
                }}
              />
            </div>
            {!isCollapsed && (
              <div className={styles.brandTextCol}>
                <span className={styles.brandTitle}>
                  SCRAP <span className={styles.brandTitleHighlight}>ANNA</span>
                </span>
                <span className={styles.brandSubtitle}>
                  CONNECT • COLLECT • RECYCLE
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Main Menu Header */}
        {!isCollapsed && <div className={styles.sectionHeaderTitle}>MAIN MENU</div>}

        {/* Navigation Links */}
        <ul className={styles.navList}>
          {mainNavLinks.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.to}
                className={`${styles.navLink} ${item.isActive ? styles.navLinkActive : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                {item.isActive && <div className={styles.activeAccentBar} />}
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
                {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Quick Actions Header */}
        {!isCollapsed && <div className={styles.sectionHeaderTitle}>QUICK ACTIONS</div>}

        {/* Quick Actions Links */}
        <ul className={styles.quickActionsList}>
          {quickActions.map((item) => (
            <li key={item.id}>
              <Link
                to={item.to}
                className={styles.navLink}
                title={isCollapsed ? item.label : undefined}
                onClick={(e) => {
                  if (item.to.startsWith('#')) e.preventDefault();
                }}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Promo Box (Profile Completion) */}
        {!isCollapsed && (
          <div className={styles.promoCard}>
            <div className={styles.promoTitle}>Grow your business</div>
            <div className={styles.promoSub}>Complete your profile and get more orders and visibility.</div>
            <Link to="/profile" className={styles.promoBtn}>
              <span>Complete Profile</span>
              <ArrowRight size={13} />
            </Link>
            <div>
              <div className={styles.profileStrengthRow}>
                <span>Profile Strength</span>
                <strong style={{ color: '#0f172a' }}>85%</strong>
              </div>
              <div className={styles.strengthBarTrack}>
                <div className={styles.strengthBarFill} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Collapse Toggle */}
      <div className={styles.sidebarBottom}>
        <button
          type="button"
          className={styles.collapseToggleBtn}
          onClick={onToggle}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          <span className={styles.toggleText}>Collapse</span>
        </button>
      </div>
    </aside>
  );
}
