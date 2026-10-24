import { useEffect, useRef, useCallback } from 'react';
import GalleryCard from './GalleryCard';
import SkeletonGrid from './SkeletonGrid';
import './MasonryGrid.css';

/**
 * Repeating size pattern for the editorial masonry grid.
 * Works with CSS Grid dense auto-placement.
 *
 * 3-column base grid (grid-auto-rows: 200px):
 *   large   = 2 cols × 2 rows  →  ~400px tall, spans 2 cols
 *   portrait= 1 col  × 2 rows  →  ~400px tall
 *   normal  = 1 col  × 1 row   →  ~200px tall
 *   wide    = 2 cols × 1 row   →  ~200px tall, spans 2 cols
 */
const SIZE_PATTERN = [
  'large',
  'portrait',
  'normal',
  'wide',
  'normal',
  'portrait',
  'normal',
];

const getSize = (index) => SIZE_PATTERN[index % SIZE_PATTERN.length];

export default function MasonryGrid({ images, loading, onImageClick }) {
  const gridRef = useRef(null);

  /* Intersection Observer for scroll-triggered reveal */
  const observerRef = useRef(null);

  const observe = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observerRef.current.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    if (!gridRef.current) return;
    gridRef.current.querySelectorAll('.gallery-card').forEach((card) => {
      observerRef.current.observe(card);
    });
  }, []);

  useEffect(() => {
    observe();
    return () => observerRef.current?.disconnect();
  }, [images, observe]);

  if (loading) return <SkeletonGrid count={9} />;

  if (!loading && images.length === 0) {
    return (
      <div className="masonry-empty" role="status">
        <p>No images in this category yet.</p>
      </div>
    );
  }

  return (
    <div
      ref={gridRef}
      className="masonry-grid"
      aria-label="Gallery image grid"
    >
      {images.map((image, index) => (
        <GalleryCard
          key={image.id}
          image={image}
          size={getSize(index)}
          style={{ transitionDelay: `${(index % 4) * 70}ms` }}
          onClick={(img) => onImageClick(images, index)}
        />
      ))}
    </div>
  );
}
