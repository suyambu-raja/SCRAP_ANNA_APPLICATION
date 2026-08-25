import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Home, Store, Factory, Network, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import Button from './Button';

export default function JoinModal({ isOpen, onClose, defaultRole = 'household' }) {
  const [role, setRole] = useState(defaultRole);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Chennai',
    scrapType: '',
    estimatedQuantity: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (defaultRole) setRole(defaultRole);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setIsSubmitted(false);
      setErrors({});
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, defaultRole]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const roleOptions = [
    { id: 'household', label: 'Household', icon: Home, desc: 'Sell home scrap & request doorstep pickup' },
    { id: 'merchant', label: 'Merchant', icon: Store, desc: 'Receive local scrap leads & grow business' },
    { id: 'industry', label: 'Industry', icon: Factory, desc: 'Bulk factory scrap disposal & digital bills' },
    { id: 'aggregator', label: 'Aggregator', icon: Network, desc: 'Consolidate supply & connect with recyclers' },
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name or company name.';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.city.trim()) newErrors.city = 'Please enter your city/location.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Fallback if canvas-confetti fails
      }
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(17, 24, 39, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'var(--color-white)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '620px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          position: 'relative',
          animation: 'fadeIn 0.25s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div style={{
          backgroundColor: 'var(--color-secondary-graphite)',
          color: 'var(--color-white)',
          padding: '1.25rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span className="badge badge-dark" style={{ marginBottom: '0.25rem' }}>
              Platform Registration
            </span>
            <h3 style={{ color: 'var(--color-white)', fontSize: '1.25rem', margin: 0 }}>
              Join Scrap Anna
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9CA3AF',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color var(--transition-fast)'
            }}
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem' }}>
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#DCFCE7',
                color: '#16A34A',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Thank You for Registering!</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                We have received your interest as a <strong>{roleOptions.find(r => r.id === role)?.label}</strong>. Our team will verify your details and connect with you shortly on <strong>{formData.phone}</strong>.
              </p>
              <div style={{ backgroundColor: 'var(--color-soft-yellow)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-soft-yellow-border)', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: 'var(--text-small)', color: '#92400E', margin: 0 }}>
                  ⚡ Instant Support: You can also reach our Chennai desk at <strong>contact@scrapanna.com</strong>
                </p>
              </div>
              <Button variant="primary" onClick={onClose} size="md">
                Done & Return to Site
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Select Your Account Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }} className="modal-role-grid">
                  {roleOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = role === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setRole(opt.id)}
                        style={{
                          border: isSelected ? '2px solid var(--color-primary-yellow)' : '1px solid var(--color-border)',
                          backgroundColor: isSelected ? 'var(--color-primary-yellow-light)' : 'var(--color-white)',
                          padding: '0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.65rem',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <div style={{
                          color: isSelected ? '#92400E' : 'var(--color-secondary-graphite)',
                          marginTop: '2px'
                        }}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: isSelected ? '#92400E' : 'var(--color-text-primary)' }}>
                            {opt.label}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.2 }}>
                            {opt.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="modal-form-row">
                <div className="form-group">
                  <label className="form-label">
                    {role === 'industry' || role === 'aggregator' ? 'Company / Contact Name *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <p className="form-error-msg">{errors.name}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile Number *</label>
                  <input
                    type="tel"
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="10-digit phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  {errors.phone && <p className="form-error-msg">{errors.phone}</p>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="modal-form-row">
                <div className="form-group">
                  <label className="form-label">Email Address (Optional)</label>
                  <input
                    type="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {errors.email && <p className="form-error-msg">{errors.email}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Location / City *</label>
                  <input
                    type="text"
                    className={`form-input ${errors.city ? 'error' : ''}`}
                    placeholder="e.g. Guindy, Chennai"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                  {errors.city && <p className="form-error-msg">{errors.city}</p>}
                </div>
              </div>

              {(role === 'industry' || role === 'household') && (
                <div className="form-group">
                  <label className="form-label">Primary Scrap Material / Requirement</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Corrugated boxes, Old Iron, Aluminium section, Copper wires"
                    value={formData.scrapType}
                    onChange={(e) => setFormData({ ...formData, scrapType: e.target.value })}
                  />
                </div>
              )}

              <div style={{ marginTop: '1.25rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <span>Submit Platform Request</span>
                  <ArrowRight size={18} />
                </button>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '0.75rem', marginBottom: 0 }}>
                🔒 Your information is secure and used solely for Scrap Anna platform coordination.
              </p>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 540px) {
          .modal-role-grid, .modal-form-row {
            grid-template-columns: 1fr !important;
            gap: 0.75rem !important;
          }
        }
      `}</style>
    </div>
  );
}
