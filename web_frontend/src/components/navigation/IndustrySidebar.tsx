import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  PlusCircle,
  ClipboardList,
  FileText,
  Package,
  Receipt,
  Building2,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import styles from './IndustrySidebar.module.css';

interface IndustrySidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function IndustrySidebar({ isCollapsed, onToggle }: IndustrySidebarProps) {
  const location = useLocation();

  const mainNavLinks = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      to: '/industry/dashboard',
      icon: <LayoutDashboard size={19} />,
      isActive: location.pathname === '/industry/dashboard' || location.pathname === '/industry',
    },
    {
      id: 'market-prices',
      label: 'Market Prices',
      to: '/industry/market-prices',
      icon: <TrendingUp size={19} />,
      isActive: location.pathname.includes('/industry/market-prices'),
    },
    {
      id: 'post-requirement',
      label: 'Post Requirement',
      to: '/industry/post-requirement',
      icon: <PlusCircle size={19} />,
      isActive: location.pathname.includes('/industry/post-requirement'),
    },
    {
      id: 'requests',
      label: 'My Requests',
      to: '/industry/requests',
      icon: <ClipboardList size={19} />,
      badge: '4',
      isActive: location.pathname === '/industry/requests',
    },
    {
      id: 'quotes',
      label: 'Quotes Received',
      to: '/industry/quotes',
      icon: <FileText size={19} />,
      badge: '12',
      isActive: location.pathname.includes('/industry/quotes'),
    },
    {
      id: 'orders',
      label: 'Orders',
      to: '/industry/orders',
      icon: <Package size={19} />,
      badge: '8',
      isActive: location.pathname.includes('/industry/orders'),
    },
    {
      id: 'transactions',
      label: 'Transactions',
      to: '/industry/transactions',
      icon: <Receipt size={19} />,
      isActive: location.pathname.includes('/industry/transactions'),
    },
    {
      id: 'profile',
      label: 'Industry Profile',
      to: '/industry/profile',
      icon: <Building2 size={19} />,
      isActive: location.pathname.includes('/industry/profile'),
    },
  ];

  return (
    <aside
      className={`${styles.sidebar} ${
        isCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded
      }`}
      aria-label="Industry Navigation Sidebar"
    >
      {/* 1. Header: Brand Logo & Role Tag */}
      <div className={styles.brandHeader}>
        <Link to="/industry/dashboard" className={styles.brandLink}>
          <div className={styles.logoWrap}>
            <img src="/logo-icon.png" alt="Scrap Anna" className={styles.logoIcon} />
          </div>

          {!isCollapsed && (
            <div className={styles.brandTextGroup}>
              <div className={styles.brandTitleRow}>
                <span className={styles.brandName}>Scrap Anna</span>
                <span className={styles.roleTag}>INDUSTRY</span>
              </div>
              <span className={styles.brandSubtitle}>B2B Enterprise Portal</span>
            </div>
          )}
        </Link>
      </div>

      {/* 2. Main Navigation Links */}
      <div className={styles.navContainer}>
        <div className={styles.sectionHeading}>
          {!isCollapsed ? 'MAIN MENU' : '•••'}
        </div>

        <nav className={styles.navLinksList}>
          {mainNavLinks.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              className={`${styles.navItem} ${item.isActive ? styles.navItemActive : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className={styles.navItemIcon}>{item.icon}</div>

              {!isCollapsed && (
                <div className={styles.navItemContent}>
                  <span className={styles.navItemLabel}>{item.label}</span>
                  {item.badge && <span className={styles.navItemBadge}>{item.badge}</span>}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* 3. Post Requirement Quick CTA (Expanded only) */}
        {!isCollapsed && (
          <div className={styles.postCtaCard}>
            <div className={styles.postCtaHeader}>
              <div className={styles.postCtaIconBox}>
                <PlusCircle size={18} />
              </div>
              <div className={styles.postCtaTitle}>Have scrap to sell?</div>
            </div>
            <p className={styles.postCtaDesc}>
              Post your bulk scrap and receive competitive quotes from verified merchants within 30 minutes.
            </p>
            <Link to="/industry/post-requirement" className={styles.postCtaBtn}>
              <span>+ Post Requirement</span>
            </Link>
          </div>
        )}
      </div>

      {/* 4. Footer & Collapse Button */}
      <div className={styles.footerWrap}>
        {!isCollapsed && (
          <div className={styles.enterpriseTrustBadge}>
            <ShieldCheck size={14} className={styles.trustIcon} />
            <span>Verified Enterprise</span>
          </div>
        )}

        <button
          type="button"
          className={styles.toggleBtn}
          onClick={onToggle}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!isCollapsed && <span className={styles.toggleText}>Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
}
