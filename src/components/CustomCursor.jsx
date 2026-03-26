import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { damping: 28, stiffness: 400, mass: 0.5 });
  const springY = useSpring(cursorY, { damping: 28, stiffness: 400, mass: 0.5 });
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [isMouse, setIsMouse] = useState(false);
  const addedClass = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsMouse(mq.matches);
    if (!mq.matches) return;

    /* Hide default cursor globally */
    document.documentElement.classList.add('cc-cursor');
    addedClass.current = true;

    const onMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    const onOver = (e) => {
      if (
        e.target.closest(
          'a, button, [role="button"], input, textarea, select, [data-cursor="hover"], label'
        )
      ) {
        setHovered(true);
      }
    };

    const onOut = (e) => {
      if (
        e.target.closest(
          'a, button, [role="button"], input, textarea, select, [data-cursor="hover"], label'
        )
      ) {
        setHovered(false);
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseout', onOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      if (addedClass.current) {
        document.documentElement.classList.remove('cc-cursor');
        addedClass.current = false;
      }
    };
  }, [cursorX, cursorY]);

  if (!isMouse) return null;

  const dotSize = pressed ? 4 : 6;
  const ringSize = hovered ? 52 : pressed ? 20 : 32;

  return (
    <>
      {/* Inner dot — follows exactly */}
      <motion.div
        style={{
          position: 'fixed',
          left: cursorX,
          top: cursorY,
          width: dotSize,
          height: dotSize,
          marginLeft: -dotSize / 2,
          marginTop: -dotSize / 2,
          borderRadius: '50%',
          background: '#fff',
          pointerEvents: 'none',
          zIndex: 99999,
          mixBlendMode: 'difference',
          transition: 'width 0.2s, height 0.2s, margin 0.2s',
        }}
      />

      {/* Outer ring — follows with spring lag */}
      <motion.div
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: pressed ? 0.15 : hovered ? 0.5 : 0.25,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        style={{
          position: 'fixed',
          left: springX,
          top: springY,
          x: '-50%',
          y: '-50%',
          borderRadius: '50%',
          border: '1px solid #fff',
          pointerEvents: 'none',
          zIndex: 99998,
          mixBlendMode: 'difference',
        }}
      />
    </>
  );
}
