import { useState, useRef, useEffect, type KeyboardEvent, type ClipboardEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/common';
import { useAuthStore } from '@/store/useAuthStore';
import { verifyMobileOTP, sendMobileOTP } from '@/services';
import styles from './Auth.module.css';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);

  const phone = (location.state as { phone?: string })?.phone || '9876543210';

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [resendSuccess, setResendSuccess] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const updateDigit = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    setError('');

    // Auto advance to next input
    if (value && index < OTP_LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (text.length > 0) {
      const next = [...digits];
      text.split('').forEach((ch, i) => {
        next[i] = ch;
      });
      setDigits(next);
      refs.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus();
    }
  };

  const handleVerify = async () => {
    const otp = digits.join('');
    if (otp.length !== OTP_LENGTH) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await verifyMobileOTP(phone, otp);

      if (res.user) {
        // Existing user -> Directly to product app shell
        login(res.user, res.token);
        if (res.user.role === 'industry') {
          navigate('/industry/dashboard', { replace: true });
        } else {
          navigate('/dashboard/merchant', { replace: true });
        }
      } else {
        // New user -> Choose User Type & Role Registration
        localStorage.setItem('sa_unregistered_phone', phone);
        navigate('/register', { state: { isNewUser: true, phone }, replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await sendMobileOTP(phone);
      setCountdown(RESEND_SECONDS);
      setDigits(Array(OTP_LENGTH).fill(''));
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
      refs.current[0]?.focus();
    } catch {
      setError('Failed to resend OTP');
    }
  };

  const formattedPhone = phone.length === 10
    ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
    : `+91 ${phone}`;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img
            src="/logo-icon.png"
            alt="Scrap Anna"
            className={styles.logoImg}
            onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
          />
          <h1 className={styles.title}>Verify your mobile number</h1>
          <p className={styles.subtitle}>
            OTP sent to: <strong>{formattedPhone}</strong>
          </p>
          <button
            type="button"
            className={styles.changePhoneBtn}
            onClick={() => navigate('/login')}
          >
            Change Number
          </button>
        </div>

        <div className={styles.form}>
          <div className={styles.otpContainer}>
            <div className={styles.otpRow}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={d}
                  onChange={(e) => updateDigit(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  className={[styles.otpInput, error ? styles.otpError : '', d ? styles.otpFilled : ''].join(' ')}
                  aria-label={`Digit ${i + 1}`}
                />
              ))}
            </div>

            {error && <p className={styles.errorText} role="alert">{error}</p>}
            {resendSuccess && <p className={styles.successText}>New OTP sent successfully!</p>}
          </div>

          <Button
            fullWidth
            size="lg"
            loading={loading}
            onClick={handleVerify}
            icon={<CheckCircle2 size={18} />}
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </Button>

          <div className={styles.resendSection}>
            {countdown > 0 ? (
              <span className={styles.countdownText}>
                Resend OTP in <strong>{countdown}s</strong>
              </span>
            ) : (
              <button type="button" className={styles.resendBtn} onClick={handleResend}>
                <RotateCcw size={14} /> Resend OTP
              </button>
            )}
          </div>

          <div className={styles.devOtpBadge}>
            <span>💡 Dev hint: Any 6 digits (e.g. <strong>123456</strong>) will verify</span>
          </div>
        </div>
      </div>
    </div>
  );
}
