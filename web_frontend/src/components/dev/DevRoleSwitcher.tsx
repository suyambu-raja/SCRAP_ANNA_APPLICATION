import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { getDb } from '@/services';
import { UserCheck, ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';
import styles from './DevRoleSwitcher.module.css';

export function DevRoleSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const db = getDb();
  const demoAccounts = db.demo_accounts.accounts;

  const handleSwitch = (userId: string) => {
    const user = db.users.find((u) => u.id === userId);
    if (!user) return;

    login(user, `mock-jwt-${user.id}-${Date.now()}`);
    if (user.role === 'industry') {
      navigate('/industry/dashboard');
    } else if (user.role === 'merchant') {
      navigate('/dashboard/merchant');
    } else if (user.role === 'aggregator') {
      navigate('/dashboard/aggregator');
    } else if (user.role === 'household') {
      navigate('/dashboard/household');
    } else {
      navigate('/dashboard/' + user.role);
    }
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/home');
    setIsOpen(false);
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.toggleBtn}
        onClick={() => setIsOpen(!isOpen)}
        title="Development Role Switcher"
      >
        <UserCheck size={16} />
        <span className={styles.currentRole}>
          {currentUser ? `${currentUser.role.toUpperCase()} (${currentUser.name.split(' ')[0]})` : 'GUEST / DEV'}
        </span>
        {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>

      {isOpen && (
        <div className={styles.popover}>
          <div className={styles.header}>
            <span className={styles.title}>Mock Role Switcher (DEV)</span>
          </div>

          <div className={styles.list}>
            {demoAccounts.map((account) => {
              const user = db.users.find((u) => u.id === account.userId);
              if (!user) return null;
              const isActive = currentUser?.id === user.id;

              return (
                <button
                  key={account.userId}
                  className={[styles.accountBtn, isActive ? styles.activeAccount : ''].join(' ')}
                  onClick={() => handleSwitch(account.userId)}
                >
                  <div className={styles.roleBadge}>{user.role}</div>
                  <div className={styles.accountDetails}>
                    <strong className={styles.userName}>{user.name}</strong>
                    <span className={styles.userEmail}>{account.login}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className={styles.footer}>
            {currentUser && (
              <button className={styles.logoutBtn} onClick={handleLogout}>
                <RotateCcw size={12} /> Switch to Guest / Logout
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
