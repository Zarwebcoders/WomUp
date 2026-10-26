import React, { useState, useMemo } from 'react';
import { useModal } from '../context/ModalContext';

const CATEGORIES = [
  { 
    id: 'vegetables', 
    title: 'Vegetables', 
    group: 'Essentials',
    img: '/assets/categories/vegetables.png?v=hd2', 
    alt: 'Fresh Vegetables',
    badge: '15-20% Coin Off',
    desc: 'Farm fresh leafy greens, seasonal veggies, and organic local produce delivered or picked up.'
  },
  { 
    id: 'grocery', 
    title: 'Grocery', 
    group: 'Essentials',
    img: '/assets/categories/grocery.png?v=hd2', 
    alt: 'Daily Grocery Basket',
    badge: 'Save ?500/mo',
    desc: 'Daily rations, pulses, edible oils, spices, flour, and branded packaged food items.'
  },
  { 
    id: 'medical', 
    title: 'Medical', 
    group: 'Essentials',
    img: '/assets/categories/medical.png?v=hd2', 
    alt: 'Medical and Pharmacy',
    badge: '10-15% Off',
    desc: 'Prescription medicines, baby care products, surgical essentials, and daily wellness items.'
  },
  { 
    id: 'salon', 
    title: 'Salon', 
    group: 'Lifestyle',
    img: '/assets/categories/salon.png?v=hd2', 
    alt: 'Hair and Beauty Salon',
    badge: '20% Coin Value',
    desc: 'Haircuts, styling, facials, grooming packages, and bridal treatments for men and women.'
  },
  { 
    id: 'garments', 
    title: 'Garments', 
    group: 'Lifestyle',
    img: '/assets/categories/garments.png?v=hd2', 
    alt: 'Fashion and Garments',
    badge: 'Up to 25% Off',
    desc: 'Ethnic wear, western outfits, kids wear, and everyday trendy apparel from neighborhood boutiques.'
  },
  { 
    id: 'electronics', 
    title: 'Electronics', 
    group: 'Tech & Home',
    img: '/assets/categories/electronics.png?v=hd2', 
    alt: 'Electronics and Gadgets',
    badge: 'Instant Coin Cashback',
    desc: 'Mobile accessories, sound bars, home appliances, cables, and electronic repairs.'
  },
  { 
    id: 'footwear', 
    title: 'Footwear', 
    group: 'Lifestyle',
    img: '/assets/categories/footwear.png?v=hd2', 
    alt: 'Shoes and Footwear',
    badge: '15% Coin Savings',
    desc: 'Casual sneakers, formal shoes, ethnic sandals, sports footwear, and comfortable slippers.'
  },
  { 
    id: 'stationery', 
    title: 'Stationery', 
    group: 'Tech & Home',
    img: '/assets/categories/stationery.png?v=hd2', 
    alt: 'Stationery and Books',
    badge: 'School & Office Discounts',
    desc: 'School notebooks, art supplies, corporate stationery, writing essentials, and books.'
  },
  { 
    id: 'restaurant', 
    title: 'Restaurant', 
    group: 'Food & Dining',
    img: '/assets/categories/restaurant.png?v=hd2', 
    alt: 'Restaurant and Food',
    badge: 'Foodie Rewards',
    desc: 'Local diners, family restaurants, multi-cuisine cafes, fast food joints, and takeaways.'
  },
  { 
    id: 'sweet-shop', 
    title: 'Sweet Shop', 
    group: 'Food & Dining',
    img: '/assets/categories/sweet_shop.png?v=hd2', 
    alt: 'Traditional Sweet Shop',
    badge: 'Festive Deals',
    desc: 'Authentic Indian mithai, hot samosas, namkeens, kachoris, and festive gift boxes.'
  },
  { 
    id: 'hardware', 
    title: 'Hardware', 
    group: 'Tech & Home',
    img: '/assets/categories/hardware.png?v=hd2', 
    alt: 'Hardware and Tools',
    badge: 'Reliable Savings',
    desc: 'Paints, plumbing tools, electrical fittings, fasteners, locks, and construction hardware.'
  }
];

const FILTER_GROUPS = ['All', 'Essentials', 'Lifestyle', 'Tech & Home', 'Food & Dining'];

