import React, { useEffect } from 'react';
import HeroSection from '../../components/HeroSection';
import HowItWorksSection from '../../components/HowItWorksSection';
import ForCustomersSection from '../../components/ForCustomersSection';
import ForVendorsSection from '../../components/ForVendorsSection';
import ShopCategoriesSection from '../../components/ShopCategoriesSection';
import IncomeOpportunitySection from '../../components/IncomeOpportunitySection';
import MobileAppSection from '../../components/MobileAppSection';
import ContactSection from '../../components/ContactSection';

export default function Home() {
  useEffect(() => {
    document.title = "WOMUP - Empowering Local Shopping & Earning Platform";
  }, []);

  return (
    <main>
      <HeroSection />
      <HowItWorksSection />
      <ForCustomersSection />
      <ForVendorsSection />
      <ShopCategoriesSection />
      <IncomeOpportunitySection />
      <MobileAppSection />
      <ContactSection />
    </main>
  );
}

