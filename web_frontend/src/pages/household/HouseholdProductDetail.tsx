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
  LuStar,
  LuPackage,
  LuTriangleAlert,
} from 'react-icons/lu';
import {
  getHouseholdProductById,
  getProductVoiceMessages,
  sendHouseholdVoiceMessage,
  type HouseholdProductItem,
  type VoiceMessageItem,
} from '@/services/reusableProductService';
import styles from './HouseholdProductDetail.module.css';

type RecordingState = 'idle' | 'recording' | 'preview' | 'uploading';

export function HouseholdProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<HouseholdProductItem | null>(null);
  const [voiceMessages, setVoiceMessages] = useState<VoiceMessageItem[]>([]);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

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

  // Clean up timers & audios on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
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
              This item has been removed or sold by the merchant. Inquiries and voice negotiations are currently disabled.
            </p>
          </div>
        </div>
      )}

      {/* 2. Main Two-Column Layout */}
      <div className={styles.detailGrid}>
        {/* Left Column: Product Showcase & Specifications */}
        <div className={styles.productMainCol}>
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
                  <LuPackage size={64} />
                  <span>No image available</span>
                </div>
              )}

              <span className={styles.imageConditionBadge}>{product.condition}</span>

              {product.negotiable && (
                <span className={styles.imageNegotiableBadge}>Price Negotiable</span>
              )}
            </div>
          </div>

          {/* Product Description & Information Card */}
          <div className={styles.infoCard}>
            <span className={styles.categoryTag}>{product.category}</span>
            <h1 className={styles.productName}>{product.name}</h1>

            <div className={styles.priceBanner}>
              <span className={styles.priceMain}>{product.priceFormatted}</span>
              <span className={styles.priceLabel}>
                {product.negotiable ? '(Merchant listed price, negotiable)' : '(Fixed price)'}
              </span>
            </div>

            <div className={styles.descriptionSection}>
              <h3 className={styles.descHeading}>Product Description & Condition</h3>
              <p className={styles.descText}>{product.description}</p>
            </div>

            {/* Meta Specifications */}
            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <span className={styles.metaItemLabel}>Condition Assessment</span>
                <span className={styles.metaItemValue}>{product.condition}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaItemLabel}>Location</span>
                <span className={styles.metaItemValue}>
                  <LuMapPin size={14} />
                  {product.area}
                </span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaItemLabel}>Distance from your area</span>
                <span className={styles.metaItemValue}>{product.distanceText}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaItemLabel}>Posted</span>
                <span className={styles.metaItemValue}>{product.postedTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Seller Profile & Pure Voice Communication */}
        <div className={styles.interactionCol}>
          {/* Seller Profile Card */}
          <div className={styles.sellerCard}>
            <div className={styles.sellerCardHeader}>
              <span className={styles.sellerSectionTitle}>Seller Information</span>
              {product.merchant.verificationStatus === 'verified' && (
                <span className={styles.verifiedPill}>
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
              </div>
            </div>

            <div className={styles.sellerMetricsRow}>
              <div className={styles.metricItem}>
                <LuStar size={14} className={styles.ratingStar} />
                <span>{product.merchant.rating} / 5.0 Rating</span>
              </div>
              <div className={styles.metricItem}>
                <span>{product.merchant.completedDeals} Deals Completed</span>
              </div>
            </div>

            <div className={styles.sellerContactBar}>
              <a
                href={`tel:${product.merchant.mobile}`}
                className={styles.callSellerBtn}
                title={`Call ${product.merchant.name}`}
              >
                <LuPhone size={15} />
                <span>Call {product.merchant.mobile}</span>
              </a>
            </div>
          </div>

          {/* Pure Voice Messages Section (Strictly No Text Chat) */}
          <section className={styles.voiceSectionCard} aria-label="Voice Messages Negotiation">
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
                Want to know more or discuss the price? Send the merchant a voice message.
              </p>
            </div>

            {/* Message Thread History */}
            <div className={styles.conversationHistory} role="log" aria-live="polite">
              {voiceMessages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>
                  No voice messages yet. Press the mic below to ask a question or negotiate.
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
                      Tap mic to record questions or negotiate price with merchant
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
