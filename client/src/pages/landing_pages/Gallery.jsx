import React, { useEffect } from 'react';
import GallerySection from '../../components/GallerySection';

export default function Gallery() {
  useEffect(() => {
    document.title = "WOMUP Media Gallery - Photos, Store Partners & Videos";
  }, []);

  return (
    <main className="gallery-page-wrapper">
      <GallerySection isPage={true} />
    </main>
  );
}
