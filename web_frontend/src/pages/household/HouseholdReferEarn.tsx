import { useState } from 'react';
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
  const referralLink = `https://scrapanna.com/signup?ref=${referralCode}`;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappShareText = encodeURIComponent(
    `Hey! I use Scrap Anna to sell scrap at home with digital scale weighing and instant spot UPI payment. Use my referral code *${referralCode}* to get ₹50 extra bonus on your first scrap pickup! ♻️💰 ${referralLink}`
  );

  return (
    <div className={styles.pageContainer}>
      {/* 1. HERO REFERRAL BANNER */}
      <section className={styles.heroBanner}>
        <div className={styles.heroLeft}>
          <div className={styles.heroBadge}>
            <Gift size={14} />
            <span>Refer Friends & Earn Cash</span>
          </div>

          <h1 className={styles.heroTitle}>Give ₹50, Get ₹50 Instant Cash</h1>
          <p className={styles.heroSubtitle}>
            Invite your friends and neighbors to recycle scrap with Scrap Anna. When they complete their first doorstep pickup, you both receive ₹50 credited directly to your UPI account!
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

        {/* Right Stats Strip */}
        <div className={styles.heroRightCard}>
          <div className={styles.heroStatItem}>
            <span className={styles.heroStatLabel}>Total Bonus Earned</span>
            <span className={styles.heroStatNumberGold}>₹150.00</span>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />

          <div className={styles.heroStatItem}>
            <span className={styles.heroStatLabel}>Successful Pickups</span>
            <span className={styles.heroStatNumberGreen}>3 Friends</span>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />

          <div className={styles.heroStatItem}>
            <span className={styles.heroStatLabel}>Pending Pickups</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#cbd5e1' }}>1 Friend</span>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS 3-STEP GRID */}
      <section className={styles.howItWorksCard}>
        <h3 className={styles.sectionTitle}>How Scrap Anna Referral Works</h3>

        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumberCircle}>1</div>
            <h4 className={styles.stepTitle}>Share Your Link</h4>
            <p className={styles.stepDesc}>
              Send your referral code or WhatsApp link to friends, family, and apartment neighbors in Chennai.
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepNumberCircle}>2</div>
            <h4 className={styles.stepTitle}>Friend Books Pickup</h4>
            <p className={styles.stepDesc}>
              Your friend schedules a doorstep scrap pickup for their old metals, papers, plastics, or appliances.
            </p>
          </div>

          <div className={styles.stepCard}>
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

        <div style={{ width: '100%', overflowX: 'auto' }}>
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
                    {ref.status === 'completed' ? `+₹${ref.bonusEarned}.00` : 'Pending'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default HouseholdReferEarn;
