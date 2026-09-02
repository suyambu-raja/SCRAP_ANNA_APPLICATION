import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  TrendingUp,
  ClipboardList,
  Package,
  Recycle,
} from 'lucide-react';
import styles from './MerchantBottomNav.module.css';

export function MerchantBottomNav() {
  const location = useLocation();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      to: '/dashboard/merchant',
      icon: <Home size={20} />,
      isActive:
        location.pathname === '/dashboard/merchant' ||
        location.pathname === '/merchant' ||
        location.pathname === '/app/home' ||
        location.pathname === '/app',
    },
    {
      id: 'market-prices',
      label: 'Rates',
      to: '/merchant/market-prices',
      icon: <TrendingUp size={20} />,
      isActive: location.pathname.includes('/market-prices'),
    },
    {
      id: 'orders',
      label: 'Orders',
      to: '/orders',
      icon: <Package size={22} />,
      badge: '3',
      isActive:
        location.pathname.includes('/orders') ||
        location.pathname.includes('/ride'),
      isCenterAction: true,
    },
    {
      id: 'requests',
      label: 'Requests',
      to: '/requests',
      icon: <ClipboardList size={20} />,
      badge: '18',
      isActive:
        location.pathname.includes('/requests') ||
        location.pathname.includes('/quotes') ||
        location.pathname.includes('/merchant-offers'),
    },
    {
      id: 'products',
      label: 'Products',
      to: '/reusable-products',
      icon: <Recycle size={20} />,
      isActive:
        location.pathname.includes('/reusable-products') ||
        location.pathname.includes('/marketplace'),
    },
  ];

  return (
    <nav className={styles.mobileBottomNav} aria-label="Merchant Mobile Bottom Navigation">
      <div className={styles.navInner}>
        {navItems.map((item) => {
          if (item.isCenterAction) {
            return (
              <NavLink
                key={item.id}
                to={item.to}
                className={`${styles.navItem} ${styles.centerActionItem} ${item.isActive ? styles.navItemActive : ''
                  }`}
              >
                <div className={styles.centerIconWrap}>
                  {item.icon}
                  {item.badge && <span className={styles.centerBadge}>{item.badge}</span>}
                </div>
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

export default MerchantBottomNav;
