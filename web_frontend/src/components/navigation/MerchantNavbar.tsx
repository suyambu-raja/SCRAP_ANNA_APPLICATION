import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Package,
  Truck,
  Receipt,
  User as UserIcon,
  Bell,
  ChevronDown,
  Store,
  LogOut,
  Settings,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import styles from './MerchantNavbar.module.css';

interface MerchantNavbarProps {
  activeTab?: string;
}

export function MerchantNavbar({ activeTab = 'dashboard' }: MerchantNavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', to: '/dashboard/merchant', icon: <LayoutDashboard size={17} />, isBuilt: true },
    { id: 'requests', label: 'Requests', to: '/requests', icon: <ClipboardList size={17} />, isBuilt: true },
    { id: 'quotes', label: 'My Quotes', to: '/quotes', icon: <FileText size={17} />, isBuilt: true },
    { id: 'orders', label: 'Orders', to: '/orders', icon: <Package size={17} />, isBuilt: true },
    { id: 'ride', label: 'Ride', to: '/ride', icon: <Truck size={17} />, isBuilt: true },
    { id: 'transactions', label: 'Transactions', to: '#', icon: <Receipt size={17} />, isBuilt: false },
    { id: 'profile', label: 'Profile', to: '#', icon: <UserIcon size={17} />, isBuilt: false },
  ];

  return (
    <header className={styles.merchantHeader}>
      <div className={styles.navContainer}>
        {/* Brand / Logo */}
        <Link to="/dashboard/merchant" className={styles.brandGroup} aria-label="Scrap Anna Dashboard">
          <div className={styles.brandLogo}>
            <img src="/logo.png" alt="Scrap Anna" className={styles.logoIcon} onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/logo-icon.png';
            }} />
            <div className={styles.brandTextCol}>
              <span className={styles.brandTitle}>
                SCRAP <span className={styles.brandTitleHighlight}>ANNA</span>
              </span>
              <span className={styles.brandSubtitle}>
                CONNECT • COLLECT • RECYCLE
              </span>
            </div>
          </div>
        </Link>

        {/* Center Tabs */}
        <nav className={styles.centerNav} aria-label="Merchant Navigation">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return tab.isBuilt ? (
              <NavLink
                key={tab.id}
                to={tab.to}
                className={isActive ? `${styles.navTab} ${styles.navTabActive}` : styles.navTab}
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                <span>{tab.label}</span>
              </NavLink>
            ) : (
              <button
                type="button"
                key={tab.id}
                className={isActive ? `${styles.navTab} ${styles.navTabActive}` : styles.navTab}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                onClick={(e) => e.preventDefault()}
                title={`${tab.label} (Design pending)`}
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className={styles.rightActions}>
          {/* Notification Bell */}
          <button
            type="button"
            className={styles.notificationBtn}
            title="Notifications"
            aria-label="3 new notifications"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            onClick={(e) => e.preventDefault()}
          >
            <Bell size={20} />
            <span className={styles.badgeCount}>3</span>
          </button>

          {/* User Profile Dropdown */}
          <div className={styles.userMenuWrapper} ref={dropdownRef}>
            <button
              type="button"
              className={styles.userMenuBtn}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
            >
              <div className={styles.userAvatar}>
                <Store size={18} />
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user?.name || 'Ramesh Traders'}</span>
                <span className={styles.userRole}>Merchant</span>
              </div>
              <ChevronDown size={14} className={dropdownOpen ? `${styles.chevron} ${styles.chevronOpen}` : styles.chevron} />
            </button>

            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <div className={styles.dropdownHeaderTitle}>{user?.name || 'Ramesh Traders'}</div>
                  <div className={styles.dropdownHeaderSub}>{user?.email || 'ramesh@traders.in'}</div>
                </div>
                <button
                  type="button"
                  className={styles.dropdownItem}
                  onClick={() => setDropdownOpen(false)}
                  style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
                >
                  <UserIcon size={15} />
                  <span>Merchant Profile</span>
                </button>
                <button
                  type="button"
                  className={styles.dropdownItem}
                  onClick={() => setDropdownOpen(false)}
                  style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
                >
                  <Settings size={15} />
                  <span>Settings</span>
                </button>
                <div style={{ height: 1, backgroundColor: '#f1f5f9', margin: '4px 0' }} />
                <button type="button" className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`} onClick={handleLogout}>
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
