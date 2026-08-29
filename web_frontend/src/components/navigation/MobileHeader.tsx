import { Link } from 'react-router-dom';
import { Bell, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/common';
import { useAuthStore } from '@/store/useAuthStore';
import styles from './MobileHeader.module.css';

export function MobileHeader() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <Link to={user ? `/dashboard/${user.role}` : '/home'} className={styles.brand}>
          <img
            src="/logo-icon.png"
            alt="Scrap Anna"
            className={styles.logoImg}
            onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
          />
          <span className={styles.brandName}>{t('app.name')}</span>
        </Link>
        <div className={styles.actions}>
          <LanguageSelector compact />
          {user && (
            <Link to="/notifications" className={styles.iconBtn} aria-label="Notifications">
              <Bell size={20} />
            </Link>
          )}
          <button className={styles.iconBtn} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className={styles.overlay} onClick={() => setMenuOpen(false)}>
          <nav className={styles.menu} onClick={(e) => e.stopPropagation()}>
            {user ? (
              <>
                <div className={styles.menuUser}>
                  <div className={styles.avatar}>{user.name[0]}</div>
                  <div>
                    <p className={styles.menuName}>{user.name}</p>
                    <p className={styles.menuRole}>{user.role}</p>
                  </div>
                </div>
                <Link to={`/dashboard/${user.role}`} className={styles.menuItem} onClick={() => setMenuOpen(false)}>{t('nav.dashboard')}</Link>
                <Link to="/orders" className={styles.menuItem} onClick={() => setMenuOpen(false)}>{t('nav.orders')}</Link>
                <Link to="/profile" className={styles.menuItem} onClick={() => setMenuOpen(false)}>{t('nav.profile')}</Link>
                <Link to="/settings" className={styles.menuItem} onClick={() => setMenuOpen(false)}>{t('nav.settings')}</Link>
                <button className={styles.menuItem} onClick={() => { logout(); setMenuOpen(false); }}>{t('common.logout')}</button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.menuItem} onClick={() => setMenuOpen(false)}>{t('common.login')}</Link>
                <Link to="/signup" className={styles.menuItem} onClick={() => setMenuOpen(false)}>{t('common.signup')}</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
