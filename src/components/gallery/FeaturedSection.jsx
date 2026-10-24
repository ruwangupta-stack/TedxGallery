import './FeaturedSection.css';

/**
 * Editorial featured section.
 * Expects `images` to be an array of featured gallery items.
 * Layout: one large dominant image + 2 stacked supporting images.
 */
export default function FeaturedSection({ images = [] }) {
  if (images.length === 0) return null;

  const [main, sec1, sec2] = images;

  return (
    <section className="featured" aria-labelledby="featured-heading">
      <header className="featured__header">
        <span className="section-label">Featured</span>
        <h2 id="featured-heading" className="featured__title">
          Defining Moments
        </h2>
        <div className="featured__header-line" aria-hidden="true" />
      </header>

      <div className="featured__grid">
        {/* Dominant image */}
        <div className="featured__main" aria-label={main?.title}>
          <img
            src={main?.imageUrl}
            alt={main?.title ?? 'Featured TEDx moment'}
            loading="lazy"
          />
          <div className="featured__main-caption">
            <span className="featured__event">{main?.event}</span>
            <span className="featured__img-title">{main?.title}</span>
          </div>
        </div>

        {/* Supporting images */}
        <div className="featured__secondary">
          {sec1 && (
            <div className="featured__sec-item">
              <img
                src={sec1.imageUrl}
                alt={sec1.title}
                loading="lazy"
              />
              <div className="featured__sec-caption">
                <span className="featured__event">{sec1.event}</span>
                <span className="featured__img-title">{sec1.title}</span>
              </div>
            </div>
          )}
          {sec2 && (
            <div className="featured__sec-item">
              <img
                src={sec2.imageUrl}
                alt={sec2.title}
                loading="lazy"
              />
              <div className="featured__sec-caption">
                <span className="featured__event">{sec2.event}</span>
                <span className="featured__img-title">{sec2.title}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
