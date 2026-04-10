import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api, assetUrl } from '../lib/api';
import { useLang } from '../context/LangContext';

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLang();

  useEffect(() => {
    if (!sessionId) {
      setError('No order session found');
      setLoading(false);
      return;
    }
    api.get(`/api/orders/confirmation?session_id=${sessionId}`)
      .then(setOrder)
      .catch(() => setError('Could not load order details'))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'var(--text-light)' }}>{t('loadingOrder')}</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
        <p style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'var(--text-light)' }}>{error || t('orderNotFound')}</p>
        <Link to="/shop" className="btn" style={{ padding: '12px 32px' }}>{t('continueShopping')}</Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
      style={{ maxWidth: '680px', margin: '0 auto', padding: '80px var(--px) 120px' }}
    >
      {/* Checkmark */}
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.15 }}
        style={{
          width: '64px', height: '64px', borderRadius: '50%',
          border: '1.5px solid var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 28px',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </motion.div>

      <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 300, textAlign: 'center', marginBottom: '8px' }}>
        {t('orderThankYou')}
      </h1>
      <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 300, marginBottom: '48px' }}>
        {t('orderPlaced')}
      </p>

      {/* Order info */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '20px 0', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span className="label">{t('order')}</span>
          <span style={{ fontSize: '0.78rem', fontFamily: 'monospace' }}>{order.id.slice(0, 8).toUpperCase()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span className="label">{t('status')}</span>
          <span style={{ fontSize: '0.78rem', textTransform: 'capitalize' }}>{order.status}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="label">{t('date')}</span>
          <span style={{ fontSize: '0.78rem' }}>{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {order.items.map((item) => (
          <div key={item.id} style={{ display: 'flex', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
            {item.image ? (
              <img src={assetUrl(item.image)} alt="" style={{ width: '64px', height: '84px', objectFit: 'cover', flexShrink: 0, background: 'var(--bg-alt)' }} />
            ) : (
              <div style={{ width: '64px', height: '84px', flexShrink: 0, background: 'var(--bg-alt)' }} />
            )}
            <div style={{ flex: 1 }}>
              <h4 style={{ fontFamily: 'var(--serif)', fontSize: '0.92rem', fontWeight: 400, marginBottom: '3px' }}>{item.product_name}</h4>
              {(item.size || item.color) && (
                <p style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginBottom: '3px' }}>
                  {[item.size, item.color].filter(Boolean).join(' / ')}
                </p>
              )}
              <p style={{ fontSize: '0.78rem' }}>{t('qty')} {item.quantity} × ${parseFloat(item.unit_price).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="label">{t('subtotal')}</span>
          <span style={{ fontSize: '0.85rem' }}>${parseFloat(order.subtotal).toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="label">{t('shipping')}</span>
          <span style={{ fontSize: '0.85rem' }}>{parseFloat(order.shipping_cost) === 0 ? t('free') : `$${parseFloat(order.shipping_cost).toFixed(2)}`}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 400 }}>{t('total')}</span>
          <span style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 300 }}>${parseFloat(order.total).toFixed(2)}</span>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link to="/shop" className="btn" style={{ padding: '14px 40px' }}>{t('continueShopping')}</Link>
      </div>
    </motion.div>
  );
}
