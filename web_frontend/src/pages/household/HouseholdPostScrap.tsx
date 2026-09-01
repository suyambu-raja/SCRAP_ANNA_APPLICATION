import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Clock,
  Image as ImageIcon,
  Video as VideoIcon,
  Camera,
  X,
  Plus,
  CheckCircle2,
  Package,
  Layers,
  ArrowRight,
  Maximize2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import styles from './HouseholdPostScrap.module.css';

interface UploadedMediaItem {
  id: string;
  type: 'photo' | 'video';
  title: string;
  imageUrl: string;
  isCustom?: boolean;
}

const INITIAL_UPLOADED_MEDIA: UploadedMediaItem[] = [
  {
    id: 'm-1',
    type: 'photo',
    title: 'Copper Wires & Armature Windings',
    imageUrl: '/scrap-copper-wire.jpg',
  },
  {
    id: 'm-2',
    type: 'photo',
    title: 'Steel Pipes & Construction Offcuts',
    imageUrl: '/scrap-iron.jpg',
  },
  {
    id: 'm-3',
    type: 'photo',
    title: 'Mixed Iron & Mild Steel Structures',
    imageUrl: '/scrap-low-quality-steel.jpg',
  },
  {
    id: 'm-4',
    type: 'video',
    title: 'Burned Copper Coils & Cables Video',
    imageUrl: '/scrap-burned-copper.jpg',
  },
  {
    id: 'm-5',
    type: 'photo',
    title: 'Electronic CPU & Circuit Boards',
    imageUrl: '/scrap-cpu.jpg',
  },
  {
    id: 'm-6',
    type: 'photo',
    title: 'Folded Corrugated Packaging Cartons',
    imageUrl: '/scrap-cardboard.jpg',
  },
];

