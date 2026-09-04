import { NavLink, useLocation } from 'react-router-dom';
import {
  LuLayoutDashboard,
  LuTrendingUp,
  LuCirclePlus,
  LuShoppingBag,
  LuPackage,
} from 'react-icons/lu';
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
      icon: <LuLayoutDashboard size={20} aria-hidden="true" />,
      isActive:
        location.pathname === '/household' ||
        location.pathname === '/household/',
    },
    {
      id: 'market-rates',
      label: 'Rates',
      to: '/household/rates',
      icon: <LuTrendingUp size={20} aria-hidden="true" />,
      isActive: location.pathname.includes('/household/rates'),
    },
    {
      id: 'post-scrap',
      label: 'Post Scrap',
      to: '/household/post-scrap',
      icon: <LuCirclePlus size={22} aria-hidden="true" />,
      isActive: location.pathname.includes('/household/post-scrap'),
      isCenterAction: true,
    },
    {
      id: 'orders',
      label: 'Orders',
      to: '/household/orders',
      icon: <LuShoppingBag size={20} aria-hidden="true" />,
      badge: '2',
      isActive: location.pathname.includes('/household/orders'),
    },
    {
      id: 'products',
      label: 'Products',
      to: '/household/products',
      icon: <LuPackage size={20} aria-hidden="true" />,
      isActive: location.pathname.includes('/household/products'),
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
