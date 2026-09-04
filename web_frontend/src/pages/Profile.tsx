import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, Button } from '@/components/common';
import { LanguageSelector } from '@/components/common';
import { useAuthStore } from '@/store/useAuthStore';
import { ChevronRight, User as UserIcon, Globe, Bell, HelpCircle, Info, LogOut, MapPin } from 'lucide-react';
import styles from './Profile.module.css';

export default function Profile() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <div className="page-enter">
      <h1 style={{ fontSize: 'var(--text-h2)', fontWeight: 700, marginBottom: '1.25rem' }}>{t('profile.title')}</h1>

      <Card padding="md" className={styles.userCard}>
        <div className={styles.avatar}>{user?.name?.[0] || 'U'}</div>
        <div>
          <p className={styles.userName}>{user?.name}</p>
          <p className={styles.userMeta}>{user?.email}</p>
          <p className={styles.userMeta} style={{ textTransform: 'capitalize' }}>
            Role: <strong>{user?.role}</strong> • {user?.verified ? '✅ Verified' : 'Pending Verification'}
          </p>
          {user?.location && (
            <p className={styles.userMeta} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.2rem' }}>
              <MapPin size={12} /> {user.location.area}, {user.location.city} ({user.location.pincode})
            </p>
          )}
        </div>
      </Card>

      <div className={styles.menu}>
        <button className={styles.menuItem}>
          <UserIcon size={18} /> <span>{t('profile.editProfile')}</span> <ChevronRight size={16} className={styles.chevron} />
        </button>
        <div className={styles.menuItem}>
          <Globe size={18} /> <span>{t('profile.language')}</span> <LanguageSelector />
        </div>
        <button className={styles.menuItem} onClick={() => navigate('/notifications')}>
          <Bell size={18} /> <span>{t('profile.notifications')}</span> <ChevronRight size={16} className={styles.chevron} />
        </button>
        <button className={styles.menuItem}>
          <HelpCircle size={18} /> <span>{t('profile.help')}</span> <ChevronRight size={16} className={styles.chevron} />
        </button>
        <button className={styles.menuItem}>
          <Info size={18} /> <span>{t('profile.about')}</span> <ChevronRight size={16} className={styles.chevron} />
        </button>
      </div>

      <Button
        variant="danger"
        fullWidth
        icon={<LogOut size={16} />}
        onClick={() => { logout(); navigate('/home'); }}
        style={{ marginTop: '1.25rem' }}
      >
        {t('common.logout')}
      </Button>

      <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', marginTop: '1rem' }}>
        {t('profile.version')} 1.0.0 (Chennai Mock Build)
      </p>
    </div>
  );
}
