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
} from 'lucide-react';
import { Button, Navbar } from '@/components/common';
import { PriceCard } from '@/components/cards/PriceCard';
import { SkeletonCard } from '@/components/common/SkeletonLoader';
import { getMarketPrices, getScrapCategories, getAggregatorData } from '@/services';
import { useAuthStore } from '@/store/useAuthStore';
import type { MarketPrice, ScrapCategory, AggregatorData } from '@/types';
import styles from './Home.module.css';

export default function Home() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [, setCategories] = useState<ScrapCategory[]>([]);
  const [aggData, setAggData] = useState<AggregatorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCatId, setSelectedCatId] = useState('all');
  const [showVideoModal, setShowVideoModal] = useState(false);

  const isTamil = i18n.language === 'ta';

  useEffect(() => {
    Promise.all([
      getMarketPrices(),
      getScrapCategories(),
      getAggregatorData(),
    ]).then(([priceData, catData, statsData]) => {
      setPrices(priceData);
      setCategories(catData);
      setAggData(statsData);
      setLoading(false);
    });
  }, []);

  const displayedPrices =
    selectedCatId === 'all'
      ? prices.slice(0, 6)
      : prices.filter((p) => p.categoryId === selectedCatId);

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
                <MapPin size={13} />
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

          <div className={styles.fourColumnGrid}>
            {/* Household */}
            <div className={styles.roleBox}>
              <div className={styles.roleHeader}>
                <div className={styles.roleIconWrap}>
                  <HomeIcon size={20} />
                </div>
                <span className={styles.rolePill}>Household</span>
              </div>
              <h3 className={styles.roleHeading}>Households & Apartments</h3>
              <div className={styles.roleDetailGroup}>
                <div className={styles.roleDetailItem}>
                  <strong>WHO:</strong> Residents, apartments & gated communities.
                </div>
                <div className={styles.roleDetailItem}>
                  <strong>WHAT:</strong> Doorstep pickups, digital scales, instant UPI payouts.
                </div>
                <div className={styles.roleDetailItem}>
                  <strong>WHY:</strong> Guaranteed accurate rates with zero manual deductions.
                </div>
              </div>
            </div>

            {/* Merchant */}
            <div className={styles.roleBox}>
              <div className={styles.roleHeader}>
                <div className={styles.roleIconWrap}>
                  <Store size={20} />
                </div>
                <span className={styles.rolePill}>Merchant</span>
              </div>
              <h3 className={styles.roleHeading}>Scrap Merchants & Shops</h3>
              <div className={styles.roleDetailGroup}>
                <div className={styles.roleDetailItem}>
                  <strong>WHO:</strong> Local scrap dealers & recycling yards.
                </div>
                <div className={styles.roleDetailItem}>
                  <strong>WHAT:</strong> Access industrial leads, submit sealed bids, sell refurbished stock.
                </div>
                <div className={styles.roleDetailItem}>
                  <strong>WHY:</strong> Expand daily supply volume across Chennai easily.
                </div>
              </div>
            </div>

            {/* Industry */}
            <div className={styles.roleBox}>
              <div className={styles.roleHeader}>
                <div className={styles.roleIconWrap}>
                  <Building2 size={20} />
                </div>
                <span className={styles.rolePill}>Industry</span>
              </div>
              <h3 className={styles.roleHeading}>Industries & Factories</h3>
              <div className={styles.roleDetailGroup}>
                <div className={styles.roleDetailItem}>
                  <strong>WHO:</strong> Manufacturing plants, fabrication units & workshops.
                </div>
                <div className={styles.roleDetailItem}>
                  <strong>WHAT:</strong> Post bulk requisitions, compare sealed merchant quotes.
                </div>
                <div className={styles.roleDetailItem}>
                  <strong>WHY:</strong> Maximize scrap revenue with weighbridge accountability.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Platform Statistics Bar */}
        <section className={styles.impactStatsBar}>
          <div className={styles.statsGridDesktop}>
            <div className={styles.statCell}>
              <div className={styles.statFigure}>
                {aggData ? `${(aggData.network_statistics.activeHouseholds / 1000).toFixed(0)}k+` : '10,000+'}
              </div>
              <div className={styles.statDescription}>Active Households in Chennai</div>
            </div>

            <div className={styles.statCell}>
              <div className={styles.statFigure}>
                {aggData ? `${(aggData.network_statistics.activeMerchants / 1000).toFixed(1)}k+` : '2,000+'}
              </div>
              <div className={styles.statDescription}>Verified Scrap Merchants</div>
            </div>

            <div className={styles.statCell}>
              <div className={styles.statFigure}>
                {aggData ? `${aggData.network_statistics.connectedIndustries}+` : '500+'}
              </div>
              <div className={styles.statDescription}>Industrial & Factory Partners</div>
            </div>

            <div className={styles.statCell}>
              <div className={styles.statFigure}>
                {aggData ? `${(aggData.network_statistics.recycledTons / 1000).toFixed(0)}k+` : '25,000+'} Tons
              </div>
              <div className={styles.statDescription}>Materials Diverted from Landfills</div>
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

          {/* Category Filter Pills Row */}
          <div className={styles.marketPillsRow}>
            <button
              type="button"
              className={[
                styles.compactPill,
                selectedCatId === 'all' ? styles.compactPillActive : '',
              ].join(' ')}
              onClick={() => setSelectedCatId('all')}
            >
              All
            </button>
            <button
              type="button"
              className={[
                styles.compactPill,
                selectedCatId === 'CAT_IRON' ? styles.compactPillActive : '',
              ].join(' ')}
              onClick={() => setSelectedCatId('CAT_IRON')}
            >
              Iron
            </button>
            <button
              type="button"
              className={[
                styles.compactPill,
                selectedCatId === 'CAT_PLASTIC' ? styles.compactPillActive : '',
              ].join(' ')}
              onClick={() => setSelectedCatId('CAT_PLASTIC')}
            >
              Plastic
            </button>
            <button
              type="button"
              className={[
                styles.compactPill,
                selectedCatId === 'CAT_MATERIAL' ? styles.compactPillActive : '',
              ].join(' ')}
              onClick={() => setSelectedCatId('CAT_MATERIAL')}
            >
              Material
            </button>
            <button
              type="button"
              className={[
                styles.compactPill,
                selectedCatId === 'CAT_PAPER_CARDBOARD' ? styles.compactPillActive : '',
              ].join(' ')}
              onClick={() => setSelectedCatId('CAT_PAPER_CARDBOARD')}
            >
              Cardboard & Paper
            </button>
            <button
              type="button"
              className={[
                styles.compactPill,
                selectedCatId === 'CAT_BATTERY' ? styles.compactPillActive : '',
              ].join(' ')}
              onClick={() => setSelectedCatId('CAT_BATTERY')}
            >
              Battery
            </button>
            <button
              type="button"
              className={[
                styles.compactPill,
                selectedCatId === 'CAT_HOME_APPLIANCES' ? styles.compactPillActive : '',
              ].join(' ')}
              onClick={() => setSelectedCatId('CAT_HOME_APPLIANCES')}
            >
              Home Appliances
            </button>
            <button
              type="button"
              className={[
                styles.compactPill,
                selectedCatId === 'CAT_EWASTE' ? styles.compactPillActive : '',
              ].join(' ')}
              onClick={() => setSelectedCatId('CAT_EWASTE')}
            >
              E-wastes
            </button>
            <button
              type="button"
              className={[
                styles.compactPill,
                selectedCatId === 'CAT_WIRES' ? styles.compactPillActive : '',
              ].join(' ')}
              onClick={() => setSelectedCatId('CAT_WIRES')}
            >
              Wires
            </button>
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
            <div className={styles.trustAssuranceCard}>
              <Scale size={26} className={styles.trustFeatureIcon} />
              <h3 className={styles.trustFeatureTitle}>Certified Digital Scales</h3>
              <p className={styles.trustFeatureText}>
                No manipulated manual scales. All doorstep pickups use calibrated electronic balances with weight verification.
              </p>
            </div>

            <div className={styles.trustAssuranceCard}>
              <ShieldCheck size={26} className={styles.trustFeatureIcon} />
              <h3 className={styles.trustFeatureTitle}>Verified Partner Network</h3>
              <p className={styles.trustFeatureText}>
                Every merchant, aggregator, and industrial facility is verified with business credentials for safe, lawful transactions.
              </p>
            </div>

            <div className={styles.trustAssuranceCard}>
              <Lock size={26} className={styles.trustFeatureIcon} />
              <h3 className={styles.trustFeatureTitle}>Sealed Private Quoting</h3>
              <p className={styles.trustFeatureText}>
                Industrial requisitions receive sealed private quotes, preserving price confidentiality without public bidding wars.
              </p>
            </div>

            <div className={styles.trustAssuranceCard}>
              <DollarSign size={26} className={styles.trustFeatureIcon} />
              <h3 className={styles.trustFeatureTitle}>Direct Instant Payouts</h3>
              <p className={styles.trustFeatureText}>
                Immediate payment transfer directly to your UPI ID or bank account before the material leaves your premises.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Tamil & English Accessibility */}
        <section id="accessibility" className={styles.bilingualAccessibilityBanner}>
          <div className={styles.accessIconContainer}>
            <Globe size={32} />
          </div>
          <div className={styles.accessTextContainer}>
            <h3 className={styles.accessTitle}>
              {isTamil ? 'தமிழ் மற்றும் ஆங்கிலத்தில் முழு ஆதரவு' : 'Full Support in English & தமிழ்'}
            </h3>
            <p className={styles.accessDescription}>
              {isTamil
                ? 'அனைவருக்கும் எளிதில் புரியும் வகையிலான இடைமுகம், இருமொழி உதவி மற்றும் வாய்ஸ் அசிஸ்டண்ட் ஆதரவு.'
                : 'Scrap Anna is built from the ground up for Tamil Nadu, with complete bilingual language support and voice-assisted guidance for merchants.'}
            </p>
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

          {/* Column 2: Platform Solutions */}
          <div className={styles.footerNavCol}>
            <h4 className={styles.footerNavTitle}>Platform Solutions</h4>
            <a href="#who-we-serve" className={styles.footerNavLink}>For Households</a>
            <a href="#who-we-serve" className={styles.footerNavLink}>For Merchants</a>
            <a href="#who-we-serve" className={styles.footerNavLink}>For Industries</a>
            <a href="#market-prices" className={styles.footerNavLink}>Market Reference Rates</a>
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
