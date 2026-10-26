import React, { useEffect } from 'react';
import ShopCategoriesSection from '../../components/ShopCategoriesSection';

export default function ShopCategories() {
  useEffect(() => {
    document.title = "Shop Categories - WOMUP Local Stores";
  }, []);

  return (
    <main>
      <ShopCategoriesSection isPage={true} />
    </main>
  );
}

