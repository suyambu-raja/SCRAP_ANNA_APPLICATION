import { useState } from 'react';
import { TrendingUp, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import styles from './HouseholdHistory.module.css';

const ALL_PRICES = [
  { name: 'Copper Wire (Bright / Clean)', cat: 'Metal Scrap', price: 720, unit: '/ kg', change: '+12 (1.69%)', isUp: true },
  { name: 'Copper Armature / Motor', cat: 'Metal Scrap', price: 680, unit: '/ kg', change: '+10 (1.49%)', isUp: true },
  { name: 'Aluminum Extrusions', cat: 'Metal Scrap', price: 180, unit: '/ kg', change: '+5 (2.86%)', isUp: true },
  { name: 'Aluminum Utensils', cat: 'Metal Scrap', price: 145, unit: '/ kg', change: '+4 (2.84%)', isUp: true },
  { name: 'Brass Honey / Mixed', cat: 'Metal Scrap', price: 500, unit: '/ kg', change: '+5 (1.01%)', isUp: true },
  { name: 'Iron / Heavy Melting Steel', cat: 'Metal Scrap', price: 28, unit: '/ kg', change: '+2 (7.69%)', isUp: true },
  { name: 'Iron Sheet / Scrap Metal', cat: 'Metal Scrap', price: 24, unit: '/ kg', change: '+1 (4.35%)', isUp: true },
  { name: 'Plastic PET Bottles (Clean)', cat: 'Plastic Scrap', price: 12, unit: '/ kg', change: '+1 (9.09%)', isUp: true },
  { name: 'Hard Plastic / Buckets / Chairs', cat: 'Plastic Scrap', price: 15, unit: '/ kg', change: '+1 (7.14%)', isUp: true },
  { name: 'Corrugated Cardboard (Baled)', cat: 'Paper Scrap', price: 8, unit: '/ kg', change: '+1 (14.29%)', isUp: true },
  { name: 'Old Newspaper (ONP)', cat: 'Paper Scrap', price: 10, unit: '/ kg', change: '+1 (11.11%)', isUp: true },
  { name: 'White Office Record Paper', cat: 'Paper Scrap', price: 14, unit: '/ kg', change: '+1 (7.69%)', isUp: true },
  { name: 'E-Waste (Computer Motherboard)', cat: 'E-Waste', price: 150, unit: '/ kg', change: '+10 (7.14%)', isUp: true },
  { name: 'E-Waste (Mobile Phones / Mixed)', cat: 'E-Waste', price: 220, unit: '/ kg', change: '+15 (7.32%)', isUp: true },
];

export function HouseholdMarketPrices() {
  const [search, setSearch] = useState('');

  const filtered = ALL_PRICES.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.cat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerBlock}>
        <div className={styles.headerIconCircle} style={{ background: '#ecfdf5', color: '#059669' }}>
          <TrendingUp size={24} />
        </div>
        <div className={styles.headerTitles}>
          <h2 className={styles.mainTitle}>Scrap Market Rates & Trends</h2>
          <p className={styles.mainSubtitle}>Live verified doorstep pickup rates across Chennai & Tamil Nadu.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {filtered.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              boxShadow: '0 2px 8px rgba(15,23,42,0.03)',
            }}
          >
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              {item.cat}
            </span>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
              {item.name}
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#d97706' }}>
                ₹{item.price} <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>{item.unit}</span>
              </span>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <ArrowUpRight size={14} />
                <span>{item.change}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HouseholdMarketPrices;
