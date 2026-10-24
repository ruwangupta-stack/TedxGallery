import { useState, useCallback } from 'react';

/**
 * Manages lightbox open/close state, current index, and navigation.
 */
export function useLightbox() {
  const [isOpen,       setIsOpen]       = useState(false);
  const [images,       setImages]       = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const open = useCallback((imageList, startIndex = 0) => {
    setImages(imageList);
    setCurrentIndex(startIndex);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  return {
    isOpen,
    images,
    currentIndex,
    currentImage: images[currentIndex] ?? null,
    open,
    close,
    prev,
    next,
  };
}
