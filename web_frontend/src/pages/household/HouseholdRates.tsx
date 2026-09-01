import { useState } from 'react';
import {
  Tag,
  MapPin,
  Info,
  Plus,
  ArrowRight,
  Phone,
  CheckCircle2,
  X,
  Sparkles,
  Layers,
  FileText,
  Cpu,
} from 'lucide-react';
import styles from './HouseholdRates.module.css';

interface ScrapMaterial {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  priceMin: number;
  priceMax: number;
  unit: string;
  descriptors: string;
  imageUrl: string;
}

const CATEGORIES = [
  { id: 'all', name: 'All Categories' },
  { id: 'iron', name: 'Iron' },
  { id: 'plastic', name: 'Plastic' },
  { id: 'material', name: 'Material' },
  { id: 'paper', name: 'Cardboard and Paper' },
  { id: 'battery', name: 'Battery' },
  { id: 'appliances', name: 'home Appliances' },
  { id: 'ewaste', name: 'E-wastes' },
  { id: 'wires', name: 'wires' },
];

const MATERIALS: ScrapMaterial[] = [
  {
    id: 'mat-copper',
    name: 'Copper Scrap',
    category: 'MATERIAL',
    categoryId: 'material',
    priceMin: 680,
    priceMax: 750,
    unit: 'kg',
    descriptors: 'Copper Wire • Heavy Copper Pipes • Plates & Rods • Armature',
    imageUrl: '/scrap-copper.jpg',
  },
  {
    id: 'mat-burned-copper',
    name: 'Burned copper',
    category: 'MATERIAL',
    categoryId: 'material',
    priceMin: 620,
    priceMax: 680,
    unit: 'kg',
    descriptors: 'Burned Copper Wire • Armature Coils • Motor Windings',
    imageUrl: '/scrap-burned-copper.jpg',
  },
  {
    id: 'mat-household-aluminium',
    name: 'household aluminium',
    category: 'MATERIAL',
    categoryId: 'material',
    priceMin: 140,
    priceMax: 165,
    unit: 'kg',
    descriptors: 'Aluminium Utensils • Window Frames • Household Sheets',
    imageUrl: '/scrap-household-aluminium.jpg',
  },
  {
    id: 'mat-ma-solid-alloy',
    name: 'MA - solid alloy',
    category: 'MATERIAL',
    categoryId: 'material',
    priceMin: 155,
    priceMax: 180,
    unit: 'kg',
    descriptors: 'Machined Alloy Castings • Solid Extrusions • High Grade Alloy',
    imageUrl: '/scrap-ma-solid-alloy.jpg',
  },
  {
    id: 'mat-commercial-aluminium',
    name: 'commercial aluminium',
    category: 'MATERIAL',
    categoryId: 'material',
    priceMin: 135,
    priceMax: 155,
    unit: 'kg',
    descriptors: 'Commercial Sections • Extrusion Scrap • Aluminium Wire',
    imageUrl: '/scrap-commercial-aluminium.jpg',
  },
  {
    id: 'mat-bus-body',
    name: 'bus body',
    category: 'MATERIAL',
    categoryId: 'material',
    priceMin: 32,
    priceMax: 38,
    unit: 'kg',
    descriptors: 'Automotive Panels • Bus Body Sheets • Structural Metal',
    imageUrl: '/scrap-bus-body.jpg',
  },
  {
    id: 'mat-brass-scrap',
    name: 'Brass Scrap',
    category: 'MATERIAL',
    categoryId: 'material',
    priceMin: 460,
    priceMax: 510,
    unit: 'kg',
    descriptors: 'Brass Honey • Taps & Fittings • Hardware & Valves',
    imageUrl: '/scrap-brass.jpg',
  },
  {
    id: 'mat-low-quality-steel',
    name: 'Low quality steel',
    category: 'MATERIAL',
    categoryId: 'material',
    priceMin: 22,
    priceMax: 28,
    unit: 'kg',
    descriptors: 'Mixed Mild Steel • Light Iron Metal • Sheet Offcuts',
    imageUrl: '/scrap-low-quality-steel.jpg',
  },
  {
    id: 'mat-iron',
    name: 'Heavy Melting Iron',
    category: 'IRON',
    categoryId: 'iron',
    priceMin: 36,
    priceMax: 42,
    unit: 'kg',
    descriptors: 'Heavy Iron Castings • Machinery Parts • Structural Beams',
    imageUrl: '/scrap-iron.jpg',
  },
  {
    id: 'mat-cardboard',
    name: 'Corrugated Cardboard Box',
    category: 'CARDBOARD AND PAPER',
    categoryId: 'paper',
    priceMin: 12,
    priceMax: 16,
    unit: 'kg',
    descriptors: 'Clean Corrugated Boxes • Brown Packaging Sheets • Baled Cartons',
    imageUrl: '/scrap-cardboard.jpg',
  },
  {
    id: 'mat-plastic',
    name: 'HDPE Plastic Drums & Cans',
    category: 'PLASTIC',
    categoryId: 'plastic',
    priceMin: 28,
    priceMax: 36,
    unit: 'kg',
    descriptors: 'Blue Chemical Drums • Water Cans • Hard Grade Plastic',
    imageUrl: '/scrap-plastic-barrel.jpg',
  },
  {
    id: 'mat-battery',
    name: 'Inverter & Vehicle Battery',
    category: 'BATTERY',
    categoryId: 'battery',
    priceMin: 85,
    priceMax: 110,
    unit: 'kg',
    descriptors: 'Lead Acid Inverter Batteries • Car & Bike Batteries • Sealed Units',
    imageUrl: '/scrap-battery.jpg',
  },
  {
    id: 'mat-ac',
    name: 'Split & Window AC Scrap',
    category: 'HOME APPLIANCES',
    categoryId: 'appliances',
    priceMin: 2200,
    priceMax: 4500,
    unit: 'unit',
    descriptors: 'Complete AC Units • Copper Condenser • Compressor Included',
    imageUrl: '/scrap-ac.jpg',
  },
  {
    id: 'mat-ewaste',
    name: 'Computer CPU & Motherboards',
    category: 'E-WASTES',
    categoryId: 'ewaste',
    priceMin: 180,
    priceMax: 350,
    unit: 'kg',
    descriptors: 'Desktop Computer Cabinets • Motherboards • Server Cards',
    imageUrl: '/scrap-cpu.jpg',
  },
  {
    id: 'mat-wires',
    name: 'Insulated Copper Wires',
    category: 'WIRES',
    categoryId: 'wires',
    priceMin: 280,
    priceMax: 360,
    unit: 'kg',
    descriptors: 'Household Electrical Wiring • Cable Offcuts • Harness Wires',
    imageUrl: '/scrap-copper-wire.jpg',
  },
];

