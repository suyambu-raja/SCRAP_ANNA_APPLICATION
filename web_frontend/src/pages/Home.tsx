import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  ShieldCheck,
  Scale,
  Building2,
  Store,
  Home as HomeIcon,
  Recycle,
  Volume2,
  MapPin,
  Globe,
  Lock,
  X,
  TrendingUp,
  Receipt,
  DollarSign,
  Mail,
  Phone,
  ChevronDown,
  Info,
  UploadCloud,
  Truck,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { Button, Navbar } from '@/components/common';
import { PriceCard } from '@/components/cards/PriceCard';
import { SkeletonCard } from '@/components/common/SkeletonLoader';
import { getMarketPrices, getScrapCategories } from '@/services';
import { useAuthStore } from '@/store/useAuthStore';
import type { MarketPrice, ScrapCategory } from '@/types';
import styles from './Home.module.css';

export default function Home() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [, setCategories] = useState<ScrapCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedTrustCard, setSelectedTrustCard] = useState<number | null>(null);
  const [selectedRoleCard, setSelectedRoleCard] = useState<number | null>(null);
  const [selectedStepCard, setSelectedStepCard] = useState<number | null>(null);
  const [accessibilityActive, setAccessibilityActive] = useState(false);

  const isTamil = i18n.language === 'ta';

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      navigate(`/dashboard/${user.role}`, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    Promise.all([
      getMarketPrices(),
      getScrapCategories(),
    ]).then(([priceData, catData]) => {
      setPrices(priceData);
      setCategories(catData);
      setLoading(false);
    });
  }, []);

  if (isAuthenticated && user?.role) {
    return null;
  }

  const SELECTIVE_MATERIAL_IDS = [
    'COP_001', // Copper Scrap
    'BRS_001', // Brass Scrap
    'IRON_001', // Scrap Iron
    'PLS_007', // Mixed plastic
    'CRD_001', // Corrugated Cardboard
  ];

  const displayedPrices = SELECTIVE_MATERIAL_IDS.map((id) =>
    prices.find((p) => p.id === id)
  ).filter((p): p is MarketPrice => Boolean(p));

  return (
    <div className={styles.desktopPlatform}>
      {/* 1. Desktop Navbar matching Company Site */}
      <Navbar />

      {/* 2. Hero Section — Exact match with company site */}
      <section id="home" className={styles.heroSectionExact}>
        <div className={styles.heroGridExact}>
          {/* Left Hero Content */}
          <div className={styles.heroLeftExact}>
            <div className={styles.badgeWrapper}>
              <span className={styles.badgeYellow}>
                <MapPin size={13} className={styles.locationPinAnim} />
                Launching in Chennai, Tamil Nadu
              </span>
            </div>

            <h1 className={styles.heroHeadlineExact}>
              Connecting Scrap.<br />
              Creating Value.<br />
              <span className={styles.heroLastLine}>
                Building a <span className={styles.heroYellowSpan}>Better Tomorrow.</span>
              </span>
            </h1>

            <p className={styles.heroDescExact}>
              Scrap Anna is starting its journey in Chennai, connecting households, merchants and industries on one digital platform for transparent transactions, fair prices and a cleaner future.
            </p>

            {/* 4 Feature Badges Row */}
            <div className={styles.heroTrustGrid}>
              <div className={styles.heroTrustItem}>
                <div className={styles.heroTrustIconCircle}>
                  <ShieldCheck size={18} strokeWidth={1.6} />
                </div>
                <span className={styles.heroTrustLabel}>Verified & Trusted Network</span>
              </div>

              <div className={styles.heroTrustItem}>
                <div className={styles.heroTrustIconCircle}>
                  <Receipt size={18} strokeWidth={1.6} />
                </div>
                <span className={styles.heroTrustLabel}>Digital Billing & Payments</span>
              </div>

              <div className={styles.heroTrustItem}>
                <div className={styles.heroTrustIconCircle}>
                  <TrendingUp size={18} strokeWidth={1.6} />
                </div>
                <span className={styles.heroTrustLabel}>Fair Prices & Market Transparency</span>
              </div>

              <div className={styles.heroTrustItem}>
                <div className={styles.heroTrustIconCircle}>
                  <Scale size={18} strokeWidth={1.6} />
                </div>
                <span className={styles.heroTrustLabel}>Secure & Safe Transactions</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className={styles.heroCtaGroup}>
              {isAuthenticated && user ? (
                <Button
                  size="lg"
                  className={styles.heroPrimaryBtn}
                  icon={<ArrowRight size={18} />}
                  onClick={() => navigate(`/dashboard/${user.role}`)}
                >
                  {isTamil ? 'டாஷ்போர்டிற்கு செல்' : `Open ${user.role.toUpperCase()} Dashboard`}
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    className={styles.heroPrimaryBtn}
                    icon={<ArrowRight size={18} />}
                    onClick={() => navigate('/login')}
                  >
                    {isTamil ? 'ஸ்கிராப் அன்னாவில் சேரவும்' : 'Join Scrap Anna'}
                  </Button>
                  <button
                    type="button"
                    className={styles.heroWatchBtn}
                    onClick={() => setShowVideoModal(true)}
                  >
                    <span className={styles.playIconDark}>▶</span>
                    <span>Watch How It Works</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Hero Image with Floating Decorative Badges — Flush to the right corner */}
          <div className={styles.heroImageWrapperExact}>
            {/* Floating Element 1 (Top Left) */}
            <div className={styles.heroFloatChip1}>
              <div className={styles.chipDarkBox}>
                <Scale size={15} strokeWidth={2.2} />
              </div>
              <div>
                <div className={styles.chipTitle}>Digital Weighing</div>
                <div className={styles.chipSub}>100% Calibrated Scales</div>
              </div>
            </div>

            {/* Floating Element 2 (Top Right) */}
            <div className={styles.heroFloatChip2}>
              <div className={styles.chipDarkBox}>
                <Receipt size={15} strokeWidth={2.2} />
              </div>
              <div>
                <div className={styles.chipTitle}>Instant Payout</div>
                <div className={styles.chipSub}>UPI & Digital Bill</div>
              </div>
            </div>

            <img
              src="/hero-truck.png"
              alt="Scrap Anna branded truck loaded with scrap metal, city skyline and barrels"
              width="640"
              height="480"
              className={styles.heroTruckImgExact}
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Main Body Content */}
      <main className={styles.mainContainer}>
        {/* 3. Who We Serve — 4-Column Desktop Cards Grid */}
        <section id="who-we-serve" className={styles.contentSection}>
          <div className={styles.sectionHeaderCentered}>
            <span className={styles.sectionCategoryTag}>Ecosystem Participants</span>
            <h2 className={styles.sectionMainHeading}>
              Who We <span className={styles.yellowText}>Serve</span>
            </h2>
            <p className={styles.sectionLeadText}>
              Tailored interfaces, workflows, and tools built specifically for each role in the recycling chain.
            </p>
          </div>

          <div className={styles.threeColumnGrid}>
            {/* Household */}
            <div
              className={[
                styles.roleBox,
                selectedRoleCard === 0 ? styles.roleBoxActive : '',
              ].join(' ')}
              onClick={() => setSelectedRoleCard(selectedRoleCard === 0 ? null : 0)}
            >
              <div className={styles.roleHeader}>
                <div className={styles.roleIconWrap}>
                  <HomeIcon size={20} />
                </div>
                <span className={styles.rolePill}>Household</span>
              </div>
              <h3 className={styles.roleHeading}>Households & Apartments</h3>
              <p className={styles.roleDescText}>
                Doorstep scrap pickups with calibrated digital scales, instant UPI payouts, and guaranteed fair benchmark rates with zero manual deductions.
              </p>
            </div>

            {/* Merchant */}
            <div
              className={[
                styles.roleBox,
                selectedRoleCard === 1 ? styles.roleBoxActive : '',
              ].join(' ')}
              onClick={() => setSelectedRoleCard(selectedRoleCard === 1 ? null : 1)}
            >
              <div className={styles.roleHeader}>
                <div className={styles.roleIconWrap}>
                  <Store size={20} />
                </div>
                <span className={styles.rolePill}>Merchant</span>
              </div>
              <h3 className={styles.roleHeading}>Scrap Merchants & Shops</h3>
              <p className={styles.roleDescText}>
                Direct access to residential pickup leads and verified industrial supply across Chennai, with private quoting and expanded trading volume.
              </p>
            </div>

            {/* Industry */}
            <div
              className={[
                styles.roleBox,
                selectedRoleCard === 2 ? styles.roleBoxActive : '',
              ].join(' ')}
              onClick={() => setSelectedRoleCard(selectedRoleCard === 2 ? null : 2)}
            >
              <div className={styles.roleHeader}>
                <div className={styles.roleIconWrap}>
                  <Building2 size={20} />
                </div>
                <span className={styles.rolePill}>Industry</span>
              </div>
              <h3 className={styles.roleHeading}>Industries & Factories</h3>
              <p className={styles.roleDescText}>
                Post bulk manufacturing scrap requisitions, compare sealed merchant quotes, and maximize recycling returns with weighbridge transparency.
              </p>
            </div>
          </div>
        </section>

        {/* 4. How It Works — 3-Step Process (Upload -> Merchant Pickup -> Instant Payment) */}
        <section id="how-it-works" className={styles.contentSection}>
          <div className={styles.sectionHeaderCentered}>
            <span className={styles.sectionCategoryTag}>Simple 3-Step Process</span>
            <h2 className={styles.sectionMainHeading}>
              How It <span className={styles.yellowText}>Works</span>
            </h2>
            <p className={styles.sectionLeadText}>
              Recycling your scrap in Chennai is seamless and transparent. From doorstep pickup to instant payment in 3 simple steps.
            </p>
          </div>

          <div className={styles.howItWorksGrid}>
            {/* Step 1: Upload */}
            <div
              className={[
                styles.howItWorksCard,
                selectedStepCard === 0 ? styles.howItWorksCardActive : '',
              ].join(' ')}
              onClick={() => setSelectedStepCard(selectedStepCard === 0 ? null : 0)}
            >
              <div className={styles.stepTopRow}>
                <div className={styles.stepIconWrap}>
                  <UploadCloud size={24} strokeWidth={2.2} />
                </div>
                <span className={styles.stepBadgePill}>STEP 01</span>
              </div>
              <h3 className={styles.stepCardTitle}>1. Upload Scrap</h3>
              <p className={styles.stepCardDesc}>
                Take a quick photo or select your recyclable scrap items and quantity. Receive live indicative rate estimates instantly.
              </p>
              <div className={styles.stepFeatureList}>
                <div className={styles.stepFeatureItem}>
                  <CheckCircle2 size={15} className={styles.stepCheckIcon} />
                  <span>Photo or text material upload</span>
                </div>
                <div className={styles.stepFeatureItem}>
                  <CheckCircle2 size={15} className={styles.stepCheckIcon} />
                  <span>Instant live benchmark rates</span>
                </div>
              </div>
            </div>

            {/* Step 2: Merchant Pickup */}
            <div
              className={[
                styles.howItWorksCard,
                selectedStepCard === 1 ? styles.howItWorksCardActive : '',
              ].join(' ')}
              onClick={() => setSelectedStepCard(selectedStepCard === 1 ? null : 1)}
            >
              <div className={styles.stepTopRow}>
                <div className={styles.stepIconWrap}>
                  <Truck size={24} strokeWidth={2.2} />
                </div>
                <span className={styles.stepBadgePill}>STEP 02</span>
              </div>
              <h3 className={styles.stepCardTitle}>2. Merchant Pickup</h3>
              <p className={styles.stepCardDesc}>
                A verified Scrap Anna merchant partner arrives at your doorstep on your chosen date and weighs items using 100% digital scales.
              </p>
              <div className={styles.stepFeatureList}>
                <div className={styles.stepFeatureItem}>
                  <CheckCircle2 size={15} className={styles.stepCheckIcon} />
                  <span>Verified doorstep partner</span>
                </div>
                <div className={styles.stepFeatureItem}>
                  <CheckCircle2 size={15} className={styles.stepCheckIcon} />
                  <span>100% calibrated digital scale</span>
                </div>
              </div>
            </div>

            {/* Step 3: Instant Payment */}
            <div
              className={[
                styles.howItWorksCard,
                selectedStepCard === 2 ? styles.howItWorksCardActive : '',
              ].join(' ')}
              onClick={() => setSelectedStepCard(selectedStepCard === 2 ? null : 2)}
            >
              <div className={styles.stepTopRow}>
                <div className={styles.stepIconWrap}>
                  <Zap size={24} strokeWidth={2.2} />
                </div>
                <span className={styles.stepBadgePill}>STEP 03</span>
              </div>
              <h3 className={styles.stepCardTitle}>3. Instant Payment</h3>
              <p className={styles.stepCardDesc}>
                Get paid immediately to your UPI or bank account with an instant digital invoice before the material leaves your premises.
              </p>
              <div className={styles.stepFeatureList}>
                <div className={styles.stepFeatureItem}>
                  <CheckCircle2 size={15} className={styles.stepCheckIcon} />
                  <span>Direct UPI & bank transfer</span>
                </div>
                <div className={styles.stepFeatureItem}>
                  <CheckCircle2 size={15} className={styles.stepCheckIcon} />
                  <span>Digital weight receipt & invoice</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Scrap Market Rates — Professional Marketplace Directory Section */}
        <section id="market-prices" className={styles.marketSnapshotSection}>
          {/* Header Row: Title, Subtitle, Accent Line + Location Selector */}
          <div className={styles.marketSnapshotHeader}>
            <div className={styles.marketHeaderLeft}>
              <h2 className={styles.marketMainTitle}>SCRAP MARKET RATES</h2>
              <p className={styles.marketSubtitle}>
                Live market rates for various scrap materials in your area.
              </p>
              <div className={styles.yellowAccentLine} />
            </div>

            <div className={styles.marketHeaderRight}>
              <div className={styles.locationSelectorBtn}>
                <MapPin size={15} className={styles.locPinIcon} />
                <span className={styles.locationText}>Chennai, Tamil Nadu</span>
                <ChevronDown size={14} className={styles.locChevronIcon} />
              </div>
            </div>
          </div>

          {/* 3-Column Desktop Market Snapshot Grid */}
          <div className={styles.marketSnapshotGrid}>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : displayedPrices.length > 0 ? (
              displayedPrices.map((p) => (
                <PriceCard
                  key={p.id}
                  price={p}
                  onClick={() =>
                    navigate(
                      `/market-prices?category=${encodeURIComponent(p.categoryId)}&item=${encodeURIComponent(p.id)}`
                    )
                  }
                />
              ))
            ) : (
              <div className={styles.emptySnapshotMessage}>
                No benchmark prices found for this category in Chennai.
              </div>
            )}
          </div>

          {/* Single Price Note for the entire collection */}
          <div className={styles.singlePriceNoteBox}>
            <Info size={18} className={styles.noteInfoIcon} />
            <div className={styles.noteContent}>
              <strong>Price Note:</strong> Rates are indicative and may vary based on
              material quality, quantity, location and prevailing market conditions.
            </div>
          </div>

          {/* Bottom Bar: Action */}
          <div className={styles.marketBottomRow}>
            <div className={styles.marketLastUpdatedText}>
              ◷ Rates refreshed daily from verified Chennai aggregators
            </div>
            <Link to="/market-prices" className={styles.viewAllBottomBtn}>
              <span>View All Scrap Materials</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* 6. Why Choose Scrap Anna — 4-Column Trust Assurances */}
        <section id="why-choose-us" className={styles.contentSection}>
          <div className={styles.sectionHeaderCentered}>
            <span className={styles.sectionCategoryTag}>Security & Quality</span>
            <h2 className={styles.sectionMainHeading}>
              Why Choose <span className={styles.yellowText}>Scrap</span> Anna?
            </h2>
            <p className={styles.sectionLeadText}>
              Built from the ground up to provide transparency, security, and fair market value.
            </p>
          </div>

          <div className={styles.fourColumnGrid}>
            <div
              className={[
                styles.trustAssuranceCard,
                selectedTrustCard === 0 ? styles.trustAssuranceCardActive : '',
              ].join(' ')}
              onClick={() => setSelectedTrustCard(selectedTrustCard === 0 ? null : 0)}
            >
              <Scale size={26} className={styles.trustFeatureIcon} />
              <h3 className={styles.trustFeatureTitle}>Certified Digital Scales</h3>
              <p className={styles.trustFeatureText}>
                No manipulated manual scales. All doorstep pickups use calibrated electronic balances with weight verification.
              </p>
            </div>

            <div
              className={[
                styles.trustAssuranceCard,
                selectedTrustCard === 1 ? styles.trustAssuranceCardActive : '',
              ].join(' ')}
              onClick={() => setSelectedTrustCard(selectedTrustCard === 1 ? null : 1)}
            >
              <ShieldCheck size={26} className={styles.trustFeatureIcon} />
              <h3 className={styles.trustFeatureTitle}>Verified Partner Network</h3>
              <p className={styles.trustFeatureText}>
                Every merchant, aggregator, and industrial facility is verified with business credentials for safe, lawful transactions.
              </p>
            </div>

            <div
              className={[
                styles.trustAssuranceCard,
                selectedTrustCard === 2 ? styles.trustAssuranceCardActive : '',
              ].join(' ')}
              onClick={() => setSelectedTrustCard(selectedTrustCard === 2 ? null : 2)}
            >
              <Lock size={26} className={styles.trustFeatureIcon} />
              <h3 className={styles.trustFeatureTitle}>Sealed Private Quoting</h3>
              <p className={styles.trustFeatureText}>
                Industrial requisitions receive sealed private quotes, preserving price confidentiality without public bidding wars.
              </p>
            </div>

            <div
              className={[
                styles.trustAssuranceCard,
                selectedTrustCard === 3 ? styles.trustAssuranceCardActive : '',
              ].join(' ')}
              onClick={() => setSelectedTrustCard(selectedTrustCard === 3 ? null : 3)}
            >
              <DollarSign size={26} className={styles.trustFeatureIcon} />
              <h3 className={styles.trustFeatureTitle}>Direct Instant Payouts</h3>
              <p className={styles.trustFeatureText}>
                Immediate payment transfer directly to your UPI ID or bank account before the material leaves your premises.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Tamil & English Accessibility */}
        <section
          id="accessibility"
          className={[
            styles.bilingualAccessibilityBanner,
            accessibilityActive ? styles.bilingualAccessibilityBannerActive : '',
          ].join(' ')}
          onClick={() => setAccessibilityActive(!accessibilityActive)}
        >
          <div className={styles.accessIconContainer}>
            <Globe size={28} />
          </div>
          <div className={styles.accessTextContainer}>
            <h3 className={styles.accessTitle}>
              {isTamil
                ? 'தமிழ் மற்றும் ஆங்கில (English) ஆதரவுடன் வாய்ஸ் உதவி'
                : 'Tamil & English Support with Voice Assistance'}
            </h3>
          </div>
          <div className={styles.voiceBadgePill}>
            <Volume2 size={16} /> Tamil Voice Assisted
          </div>
        </section>

        {/* 8. Final Join CTA */}
        {!isAuthenticated && (
          <section className={styles.finalCallToActionBanner}>
            <div className={styles.ctaContentWrapper}>
              <h2 className={styles.ctaBannerHeading}>Ready to start recycling smarter?</h2>
              <p className={styles.ctaBannerSubtext}>
                Join thousands of households, verified scrap merchants, and industrial facilities across Tamil Nadu today.
              </p>
              <div className={styles.ctaBtnWrapper}>
                <Button
                  size="lg"
                  className={styles.ctaDarkBtn}
                  icon={<ArrowRight size={18} />}
                  onClick={() => navigate('/login')}
                >
                  Join Scrap Anna Today — Free
                </Button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Embedded "How It Works" Video Modal */}
      {showVideoModal && (
        <div className={styles.videoModalOverlay} onClick={() => setShowVideoModal(false)}>
          <div className={styles.videoModalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.videoModalHeader}>
              <div className={styles.videoModalTitle}>
                <span style={{ color: 'var(--color-primary)' }}>▶</span>
                <span>How Scrap Anna Works — Step by Step</span>
              </div>
              <button
                type="button"
                className={styles.videoCloseBtn}
                onClick={() => setShowVideoModal(false)}
                aria-label="Close video"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.videoIframeWrapper}>
              <iframe
                className={styles.videoIframe}
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="How Scrap Anna Works Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className={styles.videoModalFooter}>
              <p>Learn how calibrated digital scales, transparent reference pricing, and instant doorstep UPI payments work in Chennai.</p>
              <Button size="sm" onClick={() => { setShowVideoModal(false); navigate('/login'); }}>
                Get Started Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Graphite Footer — Exact Replica of Company Site */}
      <footer className={styles.desktopFooter}>
        <div className={styles.footerInnerContainer}>
          {/* Column 1: Brand & Bio */}
          <div className={styles.footerBrandCol}>
            <Link to="/home" className={styles.footerBrandTitleLink}>
              <span className={styles.footerBrandText}>
                Scrap <span className={styles.footerYellowSpan}>Anna</span>
              </span>
            </Link>
            <p className={styles.footerDescText}>
              A trusted digital scrap network launching first in Chennai, Tamil Nadu, connecting households, merchants, and industries for transparent recycling and fair prices.
            </p>
            <div className={styles.footerTaglineExact}>
              CONNECT • COLLECT • RECYCLE
            </div>
          </div>

          {/* Column 2: Home Sections */}
          <div className={styles.footerNavCol}>
            <h4 className={styles.footerNavTitle}>Home Sections</h4>
            <a
              href="#who-we-serve"
              className={styles.footerNavLink}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('who-we-serve');
                if (el) {
                  const offset = 76;
                  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                  window.scrollTo({ top, behavior: 'smooth' });
                  window.history.pushState(null, '', '#who-we-serve');
                }
              }}
            >
              Who We Serve
            </a>
            <a
              href="#how-it-works"
              className={styles.footerNavLink}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('how-it-works');
                if (el) {
                  const offset = 76;
                  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                  window.scrollTo({ top, behavior: 'smooth' });
                  window.history.pushState(null, '', '#how-it-works');
                }
              }}
            >
              How It Works
            </a>
            <a
              href="#market-prices"
              className={styles.footerNavLink}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('market-prices');
                if (el) {
                  const offset = 76;
                  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                  window.scrollTo({ top, behavior: 'smooth' });
                  window.history.pushState(null, '', '#market-prices');
                }
              }}
            >
              Scrap Market Rates
            </a>
            <a
              href="#why-choose-us"
              className={styles.footerNavLink}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('why-choose-us');
                if (el) {
                  const offset = 76;
                  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                  window.scrollTo({ top, behavior: 'smooth' });
                  window.history.pushState(null, '', '#why-choose-us');
                }
              }}
            >
              Why Choose Us
            </a>
            <a
              href="#accessibility"
              className={styles.footerNavLink}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('accessibility');
                if (el) {
                  const offset = 76;
                  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                  window.scrollTo({ top, behavior: 'smooth' });
                  window.history.pushState(null, '', '#accessibility');
                }
              }}
            >
              Language Support
            </a>
          </div>

          {/* Column 3: Legal & Trust */}
          <div className={styles.footerNavCol}>
            <h4 className={styles.footerNavTitle}>Legal & Trust</h4>
            <a href="#privacy" className={styles.footerNavLink}>Privacy Policy</a>
            <a href="#terms" className={styles.footerNavLink}>Terms of Service</a>
            <a href="#merchant-terms" className={styles.footerNavLink}>Merchant Terms</a>
            <a href="#industry-terms" className={styles.footerNavLink}>Industry Terms</a>
            <a href="#grievance" className={styles.footerNavLink}>Grievance Redressal</a>
          </div>

          {/* Column 4: Contact Scrap Anna */}
          <div className={styles.footerNavCol}>
            <h4 className={styles.footerNavTitle}>Contact Scrap Anna</h4>
            <div className={styles.contactItemRow}>
              <MapPin size={16} className={styles.contactYellowIcon} />
              <span>Chennai, Tamil Nadu, India</span>
            </div>
            <a href="mailto:scrap.anna.shop@gmail.com" className={styles.contactItemRow}>
              <Mail size={16} className={styles.contactYellowIcon} />
              <span>scrap.anna.shop@gmail.com</span>
            </a>
            <a href="tel:+917338995341" className={styles.contactItemRow}>
              <Phone size={16} className={styles.contactYellowIcon} />
              <span>+91 73389 95341</span>
            </a>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className={styles.footerBottomBar}>
          <div className={styles.footerBottomInner}>
            <p>© {new Date().getFullYear()} Scrap Anna. All Rights Reserved.</p>
            <div className={styles.footerBottomLinks}>
              <a href="#privacy" className={styles.footerSublink}>Privacy Policy</a>
              <span>•</span>
              <a href="#terms" className={styles.footerSublink}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
