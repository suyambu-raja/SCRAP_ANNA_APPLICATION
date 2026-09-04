import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        styles.btn,
        styles[variant],
        styles[size],
        fullWidth ? styles.full : '',
        loading ? styles.loading : '',
        className ?? '',
      ].join(' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : icon ? (
        <span className={styles.icon}>{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
}
