import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.includes('@')) { setDone(true); setEmail(''); }
  };

  return (
    <footer style={{ background: '#111', color: '#fefefe' }}>
      {/* Newsletter */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '72px 0' }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '32px',
        }}>
          <div>
            <h3 style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
              fontWeight: 300,
              marginBottom: '6px',
            }}>
              Stay with Marquise
            </h3>
            <p style={{ fontSize: '0.82rem', fontWeight: 300, color: 'rgba(255,255,255,0.35)' }}>
              New arrivals and exclusive previews.
            </p>
          </div>

          {done ? (
            <p style={{ fontSize: '0.72rem', fontWeight: 400, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
              Thank you
            </p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', maxWidth: '400px', width: '100%' }}>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Email address" required
                style={{
                  flex: 1, padding: '14px 16px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRight: 'none',
                  color: '#fefefe', fontSize: '0.82rem', fontWeight: 300, outline: 'none',
                }}
              />
              <button type="submit" style={{
                padding: '14px 28px', background: '#fefefe', color: '#111',
                fontFamily: 'var(--sans)', fontSize: '0.6rem', fontWeight: 500,
                letterSpacing: '0.18em', textTransform: 'uppercase', border: 'none', cursor: 'pointer',
              }}>
                Join
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Links */}
      <div className="container" style={{ padding: '56px var(--px)' }}>
        <div className="footer-grid">
          <div>
            <img src="/marquise-logo-clean.png" alt="Marquise" style={{
              height: '80px', width: 'auto', marginBottom: '16px',
              opacity: 0.9,
            }} />
            <p style={{ fontSize: '0.82rem', fontWeight: 300, color: 'rgba(255,255,255,0.3)', maxWidth: '260px', lineHeight: 1.6 }}>
              Timeless design, modern sensibility.
            </p>
          </div>

          {[
            { title: 'Shop', items: ['New Arrivals', 'Dresses', 'Outerwear', 'Accessories'] },
            { title: 'Marquise', items: ['Our Story', 'Craftsmanship', 'Sustainability'] },
            { title: 'Help', items: ['Contact', 'Shipping', 'Returns', 'Size Guide'] },
          ].map(col => (
            <div key={col.title}>
              <p style={{
                fontFamily: 'var(--sans)', fontSize: '0.58rem', fontWeight: 500,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)', marginBottom: '20px',
              }}>
                {col.title}
              </p>
              {col.items.map(item => (
                <Link key={item} to="/shop" style={{
                  display: 'block', fontSize: '0.82rem', fontWeight: 300,
                  color: 'rgba(255,255,255,0.35)', marginBottom: '12px',
                  transition: 'color 0.2s ease',
                }}
                  onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.8)'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}
                >
                  {item}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '20px 0' }}>
        <div className="container" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px',
        }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 300, color: 'rgba(255,255,255,0.2)' }}>
            &copy; {new Date().getFullYear()} Marquise
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy', 'Terms'].map(t => (
              <span key={t} style={{ fontSize: '0.7rem', fontWeight: 300, color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr repeat(3, 1fr);
          gap: 40px;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>
    </footer>
  );
}
