import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, BarChart2, ShoppingCart, Bell, User, Send, PackagePlus, Briefcase } from 'lucide-react';
import { useUserRole } from '@/store/useAuthStore';
import type { UserRole } from '@/types';
import styles from './BottomNav.module.css';

interface NavItem {
  path: string;
  labelKey: string;
  icon: React.ReactNode;
}

const navConfig: Record<UserRole, NavItem[]> = {
  household: [
    { path: '/dashboard/household', labelKey: 'nav.home', icon: <Home size={20} /> },
    { path: '/orders', labelKey: 'nav.orders', icon: <ShoppingCart size={20} /> },
    { path: '/sell-scrap', labelKey: 'nav.sell', icon: <PackagePlus size={20} /> },
    { path: '/notifications', labelKey: 'nav.notifications', icon: <Bell size={20} /> },
    { path: '/profile', labelKey: 'nav.profile', icon: <User size={20} /> },
  ],
  merchant: [
    { path: '/dashboard/merchant', labelKey: 'nav.home', icon: <Home size={20} /> },
    { path: '/market-prices', labelKey: 'nav.market', icon: <BarChart2 size={20} /> },
    { path: '/reusable-products', labelKey: 'nav.sell', icon: <PackagePlus size={20} /> },
    { path: '/notifications', labelKey: 'nav.notifications', icon: <Bell size={20} /> },
    { path: '/profile', labelKey: 'nav.profile', icon: <User size={20} /> },
  ],
  industry: [
    { path: '/dashboard/industry', labelKey: 'nav.home', icon: <Home size={20} /> },
    { path: '/my-requests', labelKey: 'nav.requests', icon: <Send size={20} /> },
    { path: '/post-requirement', labelKey: 'nav.post', icon: <PackagePlus size={20} /> },
    { path: '/notifications', labelKey: 'nav.notifications', icon: <Bell size={20} /> },
    { path: '/profile', labelKey: 'nav.profile', icon: <User size={20} /> },
  ],
};

export function BottomNav() {
  const { t } = useTranslation();
  const role = useUserRole();
  if (!role) return null;

  const items = navConfig[role];

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => [styles.item, isActive ? styles.active : ''].join(' ')}
        >
          {item.icon}
          <span className={styles.label}>{t(item.labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
