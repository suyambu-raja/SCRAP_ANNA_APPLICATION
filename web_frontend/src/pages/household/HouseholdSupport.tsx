import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  MessageCircle,
  Mail,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  FileText,
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
    question: 'Is there any minimum scrap weight required for doorstep pickup?',
    answer:
      'No strict minimum! However, to make doorstep collection sustainable, we recommend a total scrap bundle of at least 10 KG across mixed categories (e.g., newspapers, cardboard, metals, or appliances).',
  },
  {
    id: 'f-2',
    question: 'Can I choose cash instead of UPI payment?',
    answer:
      'Yes! During pickup, you can choose between spot UPI transfer to your phone/QR code or direct cash in hand paid by our verified doorstep partner.',
  },
  {
    id: 'f-3',
    question: 'Do your drivers bring bags or containers to carry the scrap?',
    answer:
      'Yes. Our executives carry heavy-duty recycling bags and calibrated digital scales to safely weigh and transport scrap from your doorstep or apartment.',
  },
  {
    id: 'f-4',
    question: 'Are digital weighing slips saved for tax or housing records?',
    answer:
      'Yes. Every completed pickup generates a permanent digital receipt with timestamp, category breakdown, net weight, rate per KG, and total payout accessible anytime under Order History.',
  },
];

export function HouseholdSupport() {
  // Ticket Form State
  const [orderId, setOrderId] = useState('SA123456');
  const [issueType, setIssueType] = useState('Weigh Scale / Pricing Query');
  const [description, setDescription] = useState('');
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);

  // FAQ Accordion State
  const [openFaqId, setOpenFaqId] = useState<string | null>('f-1');

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setIsSubmittingTicket(true);

    setTimeout(() => {
      const generatedId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedTicketId(generatedId);
      setIsSubmittingTicket(false);
      setDescription('');
    }, 600);
  };

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={styles.pageContainer}>
      {/* 1. HERO HEADER */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <Sparkles size={14} className={styles.heroBadgeIcon} />
            <span>Support &amp; Help Desk</span>
          </div>
          <h1 className={styles.heroTitle}>Household Help &amp; Support</h1>
        </div>
      </section>

      {/* 2. AUTOMATED BOT FEATURED CARD (ONE CARD LINKING TO DEDICATED BOT PAGE) */}
      <section className={styles.botPromoCard}>
        <div className={styles.botPromoLeft}>
          <div className={styles.botPromoIconBox}>
            <Bot size={26} />
          </div>
          <div className={styles.botPromoTextGroup}>
            <div className={styles.botPromoTitleRow}>
              <h2 className={styles.botPromoTitle}>BillScrap Automated Assistant</h2>
              <span className={styles.botPromoOnlineBadge}>
                <span className={styles.onlineDot} /> Online • 24/7 Available
              </span>
            </div>
            <p className={styles.botPromoDesc}>
              Instant answers for pickups, weighing, and payments.
            </p>
          </div>
        </div>

        <Link to="/household/support/bot" className={styles.launchBotBtn}>
          <Bot size={18} />
          <span>Chat with Assistant</span>
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* 3. CONTACT CHANNELS (WHATSAPP & EMAIL ONLY - NO CALL SUPPORT) */}
      <section className={styles.channelsSection}>
        <div className={styles.channelsGrid}>
          {/* WhatsApp Support */}
          <div className={styles.channelCard}>
            <div className={styles.channelTop}>
              <div className={styles.whatsappIconBox}>
                <MessageCircle size={24} />
              </div>
              <div>
                <h3 className={styles.channelTitle}>WhatsApp Support</h3>
                <p className={styles.channelSub}>Fast assistance, live ETA &amp; weight slip confirmation</p>
              </div>
            </div>
            <div className={styles.channelFooter}>
              <span className={styles.responseTimePill}>⚡ Replies in 10–15 mins</span>
              <a
                href="https://wa.me/919840123456?text=Hi%20Bill%20Scrap%2C%20I%20need%20assistance%20with%20my%20household%20scrap%20pickup."
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappActionBtn}
              >
                <MessageCircle size={16} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Email Support Desk */}
          <div className={styles.channelCard}>
            <div className={styles.channelTop}>
              <div className={styles.emailIconBox}>
                <Mail size={24} />
              </div>
              <div>
                <h3 className={styles.channelTitle}>Email Support Desk</h3>
                <p className={styles.channelSub}>Official queries, payment receipts &amp; bill disputes</p>
              </div>
            </div>
            <div className={styles.channelFooter}>
              <span className={styles.responseTimePill}>🕒 Replies in 2–4 hours</span>
              <a
                href="mailto:support@billscrap.com?subject=Household%20Scrap%20Support%20Request"
                className={styles.emailActionBtn}
              >
                <Mail size={16} />
                <span>support@billscrap.com</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TWO-COLUMN: TICKET FORM & FAQ ACCORDION */}
      <section className={styles.twoColSection}>
        {/* Left: Raise a Support Request */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderIcon}>
              <FileText size={18} />
            </div>
            <div>
              <h3 className={styles.cardTitle}>Raise a Support Request</h3>
              <p className={styles.cardSubtitle}>Submit an inquiry and get an asynchronous ticket ID</p>
            </div>
          </div>

          {submittedTicketId ? (
            <div className={styles.ticketSuccessBox}>
              <div className={styles.ticketSuccessIcon}>
                <CheckCircle2 size={32} />
              </div>
              <h4 className={styles.ticketSuccessTitle}>Ticket Submitted Successfully!</h4>
              <p className={styles.ticketSuccessText}>
                Your request has been logged under Ticket ID:
              </p>
              <span className={styles.ticketIdPill}>{submittedTicketId}</span>
              <p className={styles.ticketSuccessSub}>
                Our Chennai operations desk will review this issue and update you via WhatsApp &amp; SMS within 15 minutes.
              </p>
              <button
                type="button"
                className={styles.anotherTicketBtn}
                onClick={() => setSubmittedTicketId(null)}
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className={styles.ticketForm}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Related Order</label>
                <select
                  className={styles.selectField}
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                >
                  <option value="SA123456">Order #SA123456 (Anna Nagar • ₹1,850)</option>
                  <option value="SA123455">Order #SA123455 (Shenoy Nagar • ₹780)</option>
                  <option value="SA123454">Order #SA123454 (Kilpauk • ₹1,250)</option>
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
                  <option>Weigh Scale / Pricing Accuracy</option>
                  <option>Executive Delayed / Reschedule</option>
                  <option>UPI / Spot Cash Payment Status</option>
                  <option>Scrap Rate Discrepancy</option>
                  <option>Other Feedback / Suggestion</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Describe the issue</label>
                <textarea
                  className={styles.textareaField}
                  placeholder="Provide a brief explanation of what happened..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className={styles.submitTicketBtn}
                disabled={isSubmittingTicket}
              >
                <Send size={15} />
                <span>{isSubmittingTicket ? 'Submitting...' : 'Submit Support Request'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right: Frequently Asked Questions */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderIcon}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className={styles.cardTitle}>Frequently Asked Questions</h3>
              <p className={styles.cardSubtitle}>Quick answers for doorstep scrap pickups</p>
            </div>
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
      </section>
    </div>
  );
}

export default HouseholdSupport;
