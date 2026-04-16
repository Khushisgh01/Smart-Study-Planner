import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useApp } from '../context/AppContext';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    id: 'level', title: "What's your study style?", emoji: '🎯',
    options: [
      { value: 'topper',      label: 'Topper 🚀',       desc: 'I study consistently and want top ranks' },
      { value: 'average',     label: 'Average ⚡',       desc: 'I want a solid score without burning out' },
      { value: 'last-minute', label: 'Last-Minute 😅',  desc: 'Exams are soon, need an emergency plan' },
    ]
  },
  {
    id: 'target', title: "What's your goal?", emoji: '🏆',
    options: [
      { value: 'pass', label: 'Just Pass 🙏',  desc: 'Secure passing marks comfortably' },
      { value: 'good', label: 'Good Score 📈', desc: '70%+ and feel confident' },
      { value: 'top',  label: 'Top Rank 🥇',  desc: 'Maximize marks, no chapter left behind' },
    ]
  },
];

function FloatingBubbles() {
  const bubbles = Array.from({ length: 25 }).map((_, i) => ({
    id: i, size: Math.random() * 150 + 50, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
    color: ['rgba(26,63,163,0.06)', 'rgba(232,160,32,0.06)', 'rgba(0,201,177,0.06)', 'rgba(255,45,120,0.04)'][Math.floor(Math.random() * 4)],
  }));

  useEffect(() => {
    gsap.to('.obs-bubble', {
      y: () => `random(-150, 150)`, x: () => `random(-150, 150)`,
      scale: () => `random(0.8, 1.2)`, duration: () => `random(4, 8)`,
      repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.1,
    });
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {bubbles.map(b => (
        <div key={b.id} className="obs-bubble" style={{
          position: 'absolute', top: b.top, left: b.left,
          width: b.size, height: b.size, borderRadius: '50%', background: b.color, filter: 'blur(20px)',
        }} />
      ))}
    </div>
  );
}

// Anime widgets for Onboarding
function MovingWidgets() {
  const widgets = [
    { img: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Hiro&backgroundColor=b6e3f4', text: 'Packing bag...', y: '10%', speed: 20, dir: 1, delay: 0 },
    { img: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Mei&backgroundColor=c0aede', text: 'Watching tutorials', y: '30%', speed: 26, dir: -1, delay: 2 },
    { img: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Riku&backgroundColor=ffdfbf', text: 'Sports practice', y: '75%', speed: 16, dir: 1, delay: 1 },
    { img: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Sora&backgroundColor=d1d4f9', text: 'Exams tomorrow! 😭', y: '85%', speed: 24, dir: -1, delay: 4 },
  ];

  useEffect(() => {
    widgets.forEach((w, i) => {
      const el = `.onb-widget-${i}`;
      gsap.fromTo(el, { x: w.dir === 1 ? '-20vw' : '120vw' }, { x: w.dir === 1 ? '120vw' : '-20vw', duration: w.speed, repeat: -1, ease: 'linear', delay: w.delay });
      gsap.to(el, { y: '+=30', rotation: () => `random(-5, 5)`, duration: 'random(2, 4)', repeat: -1, yoyo: true, ease: 'sine.inOut', delay: w.delay });
    });

    gsap.to('.onb-anime-avatar', {
      y: -6, duration: 0.3, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.1
    });
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {widgets.map((w, i) => (
        <div key={i} className={`onb-widget-${i}`} style={{
          position: 'absolute', top: w.y,
          background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.9)', padding: '8px 16px 8px 8px',
          borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)', whiteSpace: 'nowrap'
        }}>
          <img className="onb-anime-avatar" src={w.img} alt="anime student" style={{ 
            width: 44, height: 44, borderRadius: '50%', border: '2px solid white', 
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)' 
          }} />
          <span style={{ fontWeight: 800, color: '#2b3044', fontSize: 13, fontFamily: 'Syne, sans-serif' }}>{w.text}</span>
        </div>
      ))}
    </div>
  );
}

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [hours, setHours] = useState(4);
  const [done, setDone] = useState(false);
  const containerRef = useRef();
  const navigate = useNavigate();

  const animateIn = () => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 60, scale: 0.9, rotationX: 10 },
      { opacity: 1, y: 0, scale: 1, rotationX: 0, duration: 0.7, ease: 'back.out(1.5)', transformPerspective: 1000 }
    );
    gsap.fromTo('.option-btn',
      { opacity: 0, x: -30, scale: 0.95 },
      { opacity: 1, x: 0, scale: 1, stagger: 0.1, duration: 0.5, ease: 'back.out(1.2)', delay: 0.2 }
    );
  };

  useEffect(() => { animateIn(); }, [step]);

  const select = (id, val) => {
    setAnswers(a => ({ ...a, [id]: val }));
    gsap.fromTo(`.option-btn[data-val="${val}"]`,
      { scale: 0.9, rotation: -2 }, { scale: 1.02, rotation: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' }
    );
  };

  const current = steps[step];
  const isHoursStep = step === steps.length;

  const handleNext = () => {
    gsap.to(containerRef.current, { opacity: 0, x: -50, duration: 0.3, ease: 'power2.in', onComplete: () => {
      if (!isHoursStep) setStep(s => s + 1);
      else {
        setDone(true);
        gsap.fromTo('.success-emoji', { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 1, ease: 'elastic.out(1, 0.4)' });
        gsap.to('.success-emoji', { y: -20, duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });
      }
    }});
  };

  const handleBack = () => {
    gsap.to(containerRef.current, { opacity: 0, x: 50, duration: 0.3, ease: 'power2.in', onComplete: () => {
      setStep(s => Math.max(0, s - 1));
    }});
  };

  if (done) {
    return (
      <div style={{ flex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24, padding: 24, position: 'relative', overflowX: 'hidden', overflowY: 'auto' }}>
        <FloatingBubbles />
        <MovingWidgets />
        <div className="success-emoji" style={{ fontSize: 80, zIndex: 1 }}>🎉</div>
        <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 36, textAlign: 'center', color: 'var(--text-primary)', zIndex: 1 }}>
          Your plan is <span className="gradient-text">ready!</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 360, lineHeight: 1.7, zIndex: 1 }}>
          Your personalised CRPS study timetable has been generated based on your preferences and board exam dates.
        </p>
        <button className="btn-primary" onClick={() => navigate('/dashboard')} style={{ fontSize: 16, padding: '16px 36px', zIndex: 1, marginTop: 10 }}
          onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.05, boxShadow: '0 10px 30px rgba(26,63,163,0.3)' })}
          onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, boxShadow: 'none' })}>
          Go to Dashboard →
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative', overflowX: 'hidden', overflowY: 'auto' }}>
      <FloatingBubbles />
      <MovingWidgets />
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 560, width: '100%', display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Progress bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
              <span>Step {step + 1} of {steps.length + 1}</span>
              <span>{Math.round(((step) / (steps.length + 1)) * 100)}% complete</span>
            </div>
            <div style={{ height: 6, borderRadius: 6, background: 'var(--border)', overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{
                height: '100%', borderRadius: 6, width: `${(step / (steps.length + 1)) * 100}%`,
                background: 'linear-gradient(90deg, #1a3fa3, #6a8fff)', boxShadow: '0 0 10px rgba(26,63,163,0.5)',
                transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }} />
            </div>
          </div>

          <div ref={containerRef} className="card" style={{ padding: 40, boxShadow: '0 20px 60px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.5)', backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.85)' }}>
            {!isHoursStep ? (
              <>
                <div style={{ fontSize: 52, marginBottom: 12, textAlign: 'center' }}>{current.emoji}</div>
                <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 26, textAlign: 'center', marginBottom: 32, color: 'var(--text-primary)' }}>
                  {current.title}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {current.options.map(opt => (
                    <button key={opt.value} data-val={opt.value} className="option-btn"
                      onClick={() => select(current.id, opt.value)}
                      onMouseEnter={e => { if(answers[current.id] !== opt.value) gsap.to(e.currentTarget, { scale: 1.02 }) }}
                      onMouseLeave={e => { if(answers[current.id] !== opt.value) gsap.to(e.currentTarget, { scale: 1 }) }}
                      style={{
                        padding: '18px 24px', borderRadius: 16, textAlign: 'left',
                        background: answers[current.id] === opt.value ? 'rgba(26,63,163,0.08)' : 'var(--bg-primary)',
                        border: `2px solid ${answers[current.id] === opt.value ? 'var(--school-blue)' : 'var(--border)'}`,
                        cursor: 'pointer', transition: 'background 0.3s, border 0.3s',
                        transform: answers[current.id] === opt.value ? 'scale(1.02)' : 'scale(1)',
                        boxShadow: answers[current.id] === opt.value ? '0 10px 25px rgba(26,63,163,0.1)' : 'none'
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)', marginBottom: 4 }}>{opt.label}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 52, marginBottom: 12, textAlign: 'center' }}>⏰</div>
                <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 26, textAlign: 'center', marginBottom: 8, color: 'var(--text-primary)' }}>
                  Daily study hours?
                </h2>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 36 }}>Be honest — we'll build around your real schedule</p>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 72, color: 'var(--school-blue)' }}>{hours}</span>
                  <span style={{ fontSize: 24, color: 'var(--text-muted)', fontWeight: 600 }}> hrs</span>
                </div>
                <input type="range" min={1} max={12} value={hours} onChange={e => {
                  setHours(+e.target.value);
                  gsap.fromTo('.card h2', { color: '#6a8fff' }, { color: 'var(--text-primary)', duration: 0.5 });
                }} style={{ width: '100%', accentColor: 'var(--school-blue)', height: 8, cursor: 'pointer', borderRadius: 4 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                  <span>1 hr · Light</span><span>6 hrs · Serious</span><span>12 hrs · Beast</span>
                </div>
              </>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={handleBack} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '12px 24px', borderRadius: 12,
              background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)',
              cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: '0.2s'
            }} onMouseEnter={e => gsap.to(e.currentTarget, { x: -4 })} onMouseLeave={e => gsap.to(e.currentTarget, { x: 0 })}>
              <ChevronLeft size={15} /> Back
            </button>
            <button className="btn-primary"
              onClick={handleNext}
              disabled={!isHoursStep && !answers[current?.id]}
              style={{ opacity: (!isHoursStep && !answers[current?.id]) ? 0.4 : 1, fontSize: 14, padding: '12px 28px', fontWeight: 700, borderRadius: 12 }}
              onMouseEnter={e => { if(isHoursStep || answers[current?.id]) gsap.to(e.currentTarget, { scale: 1.05 }) }}
              onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1 })}
            >
              {isHoursStep ? <><Sparkles size={16} /> Generate Plan</> : <>Next <ChevronRight size={16} /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}