export function HouseholdPostScrap() {
  const navigate = useNavigate();

  // File Inputs & Camera Refs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const cameraFallbackInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 10-Minute Cooldown State
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(() => {
    const stored = localStorage.getItem('scrap_household_cooldown');
    if (stored) {
      const diff = Math.floor((parseInt(stored, 10) - Date.now()) / 1000);
      return diff > 0 ? diff : 0;
    }
    return 0;
  });

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      const stored = localStorage.getItem('scrap_household_cooldown');
      if (stored) {
        const diff = Math.floor((parseInt(stored, 10) - Date.now()) / 1000);
        if (diff > 0) {
          setCooldownSeconds(diff);
        } else {
          setCooldownSeconds(0);
          localStorage.removeItem('scrap_household_cooldown');
        }
      } else {
        setCooldownSeconds(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Form states
  const [address, setAddress] = useState('No. 42, 2nd Avenue, Anna Nagar, Chennai - 600040');
  const [preferredDate, setPreferredDate] = useState('2025-05-16');
  const [preferredSlot, setPreferredSlot] = useState('Morning (09:00 AM - 12:00 PM)');
  const [notes, setNotes] = useState('');
  const [uploadedList, setUploadedList] = useState<UploadedMediaItem[]>(INITIAL_UPLOADED_MEDIA);

  // Modal / Detail Vision / Camera states
  const [selectedPhoto, setSelectedPhoto] = useState<UploadedMediaItem | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // --------------------------------------------------------------------------
  // WORKABLE FILE UPLOAD HANDLERS
  // --------------------------------------------------------------------------
  const handlePhotoUploadClick = () => {
    photoInputRef.current?.click();
  };

  const handleVideoUploadClick = () => {
    videoInputRef.current?.click();
  };

  const handlePhotoFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newMediaItems: UploadedMediaItem[] = [];
    Array.from(files).forEach((file, idx) => {
      const url = URL.createObjectURL(file);
      newMediaItems.push({
        id: `photo-${Date.now()}-${idx}`,
        type: 'photo',
        title: file.name.replace(/\.[^/.]+$/, '') || 'Uploaded Scrap Photo',
        imageUrl: url,
        isCustom: true,
      });
    });

    setUploadedList((prev) => [...newMediaItems, ...prev]);
    // Reset file input so user can re-upload same file if desired
    e.target.value = '';
  };

  const handleVideoFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newMediaItems: UploadedMediaItem[] = [];
    Array.from(files).forEach((file, idx) => {
      const url = URL.createObjectURL(file);
      newMediaItems.push({
        id: `video-${Date.now()}-${idx}`,
        type: 'video',
        title: file.name.replace(/\.[^/.]+$/, '') || 'Uploaded Scrap Video',
        imageUrl: url,
        isCustom: true,
      });
    });

    setUploadedList((prev) => [...newMediaItems, ...prev]);
    e.target.value = '';
  };

  // --------------------------------------------------------------------------
  // WORKABLE LIVE CAMERA HANDLERS
  // --------------------------------------------------------------------------
  const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
    setCameraError(null);
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('Webcam permission not granted or device not found:', err);
      setCameraError('Camera access unavailable. You can use the device camera file picker instead.');
    }
  };

  const openCameraModal = () => {
    setIsCameraModalOpen(true);
    startCamera(facingMode);
  };

  const closeCameraModal = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraModalOpen(false);
    setCameraError(null);
  };

  const toggleCameraFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const capturePhotoFromCamera = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    const capturedItem: UploadedMediaItem = {
      id: `camera-snap-${Date.now()}`,
      type: 'photo',
      title: `Camera Snapshot (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
      imageUrl: dataUrl,
      isCustom: true,
    };

    setUploadedList((prev) => [capturedItem, ...prev]);
    closeCameraModal();
  };

  const handleRemovePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldownSeconds > 0) return;

    // Set 10-minute cooldown (600 seconds)
    const cooldownExpiry = Date.now() + 10 * 60 * 1000;
    localStorage.setItem('scrap_household_cooldown', String(cooldownExpiry));
    setCooldownSeconds(600);
    setShowSuccessModal(true);
  };

  const handleResetCooldownDemo = () => {
    localStorage.removeItem('scrap_household_cooldown');
    setCooldownSeconds(0);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className={styles.pageContainer}>
      {/* Hidden File Inputs for Native Workable Uploads */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handlePhotoFilesSelected}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/mov,video/quicktime,video/webm,video/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleVideoFilesSelected}
      />
      <input
        ref={cameraFallbackInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handlePhotoFilesSelected}
      />

      {/* Hidden Canvas for Camera Frame Capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* 1. Header Section (Clean Frame, No Hero Illustration) */}
      <div className={styles.headerBlock}>
        <div className={styles.headerIconCircle}>
          <Package size={26} />
        </div>
        <div className={styles.headerTitles}>
          <h1 className={styles.mainTitle}>Schedule a New Pickup</h1>
          <p className={styles.mainSubtitle}>
            Fill in the details and we'll pick up your scrap from your location with verified digital weighing.
          </p>
        </div>
      </div>

      {/* 10-Minute Cooldown Alert Notification */}
      {cooldownSeconds > 0 && (
        <div
          style={{
            background: '#fffbeb',
            border: '1.5px solid #fde68a',
            borderRadius: '14px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Clock size={20} color="#b45309" />
            <div>
              <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#92400e', display: 'block' }}>
                10-Minute Order Cooldown Active ({formatTime(cooldownSeconds)} remaining)
              </span>
              <span style={{ fontSize: '0.76rem', color: '#b45309' }}>
                You recently placed an order. Please wait for the cooldown to complete so nearby merchants can review and accept it.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetCooldownDemo}
            style={{
              background: '#ffffff',
              border: '1px solid #f59e0b',
              color: '#d97706',
              fontSize: '0.74rem',
              fontWeight: 800,
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Reset Cooldown (Demo)
          </button>
        </div>
      )}

      {/* 2. Main Post Scrap Form Card */}
      <form onSubmit={handleSubmit} className={styles.formCard}>
        {/* Pickup Address & Preferred Date / Slot Row */}
        <div className={styles.formFieldsGrid}>
          {/* Address */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Pickup Address</label>
            <div className={styles.inputWithIcon}>
              <MapPin size={18} className={styles.inputIcon} />
              <input
                type="text"
                className={styles.textInput}
                placeholder="Enter your complete address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Preferred Date */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Preferred Date</label>
            <div className={styles.inputWithIcon}>
              <Calendar size={18} className={styles.inputIcon} />
              <input
                type="date"
                className={styles.textInput}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Preferred Time Slot */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Preferred Time Slot</label>
            <div className={styles.inputWithIcon}>
              <Clock size={18} className={styles.inputIcon} />
              <select
                className={styles.selectInput}
                value={preferredSlot}
                onChange={(e) => setPreferredSlot(e.target.value)}
              >
                <option>Morning (09:00 AM - 12:00 PM)</option>
                <option>Afternoon (01:00 PM - 04:00 PM)</option>
                <option>Evening (04:00 PM - 07:00 PM)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Upload Photos or Videos Section (WORKABLE BUTTONS) */}
        <div className={styles.uploadSection}>
          <div className={styles.uploadTitleRow}>
            <span>Upload Photos or Videos</span>
            <span className={styles.uploadSubtext}>(Add images or videos of your scrap items)</span>
          </div>

          <div className={styles.dropzoneGrid}>
            {/* Dropzone 1: Upload Photos */}
            <div
              className={styles.dropzoneCard}
              onClick={handlePhotoUploadClick}
              role="button"
              tabIndex={0}
              title="Click to browse and upload scrap photos from your device"
            >
              <div className={`${styles.dropIconWrap} ${styles.dropIconOrange}`}>
                <ImageIcon size={22} />
              </div>
              <h4 className={styles.dropTitle}>Upload Photos</h4>
              <p className={styles.dropSub}>PNG, JPG, JPEG (Max 5MB)</p>
            </div>

            {/* Dropzone 2: Upload Videos */}
            <div
              className={styles.dropzoneCard}
              onClick={handleVideoUploadClick}
              role="button"
              tabIndex={0}
              title="Click to browse and upload scrap videos from your device"
            >
              <div className={`${styles.dropIconWrap} ${styles.dropIconBlue}`}>
                <VideoIcon size={22} />
              </div>
              <h4 className={styles.dropTitle}>Upload Videos</h4>
              <p className={styles.dropSub}>MP4, MOV (Max 20MB)</p>
            </div>

            {/* Dropzone 3: Open Camera */}
            <div
              className={styles.dropzoneCard}
              onClick={openCameraModal}
              role="button"
              tabIndex={0}
              title="Click to open camera and take a live scrap photo"
            >
              <div className={`${styles.dropIconWrap} ${styles.dropIconGreen}`}>
                <Camera size={22} />
              </div>
              <h4 className={styles.dropTitle}>Open Camera</h4>
              <p className={styles.dropSub}>Take a photo</p>
            </div>
          </div>
        </div>

        {/* 4. Uploaded Items Grid */}
        <div className={styles.uploadedSection}>
          <h4 className={styles.uploadedHeader}>Uploaded ({uploadedList.length})</h4>

          <div className={styles.uploadedGrid}>
            {uploadedList.map((item) => (
              <div
                key={item.id}
                className={styles.uploadedCard}
                onClick={() => setSelectedPhoto(item)}
                title="Click to view detailed photo"
              >
                {item.type === 'video' ? (
                  <video
                    src={item.imageUrl}
                    className={styles.uploadedImg}
                    muted
                    preload="metadata"
                  />
                ) : (
                  <img src={item.imageUrl} alt={item.title} className={styles.uploadedImg} />
                )}

                {/* Remove button */}
                <button
                  type="button"
                  className={styles.removePhotoBtn}
                  onClick={(e) => handleRemovePhoto(item.id, e)}
                  title="Remove this item"
                >
                  <X size={13} />
                </button>

                {/* Media type tag */}
                <div className={styles.mediaTypeBadge}>
                  {item.type === 'photo' ? <ImageIcon size={11} /> : <VideoIcon size={11} />}
                  <span>{item.type === 'photo' ? 'Photo' : 'Video'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Note Section (Optional) */}
        <div className={styles.noteSection}>
          <label className={styles.fieldLabel}>Note (Optional)</label>
          <textarea
            className={styles.noteTextarea}
            placeholder="Any additional instructions? (e.g. scrap located on 2nd floor, elevator available, please bring digital weigh scale)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        {/* 6. Action Row */}
        <div className={styles.actionRow}>
          <button
            type="submit"
            className={styles.submitPostScrapBtn}
            disabled={cooldownSeconds > 0}
            style={
              cooldownSeconds > 0
                ? {
                    background: '#cbd5e1',
                    color: '#64748b',
                    cursor: 'not-allowed',
                    boxShadow: 'none',
                  }
                : {}
            }
          >
            <span>
              {cooldownSeconds > 0
                ? `Cooldown Active (${formatTime(cooldownSeconds)})`
                : 'Post Scrap'}
            </span>
          </button>
        </div>
      </form>

      {/* LIVE CAMERA VIEWFINDER MODAL */}
      {isCameraModalOpen && (
        <div className={styles.lightboxOverlay} onClick={closeCameraModal}>
          <div className={styles.cameraModalBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Camera size={20} color="#fbc21a" />
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                  Take Live Scrap Photo
                </h3>
              </div>
              <button
                type="button"
                onClick={closeCameraModal}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: '8px',
                  padding: '0.35rem',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Video Viewfinder */}
            <div className={styles.cameraViewfinderWrap}>
              {cameraError ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: '#cbd5e1' }}>
                  <p style={{ margin: '0 0 1rem', fontSize: '0.85rem' }}>{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => cameraFallbackInputRef.current?.click()}
                    style={{
                      background: '#fbc21a',
                      color: '#0f172a',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    Open Device Camera File Picker
                  </button>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={styles.cameraVideoFeed}
                />
              )}
            </div>

            {/* Camera Actions (Shutter & Flip) */}
            {!cameraError && (
              <div className={styles.cameraActionsRow}>
                <button
                  type="button"
                  className={styles.switchCamBtn}
                  onClick={toggleCameraFacingMode}
                  title="Switch Camera (Front / Back)"
                >
                  <RefreshCw size={20} />
                </button>

                <button
                  type="button"
                  className={styles.shutterBtn}
                  onClick={capturePhotoFromCamera}
                  title="Take Photo Snapshot"
                >
                  <Camera size={28} />
                </button>

                <div style={{ width: '44px' }} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* DETAIL VISION LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div className={styles.lightboxOverlay} onClick={() => setSelectedPhoto(null)}>
          <div className={styles.lightboxBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                {selectedPhoto.title}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: '8px',
                  padding: '0.35rem',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.lightboxStage}>
              {selectedPhoto.type === 'video' ? (
                <video
                  src={selectedPhoto.imageUrl}
                  controls
                  autoPlay
                  style={{ width: '100%', height: '100%', maxHeight: '420px', objectFit: 'contain' }}
                />
              ) : (
                <img src={selectedPhoto.imageUrl} alt={selectedPhoto.title} className={styles.lightboxImg} />
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                style={{
                  background: '#fbc21a',
                  color: '#0f172a',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION SUCCESS MODAL */}
      {showSuccessModal && (
        <div className={styles.modalOverlay} onClick={() => setShowSuccessModal(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <CheckCircle2 size={64} color="#10b981" />
            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>
              Scrap Requirement Posted!
            </h3>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b', lineHeight: 1.45 }}>
              Your scrap requirement has been successfully created with Reference ID:{' '}
              <strong style={{ color: '#0f172a' }}>SA123456</strong>. Verified executives will arrive at your address on{' '}
              <strong>{preferredDate}</strong> ({preferredSlot}).
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '0.5rem' }}>
              <Link
                to="/household"
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '0.65rem',
                  borderRadius: '8px',
                  border: '1.5px solid #e2e8f0',
                  color: '#334155',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/household/history"
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '0.65rem',
                  borderRadius: '8px',
                  background: '#0f172a',
                  color: '#fbc21a',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                }}
              >
                History →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HouseholdPostScrap;
