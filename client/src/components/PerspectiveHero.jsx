import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion';
import ReactLenis from 'lenis/react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const PerspectiveHero = ({ user, postCount, writerCount }) => {
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  });

  // Text rises from below as user scrolls
  const yMotionValue = useTransform(scrollYProgress, [0, 1], [120, -60]);
  const opacity      = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.6, 0]);
  const scale        = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const transform    = useMotionTemplate`rotateX(18deg) translateY(${yMotionValue}px) translateZ(0px)`;

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.4, smoothWheel: true }}>
      <div
        ref={targetRef}
        className="relative z-0 overflow-hidden border-b"
        style={{
          background: '#020617',
          minHeight: '92vh',
          borderColor: 'rgba(255,255,255,0.05)',
        }}
      >
        {/* ── Orbs ─────────────────────────────────────── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { top:'-15%', left:'-5%',  w:'550px', h:'550px', c:'rgba(99,102,241,0.28)', blur:'70px', a:'orbFloat1 12s ease-in-out infinite' },
            { top:'5%',   right:'-8%', w:'600px', h:'600px', c:'rgba(139,92,246,0.22)', blur:'90px', a:'orbFloat2 15s ease-in-out infinite' },
            { bottom:'-20%', left:'25%', w:'400px', h:'400px', c:'rgba(59,130,246,0.15)', blur:'60px', a:'orbFloat3 18s ease-in-out infinite' },
          ].map((o, i) => (
            <div key={i} style={{
              position:'absolute', top:o.top, left:o.left,
              right:o.right, bottom:o.bottom,
              width:o.w, height:o.h, borderRadius:'50%',
              background:`radial-gradient(circle,${o.c} 0%,transparent 70%)`,
              filter:`blur(${o.blur})`, animation:o.a,
            }}/>
          ))}
        </div>

        {/* ── Grid ─────────────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage:'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)',
          backgroundSize:'60px 60px',
        }}/>

        {/* ── 3D Perspective Text ───────────────────────── */}
        <div
          className="sticky top-0 flex flex-col items-center justify-center px-4"
          style={{
            minHeight: '92vh',
            transformStyle: 'preserve-3d',
            perspective: '800px',
          }}
        >
          <motion.div
            style={{
              transformStyle: 'preserve-3d',
              transform,
              opacity,
              scale,
            }}
            className="w-full max-w-5xl text-center"
          >
            {/* Pill badge */}
            <motion.div
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, delay:0.1 }}
            >
              <span
                className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-6"
                style={{
                  background:'rgba(99,102,241,0.15)',
                  color:'#a5b4fc',
                  border:'1px solid rgba(99,102,241,0.3)',
                }}
              >
                ✦ A space to think and share
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity:0, y:30 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.7, delay:0.2 }}
              className="font-extrabold tracking-tight leading-none mb-6"
              style={{ fontSize:'clamp(3rem, 8vw, 6rem)' }}
            >
              <span className="text-white">Ideas worth </span>
              <span style={{
                background:'linear-gradient(135deg,#818cf8 0%,#c084fc 50%,#818cf8 100%)',
                backgroundSize:'200% auto',
                WebkitBackgroundClip:'text',
                WebkitTextFillColor:'transparent',
                animation:'shimmer 3s linear infinite',
              }}>
                reading
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, delay:0.35 }}
              className="text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed"
              style={{ fontSize:'clamp(0.95rem, 2vw, 1.1rem)' }}
            >
              Discover stories, insights, and perspectives from writers
              on the topics that matter most to you.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, delay:0.45 }}
              className="flex items-center justify-center gap-4 mb-12 flex-wrap"
            >
              {user ? (
                <Link
                  to="/create"
                  className="font-semibold px-7 py-3 rounded-xl text-white text-sm transition-all duration-200 hover:scale-105"
                  style={{
                    background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
                    boxShadow:'0 0 32px rgba(99,102,241,0.45)',
                  }}
                >
                  Write a post
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="font-semibold px-7 py-3 rounded-xl text-white text-sm transition-all duration-200 hover:scale-105"
                    style={{
                      background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
                      boxShadow:'0 0 32px rgba(99,102,241,0.45)',
                    }}
                  >
                    Start writing free
                  </Link>
                  <Link
                    to="/login"
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1"
                  >
                    Sign in <span>→</span>
                  </Link>
                </>
              )}
            </motion.div>

            {/* Stats */}
            {postCount > 0 && (
              <motion.div
                initial={{ opacity:0 }}
                animate={{ opacity:1 }}
                transition={{ duration:0.6, delay:0.6 }}
                className="flex items-center justify-center gap-8 text-sm text-gray-500"
              >
                <div>
                  <span className="text-white font-bold text-xl">{postCount}</span>
                  <span className="ml-1.5">posts</span>
                </div>
                <div className="w-px h-4" style={{ background:'rgba(255,255,255,0.1)' }}/>
                <div>
                  <span className="text-white font-bold text-xl">{writerCount}</span>
                  <span className="ml-1.5">writers</span>
                </div>
                <div className="w-px h-4" style={{ background:'rgba(255,255,255,0.1)' }}/>
                <div>
                  <span className="text-white font-bold text-xl">∞</span>
                  <span className="ml-1.5">ideas</span>
                </div>
              </motion.div>
            )}

            {/* Scroll hint */}
            <motion.div
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              transition={{ duration:1, delay:1 }}
              className="mt-14 flex flex-col items-center gap-2"
              style={{ color:'rgba(255,255,255,0.2)' }}
            >
              <span className="text-xs uppercase tracking-widest">scroll</span>
              <motion.div
                animate={{ y:[0,8,0] }}
                transition={{ duration:1.5, repeat:Infinity, ease:'easeInOut' }}
                className="w-px h-8"
                style={{ background:'linear-gradient(to bottom,rgba(99,102,241,0.6),transparent)' }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom fade to content */}
        <div
          className="absolute bottom-0 left-0 w-full h-32 pointer-events-none"
          style={{ background:'linear-gradient(to bottom,transparent,#020617)' }}
        />
      </div>
    </ReactLenis>
  );
};

export default PerspectiveHero;