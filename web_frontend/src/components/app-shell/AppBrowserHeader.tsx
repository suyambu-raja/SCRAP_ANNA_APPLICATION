import { Link, NavLink } from 'react-router-dom';
import { Download, Home, PlusCircle, Truck, User, Bell, CheckCircle } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useAuthStore } from '@/store/useAuthStore';
import styles from './AppBrowserHeader.module.css';

const NAV_LINKS = [
  { to: '/app/home', label: 'Home', icon: <Home size={16} /> },
  { to: '/app/post', label: 'Post Scrap', icon: <PlusCircle size={16} /> },
  { to: '/app/track', label: 'Track', icon: <Truck size={16} /> },
  { to: '/app/profile', label: 'Profile', icon: <User size={16} /> },
];

export function AppBrowserHeader() {
  const { isInstallable, isInstalled, installPWA } = usePWAInstall();
  const user = useAuthStore((s) => s.user);

  return (
    <header className={styles.headerWrapper}>
      <div className={styles.headerContainer}>
        {/* Left Logo / App Brand */}
        <Link to="/app/home" className={styles.brandLink} aria-label="Scrap Anna App">
          <img src="/logo-icon.png" alt="Scrap Anna" className={styles.logoIcon} />
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>Scrap Anna</span>
            <span className={styles.brandSub}>App Dashboard</span>
          </div>
        </Link>

        {/* Center Horizontal Tabs for Browser Mode */}
        <nav className={styles.centerNav} aria-label="App Navigation">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                [styles.navItem, isActive ? styles.navItemActive : ''].join(' ')
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right Controls */}
        <div className={styles.rightControls}>
          {isInstallable && (
            <button
              type="button"
              className={styles.installBtn}
              onClick={installPWA}
              title="Install Scrap Anna PWA for offline and full screen app experience"
            >
              <Download size={15} />
              <span>Install App</span>
            </button>
          )}

          {isInstalled && (
            <span className={styles.installedPill} title="PWA Installed">
              <CheckCircle size={13} />
              <span>Installed</span>
            </span>
          )}

          <Link to="/notifications" className={styles.iconBtn} title="Notifications">
            <Bell size={17} />
          </Link>

          {user && (
            <Link to="/app/profile" className={styles.userAvatar} title={user.name}>
              {user.name.charAt(0).toUpperCase()}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
