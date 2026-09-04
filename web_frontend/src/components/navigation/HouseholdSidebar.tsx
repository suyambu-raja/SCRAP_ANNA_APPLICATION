import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  LuLayoutDashboard,
  LuTrendingUp,
  LuCirclePlus,
  LuShoppingBag,
  LuPackage,
  LuClock,
  LuUser,
  LuChevronLeft,
  LuChevronRight,
  LuShieldCheck,
  LuGift,
  LuHeadphones,
} from 'react-icons/lu';
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
      icon: <LuLayoutDashboard size={19} aria-hidden="true" />,
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
      icon: <LuTrendingUp size={19} aria-hidden="true" />,
      isActive:
        location.pathname.includes('/household/rates') ||
        location.pathname.includes('/household/market-prices'),
    },
    {
      id: 'post-scrap',
      label: 'Post Scrap',
      to: '/household/post-scrap',
      icon: <LuCirclePlus size={19} aria-hidden="true" />,
      isActive: location.pathname.includes('/household/post-scrap'),
    },
    {
      id: 'orders',
      label: 'Orders',
      to: '/household/orders',
      icon: <LuShoppingBag size={19} aria-hidden="true" />,
      badge: '1',
      isActive: location.pathname === '/household/orders',
    },
    {
      id: 'reusable-products',
      label: 'Products',
      to: '/household/products',
      icon: <LuPackage size={19} aria-hidden="true" />,
      isActive: location.pathname.includes('/household/products'),
    },
    {
      id: 'history',
      label: 'History',
      to: '/household/history',
      icon: <LuClock size={19} aria-hidden="true" />,
      badge: '12',
      isActive: location.pathname.includes('/household/history'),
    },
  ];

  const secondaryNavLinks = [
    {
      id: 'profile',
      label: 'My Profile',
      to: '/household/profile',
      icon: <LuUser size={19} aria-hidden="true" />,
      isActive: location.pathname.includes('/household/profile'),
    },
    {
      id: 'refer-earn',
      label: 'Refer & Earn',
      to: '/household/refer-earn',
      icon: <LuGift size={19} aria-hidden="true" />,
      badge: '₹50',
      isActive: location.pathname.includes('/household/refer-earn'),
    },
    {
      id: 'support',
      label: 'Support',
      to: '/household/support',
      icon: <LuHeadphones size={19} aria-hidden="true" />,
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
                <span className={styles.brandName}>Bill Scrap</span>
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
                <LuCirclePlus size={18} aria-hidden="true" />
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
            <LuShieldCheck size={16} className={styles.trustIcon} aria-hidden="true" />
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
            <LuChevronRight size={17} aria-hidden="true" />
          ) : (
            <>
              <LuChevronLeft size={17} aria-hidden="true" />
              <span className={styles.toggleText}>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

export default HouseholdSidebar;
