import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  IndianRupee,
  Truck,
  MapPin,
  AlertTriangle,
  CreditCard,
  Package,
  Lightbulb,
  Clock,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  ArrowLeft,
  MessageCircle,
  Mail,
  X,
} from 'lucide-react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import styles from './HouseholdSupportBot.module.css';

/**
 * High-fidelity SVG Avatar for the Support Assistant matching the reference mockup
 */
function SupportBotAvatar({ size = 44 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
      aria-label="Support Assistant Avatar"
    >
      {/* Outer Circle Backdrop */}
      <circle cx="32" cy="32" r="32" fill="#0F172A" />
      {/* White Robot Head Contour */}
      <circle cx="32" cy="32" r="23" fill="#FFFFFF" />
      {/* Yellow Ear Cups / Antennas */}
      <rect x="7" y="27" width="4.5" height="10" rx="2.25" fill="#F8BF1D" />
      <rect x="52.5" y="27" width="4.5" height="10" rx="2.25" fill="#F8BF1D" />
      {/* Dark Visor */}
      <rect x="17" y="22" width="30" height="16" rx="8" fill="#0F172A" />
      {/* Friendly Glowing Oval Eyes */}
      <ellipse cx="26" cy="30" rx="3.2" ry="4.2" fill="#FFFFFF" />
      <ellipse cx="38" cy="30" rx="3.2" ry="4.2" fill="#FFFFFF" />
      {/* Blue Eye Highlights */}
      <circle cx="27" cy="29" r="1.3" fill="#38BDF8" />
      <circle cx="39" cy="29" r="1.3" fill="#38BDF8" />
      {/* Smile */}
      <path
        d="M27 43.5C28.8 45.5 35.2 45.5 37 43.5"
        stroke="#0F172A"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface QuestionItem {
  id: string;
  icon: React.ElementType;
  question: string;
  answer: string;
  actionLabel?: string;
  actionUrl?: string;
  isExternalAction?: boolean;
  relatedQuestions: string[];
}

const QUESTIONS_DATA: QuestionItem[] = [
  {
    id: 'sell-scrap',
    icon: FileText,
    question: 'How do I sell my scrap?',
    answer:
      'You can sell your scrap in 3 simple steps: 1) Post your scrap details with estimated weight. 2) Choose your preferred date, time slot, and pickup address. 3) A verified doorstep partner arrives with a certified digital scale, weighs your scrap in front of you, and transfers payout instantly.',
    actionLabel: 'Sell Scrap Now',
    actionUrl: '/household/post-scrap',
    relatedQuestions: [
      'How is my scrap price decided?',
      'How do I track my pickup?',
      'I have a question about reusable products.',
    ],
  },
  {
    id: 'scrap-price',
    icon: IndianRupee,
    question: 'How is my scrap price decided?',
    answer:
      'Prices are based on transparent daily market rates per KG. Your scrap is weighed on a certified digital scale right at your doorstep, and payout is calculated instantly based on the verified weight slip.',
    actionLabel: 'View Live Scrap Rates',
    actionUrl: '/household/rates',
    relatedQuestions: [
      'How do I sell my scrap?',
      'I have a payment-related problem.',
      'How do I track my pickup?',
    ],
  },
  {
    id: 'track-pickup',
    icon: Truck,
    question: 'How do I track my pickup?',
    answer:
      'You can track your pickup from the Orders section. Open Orders to view the current pickup status, scheduled date and real-time updates from the merchant.',
    actionLabel: 'Go to Orders',
    actionUrl: '/household/orders',
    relatedQuestions: [
      'My pickup is delayed. What should I do?',
      'How will I be notified about the pickup?',
      'I want to reschedule my pickup.',
    ],
  },
  {
    id: 'change-address',
    icon: MapPin,
    question: 'How do I change my pickup address?',
    answer:
      'You can manage or add new addresses in your Profile under Saved Addresses. For an active scheduled pickup, you can select or update your address before the executive begins traveling.',
    actionLabel: 'Manage Saved Addresses',
    actionUrl: '/household/profile',
    relatedQuestions: [
      'How do I track my pickup?',
      'I want to reschedule my pickup.',
      'I have a problem with my pickup.',
    ],
  },
  {
    id: 'problem-pickup',
    icon: AlertTriangle,
    question: 'I have a problem with my pickup.',
    answer:
      'If your executive is delayed, cannot locate your location, or there is an issue during weighing, our operations desk is ready to help. You can connect with our team on WhatsApp for immediate live dispatch support.',
    actionLabel: 'Chat on WhatsApp',
    actionUrl:
      'https://wa.me/919840123456?text=Hi%20Bill%20Scrap%2C%20I%20have%20an%20urgent%20problem%20with%20my%20pickup.',
    isExternalAction: true,
    relatedQuestions: [
      'My pickup is delayed. What should I do?',
      'I want to reschedule my pickup.',
      'How do I track my pickup?',
    ],
  },
  {
    id: 'payment-problem',
    icon: CreditCard,
    question: 'I have a payment-related problem.',
    answer:
      'Doorstep payments are credited instantly via spot UPI or direct cash upon weighing. If an UPI transfer did not reflect within 5 minutes, please message us on WhatsApp with your Order ID for immediate resolution.',
    actionLabel: 'Contact Billing Support',
    actionUrl:
      'https://wa.me/919840123456?text=Hi%20Bill%20Scrap%2C%20I%20have%20a%20payment%20discrepancy%20query.',
    isExternalAction: true,
    relatedQuestions: [
      'How is my scrap price decided?',
      'How do I sell my scrap?',
      'How do I track my pickup?',
    ],
  },
  {
    id: 'reusable-products',
    icon: Package,
    question: 'I have a question about reusable products.',
    answer:
      'The BillScrap Reusable Marketplace allows households and businesses to buy and sell pre-loved appliances, furniture, and materials in working condition. Explore verified listings or post your reusable items directly.',
    actionLabel: 'Browse Reusable Products',
    actionUrl: '/household/reusable-products',
    relatedQuestions: [
      'How do I sell my scrap?',
      'How is my scrap price decided?',
      'How do I track my pickup?',
    ],
  },
  // Additional questions for related question queries
  {
    id: 'delayed-pickup',
    icon: Clock,
    question: 'My pickup is delayed. What should I do?',
    answer:
      'Executives may occasionally face transit traffic or delays on previous pickups. You can check the live tracking status in My Orders or contact our dispatch team directly on WhatsApp for real-time ETA confirmation.',
    actionLabel: 'Go to Orders',
    actionUrl: '/household/orders',
    relatedQuestions: [
      'How do I track my pickup?',
      'I want to reschedule my pickup.',
      'I have a problem with my pickup.',
    ],
  },
  {
    id: 'notification-info',
    icon: Clock,
    question: 'How will I be notified about the pickup?',
    answer:
      'You will receive SMS and WhatsApp alerts at key stages: when a pickup partner is assigned, when the partner is on the way, and once weighing & digital payment are completed.',
    actionLabel: 'Check Notification Settings',
    actionUrl: '/household/notifications',
    relatedQuestions: [
      'How do I track my pickup?',
      'My pickup is delayed. What should I do?',
      'I want to reschedule my pickup.',
    ],
  },
  {
    id: 'reschedule-pickup',
    icon: Clock,
    question: 'I want to reschedule my pickup.',
    answer:
      'You can reschedule your pickup date and preferred slot with zero cancellation charges before the executive is en route. Open My Orders, select your booking, and tap "Reschedule".',
    actionLabel: 'Go to Orders',
    actionUrl: '/household/orders',
    relatedQuestions: [
      'How do I track my pickup?',
      'My pickup is delayed. What should I do?',
      'How do I change my pickup address?',
    ],
  },
];

export function HouseholdSupportBot() {
  const navigate = useNavigate();

  // Active question state: null shows Screen 1; set value shows Screen 2 (Chat View)
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  // Was this helpful feedback state per question
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'yes' | 'no' | null>>({});

  // Escalation drawer/modal state
  const [showEscalationModal, setShowEscalationModal] = useState(false);

  // Prevent background scroll bleed when escalation drawer is open
  useBodyScrollLock(showEscalationModal);

  // Get active question object
  const activeQuestion = useMemo(() => {
    return QUESTIONS_DATA.find((q) => q.id === activeQuestionId) || null;
  }, [activeQuestionId]);

  // Main 7 primary questions for Screen 1
  const primaryQuestions = useMemo(() => {
    return QUESTIONS_DATA.slice(0, 7);
  }, []);

  const handleSelectQuestion = (questionId: string) => {
    setActiveQuestionId(questionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectByText = (questionText: string) => {
    const found = QUESTIONS_DATA.find(
      (q) => q.question.toLowerCase().trim() === questionText.toLowerCase().trim()
    );
    if (found) {
      setActiveQuestionId(found.id);
    } else {
      // Fallback
      setActiveQuestionId('track-pickup');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (activeQuestionId) {
      setActiveQuestionId(null);
    } else {
      navigate('/household/support');
    }
  };

  const handleFeedback = (type: 'yes' | 'no') => {
    if (!activeQuestionId) return;
    setFeedbackGiven((prev) => ({
      ...prev,
      [activeQuestionId]: type,
    }));
  };

  // Static friendly formatted timestamp like 9:41 AM from mockup
  const messageTime = '9:41 AM';

  return (
    <div className={styles.pageContainer}>
      {/* ====================================================================
          TOP NAVIGATION BAR
          ==================================================================== */}
      <header className={styles.topBar}>
        <button
          type="button"
          onClick={handleBack}
          className={styles.backIconButton}
          aria-label={activeQuestionId ? 'Back to all questions' : 'Back to Support'}
        >
          <ChevronLeft size={22} />
        </button>

        <h1 className={styles.pageTitle}>Support Assistant</h1>

        {/* Empty placeholder for symmetrical flex layout */}
        <div className={styles.headerSpacer} />
      </header>

      {/* ====================================================================
          SCREEN 1: INITIAL STATE (QUESTION LIST & HERO CARD)
          ==================================================================== */}
      {!activeQuestion ? (
        <div className={styles.screenOneView}>
          {/* Dark Hero Card */}
          <div className={styles.heroDarkCard}>
            <div className={styles.heroTopRow}>
              <SupportBotAvatar size={54} />
              <div className={styles.statusPill}>
                <span className={styles.greenDot} />
                <span>24/7 Support Assistant</span>
              </div>
            </div>

            <h2 className={styles.heroHeading}>How can we help you today?</h2>
            <p className={styles.heroSubtext}>
              Get instant answers to common questions. If you still need help, our support team will
              assist you.
            </p>
          </div>

          {/* Section: Select a question */}
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionHeading}>Select a question</h3>
            <p className={styles.sectionSubtext}>Tap on a question to get an instant answer.</p>
          </div>

          {/* List of Question Cards */}
          <div className={styles.questionList}>
            {primaryQuestions.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectQuestion(item.id)}
                  className={styles.questionCard}
                >
                  <div className={styles.questionCardLeft}>
                    <div className={styles.questionIconBox}>
                      <IconComp size={20} />
                    </div>
                    <span className={styles.questionCardText}>{item.question}</span>
                  </div>
                  <ChevronRight size={18} className={styles.questionCardChevron} />
                </button>
              );
            })}
          </div>

          {/* Bottom Card: Can't find what you're looking for? */}
          <button
            type="button"
            onClick={() => setShowEscalationModal(true)}
            className={styles.fallbackCard}
          >
            <div className={styles.fallbackCardLeft}>
              <div className={styles.lightbulbIconBox}>
                <Lightbulb size={20} />
              </div>
              <div className={styles.fallbackTextGroup}>
                <h4 className={styles.fallbackTitle}>Can't find what you're looking for?</h4>
                <p className={styles.fallbackDesc}>
                  You can contact us on WhatsApp, Email or raise a support request.
                </p>
              </div>
            </div>
            <ChevronRight size={18} className={styles.fallbackChevron} />
          </button>
        </div>
      ) : (
        /* ====================================================================
           SCREEN 2: CHAT CONVERSATION VIEW (QUESTION SELECTED)
           ==================================================================== */
        <div className={styles.screenTwoView}>
          {/* Chat Messages Container */}
          <div className={styles.chatMessagesContainer}>
            {/* 1. Assistant Greeting Message */}
            <div className={styles.assistantMessageRow}>
              <div className={styles.chatAvatarWrap}>
                <SupportBotAvatar size={38} />
              </div>
              <div className={styles.messageBubbleColumn}>
                <div className={styles.greetingBubble}>
                  <p className={styles.greetingText}>
                    Hi! I'm your BillScrap Support Assistant. I'm here 24/7 to help you with common
                    questions. Please select a question below.
                  </p>
                </div>
                <span className={styles.messageTimestamp}>{messageTime}</span>
              </div>
            </div>

            {/* 2. User Selected Question Bubble */}
            <div className={styles.userMessageRow}>
              <div className={styles.userMessageBubbleColumn}>
                <div className={styles.userQuestionBubble}>
                  <span>{activeQuestion.question}</span>
                </div>
                <span className={styles.userMessageTimestamp}>{messageTime}</span>
              </div>
            </div>

            {/* 3. Assistant Answer Bubble */}
            <div className={styles.assistantMessageRow}>
              <div className={styles.chatAvatarWrap}>
                <SupportBotAvatar size={38} />
              </div>
              <div className={styles.messageBubbleColumn}>
                <div className={styles.answerCardBubble}>
                  <h4 className={styles.answerHeader}>Here's the answer:</h4>
                  <p className={styles.answerBodyText}>{activeQuestion.answer}</p>

                  {/* Need more help? Notice Card */}
                  <div className={styles.needHelpCard}>
                    <div className={styles.needHelpHeader}>
                      <div className={styles.needHelpIconBox}>
                        <Clock size={16} />
                      </div>
                      <span className={styles.needHelpTitle}>Need more help?</span>
                    </div>
                    <p className={styles.needHelpDesc}>
                      If your issue is not resolved, our support team will reach you in 24 hrs.
                    </p>
                  </div>

                  {/* Primary Action Button (e.g. Go to Orders / Sell Scrap) */}
                  {activeQuestion.actionLabel && activeQuestion.actionUrl && (
                    <div className={styles.actionBtnWrap}>
                      {activeQuestion.isExternalAction ? (
                        <a
                          href={activeQuestion.actionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.primaryActionBtn}
                        >
                          <ExternalLink size={16} />
                          <span>{activeQuestion.actionLabel}</span>
                        </a>
                      ) : (
                        <Link to={activeQuestion.actionUrl} className={styles.primaryActionBtn}>
                          <ExternalLink size={16} />
                          <span>{activeQuestion.actionLabel}</span>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
                <span className={styles.messageTimestamp}>{messageTime}</span>
              </div>
            </div>
          </div>

          {/* 4. "Was this helpful?" Feedback Row */}
          <div className={styles.feedbackSection}>
            <h4 className={styles.feedbackHeading}>Was this helpful?</h4>
            <div className={styles.feedbackBtnRow}>
              <button
                type="button"
                onClick={() => handleFeedback('yes')}
                className={`${styles.feedbackBtn} ${
                  feedbackGiven[activeQuestion.id] === 'yes' ? styles.feedbackBtnActive : ''
                }`}
              >
                <ThumbsUp size={16} />
                <span>Yes</span>
              </button>
              <button
                type="button"
                onClick={() => handleFeedback('no')}
                className={`${styles.feedbackBtn} ${
                  feedbackGiven[activeQuestion.id] === 'no' ? styles.feedbackBtnActive : ''
                }`}
              >
                <ThumbsDown size={16} />
                <span>No</span>
              </button>
            </div>
            {feedbackGiven[activeQuestion.id] === 'yes' && (
              <p className={styles.feedbackSuccessText}>Thank you for your feedback!</p>
            )}
            {feedbackGiven[activeQuestion.id] === 'no' && (
              <p className={styles.feedbackHelpText}>
                We're sorry!{' '}
                <a
                  href="https://wa.me/919840123456?text=Hi%20Bill%20Scrap%2C%20I%20need%20assistance%20with%20my%20household%20scrap%20pickup."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.feedbackWhatsAppLink}
                >
                  Chat with us on WhatsApp
                </a>{' '}
                for live assistance.
              </p>
            )}
          </div>

          {/* 5. Related Questions */}
          <div className={styles.relatedSection}>
            <h4 className={styles.relatedHeading}>Related Questions</h4>
            <div className={styles.relatedList}>
              {activeQuestion.relatedQuestions.map((qText, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectByText(qText)}
                  className={styles.relatedQuestionCard}
                >
                  <span className={styles.relatedQuestionText}>{qText}</span>
                  <ChevronRight size={17} className={styles.relatedQuestionChevron} />
                </button>
              ))}
            </div>
          </div>

          {/* 6. Back to All Questions Button */}
          <div className={styles.bottomNavWrap}>
            <button
              type="button"
              onClick={() => setActiveQuestionId(null)}
              className={styles.backToAllBtn}
            >
              <ArrowLeft size={16} />
              <span>Back to All Questions</span>
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          ESCALATION MODAL (WHEN USER TAPS "CAN'T FIND WHAT YOU'RE LOOKING FOR?")
          ==================================================================== */}
      {showEscalationModal && (
        <div className={styles.modalOverlay} onClick={() => setShowEscalationModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Contact Support</h3>
              <button
                type="button"
                onClick={() => setShowEscalationModal(false)}
                className={styles.modalCloseBtn}
              >
                <X size={20} />
              </button>
            </div>
            <p className={styles.modalSub}>
              Our team is ready to help through your preferred channel:
            </p>

            <div className={styles.modalActions}>
              <a
                href="https://wa.me/919840123456?text=Hi%20Bill%20Scrap%2C%20I%20need%20assistance%20with%20my%20household%20scrap%20pickup."
                target="_blank"
                rel="noopener noreferrer"
                className={styles.modalWhatsAppBtn}
              >
                <MessageCircle size={18} />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href="mailto:support@billscrap.com?subject=Household%20Scrap%20Support%20Inquiry"
                className={styles.modalEmailBtn}
              >
                <Mail size={18} />
                <span>Email support@billscrap.com</span>
              </a>

              <Link
                to="/household/support"
                onClick={() => setShowEscalationModal(false)}
                className={styles.modalTicketBtn}
              >
                <FileText size={18} />
                <span>Raise a Support Request Ticket</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HouseholdSupportBot;
