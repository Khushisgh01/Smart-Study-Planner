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
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {[
        { size: 180, top: '-5%', right: '5%', color: 'rgba(26,63,163,0.05)' },
        { size: 120, bottom: '10%', left: '5%', color: 'rgba(232,160,32,0.06)' },
        { size: 80,  top: '40%', right: '15%', color: 'rgba(0,201,177,0.05)' },
        { size: 60,  top: '20%', left: '10%', color: 'rgba(255,45,120,0.04)' },
      ].map((b, i) => (
        <div key={i} className={`animate-float${(i%3)+1}`} style={{
          position: 'absolute', top: b.top, bottom: b.bottom, left: b.left, right: b.right,
          width: b.size, height: b.size, borderRadius: '50%', background: b.color, filter: 'blur(20px)',
        }} />
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
      { opacity: 0, y: 40, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.5)' }
    );
    gsap.fromTo('.option-btn',
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, stagger: 0.08, duration: 0.4, ease: 'power2.out', delay: 0.2 }
    );
  };

  useEffect(() => { animateIn(); }, [step]);

  const select = (id, val) => {
    setAnswers(a => ({ ...a, [id]: val }));
    gsap.fromTo(`.option-btn[data-val="${val}"]`,
      { scale: 0.96 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' }
    );
  };

  const current = steps[step];
  const isHoursStep = step === steps.length;

  const handleNext = () => {
    gsap.to(containerRef.current, { opacity: 0, x: -30, duration: 0.25, ease: 'power2.in', onComplete: () => {
      if (!isHoursStep) setStep(s => s + 1);
      else setDone(true);
    }});
  };

  const handleBack = () => {
    gsap.to(containerRef.current, { opacity: 0, x: 30, duration: 0.25, ease: 'power2.in', onComplete: () => {
      setStep(s => Math.max(0, s - 1));
    }});
  };

  if (done) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24, padding: 24, position: 'relative', overflow: 'hidden' }}>
        <FloatingBubbles />
        <div style={{ fontSize: 80, animation: 'float2 3s ease-in-out infinite' }}>🎉</div>
        <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 32, textAlign: 'center', color: 'var(--text-primary)' }}>
          Your plan is <span className="gradient-text">ready!</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 360, lineHeight: 1.7 }}>
          Your personalised CRPS study timetable has been generated based on your preferences and board exam dates.
        </p>
        <button className="btn-primary" onClick={() => navigate('/dashboard')} style={{ fontSize: 15, padding: '14px 32px' }}>
          Go to Dashboard →
        </button>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      <FloatingBubbles />
      <div style={{ maxWidth: 560, width: '100%', display: 'flex', flexDirection: 'column', gap: 28, position: 'relative', zIndex: 1 }}>

        {/* Progress bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
            <span>Step {step + 1} of {steps.length + 1}</span>
            <span>{Math.round(((step) / (steps.length + 1)) * 100)}% complete</span>
          </div>
          <div style={{ height: 5, borderRadius: 5, background: 'var(--border)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 5,
              width: `${(step / (steps.length + 1)) * 100}%`,
              background: 'linear-gradient(90deg, var(--school-blue), #6a8fff)',
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>

        <div ref={containerRef} className="card" style={{ padding: 40 }}>
          {!isHoursStep ? (
            <>
              <div style={{ fontSize: 52, marginBottom: 12, textAlign: 'center' }}>{current.emoji}</div>
              <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 24, textAlign: 'center', marginBottom: 28, color: 'var(--text-primary)' }}>
                {current.title}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {current.options.map(opt => (
                  <button key={opt.value} data-val={opt.value} className="option-btn"
                    onClick={() => select(current.id, opt.value)}
                    style={{
                      padding: '16px 20px', borderRadius: 14, textAlign: 'left',
                      background: answers[current.id] === opt.value ? 'rgba(26,63,163,0.08)' : 'var(--bg-primary)',
                      border: `2px solid ${answers[current.id] === opt.value ? 'var(--school-blue)' : 'var(--border)'}`,
                      cursor: 'pointer', transition: 'all 0.25s ease',
                      transform: answers[current.id] === opt.value ? 'scale(1.01)' : 'scale(1)',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 3 }}>{opt.label}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 52, marginBottom: 12, textAlign: 'center' }}>⏰</div>
              <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 24, textAlign: 'center', marginBottom: 8, color: 'var(--text-primary)' }}>
                Daily study hours?
              </h2>
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 32 }}>Be honest — we'll build around your real schedule</p>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 68, color: 'var(--school-blue)' }}>{hours}</span>
                <span style={{ fontSize: 26, color: 'var(--text-muted)' }}> hrs</span>
              </div>
              <input type="range" min={1} max={12} value={hours} onChange={e => setHours(+e.target.value)}
                style={{ width: '100%', accentColor: 'var(--school-blue)', height: 6, cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 11, color: 'var(--text-muted)' }}>
                <span>1 hr · Light</span><span>6 hrs · Serious</span><span>12 hrs · Beast</span>
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={handleBack} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 10,
            background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)',
            cursor: 'pointer', fontSize: 14, fontWeight: 500,
          }}>
            <ChevronLeft size={15} /> Back
          </button>
          <button className="btn-primary"
            onClick={handleNext}
            disabled={!isHoursStep && !answers[current?.id]}
            style={{ opacity: (!isHoursStep && !answers[current?.id]) ? 0.45 : 1, fontSize: 14, padding: '10px 24px' }}
          >
            {isHoursStep ? <><Sparkles size={15} /> Generate My Plan</> : <>Next <ChevronRight size={15} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}