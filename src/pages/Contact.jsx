import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../context/LangContext';
import { api } from '../lib/api';

export default function Contact() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await api.post('/api/contact', form);
      setSent(true);
    } catch {
      setError(t('contactError'));
    } finally {
      setSending(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid var(--border)',
    background: 'transparent',
    fontFamily: 'var(--sans)',
    fontSize: '0.88rem',
    fontWeight: 300,
    color: 'var(--text)',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <section style={{ padding: 'clamp(80px, 12vh, 140px) 0 clamp(60px, 8vh, 100px)' }}>
        <div className="container" style={{ maxWidth: '560px', textAlign: 'center' }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="label" style={{ color: 'var(--accent)', marginBottom: '16px' }}
          >
            {t('contactLabel')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, marginBottom: '12px' }}
          >
            {t('contactTitle')}
          </motion.h1>
          <p style={{ fontSize: '0.85rem', fontWeight: 300, color: 'var(--text-light)', marginBottom: '48px', lineHeight: 1.7 }}>
            {t('contactSubtitle')}
          </p>

          {sent ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <p style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 300, marginBottom: '8px' }}>{t('contactSentTitle')}</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 300 }}>{t('contactSentBody')}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '8px' }}>{t('contactName')}</label>
                <input
                  type="text" required value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--text)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '8px' }}>{t('email')}</label>
                <input
                  type="email" required value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--text)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '8px' }}>{t('contactMessage')}</label>
                <textarea
                  required rows={5} value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                  onFocus={e => e.target.style.borderColor = 'var(--text)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              {error && <p style={{ color: 'var(--danger, #c44)', fontSize: '0.82rem', fontWeight: 300 }}>{error}</p>}
              <button type="submit" className="btn btn-filled" style={{ padding: '16px', width: '100%', opacity: sending ? 0.6 : 1 }} disabled={sending}>
                {sending ? '...' : t('contactSend')}
              </button>
            </form>
          )}

          <div style={{ marginTop: '56px', paddingTop: '40px', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 300, color: 'var(--text-light)', lineHeight: 1.8 }}>
              {t('contactEmail')}: <a href="mailto:contact@marquise.com" style={{ color: 'var(--text)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>contact@marquise.com</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
