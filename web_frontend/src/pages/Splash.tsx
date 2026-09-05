import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import styles from './Splash.module.css';

interface SplashProps {
  onComplete?: () => void;
  isInitialLaunch?: boolean;
}

export default function Splash({ onComplete, isInitialLaunch = false }: SplashProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [animationStep, setAnimationStep] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const isNavigatedRef = useRef(false);

  // Step 0: Empty truck waiting centered (Idling with smoke)
  // Step 1: Fridge drops into Far-Left (x=16, touches bed floor)
  // Step 2: Can drops into Far-Right (x=176, touches bed floor)
  // Step 3: Bulk Papers Bundle drops into Mid-Left base (x=64, touches bed floor)
  // Step 4: Bunch of Iron Plates drops into Mid-Center (x=112, touches bed floor)
  // Step 5: Cycle drops into Mid-Left (x=68, wheels touch bed floor)
  // Step 6: Chair drops into Mid-Right (x=132, legs touch bed floor)
  // Step 7: TV drops into Center (x=102, touches bed floor) - Fully packed!
  // Step 8: Engine revs & settles
  // Step 9: Truck accelerates & drives off to the right -> Automatic Navigation

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const handleFinish = useCallback(() => {
    if (isNavigatedRef.current) return;
    isNavigatedRef.current = true;
    setIsFadingOut(true);

    setTimeout(() => {
      if (onComplete) {
        onComplete();
      }

      // Check if we need to redirect (root or splash routes)
      const currentPath = location.pathname;
      const isRootOrSplash =
        currentPath === '/' || currentPath === '/splash' || currentPath === '/loading';

      if (isRootOrSplash) {
        const storedLanguage = localStorage.getItem('sa_language');
        const storedUser = localStorage.getItem('sa_user');

        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            if (parsed && parsed.role) {
              navigate(`/dashboard/${parsed.role}`, { replace: true });
              return;
            }
          } catch {
            // ignore
          }
        }

        if (user && user.role) {
          navigate(`/dashboard/${user.role}`, { replace: true });
          return;
        }

        if (!storedLanguage) {
          navigate('/language', { replace: true });
          return;
        }

        navigate('/home', { replace: true });
      }
    }, 320);
  }, [location.pathname, navigate, onComplete, user]);

  useEffect(() => {
    setAnimationStep(0);

    const t1 = setTimeout(() => setAnimationStep(1), 350);  // Drop 1: Fridge
    const t2 = setTimeout(() => setAnimationStep(2), 750);  // Drop 2: Can
    const t3 = setTimeout(() => setAnimationStep(3), 1150); // Drop 3: Bulk Papers Bundle
    const t4 = setTimeout(() => setAnimationStep(4), 1550); // Drop 4: Bunch of Iron Plates
    const t5 = setTimeout(() => setAnimationStep(5), 1950); // Drop 5: Cycle
    const t6 = setTimeout(() => setAnimationStep(6), 2350); // Drop 6: Chair
    const t7 = setTimeout(() => setAnimationStep(7), 2750); // Drop 7: TV (Fully Packed)
    const t8 = setTimeout(() => setAnimationStep(8), 3250); // Engine revs & wheels pre-spin
    const t9 = setTimeout(() => setAnimationStep(9), 3750); // Truck drives off to right
    const tNav = setTimeout(() => handleFinish(), 4850);    // Transition after truck finishes drive-off

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
      clearTimeout(t8);
      clearTimeout(t9);
      clearTimeout(tNav);
    };
  }, [handleFinish]);

  const progressPercent =
    animationStep === 0 ? 12 :
    animationStep === 1 ? 25 :
    animationStep === 2 ? 38 :
    animationStep === 3 ? 50 :
    animationStep === 4 ? 62 :
    animationStep === 5 ? 75 :
    animationStep === 6 ? 88 :
    animationStep >= 7 ? 100 : 12;

  return (
    <div
      className={[
        styles.splashCanvas,
        isFadingOut ? styles.splashFadingOut : '',
      ].join(' ')}
      role="region"
      aria-label="Bill Scrap Loading Screen"
    >
      {/* Main Animation Stage (Clean Minimalist Canvas) */}
      <main className={styles.stageContainer}>
        {/* Animated Scrap Truck Container (Centered then Accelerating to Right) */}
        <div
          className={[
            styles.truckMotionRig,
            animationStep >= 9 ? styles.truckDrivingOff : styles.truckCentered,
            animationStep === 8 ? styles.truckRevving : '',
          ].join(' ')}
        >
          {/* Suspension Dip on scrap impact */}
          <div
            className={[
              styles.suspensionRig,
              animationStep >= 1 && animationStep <= 7 ? styles.suspensionDip : '',
            ].join(' ')}
          >
            {/* Speed Wind Lines when driving */}
            {animationStep >= 9 && (
              <div className={styles.speedTrail}>
                <span className={styles.trailLine1} />
                <span className={styles.trailLine2} />
                <span className={styles.trailLine3} />
              </div>
            )}

            {/* Exhaust Smoke Puffs - Visible throughout idling, product dropping & driving */}
            <div
              className={[
                styles.exhaustPuffContainer,
                animationStep >= 8 ? styles.exhaustPuffFast : styles.exhaustPuffIdle,
              ].join(' ')}
            >
              <span className={styles.exhaustPuff1} />
              <span className={styles.exhaustPuff2} />
              <span className={styles.exhaustPuff3} />
            </div>

            {/* Vector Vehicle with Connected Driver and Lowered Steering Wheel */}
            <div className={styles.truckSvgWrap}>
              <svg
                viewBox="0 0 380 230"
                className={styles.truckSvg}
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* ---------------------------------------------------- */}
                {/* 1. CUSTOM SCRAP PRODUCTS (ALL GROUNDED ON BED FLOOR) */}
                {/* ---------------------------------------------------- */}

                {/* PRODUCT 1: Fridge / Refrigerator (Far-Left x=16, Grounded at y=106) */}
                <g transform="translate(16, 18)">
                  <g
                    className={[
                      styles.scrapDropWrapper,
                      animationStep >= 1 ? styles.scrapItemLanded : styles.scrapItemHidden,
                    ].join(' ')}
                  >
                    {/* Main Refrigerator Body */}
                    <rect x="4" y="6" width="48" height="78" rx="5" fill="#181e29" />
                    {/* Freezer Door Divider */}
                    <line x1="4" y1="34" x2="52" y2="34" stroke="#ffd600" strokeWidth="2.5" />
                    {/* Freezer Handle */}
                    <rect x="8" y="18" width="3.5" height="11" rx="1.5" fill="#ffd600" />
                    {/* Main Door Handle */}
                    <rect x="8" y="42" width="3.5" height="16" rx="1.5" fill="#ffd600" />
                    {/* Refrigerator Base Feet touching bed floor at y=88 */}
                    <rect x="8" y="84" width="7" height="4" rx="1" fill="#181e29" />
                    <rect x="41" y="84" width="7" height="4" rx="1" fill="#181e29" />
                  </g>
                </g>

                {/* PRODUCT 2: Metal Tin / Oil Can (Far-Right x=176, Grounded at y=106) */}
                <g transform="translate(176, 52)">
                  <g
                    className={[
                      styles.scrapDropWrapper,
                      animationStep >= 2 ? styles.scrapItemLanded : styles.scrapItemHidden,
                    ].join(' ')}
                  >
                    <g transform="rotate(8 16 30)">
                      {/* Top Can Rim */}
                      <ellipse cx="16" cy="6" rx="13" ry="4.5" fill="#181e29" />
                      {/* Pop Tab Cutout */}
                      <circle cx="16" cy="8" r="2.5" fill="#ffd600" />
                      {/* Can Cylindrical Body resting on floor at y=54 */}
                      <path
                        d="M 3,6 
                           L 3,49 
                           Q 3,54 16,54 
                           Q 29,54 29,49 
                           L 29,6 
                           Z"
                        fill="#181e29"
                      />
                      {/* Can Ribbing Lines */}
                      <line x1="5" y1="22" x2="27" y2="22" stroke="#ffd600" strokeWidth="2" />
                      <line x1="5" y1="34" x2="27" y2="34" stroke="#ffd600" strokeWidth="2" />
                    </g>
                  </g>
                </g>

                {/* PRODUCT 3: Bulk Papers Bundle (Mid-Left Base x=64, Grounded at y=106) */}
                <g transform="translate(64, 68)">
                  <g
                    className={[
                      styles.scrapDropWrapper,
                      animationStep >= 3 ? styles.scrapItemLanded : styles.scrapItemHidden,
                    ].join(' ')}
                  >
                    {/* Tied Paper Stack Block resting on floor at y=38 */}
                    <rect x="4" y="6" width="48" height="32" rx="3" fill="#181e29" />
                    {/* Stacked Sheet Lines */}
                    <line x1="4" y1="13" x2="52" y2="13" stroke="#ffd600" strokeWidth="1.5" />
                    <line x1="4" y1="20" x2="52" y2="20" stroke="#ffd600" strokeWidth="1.5" />
                    <line x1="4" y1="27" x2="52" y2="27" stroke="#ffd600" strokeWidth="1.5" />
                    {/* Twine Cross Strapping Line */}
                    <line x1="27" y1="6" x2="27" y2="38" stroke="#ffd600" strokeWidth="2.5" />
                    {/* Twine Center Knot */}
                    <circle cx="27" cy="20" r="2.8" fill="#ffd600" />
                  </g>
                </g>

                {/* PRODUCT 4: Bunch of Iron Plates (Mid-Center x=112, Grounded at y=106) */}
                <g transform="translate(112, 74)">
                  <g
                    className={[
                      styles.scrapDropWrapper,
                      animationStep >= 4 ? styles.scrapItemLanded : styles.scrapItemHidden,
                    ].join(' ')}
                  >
                    {/* Base Iron Plate resting on floor at y=32 */}
                    <g transform="rotate(-8 24 20)">
                      <rect x="2" y="10" width="46" height="22" rx="3" fill="#181e29" />
                      <circle cx="10" cy="21" r="2.5" fill="#ffd600" />
                      <circle cx="40" cy="21" r="2.5" fill="#ffd600" />
                    </g>
                    {/* Middle Iron Plate */}
                    <g transform="rotate(6 24 16)">
                      <rect x="6" y="6" width="44" height="20" rx="3" fill="#181e29" stroke="#ffd600" strokeWidth="1.2" />
                      <circle cx="15" cy="16" r="2.5" fill="#ffd600" />
                      <circle cx="39" cy="16" r="2.5" fill="#ffd600" />
                    </g>
                    {/* Top Iron Plate */}
                    <rect x="10" y="2" width="40" height="18" rx="2.5" fill="#181e29" />
                    <circle cx="18" cy="11" r="2.5" fill="#ffd600" />
                    <circle cx="30" cy="11" r="2.5" fill="#ffd600" />
                    <circle cx="42" cy="11" r="2.5" fill="#ffd600" />
                  </g>
                </g>

                {/* PRODUCT 5: Bicycle Frame & Spoked Wheels (Mid-Left x=68, Wheels Grounded at y=106) */}
                <g transform="translate(68, 36)">
                  <g
                    className={[
                      styles.scrapDropWrapper,
                      animationStep >= 5 ? styles.scrapItemLanded : styles.scrapItemHidden,
                    ].join(' ')}
                  >
                    {/* Rear Spoked Wheel touching floor at y=70 */}
                    <circle cx="13" cy="56" r="14" fill="none" stroke="#181e29" strokeWidth="3" />
                    <circle cx="13" cy="56" r="2.5" fill="#181e29" />
                    <line x1="13" y1="42" x2="13" y2="70" stroke="#181e29" strokeWidth="1.2" />
                    <line x1="-1" y1="56" x2="27" y2="56" stroke="#181e29" strokeWidth="1.2" />

                    {/* Front Spoked Wheel touching floor at y=70 */}
                    <circle cx="52" cy="56" r="14" fill="none" stroke="#181e29" strokeWidth="3" />
                    <circle cx="52" cy="56" r="2.5" fill="#181e29" />
                    <line x1="52" y1="42" x2="52" y2="70" stroke="#181e29" strokeWidth="1.2" />
                    <line x1="38" y1="56" x2="66" y2="56" stroke="#181e29" strokeWidth="1.2" />

                    {/* Bicycle Diamond Frame Tubes */}
                    <line x1="13" y1="56" x2="32" y2="56" stroke="#181e29" strokeWidth="3.2" />
                    <line x1="32" y1="56" x2="24" y2="28" stroke="#181e29" strokeWidth="3.2" />
                    <line x1="24" y1="28" x2="44" y2="28" stroke="#181e29" strokeWidth="3.2" />
                    <line x1="44" y1="28" x2="52" y2="56" stroke="#181e29" strokeWidth="3.2" />
                    <line x1="13" y1="56" x2="24" y2="28" stroke="#181e29" strokeWidth="3.2" />
                    <line x1="32" y1="56" x2="44" y2="28" stroke="#181e29" strokeWidth="3.2" />

                    {/* Cycle Seat */}
                    <rect x="17" y="24" width="14" height="4" rx="2" fill="#181e29" />

                    {/* Handlebars */}
                    <line x1="44" y1="28" x2="46" y2="16" stroke="#181e29" strokeWidth="3.2" />
                    <line x1="39" y1="16" x2="53" y2="16" stroke="#181e29" strokeWidth="3.2" strokeLinecap="round" />
                  </g>
                </g>

                {/* PRODUCT 6: Scrap Chair (Mid-Right x=132, Legs Grounded at y=106) */}
                <g transform="translate(132, 26)">
                  <g
                    className={[
                      styles.scrapDropWrapper,
                      animationStep >= 6 ? styles.scrapItemLanded : styles.scrapItemHidden,
                    ].join(' ')}
                  >
                    <g transform="rotate(-12 24 45)">
                      {/* Chair Top Rail */}
                      <rect x="6" y="2" width="22" height="6" rx="2" fill="#181e29" />
                      {/* Chair Backrest Vertical Slats */}
                      <path d="M 8,6 L 8,46 L 11,46 L 11,6 Z" fill="#181e29" />
                      <path d="M 15,6 L 15,46 L 18,46 L 18,6 Z" fill="#181e29" />
                      <path d="M 22,6 L 22,46 L 25,46 L 25,6 Z" fill="#181e29" />
                      
                      {/* Chair Seat Plane */}
                      <rect x="5" y="44" width="36" height="6.5" rx="2" fill="#181e29" />

                      {/* 4 Chair Legs touching floor at y=80 */}
                      <line x1="9" y1="50" x2="5" y2="80" stroke="#181e29" strokeWidth="3.2" />
                      <line x1="17" y1="50" x2="15" y2="78" stroke="#181e29" strokeWidth="2.5" />
                      <line x1="30" y1="50" x2="28" y2="78" stroke="#181e29" strokeWidth="2.5" />
                      <line x1="37" y1="50" x2="41" y2="80" stroke="#181e29" strokeWidth="3.2" />
                    </g>
                  </g>
                </g>

                {/* PRODUCT 7: Television / TV (Drops at Step >= 7, Center x=102, Grounded at y=106) */}
                <g transform="translate(102, 62)">
                  <g
                    className={[
                      styles.scrapDropWrapper,
                      animationStep >= 7 ? styles.scrapItemLanded : styles.scrapItemHidden,
                    ].join(' ')}
                  >
                    {/* Dual Rabbit Ear Antenna */}
                    <line x1="22" y1="6" x2="12" y2="-6" stroke="#181e29" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="26" y1="6" x2="36" y2="-6" stroke="#181e29" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="12" cy="-6" r="2" fill="#181e29" />
                    <circle cx="36" cy="-6" r="2" fill="#181e29" />

                    {/* TV Cabinet */}
                    <rect x="4" y="6" width="46" height="34" rx="4" fill="#181e29" />

                    {/* TV Screen Cutout */}
                    <rect x="8" y="10" width="28" height="26" rx="2" fill="#ffd600" />
                    <rect x="10" y="12" width="24" height="22" rx="1.5" fill="#181e29" />

                    {/* TV Dials & Grille */}
                    <circle cx="41" cy="14" r="2" fill="#ffd600" />
                    <circle cx="41" cy="20" r="2" fill="#ffd600" />
                    <line x1="39" y1="26" x2="44" y2="26" stroke="#ffd600" strokeWidth="1.2" />
                    <line x1="39" y1="30" x2="44" y2="30" stroke="#ffd600" strokeWidth="1.2" />
                    <line x1="39" y1="34" x2="44" y2="34" stroke="#ffd600" strokeWidth="1.2" />

                    {/* Base Stand Feet touching floor at y=44 */}
                    <rect x="8" y="40" width="6" height="4" rx="1" fill="#181e29" />
                    <rect x="34" y="40" width="6" height="4" rx="1" fill="#181e29" />
                  </g>
                </g>

                {/* ---------------------------------------------------- */}
                {/* 2. EXACT CABIN & CARGO BODY MATCHING USER IMAGE      */}
                {/* ---------------------------------------------------- */}
                {/* Solid Truck Silhouette Body */}
                <path
                  d="M 12,106 
                     L 208,106 
                     L 208,48 
                     L 272,48 
                     Q 294,50 312,74 
                     L 354,128 
                     L 354,144 
                     L 344,144 
                     L 344,148 
                     L 366,148 
                     Q 368,148 368,154 
                     L 368,168 
                     Q 368,172 360,172 
                     L 330,172 
                     L 330,158 
                     L 248,158 
                     L 248,176 
                     L 226,176 
                     L 226,158 
                     L 12,158 
                     Z"
                  fill="#181e29"
                />

                {/* Headlamp Slot Cutout matching image */}
                <rect x="344" y="142" width="14" height="6" fill="#ffd600" />

                {/* Horizontal Accent Line below Cargo Bed */}
                <rect x="12" y="152" width="196" height="7" fill="#ffd600" />

                {/* ---------------------------------------------------- */}
                {/* 2B. CAB WINDOW & ATTACHED DRIVER + LOWERED STEERING  */}
                {/* ---------------------------------------------------- */}
                {/* Window Background Cutout */}
                <path
                  d="M 230,64 
                     L 270,64 
                     Q 286,66 298,82 
                     L 328,118 
                     L 230,118 
                     Z"
                  fill="#ffd600"
                />

                {/* Unified Driver Body (Head, Cap, Neck, Shoulders & Torso Seamlessly Attached) */}
                <path
                  d="M 234,118 
                     L 238,98 
                     Q 244,92 250,92 
                     L 250,86 
                     Q 246,86 246,78 
                     Q 246,70 256,70 
                     Q 266,70 266,78 
                     L 274,80 
                     L 266,84 
                     L 262,88 
                     L 262,94 
                     Q 270,96 272,106 
                     L 272,118 
                     Z"
                  fill="#181e29"
                />

                {/* Lowered Steering Column rising from Dashboard */}
                <line x1="312" y1="118" x2="295" y2="107" stroke="#181e29" strokeWidth="3.2" strokeLinecap="round" />

                {/* Lowered Tilted Steering Wheel Rim */}
                <ellipse
                  cx="294"
                  cy="106"
                  rx="3"
                  ry="9"
                  transform="rotate(-20 294 106)"
                  fill="none"
                  stroke="#181e29"
                  strokeWidth="2.8"
                />
                <circle cx="294" cy="106" r="1.8" fill="#181e29" />

                {/* Driver Arm & Hand reaching down to grip the Steering Wheel */}
                <path
                  d="M 258,98 L 278,106 L 294,106"
                  fill="none"
                  stroke="#181e29"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="294" cy="106" r="2.6" fill="#181e29" />

                {/* ---------------------------------------------------- */}
                {/* 3. WHEELS (STAR-SPOKE CUTOUT ALLOY TIRES)            */}
                {/* ---------------------------------------------------- */}
                {/* REAR WHEEL (Center: 78, 178) */}
                <g transform="translate(78, 178)">
                  <circle cx="0" cy="0" r="32" fill="#ffd600" />
                  <g
                    className={[
                      styles.wheelRig,
                      animationStep >= 7 ? styles.wheelSpinning : '',
                    ].join(' ')}
                  >
                    {/* Outer Tire */}
                    <circle cx="0" cy="0" r="26" fill="#181e29" />
                    
                    {/* 5-Point Star Spoke Cutout in Wheel */}
                    <path
                      d="M 0,-18 
                         L 4.5,-6 
                         L 17.1,-5.6 
                         L 7.4,2.2 
                         L 10.6,14.6 
                         L 0,7.2 
                         L -10.6,14.6 
                         L -7.4,2.2 
                         L -17.1,-5.6 
                         L -4.5,-6 
                         Z"
                      fill="#ffd600"
                    />

                    {/* Center Axle Hub Cap */}
                    <circle cx="0" cy="0" r="6" fill="#181e29" />
                    <circle cx="0" cy="0" r="2.5" fill="#ffd600" />
                  </g>
                </g>

                {/* FRONT WHEEL (Center: 288, 178) */}
                <g transform="translate(288, 178)">
                  <circle cx="0" cy="0" r="32" fill="#ffd600" />
                  <g
                    className={[
                      styles.wheelRig,
                      animationStep >= 7 ? styles.wheelSpinning : '',
                    ].join(' ')}
                  >
                    {/* Outer Tire */}
                    <circle cx="0" cy="0" r="26" fill="#181e29" />
                    
                    {/* 5-Point Star Spoke Cutout in Wheel */}
                    <path
                      d="M 0,-18 
                         L 4.5,-6 
                         L 17.1,-5.6 
                         L 7.4,2.2 
                         L 10.6,14.6 
                         L 0,7.2 
                         L -10.6,14.6 
                         L -7.4,2.2 
                         L -17.1,-5.6 
                         L -4.5,-6 
                         Z"
                      fill="#ffd600"
                    />

                    {/* Center Axle Hub Cap */}
                    <circle cx="0" cy="0" r="6" fill="#181e29" />
                    <circle cx="0" cy="0" r="2.5" fill="#ffd600" />
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Slogan Section */}
      <footer className={styles.loadingFooter}>
        <div className={styles.progressContainer}>
          <p className={styles.sloganText}>
            {animationStep < 7
              ? 'Collecting Recyclable Items...'
              : animationStep === 7 || animationStep === 8
              ? 'Scrap Loaded & Ready for Dispatch!'
              : 'Collecting Scrap... Building a Cleaner Tomorrow'}
          </p>
          <div
            className={styles.progressBarTrack}
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Loading progress"
          >
            <div
              className={styles.progressBarFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
