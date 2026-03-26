import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const links = [
  { label: 'Shop', path: '/shop' },
  { label: 'Lookbook', path: '/lookbook' },
];

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const dark = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const fg = dark ? 'rgba(255,255,255,0.7)' : 'var(--text-light)';
  const fgHover = dark ? '#fff' : 'var(--text)';

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--nav-h)',
        zIndex: 1000,
        background: dark ? 'transparent' : 'rgba(254,254,254,0.92)',
        backdropFilter: dark ? 'none' : 'blur(16px)',
        borderBottom: dark ? 'none' : '1px solid var(--border)',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          maxWidth: 'var(--max-w)',
          margin: '0 auto',
          padding: '0 48px',
        }}>
          {/* Left links */}
          <div className="nav-desk" style={{ display: 'flex', gap: '32px', flex: 1 }}>
            {links.map(l => (
              <Link key={l.path} to={l.path} style={{
                fontFamily: 'var(--sans)',
                fontSize: '0.6rem',
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: fg,
                transition: 'color 0.3s ease',
              }}
                onMouseEnter={e => e.target.style.color = fgHover}
                onMouseLeave={e => e.target.style.color = fg}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/marquise-logo-clean.png"
              alt="Marquise"
              style={{
                height: '64px',
                width: 'auto',
                objectFit: 'contain',
                transition: 'filter 0.4s ease',
                filter: dark ? 'brightness(1.3)' : 'none',
              }}
            />
          </Link>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flex: 1, justifyContent: 'flex-end' }}>
            <Link to="/admin" className="nav-desk" style={{
              fontFamily: 'var(--sans)',
              fontSize: '0.6rem',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: fg,
              transition: 'color 0.3s ease',
              display: 'inline',
            }}
              onMouseEnter={e => e.target.style.color = fgHover}
              onMouseLeave={e => e.target.style.color = fg}
            >
              Atelier
            </Link>

            <button onClick={() => setIsOpen(true)} style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: fg,
              transition: 'color 0.3s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.color = fgHover}
              onMouseLeave={e => e.currentTarget.style.color = fg}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-8px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: 'var(--text)',
                    color: 'var(--text-inv)',
                    fontSize: '0.5rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...(dark ? { background: '#fff', color: '#111' } : {}),
                  }}
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button className="nav-mob" onClick={() => setMobileOpen(!mobileOpen)} style={{
              display: 'none',
              flexDirection: 'column',
              gap: '5px',
              padding: '4px',
            }}>
              {[0,1,2].map(i => (
                <span key={i} style={{
                  display: 'block',
                  width: '18px',
                  height: '1.5px',
                  background: dark ? '#fff' : 'var(--text)',
                  transition: 'all 0.3s ease',
                  ...(mobileOpen && i === 0 ? { transform: 'rotate(45deg) translate(4px,4px)' } : {}),
                  ...(mobileOpen && i === 1 ? { opacity: 0 } : {}),
                  ...(mobileOpen && i === 2 ? { transform: 'rotate(-45deg) translate(4px,-4px)' } : {}),
                }} />
              ))}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              top: 'var(--nav-h)',
              background: 'rgba(254,254,254,0.98)',
              backdropFilter: 'blur(16px)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '36px',
            }}
          >
            {[...links, { label: 'Atelier', path: '/admin' }].map((l, i) => (
              <motion.div key={l.path} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Link to={l.path} style={{
                  fontFamily: 'var(--serif)',
                  fontSize: '1.8rem',
                  fontWeight: 300,
                  color: 'var(--text)',
                }}>
                  {l.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-desk { display: flex !important; }
        .nav-mob { display: none !important; }
        @media (max-width: 768px) {
          .nav-desk { display: none !important; }
          .nav-mob { display: flex !important; }
        }
      `}</style>
    </>
  );
}
