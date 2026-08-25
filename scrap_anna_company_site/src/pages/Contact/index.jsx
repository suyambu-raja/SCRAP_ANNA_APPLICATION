import React, { useState } from 'react';
import { 
  Mail, Phone, MapPin, Clock, Send, CheckCircle2, 
  Sparkles, MessageSquare, ShieldCheck, HelpCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import SEO from '../../components/common/SEO';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import Button from '../../components/common/Button';
import { siteConfig } from '../../data/siteData';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    userType: 'Household',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userTypes = [
    'Household',
    'Merchant',
    'Industry',
    'Aggregator',
    'Partner',
    'General Enquiry'
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required.';
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Please provide a message of at least 10 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (err) {}
      }, 600);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      userType: 'Household',
      subject: '',
      message: ''
    });
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <>
      <SEO
        title="Contact Us - Let's Connect & Transform Scrap Recycling"
        description="Have questions or want to partner with Scrap Anna? Reach our Chennai headquarters, submit an inquiry, or speak with our support team."
      />

      <PageHero
        eyebrow="Direct Connection"
        badgeIcon={Mail}
        title="Let's Connect & Transform Scrap Management"
        highlightWord="Let's Connect"
        description="Have a question about selling scrap, partnering as a merchant, or organizing bulk industrial recycling? Our dedicated team in Chennai is here to assist you."
        breadcrumbs={[{ label: 'Contact Us' }]}
      />

      <section className="section bg-white">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '3.5rem',
            alignItems: 'start'
          }} className="contact-grid">
            
            {/* Contact Form Box */}
            <div style={{
              backgroundColor: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{ marginBottom: '2rem' }}>
                <span className="badge badge-yellow" style={{ marginBottom: '0.75rem' }}>
                  Send an Enquiry
                </span>
                <h2 style={{ fontSize: '1.75rem', color: 'var(--color-graphite-dark)', marginBottom: '0.5rem' }}>
                  How Can We Help You?
                </h2>
                <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Fill out the form below and our operations desk will respond within 24 hours.
                </p>
              </div>

              {isSubmitted ? (
                <div style={{
                  backgroundColor: 'var(--color-primary-yellow-light)',
                  border: '2px solid var(--color-primary-yellow)',
                  borderRadius: 'var(--radius-md)',
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  animation: 'fadeIn 0.3s ease-out'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#DCFCE7',
                    color: '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem'
                  }}>
                    <CheckCircle2 size={36} />
                  </div>

                  <h3 style={{ fontSize: '1.5rem', color: 'var(--color-graphite-dark)', marginBottom: '0.5rem' }}>
                    Your Enquiry Has Been Submitted Successfully!
                  </h3>

                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-small)', maxWidth: '450px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
                    Thank you, <strong>{formData.name}</strong>. Our team has received your message regarding <em>"{formData.subject}"</em>. We will connect with you via email (<strong>{formData.email}</strong>) or phone shortly.
                  </p>

                  <Button
                    variant="secondary"
                    size="md"
                    onClick={handleReset}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Your Full Name *</label>
                      <input
                        type="text"
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        placeholder="e.g. Anand Sundaram"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                      {errors.name && <p className="form-error-msg">{errors.name}</p>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        className={`form-input ${errors.phone ? 'error' : ''}`}
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                      {errors.phone && <p className="form-error-msg">{errors.phone}</p>}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
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
                      <label className="form-label">I Am A *</label>
                      <select
                        className="form-select"
                        value={formData.userType}
                        onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                      >
                        {userTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject *</label>
                    <input
                      type="text"
                      className={`form-input ${errors.subject ? 'error' : ''}`}
                      placeholder="e.g. Inquiry regarding commercial scrap disposal contract"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                    {errors.subject && <p className="form-error-msg">{errors.subject}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Your Message *</label>
                    <textarea
                      rows="4"
                      className={`form-textarea ${errors.message ? 'error' : ''}`}
                      placeholder="Please share details about your scrap inquiry, location, or partnership ideas..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                    {errors.message && <p className="form-error-msg">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isSubmitting}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {isSubmitting ? (
                      <span>Submitting Enquiry...</span>
                    ) : (
                      <>
                        <span>Submit Message</span>
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right: Contact Information & Location Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Office Location Card */}
              <div style={{
                backgroundColor: 'var(--color-graphite-dark)',
                color: 'var(--color-white)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                border: '1px solid #374151',
                boxShadow: 'var(--shadow-md)'
              }}>
                <h3 style={{ color: 'var(--color-white)', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={20} style={{ color: 'var(--color-primary-yellow)' }} />
                  <span>Headquarters</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: 'var(--text-small)', color: '#D1D5DB' }}>
                  <p style={{ margin: 0, color: '#E5E7EB', lineHeight: 1.6 }}>
                    <strong>Scrap Anna Headquarters</strong><br />
                    {siteConfig.contact.address}
                  </p>

                  <div style={{ borderTop: '1px solid #374151', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Mail size={16} style={{ color: 'var(--color-primary-yellow)' }} />
                      <a href={`mailto:${siteConfig.contact.email}`} style={{ color: 'var(--color-white)' }}>
                        {siteConfig.contact.email}
                      </a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Phone size={16} style={{ color: 'var(--color-primary-yellow)' }} />
                      <span>{siteConfig.contact.phone}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Clock size={16} style={{ color: 'var(--color-primary-yellow)' }} />
                      <span>{siteConfig.contact.workingHours}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Support Promise Card */}
              <div style={{
                backgroundColor: 'var(--color-soft-yellow)',
                border: '1px solid var(--color-soft-yellow-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-white)',
                  color: '#92400E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.75rem'
                }}>
                  <ShieldCheck size={20} />
                </div>
                <h4 style={{ fontSize: '1.1rem', color: '#92400E', marginBottom: '0.4rem' }}>
                  Fast Response Guarantee
                </h4>
                <p style={{ fontSize: 'var(--text-small)', color: '#92400E', margin: 0, lineHeight: 1.5 }}>
                  Whether you are an individual selling books or an industrial plant needing 50 MT scrap clearance, our team responds swiftly with tailored assistance.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
        @media (max-width: 640px) {
          .form-row-2 {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }
        }
      `}</style>
    </>
  );
}
