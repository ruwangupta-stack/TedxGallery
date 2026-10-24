import { useState } from 'react';
import './GalleryCard.css';

/**
 * Size classes for the masonry grid:
 *   large    — 2 cols × 2 rows
 *   portrait — 1 col  × 2 rows
 *   wide     — 2 cols × 1 row
 *   normal   — 1 col  × 1 row
 */

export default function GalleryCard({ image, size = 'normal', style, onClick }) {
  const [loaded, setLoaded] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(image);
    }
  };

  return (
    <article
      className={`gallery-card gallery-card--${size}`}
      style={style}
      role="button"
      tabIndex={0}
      aria-label={`View photo: ${image.title}`}
      onClick={() => onClick?.(image)}
      onKeyDown={handleKeyDown}
    >
      {/* Loading skeleton */}
      {!loaded && (
        <div className="gallery-card__skeleton" aria-hidden="true" />
      )}

      {/* Image */}
      <img
        className={`gallery-card__img${loaded ? ' gallery-card__img--loaded' : ''}`}
        src={image.thumbUrl || image.imageUrl}
        alt={image.title}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />

      {/* Hover overlay */}
      <div className="gallery-card__overlay" aria-hidden="true">
        <div className="gallery-card__meta">
          {image.event && (
            <span className="gallery-card__event">{image.event}</span>
          )}
          <span className="gallery-card__title">{image.title}</span>
        </div>
      </div>
    </article>
  );
}
