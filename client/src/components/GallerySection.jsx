import React, { useState, useEffect } from 'react';
import { useModal } from '../context/ModalContext';
import { getStoredMedia } from '../data/galleryData';

export default function GallerySection({ isPage = false }) {
  const { openVideoModal } = useModal();
  const [activeFilter, setActiveFilter] = useState('all');
  const [mediaItems, setMediaItems] = useState(getStoredMedia);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  // Real-time synchronization when admin adds/deletes items
  useEffect(() => {
    const handleUpdate = (e) => {
      setMediaItems(e.detail || getStoredMedia());
    };
    window.addEventListener('womup_gallery_updated', handleUpdate);
    window.addEventListener('storage', () => setMediaItems(getStoredMedia()));
    return () => {
      window.removeEventListener('womup_gallery_updated', handleUpdate);
      window.removeEventListener('storage', () => setMediaItems(getStoredMedia()));
    };
  }, []);

  const filteredMedia = activeFilter === 'all'
    ? mediaItems
    : mediaItems.filter((item) => item.category === activeFilter);

  const HeadingTag = isPage ? 'h1' : 'h2';

  return (
    <section className="gallery-main-section" id="gallery">
      {/* Hero Header */}
      <div className="gallery-hero-block">
        <div className="gallery-container">
          <span className="gallery-badge">MEDIA &amp; VISUAL STORIES</span>
          <HeadingTag className="gallery-main-title">
            WOMUP <span className="highlight-magenta">Photos &amp; Videos</span>
          </HeadingTag>
          <p className="gallery-subtitle">
            Explore authentic moments from verified local stores, happy smart shoppers, and video walkthroughs across Gujarat.
          </p>
        </div>
      </div>

      <div className="gallery-container">
        {/* Filter Bar */}
        <div className="gallery-filter-bar">
          {[
            { id: 'all', label: 'All Media' },
            { id: 'videos', label: '🎬 Videos & Guides' },
            { id: 'merchants', label: '🏪 Partner Stores' },
            { id: 'shoppers', label: '🛍️ Happy Shoppers' },
            { id: 'events', label: '🤝 Team & Events' },
          ].map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`gallery-filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        <div className="gallery-grid">
          {filteredMedia.map((item) => (
            <div key={item.id} className={`gallery-card ${item.type === 'video' ? 'video-card' : 'photo-card'}`}>
              <div 
                className="gallery-media-thumb"
                onClick={() => {
                  if (item.type === 'video') {
                    openVideoModal();
                  } else {
                    setSelectedImage(item);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`View ${item.title}`}
              >
                <img
                  src={item.type === 'video' ? item.thumbnail : item.image}
                  alt={item.title}
                  className="gallery-img"
                  loading="lazy"
                />

                {item.type === 'video' && (
                  <div className="video-overlay-btn" title="Watch Video">
                    <div className="play-triangle"></div>
                  </div>
                )}

                <div className="gallery-thumb-badge">
                  {item.type === 'video' ? `VIDEO • ${item.duration}` : 'PHOTO'}
                </div>

                {item.tag && (
                  <div className="gallery-featured-tag">
                    {item.tag}
                  </div>
                )}
              </div>

              <div className="gallery-content-box">
                <div className="gallery-meta-row">
                  <span className="gallery-cat-label">{item.categoryLabel}</span>
                  {item.location && <span className="gallery-loc-label">📍 {item.location}</span>}
                </div>
                <h3 className="gallery-item-title">{item.title}</h3>
                <p className="gallery-item-desc">{item.desc}</p>
                <button
                  type="button"
                  className="btn-gallery-action"
                  onClick={() => {
                    if (item.type === 'video') openVideoModal();
                    else setSelectedImage(item);
                  }}
                >
                  {item.type === 'video' ? 'Watch Full Video ▶' : 'View Full Image 🔍'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal for Photo Zoom */}
      {selectedImage && (
        <div className="modal-backdrop active gallery-lightbox" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content-box" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close-btn" onClick={() => setSelectedImage(null)} aria-label="Close Preview">
              &times;
            </button>
            <img src={selectedImage.image} alt={selectedImage.title} className="lightbox-img" />
            <div className="lightbox-info">
              <h3>{selectedImage.title}</h3>
              <p>{selectedImage.desc}</p>
              {selectedImage.location && <span className="lightbox-loc">📍 {selectedImage.location}</span>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
