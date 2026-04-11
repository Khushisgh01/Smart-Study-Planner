import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useApp } from '../context/AppContext';
import { Sparkles, BookOpen, Brain, Calendar } from 'lucide-react';

export default function LandingPage() {
  const { setActiveView } = useApp();
  const heroRef = useRef();
  const cardsRef = useRef();

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(heroRef.current.children,
      { opacity:0, y:50 },
      { opacity:1, y:0, stagger:0.15, duration:0.8, ease:'power3.out' }
    ).fromTo(cardsRef.current.children,
      { opacity:0, y:30, scale:0.95 },
      { opacity:1, y:0, scale:1, stagger:0.1, duration:0.6, ease:'back.out(1.4)' }, '-=0.3'
    );
  }, []);

  const features = [
    { icon: Brain, title: 'Smart Priority Engine', desc: 'Scores every chapter by weight × PYQ frequency × difficulty ÷ confidence', color:'#4f6ef7' },
    { icon: Calendar, title: 'Auto-Rescheduling', desc: 'Skipped a task? We automatically push it to your next free slot', color:'#00c9b1' },
    { icon: BookOpen, title: 'Personalized Daily Plans', desc: 'Day-by-day study slots tailored to your pace, goals, and exam dates', color:'#ff2d78' },
    { icon: Sparkles, title: 'Exam Readiness Score', desc: 'See exactly how ready you are and what to fix right now', color:'#ffb700' },
  ];

  return (
    <div style={{ flex:1, overflowY:'auto' }}>
      <div style={{ maxWidth:900, margin:'0 auto', padding:'80px 24px' }}>
        <div ref={heroRef} style={{ textAlign:'center', marginBottom:72 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 18px', borderRadius:50, background:'rgba(79,110,247,0.1)', border:'1px solid rgba(79,110,247,0.25)', marginBottom:24 }}>
            <Sparkles size={14} color="var(--accent)" />
            <span style={{ fontSize:13, fontWeight:600, color:'var(--accent)' }}>AI-Powered Study Planning</span>
          </div>

          <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'clamp(36px, 6vw, 68px)', lineHeight:1.1, marginBottom:20, color:'var(--text-primary)' }}>
            Stop guessing.<br />
            <span className="gradient-text">Start preparing smart.</span>
          </h1>

          <p style={{ fontSize:18, color:'var(--text-secondary)', maxWidth:520, margin:'0 auto 36px', lineHeight:1.7 }}>
            Convert your syllabus and exam dates into a personalized daily study plan with intelligent prioritization.
          </p>

          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <button className="btn-primary" onClick={()=>setActiveView('onboarding')} style={{ fontSize:16, padding:'14px 32px', display:'flex', alignItems:'center', gap:8 }}>
              <Sparkles size={17} /> Get My Study Plan
            </button>
            <button onClick={()=>setActiveView('dashboard')} style={{ fontSize:15, padding:'13px 28px', borderRadius:12, background:'var(--bg-card)', border:'1px solid var(--border)', color:'var(--text-primary)', cursor:'pointer', fontWeight:500 }}>
              View Demo →
            </button>
          </div>
        </div>

        <div ref={cardsRef} style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:20 }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ padding:'28px 24px' }}>
              <div style={{ width:44, height:44, borderRadius:12, background:`${f.color}18`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                <f.icon size={20} color={f.color} />
              </div>
              <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:16, marginBottom:8, color:'var(--text-primary)' }}>{f.title}</h3>
              <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}