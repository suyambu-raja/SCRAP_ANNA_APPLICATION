import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import styles from './EmptyState.module.css';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'Please try again later.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.icon} style={{ color: 'var(--color-error)' }}>
        <AlertTriangle size={48} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.desc}>{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
