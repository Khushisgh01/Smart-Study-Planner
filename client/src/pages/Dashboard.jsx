// import { useRef, useEffect } from 'react';
// import { gsap } from 'gsap';
// import { useApp } from '../context/AppContext';
// import Sidebar from '../components/Sidebar';
// import TaskCard from '../components/TaskCard';
// import { Zap, Calendar, TrendingUp, ShieldAlert, ChevronRight, Lightbulb, AlertCircle, BookOpen } from 'lucide-react';

// /* ── Progress ring ── */
// function ProgressRing({ value, size = 96, sw = 7, color = '#1a3fa3', label, sublabel }) {
//   const r = (size - sw * 2) / 2;
//   const circ = 2 * Math.PI * r;
//   const offset = circ - (value / 100) * circ;
//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
//       <div style={{ position: 'relative', width: size, height: size }}>
//         <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
//           <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={sw} />
//           <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
//             strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
//             style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.34,1.56,0.64,1)', filter: `drop-shadow(0 0 7px ${color}70)` }}
//           />
//         </svg>
//         <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
//           <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: size * 0.21, color: 'var(--text-primary)' }}>{value}%</span>
//         </div>
//       </div>
//       {label && <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center', maxWidth: size }}>{label}</span>}
//       {sublabel && <span style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'center' }}>{sublabel}</span>}
//     </div>
//   );
// }

// /* ── Confetti ── */
// function Confetti({ show }) {
//   if (!show) return null;
//   const pieces = Array.from({ length: 70 }, (_, i) => ({
//     id: i,
//     color: ['#1a3fa3','#00c9b1','#ff2d78','#e8a020','#9b59b6'][i % 5],
//     left: Math.random() * 100, delay: Math.random() * 1.8, size: 6 + Math.random() * 8,
//   }));
//   return (
//     <>
//       {pieces.map(p => (
//         <div key={p.id} className="confetti-piece" style={{
//           left: `${p.left}%`, top: '-20px',
//           background: p.color, width: p.size, height: p.size,
//           animationDelay: `${p.delay}s`,
//           borderRadius: Math.random() > 0.5 ? '50%' : '2px',
//         }} />
//       ))}
//     </>
//   );
// }

// function SectionHeader({ icon: Icon, title, color = 'var(--school-blue)' }) {
//   return (
//     <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
//       <div style={{ width: 30, height: 30, borderRadius: 9, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <Icon size={15} color={color} />
//       </div>
//       <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{title}</h2>
//     </div>
//   );
// }

// const insights = [
//   { type: 'tip', text: 'Focus on Trees + Graphs to gain +20 marks', icon: TrendingUp, color: '#1a3fa3' },
//   { type: 'warning', text: 'You are falling behind by 1 day — catch up today!', icon: AlertCircle, color: '#e8a020' },
//   { type: 'insight', text: 'Organic Reactions appears in 60% of CRPS PYQs', icon: Lightbulb, color: '#00c9b1' },
// ];

// const risks = [
//   { chapter: 'Differential Equations', marks: 15, subject: 'Mathematics' },
//   { chapter: 'Waves & Optics', marks: 12, subject: 'Physics' },
// ];

// export default function Dashboard() {
//   const { tasks, showConfetti, subjects, tomorrowTasks, userName } = useApp();
//   const mainRef = useRef();
//   const today = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });

//   useEffect(() => {
//     gsap.fromTo([...mainRef.current.children],
//       { opacity: 0, y: 32 },
//       { opacity: 1, y: 0, stagger: 0.09, duration: 0.6, ease: 'power3.out' }
//     );
//     // Progress rings animation
//     gsap.fromTo('.prog-ring-wrap',
//       { scale: 0.6, opacity: 0 },
//       { scale: 1, opacity: 1, stagger: 0.12, duration: 0.6, ease: 'back.out(1.7)', delay: 0.5 }
//     );
//   }, []);

//   const pendingCount = tasks.filter(t => t.status === 'pending').length;
//   const doneCount    = tasks.filter(t => t.status === 'done').length;
//   const totalMins    = tasks.reduce((a, t) => a + t.estimatedTime, 0);
//   const avgProgress  = Math.round(subjects.reduce((a, s) => a + s.progress, 0) / subjects.length);

//   return (
//     <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
//       <Confetti show={showConfetti} />
//       <Sidebar />

//       <main ref={mainRef} style={{ flex: 1, overflowY: 'auto', padding: '28px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>

