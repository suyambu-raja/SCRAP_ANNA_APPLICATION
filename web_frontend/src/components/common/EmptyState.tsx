import type { ReactNode } from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.icon}>{icon || <PackageOpen size={48} />}</div>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.desc}>{description}</p>}
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
