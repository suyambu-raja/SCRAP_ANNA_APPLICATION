import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Construction, ArrowLeft, ArrowRight, Store, Factory, ShieldAlert } from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';
import styles from './RoleUnavailablePage.module.css';

interface RoleUnavailablePageProps {
  roleName: 'Household' | 'Aggregator';
}

export default function RoleUnavailablePage({ roleName }: RoleUnavailablePageProps) {
  const navigate = useNavigate();

  const title = `${roleName} page is not available`;
  const description =
    roleName === 'Aggregator'
      ? 'The Aggregator wholesale aggregation portal and bulk sorting ledger are currently in development. You can explore our live Merchant and Industry portals below.'
      : 'The Household doorstep scrap collection and selling portal is currently in development. You can explore our live Merchant and Industry portals below.';

  return (
    <div className={styles.pageWrapper}>
      <Navbar />

      <main className={styles.mainContainer}>
        <div className={styles.cardContainer}>
          <div className={styles.iconCircle}>
            <Construction size={42} className={styles.iconYellow} />
          </div>

          <div className={styles.badge}>
            <ShieldAlert size={14} />
            <span>MODULE UNDER CONSTRUCTION</span>
          </div>

          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>

          <div className={styles.actionsGroup}>
            <button
              type="button"
              className={styles.backBtn}
              onClick={() => navigate('/home')}
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </button>
            <Link to="/merchant" className={styles.merchantCtaBtn}>
              <Store size={16} />
              <span>Explore Merchant Portal</span>
              <ArrowRight size={14} />
            </Link>
            <Link to="/industry" className={styles.industryCtaBtn}>
              <Factory size={16} />
              <span>Explore Industry Portal</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
