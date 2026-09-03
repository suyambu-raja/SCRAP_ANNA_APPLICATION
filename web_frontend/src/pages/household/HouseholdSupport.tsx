import { useState } from 'react';
import {
  Headphones,
  Phone,
  MessageCircle,
  Mail,
  HelpCircle,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import styles from './HouseholdSupport.module.css';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: 'f-1',
    question: 'How does digital weigh scale verification work?',
    answer:
      'Our verified doorstep executives carry government-calibrated digital weighing scales. The scale reading is displayed directly to you and synced in real-time to your digital weigh slip.',
  },
  {
    id: 'f-2',
    question: 'When will I receive my scrap payout?',
    answer:
      'Immediately upon digital weighing! As soon as you confirm the bill and share your 4-digit confirmation OTP, the payment is transferred in real-time via Spot UPI or paid in cash on hand.',
  },
  {
    id: 'f-3',
    question: 'What scrap materials are accepted for doorstep pickup?',
    answer:
      'We accept all household scrap categories: Copper Wires & Motors, Brass & Bronze, Iron & Steel, Aluminium Utensils & Sections, Old Newspapers & Cardboard boxes, Plastic containers, and E-Waste (CPUs, Motherboards, Appliances).',
  },
  {
    id: 'f-4',
    question: 'Can I reschedule or cancel a booked pickup?',
    answer:
      'Yes, you can reschedule your date and preferred time slot free of charge anytime from the Orders page before the executive reaches your address.',
  },
];

export function HouseholdSupport() {
  const [openFaqId, setOpenFaqId] = useState<string | null>('f-1');
  const [orderId, setOrderId] = useState('SA123456');
  const [issueType, setIssueType] = useState('Weigh Scale / Pricing Query');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setDescription('');
      setSubmitted(false);
    }, 4000);
  };

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={styles.pageContainer}>
      {/* 1. HERO SUPPORT BANNER */}
      <section className={styles.heroBanner}>
        <div className={styles.heroBadge}>
          <Headphones size={14} />
          <span>24/7 Household Support & Helpline</span>
        </div>

        <h1 className={styles.heroTitle}>How can we help you today?</h1>
        <p className={styles.heroSubtitle}>
          Have a question about your doorstep scrap pickup, weighing scale accuracy, or spot payment? Our Chennai support team is here to assist you.
        </p>
      </section>

      {/* 2. THREE CONTACT CHANNELS */}
      <div className={styles.channelsGrid}>
        {/* Channel 1: Phone Support */}
        <div className={styles.channelCard}>
          <div className={styles.channelIconBox} style={{ background: '#ecfdf5', color: '#059669' }}>
            <Phone size={22} />
          </div>
          <div>
            <h3 className={styles.channelTitle}>Helpline Support</h3>
            <p className={styles.channelSub}>Speak directly to our Chennai customer desk</p>
          </div>
          <a href="tel:+919840123456" className={styles.channelActionBtn}>
            <Phone size={15} />
            <span>+91 98401 23456</span>
          </a>
        </div>

        {/* Channel 2: WhatsApp Chat */}
        <div className={styles.channelCard}>
          <div className={styles.channelIconBox} style={{ background: '#f0fdf4', color: '#16a34a' }}>
            <MessageCircle size={22} />
          </div>
          <div>
            <h3 className={styles.channelTitle}>WhatsApp Support</h3>
            <p className={styles.channelSub}>Instant chat assistance & live photo verification</p>
          </div>
          <a
            href="https://wa.me/919840123456?text=Hi%20Bill%20Scrap%2C%20I%20need%20assistance%20with%20my%20scrap%20pickup."
            target="_blank"
            rel="noopener noreferrer"
            className={styles.channelActionBtn}
            style={{ background: '#16a34a', color: '#ffffff' }}
          >
            <MessageCircle size={15} />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Channel 3: Email Desk */}
        <div className={styles.channelCard}>
          <div className={styles.channelIconBox} style={{ background: '#eff6ff', color: '#2563eb' }}>
            <Mail size={22} />
          </div>
          <div>
            <h3 className={styles.channelTitle}>Email Desk</h3>
            <p className={styles.channelSub}>Official queries, bill disputes, & complaints</p>
          </div>
          <a
            href="mailto:support@billscrap.com?subject=Household%20Scrap%20Pickup%20Query"
            className={styles.channelActionBtn}
          >
            <Mail size={15} />
            <span>support@billscrap.com</span>
          </a>
        </div>
      </div>

      {/* 3. TWO-COLUMN: TICKET FORM & FAQ ACCORDION */}
      <div className={styles.supportTwoColGrid}>
        {/* Left: Raise a Support Ticket */}
        <div className={styles.sectionCard}>
          <div>
            <h3 className={styles.cardTitle}>Raise a Support Request</h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
              Submit an issue and our team will get in touch with you within 15 minutes.
            </p>
          </div>

          <form onSubmit={handleSubmitTicket} className={styles.ticketForm}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Select Related Order</label>
              <select
                className={styles.selectField}
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              >
                <option value="SA123456">Order #SA123456 (01 May 2025 • ₹1,850)</option>
                <option value="SA123455">Order #SA123455 (28 Apr 2025 • ₹780)</option>
                <option value="SA123454">Order #SA123454 (25 Apr 2025 • ₹1,250)</option>
                <option value="GENERAL">General Query / Not Order Specific</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Issue Category</label>
              <select
                className={styles.selectField}
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
              >
                <option>Weigh Scale / Pricing Query</option>
                <option>Executive Delay / Reschedule</option>
                <option>UPI / Cash Payment Issue</option>
                <option>Scrap Rate Discrepancy</option>
                <option>Other Feedback</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Describe your issue</label>
              <textarea
                className={styles.textareaField}
                placeholder="Please provide details about what happened..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.submitTicketBtn}>
              <Send size={15} />
              <span>{submitted ? 'Ticket Submitted (#TKT-8492) ✨' : 'Submit Support Request'}</span>
            </button>
          </form>
        </div>

        {/* Right: FAQ Accordion */}
        <div className={styles.sectionCard}>
          <div>
            <h3 className={styles.cardTitle}>Frequently Asked Questions</h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
              Quick answers to common doorstep pickup questions.
            </p>
          </div>

          <div className={styles.faqList}>
            {FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div key={faq.id} className={styles.faqItem}>
                  <button
                    type="button"
                    className={styles.faqHeader}
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {isOpen && <div className={styles.faqBody}>{faq.answer}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HouseholdSupport;
