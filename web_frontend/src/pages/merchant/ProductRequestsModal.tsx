import React, { useState, useEffect, useRef } from 'react';
import {
  ClipboardList,
  ArrowLeft,
  X,
  ChevronRight,
  Mic,
  Square,
  Play,
  Pause,
  Send,
  Trash2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  Phone,
  Volume2,
  Tag,
  Check,
} from 'lucide-react';
import {
  type ProductRequestItem,
  type RequestStatus,
  type VoiceMessage,
  getProductRequests,
  subscribeProductRequests,
  acceptProductRequest,
  cancelProductRequest,
  sendMerchantVoiceReply,
} from '@/services/merchantProductRequestsService';
import styles from './ProductRequestsModal.module.css';

interface ProductRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRequestId?: string | null;
}

type FilterTab = 'ALL' | 'PENDING' | 'ACCEPTED' | 'CANCELLED';

export default function ProductRequestsModal({
  isOpen,
  onClose,
  initialRequestId = null,
}: ProductRequestsModalProps) {
  const [requests, setRequests] = useState<ProductRequestItem[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(initialRequestId);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('ALL');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // Audio Playback state
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [playbackSeconds, setPlaybackSeconds] = useState(0);
  const playbackIntervalRef = useRef<number | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Load and subscribe to requests
  useEffect(() => {
    if (isOpen) {
      setRequests(getProductRequests());
      setSelectedRequestId(initialRequestId ?? null);
    }
    const unsubscribe = subscribeProductRequests((updated) => {
      setRequests(updated);
    });
    return () => unsubscribe();
  }, [isOpen, initialRequestId]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      resetRecordingState();
      stopVoicePlayback();
    }
    return () => {
      document.body.style.overflow = '';
      stopVoicePlayback();
    };
  }, [isOpen]);

  const selectedRequest = requests.find((r) => r.id === selectedRequestId);

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
  const acceptedCount = requests.filter((r) => r.status === 'ACCEPTED').length;
  const cancelledCount = requests.filter((r) => r.status === 'CANCELLED').length;

  const filteredRequests = requests.filter((req) => {
    if (activeFilter === 'ALL') return true;
    return req.status === activeFilter;
  });

  const notify = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 3000);
  };

  // --- VOICE PLAYBACK HANDLERS ---
  const stopVoicePlayback = () => {
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
      playbackIntervalRef.current = null;
    }
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    setPlayingVoiceId(null);
    setPlaybackSeconds(0);
  };

  const handleTogglePlayVoice = (vm: VoiceMessage) => {
    if (playingVoiceId === vm.id) {
      stopVoicePlayback();
      return;
    }

    stopVoicePlayback();
    setPlayingVoiceId(vm.id);
    setPlaybackSeconds(0);

    // If a real audioUrl is present, play it via HTML5 Audio
    if (vm.audioUrl && vm.audioUrl !== 'simulated-audio') {
      try {
        const audio = new Audio(vm.audioUrl);
        activeAudioRef.current = audio;
        audio.play().catch(() => {});
        audio.onended = () => stopVoicePlayback();
        audio.ontimeupdate = () => {
          setPlaybackSeconds(Math.floor(audio.currentTime));
        };
        return;
      } catch (err) {
        console.warn('Audio playback error, falling back to simulated progress', err);
      }
    }

    // Fallback simulated progress timer
    playbackIntervalRef.current = window.setInterval(() => {
      setPlaybackSeconds((prev) => {
        if (prev >= vm.durationSeconds) {
          stopVoicePlayback();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  // --- VOICE RECORDING HANDLERS (VOICE ONLY) ---
  const resetRecordingState = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    setIsRecording(false);
    setRecordingDuration(0);
    setRecordedAudioUrl(null);
    setIsPreviewPlaying(false);
  };

  const handleStartRecording = async () => {
    resetRecordingState();
    setIsRecording(true);
    setRecordingDuration(0);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setRecordedAudioUrl(audioUrl);
        };

        mediaRecorder.start(200);
      }
    } catch (err) {
      console.warn('Microphone access unavailable or denied, using simulated timer', err);
    }

    recordingTimerRef.current = window.setInterval(() => {
      setRecordingDuration((prev) => {
        const next = prev + 1;
        if (next >= 120) {
          handleStopRecording();
        }
        return next;
      });
    }, 1000);
  };

  const handleStopRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setIsRecording(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        setRecordedAudioUrl('simulated-audio');
      }
    } else {
      setRecordedAudioUrl('simulated-audio');
    }
  };

  const handleTogglePreviewPlay = () => {
    if (isPreviewPlaying) {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      setIsPreviewPlaying(false);
    } else {
      if (recordedAudioUrl && recordedAudioUrl !== 'simulated-audio') {
        try {
          const audio = new Audio(recordedAudioUrl);
          previewAudioRef.current = audio;
          audio.play().catch(() => {});
          audio.onended = () => setIsPreviewPlaying(false);
          setIsPreviewPlaying(true);
          return;
        } catch (e) {
          // fallback
        }
      }
      setIsPreviewPlaying(true);
      setTimeout(() => setIsPreviewPlaying(false), Math.max(1000, recordingDuration * 1000));
    }
  };

  const handleSendVoiceReply = () => {
    if (!selectedRequest || recordingDuration <= 0) return;
    sendMerchantVoiceReply(
      selectedRequest.id,
      recordedAudioUrl || undefined,
      recordingDuration
    );
    notify('✓ Voice message sent to customer');
    resetRecordingState();
  };

  // --- MERCHANT DECISION ACTIONS ---
  const handleAccept = () => {
    if (!selectedRequest) return;
    acceptProductRequest(selectedRequest.id);
    notify('✓ Product request accepted! Customer notified for pickup/delivery.');
  };

  const handleConfirmCancel = () => {
    if (!selectedRequest) return;
    cancelProductRequest(selectedRequest.id, 'Merchant cancelled this request.');
    setShowCancelConfirm(false);
    notify('Request cancelled and recorded in history.');
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Product Requests"
    >
      <div className={styles.modalContainer}>
        {/* MODAL HEADER */}
        <div className={`${styles.modalHeader} ${selectedRequestId ? styles.modalHeaderWithBorder : ''}`}>
          <div className={styles.headerLeftGroup}>
            {selectedRequestId ? (
              <button
                type="button"
                className={styles.backBtn}
                onClick={() => {
                  stopVoicePlayback();
                  resetRecordingState();
                  setSelectedRequestId(null);
                }}
              >
                <ArrowLeft size={16} />
                <span>Product Requests</span>
              </button>
            ) : (
              <>
                <div className={styles.modalHeaderIconBadge}>
                  <ClipboardList size={20} />
                </div>
                <div className={styles.modalTitleGroup}>
                  <h2 className={styles.modalTitle}>Product Requests</h2>
                  <p className={styles.modalSubtitle}>
                    <span className={styles.pendingHighlight}>
                      {pendingCount} Pending
                    </span>
                    <span>• {requests.length} Total Requests</span>
                  </p>
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close Product Requests"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter Tabs (Joined directly to navbar without any gap) */}
        {!selectedRequestId && (
          <div className={styles.filterPillsStickyBar}>
            <div className={styles.filterPillsRow}>
              <button
                type="button"
                className={`${styles.filterPill} ${activeFilter === 'ALL' ? styles.filterPillActive : ''}`}
                onClick={() => setActiveFilter('ALL')}
              >
                <span>All</span>
                <span className={styles.filterPillBadge}>{requests.length}</span>
              </button>
              <button
                type="button"
                className={`${styles.filterPill} ${activeFilter === 'PENDING' ? styles.filterPillActive : ''}`}
                onClick={() => setActiveFilter('PENDING')}
              >
                <span>Pending</span>
                <span className={styles.filterPillBadge}>{pendingCount}</span>
              </button>
              <button
                type="button"
                className={`${styles.filterPill} ${activeFilter === 'ACCEPTED' ? styles.filterPillActive : ''}`}
                onClick={() => setActiveFilter('ACCEPTED')}
              >
                <span>Accepted</span>
                <span className={styles.filterPillBadge}>{acceptedCount}</span>
              </button>
              <button
                type="button"
                className={`${styles.filterPill} ${activeFilter === 'CANCELLED' ? styles.filterPillActive : ''}`}
                onClick={() => setActiveFilter('CANCELLED')}
              >
                <span>Cancelled</span>
                <span className={styles.filterPillBadge}>{cancelledCount}</span>
              </button>
            </div>
          </div>
        )}

        {/* MODAL BODY */}
        <div className={styles.modalBody}>
          {/* =================================================================
              VIEW A: PRODUCT REQUEST LIST
              ================================================================= */}
          {!selectedRequestId && (
            <>
              {/* Request Items */}
              {filteredRequests.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateIcon}>
                    <ClipboardList size={24} />
                  </div>
                  <h3 className={styles.emptyStateTitle}>No Requests Found</h3>
                  <p className={styles.emptyStateText}>
                    No reusable product requests match the selected filter.
                  </p>
                </div>
              ) : (
                <div className={styles.requestsList}>
                  {filteredRequests.map((req) => (
                    <div
                      key={req.id}
                      className={`${styles.requestCard} ${
                        req.status === 'PENDING' ? styles.requestCardPending : ''
                      }`}
                      onClick={() => {
                        setSelectedRequestId(req.id);
                        stopVoicePlayback();
                        resetRecordingState();
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedRequestId(req.id);
                        }
                      }}
                    >
                      {/* Top Row: Full Product Title + Status Pill */}
                      <div className={styles.cardHeaderRow}>
                        <h4 className={styles.requestProductName} title={req.productName}>
                          {req.productName}
                        </h4>
                        <div className={styles.cardStatusCol}>
                          {req.status === 'PENDING' && (
                            <span className={styles.statusBadgePending}>
                              <Clock size={11} />
                              <span>Pending</span>
                            </span>
                          )}
                          {req.status === 'ACCEPTED' && (
                            <span className={styles.statusBadgeAccepted}>
                              <Check size={11} />
                              <span>Accepted</span>
                            </span>
                          )}
                          {req.status === 'CANCELLED' && (
                            <span className={styles.statusBadgeCancelled}>
                              <X size={11} />
                              <span>Cancelled</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom Row: Thumbnail + Customer Info + Price / Voice Badges + Chevron */}
                      <div className={styles.cardBodyRow}>
                        <img
                          src={req.productImage}
                          alt={req.productName}
                          className={styles.productThumb}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/logo.png';
                          }}
                        />

                        <div className={styles.requestInfoCol}>
                          <div className={styles.requestCustomerRow}>
                            <span className={styles.customerName}>{req.customerName}</span>
                            <span className={styles.customerDot}>•</span>
                            <span className={styles.requestTime}>Requested {req.requestedAt}</span>
                          </div>

                          <div className={styles.requestMetaRow}>
                            {req.productPrice && (
                              <span className={styles.productPricePill}>{req.productPrice}</span>
                            )}
                            {req.voiceMessages && req.voiceMessages.length > 0 && (
                              <span className={styles.voiceCountBadge}>
                                <Volume2 size={12} />
                                <span>
                                  {req.voiceMessages.length} voice note
                                  {req.voiceMessages.length > 1 ? 's' : ''}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>

                        <div className={styles.cardChevronWrapper}>
                          <ChevronRight size={18} className={styles.chevronIcon} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* =================================================================
              VIEW B: REQUEST DETAILS
              ================================================================= */}
          {selectedRequestId && selectedRequest && (
            <div className={styles.detailViewContainer}>
              {/* Status Banner */}
              <div className={styles.statusBannerRow}>
                <span className={styles.statusBannerLabel}>Request Status</span>
                {selectedRequest.status === 'PENDING' && (
                  <span className={styles.statusBadgePending}>
                    <Clock size={13} />
                    Pending Decision
                  </span>
                )}
                {selectedRequest.status === 'ACCEPTED' && (
                  <span className={styles.statusBadgeAccepted}>
                    <CheckCircle2 size={13} />
                    Accepted
                  </span>
                )}
                {selectedRequest.status === 'CANCELLED' && (
                  <span className={styles.statusBadgeCancelled}>
                    <AlertCircle size={13} />
                    Cancelled
                  </span>
                )}
              </div>

              {/* PRODUCT Section */}
              <div className={styles.detailProductCard}>
                <img
                  src={selectedRequest.productImage}
                  alt={selectedRequest.productName}
                  className={styles.detailProductThumb}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.png';
                  }}
                />
                <div className={styles.detailProductInfo}>
                  <span className={styles.detailProductSectionLabel}>Product</span>
                  <h3 className={styles.detailProductName}>{selectedRequest.productName}</h3>
                  <div className={styles.detailProductPriceRow}>
                    <span className={styles.detailPriceTag}>{selectedRequest.productPrice}</span>
                    <span className={styles.detailCategoryTag}>
                      {selectedRequest.productCategory}
                    </span>
                  </div>
                </div>
              </div>

              {/* REQUEST DETAILS Section */}
              <div className={styles.detailSpecsCard}>
                <h4 className={styles.detailSectionHeading}>Request Details</h4>
                <div className={styles.specsGrid}>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Requested by</span>
                    <strong className={styles.specValue}>{selectedRequest.customerName}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Requested on</span>
                    <strong className={styles.specValue}>{selectedRequest.requestedAt}</strong>
                  </div>
                  <div className={`${styles.specItem} ${styles.specLocation}`}>
                    <span className={styles.specLabel}>Customer Location</span>
                    <strong className={styles.specValue}>
                      <MapPin size={13} style={{ display: 'inline', marginRight: 4 }} />
                      {selectedRequest.customerArea}
                    </strong>
                  </div>
                  {selectedRequest.customerPhone && (
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Contact</span>
                      <strong className={styles.specValue}>
                        <Phone size={13} style={{ display: 'inline', marginRight: 4 }} />
                        {selectedRequest.customerPhone}
                      </strong>
                    </div>
                  )}
                  {selectedRequest.productCondition && (
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Condition</span>
                      <strong className={styles.specValue}>{selectedRequest.productCondition}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* VOICE MESSAGES Section */}
              <div className={styles.voiceSectionCard}>
                <div className={styles.voiceHeaderRow}>
                  <h4 className={styles.voiceTitle}>
                    <Volume2 size={16} className={styles.voiceTitleIcon} />
                    <span>Voice Messages</span>
                  </h4>
                  <span className={styles.voiceSubtitle}>
                    {selectedRequest.voiceMessages.length} message
                    {selectedRequest.voiceMessages.length === 1 ? '' : 's'}
                  </span>
                </div>

                {/* List of customer & merchant voice messages */}
                <div className={styles.voiceTrack}>
                  {selectedRequest.voiceMessages.length === 0 ? (
                    <p style={{ color: '#94a3b8', fontSize: '0.76rem', margin: 0 }}>
                      No voice messages recorded yet.
                    </p>
                  ) : (
                    selectedRequest.voiceMessages.map((vm) => {
                      const isPlaying = playingVoiceId === vm.id;
                      const isMerchant = vm.sender === 'merchant';
                      return (
                        <div
                          key={vm.id}
                          className={
                            isMerchant
                              ? styles.voiceBubbleMerchant
                              : styles.voiceBubbleCustomer
                          }
                        >
                          <button
                            type="button"
                            className={`${styles.voicePlayBtn} ${isPlaying ? styles.voicePlayBtnPlaying : ''}`}
                            onClick={() => handleTogglePlayVoice(vm)}
                            aria-label={isPlaying ? 'Pause voice message' : 'Play voice message'}
                          >
                            {isPlaying ? <Pause size={15} /> : <Play size={15} style={{ marginLeft: 2 }} />}
                          </button>

                          <div className={styles.voiceDetailsCol}>
                            <div className={styles.voiceSenderRow}>
                              <span
                                className={`${styles.voiceSender} ${isMerchant ? styles.voiceSenderMerchant : ''}`}
                              >
                                {isMerchant ? 'You (Merchant)' : `Customer (${vm.senderName})`}
                              </span>
                              <span className={styles.voiceTimestamp}>{vm.timestamp}</span>
                            </div>

                            <div className={styles.voiceWaveformRow}>
                              <div className={styles.voiceWaveformBars}>
                                {[4, 8, 12, 6, 14, 10, 5, 11, 7, 13, 9, 6].map((h, i) => (
                                  <div
                                    key={i}
                                    className={`${styles.waveBar} ${isPlaying ? styles.waveBarActive : ''}`}
                                    style={{
                                      height: isPlaying ? undefined : `${h}px`,
                                      animationDelay: `${i * 0.08}s`,
                                    }}
                                  />
                                ))}
                              </div>
                              <span className={styles.voiceDuration}>
                                {isPlaying
                                  ? `0:${playbackSeconds < 10 ? '0' : ''}${playbackSeconds}`
                                  : vm.durationFormatted}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* MERCHANT VOICE REPLY CONTROL (Voice Only — No typed chat!) */}
                <div className={styles.voiceReplyBox}>
                  <div className={styles.replyPromptRow}>
                    <span>Respond with Voice Message</span>
                    <span style={{ fontSize: '0.68rem', color: '#fbc21a' }}>Voice only</span>
                  </div>

                  {!isRecording && !recordedAudioUrl && (
                    <button
                      type="button"
                      className={styles.recordInitialBtn}
                      onClick={handleStartRecording}
                    >
                      <Mic size={16} />
                      <span>Record Voice Response</span>
                    </button>
                  )}

                  {isRecording && (
                    <div className={styles.recordingActiveRow}>
                      <div className={styles.recordingPulseGroup}>
                        <div className={styles.recDot} />
                        <span className={styles.recLabel}>Recording Voice Note...</span>
                        <span className={styles.recTimer}>
                          {Math.floor(recordingDuration / 60)}:
                          {recordingDuration % 60 < 10 ? '0' : ''}
                          {recordingDuration % 60}
                        </span>
                      </div>
                      <button
                        type="button"
                        className={styles.stopRecBtn}
                        onClick={handleStopRecording}
                      >
                        <Square size={14} />
                        <span>Stop</span>
                      </button>
                    </div>
                  )}

                  {!isRecording && recordedAudioUrl && (
                    <div className={styles.recordedPreviewRow}>
                      <button
                        type="button"
                        className={styles.previewPlayBtn}
                        onClick={handleTogglePreviewPlay}
                        aria-label={isPreviewPlaying ? 'Pause preview' : 'Play preview'}
                      >
                        {isPreviewPlaying ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: 1 }} />}
                      </button>

                      <div className={styles.previewInfo}>
                        Voice note recorded ({recordingDuration}s)
                      </div>

                      <div className={styles.previewActions}>
                        <button
                          type="button"
                          className={styles.discardBtn}
                          onClick={resetRecordingState}
                          title="Discard recording"
                        >
                          <Trash2 size={15} />
                        </button>

                        <button
                          type="button"
                          className={styles.sendVoiceBtn}
                          onClick={handleSendVoiceReply}
                        >
                          <Send size={14} />
                          <span>Send</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* MERCHANT DECISION AUTHORITY (Accept / Cancel) */}
              <div className={styles.decisionCard}>
                <h4 className={styles.decisionHeading}>Merchant Authority Decision</h4>

                {selectedRequest.status === 'PENDING' && (
                  <div className={styles.decisionActionsRow}>
                    <button
                      type="button"
                      className={styles.primaryAcceptBtn}
                      onClick={handleAccept}
                    >
                      <Check size={18} strokeWidth={2.6} />
                      <span>Accept Request</span>
                    </button>
                    <button
                      type="button"
                      className={styles.secondaryCancelBtn}
                      onClick={() => setShowCancelConfirm(true)}
                    >
                      <X size={16} />
                      <span>Cancel Request</span>
                    </button>
                  </div>
                )}

                {selectedRequest.status === 'ACCEPTED' && (
                  <div className={styles.acceptedBanner}>
                    <CheckCircle2 size={18} />
                    <span>✓ Request accepted by merchant. Item is reserved for buyer pickup.</span>
                  </div>
                )}

                {selectedRequest.status === 'CANCELLED' && (
                  <div className={styles.cancelledBanner}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <AlertCircle size={16} />
                      <span>✕ Request has been cancelled</span>
                    </div>
                    {selectedRequest.cancellationReason && (
                      <p className={styles.cancelledReasonText}>
                        Reason: {selectedRequest.cancellationReason}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CANCEL CONFIRMATION MODAL */}
      {showCancelConfirm && (
        <div className={styles.confirmOverlay} onClick={() => setShowCancelConfirm(false)}>
          <div className={styles.confirmCard} onClick={(e) => e.stopPropagation()}>
            <h4 className={styles.confirmTitle}>Cancel this request?</h4>
            <p className={styles.confirmDesc}>
              Are you sure you want to cancel this product request from{' '}
              <strong>{selectedRequest?.customerName}</strong>? The request will remain recorded
              in your request history as cancelled.
            </p>
            <div className={styles.confirmActionsRow}>
              <button
                type="button"
                className={styles.keepRequestBtn}
                onClick={() => setShowCancelConfirm(false)}
              >
                Keep Request
              </button>
              <button
                type="button"
                className={styles.confirmCancelBtn}
                onClick={handleConfirmCancel}
              >
                Cancel Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
