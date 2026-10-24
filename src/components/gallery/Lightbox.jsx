import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './Lightbox.css';

/**
 * Fullscreen lightbox with:
 * - Smooth open/close animation
 * - Keyboard navigation (← → Esc)
 * - Touch/swipe navigation on mobile
 * - Full focus trap for accessibility
 */
export default function Lightbox({ images, currentIndex, onClose, onPrev, onNext }) {
  const containerRef = useRef(null);
  const [visible, setVisible]   = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const touchStartX = useRef(null);

  const image = images[currentIndex];
  const total = images.length;

  /* Animate in after mount */
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  /* Reset img loaded state on navigation */
  useEffect(() => {
    setImgLoaded(false);
  }, [currentIndex]);

  /* Keyboard handler */
  useEffect(() => {
    const handleKey = (e) => {
      switch (e.key) {
        case 'ArrowLeft':  onPrev();       break;
        case 'ArrowRight': onNext();       break;
        case 'Escape':     handleClose();  break;
        default: break;
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onPrev, onNext]);

  /* Focus trap */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const focusable = el.querySelectorAll(
      'button, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    const trapTab = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    el.addEventListener('keydown', trapTab);
    first?.focus();
    return () => el.removeEventListener('keydown', trapTab);
  }, []);

  /* Animated close */
  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 280);
  };

  /* Touch swipe */
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 48) {
      delta > 0 ? onPrev() : onNext();
    }
    touchStartX.current = null;
  };

  if (!image) return null;

  return createPortal(
    <div
      ref={containerRef}
      className={`lightbox${visible ? ' lightbox--visible' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Image viewer: ${image.title}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Backdrop */}
      <div
        className="lightbox__backdrop"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Close */}
      <button
        className="lightbox__close"
        onClick={handleClose}
        aria-label="Close image viewer"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="18" y1="2" x2="2" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Prev */}
      <button
        className="lightbox__nav lightbox__nav--prev"
        onClick={onPrev}
        aria-label="Previous image"
        disabled={total <= 1}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Image + Caption */}
      <div className="lightbox__content">
        <div className="lightbox__img-wrapper">
          {!imgLoaded && (
            <div className="lightbox__skeleton" aria-hidden="true" />
          )}
          <img
            key={image.id}
            className={`lightbox__img${imgLoaded ? ' lightbox__img--loaded' : ''}`}
            src={image.imageUrl}
            alt={image.title}
            onLoad={() => setImgLoaded(true)}
          />
        </div>

        <footer className="lightbox__caption">
          {image.event && (
            <span className="lightbox__event">
              {image.event}
              {image.year ? ` · ${image.year}` : ''}
            </span>
          )}
          <p className="lightbox__title">{image.title}</p>
          {image.description && (
            <p className="lightbox__desc">{image.description}</p>
          )}
        </footer>
      </div>

      {/* Next */}
      <button
        className="lightbox__nav lightbox__nav--next"
        onClick={onNext}
        aria-label="Next image"
        disabled={total <= 1}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Counter */}
      <p
        className="lightbox__counter"
        aria-live="polite"
        aria-atomic="true"
      >
        {currentIndex + 1} <span aria-hidden="true">/</span> {total}
      </p>
    </div>,
    document.body
  );
}
