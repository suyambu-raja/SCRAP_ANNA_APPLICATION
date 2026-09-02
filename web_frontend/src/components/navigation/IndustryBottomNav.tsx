import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  PlusCircle,
  FileText,
  Package,
} from 'lucide-react';
import styles from './IndustryBottomNav.module.css';

export function IndustryBottomNav() {
  const location = useLocation();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      to: '/industry/dashboard',
      icon: <LayoutDashboard size={20} />,
      isActive:
        location.pathname === '/industry/dashboard' ||
        location.pathname === '/industry' ||
        location.pathname === '/industry/',
    },
    {
      id: 'market-prices',
      label: 'Rates',
      to: '/industry/market-prices',
      icon: <TrendingUp size={20} />,
      isActive: location.pathname.includes('/industry/market-prices'),
    },
    {
      id: 'post-requirement',
      label: 'Post Request',
      to: '/industry/post-requirement',
      icon: <PlusCircle size={22} />,
      isActive: location.pathname.includes('/industry/post-requirement'),
      isCenterAction: true,
    },
    {
      id: 'quotes',
      label: 'Quotes',
      to: '/industry/quotes',
      icon: <FileText size={20} />,
      badge: '3',
      isActive:
        location.pathname.includes('/industry/quotes') ||
        location.pathname.includes('/industry/requests') ||
        location.pathname.includes('/industry/my-requests'),
    },
    {
      id: 'orders',
      label: 'Orders',
      to: '/industry/orders',
      icon: <Package size={20} />,
      badge: '1',
      isActive: location.pathname.includes('/industry/orders'),
    },
  ];

  return (
    <nav className={styles.mobileBottomNav} aria-label="Mobile Bottom Navigation">
      <div className={styles.navInner}>
        {navItems.map((item) => {
          if (item.isCenterAction) {
            return (
              <NavLink
                key={item.id}
                to={item.to}
                className={`${styles.navItem} ${styles.centerActionItem} ${
                  item.isActive ? styles.navItemActive : ''
                }`}
              >
                <div className={styles.centerIconWrap}>{item.icon}</div>
                <span className={styles.navLabel}>{item.label}</span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.id}
              to={item.to}
              className={`${styles.navItem} ${item.isActive ? styles.navItemActive : ''}`}
            >
              <div className={styles.iconWrap}>
                {item.icon}
                {item.badge && <span className={styles.badgePill}>{item.badge}</span>}
              </div>
              <span className={styles.navLabel}>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default IndustryBottomNav;
