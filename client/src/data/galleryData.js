// Shared Gallery Media Data & Local Storage Handler
export const INITIAL_MEDIA = [
  {
    id: 'media-1',
    type: 'video',
    title: 'How WOMUP Works: Smart Shopping & Digital Coins Explainer',
    category: 'videos',
    categoryLabel: 'Video Walkthrough',
    duration: '2:15 min',
    thumbnail: '/assets/vendor_store_owner.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tag: 'FEATURED VIDEO',
    desc: 'Watch how customers save ₹2,000 monthly with digital coins while local merchants gain daily footfall.',
    location: 'Ahmedabad, Gujarat',
    createdAt: '2026-10-20',
  },
  {
    id: 'media-2',
    type: 'photo',
    title: 'Verified Kirana & Supermarket Partner Store',
    category: 'merchants',
    categoryLabel: 'Partner Stores',
    image: '/assets/vendor_store_owner.jpg',
    location: 'Satellite Road, Ahmedabad',
    desc: 'Local grocery store equipped with official WOMUP QR standee and digital instant redemption.',
    createdAt: '2026-10-21',
  },
  {
    id: 'media-3',
    type: 'photo',
    title: 'Fresh Vegetables & Daily Essentials Partner Outlets',
    category: 'merchants',
    categoryLabel: 'Partner Stores',
    image: '/assets/fresh_vegetables.jpg',
    location: 'SG Highway, Ahmedabad',
    desc: 'Farm-fresh vegetable vendors registered on WOMUP providing direct customer discounts.',
    createdAt: '2026-10-22',
  },
  {
    id: 'media-4',
    type: 'video',
    title: 'Pincode Referral Income Explained: ₹20, ₹10, ₹5 Joining Rewards',
    category: 'videos',
    categoryLabel: 'Explainer Video',
    duration: '3:10 min',
    thumbnail: '/assets/hero_woman.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tag: 'PINCODE EARNINGS',
    desc: 'Complete guide on how community leaders earn referral rewards within their designated pincode.',
    location: 'SG Highway, Ahmedabad',
    createdAt: '2026-10-22',
  },
  {
    id: 'media-5',
    type: 'photo',
    title: 'Happy Shopper Community: Real Savings on Everyday Purchases',
    category: 'shoppers',
    categoryLabel: 'Shoppers Moments',
    image: '/assets/customer_user.jpg',
    location: 'Nikol Hub, Ahmedabad',
    desc: 'Smart families celebrating extra monthly household savings and referral rewards.',
    createdAt: '2026-10-23',
  },
  {
    id: 'media-6',
    type: 'photo',
    title: 'Vendor Partner Onboarding & Store Authorization',
    category: 'merchants',
    categoryLabel: 'Partner Stores',
    image: '/assets/vendor_shopkeeper.jpg',
    location: 'Signature-2, Ahmedabad',
    desc: 'Retail store merchant receiving official WOMUP certification and merchant QR scanner kit.',
    createdAt: '2026-10-23',
  },
  {
    id: 'media-7',
    type: 'video',
    title: 'Vendor Testimonial: 40% Increase in Weekly Customer Footfall',
    category: 'videos',
    categoryLabel: 'Merchant Stories',
    duration: '1:45 min',
    thumbnail: '/assets/vendor_shopkeeper.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tag: 'SUCCESS STORY',
    desc: 'Local retailer shares how WOMUP customers became their primary loyal repeat shoppers.',
    location: 'Mahesana, Gujarat',
    createdAt: '2026-10-24',
  },
  {
    id: 'media-8',
    type: 'photo',
    title: 'Dedicated Customer & Merchant Support Representative Team',
    category: 'events',
    categoryLabel: 'Team & Events',
    image: '/assets/support_agent_hd.jpg',
    location: 'WOMUP Corporate Office, Ahmedabad',
    desc: 'Our multilingual support team assisting customers and merchants across Gujarat 6 days a week.',
    createdAt: '2026-10-24',
  },
  {
    id: 'media-9',
    type: 'photo',
    title: 'Empowering Women Entrepreneurs & Smart Homemakers',
    category: 'shoppers',
    categoryLabel: 'Shoppers Moments',
    image: '/assets/hero_woman.jpg',
    location: 'Prahlad Nagar, Ahmedabad',
    desc: 'Homemakers building substantial monthly referral income through neighborhood smart shopping.',
    createdAt: '2026-10-24',
  },
];

const STORAGE_KEY = 'womup_gallery_media';

export function getStoredMedia() {
  if (typeof window === 'undefined') return INITIAL_MEDIA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEDIA));
      return INITIAL_MEDIA;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MEDIA;
  } catch (err) {
    console.error('Error reading gallery media from localStorage:', err);
    return INITIAL_MEDIA;
  }
}

export function saveStoredMedia(items) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('womup_gallery_updated', { detail: items }));
  } catch (err) {
    console.error('Error saving gallery media to localStorage:', err);
  }
}

export function addMediaItem(item) {
  const current = getStoredMedia();
  const newItem = {
    ...item,
    id: 'media-' + Date.now(),
    createdAt: new Date().toISOString().split('T')[0],
  };
  const updated = [newItem, ...current];
  saveStoredMedia(updated);
  return updated;
}

export function deleteMediaItem(id) {
  const current = getStoredMedia();
  const updated = current.filter((item) => item.id !== id);
  saveStoredMedia(updated);
  return updated;
}

export function resetToDefaults() {
  saveStoredMedia(INITIAL_MEDIA);
  return INITIAL_MEDIA;
}
