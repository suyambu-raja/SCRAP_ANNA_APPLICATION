import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Upload,
  Camera,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Info,
  AlertTriangle,
  Scissors,
  HelpCircle,
  ArrowRight,
  ChevronRight,
  Layers,
  Copy,
  Check,
  Eye,
  X,
  FileText,
  RotateCcw,
  Building,
  CheckCheck,
} from 'lucide-react';
import styles from './IndustryPostRequirement.module.css';

interface ScrapItemForm {
  id: string;
  scrapType: string;
  quantity: string;
  unit: 'KG' | 'Tons' | 'Units / Pieces';
  condition: string;
  description: string;
  photos: string[];
}

const CONDITION_OPTIONS = [
  'Clean & Sorted',
  'Mixed / Unsorted',
  'Heavy / Dense Melting',
  'Rusted / Weathered',
  'Dismantled Equipment',
];

const INITIAL_ITEM: ScrapItemForm = {
  id: 'item-1',
  scrapType: '',
  quantity: '',
  unit: 'KG',
  condition: 'Clean & Sorted',
  description: '',
  photos: [],
};

const QUICK_NOTES = [
  { id: 'cutting', text: 'Machine / gas cutting required', icon: Scissors },
  { id: 'condition', text: 'Material condition uncertain', icon: HelpCircle },
  { id: 'dismantling', text: 'Heavy dismantling needed', icon: Layers },
  { id: 'yard', text: 'Stored in factory yard', icon: Building },
];

