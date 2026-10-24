import { useState, useEffect, useCallback } from 'react';
import { PLACEHOLDER_IMAGES } from '../data/placeholders';

/**
 * Fetches gallery images from the backend API.
 * Falls back gracefully to placeholder data if the API is unreachable.
 *
 * @param {string} category  - active category filter ('all' | 'events' | ...)
 * @param {string} [event]   - optional event name filter
 * @param {number} [year]    - optional year filter
 */
export function useGallery({ category = 'all', event, year } = {}) {
  const [images,  setImages]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.set('category', category);
      if (event) params.set('event', event);
      if (year)  params.set('year', year);

      const res = await fetch(`/api/gallery?${params.toString()}`, {
        signal: AbortSignal.timeout(4000),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);

      const data = await res.json();
      setImages(data);
      setUsingFallback(false);
    } catch {
      // Backend unreachable — use placeholder data
      const filtered = PLACEHOLDER_IMAGES.filter((img) => {
        if (!img.published) return false;
        if (category && category !== 'all' && img.category !== category) return false;
        if (event && img.event !== event) return false;
        if (year && img.year !== year) return false;
        return true;
      });
      setImages(filtered);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, [category, event, year]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return { images, loading, error, usingFallback, refetch: fetchImages };
}

/**
 * Fetches only featured images for the editorial section.
 */
export function useFeaturedImages() {
  const [images,  setImages]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/gallery/featured', {
          signal: AbortSignal.timeout(4000),
        });
        if (!res.ok) throw new Error();
        setImages(await res.json());
      } catch {
        setImages(PLACEHOLDER_IMAGES.filter((i) => i.featured && i.published));
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return { images, loading };
}
