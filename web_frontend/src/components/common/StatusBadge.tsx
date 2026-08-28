import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  label: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, label, size = 'sm' }: StatusBadgeProps) {
  return (
    <span className={[styles.badge, styles[status], styles[size]].join(' ')}>
      {label}
    </span>
  );
}
