import { useState } from 'react';
import GalleryHero      from '../components/gallery/GalleryHero';
import FeaturedSection  from '../components/gallery/FeaturedSection';
import FilterBar        from '../components/gallery/FilterBar';
import MasonryGrid      from '../components/gallery/MasonryGrid';
import Lightbox         from '../components/gallery/Lightbox';
import { useGallery, useFeaturedImages } from '../hooks/useGallery';
import { useLightbox } from '../hooks/useLightbox';
import './Gallery.css';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all');

  /* Data */
  const { images, loading } = useGallery({ category: activeCategory });
  const { images: featured } = useFeaturedImages();

  /* Lightbox state */
  const lb = useLightbox();

  const handleImageClick = (imageList, index) => {
    lb.open(imageList, index);
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
  };

  return (
    <main className="gallery-page" id="main-content">
      {/* 1. Hero */}
      <GalleryHero />

      {/* 2. Featured editorial block */}
      {featured.length > 0 && (
        <FeaturedSection images={featured.slice(0, 3)} />
      )}

      {/* 3. Divider + archive section header */}
      <div className="gallery-archive">
        <header className="gallery-archive__header">
          <div className="gallery-archive__header-inner">
            <span className="section-label">The Archive</span>
            <h2 className="gallery-archive__title">All Moments</h2>
          </div>
          <div className="section-divider" />
        </header>

        {/* 4. Filter bar */}
        <div className="gallery-archive__filters">
          <FilterBar
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* 5. Masonry grid */}
        <MasonryGrid
          images={images}
          loading={loading}
          onImageClick={handleImageClick}
        />

        {/* Bottom spacer */}
        <div className="gallery-archive__footer">
          <span className="gallery-archive__count">
            {!loading && `${images.length} image${images.length !== 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {/* 6. Lightbox */}
      {lb.isOpen && (
        <Lightbox
          images={lb.images}
          currentIndex={lb.currentIndex}
          onClose={lb.close}
          onPrev={lb.prev}
          onNext={lb.next}
        />
      )}
    </main>
  );
}
