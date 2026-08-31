import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Bell,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';
import { Button, LanguageSelector } from '@/components/common';
import { useAuthStore } from '@/store/useAuthStore';
import styles from './Navbar.module.css';

const NAV_ITEMS = [
  { id: 'home', labelEn: 'Home', labelTa: 'முகப்பு' },
  { id: 'who-we-serve', labelEn: 'For Users', labelTa: 'பயனாளர்கள்' },
  { id: 'market-prices', labelEn: 'Market Prices', labelTa: 'சந்தை விலைகள்' },
  { id: 'why-choose-us', labelEn: 'Why Us', labelTa: 'நன்மைகள்' },
  { id: 'accessibility', labelEn: 'Accessibility', labelTa: 'தமிழ் ஆதரவு' },
];

export function Navbar() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isTamil = i18n.language === 'ta';

  const [activeSection, setActiveSection] = useState(() => {
    if (location.pathname === '/market-prices') return 'market-prices';
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });

  // Handle in-page smooth scrolling or cross-page navigation
  const handleNavClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    setActiveSection(sectionId);

    const isHomePage = location.pathname === '/home' || location.pathname === '/';

    if (isHomePage) {
      const el = document.getElementById(sectionId);
      if (el) {
        const offset = 76; // Navbar height offset
        const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        window.history.pushState(null, '', '#' + sectionId);
      }
    } else {
      // If on another route like /market-prices, route back to home with anchor
      navigate(`/home#${sectionId}`);
    }
  };

  // ScrollSpy to automatically switch active section decoration as user scrolls
  useEffect(() => {
    const isHomePage = location.pathname === '/home' || location.pathname === '/';
    if (!isHomePage) {
      if (location.pathname === '/market-prices') {
        setActiveSection('market-prices');
      }
      return;
    }

    const handleScroll = () => {
      const scrollPos = window.scrollY + 120; // threshold offset

      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on load
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  // Smart Hide on Scroll Down, Immediate Reveal on Scroll Up (Backward)
  useEffect(() => {
    let lastScrollY = window.scrollY || document.documentElement.scrollTop;

    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;
      const delta = currentScrollY - lastScrollY;

      if (currentScrollY <= 30) {
        setIsVisible(true);
        setIsScrolled(false);
      } else {
        setIsScrolled(true);
        if (delta < -1) {
          setIsVisible(true);
        } else if (delta > 4 && currentScrollY > 50) {
          setIsVisible(false);
        }
      }

      lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`${styles.navbarWrapper} ${!isVisible ? styles.navbarHidden : ''} ${
        isScrolled ? styles.navbarScrolled : ''
      }`}
    >
      <div className={styles.navbarContainer}>
        {/* Brand / Logo */}
        <Link to="/home" className={styles.brandLink} aria-label="Scrap Anna Home">
          <img
            src="/logo-icon.png"
            alt="Scrap Anna Emblem"
            className={styles.logoEmblem}
          />
          <div className={styles.brandTextCol}>
            <img
              src="/logo-text.png"
              alt="Scrap Anna"
              className={styles.logoTextImg}
            />
            <div className={styles.brandTaglineExact}>
              Connect • Collect • Recycle
            </div>
          </div>
        </Link>

        {/* Center Desktop In-Page Navigation Links */}
        <nav className={styles.navLinks}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={[
                styles.navLink,
                activeSection === item.id ? styles.activeLink : '',
              ].join(' ')}
              onClick={(e) => handleNavClick(e, item.id)}
            >
              {isTamil ? item.labelTa : item.labelEn}
            </a>
          ))}
        </nav>

        {/* Right Action Controls */}
        <div className={styles.rightControls}>
          <LanguageSelector compact />

          {isAuthenticated && user ? (
            <div className={styles.authGroup}>
              <Link to="/notifications" className={styles.iconBtn} title="Notifications">
                <Bell size={18} />
              </Link>
              <Link to={`/dashboard/${user.role}`} className={styles.userPill}>
                <div className={styles.avatarMini}>{user.name[0]}</div>
                <div className={styles.userInfoMini}>
                  <strong className={styles.userNameMini}>{user.name.split(' ')[0]}</strong>
                  <span className={styles.userRoleMini}>{user.role}</span>
                </div>
              </Link>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Button
                size="md"
                className={styles.loginNavBtn}
                icon={<ArrowRight size={16} />}
                onClick={() => navigate('/login')}
              >
                {isTamil ? 'உள்நுழைக' : 'Login'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