//         {/* ── Header ── */}
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
//           <div>
//             <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 3 }}>{today} · Chhotu Ram Public School</p>
//             <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 26, color: 'var(--text-primary)' }}>
//               Good morning, <span className="gradient-text">{userName}!</span> 👋
//             </h1>
//             <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 5 }}>
//               {pendingCount} tasks pending today · {totalMins} min total study time
//             </p>
//           </div>
//           <div style={{ display: 'flex', gap: 12 }}>
//             {[
//               { label: 'Done', value: doneCount, color: '#00c9b1', bg: 'rgba(0,201,177,0.08)' },
//               { label: 'Remaining', value: pendingCount, color: '#1a3fa3', bg: 'rgba(26,63,163,0.08)' },
//               { label: 'Minutes', value: totalMins, color: '#e8a020', bg: 'rgba(232,160,32,0.1)' },
//             ].map((s, i) => (
//               <div key={i} style={{ padding: '12px 18px', borderRadius: 16, background: s.bg, border: `1px solid ${s.color}20`, textAlign: 'center', minWidth: 84 }}>
//                 <p style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 24, color: s.color }}>{s.value}</p>
//                 <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ── Two-column layout ── */}
//         <div style={{ display: 'grid', gridTemplateColumns: '1fr 330px', gap: 20 }}>

//           {/* LEFT */}
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

//             {/* Today's Tasks */}
//             <div className="card" style={{ padding: '22px' }}>
//               <SectionHeader icon={Calendar} title="Today's Study Plan" />
//               {tasks.length === 0
//                 ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px 0', fontSize: 15 }}>🎉 All tasks done! You're crushing it!</p>
//                 : tasks.map((t, i) => <TaskCard key={t._id} task={t} index={i} />)
//               }
//             </div>

//             {/* Progress */}
//             <div className="card" style={{ padding: '22px' }}>
//               <SectionHeader icon={TrendingUp} title="Progress Overview" color="#00c9b1" />
//               <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
//                 {[
//                   { value: avgProgress, color: '#1a3fa3', label: 'Syllabus Done', sub: 'Overall' },
//                   { value: 72, color: '#00c9b1', label: 'High-Weight', sub: 'Chapters Covered' },
//                   { value: 55, color: '#ff2d78', label: 'PYQ Practice', sub: 'Completed' },
//                   { value: 40, color: '#e8a020', label: 'Revisions', sub: 'This Week' },
//                 ].map((r, i) => (
//                   <div key={i} className="prog-ring-wrap">
//                     <ProgressRing value={r.value} size={96} color={r.color} label={r.label} sublabel={r.sub} />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT */}
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

//             {/* Smart Insights */}
//             <div className="card" style={{ padding: '18px' }}>
//               <SectionHeader icon={Zap} title="Smart Insights" color="#e8a020" />
//               <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//                 {insights.map((ins, i) => (
//                   <div key={i} style={{
//                     padding: '10px 14px', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'flex-start',
//                     borderLeft: `3px solid ${ins.color}`, background: `${ins.color}06`,
//                     animation: `slideUp 0.4s ease ${i * 0.1}s both`,
//                   }}>
//                     <div style={{ width: 26, height: 26, borderRadius: 7, background: `${ins.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//                       <ins.icon size={13} color={ins.color} />
//                     </div>
//                     <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{ins.text}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Risk Alerts */}
//             <div className="card" style={{ padding: '18px' }}>
//               <SectionHeader icon={ShieldAlert} title="Risk Alerts" color="#ff2d78" />
//               {risks.map((r, i) => (
//                 <div key={i} style={{
//                   padding: '10px 14px', borderRadius: 12, marginBottom: 8,
//                   background: 'rgba(255,45,120,0.06)', border: '1px solid rgba(255,45,120,0.2)',
//                   display: 'flex', gap: 10, alignItems: 'center',
//                 }}>
//                   <ShieldAlert size={14} color="#ff2d78" />
//                   <div>
//                     <p style={{ fontSize: 12, fontWeight: 600, color: '#ff2d78' }}>{r.chapter}</p>
//                     <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Skipping may impact {r.marks} marks · {r.subject}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Tomorrow Preview */}
//             <div className="card" style={{ padding: '18px' }}>
//               <SectionHeader icon={ChevronRight} title="Tomorrow's Preview" />
//               {tomorrowTasks.map((t, i) => (
//                 <div key={i} style={{
//                   display: 'flex', alignItems: 'center', gap: 10,
//                   padding: '9px 0',
//                   borderBottom: i < tomorrowTasks.length - 1 ? '1px solid var(--border)' : 'none',
//                 }}>
//                   <div style={{ width: 7, height: 7, borderRadius: '50%', background: { Learn:'#1a3fa3',Revise1:'#9b59b6',Revise2:'#7d3b9c',PYQ:'#e8a020' }[t.taskType], flexShrink: 0 }} />
//                   <div style={{ flex: 1 }}>
//                     <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{t.chapter}</p>
//                     <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.subject} · {t.estimatedTime} min</p>
//                   </div>
//                   <span style={{ fontSize: 9, fontWeight: 700, color: '#1a3fa3', background: 'rgba(26,63,163,0.1)', padding: '2px 7px', borderRadius: 5 }}>
//                     {t.taskType}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             {/* PYQ Quick Access */}
//             <div className="card" style={{ padding: '18px', background: 'linear-gradient(135deg, rgba(26,63,163,0.04), rgba(232,160,32,0.04))' }}>
//               <SectionHeader icon={BookOpen} title="PYQ Repository" color="#1a3fa3" />
//               <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.6 }}>
//                 Access CRPS previous year questions uploaded by your teachers.
//               </p>
//               <a href="/pyqs" style={{
//                 display: 'flex', alignItems: 'center', gap: 6,
//                 padding: '10px 16px', borderRadius: 10,
//                 background: 'var(--school-blue)', color: 'white',
//                 fontWeight: 600, fontSize: 13, cursor: 'pointer',
//                 textDecoration: 'none', justifyContent: 'center',
//                 boxShadow: '0 4px 16px rgba(26,63,163,0.3)',
//               }}>
//                 <BookOpen size={14} /> Browse PYQs
//               </a>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import { Zap, Calendar, TrendingUp, ShieldAlert, ChevronRight, Lightbulb, AlertCircle, BookOpen } from 'lucide-react';

