import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import HowItWorksPage from './pages/HowItWorks';
import HouseholdsPage from './pages/Households';
import MerchantsPage from './pages/Merchants';
import IndustriesPage from './pages/Industries';
import AggregatorsPage from './pages/Aggregators';
import MarketPricesPage from './pages/MarketPrices';
import ECommercePage from './pages/ECommerce';
import ContactPage from './pages/Contact';
import FAQPage from './pages/FAQ';

// Legal & Policies
import PrivacyPolicyPage from './pages/Legal/PrivacyPolicy';
import TermsPage from './pages/Legal/Terms';
import MerchantTermsPage from './pages/Legal/MerchantTerms';
import IndustryTermsPage from './pages/Legal/IndustryTerms';
import GrievancePage from './pages/Legal/Grievance';
import NotFoundPage from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/households" element={<HouseholdsPage />} />
          <Route path="/merchants" element={<MerchantsPage />} />
          <Route path="/industries" element={<IndustriesPage />} />
          <Route path="/aggregators" element={<AggregatorsPage />} />
          <Route path="/market-prices" element={<MarketPricesPage />} />
          <Route path="/e-commerce" element={<ECommercePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          
          {/* Legal & Compliance Routes */}
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/merchant-terms" element={<MerchantTermsPage />} />
          <Route path="/industry-terms" element={<IndustryTermsPage />} />
          <Route path="/grievance" element={<GrievancePage />} />
          
          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