export function HouseholdRates() {
  const [selectedCatId, setSelectedCatId] = useState<string>('material');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('mat-copper');

  // Post Scrap Modal State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [approxWeight, setApproxWeight] = useState('15');
  const [pickupDate, setPickupDate] = useState('2025-05-15');
  const [pickupSlot, setPickupSlot] = useState('Morning (09:00 AM - 12:00 PM)');
  const [postSuccess, setPostSuccess] = useState(false);

  // Filter materials based on category
  const filteredMaterials =
    selectedCatId === 'all'
      ? MATERIALS
      : MATERIALS.filter((m) => m.categoryId === selectedCatId);

  const activeMaterial =
    MATERIALS.find((m) => m.id === selectedMaterialId) ||
    filteredMaterials[0] ||
    MATERIALS[0];

  const handlePostScrap = (e: React.FormEvent) => {
    e.preventDefault();
    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
      setIsPostModalOpen(false);
    }, 2000);
  };

  return (
    <div className={styles.pageContainer}>
      {/* 1. Header Banner */}
      <div className={styles.headerBanner}>
        <div className={styles.headerTitleGroup}>
          <h1 className={styles.pageTitle}>Chennai Scrap Market Prices</h1>
          <p className={styles.pageSubtitle}>
            Indicative daily wholesale market trading benchmarks
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPostModalOpen(true)}
          className={styles.postScrapBtn}
        >
          <Plus size={16} />
          <span>Post Scrap</span>
        </button>
      </div>

      <p className={styles.indicativeNotice}>
        Live indicative doorstep price benchmarks for household recyclables, metals, paper, and e-waste materials across Chennai.
      </p>

      {/* 2. Category Pills Track (Matching Screenshot) */}
      <div className={styles.categoryPillsTrack}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={[
              styles.categoryPillBtn,
              selectedCatId === cat.id ? styles.categoryPillActive : '',
            ].join(' ')}
            onClick={() => {
              setSelectedCatId(cat.id);
              const firstInCat =
                cat.id === 'all'
                  ? MATERIALS[0]
                  : MATERIALS.find((m) => m.categoryId === cat.id);
              if (firstInCat) setSelectedMaterialId(firstInCat.id);
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 3. Sub-Material Selector Track (Matching Screenshot) */}
      <div className={styles.subMaterialTrack}>
        <span className={styles.subMaterialLabel}>
          <Tag size={13} />
          <span>SELECT MATERIAL:</span>
        </span>
        {filteredMaterials.map((mat) => (
          <button
            key={mat.id}
            type="button"
            className={[
              styles.subMaterialPill,
              activeMaterial.id === mat.id ? styles.subMaterialPillActive : '',
            ].join(' ')}
            onClick={() => setSelectedMaterialId(mat.id)}
          >
            {mat.name}
          </button>
        ))}
      </div>

      {/* 4. Main 2-Column Inspector Frame (Matching Screenshot) */}
      <main className={styles.inspectorFrame}>
        {/* Left Column: Material Photo Frame */}
        <div className={styles.imageColumn}>
          <div className={styles.largeImageWrap}>
            <img
              src={activeMaterial.imageUrl}
              alt={activeMaterial.name}
              className={styles.materialImage}
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Right Column: Rate Information & Details */}
        <div className={styles.detailColumn}>
          <div className={styles.headerMetaGroup}>
            <span className={styles.categoryBadgePill}>{activeMaterial.category}</span>
            <h2 className={styles.materialTitle}>{activeMaterial.name}</h2>
            <p className={styles.materialDescriptors}>{activeMaterial.descriptors}</p>
          </div>

          {/* Indicative Benchmark Rate Card */}
          <div className={styles.indicativeRateCard}>
            <span className={styles.rateCardHeading}>INDICATIVE BENCHMARK RATE</span>

            <div className={styles.priceRow}>
              <span className={styles.priceRangeText}>
                ₹{activeMaterial.priceMin} – ₹{activeMaterial.priceMax}
              </span>
              <span className={styles.priceUnitText}>/{activeMaterial.unit}</span>
            </div>

            <div className={styles.rateFooterRow}>
              <div className={styles.locationPin}>
                <MapPin size={15} color="#b45309" />
                <span>Chennai, Tamil Nadu</span>
              </div>
              <div className={styles.updatedTime}>Updated today, 9:30 AM</div>
            </div>
          </div>

          {/* Price Note Box */}
          <div className={styles.priceNoteBox}>
            <Info size={16} className={styles.infoIcon} />
            <span>
              <strong>Price Note:</strong> Rates are general market trading benchmarks and may vary based on
              material quality, moisture/impurity, volume (&gt; 1 Ton), factory location, and merchant offers.
            </span>
          </div>

          {/* Bottom CTA Card */}
          <div className={styles.bottomCtaCard}>
            <div className={styles.ctaTextCol}>
              <h3 className={styles.ctaTitle}>
                Sell factory scrap of {activeMaterial.name}?
              </h3>
              <p className={styles.ctaSub}>
                Post your scrap requirement to receive doorstep pickups and best rates from verified scrap buyers.
              </p>
            </div>
            <button
              type="button"
              className={styles.ctaGoldBtn}
              onClick={() => setIsPostModalOpen(true)}
            >
              <span>Post Scrap →</span>
            </button>
          </div>
        </div>
      </main>

      {/* POST SCRAP MODAL */}
      {isPostModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsPostModalOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Post Scrap Requirement
              </h3>
              <button
                type="button"
                onClick={() => setIsPostModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            {postSuccess ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle2 size={54} color="#10b981" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', fontWeight: 800 }}>
                  Scrap Requirement Posted!
                </h4>
                <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
                  Our verified executives will arrange doorstep weighing and pickup on {pickupDate}.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handlePostScrap}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#334155',
                      marginBottom: '0.35rem',
                    }}
                  >
                    Selected Material
                  </label>
                  <input
                    type="text"
                    value={activeMaterial.name}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: '#f8fafc',
                      fontWeight: 700,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#334155',
                      marginBottom: '0.35rem',
                    }}
                  >
                    Approximate Quantity ({activeMaterial.unit})
                  </label>
                  <input
                    type="number"
                    value={approxWeight}
                    onChange={(e) => setApproxWeight(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      boxSizing: 'border-box',
                    }}
                    min="1"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: '#334155',
                        marginBottom: '0.35rem',
                      }}
                    >
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        boxSizing: 'border-box',
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: '#334155',
                        marginBottom: '0.35rem',
                      }}
                    >
                      Time Slot
                    </label>
                    <select
                      value={pickupSlot}
                      onChange={(e) => setPickupSlot(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                      }}
                    >
                      <option>Morning (09:00 AM - 12:00 PM)</option>
                      <option>Afternoon (01:00 PM - 04:00 PM)</option>
                      <option>Evening (04:00 PM - 07:00 PM)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className={styles.postScrapBtn}
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                >
                  Submit Post Scrap Listing
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HouseholdRates;
