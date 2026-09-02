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
  ArrowRight,
  Maximize2,
  RefreshCw,
  Edit2,
  Check,
} from 'lucide-react';
import styles from './HouseholdPostScrap.module.css';

interface SavedAddress {
  id: string;
  tag: string;
  fullAddress: string;
  landmark: string;
  pincode: string;
  isDefault: boolean;
}

const DEFAULT_SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-1',
    tag: 'Home (Primary)',
    fullAddress: 'No. 42, 2nd Avenue, Anna Nagar East, Chennai, Tamil Nadu',
    landmark: 'Near Roundtana & Metro Station',
    pincode: '600040',
    isDefault: true,
  },
  {
    id: 'addr-2',
    tag: "Parent's House",
    fullAddress: 'Plot 18, 5th Cross Street, Shenoy Nagar, Chennai, Tamil Nadu',
    landmark: 'Opposite Shenoy Park',
    pincode: '600030',
    isDefault: false,
  },
];

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

  // --------------------------------------------------------------------------
  // 1. ADDRESS STATE (SAVED ADDRESSES + EDIT OPTION)
  // --------------------------------------------------------------------------
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(DEFAULT_SAVED_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('addr-1');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [customFullAddress, setCustomFullAddress] = useState('');
  const [customLandmark, setCustomLandmark] = useState('');
  const [customPincode, setCustomPincode] = useState('600040');

  const activeSavedAddress = savedAddresses.find((a) => a.id === selectedAddressId) || savedAddresses[0];

  // --------------------------------------------------------------------------
  // 2. PREFERRED DATE STATE (TODAY / TOMORROW / CUSTOM DATE)
  // --------------------------------------------------------------------------
  const [dateOption, setDateOption] = useState<'today' | 'tomorrow' | 'custom'>('today');
  const [customDateValue, setCustomDateValue] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [preferredSlot, setPreferredSlot] = useState('Morning (09:00 AM - 12:00 PM)');
  const [notes, setNotes] = useState('');

  // --------------------------------------------------------------------------
  // 3. MEDIA STATE (PHOTOS & VIDEOS & CAMERA)
  // --------------------------------------------------------------------------
  const [uploadedList, setUploadedList] = useState<UploadedMediaItem[]>(INITIAL_UPLOADED_MEDIA);
  const [selectedPhoto, setSelectedPhoto] = useState<UploadedMediaItem | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Address Save Handlers
  const handleStartEditAddress = () => {
    setCustomFullAddress(activeSavedAddress.fullAddress);
    setCustomLandmark(activeSavedAddress.landmark);
    setCustomPincode(activeSavedAddress.pincode);
    setIsEditingAddress(true);
  };

  const handleSaveEditedAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFullAddress.trim()) return;

    setSavedAddresses((prev) =>
      prev.map((addr) =>
        addr.id === selectedAddressId
          ? {
              ...addr,
              fullAddress: customFullAddress,
              landmark: customLandmark,
              pincode: customPincode,
            }
          : addr
      )
    );
    setIsEditingAddress(false);
  };

  // --------------------------------------------------------------------------
  // FILE UPLOAD HANDLERS
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
  };

  // --------------------------------------------------------------------------
  // LIVE CAMERA CAPTURE (WebRTC)
  // --------------------------------------------------------------------------
  const startCamera = async (mode: 'user' | 'environment') => {
    setCameraError(null);
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Direct webcam access failed. Using fallback:', err);
      setCameraError('Camera access not supported or denied. Please use the upload button.');
      cameraFallbackInputRef.current?.click();
    }
  };

  const handleOpenCameraModal = () => {
    setIsCameraModalOpen(true);
    startCamera(facingMode);
  };

  const handleCloseCameraModal = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraModalOpen(false);
  };

  const handleSwitchCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

      const capturedItem: UploadedMediaItem = {
        id: `camera-${Date.now()}`,
        type: 'photo',
        title: `Camera Snapshot ${new Date().toLocaleTimeString()}`,
        imageUrl: dataUrl,
        isCustom: true,
      };

      setUploadedList((prev) => [capturedItem, ...prev]);
      handleCloseCameraModal();
    }
  };

  const handleRemoveMedia = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldownSeconds > 0) return;

    const cooldownEndTime = Date.now() + 10 * 60 * 1000;
    localStorage.setItem('scrap_household_cooldown', cooldownEndTime.toString());
    setCooldownSeconds(600);

    setShowSuccessModal(true);
  };

  const formatCooldownTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getResolvedDateText = () => {
    if (dateOption === 'today') return 'Today';
    if (dateOption === 'tomorrow') return 'Tomorrow';
    return customDateValue;
  };

  return (
    <div className={styles.pageContainer}>
      {/* 1. Header Section */}
      <div className={styles.headerBlock}>
        <div className={styles.headerIconCircle}>
          <Package size={26} />
        </div>
        <div className={styles.headerTitles}>
          <h1 className={styles.mainTitle}>Post Scrap For Doorstep Pickup</h1>
          <p className={styles.mainSubtitle}>
            Schedule doorstep pickup with verified digital weighing. Upload photos/videos so nearby scrap executives can verify and dispatch vehicles.
          </p>
        </div>
      </div>

      {/* Hidden File Inputs for Working File/Video/Camera Selectors */}
      <input
        type="file"
        ref={photoInputRef}
        onChange={handlePhotoFilesSelected}
        multiple
        accept="image/*"
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={videoInputRef}
        onChange={handleVideoFilesSelected}
        multiple
        accept="video/*"
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={cameraFallbackInputRef}
        onChange={handlePhotoFilesSelected}
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
      />

      {/* 2. Main Form Card */}
      <form onSubmit={handleSubmit} className={styles.formCard}>
        {/* Section 1: Pickup Location & Slot */}
        <div className={styles.sectionHeadingGroup}>
          <h2 className={styles.sectionHeading}>1. Doorstep Pickup Details</h2>
          <p className={styles.sectionSubheading}>
            Select your saved doorstep address in Chennai, preferred pickup date, and convenient time slot.
          </p>
        </div>

        {/* 1A. Saved Address Selection with Edit Option */}
        <div className={styles.addressSectionBox}>
          <div className={styles.addressSectionHeader}>
            <label className={styles.fieldLabel}>
              <MapPin size={16} color="#d97706" />
              <span>Doorstep Pickup Address</span>
            </label>

            {!isEditingAddress && (
              <button
                type="button"
                className={styles.editAddressBtn}
                onClick={handleStartEditAddress}
              >
                <Edit2 size={13} />
                <span>Edit / Change Address</span>
              </button>
            )}
          </div>

          {!isEditingAddress ? (
            /* Saved Address Cards */
            <div className={styles.savedAddressesGrid}>
              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`${styles.savedAddressCard} ${
                    selectedAddressId === addr.id ? styles.savedAddressActive : ''
                  }`}
                  onClick={() => setSelectedAddressId(addr.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className={styles.addressCardTop}>
                    <div className={styles.addressRadioCircle}>
                      {selectedAddressId === addr.id && <div className={styles.radioDot} />}
                    </div>
                    <span className={styles.addressTagBadge}>{addr.tag}</span>
                    {addr.isDefault && (
                      <span className={styles.defaultTagBadge}>Default</span>
                    )}
                  </div>

                  <p className={styles.addressFullText}>{addr.fullAddress}</p>
                  <span className={styles.addressMetaText}>
                    Landmark: {addr.landmark} • PIN: {addr.pincode}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            /* Edit Address Form */
            <div className={styles.editAddressFormWrap}>
              <div className={styles.formGroup}>
                <label className={styles.subFieldLabel}>Full Address / Street / Door No.</label>
                <input
                  type="text"
                  className={styles.inputField}
                  value={customFullAddress}
                  onChange={(e) => setCustomFullAddress(e.target.value)}
                  placeholder="Enter house no, street name, area..."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.subFieldLabel}>Landmark</label>
                <input
                  type="text"
                  className={styles.inputField}
                  value={customLandmark}
                  onChange={(e) => setCustomLandmark(e.target.value)}
                  placeholder="Nearby metro, temple, school..."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.subFieldLabel}>PIN Code</label>
                <input
                  type="text"
                  className={styles.inputField}
                  value={customPincode}
                  onChange={(e) => setCustomPincode(e.target.value)}
                  placeholder="e.g. 600040"
                  required
                />
              </div>

              <div className={styles.editAddressActions}>
                <button
                  type="button"
                  className={styles.cancelEditBtn}
                  onClick={() => setIsEditingAddress(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.saveEditBtn}
                  onClick={handleSaveEditedAddress}
                >
                  <Check size={14} />
                  <span>Update Address</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 1B. Preferred Date (Today, Tomorrow, Custom Date) & Time Slot */}
        <div className={styles.dateTimeGrid}>
          {/* Preferred Date Pill Selector */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              <Calendar size={15} color="#d97706" />
              <span>Preferred Pickup Date</span>
            </label>

            <div className={styles.datePillsRow}>
              <button
                type="button"
                className={`${styles.datePillBtn} ${
                  dateOption === 'today' ? styles.datePillActive : ''
                }`}
                onClick={() => setDateOption('today')}
              >
                Today
              </button>

              <button
                type="button"
                className={`${styles.datePillBtn} ${
                  dateOption === 'tomorrow' ? styles.datePillActive : ''
                }`}
                onClick={() => setDateOption('tomorrow')}
              >
                Tomorrow
              </button>

              <button
                type="button"
                className={`${styles.datePillBtn} ${
                  dateOption === 'custom' ? styles.datePillActive : ''
                }`}
                onClick={() => setDateOption('custom')}
              >
                Custom Date
              </button>
            </div>

            {/* If Custom Date is selected, show date picker */}
            {dateOption === 'custom' && (
              <div style={{ marginTop: '0.45rem' }}>
                <input
                  type="date"
                  className={styles.inputField}
                  value={customDateValue}
                  onChange={(e) => setCustomDateValue(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            )}
          </div>

          {/* Preferred Time Slot */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              <Clock size={15} color="#d97706" />
              <span>Preferred Time Slot</span>
            </label>
            <select
              className={styles.selectField}
              value={preferredSlot}
              onChange={(e) => setPreferredSlot(e.target.value)}
            >
              <option value="Morning (09:00 AM - 12:00 PM)">
                Morning (09:00 AM - 12:00 PM)
              </option>
              <option value="Afternoon (12:00 PM - 04:00 PM)">
                Afternoon (12:00 PM - 04:00 PM)
              </option>
              <option value="Evening (04:00 PM - 07:00 PM)">
                Evening (04:00 PM - 07:00 PM)
              </option>
            </select>
          </div>
        </div>

        {/* Section 2: Upload Scrap Photos & Videos (Older Format) */}
        <div className={styles.sectionHeadingGroup} style={{ marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 className={styles.sectionHeading}>2. Scrap Photos &amp; Videos</h2>
            <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 800 }}>
              ✓ {uploadedList.length} Media Uploaded
            </span>
          </div>
          <p className={styles.sectionSubheading}>
            Upload scrap images, record videos, or capture live photos with your camera. Click any thumbnail for high resolution Detail Vision.
          </p>
        </div>

        {/* Action Upload Buttons Toolbar (Older Format) */}
        <div className={styles.uploadActionToolbar}>
          <button
            type="button"
            className={styles.uploadButtonPhoto}
            onClick={handlePhotoUploadClick}
          >
            <ImageIcon size={17} />
            <span>Upload Photos</span>
          </button>

          <button
            type="button"
            className={styles.uploadButtonVideo}
            onClick={handleVideoUploadClick}
          >
            <VideoIcon size={17} />
            <span>Upload Videos</span>
          </button>

          <button
            type="button"
            className={styles.uploadButtonCamera}
            onClick={handleOpenCameraModal}
          >
            <Camera size={17} />
            <span>Open Camera</span>
          </button>
        </div>

        {/* Media Grid / Detail Vision Gallery (Older Format) */}
        <div className={styles.uploadedMediaGrid}>
          {uploadedList.map((item) => (
            <div
              key={item.id}
              className={styles.mediaCard}
              onClick={() => setSelectedPhoto(item)}
              role="button"
              tabIndex={0}
              title="Click to open Detail Vision"
            >
              <div className={styles.mediaThumbContainer}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className={styles.mediaThumbnail}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/household-scrap-bundle.jpg';
                  }}
                />

                <div className={styles.mediaTypeBadge}>
                  {item.type === 'video' ? <VideoIcon size={13} /> : <ImageIcon size={13} />}
                  <span>{item.type === 'video' ? 'VIDEO' : 'PHOTO'}</span>
                </div>

                <div className={styles.detailVisionHint}>
                  <Maximize2 size={15} />
                </div>

                <button
                  type="button"
                  className={styles.removeMediaBtn}
                  onClick={(e) => handleRemoveMedia(item.id, e)}
                  title="Remove media"
                >
                  <X size={14} />
                </button>
              </div>

              <div className={styles.mediaMeta}>
                <span className={styles.mediaTitle}>{item.title}</span>
                <span className={styles.mediaSubtext}>Click to view high-res photo</span>
              </div>
            </div>
          ))}
        </div>

        {/* Section 3: Additional Notes */}
        <div className={styles.fieldGroupFull}>
          <label className={styles.fieldLabel}>
            <span>Additional Scrap Description (Optional)</span>
          </label>
          <textarea
            className={styles.textareaField}
            rows={3}
            placeholder="e.g. 2 bundles of copper wire, old aluminium vessels, newspapers in tied stacks, AC compressor in backyard..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Cooldown Warning Notice */}
        {cooldownSeconds > 0 && (
          <div className={styles.cooldownAlertBox}>
            <Clock size={18} />
            <div className={styles.cooldownTextWrap}>
              <strong>Request Cooldown Active ({formatCooldownTime(cooldownSeconds)} remaining)</strong>
              <span>
                To ensure quality pickup scheduling, please wait before submitting another doorstep request.
              </span>
            </div>
          </div>
        )}

        {/* Submit Action Bar */}
        <div className={styles.formFooterActions}>
          <button
            type="submit"
            className={styles.submitPostBtn}
            disabled={cooldownSeconds > 0 || uploadedList.length === 0}
          >
            {cooldownSeconds > 0 ? (
              <span>Cooldown Active ({formatCooldownTime(cooldownSeconds)})</span>
            ) : (
              <>
                <span>Post Scrap for Pickup</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* DETAIL VISION LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div className={styles.lightboxOverlay} onClick={() => setSelectedPhoto(null)}>
          <div className={styles.lightboxBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.lightboxHeader}>
              <div>
                <h3 className={styles.lightboxTitle}>{selectedPhoto.title}</h3>
                <span className={styles.lightboxSubtitle}>
                  Verified scrap photo for doorstep vehicle dispatch & weighing
                </span>
              </div>
              <button
                type="button"
                className={styles.lightboxCloseBtn}
                onClick={() => setSelectedPhoto(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.lightboxImageStage}>
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className={styles.lightboxMainImg}
              />
            </div>
          </div>
        </div>
      )}

      {/* LIVE CAMERA CAPTURE MODAL */}
      {isCameraModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseCameraModal}>
          <div className={styles.cameraModalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.cameraHeader}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>
                Capture Scrap Photo
              </h3>
              <button
                type="button"
                className={styles.lightboxCloseBtn}
                onClick={handleCloseCameraModal}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.cameraViewport}>
              {cameraError ? (
                <div style={{ color: '#ef4444', textAlign: 'center', padding: '2rem 1rem' }}>
                  {cameraError}
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={styles.cameraVideo}
                />
              )}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

            <div className={styles.cameraControls}>
              <button
                type="button"
                className={styles.switchCamBtn}
                onClick={handleSwitchCamera}
                title="Switch front/back camera"
              >
                <RefreshCw size={18} />
                <span>Switch Camera</span>
              </button>

              <button
                type="button"
                className={styles.captureSnapBtn}
                onClick={handleCaptureSnapshot}
              >
                <Camera size={20} />
                <span>Take Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBMIT SUCCESS MODAL */}
      {showSuccessModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.successModalContent}>
            <div className={styles.successIconBox}>
              <CheckCircle2 size={48} color="#10b981" />
            </div>

            <h3 className={styles.successModalTitle}>Scrap Posted Successfully!</h3>
            <p className={styles.successModalText}>
              Your doorstep scrap pickup request has been dispatched to nearby verified scrap executives in Anna Nagar, Chennai.
            </p>

            <div className={styles.successDetailsBox}>
              <div className={styles.successDetailRow}>
                <span>Pickup Address:</span>
                <strong>{activeSavedAddress.fullAddress} ({activeSavedAddress.tag})</strong>
              </div>
              <div className={styles.successDetailRow}>
                <span>Scheduled Time:</span>
                <strong>{getResolvedDateText()} • {preferredSlot}</strong>
              </div>
              <div className={styles.successDetailRow}>
                <span>Scrap Photos:</span>
                <strong>{uploadedList.length} Items Attached</strong>
              </div>
              <div className={styles.successDetailRow}>
                <span>Digital Weighing:</span>
                <strong style={{ color: '#059669' }}>Guaranteed 100% Calibrated Scale</strong>
              </div>
            </div>

            <div className={styles.successModalActions}>
              <Link to="/household/orders" className={styles.trackOrdersBtn}>
                <span>Track in Orders</span>
                <ArrowRight size={16} />
              </Link>
              <button
                type="button"
                className={styles.closeSuccessBtn}
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/household/orders');
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HouseholdPostScrap;