export default function ShopCategoriesSection({ isPage = false }) {
  const { setIsAppModalOpen } = useModal();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const HeadingTag = isPage ? 'h1' : 'h2';

  const filteredCategories = useMemo(() => {
    return CATEGORIES.filter((cat) => {
      const matchesFilter = activeFilter === 'All' || cat.group === activeFilter;
      const matchesSearch = cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            cat.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <section className="shop-categories-page" id="categories">
      {/* Background Ambient Glows */}
      <div className="sc-bg-glow glow-pink-top-left"></div>
      <div className="sc-bg-glow glow-blue-top-right"></div>
      <div className="sc-bg-glow glow-pink-bottom"></div>

      <div className="sc-container">
        {/* Header Section */}
        <div className="sc-header">
          <HeadingTag className="sc-main-title">
            <span className="title-dark">Wide Range of </span>
            <span className="title-pink">Local </span>
            <span className="title-blue">Shops</span>
          </HeadingTag>
          <p className="sc-subtitle">Everything you need, near you &bull; Redeem your ?2,000 coins across all partner stores</p>
        </div>

        {/* Interactive Search & Filter Bar */}
        <div className="sc-search-filter-wrapper">
          <div className="sc-search-box">
            <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search category, groceries, medicines, salon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sc-search-input"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="search-clear-btn" 
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
          </div>

          <div className="sc-filter-tabs">
            {FILTER_GROUPS.map((group) => (
              <button
                key={group}
                type="button"
                className={`sc-filter-tab ${activeFilter === group ? 'tab-active' : ''}`}
                onClick={() => setActiveFilter(group)}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {/* 12 Category Cards Grid */}
        <div className="sc-grid">
          {filteredCategories.map((cat) => (
            <div 
              key={cat.id} 
              className="sc-card interactive-hover" 
              data-category={cat.id}
              onClick={() => setSelectedCategory(cat)}
              role="button"
              tabIndex={0}
            >
              <div className="sc-card-badge-pill">{cat.badge}</div>
              <div className="sc-img-wrap">
                <img src={cat.img} alt={cat.alt} className="sc-img" />
              </div>
              <h3 className="sc-card-title">{cat.title}</h3>
              <span className="sc-card-tap-hint">Tap to view details &rarr;</span>
            </div>
          ))}

          {/* Card 12: More (shows if filter is All or no search restriction) */}
          {(activeFilter === 'All' || activeFilter === 'Tech & Home') && !searchQuery && (
            <div 
              className="sc-card card-more interactive-hover" 
              data-category="more"
              onClick={() => setIsAppModalOpen(true)}
              role="button"
              tabIndex={0}
            >
              <div className="sc-img-wrap more-img-wrap">
                <svg className="more-store-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="moreStoreGradIdx" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="60%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                  </defs>
                  <path d="M12 26L17 14C17.5 12.8 18.7 12 20 12H25L21 26H12Z" fill="url(#moreStoreGradIdx)" />
                  <path d="M24 26L28 12H36L40 26H24Z" fill="url(#moreStoreGradIdx)" />
                  <path d="M43 26L39 12H44C45.3 12 46.5 12.8 47 14L52 26H43Z" fill="url(#moreStoreGradIdx)" />
                  <path d="M12 26C12 28.5 14 30 16.5 30C19 30 21 28.5 21 26C21 28.5 23.5 30 26 30C28.5 30 31 28.5 31 26C31 28.5 33.5 30 36 30C38.5 30 41 28.5 41 26C41 28.5 43 30 45.5 30C48 30 50 28.5 50 26H52V28C52 30.5 49.5 32 47 32C44.5 32 42.5 30.5 42 28C41.5 30.5 39 32 36.5 32C34 32 32 30.5 31.5 28C31 30.5 28.5 32 26 32C23.5 32 21.5 30.5 21 28C20.5 30.5 18 32 15.5 32C13 32 11 30.5 11 28V26H12Z" fill="url(#moreStoreGradIdx)" />
                  <rect x="14" y="29" width="36" height="23" rx="4" fill="url(#moreStoreGradIdx)" />
                  <rect x="18" y="34" width="11" height="10" rx="2" fill="#f5f0ff" />
                  <rect x="34" y="34" width="12" height="18" rx="2" fill="#f5f0ff" />
                </svg>
              </div>
              <h3 className="sc-card-title">50+ More</h3>
              <span className="sc-card-tap-hint">Explore full network &rarr;</span>
            </div>
          )}
        </div>

        {/* Empty Search Result State */}
        {filteredCategories.length === 0 && (
          <div className="sc-empty-state">
            <p>No categories found matching "<strong>{searchQuery}</strong>".</p>
            <button 
              type="button" 
              className="btn-reset-filter"
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('All');
              }}
            >
              Reset Search Filter
            </button>
          </div>
        )}

        {/* Centered Action Button */}
        <div className="sc-cta-wrap">
          <button className="btn-view-all-shops" id="viewAllShopsBtnIndex" onClick={() => setIsAppModalOpen(true)}>
            <span>View All Nearby Shops on App</span>
            <svg className="cta-arrow" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Category Quick Details Modal */}
      {selectedCategory && (
        <div className="cat-modal-backdrop" onClick={() => setSelectedCategory(null)}>
          <div className="cat-modal-card" onClick={(e) => e.stopPropagation()}>
            <button 
              className="cat-modal-close" 
              onClick={() => setSelectedCategory(null)}
              aria-label="Close modal"
            >
              &times;
            </button>
            <div className="cat-modal-header">
              <div className="cat-modal-img-wrap">
                <img src={selectedCategory.img} alt={selectedCategory.alt} />
              </div>
              <div>
                <span className="cat-modal-group">{selectedCategory.group}</span>
                <h3 className="cat-modal-title">{selectedCategory.title}</h3>
                <span className="cat-modal-badge">{selectedCategory.badge}</span>
              </div>
            </div>
            <p className="cat-modal-desc">{selectedCategory.desc}</p>
            
            <div className="cat-modal-perks">
              <div className="perk-row">
                <span className="perk-icon">??</span>
                <span>Pay using monthly ?2,000 WOMUP coins</span>
              </div>
              <div className="perk-row">
                <span className="perk-icon">?</span>
                <span>Instant QR scan billing at counter</span>
              </div>
              <div className="perk-row">
                <span className="perk-icon">??</span>
                <span>Verified neighborhood vendors within 2 km</span>
              </div>
            </div>

            <div className="cat-modal-actions">
              <button 
                className="btn-modal-find"
                onClick={() => {
                  setSelectedCategory(null);
                  setIsAppModalOpen(true);
                }}
              >
                Find Nearby {selectedCategory.title} Stores
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

