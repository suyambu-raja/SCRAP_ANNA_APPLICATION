import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  PlusCircle,
  ShoppingBag,
  Clock,
  Bell,
  User,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Gift,
  Headphones,
} from 'lucide-react';
import styles from './HouseholdSidebar.module.css';

interface HouseholdSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function HouseholdSidebar({ isCollapsed, onToggle }: HouseholdSidebarProps) {
  const location = useLocation();

  const mainNavLinks = [
    {
      id: 'dashboard',
      label: 'Home',
      to: '/household',
      icon: <LayoutDashboard size={19} />,
      isActive:
        location.pathname === '/household' ||
        location.pathname === '/household/' ||
        location.pathname === '/dashboard/household' ||
        location.pathname === '/household/home',
    },
    {
      id: 'market-rates',
      label: 'Market Prices',
      to: '/household/rates',
      icon: <TrendingUp size={19} />,
      isActive:
        location.pathname.includes('/household/rates') ||
        location.pathname.includes('/household/market-prices'),
    },
    {
      id: 'post-scrap',
      label: 'Post Scrap',
      to: '/household/post-scrap',
      icon: <PlusCircle size={19} />,
      isActive: location.pathname.includes('/household/post-scrap'),
    },
    {
      id: 'orders',
      label: 'Orders',
      to: '/household/orders',
      icon: <ShoppingBag size={19} />,
      badge: '1',
      isActive: location.pathname === '/household/orders',
    },
    {
      id: 'history',
      label: 'History',
      to: '/household/history',
      icon: <Clock size={19} />,
      badge: '12',
      isActive: location.pathname.includes('/household/history'),
    },
  ];

  const secondaryNavLinks = [
    {
      id: 'profile',
      label: 'My Profile',
      to: '/household/profile',
      icon: <User size={19} />,
      isActive: location.pathname.includes('/household/profile'),
    },
    {
      id: 'refer-earn',
      label: 'Refer & Earn',
      to: '/household/refer-earn',
      icon: <Gift size={19} />,
      badge: '₹50',
      isActive: location.pathname.includes('/household/refer-earn'),
    },
    {
      id: 'support',
      label: 'Support',
      to: '/household/support',
      icon: <Headphones size={19} />,
      isActive: location.pathname.includes('/household/support'),
    },
  ];

  return (
    <aside
      className={`${styles.sidebar} ${
        isCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded
      }`}
      aria-label="Household Navigation Sidebar"
    >
      {/* 1. Header: Brand Logo & Role Tag */}
      <div className={styles.brandHeader}>
        <Link to="/household" className={styles.brandLink}>
          <div className={styles.logoWrap}>
            <svg viewBox="0 0 42 42" width="28" height="28" fill="none">
              <polygon points="21,4 37,13 37,29 21,38 5,29 5,13" fill="#fbc21a" />
              <polygon points="21,10 32,16.5 32,25.5 21,32 10,25.5 10,16.5" fill="#0f172a" />
              <path d="M 21,13 L 29,27 L 13,27 Z" fill="#fbc21a" />
            </svg>
          </div>

          {!isCollapsed && (
            <div className={styles.brandTextGroup}>
              <div className={styles.brandTitleRow}>
                <span className={styles.brandName}>Scrap Anna</span>
                <span className={styles.roleTag}>HOUSEHOLD</span>
              </div>
              <span className={styles.brandSubtitle}>Household Scrap Portal</span>
            </div>
          )}
        </Link>
      </div>

      {/* 2. Main Navigation Links */}
      <div className={styles.navContainer}>
        <div className={styles.sectionHeading}>{!isCollapsed ? 'MAIN MENU' : '•••'}</div>

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

        <div className={styles.sectionHeading} style={{ marginTop: '0.75rem' }}>
          {!isCollapsed ? 'ACCOUNT' : '•••'}
        </div>

        <nav className={styles.navLinksList}>
          {secondaryNavLinks.map((item) => (
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

        {/* 3. Have Scrap at Home CTA Card (Expanded only) */}
        {!isCollapsed && (
          <div className={styles.postCtaCard}>
            <div className={styles.postCtaHeader}>
              <div className={styles.postCtaIconBox}>
                <PlusCircle size={18} />
              </div>
              <div className={styles.postCtaTitle}>Have scrap at home?</div>
            </div>
            <p className={styles.postCtaDesc}>
              Sell your old appliances, newspapers, metals & plastics for instant doorstep cash & digital weigh-scale accuracy.
            </p>
            <Link to="/household/post-scrap" className={styles.postCtaBtn}>
              + Post Scrap
            </Link>
          </div>
        )}
      </div>

      {/* 4. Bottom Trust Badge & Collapse Toggle */}
      <div className={styles.footerWrap}>
        {!isCollapsed && (
          <div className={styles.enterpriseTrustBadge}>
            <ShieldCheck size={16} className={styles.trustIcon} />
            <span>Verified Household User</span>
          </div>
        )}

        <button
          type="button"
          onClick={onToggle}
          className={styles.toggleBtn}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight size={17} />
          ) : (
            <>
              <ChevronLeft size={17} />
              <span className={styles.toggleText}>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

export default HouseholdSidebar;
