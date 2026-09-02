import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home, BarChart2, ShoppingCart, Bell, User, Settings,
  PackagePlus, Send, Briefcase, LogOut,
} from 'lucide-react';
import { LanguageSelector } from '@/components/common';
import { useAuthStore, useUserRole } from '@/store/useAuthStore';
import type { UserRole } from '@/types';
import styles from './Sidebar.module.css';

interface SidebarItem {
  path: string;
  labelKey: string;
  icon: React.ReactNode;
}

const sidebarConfig: Record<UserRole, SidebarItem[]> = {
  household: [
    { path: '/dashboard/household', labelKey: 'nav.home', icon: <Home size={18} /> },
    { path: '/market-prices', labelKey: 'nav.market', icon: <BarChart2 size={18} /> },
    { path: '/sell-scrap', labelKey: 'nav.sell', icon: <PackagePlus size={18} /> },
    { path: '/orders', labelKey: 'nav.orders', icon: <ShoppingCart size={18} /> },
    { path: '/notifications', labelKey: 'nav.notifications', icon: <Bell size={18} /> },
  ],
  merchant: [
    { path: '/dashboard/merchant', labelKey: 'nav.home', icon: <Home size={18} /> },
    { path: '/market-prices', labelKey: 'nav.market', icon: <BarChart2 size={18} /> },
    { path: '/reusable-products', labelKey: 'dashboard.merchant.reusableProducts', icon: <PackagePlus size={18} /> },
    { path: '/orders', labelKey: 'nav.orders', icon: <ShoppingCart size={18} /> },
    { path: '/notifications', labelKey: 'nav.notifications', icon: <Bell size={18} /> },
  ],
  industry: [
    { path: '/dashboard/industry', labelKey: 'nav.home', icon: <Home size={18} /> },
    { path: '/post-requirement', labelKey: 'dashboard.industry.postRequirement', icon: <PackagePlus size={18} /> },
    { path: '/my-requests', labelKey: 'dashboard.industry.activeRequests', icon: <Send size={18} /> },
    { path: '/orders', labelKey: 'nav.orders', icon: <ShoppingCart size={18} /> },
    { path: '/notifications', labelKey: 'nav.notifications', icon: <Bell size={18} /> },
  ],
};

export function Sidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const role = useUserRole();
  const logout = useAuthStore((s) => s.logout);

  if (!role) return null;
  const items = sidebarConfig[role];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <img
          src="/logo-icon.png"
          alt="Scrap Anna"
          className={styles.logoImg}
          onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
        />
        <div className={styles.brandTextWrap}>
          <span className={styles.brandName}>{t('app.name')}</span>
          <span className={styles.brandSub}>Connect • Collect • Recycle</span>
        </div>
      </div>

      <nav className={styles.nav}>
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => [styles.navItem, isActive ? styles.active : ''].join(' ')}
          >
            {item.icon}
            <span>{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.bottom}>
        <NavLink to="/profile" className={({ isActive }) => [styles.navItem, isActive ? styles.active : ''].join(' ')}>
          <User size={18} /> <span>{t('nav.profile')}</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => [styles.navItem, isActive ? styles.active : ''].join(' ')}>
          <Settings size={18} /> <span>{t('nav.settings')}</span>
        </NavLink>
        <LanguageSelector />
        <button className={styles.navItem} onClick={() => { logout(); navigate('/home'); }}>
          <LogOut size={18} /> <span>{t('common.logout')}</span>
        </button>
      </div>
    </aside>
  );
}
