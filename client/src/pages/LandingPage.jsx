import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BookOpen, Brain, Calendar, Trophy, ChevronRight, GraduationCap, Users, Star, Zap, Shield, Clock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  { icon: Brain, title: 'Smart Priority Engine', desc: 'Scores every chapter by weight × PYQ frequency × difficulty ÷ confidence to give you the perfect study order.', color: '#1a3fa3' },
  { icon: Calendar, title: 'Auto-Rescheduling', desc: 'Skipped a task? StudyOS automatically pushes it to your next free slot — zero disruption to your plan.', color: '#00c9b1' },
  { icon: BookOpen, title: 'PYQ Repository', desc: 'Access CRPS Previous Year Questions organised by subject and year, uploaded directly by your teachers.', color: '#e8a020' },
  { icon: Trophy, title: 'Exam Readiness Score', desc: 'A live score that shows exactly how prepared you are and pinpoints what needs attention right now.', color: '#ff2d78' },
];

const STATS = [
  { value: '500+', label: 'Students Enrolled', icon: Users },
  { value: '98%', label: 'Board Pass Rate', icon: Star },
  { value: '12+', label: 'Subjects Covered', icon: BookOpen },
  { value: '24/7', label: 'Study Access', icon: Clock },
];

/* Floating geometric shapes */
function FloatingShapes() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {/* Large blobs */}
      <div className="hero-blob animate-float1" style={{
        width: 600, height: 600, top: -200, right: -200,
        background: 'radial-gradient(circle, rgba(26,63,163,0.08) 0%, transparent 70%)',
      }} />
      <div className="hero-blob animate-float2" style={{
        width: 400, height: 400, bottom: -100, left: -100,
        background: 'radial-gradient(circle, rgba(232,160,32,0.06) 0%, transparent 70%)',
      }} />
      <div className="hero-blob animate-float3" style={{
        width: 300, height: 300, top: '40%', left: '30%',
        background: 'radial-gradient(circle, rgba(0,201,177,0.05) 0%, transparent 70%)',
      }} />

      {/* Small geometric elements */}
      {[
        { top: '12%', left: '8%', size: 48, delay: 0, color: 'rgba(26,63,163,0.12)', rotate: 15 },
        { top: '25%', right: '6%', size: 36, delay: 1, color: 'rgba(232,160,32,0.15)', rotate: -20 },
        { bottom: '30%', left: '5%', size: 28, delay: 2, color: 'rgba(0,201,177,0.1)', rotate: 45 },
        { bottom: '20%', right: '8%', size: 52, delay: 0.5, color: 'rgba(255,45,120,0.08)', rotate: 10 },
        { top: '55%', left: '15%', size: 22, delay: 1.5, color: 'rgba(26,63,163,0.1)', rotate: 30 },
        { top: '70%', right: '15%', size: 32, delay: 2.5, color: 'rgba(232,160,32,0.1)', rotate: -15 },
      ].map((s, i) => (
        <div key={i} className={`animate-float${(i % 3) + 1}`}
          style={{
            position: 'absolute', top: s.top, bottom: s.bottom, left: s.left, right: s.right,
            width: s.size, height: s.size,
            background: s.color, borderRadius: 8,
            transform: `rotate(${s.rotate}deg)`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* Dotted grid pattern top right */}
      <div style={{
        position: 'absolute', top: 60, right: 60, opacity: 0.25,
        display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 10,
      }}>
        {Array.from({ length: 64 }).map((_, i) => (
          <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--school-blue)' }} />
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef    = useRef();
  const featRef    = useRef();
  const statsRef   = useRef();
  const schoolRef  = useRef();
  const ctaRef     = useRef();

  useEffect(() => {
    // Hero entrance
    gsap.fromTo('.hero-title .word',
      { opacity: 0, y: 60, rotationX: -40 },
      { opacity: 1, y: 0, rotationX: 0, stagger: 0.08, duration: 0.8, ease: 'back.out(1.4)', delay: 0.2 }
    );
    gsap.fromTo('.hero-sub', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.7 });
    gsap.fromTo('.hero-cta', { opacity: 0, y: 20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)', delay: 1 });
    gsap.fromTo('.hero-badge', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 });

    // School image & floating badges
    gsap.fromTo('.school-img-wrap',
      { opacity: 0, x: 80, scale: 0.9 },
      { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out', delay: 0.4 }
    );
    gsap.fromTo('.floating-badge',
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, stagger: 0.2, duration: 0.6, ease: 'back.out(2)', delay: 1.2 }
    );

    // Stats counter animation
    ScrollTrigger.create({
      trigger: '.stats-section',
      start: 'top 80%',
      onEnter: () => {
        gsap.fromTo('.stat-card',
          { opacity: 0, y: 40, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.6, ease: 'back.out(1.4)' }
        );
      }
    });

    // Features scroll animation
    ScrollTrigger.create({
      trigger: '.features-section',
      start: 'top 75%',
      onEnter: () => {
        gsap.fromTo('.feat-card',
          { opacity: 0, y: 50, rotationY: 12 },
          { opacity: 1, y: 0, rotationY: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out' }
        );
      }
    });

    // School section
    ScrollTrigger.create({
      trigger: '.school-section',
      start: 'top 75%',
      onEnter: () => {
        gsap.fromTo('.school-info-item',
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' }
        );
      }
    });

    // CTA
    ScrollTrigger.create({
      trigger: '.cta-section',
      start: 'top 80%',
      onEnter: () => {
        gsap.fromTo('.cta-section',
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
        );
      }
    });

    // Continuous floating for stat cards
    gsap.to('.stat-card', {
      y: -6, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.5,
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}
        className="grid-bg">
        <FloatingShapes />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', width: '100%', position: 'relative', zIndex: 1 }}>
          {/* Left */}
          <div>
            <div className="hero-badge" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 16px', borderRadius: 50,
              background: 'rgba(26,63,163,0.08)', border: '1px solid rgba(26,63,163,0.2)',
              marginBottom: 28, fontSize: 12, fontWeight: 700,
              color: 'var(--school-blue)', letterSpacing: '0.04em',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--school-blue)', animation: 'blink 1.5s infinite' }} />
              Chhotu Ram Public School, Bakhtawarpur
            </div>

            <h1 className="hero-title" style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: 'clamp(38px, 5vw, 62px)', lineHeight: 1.08,
              marginBottom: 24, color: 'var(--text-primary)',
              perspective: '600px',
            }}>
              {'Stop guessing.'.split(' ').map((w, i) => (
                <span key={i} className="word" style={{ display: 'inline-block', marginRight: 12 }}>{w}</span>
              ))}
              <br />
              {'Start preparing'.split(' ').map((w, i) => (
                <span key={i + 10} className="word gradient-text" style={{ display: 'inline-block', marginRight: 12 }}>{w}</span>
              ))}
              <span className="word gradient-text-gold" style={{ display: 'inline-block' }}>smart.</span>
            </h1>

            <p className="hero-sub" style={{
              fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.75,
              maxWidth: 460, marginBottom: 36,
            }}>
              CRPS's AI-powered study planner converts your syllabus and board exam dates into a personalised daily plan — with intelligent chapter prioritisation and previous year questions.
            </p>

            <div className="hero-cta" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <button className="btn-primary" onClick={() => navigate('/login')} style={{ fontSize: 15, padding: '14px 28px' }}>
                <Sparkles size={16} /> Get My Study Plan
              </button>
              <button onClick={() => navigate('/dashboard')} style={{
                fontSize: 14, padding: '13px 24px', borderRadius: 12,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all 0.2s ease',
              }}>
                View Demo <ChevronRight size={15} />
              </button>
            </div>
          </div>

          {/* Right – School Building */}
          {/*
            ┌─────────────────────────────────────────────────────────────────┐
            │  SCHOOL IMAGE SETUP:                                            │
            │  1. Save your school building photo as:                         │
            │       client/public/images/crps-school.png                      │
            │  2. This component will automatically display it below          │
            └─────────────────────────────────────────────────────────────────┘
          */}
          <div className="school-img-wrap" style={{ position: 'relative' }}>
            <div className="school-frame" style={{
              width: '100%', aspectRatio: '4/3',
              background: 'linear-gradient(135deg, #eef1ff 0%, #dde3f5 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 12,
            }}>
              <img
                src="/images/crps-school.png"
                alt="Chhotu Ram Public School, Bakhtawarpur"
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {/* Fallback placeholder when image missing */}
              <div style={{
                display: 'none', flexDirection: 'column', alignItems: 'center', gap: 12,
                position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #eef1ff, #dde3f5)',
                justifyContent: 'center',
              }}>
                <div style={{ width: 80, height: 80, borderRadius: 20, background: 'rgba(26,63,163,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GraduationCap size={40} color="var(--school-blue)" />
                </div>
                <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--school-blue)', textAlign: 'center', lineHeight: 1.4 }}>
                  Chhotu Ram Public School<br />
                  <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-muted)' }}>Bakhtawarpur, Delhi - 36</span>
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 220 }}>
                  Add your school photo at:<br />
                  <code style={{ background: 'rgba(26,63,163,0.08)', padding: '2px 6px', borderRadius: 4 }}>
                    client/public/images/crps-school.jpg
                  </code>
                </p>
              </div>

              {/* Overlay gradient */}
              <div style={{
                position: 'absolute', inset: 0, borderRadius: 24,
                background: 'linear-gradient(to bottom, transparent 55%, rgba(10,26,92,0.65) 100%)',
                pointerEvents: 'none',
              }} />

              {/* School name overlay */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '20px 24px', zIndex: 5,
              }}>
                <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 16, color: 'white', marginBottom: 2 }}>
                  Chhotu Ram Public School
                </p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>Bakhtawarpur, Delhi - 36 • Est. 1985</p>
              </div>
            </div>

            {/* Floating badges around the image */}
            <div className="floating-badge animate-float1" style={{ top: -16, left: -24 }}>
              <Trophy size={15} color="#e8a020" />
              <span>Board Toppers 🏆</span>
            </div>
            <div className="floating-badge animate-float2" style={{ top: 80, right: -28 }}>
              <Zap size={15} color="#1a3fa3" />
              <span>AI Powered</span>
            </div>
            <div className="floating-badge animate-float3" style={{ bottom: 60, left: -28 }}>
              <Shield size={15} color="#00c9b1" />
              <span>98% Pass Rate</span>
            </div>

            {/* Decorative ring */}
            <div style={{
              position: 'absolute', top: -20, right: -20, width: 100, height: 100,
              borderRadius: '50%', border: '2px dashed rgba(232,160,32,0.3)',
              animation: 'rotateSpin 20s linear infinite',
            }} />
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          animation: 'float2 2.5s ease-in-out infinite',
        }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em' }}>SCROLL</span>
          <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, var(--school-blue), transparent)' }} />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-section" style={{ padding: '64px 32px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {STATS.map((s, i) => (
            <div key={i} className="stat-card card" style={{ padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(26,63,163,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <s.icon size={22} color="var(--school-blue)" />
              </div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 32, color: 'var(--text-primary)', marginBottom: 4 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section" style={{ padding: '100px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div className="hero-blob animate-floatX" style={{
            width: 500, height: 500, top: -100, right: -150,
            background: 'radial-gradient(circle, rgba(232,160,32,0.05) 0%, transparent 70%)',
          }} />
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="tag tag-blue" style={{ marginBottom: 14 }}>
              <Sparkles size={10} /> Features
            </div>
            <h2 className="section-title" style={{ marginBottom: 14 }}>
              Everything you need to <span className="gradient-text">ace your boards</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              Built specifically for CRPS students — combining AI-driven study planning with school-specific PYQs.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="feat-card card" style={{ padding: '32px 26px', position: 'relative', overflow: 'hidden' }}>
                {/* Background accent */}
                <div style={{
                  position: 'absolute', top: -20, right: -20, width: 80, height: 80,
                  borderRadius: '50%', background: `${f.color}10`,
                  filter: 'blur(20px)',
                }} />
                <div style={{
                  width: 50, height: 50, borderRadius: 14,
                  background: `${f.color}15`, border: `1px solid ${f.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 18,
                }}>
                  <f.icon size={22} color={f.color} />
                </div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 10, color: 'var(--text-primary)' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCHOOL SECTION ── */}
      <section className="school-section" style={{ padding: '80px 32px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div className="tag tag-gold school-info-item" style={{ marginBottom: 16 }}>
              <Star size={10} /> About CRPS
            </div>
            <h2 className="section-title school-info-item" style={{ marginBottom: 20 }}>
              Serving excellence at<br /><span className="gradient-text-gold">Bakhtawarpur since 1985</span>
            </h2>
            {[
              { label: 'Location', value: 'Bakhtawarpur, Delhi – 110036', icon: '📍' },
              { label: 'Affiliation', value: 'CBSE Board – Class VI to XII', icon: '🏫' },
              { label: 'Specialisation', value: 'Science & Commerce Streams', icon: '🔬' },
              { label: 'Student Strength', value: '500+ Students Per Year', icon: '👨‍🎓' },
            ].map((item, i) => (
              <div key={i} className="school-info-item" style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px', borderRadius: 12, marginBottom: 8,
                background: 'var(--bg-primary)', border: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
                  <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quote + CTA box */}
          <div style={{ position: 'relative' }}>
            <div className="card" style={{ padding: '36px 32px', position: 'relative', overflow: 'hidden', border: '2px solid rgba(26,63,163,0.15)' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                background: 'linear-gradient(90deg, var(--school-blue), var(--school-gold))',
              }} />
              <div style={{ fontSize: 40, marginBottom: 16 }}>💡</div>
              <blockquote style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: 12 }}>
                "Knowledge is the foundation of every achievement."
              </blockquote>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28 }}>
                CRPS StudyOS is built to help every student at Bakhtawarpur reach their full academic potential through structured, intelligent preparation.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="btn-primary" onClick={() => navigate('/login')} style={{ fontSize: 14, padding: '11px 22px' }}>
                  <Users size={15} /> Login as Student
                </button>
                <button className="btn-gold" onClick={() => navigate('/login')} style={{ fontSize: 14, padding: '11px 22px' }}>
                  <GraduationCap size={15} /> Login as Teacher
                </button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="animate-float2" style={{
              position: 'absolute', top: -24, right: -24, width: 80, height: 80,
              borderRadius: 20, background: 'rgba(232,160,32,0.1)',
              border: '2px dashed rgba(232,160,32,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32,
            }}>🎓</div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="cta-section" style={{ padding: '80px 32px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            padding: '56px 40px', borderRadius: 28,
            background: 'linear-gradient(135deg, var(--school-blue), #2a55d4)',
            boxShadow: '0 24px 80px rgba(26,63,163,0.35)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Background shapes */}
            <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
            <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

            <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28, color: 'white', marginBottom: 12, lineHeight: 1.2 }}>
              Ready to top your board exams?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, marginBottom: 32, lineHeight: 1.7 }}>
              Join hundreds of CRPS students already using StudyOS to plan smarter, revise faster, and score higher.
            </p>
            <button onClick={() => navigate('/login')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 14,
              background: 'white', color: 'var(--school-blue)',
              fontWeight: 700, fontSize: 15, cursor: 'pointer', border: 'none',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              transition: 'all 0.25s ease',
            }}>
              <Sparkles size={16} /> Get Started — It's Free
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: '28px 32px', background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)', textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #1a3fa3, #3a5fd4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={14} color="white" />
          </div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
            CRPS StudyOS
          </span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Chhotu Ram Public School, Bakhtawarpur, Delhi – 110036 · © {new Date().getFullYear()} All Rights Reserved
        </p>
      </footer>
    </div>
  );
}