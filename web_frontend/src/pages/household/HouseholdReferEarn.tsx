import { useState, useRef } from 'react';
import {
  Gift,
  Copy,
  Check,
  Share2,
  Users,
  IndianRupee,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  MessageCircle,
  MapPin,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import styles from './HouseholdReferEarn.module.css';

interface ReferralHistoryItem {
  id: string;
  name: string;
  area: string;
  date: string;
  status: 'completed' | 'pending';
  bonusEarned: number;
}

const SAMPLE_REFERRALS: ReferralHistoryItem[] = [
  {
    id: 'ref-1',
    name: 'Priya Sundaram',
    area: 'Anna Nagar East, Chennai',
    date: '14 May 2025',
    status: 'completed',
    bonusEarned: 50,
  },
  {
    id: 'ref-2',
    name: 'Vignesh Raghavan',
    area: 'Shenoy Nagar, Chennai',
    date: '08 May 2025',
    status: 'completed',
    bonusEarned: 50,
  },
  {
    id: 'ref-3',
    name: 'Anand Kumar',
    area: 'Kilpauk, Chennai',
    date: '28 Apr 2025',
    status: 'completed',
    bonusEarned: 50,
  },
  {
    id: 'ref-4',
    name: 'Karthik Muthu',
    area: 'Adyar, Chennai',
    date: '12 May 2025',
    status: 'pending',
    bonusEarned: 50,
  },
];

export function HouseholdReferEarn() {
  const user = useAuthStore((s) => s.user);
  const referralCode = user?.name ? `${user.name.split(' ')[0].toUpperCase()}50` : 'ARUN50';
  const referralLink = `https://billscrap.com/signup?ref=${referralCode}`;

  const [copied, setCopied] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const swipeTrackRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwipeScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const cardWidth = target.offsetWidth * 0.75;
    if (cardWidth > 0) {
      const index = Math.round(target.scrollLeft / cardWidth);
      setActiveCardIndex(Math.min(Math.max(index, 0), 2));
    }
  };

  const scrollToCard = (index: number) => {
    if (!swipeTrackRef.current) return;
    const track = swipeTrackRef.current;
    const cards = track.children;
    if (cards[index]) {
      (cards[index] as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
      setActiveCardIndex(index);
    }
  };

  const whatsappShareText = encodeURIComponent(
    `Hey! I use Bill Scrap to sell scrap at home with digital scale weighing and instant spot UPI payment. Use my referral code *${referralCode}* to get ₹50 extra bonus on your first scrap pickup! ♻️💰 ${referralLink}`
  );

  return (
    <div className={styles.pageContainer}>
      {/* 1. HERO REFERRAL BANNER (GRAPHITE COLOR SAME AS FOOTER) */}
      <section className={styles.heroBanner}>
        <div className={styles.heroLeft}>
          <div className={styles.heroBadge}>
            <Gift size={14} />
            <span>Refer Friends & Earn Cash</span>
          </div>

          <h1 className={styles.heroTitle}>Give ₹50, Get ₹50 Instant Cash</h1>
          <p className={styles.heroSubtitle}>
            Invite your friends and neighbors to recycle scrap with Bill Scrap. When they complete their first doorstep pickup, you both receive ₹50 credited directly to your UPI account!
          </p>

          {/* Referral Code & Share Row */}
          <div className={styles.referralCodeBox}>
            <div className={styles.codeLabelCol}>
              <span className={styles.codeLabel}>Your Unique Referral Code</span>
              <span className={styles.codeValue}>{referralCode}</span>
            </div>

            <button type="button" className={styles.copyCodeBtn} onClick={handleCopy}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Link Copied! ✨' : 'Copy Invite Link'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.85rem', marginTop: '0.5rem' }}>
            <a
              href={`https://wa.me/?text=${whatsappShareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.shareWhatsappBtn}
            >
              <MessageCircle size={18} />
              <span>Share on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. REFERRAL STATS SWIPE CARDS VIEW (SEPARATE BELOW CONTAINER) */}
      <section className={styles.statsSwipeSection}>
        <div className={styles.swipeHeaderRow}>
          <div>
            <h2 className={styles.swipeSectionTitle}>Your Referral Performance</h2>
            <p className={styles.swipeSectionSubtitle}>Real-time metrics for invited friends and bonuses</p>
          </div>

          <div className={styles.swipeDotsIndicator}>
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                type="button"
                className={`${styles.swipeDot} ${activeCardIndex === idx ? styles.swipeDotActive : ''}`}
                onClick={() => scrollToCard(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div
          ref={swipeTrackRef}
          className={styles.swipeCardsTrack}
          onScroll={handleSwipeScroll}
        >
          {/* Card 1: Total Bonus Earned */}
          <div className={`${styles.swipeStatCard} ${styles.cardGoldAccent}`}>
            <div className={styles.cardHeaderRow}>
              <span className={styles.cardLabel}>TOTAL BONUS EARNED</span>
              <div className={styles.cardIconBadgeGold}>
                <IndianRupee size={18} />
              </div>
            </div>
            <div className={styles.cardMainValueGold}>₹150</div>
            <div className={styles.cardFooterNote}>
              <Sparkles size={14} className={styles.sparkleIcon} />
              <span>Directly credited to your UPI</span>
            </div>
          </div>

          {/* Card 2: Successful Pickups */}
          <div className={`${styles.swipeStatCard} ${styles.cardGreenAccent}`}>
            <div className={styles.cardHeaderRow}>
              <span className={styles.cardLabel}>SUCCESSFUL PICKUPS</span>
              <div className={styles.cardIconBadgeGreen}>
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className={styles.cardMainValueGreen}>3 Friends</div>
            <div className={styles.cardFooterNote}>
              <Users size={14} />
              <span>Completed doorstep scrap pickup</span>
            </div>
          </div>

          {/* Card 3: Pending Pickups */}
          <div className={`${styles.swipeStatCard} ${styles.cardSlateAccent}`}>
            <div className={styles.cardHeaderRow}>
              <span className={styles.cardLabel}>PENDING PICKUPS</span>
              <div className={styles.cardIconBadgeSlate}>
                <Clock size={18} />
              </div>
            </div>
            <div className={styles.cardMainValueWhite}>1 Friend</div>
            <div className={styles.cardFooterNote}>
              <Clock size={14} />
              <span>Scheduled doorstep booking pending</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS 3-STEP GRID */}
      <section className={styles.howItWorksCard}>
        <h3 className={styles.sectionTitle}>How Bill Scrap Referral Works</h3>

        <div className={styles.stepsGrid}>
          <div
            className={`${styles.stepCard} ${activeStepIndex === 0 ? styles.stepCardBright : ''}`}
            onClick={() => setActiveStepIndex((prev) => (prev === 0 ? null : 0))}
            role="button"
            tabIndex={0}
            aria-pressed={activeStepIndex === 0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveStepIndex((prev) => (prev === 0 ? null : 0))}
          >
            <div className={styles.stepNumberCircle}>1</div>
            <h4 className={styles.stepTitle}>Share Your Link</h4>
            <p className={styles.stepDesc}>
              Send your referral code or WhatsApp link to friends, family, and apartment neighbors in Chennai.
            </p>
          </div>

          <div
            className={`${styles.stepCard} ${activeStepIndex === 1 ? styles.stepCardBright : ''}`}
            onClick={() => setActiveStepIndex((prev) => (prev === 1 ? null : 1))}
            role="button"
            tabIndex={0}
            aria-pressed={activeStepIndex === 1}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveStepIndex((prev) => (prev === 1 ? null : 1))}
          >
            <div className={styles.stepNumberCircle}>2</div>
            <h4 className={styles.stepTitle}>Friend Books Pickup</h4>
            <p className={styles.stepDesc}>
              Your friend schedules a doorstep scrap pickup for their old metals, papers, plastics, or appliances.
            </p>
          </div>

          <div
            className={`${styles.stepCard} ${activeStepIndex === 2 ? styles.stepCardBright : ''}`}
            onClick={() => setActiveStepIndex((prev) => (prev === 2 ? null : 2))}
            role="button"
            tabIndex={0}
            aria-pressed={activeStepIndex === 2}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveStepIndex((prev) => (prev === 2 ? null : 2))}
          >
            <div className={styles.stepNumberCircle}>3</div>
            <h4 className={styles.stepTitle}>Both Get ₹50 Cash</h4>
            <p className={styles.stepDesc}>
              Once their pickup is weighed and completed, ₹50 bonus is transferred to both your UPI accounts!
            </p>
          </div>
        </div>
      </section>

      {/* 3. INVITED FRIENDS TRACKING TABLE */}
      <section className={styles.friendsCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className={styles.sectionTitle}>Your Referral Activity</h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
              Track your invited friends and bonus payout statuses.
            </p>
          </div>
        </div>

        {/* Desktop View: Full Table (Unchanged on Desktop) */}
        <div className={styles.desktopFriendsTableWrap}>
          <table className={styles.friendsTable}>
            <thead>
              <tr>
                <th>Friend</th>
                <th>Location</th>
                <th>Date Joined</th>
                <th>Pickup Status</th>
                <th style={{ textAlign: 'right' }}>Your Bonus</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_REFERRALS.map((ref) => (
                <tr key={ref.id}>
                  <td>
                    <strong style={{ color: '#0f172a' }}>{ref.name}</strong>
                  </td>
                  <td style={{ color: '#64748b' }}>{ref.area}</td>
                  <td style={{ color: '#64748b' }}>{ref.date}</td>
                  <td>
                    {ref.status === 'completed' ? (
                      <span className={styles.statusCompletedPill}>
                        <CheckCircle2 size={13} />
                        <span>Pickup Completed</span>
                      </span>
                    ) : (
                      <span className={styles.statusPendingPill}>
                        <Clock size={13} />
                        <span>Booking Pending</span>
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 900, color: ref.status === 'completed' ? '#059669' : '#94a3b8' }}>
                    {ref.status === 'completed' ? `+₹${ref.bonusEarned}` : 'Pending'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Dedicated single card for each referral */}
        <div className={styles.mobileFriendsCardsList}>
          {SAMPLE_REFERRALS.map((ref) => (
            <div key={ref.id} className={styles.mobileFriendCard}>
              <div className={styles.mobileFriendTopRow}>
                <div className={styles.mobileFriendIdentity}>
                  <div className={styles.mobileFriendAvatar}>
                    {ref.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <h4 className={styles.mobileFriendName}>{ref.name}</h4>
                    <span className={styles.mobileFriendDate}>Joined {ref.date}</span>
                  </div>
                </div>

                <div className={styles.mobileBonusCol}>
                  <span className={styles.mobileBonusLabel}>Bonus</span>
                  <span
                    className={
                      ref.status === 'completed'
                        ? styles.mobileBonusValueEarned
                        : styles.mobileBonusValuePending
                    }
                  >
                    {ref.status === 'completed' ? `+₹${ref.bonusEarned}` : '₹50 Pending'}
                  </span>
                </div>
              </div>

              <div className={styles.mobileFriendBottomRow}>
                <div className={styles.mobileFriendLocation}>
                  <MapPin size={13} className={styles.mobileLocIcon} />
                  <span>{ref.area}</span>
                </div>

                <div>
                  {ref.status === 'completed' ? (
                    <span className={styles.statusCompletedPill}>
                      <CheckCircle2 size={12} />
                      <span>Pickup Completed</span>
                    </span>
                  ) : (
                    <span className={styles.statusPendingPill}>
                      <Clock size={12} />
                      <span>Booking Pending</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HouseholdReferEarn;
