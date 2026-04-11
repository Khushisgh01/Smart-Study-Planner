import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useApp } from '../context/AppContext';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

const steps = [
  {
    id: 'level', title: "What's your study style?", emoji: '🎯',
    options: [
      { value:'topper', label:'Topper 🚀', desc:'I study consistently and want top ranks' },
      { value:'average', label:'Average ⚡', desc:'I want a solid score without burning out' },
      { value:'last-minute', label:'Last-Minute 😅', desc:'Exams are soon, need an emergency plan' },
    ]
  },
  {
    id: 'target', title: "What's your goal?", emoji: '🏆',
    options: [
      { value:'pass', label:'Just Pass 🙏', desc:'Secure passing marks comfortably' },
      { value:'good', label:'Good Score 📈', desc:'70%+ and feel confident' },
      { value:'top', label:'Top Rank 🥇', desc:'Maximize marks, no chapter left behind' },
    ]
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [hours, setHours] = useState(4);
  const [done, setDone] = useState(false);
  const containerRef = useRef();
  const { setActiveView } = useApp();

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 40, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.4)' }
    );
  }, [step]);

  const select = (id, val) => {
    setAnswers(a => ({ ...a, [id]: val }));
  };

  const current = steps[step];

  if (done) {
    return (
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:24 }}>
        <div style={{ fontSize: 80 }}>🎉</div>
        <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:32, textAlign:'center' }}>
          Your plan is <span className="gradient-text">ready!</span>
        </h2>
        <p style={{ color:'var(--text-secondary)', textAlign:'center' }}>Your personalized timetable has been generated</p>
        <button className="btn-primary" onClick={() => setActiveView('dashboard')} style={{ fontSize:16, padding:'14px 32px' }}>
          Go to Dashboard →
        </button>
      </div>
    );
  }

  const isHoursStep = step === steps.length;

  return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div ref={containerRef} style={{ maxWidth:580, width:'100%', display:'flex', flexDirection:'column', gap:32 }}>
        {/* Progress */}
        <div style={{ display:'flex', gap:8 }}>
          {[...steps, { id:'hours' }].map((_, i) => (
            <div key={i} style={{ flex:1, height:4, borderRadius:2, background: i <= step ? 'var(--accent)' : 'var(--border)', transition:'background 0.4s ease' }} />
          ))}
        </div>

        <div className="card" style={{ padding:40 }}>
          {!isHoursStep ? (
            <>
              <div style={{ fontSize:48, marginBottom:12, textAlign:'center' }}>{current.emoji}</div>
              <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:26, textAlign:'center', marginBottom:28 }}>
                {current.title}
              </h2>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {current.options.map(opt => (
                  <button key={opt.value} onClick={() => select(current.id, opt.value)} style={{
                    padding:'16px 20px', borderRadius:14, textAlign:'left',
                    background: answers[current.id] === opt.value ? 'rgba(79,110,247,0.1)' : 'var(--bg-primary)',
                    border: `2px solid ${answers[current.id] === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                    cursor:'pointer', transition:'all 0.25s ease',
                  }}>
                    <div style={{ fontWeight:700, fontSize:15, color:'var(--text-primary)', marginBottom:3 }}>{opt.label}</div>
                    <div style={{ fontSize:13, color:'var(--text-muted)' }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize:48, marginBottom:12, textAlign:'center' }}>⏰</div>
              <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:26, textAlign:'center', marginBottom:8 }}>
                Daily study hours?
              </h2>
              <p style={{ textAlign:'center', color:'var(--text-muted)', marginBottom:32 }}>Be honest — we'll build around your real schedule</p>

              <div style={{ textAlign:'center', marginBottom:20 }}>
                <span style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:64, color:'var(--accent)' }}>{hours}</span>
                <span style={{ fontSize:24, color:'var(--text-muted)' }}> hrs</span>
              </div>

              <input type="range" min={1} max={12} value={hours} onChange={e=>setHours(+e.target.value)}
                style={{ width:'100%', accentColor:'var(--accent)', height:6, cursor:'pointer' }} />

              <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, fontSize:12, color:'var(--text-muted)' }}>
                <span>1 hr (Light)</span><span>6 hrs (Serious)</span><span>12 hrs (Beast)</span>
              </div>
            </>
          )}
        </div>

        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <button onClick={() => setStep(s=>Math.max(0,s-1))} style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 20px', borderRadius:10, background:'var(--bg-card)', border:'1px solid var(--border)', color:'var(--text-secondary)', cursor:'pointer', fontSize:14, fontWeight:500 }}>
            <ChevronLeft size={16} /> Back
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              if (!isHoursStep) { setStep(s=>s+1); }
              else { setDone(true); }
            }}
            disabled={!isHoursStep && !answers[current?.id]}
            style={{ display:'flex', alignItems:'center', gap:6, opacity: (!isHoursStep && !answers[current?.id]) ? 0.4 : 1 }}
          >
            {isHoursStep ? <><Sparkles size={16} /> Generate My Plan</> : <>Next <ChevronRight size={16} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}