export default function IndustryPostRequirement() {
  const navigate = useNavigate();

  // Multi-item list
  const [items, setItems] = useState<ScrapItemForm[]>([INITIAL_ITEM]);

  // Shared Truck Visit Details
  const [pickupAddress, setPickupAddress] = useState(
    'Sri Venkatesh Industries, 24, 5th Main Road, SIDCO Industrial Estate, Guindy, Chennai – 600032'
  );
  const [factoryGate, setFactoryGate] = useState('Gate 2 (Loading Bay Access)');
  const [pickupDate, setPickupDate] = useState('2025-05-16');
  const [timeSlot, setTimeSlot] = useState('10:00 AM – 12:00 PM');
  const [contactName, setContactName] = useState('Karthik Raja');
  const [contactPhone, setContactPhone] = useState('+91 98401 55678');
  const [department, setDepartment] = useState('Stores & Logistics Dept');

  // Submission & Preview state
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Camera capture modal state
  const [activeCameraItemId, setActiveCameraItemId] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Clean up camera stream on modal close
  useEffect(() => {
    if (!activeCameraItemId && cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
      setCapturedPhoto(null);
      setCameraError(null);
    }
  }, [activeCameraItemId, cameraStream]);

  // Handlers for dynamic scrap items
  const handleAddItem = () => {
    const newItem: ScrapItemForm = {
      id: `item-${Date.now()}`,
      scrapType: '',
      quantity: '',
      unit: 'KG',
      condition: 'Clean & Sorted',
      description: '',
      photos: [],
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof ScrapItemForm, value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleToggleQuickNote = (itemId: string, noteText: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const current = (item.description || '').trim();
          if (current.includes(noteText)) {
            let updated = current
              .replace(noteText, '')
              .replace(/\.\s*\./g, '.')
              .replace(/\s+/g, ' ')
              .trim();
            if (updated.startsWith('.')) updated = updated.slice(1).trim();
            if (updated.endsWith('.')) updated = updated.slice(0, -1).trim();
            return { ...item, description: updated };
          } else {
            const updated = current ? `${current}. ${noteText}` : noteText;
            return { ...item, description: updated };
          }
        }
        return item;
      })
    );
  };

  // Real file upload handler
  const handleFilesSelected = (itemId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setItems((prev) =>
            prev.map((item) => {
              if (item.id === itemId) {
                if (item.photos.length >= 5) return item;
                return { ...item, photos: [...item.photos, e.target!.result as string].slice(0, 5) };
              }
              return item;
            })
          );
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Drag & drop handlers
  const handleDrop = (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(itemId, e.dataTransfer.files);
    }
  };

  // Start live webcam stream
  const handleStartCamera = async (itemId: string) => {
    setActiveCameraItemId(itemId);
    setCapturedPhoto(null);
    setCameraError(null);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        setCameraError('Camera API not supported in this browser. Please use file upload.');
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Camera permission denied or camera device unavailable. You can upload an image file instead.');
    }
  };

  // Capture photo from video stream
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
      setCapturedPhoto(dataUrl);
    }
  };

  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
  };

  const handleSaveCapturedPhoto = () => {
    if (!capturedPhoto || !activeCameraItemId) return;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === activeCameraItemId) {
          return { ...item, photos: [...item.photos, capturedPhoto].slice(0, 5) };
        }
        return item;
      })
    );
    setActiveCameraItemId(null);
  };

  const handleSetCoverPhoto = (itemId: string, photoIndex: number) => {
    if (photoIndex === 0) return;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const updated = [...item.photos];
          const [selected] = updated.splice(photoIndex, 1);
          updated.unshift(selected);
          return { ...item, photos: updated };
        }
        return item;
      })
    );
  };

  const handleRemovePhoto = (itemId: string, photoIndex: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const updated = [...item.photos];
          updated.splice(photoIndex, 1);
          return { ...item, photos: updated };
        }
        return item;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reqId = `REQ-${new Date().getFullYear().toString().slice(2)}0513-00078`;
    setSubmittedRequestId(reqId);
  };

  const handleCopyId = () => {
    if (submittedRequestId) {
      navigator.clipboard.writeText(submittedRequestId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* 1. Page Header */}
      <div className={styles.pageHeaderSection}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.eyebrowBadge}>
            <Sparkles size={13} className={styles.sparkleIcon} />
            <span>ENTERPRISE B2B SCRAP LISTING</span>
          </div>
          <h1 className={styles.pageMainTitle}>Create Pickup Request</h1>
          <p className={styles.pageSubtitle}>
            Schedule one truck visit for multiple scrap materials and receive competitive merchant quotes.
          </p>
        </div>

        <Link to="/industry/requests" className={styles.secondaryViewBtn}>
          <span>View Posted Requests</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* 2. Important Guidelines for Accurate Merchant Quotes */}
      <div className={styles.guidelinesBanner}>
        <div className={styles.guidelinesHeader}>
          <div className={styles.guidelinesTitleRow}>
            <AlertTriangle size={16} className={styles.guidelinesIconYellow} />
            <h3 className={styles.guidelinesHeading}>IMPORTANT GUIDELINES FOR ACCURATE MERCHANT QUOTES</h3>
          </div>
          <span className={styles.guidelinesTagline}>Avoid price variations during pickup inspection.</span>
        </div>

        <div className={styles.guidelinesGrid}>
          <div className={styles.guidelineCard}>
            <div className={styles.guidelineNumberCircle}>1</div>
            <div className={styles.guidelineContent}>
              <strong className={styles.guidelineTitle}>Material Condition Selection</strong>
              <p className={styles.guidelineText}>
                Price will vary if there is a mistake in material condition selection.
              </p>
            </div>
          </div>

          <div className={styles.guidelineCard}>
            <div className={styles.guidelineNumberCircle}>2</div>
            <div className={styles.guidelineContent}>
              <strong className={styles.guidelineTitle}>Machine / Gas Cutting Cost</strong>
              <p className={styles.guidelineText}>
                If scrap structures need cutting, mention it clearly.
              </p>
            </div>
          </div>

          <div className={styles.guidelineCard}>
            <div className={styles.guidelineNumberCircle}>3</div>
            <div className={styles.guidelineContent}>
              <strong className={styles.guidelineTitle}>Disclose in Description</strong>
              <p className={styles.guidelineText}>
                Mention special handling, cutting or uncertain conditions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Form (70% Left Form + 30% Right Sticky Summary) */}
      <form onSubmit={handleSubmit} className={styles.formSplitLayout}>
        {/* LEFT COLUMN: Numbered Workflow Sections */}
        <div className={styles.formLeftCol}>
          {/* ==============================================================
              SECTION 1: Scrap Materials in this Truck Visit
              ============================================================== */}
          <section className={styles.sectionCard}>
            <div className={styles.sectionHeaderRow}>
              <div className={styles.sectionTitleBlock}>
                <div className={styles.sectionYellowNumberCircle}>1</div>
                <div>
                  <h2 className={styles.sectionMainTitle}>Scrap Materials in this Truck Visit</h2>
                  <p className={styles.sectionSubtitle}>
                    Add all scrap categories to be collected in this single pickup visit.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className={styles.primaryAddScrapItemBtn}
                onClick={handleAddItem}
              >
                <Plus size={15} />
                <span>+ Add Scrap Item</span>
              </button>
            </div>

            <div className={styles.itemsListContainer}>
              {items.map((item, index) => (
                <div key={item.id} className={styles.materialItemCard}>
                  {/* Material Item Header */}
                  <div className={styles.materialItemHeader}>
                    <div className={styles.materialItemTitleRow}>
                      <span className={styles.itemIndexGraphiteBadge}>ITEM #{index + 1}</span>
                      <strong className={styles.itemHeadingName}>
                        {item.scrapType || 'Untitled Scrap Item'}
                      </strong>
                    </div>

                    {items.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeItemTextBtn}
                        onClick={() => handleRemoveItem(item.id)}
                        title="Remove this scrap item"
                      >
                        <Trash2 size={14} />
                        <span>Remove Item</span>
                      </button>
                    )}
                  </div>

                  {/* Material Fields Grid */}
                  <div className={styles.materialFieldsGrid}>
                    {/* Scrap Material Name (Full Width Text Input) */}
                    <div className={styles.inputGroupFull}>
                      <label className={styles.fieldLabel}>
                        Scrap Material Name <span className={styles.reqStar}>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter scrap material name (e.g. Heavy Steel Turnings, Copper Cable, HDPE Drums)"
                        value={item.scrapType}
                        onChange={(e) => handleItemChange(item.id, 'scrapType', e.target.value)}
                        className={styles.formTextInput}
                        required
                      />
                    </div>

                    {/* Estimated Quantity + Unit (Left Column) */}
                    <div className={styles.inputGroupHalf}>
                      <label className={styles.fieldLabel}>
                        Estimated Quantity <span className={styles.reqStar}>*</span>
                      </label>
                      <div className={styles.qtyUnitRow}>
                        <input
                          type="number"
                          min="1"
                          placeholder="Enter quantity"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                          className={styles.qtyInput}
                          required
                        />
                        <select
                          value={item.unit}
                          onChange={(e) => handleItemChange(item.id, 'unit', e.target.value as any)}
                          className={styles.unitSelect}
                        >
                          <option value="KG">KG</option>
                          <option value="Tons">Tons</option>
                          <option value="Units / Pieces">Units / Pieces</option>
                        </select>
                      </div>
                    </div>

                    {/* Material Condition (Right Column) */}
                    <div className={styles.inputGroupHalf}>
                      <div className={styles.conditionLabelHeader}>
                        <label className={styles.fieldLabel}>
                          Material Condition <span className={styles.reqStar}>*</span>
                        </label>
                        <span className={styles.conditionHelperNote}>
                          Price may vary if condition is inaccurate
                        </span>
                      </div>
                      <select
                        value={item.condition}
                        onChange={(e) => handleItemChange(item.id, 'condition', e.target.value)}
                        className={styles.formSelectInput}
                      >
                        {CONDITION_OPTIONS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Material Details & Specifications (Full Width Textarea) */}
                    <div className={styles.inputGroupFull}>
                      <div className={styles.descLabelHeader}>
                        <label className={styles.fieldLabel}>
                          Material Details &amp; Specifications (Optional)
                        </label>
                        <span className={styles.descSubNote}>
                          Mention special handling, cutting or uncertain conditions
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Enter scrap material specifications, storage location, or special handling notes"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        className={styles.formTextarea}
                      />

                      {/* Quick Add Notes Chips */}
                      <div className={styles.quickChipsTrack}>
                        <span className={styles.quickChipsLabel}>Quick Add Notes:</span>
                        <div className={styles.chipsWrapper}>
                          {QUICK_NOTES.map((chip) => {
                            const isSelected = item.description?.includes(chip.text);
                            const ChipIcon = chip.icon;
                            return (
                              <button
                                key={chip.id}
                                type="button"
                                className={`${styles.quickChip} ${
                                  isSelected ? styles.quickChipSelected : ''
                                }`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleToggleQuickNote(item.id, chip.text);
                                }}
                              >
                                <ChipIcon size={12} />
                                <span>{isSelected ? `✓ ${chip.text}` : `+ ${chip.text}`}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Scrap Photo Upload Section */}
                    <div className={styles.inputGroupFull}>
                      <div className={styles.photoHeaderRow}>
                        <label className={styles.fieldLabel}>
                          Scrap Photos ({item.photos.length}/5)
                        </label>
                        <span className={styles.photoHelperNote}>
                          Add clear photos of your scrap to help merchants provide accurate offers.
                        </span>
                      </div>

                      {/* Hidden File Input */}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={(el) => {
                          fileInputRefs.current[item.id] = el;
                        }}
                        style={{ display: 'none' }}
                        onChange={(e) => handleFilesSelected(item.id, e.target.files)}
                      />

                      {/* Upload Dropzone */}
                      <div
                        className={styles.uploadDropzone}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, item.id)}
                      >
                        {item.photos.length > 0 && (
                          <div className={styles.thumbnailsList}>
                            {item.photos.map((photo, pIdx) => (
                              <div key={pIdx} className={styles.photoThumbWrap}>
                                <img
                                  src={photo}
                                  alt={`Scrap photo ${pIdx + 1}`}
                                  className={styles.photoThumbImg}
                                  onClick={() => setPreviewImage(photo)}
                                />
                                {pIdx === 0 ? (
                                  <span className={styles.coverBadge}>Cover</span>
                                ) : (
                                  <button
                                    type="button"
                                    className={styles.setCoverBtn}
                                    onClick={() => handleSetCoverPhoto(item.id, pIdx)}
                                    title="Set as cover photo"
                                  >
                                    Set Cover
                                  </button>
                                )}
                                <button
                                  type="button"
                                  className={styles.removePhotoBtn}
                                  onClick={() => handleRemovePhoto(item.id, pIdx)}
                                  title="Delete photo"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {item.photos.length < 5 && (
                          <div className={styles.uploadActionsRow}>
                            <button
                              type="button"
                              className={styles.uploadActionSecondaryBtn}
                              onClick={() => fileInputRefs.current[item.id]?.click()}
                            >
                              <Upload size={15} />
                              <span>Upload from Device</span>
                            </button>

                            <button
                              type="button"
                              className={styles.uploadActionSecondaryBtn}
                              onClick={() => handleStartCamera(item.id)}
                            >
                              <Camera size={15} />
                              <span>Use Camera</span>
                            </button>

                            <span className={styles.orDropText}>or drag &amp; drop photos here</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Another Material Button */}
            <button
              type="button"
              className={styles.addAnotherItemDashedBtn}
              onClick={handleAddItem}
            >
              <Plus size={18} className={styles.yellowPlusIcon} />
              <span>+ Add Another Scrap Material to this Truck Visit</span>
            </button>
          </section>

          {/* ==============================================================
              SECTION 2: Factory Pickup Location
              ============================================================== */}
          <section className={styles.sectionCard}>
            <div className={styles.sectionTitleBlock}>
              <div className={styles.sectionYellowNumberCircle}>2</div>
              <div>
                <h2 className={styles.sectionMainTitle}>Factory Pickup Location</h2>
                <p className={styles.sectionSubtitle}>
                  Single location where the truck will arrive for weighing and scrap loading.
                </p>
              </div>
            </div>

            <div className={styles.sectionFieldsGrid}>
              <div className={styles.inputGroupFull}>
                <label className={styles.fieldLabel}>
                  Factory / Facility Address <span className={styles.reqStar}>*</span>
                </label>
                <div className={styles.inputWithLeftIcon}>
                  <MapPin size={16} className={styles.leftInputIcon} />
                  <input
                    type="text"
                    placeholder="Enter complete factory address, street name, and industrial estate"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className={styles.formInputPadded}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroupHalf}>
                <label className={styles.fieldLabel}>
                  Factory Gate / Entry Gate <span className={styles.reqStar}>*</span>
                </label>
                <select
                  value={factoryGate}
                  onChange={(e) => setFactoryGate(e.target.value)}
                  className={styles.formSelectInput}
                >
                  <option value="Gate 2 (Loading Bay Access)">Gate 2 (Loading Bay Access)</option>
                  <option value="Main Gate 1 (Heavy Vehicles)">Main Gate 1 (Heavy Vehicles)</option>
                  <option value="Rear Logistics Yard (Loading Dock B)">Rear Logistics Yard (Loading Dock B)</option>
                </select>
              </div>

              <div className={styles.inputGroupHalf}>
                <label className={styles.fieldLabel}>Measurement Facility</label>
                <div className={styles.weighbridgeSuccessTag}>
                  <CheckCircle2 size={16} className={styles.checkGreenIcon} />
                  <span>✓ On-Site Measurement Facility Available</span>
                </div>
              </div>
            </div>
          </section>

          {/* ==============================================================
              SECTION 3: Preferred Pickup Schedule
              ============================================================== */}
          <section className={styles.sectionCard}>
            <div className={styles.sectionTitleBlock}>
              <div className={styles.sectionYellowNumberCircle}>3</div>
              <div>
                <h2 className={styles.sectionMainTitle}>Preferred Pickup Schedule</h2>
                <p className={styles.sectionSubtitle}>
                  Select when you want the merchant truck to arrive at your factory yard.
                </p>
              </div>
            </div>

            <div className={styles.sectionFieldsGrid}>
              <div className={styles.inputGroupHalf}>
                <label className={styles.fieldLabel}>
                  Preferred Pickup Date <span className={styles.reqStar}>*</span>
                </label>
                <div className={styles.inputWithLeftIcon}>
                  <Calendar size={16} className={styles.leftInputIcon} />
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className={styles.formInputPadded}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroupHalf}>
                <label className={styles.fieldLabel}>
                  Preferred Time Window <span className={styles.reqStar}>*</span>
                </label>
                <div className={styles.inputWithLeftIcon}>
                  <Clock size={16} className={styles.leftInputIcon} />
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className={styles.formSelectInputPadded}
                  >
                    <option value="08:00 AM – 10:00 AM">Morning (08:00 AM – 10:00 AM)</option>
                    <option value="10:00 AM – 12:00 PM">Mid-Day (10:00 AM – 12:00 PM)</option>
                    <option value="01:00 PM – 03:00 PM">Afternoon (01:00 PM – 03:00 PM)</option>
                    <option value="03:00 PM – 06:00 PM">Evening (03:00 PM – 06:00 PM)</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* ==============================================================
              SECTION 4: Factory Contact Person
              ============================================================== */}
          <section className={styles.sectionCard}>
            <div className={styles.sectionTitleBlock}>
              <div className={styles.sectionYellowNumberCircle}>4</div>
              <div>
                <h2 className={styles.sectionMainTitle}>Factory Contact Person</h2>
                <p className={styles.sectionSubtitle}>
                  Driver and merchant will coordinate with this person on pickup day.
                </p>
              </div>
            </div>

            <div className={styles.sectionFieldsGrid}>
              <div className={styles.inputGroupHalf}>
                <label className={styles.fieldLabel}>
                  Full Name <span className={styles.reqStar}>*</span>
                </label>
                <div className={styles.inputWithLeftIcon}>
                  <User size={16} className={styles.leftInputIcon} />
                  <input
                    type="text"
                    placeholder="e.g. Karthik Raja (Plant In-Charge)"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className={styles.formInputPadded}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroupHalf}>
                <label className={styles.fieldLabel}>
                  Mobile Number <span className={styles.reqStar}>*</span>
                </label>
                <div className={styles.inputWithLeftIcon}>
                  <Phone size={16} className={styles.leftInputIcon} />
                  <input
                    type="tel"
                    placeholder="+91 98401 55678"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className={styles.formInputPadded}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroupFull}>
                <label className={styles.fieldLabel}>Department / Plant Section (Optional)</label>
                <div className={styles.inputWithLeftIcon}>
                  <Building size={16} className={styles.leftInputIcon} />
                  <input
                    type="text"
                    placeholder="e.g. Stores & Logistics / Plant Operations Gate 2"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={styles.formInputPadded}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Sticky Pickup Request Summary */}
        <div className={styles.formRightCol}>
          <div className={styles.stickySummaryCard}>
            {/* Dark Graphite Header */}
            <div className={styles.summaryDarkHeader}>
              <Sparkles size={16} className={styles.summaryHeaderIconYellow} />
              <h3 className={styles.summaryHeaderTitle}>PICKUP REQUEST SUMMARY</h3>
            </div>

            <div className={styles.summaryBody}>
              {/* Materials Count Row */}
              <div className={styles.summarySectionBlock}>
                <div className={styles.summaryCountRow}>
                  <span className={styles.summaryLabelUppercase}>TOTAL MATERIALS LISTED</span>
                  <span className={styles.summaryCountBadge}>
                    {items.length} Scrap Item{items.length > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Material Item Summary Cards */}
                <div className={styles.summaryItemsList}>
                  {items.map((item, idx) => (
                    <div key={item.id} className={styles.summaryItemCard}>
                      <div className={styles.summaryItemTop}>
                        <span className={styles.summaryItemIndexYellow}>#{idx + 1}</span>
                        <strong className={styles.summaryItemName}>
                          {item.scrapType || 'Untitled Scrap Item'}
                        </strong>
                      </div>
                      <div className={styles.summaryItemMeta}>
                        <span>{item.condition}</span>
                        <span>•</span>
                        <span>{item.photos.length} Photo{item.photos.length !== 1 ? 's' : ''}</span>
                        {item.quantity && (
                          <>
                            <span>•</span>
                            <strong className={styles.summaryItemQty}>
                              {item.quantity} {item.unit}
                            </strong>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logistics Summary Details */}
              <div className={styles.logisticsDetailsBox}>
                <div className={styles.logisticsDetailRow}>
                  <span className={styles.detailLabel}>Pickup Date:</span>
                  <strong className={styles.detailValue}>{pickupDate || '16 May 2025'}</strong>
                </div>
                <div className={styles.logisticsDetailRow}>
                  <span className={styles.detailLabel}>Time Slot:</span>
                  <strong className={styles.detailValue}>{timeSlot}</strong>
                </div>
                <div className={styles.logisticsDetailRow}>
                  <span className={styles.detailLabel}>Gate:</span>
                  <strong className={styles.detailValue}>{factoryGate}</strong>
                </div>
              </div>

              {/* Transparent Offers Information Box */}
              <div className={styles.transparentOffersBox}>
                <div className={styles.transparentBoxHeader}>
                  <Info size={15} className={styles.infoIconYellow} />
                  <strong className={styles.transparentTitle}>Transparent Offers</strong>
                </div>
                <p className={styles.transparentText}>
                  Itemized price rates will be submitted by verified merchants after reviewing your listed items and photos.
                </p>
              </div>

              {/* Primary Submit Button (Scrap Anna Yellow #FFC107) */}
              <button type="submit" className={styles.primarySubmitBtnYellow}>
                <span>Submit Pickup Request ({items.length} Item{items.length > 1 ? 's' : ''})</span>
                <ArrowRight size={16} />
              </button>

              <p className={styles.zeroFeesReassurance}>
                <Check size={14} className={styles.checkIconGreen} />
                <span>Zero upfront fees. Merchants compete to offer the highest price for your scrap.</span>
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* 4. Submission Success Modal */}
      {submittedRequestId && (
        <div className={styles.modalOverlay} onClick={() => setSubmittedRequestId(null)}>
          <div className={styles.successModalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.successIconCircle}>
              <CheckCircle2 size={36} className={styles.successCheckIcon} />
            </div>

            <h3 className={styles.successTitle}>Pickup Request Submitted!</h3>
            <p className={styles.successDesc}>
              Your multi-material scrap pickup request with <strong>{items.length} listed items</strong> has been broadcast to verified industrial recyclers.
            </p>

            <div className={styles.requestIdBox}>
              <span className={styles.reqIdLabel}>YOUR REQUEST ID:</span>
              <div className={styles.reqIdRow}>
                <span className={styles.reqIdValue}>{submittedRequestId}</span>
                <button
                  type="button"
                  className={styles.copyIdBtn}
                  onClick={handleCopyId}
                  title="Copy Request ID"
                >
                  {copied ? <CheckCheck size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className={styles.successNextStepsBox}>
              <strong className={styles.nextStepsTitle}>What happens next?</strong>
              <ul className={styles.nextStepsList}>
                <li>1. Local certified scrap merchants review your listed weights &amp; photos.</li>
                <li>2. Itemized rate quotes will arrive in your Quotes Received portal.</li>
                <li>3. Choose the highest price offer and confirm truck dispatch with OTP #1.</li>
              </ul>
            </div>

            <div className={styles.successActionButtons}>
              <Link to="/industry/requests" className={styles.viewRequestsPrimaryBtnYellow}>
                <span>View in My Requests →</span>
              </Link>
              <button
                type="button"
                className={styles.postAnotherModalBtn}
                onClick={() => {
                  setSubmittedRequestId(null);
                  setItems([INITIAL_ITEM]);
                }}
              >
                + Post Another Lot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Live Camera Capture Modal */}
      {activeCameraItemId && (
        <div className={styles.modalOverlay} onClick={() => setActiveCameraItemId(null)}>
          <div className={styles.cameraModalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.cameraModalHeader}>
              <div className={styles.cameraTitleBlock}>
                <Camera size={18} className={styles.goldCameraIcon} />
                <h3 className={styles.cameraModalHeading}>Capture Scrap Photo</h3>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setActiveCameraItemId(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.cameraModalBody}>
              {cameraError ? (
                <div className={styles.cameraErrorBox}>
                  <AlertTriangle size={24} className={styles.errorIcon} />
                  <p>{cameraError}</p>
                </div>
              ) : capturedPhoto ? (
                <div className={styles.capturedPreviewBox}>
                  <img src={capturedPhoto} alt="Captured scrap snapshot" className={styles.capturedImg} />
                </div>
              ) : (
                <div className={styles.liveVideoBox}>
                  <video ref={videoRef} autoPlay playsInline className={styles.videoStream} />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>
              )}
            </div>

            <div className={styles.cameraModalFooter}>
              {capturedPhoto ? (
                <>
                  <button
                    type="button"
                    className={styles.retakeBtn}
                    onClick={handleRetakePhoto}
                  >
                    <RotateCcw size={15} />
                    <span>Retake</span>
                  </button>
                  <button
                    type="button"
                    className={styles.saveCapturedBtn}
                    onClick={handleSaveCapturedPhoto}
                  >
                    <Check size={16} />
                    <span>Attach Photo</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className={styles.captureSnapshotBtn}
                  onClick={handleCaptureSnapshot}
                  disabled={!!cameraError}
                >
                  <Camera size={18} />
                  <span>Snap Photo</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. Photo Lightbox Modal */}
      {previewImage && (
        <div className={styles.modalOverlay} onClick={() => setPreviewImage(null)}>
          <div className={styles.imagePreviewModal} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.previewCloseBtn}
              onClick={() => setPreviewImage(null)}
            >
              <X size={20} />
            </button>
            <img src={previewImage} alt="Enlarged scrap preview" className={styles.enlargedImg} />
          </div>
        </div>
      )}
    </div>
  );
}
