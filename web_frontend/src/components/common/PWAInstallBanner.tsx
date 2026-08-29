import { useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from './Button';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import styles from './PWAInstallBanner.module.css';

export function PWAInstallBanner() {
  const { isInstallable, installPWA } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || dismissed) return null;

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.icon}>
          <Download size={20} />
        </div>
        <div className={styles.text}>
          <p className={styles.title}>Install Scrap Anna App</p>
          <p className={styles.sub}>Quick access to live prices, instant pickup booking & notifications</p>
        </div>
      </div>
      <div className={styles.actions}>
        <Button size="sm" onClick={() => installPWA()}>
          Install
        </Button>
        <button
          className={styles.closeBtn}
          onClick={() => setDismissed(true)}
          aria-label="Dismiss install banner"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
