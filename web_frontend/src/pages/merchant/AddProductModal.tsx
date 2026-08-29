import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Check,
  Star,
  MapPin,
  Phone,
  MessageSquare,
  AlertCircle,
  Sparkles,
  Layers,
  Tag,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import styles from './AddProductModal.module.css';

export interface NewProductData {
  name: string;
  category: string;
  categoryIcon: string;
  description: string;
  quantity: number;
  price: string;
  priceUnit: string;
  availability: 'In Stock' | 'Low Stock' | 'Sold Out';
  address: string;
  areaCity: string;
  mobileNumber: string;
  allowInAppMessages: boolean;
  photos: string[];
  coverPhotoIndex: number;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (product: any) => void;
  merchantAddress?: string;
  merchantPhone?: string;
}

const CATEGORY_OPTIONS = [
  { name: 'Cycles', icon: '🚲' },
  { name: 'Motors', icon: '⚙️' },
  { name: 'Gates', icon: '🚪' },
  { name: 'Engines', icon: '🔧' },
  { name: 'AC & Cooling', icon: '❄️' },
  { name: 'Industrial Parts', icon: '🔩' },
  { name: 'Furniture & Fixtures', icon: '📦' },
  { name: 'Pallets', icon: '🪵' },
  { name: 'Other', icon: '🏷️' },
];

const SAMPLE_PHOTOS = [
  '/scrap-quality-steel.png',
  '/scrap-cpu.png',
  '/scrap-battery.png',
  '/scrap-iron.png',
  '/scrap-ac.png',
  '/scrap-plastic-pallet.png',
];

