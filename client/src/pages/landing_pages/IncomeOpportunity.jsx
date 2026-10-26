import React, { useEffect } from 'react';
import IncomeOpportunitySection from '../../components/IncomeOpportunitySection';

export default function IncomeOpportunity() {
  useEffect(() => {
    document.title = "Income Opportunity - WOMUP Smart Earnings";
  }, []);

  return (
    <main>
      <IncomeOpportunitySection isPage={true} />
    </main>
  );
}

