import { type InputHTMLAttributes, useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, type, id, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={[styles.wrapper, error ? styles.hasError : '', className ?? ''].join(' ')}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles.inputWrap}>
          <input
            ref={ref}
            id={inputId}
            type={isPassword && showPassword ? 'text' : type}
            className={styles.input}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              className={styles.toggle}
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className={styles.error} role="alert">
            {error}
          </p>
        )}
        {hint && !error && <p className={styles.hint}>{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