export default function AddProductModal({
  isOpen,
  onClose,
  onPublish,
  merchantAddress = '24, 5th Main Road, SIDCO Industrial Estate, Guindy, Chennai – 600032',
  merchantPhone = '+91 98401 23456',
}: AddProductModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [photos, setPhotos] = useState<string[]>([
    '/scrap-iron.png', // Default cover sample photo
  ]);
  const [coverPhotoIndex, setCoverPhotoIndex] = useState<number>(0);
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Motors');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState('');
  const [priceUnit, setPriceUnit] = useState('Per Item');
  const [availability, setAvailability] = useState<'In Stock' | 'Low Stock' | 'Sold Out'>('In Stock');
  const [useBusinessAddress, setUseBusinessAddress] = useState(true);
  const [address, setAddress] = useState(merchantAddress);
  const [areaCity, setAreaCity] = useState('Guindy, Chennai');
  const [mobileNumber, setMobileNumber] = useState(merchantPhone);
  const [allowInAppMessages, setAllowInAppMessages] = useState(true);

  // Validation State
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  if (!isOpen) return null;

  const isFormDirty = Boolean(
    productName.trim() ||
      description.trim() ||
      price.trim() ||
      photos.length > 1 ||
      category !== 'Motors'
  );

  const validateField = (field: string, value: any) => {
    let error = '';
    if (field === 'productName' && (!value || !value.trim())) {
      error = 'Product name is required';
    }
    if (field === 'category' && !value) {
      error = 'Please select a category';
    }
    if (field === 'description' && (!value || !value.trim())) {
      error = 'Please describe the product';
    }
    if (field === 'price') {
      if (!value || isNaN(Number(value)) || Number(value) <= 0) {
        error = 'Enter a valid price in ₹';
      }
    }
    if (field === 'quantity') {
      if (!value || Number(value) < 1) {
        error = 'Quantity must be at least 1';
      }
    }
    if (field === 'address' && (!value || !value.trim())) {
      error = 'Pickup address is required';
    }
    if (field === 'areaCity' && (!value || !value.trim())) {
      error = 'Area / City is required';
    }
    if (field === 'mobileNumber' && (!value || !value.trim())) {
      error = 'Contact mobile number is required';
    }
    return error;
  };

  const handleBlur = (field: string, value: any) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 5 - photos.length;
    if (remainingSlots <= 0) return;

    Array.from(files)
      .slice(0, remainingSlots)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setPhotos((prev) => [...prev, event.target!.result as string].slice(0, 5));
          }
        };
        reader.readAsDataURL(file);
      });
  };

  const handleAddSamplePhoto = () => {
    if (photos.length >= 5) return;
    const unusedSample = SAMPLE_PHOTOS.find((s) => !photos.includes(s)) || SAMPLE_PHOTOS[photos.length % SAMPLE_PHOTOS.length];
    setPhotos((prev) => [...prev, unusedSample]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (coverPhotoIndex >= updated.length) {
        setCoverPhotoIndex(Math.max(0, updated.length - 1));
      } else if (coverPhotoIndex === index) {
        setCoverPhotoIndex(0);
      }
      return updated;
    });
  };

  const handleBusinessAddressToggle = (checked: boolean) => {
    setUseBusinessAddress(checked);
    if (checked) {
      setAddress(merchantAddress);
      setAreaCity('Guindy, Chennai');
    }
  };

  const handleAttemptClose = () => {
    if (isFormDirty) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {
      productName: validateField('productName', productName),
      category: validateField('category', category),
      description: validateField('description', description),
      quantity: validateField('quantity', quantity),
      price: validateField('price', price),
      address: validateField('address', address),
      areaCity: validateField('areaCity', areaCity),
      mobileNumber: validateField('mobileNumber', mobileNumber),
    };

    setTouched({
      productName: true,
      category: true,
      description: true,
      quantity: true,
      price: true,
      address: true,
      areaCity: true,
      mobileNumber: true,
    });

    setErrors(newErrors);

    const hasAnyError = Object.values(newErrors).some(Boolean);
    if (hasAnyError) {
      return;
    }

    const catObj = CATEGORY_OPTIONS.find((c) => c.name === category) || { name: category, icon: '📦' };

    const formattedPrice = priceUnit === 'Per Item' ? `₹${Number(price).toLocaleString('en-IN')}` : `₹${Number(price).toLocaleString('en-IN')} / ${priceUnit.replace('Per ', '')}`;

    const newProduct = {
      id: `prod-${Date.now()}`,
      name: productName.trim(),
      category: catObj.name,
      categoryIcon: catObj.icon,
      location: areaCity.trim(),
      price: formattedPrice,
      stockText: availability === 'Low Stock' ? `Only ${quantity} left` : availability === 'In Stock' ? 'In Stock' : 'Sold Out',
      isLowStock: availability === 'Low Stock',
      status: availability === 'Low Stock' ? 'Low Stock' : 'Active',
      image: photos[coverPhotoIndex] || '/scrap-quality-steel.png',
      description: description.trim(),
      address: address.trim(),
      contactNumber: mobileNumber.trim(),
      allowMessages: allowInAppMessages,
      quantity,
    };

    onPublish(newProduct);
    onClose();
  };

  const handleSaveDraft = () => {
    if (!productName.trim()) {
      setTouched((prev) => ({ ...prev, productName: true }));
      setErrors((prev) => ({ ...prev, productName: 'Enter at least a product name to save draft' }));
      return;
    }

    const catObj = CATEGORY_OPTIONS.find((c) => c.name === category) || { name: category, icon: '📦' };

    const draftProduct = {
      id: `prod-draft-${Date.now()}`,
      name: `(Draft) ${productName.trim()}`,
      category: catObj.name,
      categoryIcon: catObj.icon,
      location: areaCity.trim() || 'Guindy, Chennai',
      price: price ? `₹${Number(price).toLocaleString('en-IN')}` : '₹—',
      stockText: 'Draft',
      status: 'Low Stock' as const,
      image: photos[coverPhotoIndex] || '/scrap-quality-steel.png',
    };

    onPublish(draftProduct);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleAttemptClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleCol}>
            <div className={styles.headerBadge}>
              <Sparkles size={13} fill="#0f172a" />
              <span>MARKETPLACE LISTING</span>
            </div>
            <h2 className={styles.modalTitle}>Add New Product</h2>
            <p className={styles.modalSubtitle}>
              List reusable components, industrial parts, or refurbished machinery for buyer inquiries.
            </p>
          </div>
          <button
            type="button"
            className={styles.modalCloseBtn}
            onClick={handleAttemptClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handlePublishSubmit} className={styles.formContent}>
          {/* ================================================================
              SECTION 1: PHOTOS
             ================================================================ */}
          <section className={styles.formSection}>
            <div className={styles.sectionHeadingRow}>
              <span className={styles.sectionNumber}>1</span>
              <div>
                <h3 className={styles.sectionTitle}>Product Photos</h3>
                <p className={styles.sectionDesc}>
                  Add clear, well-lit photos — listings with photos get more inquiries (up to 5 photos).
                </p>
              </div>
            </div>

            {/* Photos Preview Strip */}
            <div className={styles.photosGrid}>
              {photos.map((photoUrl, idx) => {
                const isCover = idx === coverPhotoIndex;
                return (
                  <div key={idx} className={`${styles.photoThumbCard} ${isCover ? styles.photoThumbCover : ''}`}>
                    <img src={photoUrl} alt={`Upload preview ${idx + 1}`} className={styles.thumbImg} />
                    {isCover ? (
                      <span className={styles.coverBadge}>
                        <Star size={11} fill="#ffffff" /> Cover
                      </span>
                    ) : (
                      <button
                        type="button"
                        className={styles.makeCoverBtn}
                        onClick={() => setCoverPhotoIndex(idx)}
                        title="Set as Cover Photo"
                      >
                        Set as Cover
                      </button>
                    )}
                    <button
                      type="button"
                      className={styles.removePhotoBtn}
                      onClick={() => handleRemovePhoto(idx)}
                      title="Remove Photo"
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })}

              {/* Upload Dropzone Box */}
              {photos.length < 5 && (
                <div
                  className={styles.uploadDropzone}
                  onClick={() => fileInputRef.current?.click()}
                  title="Click to select image file"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                  />
                  <UploadCloud size={24} className={styles.uploadIcon} />
                  <span className={styles.uploadText}>+ Add Photo</span>
                  <span className={styles.uploadSubtext}>({photos.length}/5 photos)</span>
                </div>
              )}
            </div>

            {photos.length < 5 && (
              <div className={styles.samplePhotoRow}>
                <span className={styles.samplePhotoLabel}>Need a quick photo?</span>
                <button
                  type="button"
                  className={styles.samplePhotoBtn}
                  onClick={handleAddSamplePhoto}
                >
                  + Add Sample Scrap Image
                </button>
              </div>
            )}
          </section>

          {/* ================================================================
              SECTION 2: PRODUCT DETAILS
             ================================================================ */}
          <section className={styles.formSection}>
            <div className={styles.sectionHeadingRow}>
              <span className={styles.sectionNumber}>2</span>
              <div>
                <h3 className={styles.sectionTitle}>Product Details</h3>
                <p className={styles.sectionDesc}>Basic specifications and category classification.</p>
              </div>
            </div>

            <div className={styles.fieldsGrid}>
              {/* Product Name */}
              <div className={styles.inputGroupFull}>
                <label className={styles.fieldLabel}>
                  Product Name <span className={styles.reqAsterisk}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Crompton 2HP Induction Motor / Hero Sprint Cycle"
                  value={productName}
                  onChange={(e) => {
                    setProductName(e.target.value);
                    if (touched.productName) handleBlur('productName', e.target.value);
                  }}
                  onBlur={(e) => handleBlur('productName', e.target.value)}
                  className={`${styles.textInput} ${errors.productName && touched.productName ? styles.inputError : ''}`}
                />
                {errors.productName && touched.productName && (
                  <span className={styles.errorText}>
                    <AlertCircle size={12} /> {errors.productName}
                  </span>
                )}
              </div>

              {/* Category & Quantity in 2-Columns */}
              <div className={styles.formRowTwo}>
                <div className={styles.inputGroup}>
                  <label className={styles.fieldLabel}>
                    Category <span className={styles.reqAsterisk}>*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={styles.selectInput}
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.fieldLabel}>
                    Quantity Available <span className={styles.reqAsterisk}>*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={quantity}
                    onChange={(e) => {
                      setQuantity(Number(e.target.value));
                      if (touched.quantity) handleBlur('quantity', e.target.value);
                    }}
                    onBlur={(e) => handleBlur('quantity', e.target.value)}
                    className={`${styles.textInput} ${errors.quantity && touched.quantity ? styles.inputError : ''}`}
                  />
                  {errors.quantity && touched.quantity && (
                    <span className={styles.errorText}>
                      <AlertCircle size={12} /> {errors.quantity}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className={styles.inputGroupFull}>
                <label className={styles.fieldLabel}>
                  Description <span className={styles.reqAsterisk}>*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe condition, age, working status, and key features (e.g. Fully tested, copper wound, minor cosmetic scratches on outer frame)..."
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (touched.description) handleBlur('description', e.target.value);
                  }}
                  onBlur={(e) => handleBlur('description', e.target.value)}
                  className={`${styles.textAreaInput} ${errors.description && touched.description ? styles.inputError : ''}`}
                />
                <span className={styles.fieldHelper}>
                  Describe condition, age, working status, and any relevant specs for interested buyers.
                </span>
                {errors.description && touched.description && (
                  <span className={styles.errorText}>
                    <AlertCircle size={12} /> {errors.description}
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* ================================================================
              SECTION 3: PRICING & AVAILABILITY
             ================================================================ */}
          <section className={styles.formSection}>
            <div className={styles.sectionHeadingRow}>
              <span className={styles.sectionNumber}>3</span>
              <div>
                <h3 className={styles.sectionTitle}>Pricing &amp; Availability</h3>
                <p className={styles.sectionDesc}>Set asking price and stock visibility.</p>
              </div>
            </div>

            <div className={styles.formRowTwo}>
              {/* Price with Unit selector */}
              <div className={styles.inputGroup}>
                <label className={styles.fieldLabel}>
                  Price (₹) <span className={styles.reqAsterisk}>*</span>
                </label>
                <div className={styles.priceInputWrapper}>
                  <span className={styles.currencyPrefix}>₹</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 8500"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      if (touched.price) handleBlur('price', e.target.value);
                    }}
                    onBlur={(e) => handleBlur('price', e.target.value)}
                    className={`${styles.priceField} ${errors.price && touched.price ? styles.inputError : ''}`}
                  />
                  <select
                    value={priceUnit}
                    onChange={(e) => setPriceUnit(e.target.value)}
                    className={styles.unitDropdown}
                  >
                    <option value="Per Item">Per Item</option>
                    <option value="Per Piece">Per Piece</option>
                    <option value="Per Set">Per Set</option>
                    <option value="Total Lot">Total Lot</option>
                  </select>
                </div>
                {errors.price && touched.price && (
                  <span className={styles.errorText}>
                    <AlertCircle size={12} /> {errors.price}
                  </span>
                )}
              </div>

              {/* Availability Status */}
              <div className={styles.inputGroup}>
                <label className={styles.fieldLabel}>Availability Status</label>
                <div className={styles.availabilityPills}>
                  {(['In Stock', 'Low Stock', 'Sold Out'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      className={`${styles.availPillBtn} ${
                        availability === status ? styles.availPillActive : ''
                      }`}
                      onClick={() => setAvailability(status)}
                    >
                      {status === 'In Stock' && '🟢 '}
                      {status === 'Low Stock' && '🟠 '}
                      {status === 'Sold Out' && '⚪ '}
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================
              SECTION 4: LOCATION
             ================================================================ */}
          <section className={styles.formSection}>
            <div className={styles.sectionHeadingRow}>
              <span className={styles.sectionNumber}>4</span>
              <div>
                <h3 className={styles.sectionTitle}>Pickup / Viewing Location</h3>
                <p className={styles.sectionDesc}>Where buyers can inspect or collect the item.</p>
              </div>
            </div>

            <div className={styles.fieldsGrid}>
              <div className={styles.checkboxRow}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={useBusinessAddress}
                    onChange={(e) => handleBusinessAddressToggle(e.target.checked)}
                    className={styles.customCheckbox}
                  />
                  <span>Use my registered business address</span>
                </label>
              </div>

              <div className={styles.inputGroupFull}>
                <label className={styles.fieldLabel}>
                  Pickup Address <span className={styles.reqAsterisk}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Plot/Shop No, Street, Industrial Area"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (touched.address) handleBlur('address', e.target.value);
                  }}
                  onBlur={(e) => handleBlur('address', e.target.value)}
                  className={`${styles.textInput} ${errors.address && touched.address ? styles.inputError : ''}`}
                />
                {errors.address && touched.address && (
                  <span className={styles.errorText}>
                    <AlertCircle size={12} /> {errors.address}
                  </span>
                )}
              </div>

              <div className={styles.inputGroupFull}>
                <label className={styles.fieldLabel}>
                  Area / City <span className={styles.reqAsterisk}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Guindy, Chennai / Ambattur, Chennai"
                  value={areaCity}
                  onChange={(e) => {
                    setAreaCity(e.target.value);
                    if (touched.areaCity) handleBlur('areaCity', e.target.value);
                  }}
                  onBlur={(e) => handleBlur('areaCity', e.target.value)}
                  className={`${styles.textInput} ${errors.areaCity && touched.areaCity ? styles.inputError : ''}`}
                />
                {errors.areaCity && touched.areaCity && (
                  <span className={styles.errorText}>
                    <AlertCircle size={12} /> {errors.areaCity}
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* ================================================================
              SECTION 5: CONTACT FOR INQUIRIES
             ================================================================ */}
          <section className={styles.formSection}>
            <div className={styles.sectionHeadingRow}>
              <span className={styles.sectionNumber}>5</span>
              <div>
                <h3 className={styles.sectionTitle}>Contact for Inquiries</h3>
                <p className={styles.sectionDesc}>How interested buyers can reach you.</p>
              </div>
            </div>

            <div className={styles.fieldsGrid}>
              <div className={styles.inputGroupFull}>
                <label className={styles.fieldLabel}>
                  Contact Mobile Number <span className={styles.reqAsterisk}>*</span>
                </label>
                <div className={styles.phoneInputBox}>
                  <Phone size={15} className={styles.phoneIcon} />
                  <input
                    type="tel"
                    placeholder="+91 98401 23456"
                    value={mobileNumber}
                    onChange={(e) => {
                      setMobileNumber(e.target.value);
                      if (touched.mobileNumber) handleBlur('mobileNumber', e.target.value);
                    }}
                    onBlur={(e) => handleBlur('mobileNumber', e.target.value)}
                    className={`${styles.phoneInput} ${errors.mobileNumber && touched.mobileNumber ? styles.inputError : ''}`}
                  />
                </div>
                {errors.mobileNumber && touched.mobileNumber && (
                  <span className={styles.errorText}>
                    <AlertCircle size={12} /> {errors.mobileNumber}
                  </span>
                )}
              </div>

              <div className={styles.checkboxRow}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={allowInAppMessages}
                    onChange={(e) => setAllowInAppMessages(e.target.checked)}
                    className={styles.customCheckbox}
                  />
                  <span>
                    <strong>Allow buyers to message me in-app</strong> (Direct phone calls &amp; WhatsApp inquiries are also supported)
                  </span>
                </label>
              </div>
            </div>
          </section>

          {/* Modal Actions Footer */}
          <div className={styles.modalFooterRow}>
            <button
              type="button"
              className={styles.cancelLinkBtn}
              onClick={handleAttemptClose}
            >
              Cancel
            </button>

            <div className={styles.footerRightBtns}>
              <button
                type="button"
                className={styles.draftBtn}
                onClick={handleSaveDraft}
              >
                Save as Draft
              </button>

              <button
                type="submit"
                className={styles.publishBtn}
              >
                <span>Publish Listing</span>
                <Sparkles size={15} />
              </button>
            </div>
          </div>
        </form>

        {/* Unsaved Changes Discard Confirmation Dialog */}
        {showDiscardConfirm && (
          <div
            className={styles.discardConfirmOverlay}
            onClick={() => setShowDiscardConfirm(false)}
          >
            <div
              className={styles.discardConfirmCard}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.discardIconBox}>
                <AlertTriangle size={24} color="#dc2626" />
              </div>
              <h4 className={styles.discardTitle}>Discard Unsaved Product?</h4>
              <p className={styles.discardText}>
                You have entered product details. If you leave now, your changes will not be published.
              </p>
              <div className={styles.discardActionsRow}>
                <button
                  type="button"
                  className={styles.keepEditingBtn}
                  onClick={() => setShowDiscardConfirm(false)}
                >
                  Keep Editing
                </button>
                <button
                  type="button"
                  className={styles.confirmDiscardBtn}
                  onClick={() => {
                    setShowDiscardConfirm(false);
                    onClose();
                  }}
                >
                  Discard Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
