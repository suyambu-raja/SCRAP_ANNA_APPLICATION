import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import styles from './Splash.module.css';

export default function Splash() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));

    const timer = setTimeout(() => {
      const storedLanguage = localStorage.getItem('sa_language');
      const storedUser = localStorage.getItem('sa_user');

      // If user is already authenticated, take them directly to their role dashboard
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed && parsed.role) {
            navigate(`/dashboard/${parsed.role}`, { replace: true });
            return;
          }
        } catch {
          // ignore
        }
      }

      // If first time launching without selected language
      if (!storedLanguage) {
        navigate('/language', { replace: true });
        return;
      }

      // Proceed to Public Homepage
      navigate('/home', { replace: true });
    }, 1400);

    return () => clearTimeout(timer);
  }, [navigate, user, isAuthenticated]);

  return (
    <div className={styles.splash}>
      <div className={[styles.content, show ? styles.visible : ''].join(' ')}>
        <img
          src="/logo-icon.png"
          alt="Scrap Anna"
          className={styles.logoImg}
          onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
        />
        <h1 className={styles.brand}>Scrap Anna</h1>
        <p className={styles.tagline}>Connect • Collect • Recycle</p>
        <div className={styles.pulseDot} />
      </div>
    </div>
  );
}
