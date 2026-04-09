import { useState, useEffect, useCallback } from 'react';

/*
  Luxury intro — think Dior: restrained, precise, confident.
  Pure CSS keyframes for the sequencing (avoids Framer Motion race conditions).
*/

export default function IntroScreen({ onComplete }) {
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  const finish = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setGone(true);
      onComplete();
    }, 1000);
  }, [onComplete]);

  useEffect(() => {
    const seen = sessionStorage.getItem('intro_seen');
    const timer = setTimeout(finish, seen ? 1200 : 3600);
    sessionStorage.setItem('intro_seen', '1');
    return () => clearTimeout(timer);
  }, [finish]);

  if (gone) return null;

  return (
    <div
      className={`intro ${exiting ? 'intro--exit' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0C0B0A',
        overflow: 'hidden',
      }}
    >
      {/* Warm ambient glow */}
      <div className="intro__glow" />

      {/* Centre content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Gold line above */}
        <div className="intro__line intro__line--top" />

        {/* Logo */}
        <div className="intro__logo-wrap">
          <img
            src="/marquise-logo-clean.png"
            alt="Marquise"
            className="intro__logo"
          />
          {/* Light sweep */}
          <div className="intro__sweep" />
        </div>

        {/* Tagline */}
        <p className="intro__tagline">Atelier de Haute Couture</p>

        {/* Gold line below */}
        <div className="intro__line intro__line--bottom" />
      </div>

      {/* Subtle film grain */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 3,
        pointerEvents: 'none',
        opacity: 0.035,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
      }} />

      <style>{`
        /* ── Glow ── */
        .intro__glow {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(184,149,106,0.07) 0%, transparent 70%);
          opacity: 0;
          animation: introGlow 2.4s 0.3s ease-out forwards;
          pointer-events: none;
        }

        @keyframes introGlow {
          0%   { opacity: 0; transform: scale(0.6); }
          100% { opacity: 1; transform: scale(1); }
        }

        /* ── Gold lines ── */
        .intro__line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(184,149,106,0.5), transparent);
          transform: scaleX(0);
        }

        .intro__line--top {
          width: 100px;
          margin-bottom: 44px;
          animation: introLine 1s 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
        }

        .intro__line--bottom {
          width: 60px;
          margin-top: 36px;
          animation: introLine 1s 2.2s cubic-bezier(0.16,1,0.3,1) forwards;
        }

        @keyframes introLine {
          to { transform: scaleX(1); }
        }

        /* ── Logo ── */
        .intro__logo-wrap {
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(10px);
          animation: introLogoIn 1.4s 0.9s cubic-bezier(0.16,1,0.3,1) forwards;
        }

        .intro__logo {
          width: min(480px, 80vw);
          height: auto;
          display: block;
        }

        @keyframes introLogoIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ── Light sweep across logo ── */
        .intro__sweep {
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            105deg,
            transparent 30%,
            rgba(184,149,106,0.12) 45%,
            rgba(255,255,255,0.06) 50%,
            rgba(184,149,106,0.12) 55%,
            transparent 70%
          );
          animation: introSweep 1.6s 1.8s cubic-bezier(0.16,1,0.3,1) forwards;
          pointer-events: none;
        }

        @keyframes introSweep {
          to { left: 200%; }
        }

        /* ── Tagline ── */
        .intro__tagline {
          font-family: 'Jost', sans-serif;
          font-size: 0.6rem;
          font-weight: 400;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: rgba(184,149,106,0.5);
          margin-top: 20px;
          opacity: 0;
          transform: translateY(6px);
          animation: introTagIn 0.9s 2s cubic-bezier(0.16,1,0.3,1) forwards;
        }

        @keyframes introTagIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ── Exit — everything fades up and out ── */
        .intro--exit {
          animation: introExit 1s cubic-bezier(0.65,0,0.35,1) forwards;
        }

        @keyframes introExit {
          0%   { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.03); }
        }
      `}</style>
    </div>
  );
}
