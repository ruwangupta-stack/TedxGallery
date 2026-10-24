import './GalleryHero.css';

const HERO_BG =
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1920&q=80';

export default function GalleryHero() {
  return (
    <section className="hero" aria-label="Gallery hero">
      {/* Background image — purely decorative */}
      <img
        className="hero__bg"
        src={HERO_BG}
        alt=""
        aria-hidden="true"
        fetchpriority="high"
      />
      <div className="hero__overlay" aria-hidden="true" />

      <div className="hero__content">
        <span className="hero__label" aria-hidden="true">
          TEDx Visual Archive
        </span>

        {/* Red accent line — draws in via CSS animation */}
        <div className="hero__accent-line" aria-hidden="true" />

        <h1 className="hero__heading">Gallery</h1>

        <p className="hero__subtitle">
          Moments that sparked ideas.&nbsp; Conversations that created impact.
          <br />
          Memories that continue beyond the stage.
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll-hint" aria-hidden="true">
        <span className="hero__scroll-line" />
        <span className="hero__scroll-text">Scroll</span>
      </div>
    </section>
  );
}
