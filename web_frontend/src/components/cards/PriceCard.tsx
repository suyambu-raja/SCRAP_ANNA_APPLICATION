import React from 'react';
import { MapPin, Clock, Layers } from 'lucide-react';
import type { MarketPrice } from '@/types';
import styles from './PriceCard.module.css';

export interface PriceCardProps {
  price?: MarketPrice;
  materialName?: string;
  priceMin?: number;
  priceMax?: number;
  priceValue?: number;
  unit?: string;
  location?: string;
  category?: string;
  imageUrl?: string;
  imagePlaceholder?: React.ReactNode;
  updatedAt?: string;
  onClick?: () => void;
  compact?: boolean;
}

export function PriceCard({
  price,
  materialName,
  priceMin,
  priceMax,
  priceValue,
  unit,
  location,
  imageUrl,
  imagePlaceholder,
  onClick,
}: PriceCardProps) {
  const name = materialName || price?.name || price?.category || 'Scrap Material';
  const priceUnit = unit || price?.unit || 'kg';
  const loc = location || price?.location || 'Chennai';
  const currentImageUrl = imageUrl || price?.imageUrl;

  const min =
    priceMin !== undefined
      ? priceMin
      : price?.priceMin !== undefined
      ? price.priceMin
      : priceValue !== undefined
      ? Math.round(priceValue * 0.9)
      : price?.price !== undefined
      ? Math.round(price.price * 0.9)
      : 0;

  const max =
    priceMax !== undefined
      ? priceMax
      : price?.priceMax !== undefined
      ? price.priceMax
      : priceValue !== undefined
      ? Math.round(priceValue * 1.1)
      : price?.price !== undefined
      ? Math.round(price.price * 1.1)
      : 0;

  return (
    <div
      className={styles.marketCard}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* 1. Large Image Area (55–60% visual height, clean cover, NO icons/badges overlay) */}
      <div className={styles.imageContainer}>
        {currentImageUrl ? (
          <img
            src={currentImageUrl}
            alt={name}
            className={styles.cardImage}
            loading="lazy"
          />
        ) : imagePlaceholder ? (
          imagePlaceholder
        ) : (
          <div className={styles.placeholderContainer}>
            <Layers size={36} className={styles.placeholderIcon} />
            <span className={styles.placeholderText}>{name}</span>
          </div>
        )}
      </div>

      {/* 2. Card Content Area */}
      <div className={styles.cardContent}>
        {/* Title & Location Row */}
        <div className={styles.titleLocationRow}>
          <h3 className={styles.materialTitle} title={name}>
            {name}
          </h3>
          <div className={styles.locationBadge}>
            <MapPin size={13} className={styles.pinIcon} />
            <span>{loc}</span>
          </div>
        </div>

        {/* Subtle Divider */}
        <div className={styles.cardDivider} />

        {/* Market Rate Block */}
        <div className={styles.rateBlock}>
          <span className={styles.rateLabel}>MARKET RATE</span>
          <div className={styles.priceRow}>
            <span className={styles.priceRange}>
              ₹{min.toLocaleString('en-IN')} – ₹{max.toLocaleString('en-IN')}
            </span>
            <span className={styles.priceUnit}>/{priceUnit}</span>
          </div>
        </div>

        {/* Timestamp Row */}
        <div className={styles.timestampRow}>
          <Clock size={12} className={styles.clockIcon} />
          <span>Updated today, 9:30 AM</span>
        </div>
      </div>
    </div>
  );
}
