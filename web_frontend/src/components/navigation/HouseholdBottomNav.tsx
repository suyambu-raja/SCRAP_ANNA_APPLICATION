import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  PlusCircle,
  ShoppingBag,
  Clock,
} from 'lucide-react';
import styles from './HouseholdBottomNav.module.css';

export function HouseholdBottomNav() {
  const location = useLocation();

  // In the Post Scrap multi-step wizard, hide global bottom navigation
  // so the dedicated step action bar sits cleanly docked without overlap
  if (location.pathname.includes('/household/post-scrap')) {
    return null;
  }

  const navItems = [
    {
      id: 'dashboard',
      label: 'Home',
      to: '/household',
      icon: <LayoutDashboard size={20} />,
      isActive:
        location.pathname === '/household' ||
        location.pathname === '/household/',
    },
    {
      id: 'market-rates',
      label: 'Rates',
      to: '/household/rates',
      icon: <TrendingUp size={20} />,
      isActive: location.pathname.includes('/household/rates'),
    },
    {
      id: 'post-scrap',
      label: 'Post Scrap',
      to: '/household/post-scrap',
      icon: <PlusCircle size={22} />,
      isActive: location.pathname.includes('/household/post-scrap'),
      isCenterAction: true,
    },
    {
      id: 'orders',
      label: 'Orders',
      to: '/household/orders',
      icon: <ShoppingBag size={20} />,
      badge: '2',
      isActive: location.pathname.includes('/household/orders'),
    },
    {
      id: 'history',
      label: 'History',
      to: '/household/history',
      icon: <Clock size={20} />,
      isActive: location.pathname.includes('/household/history'),
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

export default HouseholdBottomNav;
