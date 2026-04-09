import { motion } from 'framer-motion';
import { useLang } from '../context/LangContext';

const sizes = [
  { label: 'XS', bust: '80-84', waist: '60-64', hips: '86-90' },
  { label: 'S', bust: '84-88', waist: '64-68', hips: '90-94' },
  { label: 'M', bust: '88-92', waist: '68-72', hips: '94-98' },
  { label: 'L', bust: '92-96', waist: '72-76', hips: '98-102' },
  { label: 'XL', bust: '96-100', waist: '76-80', hips: '102-106' },
  { label: 'XXL', bust: '100-104', waist: '80-84', hips: '106-110' },
];

const cellStyle = {
  padding: '14px 20px',
  fontSize: '0.82rem',
  fontWeight: 300,
  borderBottom: '1px solid var(--border)',
};

const headStyle = {
  ...cellStyle,
  fontSize: '0.62rem',
  fontWeight: 500,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'var(--text-light)',
};

export default function SizeGuide() {
  const { t } = useLang();

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <section style={{ padding: 'clamp(80px, 12vh, 140px) 0 clamp(80px, 10vh, 120px)' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, marginBottom: '16px' }}
          >
            {t('sizeGuideTitle')}
          </motion.h1>
          <p style={{ fontSize: '0.85rem', fontWeight: 300, color: 'var(--text-light)', marginBottom: '48px', lineHeight: 1.7 }}>
            {t('sizeGuideSubtitle')}
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--text)' }}>
                  <th style={{ ...headStyle, textAlign: 'left' }}>{t('sizeLabel')}</th>
                  <th style={{ ...headStyle, textAlign: 'center' }}>{t('sizeBust')}</th>
                  <th style={{ ...headStyle, textAlign: 'center' }}>{t('sizeWaist')}</th>
                  <th style={{ ...headStyle, textAlign: 'center' }}>{t('sizeHips')}</th>
                </tr>
              </thead>
              <tbody>
                {sizes.map(s => (
                  <tr key={s.label}>
                    <td style={{ ...cellStyle, fontWeight: 500 }}>{s.label}</td>
                    <td style={{ ...cellStyle, textAlign: 'center', color: 'var(--text-light)' }}>{s.bust}</td>
                    <td style={{ ...cellStyle, textAlign: 'center', color: 'var(--text-light)' }}>{s.waist}</td>
                    <td style={{ ...cellStyle, textAlign: 'center', color: 'var(--text-light)' }}>{s.hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: '0.78rem', fontWeight: 300, color: 'var(--text-light)', marginTop: '24px', lineHeight: 1.7 }}>
            {t('sizeGuideNote')}
          </p>
        </div>
      </section>
    </div>
  );
}
