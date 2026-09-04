import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  LuArrowLeft,
  LuShieldCheck,
  LuMapPin,
  LuPhone,
  LuMic,
  LuPlay,
  LuPause,
  LuSquare,
  LuTrash2,
  LuSend,
  LuPackage,
  LuTriangleAlert,
  LuShoppingCart,
  LuCircleCheck as LuCheckCircle,
  LuCircleX as LuXCircle,
  LuClock,
  LuShieldAlert,
} from 'react-icons/lu';
import {
  getHouseholdProductById,
  getProductVoiceMessages,
  sendHouseholdVoiceMessage,
  getReusableCart,
  addToReusableCart,
  type HouseholdProductItem,
  type VoiceMessageItem,
  type ReusableCartItem,
} from '@/services/reusableProductService';
import styles from './HouseholdProductDetail.module.css';

type RecordingState = 'idle' | 'recording' | 'preview' | 'uploading';

export function HouseholdProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<HouseholdProductItem | null>(null);
  const [voiceMessages, setVoiceMessages] = useState<VoiceMessageItem[]>([]);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<ReusableCartItem[]>(() => getReusableCart());

  // Merchant product voice note state
  const [isMerchantVoicePlaying, setIsMerchantVoicePlaying] = useState(false);
  const [merchantVoiceSeconds, setMerchantVoiceSeconds] = useState(0);
  const merchantVoiceIntervalRef = useRef<number | null>(null);
  const synthUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Voice recording states
  const [recorderState, setRecorderState] = useState<RecordingState>('idle');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [recordedDuration, setRecordedDuration] = useState(0);

  // References
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const previewAudioElRef = useRef<HTMLAudioElement | null>(null);
  const activeAudioElRef = useRef<HTMLAudioElement | null>(null);

  // Load product and message history
  useEffect(() => {
    if (!id) return;
    const prod = getHouseholdProductById(id);
    if (prod) {
      setProduct(prod);
      setVoiceMessages(getProductVoiceMessages(id));
    }
  }, [id]);

  const currentCartItem = product ? cartItems.find((i) => i.productId === product.id) : undefined;
  const isInCart = Boolean(currentCartItem);

  const handleAddToCart = () => {
    if (!product) return;
    addToReusableCart(product);
    setCartItems(getReusableCart());
  };

  // Toggle merchant voice note playback (natural speech audio + animated waveform)
  const toggleMerchantVoicePlay = () => {
    if (isMerchantVoicePlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (merchantVoiceIntervalRef.current) {
        clearInterval(merchantVoiceIntervalRef.current);
        merchantVoiceIntervalRef.current = null;
      }
      setIsMerchantVoicePlaying(false);
    } else {
      setIsMerchantVoicePlaying(true);
      const totalSec = 18;

      if (typeof window !== 'undefined' && 'speechSynthesis' in window && product?.description) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(
          `Hello, this is ${product.merchant.name}. ${product.description}`
        );
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.onend = () => {
          setIsMerchantVoicePlaying(false);
          setMerchantVoiceSeconds(0);
          if (merchantVoiceIntervalRef.current) {
            clearInterval(merchantVoiceIntervalRef.current);
            merchantVoiceIntervalRef.current = null;
          }
        };
        utterance.onerror = () => {
          setIsMerchantVoicePlaying(false);
          if (merchantVoiceIntervalRef.current) {
            clearInterval(merchantVoiceIntervalRef.current);
            merchantVoiceIntervalRef.current = null;
          }
        };
        synthUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }

      if (merchantVoiceIntervalRef.current) {
        clearInterval(merchantVoiceIntervalRef.current);
      }
      merchantVoiceIntervalRef.current = window.setInterval(() => {
        setMerchantVoiceSeconds((prev) => {
          if (prev >= totalSec) {
            if (merchantVoiceIntervalRef.current) {
              clearInterval(merchantVoiceIntervalRef.current);
              merchantVoiceIntervalRef.current = null;
            }
            setIsMerchantVoicePlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  // Clean up timers & audios on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (merchantVoiceIntervalRef.current) clearInterval(merchantVoiceIntervalRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (previewAudioElRef.current) previewAudioElRef.current.pause();
      if (activeAudioElRef.current) activeAudioElRef.current.pause();
    };
  }, []);

  if (!product) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.backNavRow}>
          <Link to="/household/products" className={styles.backBtn}>
            <LuArrowLeft size={16} />
            <span>Back to Reusable Products</span>
          </Link>
        </div>
        <div className={styles.unavailableBanner}>
          <LuTriangleAlert size={24} />
          <div className={styles.unavailableTextGroup}>
            <h3 className={styles.unavailableTitle}>Product Not Found</h3>
            <p className={styles.unavailableDesc}>
              The reusable product you are looking for does not exist or has been removed by the merchant.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isAvailable = product.status === 'available';

  // --- VOICE RECORDING HANDLERS ---
  const startRecording = async () => {
    try {
      setRecordingSeconds(0);
      audioChunksRef.current = [];

      // Check if browser supports real audio capture
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          // Stop all audio tracks
          stream.getTracks().forEach((track) => track.stop());
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setPreviewAudioUrl(audioUrl);
          setRecorderState('preview');
        };

        mediaRecorder.start(200);
      } else {
        // Fallback for restricted test environments
        simulateFallbackRecording();
      }

      setRecorderState('recording');

      // Start duration counter
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => {
          const next = prev + 1;
          // Cap at 2 minutes (120 seconds)
          if (next >= 120) {
            stopRecording();
          }
          return next;
        });
      }, 1000);
    } catch (err) {
      console.warn('Microphone access denied or unavailable, using simulated recording', err);
      simulateFallbackRecording();
    }
  };

  const simulateFallbackRecording = () => {
    setRecorderState('recording');
    timerIntervalRef.current = window.setInterval(() => {
      setRecordingSeconds((prev) => {
        const next = prev + 1;
        if (next >= 120) {
          stopRecording();
        }
        return next;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setRecordedDuration(Math.max(1, recordingSeconds));

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    } else {
      // Fallback synthetic preview
      setPreviewAudioUrl('simulated-audio');
      setRecorderState('preview');
    }
  };

  const cancelRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setRecorderState('idle');
    setRecordingSeconds(0);
    setPreviewAudioUrl(null);
    setIsPreviewPlaying(false);
  };

  const deletePreview = () => {
    if (previewAudioElRef.current) {
      previewAudioElRef.current.pause();
    }
    setPreviewAudioUrl(null);
    setRecorderState('idle');
    setRecordingSeconds(0);
    setIsPreviewPlaying(false);
  };

  const togglePreviewPlay = () => {
    if (!previewAudioUrl) return;

    if (previewAudioUrl === 'simulated-audio') {
      setIsPreviewPlaying((prev) => !prev);
      return;
    }

    if (!previewAudioElRef.current) {
      previewAudioElRef.current = new Audio(previewAudioUrl);
      previewAudioElRef.current.onended = () => setIsPreviewPlaying(false);
    }

    if (isPreviewPlaying) {
      previewAudioElRef.current.pause();
      setIsPreviewPlaying(false);
    } else {
      previewAudioElRef.current.play();
      setIsPreviewPlaying(true);
    }
  };

  const sendVoiceNote = () => {
    if (!product) return;

    setRecorderState('uploading');

    setTimeout(() => {
      const finalUrl = previewAudioUrl || 'voice-note-audio';
      const newMsg = sendHouseholdVoiceMessage(product.id, finalUrl, recordedDuration);

      setVoiceMessages((prev) => [...prev, newMsg]);
      setRecorderState('idle');
      setRecordingSeconds(0);
      setPreviewAudioUrl(null);
      setIsPreviewPlaying(false);
    }, 400);
  };

  // Play/Pause individual messages in conversation history
  const togglePlayMessage = (msgId: string) => {
    if (activePlayingId === msgId) {
      if (activeAudioElRef.current) {
        activeAudioElRef.current.pause();
      }
      setActivePlayingId(null);
    } else {
      if (activeAudioElRef.current) {
        activeAudioElRef.current.pause();
      }
      setActivePlayingId(msgId);

      // Play beep/sound or reset after message duration
      const targetMsg = voiceMessages.find((m) => m.id === msgId);
      const playDurationMs = (targetMsg?.durationSeconds || 5) * 1000;
      setTimeout(() => {
        setActivePlayingId((current) => (current === msgId ? null : current));
      }, Math.min(playDurationMs, 10000));
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 1. Back Navigation Row */}
      <div className={styles.backNavRow}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate('/household/products')}
        >
          <LuArrowLeft size={16} />
          <span>Back to Reusable Products</span>
        </button>
      </div>

      {/* Availability Warning Banner if item is sold or removed */}
      {!isAvailable && (
        <div className={styles.unavailableBanner} role="alert">
          <LuTriangleAlert size={24} />
          <div className={styles.unavailableTextGroup}>
            <h3 className={styles.unavailableTitle}>Product No Longer Available</h3>
            <p className={styles.unavailableDesc}>
              This item has been removed or sold by the merchant. Inquiries and voice messages are currently disabled.
            </p>
          </div>
        </div>
      )}

      {/* 2. Main Layout (Desktop 2-Col, Mobile Compact Stack) */}
      <div className={styles.detailGrid}>
        {/* Left Column: Product Image & Unified Product Summary */}
        <div className={styles.productMainCol}>
          {/* Product Image Container with badges */}
          <div className={styles.imageGalleryCard}>
            <div className={styles.mainImageWrap}>
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.mainProductImage}
                />
              ) : (
                <div className={styles.fallbackImagePlaceholder}>
                  <LuPackage size={56} />
                  <span>No image available</span>
                </div>
              )}

              <span className={styles.imageConditionBadge}>{product.condition}</span>
            </div>
          </div>

          {/* Unified Compact Product Summary & Description Card */}
          <div className={styles.productSummaryCard}>
            {/* Category */}
            <span className={styles.categoryLabel}>{product.category}</span>

            {/* Product Name */}
            <h1 className={styles.productTitle}>{product.name}</h1>

            {/* Listed Price & Status */}
            <div className={styles.priceRow}>
              <span className={styles.priceValue}>{product.priceFormatted}</span>
              <span className={styles.priceStatus}>
                {product.negotiable ? 'Merchant listed price' : 'Fixed price'}
              </span>
            </div>

            {/* Compact Metadata Row (Condition · Location · Distance) */}
            <div className={styles.compactMetaRow}>
              <span className={styles.metaConditionPill}>{product.condition}</span>
              <span className={styles.metaDot}>•</span>
              <span className={styles.metaLocationText}>
                <LuMapPin size={13} className={styles.metaPinIcon} />
                <span>{product.area}</span>
              </span>
              <span className={styles.metaDot}>•</span>
              <span className={styles.metaDistanceText}>{product.distanceText}</span>
            </div>

            <div className={styles.summaryDivider} />

            {/* Merchant Voice Description (Replaces text description) */}
            <div className={styles.merchantVoiceSection}>
              <div className={styles.merchantVoiceHeader}>
                <h2 className={styles.descTitle}>About This Product</h2>
                <span className={styles.merchantVoiceBadge}>
                  <LuMic size={12} className={styles.merchantMicBadgeIcon} />
                  <span>Merchant Voice Note</span>
                </span>
              </div>

              <div className={styles.merchantVoicePlayerCard}>
                <button
                  type="button"
                  className={styles.merchantPlayBtn}
                  onClick={toggleMerchantVoicePlay}
                  aria-label={isMerchantVoicePlaying ? "Pause merchant's voice" : "Play merchant's voice"}
                >
                  {isMerchantVoicePlaying ? <LuPause size={16} /> : <LuPlay size={16} style={{ marginLeft: 2 }} />}
                </button>

                <div className={styles.merchantWaveformWrap} aria-hidden="true">
                  {[30, 55, 40, 85, 70, 35, 95, 60, 80, 45, 90, 65, 40, 75, 50, 85, 60, 70].map((h, idx) => {
                    const isBarPlayed = isMerchantVoicePlaying && (idx / 18) * 18 <= merchantVoiceSeconds;
                    return (
                      <span
                        key={idx}
                        className={`${styles.merchantWaveBar} ${isMerchantVoicePlaying ? styles.merchantWaveActive : ''} ${isBarPlayed ? styles.merchantWavePlayed : ''}`}
                        style={{
                          height: isMerchantVoicePlaying
                            ? `${Math.max(6, (h * (idx % 2 ? 1 : 0.8)) / 4)}px`
                            : `${Math.max(4, h / 7)}px`,
                        }}
                      />
                    );
                  })}
                </div>

                <span className={styles.merchantVoiceDuration}>
                  {isMerchantVoicePlaying ? formatTimer(merchantVoiceSeconds) : '0:18'}
                </span>
              </div>

              <div className={styles.merchantVoiceMetaRow}>
                <span className={styles.merchantVoiceAuthor}>
                  Voice note recorded by <strong>{product.merchant.name}</strong>
                </span>
                {isMerchantVoicePlaying && (
                  <span className={styles.audioPlayingBadge}>
                    <span className={styles.greenAudioDot} /> Playing audio
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Seller Information & Voice Messages */}
        <div className={styles.interactionCol}>
          {/* Compact Seller Information Card */}
          <div className={styles.sellerCard}>
            <div className={styles.sellerCardHeader}>
              <h2 className={styles.sellerSectionTitle}>Seller Information</h2>
              {product.merchant.verificationStatus === 'verified' && (
                <span className={styles.verifiedBadge}>
                  <LuShieldCheck size={13} />
                  <span>Verified Merchant</span>
                </span>
              )}
            </div>

            <div className={styles.sellerIdentityRow}>
              <div className={styles.sellerAvatar}>
                {product.merchant.name.charAt(0).toUpperCase()}
              </div>
              <div className={styles.sellerNames}>
                <h3 className={styles.sellerName}>{product.merchant.name}</h3>
                <p className={styles.sellerBusinessName}>{product.merchant.businessName}</p>
                <div className={styles.sellerAreaRow}>
                  <LuMapPin size={12} className={styles.sellerPinIcon} />
                  <span>{product.merchant.area}, {product.merchant.city}</span>
                </div>
              </div>
            </div>

            {/* Factual trust metric only - strictly NO ratings or reviews */}
            {product.merchant.completedDeals > 0 && (
              <div className={styles.sellerFactualMetric}>
                <LuPackage size={13} className={styles.metricPackageIcon} />
                <span>{product.merchant.completedDeals} Deals Completed</span>
              </div>
            )}

            <div className={styles.sellerActionsRow}>
              <div className={styles.cartActionButtonsWrap}>
                <a
                  href={`tel:${product.merchant.mobile}`}
                  className={styles.callSellerBtn}
                  title={`Call ${product.merchant.name}`}
                >
                  <LuPhone size={14} />
                  <span>Call Merchant</span>
                </a>

                {!isInCart && isAvailable && (
                  <button
                    type="button"
                    className={styles.addToCartBtn}
                    onClick={handleAddToCart}
                  >
                    <LuShoppingCart size={14} />
                    <span>Select Product</span>
                  </button>
                )}
              </div>

              {/* In-cart status alerts & action buttons */}
              {isInCart && currentCartItem && (
                <>
                  {currentCartItem.status === 'confirmed' && (
                    <button
                      type="button"
                      className={styles.inCartConfirmedBtn}
                      onClick={() => navigate('/household/products?openCart=true')}
                    >
                      <LuCheckCircle size={15} />
                      <span>Confirmed by Merchant (Ready for Pickup)</span>
                    </button>
                  )}
                  {currentCartItem.status === 'rejected' && (
                    <button
                      type="button"
                      className={styles.inCartRejectedBtn}
                      onClick={() => navigate('/household/products?openCart=true')}
                    >
                      <LuXCircle size={15} />
                      <span>Rejected by Merchant (Do Not Visit Yard)</span>
                    </button>
                  )}
                  {currentCartItem.status === 'pending' && (
                    <button
                      type="button"
                      className={styles.inCartPendingBtn}
                      onClick={() => navigate('/household/products?openCart=true')}
                    >
                      <LuClock size={15} />
                      <span>In Cart · Awaiting Confirmation</span>
                    </button>
                  )}
                </>
              )}

              {/* Crucial confirmation warning for household users */}
              <p className={styles.yardVisitTip}>
                <LuShieldAlert size={15} className={styles.yardTipIcon} />
                <span>
                  <strong>Check Merchant Status First:</strong> Merchants may sell items to walk-ins. Please confirm availability or wait for &quot;Confirmed&quot; status before visiting the yard in {product.area}.
                </span>
              </p>
            </div>
          </div>

          {/* Pure Voice Messages Section (Strictly No Text Chat) */}
          <section className={styles.voiceSectionCard} aria-label="Voice Messages">
            <div className={styles.voiceHeader}>
              <div className={styles.voiceHeadingRow}>
                <h2 className={styles.voiceTitle}>
                  <LuMic size={18} color="#dc2626" />
                  <span>Voice Messages</span>
                </h2>
                <span className={styles.voiceCountBadge}>
                  {voiceMessages.length} {voiceMessages.length === 1 ? 'Message' : 'Messages'}
                </span>
              </div>
              <p className={styles.voiceContextText}>
                Want to know more or have questions? Send the merchant a voice message.
              </p>
            </div>

            {/* Message Thread History */}
            <div className={styles.conversationHistory} role="log" aria-live="polite">
              {voiceMessages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>
                  No voice messages yet. Tap the mic below to send a voice message.
                </div>
              ) : (
                voiceMessages.map((msg) => {
                  const isPlaying = activePlayingId === msg.id;
                  const isHousehold = msg.sender === 'household';

                  return (
                    <div
                      key={msg.id}
                      className={`${styles.messageBubble} ${
                        isHousehold ? styles.bubbleHousehold : styles.bubbleMerchant
                      }`}
                    >
                      <div className={styles.bubbleHeader}>
                        <span className={styles.bubbleSenderName}>{msg.senderName}</span>
                        <span className={styles.bubbleTime}>{msg.timestamp}</span>
                      </div>

                      {/* Interactive Audio Player Row */}
                      <div className={styles.audioPlayerRow}>
                        <button
                          type="button"
                          className={styles.playToggleBtn}
                          onClick={() => togglePlayMessage(msg.id)}
                          aria-label={isPlaying ? 'Pause voice message' : 'Play voice message'}
                        >
                          {isPlaying ? <LuPause size={14} /> : <LuPlay size={14} />}
                        </button>

                        <div className={styles.audioWaveformWrap} aria-hidden="true">
                          {[40, 70, 30, 90, 60, 100, 50, 80, 45, 85, 65, 95].map((h, idx) => (
                            <span
                              key={idx}
                              className={`${styles.waveBar} ${isPlaying ? styles.waveBarActive : ''}`}
                              style={{
                                height: isPlaying ? `${Math.max(6, (h * (idx % 2 ? 1 : 0.8)) / 5)}px` : '4px',
                              }}
                            />
                          ))}
                        </div>

                        <span className={styles.audioDurationText}>
                          {msg.durationFormatted}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Voice Recorder Control Widget */}
            {isAvailable ? (
              <div className={styles.recorderWidget}>
                {/* State 1: IDLE */}
                {recorderState === 'idle' && (
                  <div className={styles.idleState}>
                    <span className={styles.recordPromptText}>
                      Tap mic to send a voice message to the merchant
                    </span>
                    <button
                      type="button"
                      className={styles.primaryMicButton}
                      onClick={startRecording}
                      aria-label="Start recording voice message"
                    >
                      <LuMic size={24} />
                    </button>
                  </div>
                )}

                {/* State 2: RECORDING */}
                {recorderState === 'recording' && (
                  <div className={styles.recordingState}>
                    <div className={styles.recordingIndicatorGroup}>
                      <span className={styles.pulseDot} />
                      <span className={styles.recordingTimer}>
                        {formatTimer(recordingSeconds)}
                      </span>
                      <span className={styles.recordingLabel}>Recording...</span>
                    </div>

                    <div className={styles.recorderActions}>
                      <button
                        type="button"
                        className={styles.cancelRecordBtn}
                        onClick={cancelRecording}
                        aria-label="Cancel recording"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className={styles.stopRecordBtn}
                        onClick={stopRecording}
                        aria-label="Stop recording"
                      >
                        <LuSquare size={14} />
                        <span>Stop</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* State 3: PREVIEW & REVIEW */}
                {recorderState === 'preview' && (
                  <div className={styles.previewState}>
                    <div className={styles.previewHeader}>
                      <span>Review Voice Message ({formatTimer(recordedDuration)})</span>
                    </div>

                    <div className={styles.previewPlayerBox}>
                      <button
                        type="button"
                        className={styles.playToggleBtn}
                        onClick={togglePreviewPlay}
                        aria-label={isPreviewPlaying ? 'Pause preview' : 'Play preview'}
                      >
                        {isPreviewPlaying ? <LuPause size={14} /> : <LuPlay size={14} />}
                      </button>

                      <div className={styles.audioWaveformWrap} aria-hidden="true">
                        {[50, 80, 40, 95, 60, 75, 55, 90, 70, 85].map((h, idx) => (
                          <span
                            key={idx}
                            className={`${styles.waveBar} ${
                              isPreviewPlaying ? styles.waveBarActive : ''
                            }`}
                            style={{
                              height: isPreviewPlaying ? `${h / 5}px` : '4px',
                            }}
                          />
                        ))}
                      </div>

                      <span className={styles.audioDurationText}>
                        {formatTimer(recordedDuration)}
                      </span>
                    </div>

                    <div className={styles.previewActionsRow}>
                      <button
                        type="button"
                        className={styles.deletePreviewBtn}
                        onClick={deletePreview}
                        aria-label="Delete and record again"
                      >
                        <LuTrash2 size={14} />
                        <span>Delete</span>
                      </button>

                      <button
                        type="button"
                        className={styles.sendVoiceBtn}
                        onClick={sendVoiceNote}
                        aria-label="Send voice message to merchant"
                      >
                        <LuSend size={14} />
                        <span>Send Voice Note</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* State 4: UPLOADING */}
                {recorderState === 'uploading' && (
                  <div style={{ textAlign: 'center', padding: '0.75rem', color: '#64748b', fontSize: '0.85rem' }}>
                    Sending voice message to merchant...
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '0.85rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                Voice communication is disabled because this product is no longer available.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default HouseholdProductDetail;
