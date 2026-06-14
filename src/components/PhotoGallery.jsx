import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import './PhotoGallery.css';

// Generate placeholder gradient images
const defaultPhotos = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  gradient: [
    'linear-gradient(135deg, #E8DDD3, #D4C5B9)',
    'linear-gradient(135deg, #C9D4C5, #8BA888)',
    'linear-gradient(135deg, #F2D7D7, #E8C4C4)',
    'linear-gradient(135deg, #D4C5B9, #B8A99A)',
    'linear-gradient(135deg, #E8C4C4, #B76E79)',
    'linear-gradient(135deg, #8BA888, #6B7F5E)',
    'linear-gradient(135deg, #F5F0EB, #E8DDD3)',
    'linear-gradient(135deg, #D4A0A0, #C9A0A0)',
  ][i],
  caption: ['Our First Dance', 'The Venue', 'The Ring', 'Garden Walk', 'Sunset Moment', 'Together', 'The Toast', 'Under the Stars'][i],
}));

export default function PhotoGallery({ photos = defaultPhotos, variant = 'light' }) {
  const [lightbox, setLightbox] = useState(null);

  const openLightbox = (index) => setLightbox(index);
  const closeLightbox = () => setLightbox(null);
  const prevPhoto = () => setLightbox((lightbox - 1 + photos.length) % photos.length);
  const nextPhoto = () => setLightbox((lightbox + 1) % photos.length);

  return (
    <>
      <div className={`gallery gallery--${variant}`} id="photo-gallery">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={`gallery__item gallery__item--${(index % 6 === 0 || index % 6 === 3) ? 'large' : 'small'}`}
            onClick={() => openLightbox(index)}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div
              className="gallery__image"
              style={{ background: photo.gradient || `url(${photo.src}) center/cover` }}
            >
              <div className="gallery__overlay">
                <span className="gallery__caption">{photo.caption}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {lightbox !== null && (
        <div className="lightbox" onClick={closeLightbox} id="lightbox">
          <button className="lightbox__close" onClick={closeLightbox} aria-label="Close">
            <X size={24} />
          </button>
          <button className="lightbox__nav lightbox__nav--prev" onClick={(e) => { e.stopPropagation(); prevPhoto(); }} aria-label="Previous">
            <ChevronLeft size={28} />
          </button>
          <div
            className="lightbox__image"
            onClick={(e) => e.stopPropagation()}
            style={{ background: photos[lightbox].gradient || `url(${photos[lightbox].src}) center/cover` }}
          >
            <p className="lightbox__caption">{photos[lightbox].caption}</p>
          </div>
          <button className="lightbox__nav lightbox__nav--next" onClick={(e) => { e.stopPropagation(); nextPhoto(); }} aria-label="Next">
            <ChevronRight size={28} />
          </button>
          <div className="lightbox__counter">
            {lightbox + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}
