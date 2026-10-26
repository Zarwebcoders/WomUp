import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollRevealManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Helper to register elements with specific animation classes
    const setupRevealClasses = () => {
      // 1. Headers & Subtitles (Fade Up)
      const headers = document.querySelectorAll(
        '.hiw-header, .fc-heading, .fv-heading-group, .sc-header, .io-header, .ma-header, .contact-header-block'
      );
      headers.forEach(el => el.classList.add('reveal-fade-up'));

      // 2. Left Columns / Cards (Slide In from Left)
      const leftElements = document.querySelectorAll(
        '.fc-left-content, .fv-left-content, .io-earnings-card, .ma-mockup-wrapper, .contact-form-card, .customer-entity'
      );
      leftElements.forEach(el => el.classList.add('reveal-fade-left'));

      // 3. Right Columns / Visuals (Slide In from Right)
      const rightElements = document.querySelectorAll(
        '.fc-right-mockup, .fv-right-visual, .io-chart-wrapper, .ma-features-col, .support-contact-col, .vendor-entity'
      );
      rightElements.forEach(el => el.classList.add('reveal-fade-right'));

      // 4. Center Featured Components (Scale Up)
      const centerElements = document.querySelectorAll(
        '.diagram-center-loop, .io-calc-card, .hiw-step-highlight-banner, .leaf-accent'
      );
      centerElements.forEach(el => el.classList.add('reveal-scale-up'));

      // 5. Staggered Step Cards (How It Works)
      const stepCards = document.querySelectorAll('.step-card');
      stepCards.forEach((el, idx) => {
        el.classList.add('reveal-fade-up');
        el.style.transitionDelay = `${idx * 0.12}s`;
      });

      // 6. Staggered Shop Category Cards
      const catCards = document.querySelectorAll('.sc-card');
      catCards.forEach((el, idx) => {
        el.classList.add('reveal-scale-up');
        el.style.transitionDelay = `${(idx % 4) * 0.1}s`;
      });

      // 7. Staggered Pathway Cards (Contact)
      const pathwayCards = document.querySelectorAll('.pathway-card');
      pathwayCards.forEach((el, idx) => {
        el.classList.add('reveal-fade-up');
        el.style.transitionDelay = `${idx * 0.15}s`;
      });

      // 8. Staggered Feature Items (Hero strip)
      const featureItems = document.querySelectorAll('.feature-item');
      featureItems.forEach((el, idx) => {
        el.classList.add('reveal-fade-up');
        el.style.transitionDelay = `${idx * 0.1}s`;
      });

      // 9. Staggered Income Feature Columns
      const ioFeatures = document.querySelectorAll('.io-feature-col');
      ioFeatures.forEach((el, idx) => {
        el.classList.add('reveal-fade-up');
        el.style.transitionDelay = `${idx * 0.12}s`;
      });
    };

    setupRevealClasses();

    // IntersectionObserver to trigger animations when scrolled into viewport
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.12,
      }
    );

    const animatedElements = document.querySelectorAll(
      '.reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-scale-up'
    );

    animatedElements.forEach(el => observer.observe(el));

    // Handle any elements already visible on initial mount
    const timer = setTimeout(() => {
      animatedElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('revealed');
        }
      });
    }, 80);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}

