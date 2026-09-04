import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/common';
import { sendMobileOTP } from '@/services';
import { useAuthStore } from '@/store/useAuthStore';
import styles from './Auth.module.css';

export default function Login() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      navigate(`/dashboard/${user.role}`, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only accept numeric input up to 10 digits
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(cleaned);
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      await sendMobileOTP(phone);
      navigate('/verify-otp', { state: { phone } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoNumber = (demoPhone: string) => {
    setPhone(demoPhone);
    setError('');
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img
            src="/logo-icon.png"
            alt="Bill Scrap"
            className={styles.logoImg}
            onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
          />
          <h1 className={styles.title}>Let's get you started</h1>
          <p className={styles.subtitle}>Enter your mobile number to continue with Bill Scrap.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="mobile-input">
              Mobile Number
            </label>
            <div className={styles.phoneInputWrap}>
              <div className={styles.countryCode}>
                <span className={styles.flag}>🇮🇳</span>
                <span className={styles.code}>+91</span>
              </div>
              <input
                id="mobile-input"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                placeholder="Enter mobile number"
                value={phone}
                onChange={handlePhoneChange}
                className={[styles.phoneInput, error ? styles.inputError : ''].join(' ')}
                autoComplete="tel"
                autoFocus
              />
            </div>
            {error && <p className={styles.errorText} role="alert">{error}</p>}
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={loading}
            icon={<ArrowRight size={18} />}
          >
            {loading ? 'Sending OTP...' : 'Continue'}
          </Button>

          <div className={styles.securityNote}>
            <ShieldCheck size={16} className={styles.shieldIcon} />
            <span>Fast, password-free login via secure SMS verification</span>
          </div>

          {/* Quick Demo Numbers for UI Testing */}
          <div className={styles.demoSection}>
            <div className={styles.demoHeader}>
              <span>🧪 Quick Testing Numbers</span>
            </div>
            <div className={styles.demoGrid}>
              <button
                type="button"
                className={styles.demoBtn}
                onClick={() => setDemoNumber('9876543210')}
              >
                <strong>Household</strong>
                <span>98765 43210</span>
              </button>
              <button
                type="button"
                className={styles.demoBtn}
                onClick={() => setDemoNumber('9876543211')}
              >
                <strong>Merchant</strong>
                <span>98765 43211</span>
              </button>
              <button
                type="button"
                className={styles.demoBtn}
                onClick={() => setDemoNumber('9876543212')}
              >
                <strong>Industry</strong>
                <span>98765 43212</span>
              </button>
            </div>
            <p className={styles.demoHint}>
              Tip: Enter any other number (e.g. 9988776655) to test the <strong>New User</strong> flow!
            </p>
          </div>
        </form>

        <div className={styles.exploreFooter}>
          <Link to="/home" className={styles.exploreLink}>
            Explore public scrap rates without signing in →
          </Link>
        </div>
      </div>
    </div>
  );
}
