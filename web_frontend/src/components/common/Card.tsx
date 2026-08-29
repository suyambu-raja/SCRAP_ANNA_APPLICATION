import type { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  style?: React.CSSProperties;
}

export function Card({ children, padding = 'md', className, onClick, hoverable, style }: CardProps) {
  return (
    <div
      className={[
        styles.card,
        styles[`pad-${padding}`],
        hoverable ? styles.hoverable : '',
        onClick ? styles.clickable : '',
        className ?? '',
      ].join(' ')}
      onClick={onClick}
      style={style}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter') onClick(); } : undefined}
    >
      {children}
    </div>
  );
}