/* ── Progress ring ── */
function ProgressRing({ value, size = 96, sw = 7, color = '#1a3fa3', label, sublabel }) {
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={sw} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.34,1.56,0.64,1)', filter: `drop-shadow(0 0 7px ${color}70)` }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: size * 0.21, color: 'var(--text-primary)' }}>{value}%</span>
        </div>
      </div>
      {label && <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center', maxWidth: size }}>{label}</span>}
      {sublabel && <span style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'center' }}>{sublabel}</span>}
    </div>
  );
}

/* ── Confetti ── */
function Confetti({ show }) {
  if (!show) return null;
  const pieces = Array.from({ length: 70 }, (_, i) => ({
    id: i,
    color: ['#1a3fa3','#00c9b1','#ff2d78','#e8a020','#9b59b6'][i % 5],
    left: Math.random() * 100, delay: Math.random() * 1.8, size: 6 + Math.random() * 8,
  }));
  return (
    <>
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left: `${p.left}%`, top: '-20px',
          background: p.color, width: p.size, height: p.size,
          animationDelay: `${p.delay}s`,
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        }} />
      ))}
    </>
  );
}

function SectionHeader({ icon: Icon, title, color = 'var(--school-blue)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
      <div style={{ width: 30, height: 30, borderRadius: 9, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={15} color={color} />
      </div>
      <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{title}</h2>
    </div>
  );
}

const insights = [
  { type: 'tip', text: 'Focus on Trees + Graphs to gain +20 marks', icon: TrendingUp, color: '#1a3fa3' },
  { type: 'warning', text: 'You are falling behind by 1 day — catch up today!', icon: AlertCircle, color: '#e8a020' },
  { type: 'insight', text: 'Organic Reactions appears in 60% of CRPS PYQs', icon: Lightbulb, color: '#00c9b1' },
];

const risks = [
  { chapter: 'Differential Equations', marks: 15, subject: 'Mathematics' },
  { chapter: 'Waves & Optics', marks: 12, subject: 'Physics' },
];

export default function Dashboard() {
  // ✅ FIX: destructure with safe fallbacks so nothing is ever undefined
  const {
    tasks         = [],
    showConfetti  = false,
    subjects      = [],
    tomorrowTasks = [],
    userName      = '',
  } = useApp();

  const mainRef = useRef();
  const today = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });

  useEffect(() => {
    if (!mainRef.current) return;
    gsap.fromTo([...mainRef.current.children],
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, stagger: 0.09, duration: 0.6, ease: 'power3.out' }
    );
    gsap.fromTo('.prog-ring-wrap',
      { scale: 0.6, opacity: 0 },
      { scale: 1, opacity: 1, stagger: 0.12, duration: 0.6, ease: 'back.out(1.7)', delay: 0.5 }
    );
  }, []);

  // ✅ FIX: all three were crashing when arrays were undefined
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const doneCount    = tasks.filter(t => t.status === 'done').length;
  const totalMins    = tasks.reduce((a, t) => a + (t.estimatedTime ?? 0), 0);
  const avgProgress  = subjects.length > 0
    ? Math.round(subjects.reduce((a, s) => a + (s.progress ?? 0), 0) / subjects.length)
    : 0; // ✅ FIX: avoid NaN when subjects is empty (division by zero)

  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      <Confetti show={showConfetti} />
      <Sidebar />

      <main ref={mainRef} style={{ flex: 1, overflowY: 'auto', padding: '28px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 3 }}>{today} · Chhotu Ram Public School</p>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 26, color: 'var(--text-primary)' }}>
              Good morning, <span className="gradient-text">{userName}!</span> 👋
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 5 }}>
              {pendingCount} tasks pending today · {totalMins} min total study time
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { label: 'Done',      value: doneCount,    color: '#00c9b1', bg: 'rgba(0,201,177,0.08)' },
              { label: 'Remaining', value: pendingCount, color: '#1a3fa3', bg: 'rgba(26,63,163,0.08)' },
              { label: 'Minutes',   value: totalMins,    color: '#e8a020', bg: 'rgba(232,160,32,0.1)'  },
            ].map((s, i) => (
              <div key={i} style={{ padding: '12px 18px', borderRadius: 16, background: s.bg, border: `1px solid ${s.color}20`, textAlign: 'center', minWidth: 84 }}>
                <p style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 24, color: s.color }}>{s.value}</p>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 330px', gap: 20 }}>

          {/* LEFT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Today's Tasks */}
            <div className="card" style={{ padding: '22px' }}>
              <SectionHeader icon={Calendar} title="Today's Study Plan" />
              {tasks.length === 0
                ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px 0', fontSize: 15 }}>🎉 All tasks done! You're crushing it!</p>
                : tasks.map((t, i) => <TaskCard key={t._id} task={t} index={i} />)
              }
            </div>

            {/* Progress */}
            <div className="card" style={{ padding: '22px' }}>
              <SectionHeader icon={TrendingUp} title="Progress Overview" color="#00c9b1" />
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {[
                  { value: avgProgress, color: '#1a3fa3', label: 'Syllabus Done',      sub: 'Overall'            },
                  { value: 72,          color: '#00c9b1', label: 'High-Weight',         sub: 'Chapters Covered'   },
                  { value: 55,          color: '#ff2d78', label: 'PYQ Practice',        sub: 'Completed'          },
                  { value: 40,          color: '#e8a020', label: 'Revisions',           sub: 'This Week'          },
                ].map((r, i) => (
                  <div key={i} className="prog-ring-wrap">
                    <ProgressRing value={r.value} size={96} color={r.color} label={r.label} sublabel={r.sub} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Smart Insights */}
            <div className="card" style={{ padding: '18px' }}>
              <SectionHeader icon={Zap} title="Smart Insights" color="#e8a020" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {insights.map((ins, i) => (
                  <div key={i} style={{
                    padding: '10px 14px', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'flex-start',
                    borderLeft: `3px solid ${ins.color}`, background: `${ins.color}06`,
                    animation: `slideUp 0.4s ease ${i * 0.1}s both`,
                  }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: `${ins.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <ins.icon size={13} color={ins.color} />
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{ins.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Alerts */}
            <div className="card" style={{ padding: '18px' }}>
              <SectionHeader icon={ShieldAlert} title="Risk Alerts" color="#ff2d78" />
              {risks.map((r, i) => (
                <div key={i} style={{
                  padding: '10px 14px', borderRadius: 12, marginBottom: 8,
                  background: 'rgba(255,45,120,0.06)', border: '1px solid rgba(255,45,120,0.2)',
                  display: 'flex', gap: 10, alignItems: 'center',
                }}>
                  <ShieldAlert size={14} color="#ff2d78" />
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#ff2d78' }}>{r.chapter}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Skipping may impact {r.marks} marks · {r.subject}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tomorrow Preview */}
            <div className="card" style={{ padding: '18px' }}>
              <SectionHeader icon={ChevronRight} title="Tomorrow's Preview" />
              {/* ✅ FIX: tomorrowTasks was undefined — now safely falls back to [] */}
              {tomorrowTasks.length === 0 ? (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>No preview available yet</p>
              ) : (
                tomorrowTasks.map((t, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 0',
                    borderBottom: i < tomorrowTasks.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: { Learn:'#1a3fa3', Revise1:'#9b59b6', Revise2:'#7d3b9c', PYQ:'#e8a020' }[t.taskType] ?? '#aaa', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{t.chapter}</p>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.subject} · {t.estimatedTime} min</p>
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#1a3fa3', background: 'rgba(26,63,163,0.1)', padding: '2px 7px', borderRadius: 5 }}>
                      {t.taskType}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* PYQ Quick Access */}
            <div className="card" style={{ padding: '18px', background: 'linear-gradient(135deg, rgba(26,63,163,0.04), rgba(232,160,32,0.04))' }}>
              <SectionHeader icon={BookOpen} title="PYQ Repository" color="#1a3fa3" />
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.6 }}>
                Access CRPS previous year questions uploaded by your teachers.
              </p>
              <a href="/pyqs" style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 16px', borderRadius: 10,
                background: 'var(--school-blue)', color: 'white',
                fontWeight: 600, fontSize: 13, cursor: 'pointer',
                textDecoration: 'none', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(26,63,163,0.3)',
              }}>
                <BookOpen size={14} /> Browse PYQs
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}