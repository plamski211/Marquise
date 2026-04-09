import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LangContext';
import { api } from '../lib/api';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQty, totalPrice } = useCart();
  const { t } = useLang();
  const [checkingOut, setCheckingOut] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(3px)', zIndex: 2000, cursor: 'pointer' }}
          />

          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: '100%', maxWidth: 'min(420px, 100vw)', background: 'var(--bg)', zIndex: 2001,
              display: 'flex', flexDirection: 'column',
              boxShadow: '-8px 0 40px rgba(0,0,0,0.06)',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '24px clamp(16px, 4vw, 28px)', borderBottom: '1px solid var(--border)',
            }}>
              <div>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 300 }}>{t('bag')}</h3>
                <p style={{ fontSize: '0.7rem', fontWeight: 300, color: 'var(--text-light)', marginTop: '2px' }}>
                  {items.length} {items.length === 1 ? t('item') : t('items')}
                </p>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ padding: '4px', transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.4'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px clamp(16px, 4vw, 28px)' }}>
              {items.length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <p style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 300, color: 'var(--text-light)' }}>
                    {t('bagEmpty')}
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {items.map((item, i) => (
                    <motion.div key={item.key}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      style={{ display: 'flex', gap: '16px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}
                    >
                      <div style={{ width: '80px', height: '104px', flexShrink: 0, overflow: 'hidden', background: 'var(--bg-alt)' }}>
                        {item.image ? (
                          <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: item.gradient || 'var(--bg-alt)' }} />
                        )}
                      </div>

                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ fontFamily: 'var(--serif)', fontSize: '0.95rem', fontWeight: 400, marginBottom: '3px' }}>{item.name}</h4>
                        {(item.size || item.color) && (
                          <p style={{ fontSize: '0.7rem', fontWeight: 300, color: 'var(--text-light)', marginBottom: '3px' }}>
                            {[item.size, item.color].filter(Boolean).join(' / ')}
                          </p>
                        )}
                        <p style={{ fontSize: '0.82rem', fontWeight: 400, marginBottom: '10px' }}>${item.price}</p>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)' }}>
                            {[{ label: '-', fn: () => updateQty(item.key, item.qty - 1) }, null, { label: '+', fn: () => updateQty(item.key, item.qty + 1) }].map((btn, j) =>
                              btn ? (
                                <button key={j} onClick={btn.fn} style={{
                                  width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '0.85rem', color: 'var(--text-mid)', transition: 'background 0.15s',
                                }}
                                  onMouseEnter={e => e.target.style.background = 'var(--bg-alt)'} onMouseLeave={e => e.target.style.background = 'transparent'}
                                >{btn.label}</button>
                              ) : (
                                <span key={j} style={{ width: '30px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 400 }}>{item.qty}</span>
                              )
                            )}
                          </div>
                          <button onClick={() => removeItem(item.key)} style={{
                            fontSize: '0.6rem', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase',
                            color: 'var(--text-light)', textDecoration: 'underline', textUnderlineOffset: '3px', transition: 'color 0.2s',
                          }}
                            onMouseEnter={e => e.target.style.color = 'var(--danger)'} onMouseLeave={e => e.target.style.color = 'var(--text-light)'}
                          >{t('remove')}</button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Checkout */}
            {items.length > 0 && (
              <div style={{ padding: '20px clamp(16px, 4vw, 28px)', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="label">{t('subtotal')}</span>
                  <span style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 300 }}>${totalPrice.toFixed(2)}</span>
                </div>
                <p style={{ fontSize: '0.72rem', fontWeight: 300, color: 'var(--text-light)', marginBottom: '16px' }}>{t('shippingAtCheckout')}</p>
                <button className="btn btn-filled" style={{ width: '100%', padding: '16px', opacity: checkingOut ? 0.6 : 1 }}
                  disabled={checkingOut}
                  onClick={async () => {
                    setCheckingOut(true);
                    try {
                      const { url } = await api.post('/api/checkout');
                      window.location.href = url;
                    } catch (err) {
                      alert(err.message || 'Checkout failed — please try again');
                      setCheckingOut(false);
                    }
                  }}
                >{checkingOut ? t('redirecting') : t('checkout')}</button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
