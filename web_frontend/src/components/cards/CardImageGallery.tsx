import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Eye, Camera } from 'lucide-react';
import styles from './CardImageGallery.module.css';

export interface CardImageGalleryProps {
  images?: string[];
  fallbackImage?: string;
  materialName: string;
  materialCondition?: string;
  onOpenPreview?: (selectedSrc: string) => void;
  className?: string;
}

export function CardImageGallery({
  images = [],
  fallbackImage = '/logo-icon.png',
  materialName,
  materialCondition,
  onOpenPreview,
  className,
}: CardImageGalleryProps) {
  const imageList = images.length > 0 ? images : [fallbackImage];
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const total = imageList.length;
  const currentSrc = imageList[currentIndex] || fallbackImage;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setCurrentIndex(idx);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;

    if (isLeftSwipe) {
      setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
    }
    if (isRightSwipe) {
      setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  return (
    <div
      className={`${styles.largeImgFrame} ${className || ''}`}
      onClick={() => onOpenPreview && onOpenPreview(currentSrc)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      title="Click to view floating photo preview, or swipe to see all photos"
    >
      {/* Active Photo */}
      <img
        src={currentSrc}
        alt={`${materialName} (${currentIndex + 1} of ${total})`}
        className={styles.largeMaterialImg}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = fallbackImage;
        }}
      />

      {/* Top Multi-Photo Badge */}
      {total > 1 && (
        <div className={styles.photoCountBadge}>
          <Camera size={11} />
          <span>
            {currentIndex + 1}/{total}
          </span>
        </div>
      )}

      {/* Zoom / View Photo Badge */}
      <div className={styles.zoomHoverBadge}>
        <Eye size={13} />
        <span>View Photo</span>
      </div>

      {/* Condition Overlay Badge */}
      {materialCondition && (
        <span className={styles.conditionOverlayBadge}>
          {materialCondition} Condition
        </span>
      )}

      {/* Navigation Chevrons (When > 1 images) */}
      {total > 1 && (
        <>
          <button
            type="button"
            className={`${styles.navBtn} ${styles.navBtnLeft}`}
            onClick={handlePrev}
            aria-label="Previous image"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            className={`${styles.navBtn} ${styles.navBtnRight}`}
            onClick={handleNext}
            aria-label="Next image"
          >
            <ChevronRight size={16} />
          </button>

          {/* Dots Indicator */}
          <div className={styles.dotsTrack}>
            {imageList.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`${styles.dot} ${idx === currentIndex ? styles.dotActive : ''}`}
                onClick={(e) => handleDotClick(e, idx)}
                aria-label={`Go to photo ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
