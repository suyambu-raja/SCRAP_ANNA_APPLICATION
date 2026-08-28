import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, Truck, User } from 'lucide-react';
import styles from './AppBottomTabBar.module.css';

interface TabItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const TABS: TabItem[] = [
  {
    to: '/app/home',
    label: 'Home',
    icon: <Home size={22} strokeWidth={2} />,
  },
  {
    to: '/app/post',
    label: 'Post Scrap',
    icon: <PlusCircle size={22} strokeWidth={2} />,
  },
  {
    to: '/app/track',
    label: 'Track',
    icon: <Truck size={22} strokeWidth={2} />,
  },
  {
    to: '/app/profile',
    label: 'Profile',
    icon: <User size={22} strokeWidth={2} />,
  },
];

export function AppBottomTabBar() {
  return (
    <nav className={styles.tabBarWrapper} aria-label="Main App Navigation">
      <div className={styles.tabBarTrack}>
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              [styles.tabButton, isActive ? styles.activeTab : ''].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <div className={styles.iconWrap}>
                  {tab.icon}
                  {isActive && <span className={styles.activeDot} />}
                </div>
                <span className={styles.tabLabel}>{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
