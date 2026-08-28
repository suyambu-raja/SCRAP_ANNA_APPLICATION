import styles from './SkeletonLoader.module.css';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  count?: number;
}

export function SkeletonLoader({ width = '100%', height = '1rem', borderRadius, count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={styles.skeleton}
          style={{ width, height, borderRadius: borderRadius || 'var(--radius-sm)' }}
        />
      ))}
    </>
  );
}

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <SkeletonLoader height="0.75rem" width="40%" />
      <SkeletonLoader height="1.5rem" width="60%" />
      <SkeletonLoader height="0.75rem" width="30%" />
    </div>
  );
}
