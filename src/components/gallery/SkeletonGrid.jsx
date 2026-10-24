import './SkeletonGrid.css';

/** Loading skeleton shown while gallery images fetch */
export default function SkeletonGrid({ count = 9 }) {
  return (
    <div className="skeleton-grid" aria-busy="true" aria-label="Loading gallery images">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton-card skeleton-card--${getSize(i)}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

const SIZES = ['large', 'portrait', 'normal', 'wide', 'normal', 'portrait', 'normal'];
const getSize = (i) => SIZES[i % SIZES.length];
