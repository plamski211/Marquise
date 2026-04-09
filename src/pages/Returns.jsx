import { motion } from 'framer-motion';
import { useLang } from '../context/LangContext';

export default function Returns() {
  const { t } = useLang();

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <section style={{ padding: 'clamp(80px, 12vh, 140px) 0 clamp(80px, 10vh, 120px)' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, marginBottom: '48px' }}
          >
            {t('returnsTitle')}
          </motion.h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {[
              { title: t('returnsPolicyTitle'), body: t('returnsPolicyBody') },
              { title: t('returnsConditionsTitle'), body: t('returnsConditionsBody') },
              { title: t('returnsProcessTitle'), body: t('returnsProcessBody') },
              { title: t('returnsRefundTitle'), body: t('returnsRefundBody') },
            ].map((s, i) => (
              <div key={i}>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', fontWeight: 400, marginBottom: '12px' }}>{s.title}</h3>
                <p style={{ fontSize: '0.88rem', fontWeight: 300, lineHeight: 1.85, color: 'var(--text-light)' }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
