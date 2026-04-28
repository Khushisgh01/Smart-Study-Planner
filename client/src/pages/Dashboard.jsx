// // // import { useRef, useEffect } from 'react';
// // // import { gsap } from 'gsap';
// // // import { useApp } from '../context/AppContext';
// // // import Sidebar from '../components/Sidebar';
// // // import TaskCard from '../components/TaskCard';
// // // import { Zap, Calendar, TrendingUp, ShieldAlert, ChevronRight, Lightbulb, AlertCircle, BookOpen } from 'lucide-react';

// // // /* ── Progress ring ── */
// // // function ProgressRing({ value, size = 96, sw = 7, color = '#1a3fa3', label, sublabel }) {
// // //   const r = (size - sw * 2) / 2;
// // //   const circ = 2 * Math.PI * r;
// // //   const offset = circ - (value / 100) * circ;
// // //   return (
// // //     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
// // //       <div style={{ position: 'relative', width: size, height: size }}>
// // //         <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
// // //           <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={sw} />
// // //           <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
// // //             strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
// // //             style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.34,1.56,0.64,1)', filter: `drop-shadow(0 0 7px ${color}70)` }}
// // //           />
// // //         </svg>
// // //         <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
// // //           <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: size * 0.21, color: 'var(--text-primary)' }}>{value}%</span>
// // //         </div>
// // //       </div>
// // //       {label && <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center', maxWidth: size }}>{label}</span>}
// // //       {sublabel && <span style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'center' }}>{sublabel}</span>}
// // //     </div>
// // //   );
// // // }

// // // /* ── Confetti ── */
// // // function Confetti({ show }) {
// // //   if (!show) return null;
// // //   const pieces = Array.from({ length: 70 }, (_, i) => ({
// // //     id: i,
// // //     color: ['#1a3fa3','#00c9b1','#ff2d78','#e8a020','#9b59b6'][i % 5],
// // //     left: Math.random() * 100, delay: Math.random() * 1.8, size: 6 + Math.random() * 8,
// // //   }));
// // //   return (
// // //     <>
// // //       {pieces.map(p => (
// // //         <div key={p.id} className="confetti-piece" style={{
// // //           left: `${p.left}%`, top: '-20px',
// // //           background: p.color, width: p.size, height: p.size,
// // //           animationDelay: `${p.delay}s`,
// // //           borderRadius: Math.random() > 0.5 ? '50%' : '2px',
// // //         }} />
// // //       ))}
// // //     </>
// // //   );
// // // }

// // // function SectionHeader({ icon: Icon, title, color = 'var(--school-blue)' }) {
// // //   return (
// // //     <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
// // //       <div style={{ width: 30, height: 30, borderRadius: 9, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
// // //         <Icon size={15} color={color} />
// // //       </div>
// // //       <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{title}</h2>
// // //     </div>
// // //   );
// // // }

// // // const insights = [
// // //   { type: 'tip', text: 'Focus on Trees + Graphs to gain +20 marks', icon: TrendingUp, color: '#1a3fa3' },
// // //   { type: 'warning', text: 'You are falling behind by 1 day — catch up today!', icon: AlertCircle, color: '#e8a020' },
// // //   { type: 'insight', text: 'Organic Reactions appears in 60% of CRPS PYQs', icon: Lightbulb, color: '#00c9b1' },
// // // ];

// // // const risks = [
// // //   { chapter: 'Differential Equations', marks: 15, subject: 'Mathematics' },
// // //   { chapter: 'Waves & Optics', marks: 12, subject: 'Physics' },
// // // ];

// // // export default function Dashboard() {
// // //   const { tasks, showConfetti, subjects, tomorrowTasks, userName } = useApp();
// // //   const mainRef = useRef();
// // //   const today = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });

// // //   useEffect(() => {
// // //     gsap.fromTo([...mainRef.current.children],
// // //       { opacity: 0, y: 32 },
// // //       { opacity: 1, y: 0, stagger: 0.09, duration: 0.6, ease: 'power3.out' }
// // //     );
// // //     // Progress rings animation
// // //     gsap.fromTo('.prog-ring-wrap',
// // //       { scale: 0.6, opacity: 0 },
// // //       { scale: 1, opacity: 1, stagger: 0.12, duration: 0.6, ease: 'back.out(1.7)', delay: 0.5 }
// // //     );
// // //   }, []);

// // //   const pendingCount = tasks.filter(t => t.status === 'pending').length;
// // //   const doneCount    = tasks.filter(t => t.status === 'done').length;
// // //   const totalMins    = tasks.reduce((a, t) => a + t.estimatedTime, 0);
// // //   const avgProgress  = Math.round(subjects.reduce((a, s) => a + s.progress, 0) / subjects.length);

// // //   return (
// // //     <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
// // //       <Confetti show={showConfetti} />
// // //       <Sidebar />

// // //       <main ref={mainRef} style={{ flex: 1, overflowY: 'auto', padding: '28px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>

// // //         {/* ── Header ── */}
// // //         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
// // //           <div>
// // //             <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 3 }}>{today} · Chhotu Ram Public School</p>
// // //             <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 26, color: 'var(--text-primary)' }}>
// // //               Good morning, <span className="gradient-text">{userName}!</span> 👋
// // //             </h1>
// // //             <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 5 }}>
// // //               {pendingCount} tasks pending today · {totalMins} min total study time
// // //             </p>
// // //           </div>
// // //           <div style={{ display: 'flex', gap: 12 }}>
// // //             {[
// // //               { label: 'Done', value: doneCount, color: '#00c9b1', bg: 'rgba(0,201,177,0.08)' },
// // //               { label: 'Remaining', value: pendingCount, color: '#1a3fa3', bg: 'rgba(26,63,163,0.08)' },
// // //               { label: 'Minutes', value: totalMins, color: '#e8a020', bg: 'rgba(232,160,32,0.1)' },
// // //             ].map((s, i) => (
// // //               <div key={i} style={{ padding: '12px 18px', borderRadius: 16, background: s.bg, border: `1px solid ${s.color}20`, textAlign: 'center', minWidth: 84 }}>
// // //                 <p style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 24, color: s.color }}>{s.value}</p>
// // //                 <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</p>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </div>

// // //         {/* ── Two-column layout ── */}
// // //         <div style={{ display: 'grid', gridTemplateColumns: '1fr 330px', gap: 20 }}>

// // //           {/* LEFT */}
// // //           <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

// // //             {/* Today's Tasks */}
// // //             <div className="card" style={{ padding: '22px' }}>
// // //               <SectionHeader icon={Calendar} title="Today's Study Plan" />
// // //               {tasks.length === 0
// // //                 ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px 0', fontSize: 15 }}>🎉 All tasks done! You're crushing it!</p>
// // //                 : tasks.map((t, i) => <TaskCard key={t._id} task={t} index={i} />)
// // //               }
// // //             </div>

// // //             {/* Progress */}
// // //             <div className="card" style={{ padding: '22px' }}>
// // //               <SectionHeader icon={TrendingUp} title="Progress Overview" color="#00c9b1" />
// // //               <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
// // //                 {[
// // //                   { value: avgProgress, color: '#1a3fa3', label: 'Syllabus Done', sub: 'Overall' },
// // //                   { value: 72, color: '#00c9b1', label: 'High-Weight', sub: 'Chapters Covered' },
// // //                   { value: 55, color: '#ff2d78', label: 'PYQ Practice', sub: 'Completed' },
// // //                   { value: 40, color: '#e8a020', label: 'Revisions', sub: 'This Week' },
// // //                 ].map((r, i) => (
// // //                   <div key={i} className="prog-ring-wrap">
// // //                     <ProgressRing value={r.value} size={96} color={r.color} label={r.label} sublabel={r.sub} />
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* RIGHT */}
// // //           <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

// // //             {/* Smart Insights */}
// // //             <div className="card" style={{ padding: '18px' }}>
// // //               <SectionHeader icon={Zap} title="Smart Insights" color="#e8a020" />
// // //               <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
// // //                 {insights.map((ins, i) => (
// // //                   <div key={i} style={{
// // //                     padding: '10px 14px', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'flex-start',
// // //                     borderLeft: `3px solid ${ins.color}`, background: `${ins.color}06`,
// // //                     animation: `slideUp 0.4s ease ${i * 0.1}s both`,
// // //                   }}>
// // //                     <div style={{ width: 26, height: 26, borderRadius: 7, background: `${ins.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
// // //                       <ins.icon size={13} color={ins.color} />
// // //                     </div>
// // //                     <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{ins.text}</p>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             </div>

// // //             {/* Risk Alerts */}
// // //             <div className="card" style={{ padding: '18px' }}>
// // //               <SectionHeader icon={ShieldAlert} title="Risk Alerts" color="#ff2d78" />
// // //               {risks.map((r, i) => (
// // //                 <div key={i} style={{
// // //                   padding: '10px 14px', borderRadius: 12, marginBottom: 8,
// // //                   background: 'rgba(255,45,120,0.06)', border: '1px solid rgba(255,45,120,0.2)',
// // //                   display: 'flex', gap: 10, alignItems: 'center',
// // //                 }}>
// // //                   <ShieldAlert size={14} color="#ff2d78" />
// // //                   <div>
// // //                     <p style={{ fontSize: 12, fontWeight: 600, color: '#ff2d78' }}>{r.chapter}</p>
// // //                     <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Skipping may impact {r.marks} marks · {r.subject}</p>
// // //                   </div>
// // //                 </div>
// // //               ))}
// // //             </div>

// // //             {/* Tomorrow Preview */}
// // //             <div className="card" style={{ padding: '18px' }}>
// // //               <SectionHeader icon={ChevronRight} title="Tomorrow's Preview" />
// // //               {tomorrowTasks.map((t, i) => (
// // //                 <div key={i} style={{
// // //                   display: 'flex', alignItems: 'center', gap: 10,
// // //                   padding: '9px 0',
// // //                   borderBottom: i < tomorrowTasks.length - 1 ? '1px solid var(--border)' : 'none',
// // //                 }}>
// // //                   <div style={{ width: 7, height: 7, borderRadius: '50%', background: { Learn:'#1a3fa3',Revise1:'#9b59b6',Revise2:'#7d3b9c',PYQ:'#e8a020' }[t.taskType], flexShrink: 0 }} />
// // //                   <div style={{ flex: 1 }}>
// // //                     <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{t.chapter}</p>
// // //                     <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.subject} · {t.estimatedTime} min</p>
// // //                   </div>
// // //                   <span style={{ fontSize: 9, fontWeight: 700, color: '#1a3fa3', background: 'rgba(26,63,163,0.1)', padding: '2px 7px', borderRadius: 5 }}>
// // //                     {t.taskType}
// // //                   </span>
// // //                 </div>
// // //               ))}
// // //             </div>

// // //             {/* PYQ Quick Access */}
// // //             <div className="card" style={{ padding: '18px', background: 'linear-gradient(135deg, rgba(26,63,163,0.04), rgba(232,160,32,0.04))' }}>
// // //               <SectionHeader icon={BookOpen} title="PYQ Repository" color="#1a3fa3" />
// // //               <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.6 }}>
// // //                 Access CRPS previous year questions uploaded by your teachers.
// // //               </p>
// // //               <a href="/pyqs" style={{
// // //                 display: 'flex', alignItems: 'center', gap: 6,
// // //                 padding: '10px 16px', borderRadius: 10,
// // //                 background: 'var(--school-blue)', color: 'white',
// // //                 fontWeight: 600, fontSize: 13, cursor: 'pointer',
// // //                 textDecoration: 'none', justifyContent: 'center',
// // //                 boxShadow: '0 4px 16px rgba(26,63,163,0.3)',
// // //               }}>
// // //                 <BookOpen size={14} /> Browse PYQs
// // //               </a>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </main>
// // //     </div>
// // //   );
// // // }
// // import { useRef, useEffect } from 'react';
// // import { gsap } from 'gsap';
// // import { useApp } from '../context/AppContext';
// // import Sidebar from '../components/Sidebar';
// // import TaskCard from '../components/TaskCard';
// // import { Zap, Calendar, TrendingUp, ShieldAlert, ChevronRight, Lightbulb, AlertCircle, BookOpen } from 'lucide-react';

// // /* ── Progress ring ── */
// // function ProgressRing({ value, size = 96, sw = 7, color = '#1a3fa3', label, sublabel }) {
// //   const r = (size - sw * 2) / 2;
// //   const circ = 2 * Math.PI * r;
// //   const offset = circ - (value / 100) * circ;
// //   return (
// //     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
// //       <div style={{ position: 'relative', width: size, height: size }}>
// //         <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
// //           <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={sw} />
// //           <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
// //             strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
// //             style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.34,1.56,0.64,1)', filter: `drop-shadow(0 0 7px ${color}70)` }}
// //           />
// //         </svg>
// //         <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
// //           <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: size * 0.21, color: 'var(--text-primary)' }}>{value}%</span>
// //         </div>
// //       </div>
// //       {label && <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center', maxWidth: size }}>{label}</span>}
// //       {sublabel && <span style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'center' }}>{sublabel}</span>}
// //     </div>
// //   );
// // }

// // /* ── Confetti ── */
// // function Confetti({ show }) {
// //   if (!show) return null;
// //   const pieces = Array.from({ length: 70 }, (_, i) => ({
// //     id: i,
// //     color: ['#1a3fa3','#00c9b1','#ff2d78','#e8a020','#9b59b6'][i % 5],
// //     left: Math.random() * 100, delay: Math.random() * 1.8, size: 6 + Math.random() * 8,
// //   }));
// //   return (
// //     <>
// //       {pieces.map(p => (
// //         <div key={p.id} className="confetti-piece" style={{
// //           left: `${p.left}%`, top: '-20px',
// //           background: p.color, width: p.size, height: p.size,
// //           animationDelay: `${p.delay}s`,
// //           borderRadius: Math.random() > 0.5 ? '50%' : '2px',
// //         }} />
// //       ))}
// //     </>
// //   );
// // }

// // function SectionHeader({ icon: Icon, title, color = 'var(--school-blue)' }) {
// //   return (
// //     <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
// //       <div style={{ width: 30, height: 30, borderRadius: 9, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
// //         <Icon size={15} color={color} />
// //       </div>
// //       <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{title}</h2>
// //     </div>
// //   );
// // }

// // const insights = [
// //   { type: 'tip', text: 'Focus on Trees + Graphs to gain +20 marks', icon: TrendingUp, color: '#1a3fa3' },
// //   { type: 'warning', text: 'You are falling behind by 1 day — catch up today!', icon: AlertCircle, color: '#e8a020' },
// //   { type: 'insight', text: 'Organic Reactions appears in 60% of CRPS PYQs', icon: Lightbulb, color: '#00c9b1' },
// // ];

// // const risks = [
// //   { chapter: 'Differential Equations', marks: 15, subject: 'Mathematics' },
// //   { chapter: 'Waves & Optics', marks: 12, subject: 'Physics' },
// // ];

// // export default function Dashboard() {
// //   // ✅ FIX: destructure with safe fallbacks so nothing is ever undefined
// //   const {
// //     tasks         = [],
// //     showConfetti  = false,
// //     subjects      = [],
// //     tomorrowTasks = [],
// //     userName      = '',
// //   } = useApp();

// //   const mainRef = useRef();
// //   const today = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });

// //   useEffect(() => {
// //     if (!mainRef.current) return;
// //     gsap.fromTo([...mainRef.current.children],
// //       { opacity: 0, y: 32 },
// //       { opacity: 1, y: 0, stagger: 0.09, duration: 0.6, ease: 'power3.out' }
// //     );
// //     gsap.fromTo('.prog-ring-wrap',
// //       { scale: 0.6, opacity: 0 },
// //       { scale: 1, opacity: 1, stagger: 0.12, duration: 0.6, ease: 'back.out(1.7)', delay: 0.5 }
// //     );
// //   }, []);

// //   // ✅ FIX: all three were crashing when arrays were undefined
// //   const pendingCount = tasks.filter(t => t.status === 'pending').length;
// //   const doneCount    = tasks.filter(t => t.status === 'done').length;
// //   const totalMins    = tasks.reduce((a, t) => a + (t.estimatedTime ?? 0), 0);
// //   const avgProgress  = subjects.length > 0
// //     ? Math.round(subjects.reduce((a, s) => a + (s.progress ?? 0), 0) / subjects.length)
// //     : 0; // ✅ FIX: avoid NaN when subjects is empty (division by zero)

// //   return (
// //     <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
// //       <Confetti show={showConfetti} />
// //       <Sidebar />

// //       <main ref={mainRef} style={{ flex: 1, overflowY: 'auto', padding: '28px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>

// //         {/* ── Header ── */}
// //         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
// //           <div>
// //             <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 3 }}>{today} · Chhotu Ram Public School</p>
// //             <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 26, color: 'var(--text-primary)' }}>
// //               Good morning, <span className="gradient-text">{userName}!</span> 👋
// //             </h1>
// //             <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 5 }}>
// //               {pendingCount} tasks pending today · {totalMins} min total study time
// //             </p>
// //           </div>
// //           <div style={{ display: 'flex', gap: 12 }}>
// //             {[
// //               { label: 'Done',      value: doneCount,    color: '#00c9b1', bg: 'rgba(0,201,177,0.08)' },
// //               { label: 'Remaining', value: pendingCount, color: '#1a3fa3', bg: 'rgba(26,63,163,0.08)' },
// //               { label: 'Minutes',   value: totalMins,    color: '#e8a020', bg: 'rgba(232,160,32,0.1)'  },
// //             ].map((s, i) => (
// //               <div key={i} style={{ padding: '12px 18px', borderRadius: 16, background: s.bg, border: `1px solid ${s.color}20`, textAlign: 'center', minWidth: 84 }}>
// //                 <p style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 24, color: s.color }}>{s.value}</p>
// //                 <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</p>
// //               </div>
// //             ))}
// //           </div>
// //         </div>

// //         {/* ── Two-column layout ── */}
// //         <div style={{ display: 'grid', gridTemplateColumns: '1fr 330px', gap: 20 }}>

// //           {/* LEFT */}
// //           <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

// //             {/* Today's Tasks */}
// //             <div className="card" style={{ padding: '22px' }}>
// //               <SectionHeader icon={Calendar} title="Today's Study Plan" />
// //               {tasks.length === 0
// //                 ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px 0', fontSize: 15 }}>🎉 All tasks done! You're crushing it!</p>
// //                 : tasks.map((t, i) => <TaskCard key={t._id} task={t} index={i} />)
// //               }
// //             </div>

// //             {/* Progress */}
// //             <div className="card" style={{ padding: '22px' }}>
// //               <SectionHeader icon={TrendingUp} title="Progress Overview" color="#00c9b1" />
// //               <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
// //                 {[
// //                   { value: avgProgress, color: '#1a3fa3', label: 'Syllabus Done',      sub: 'Overall'            },
// //                   { value: 72,          color: '#00c9b1', label: 'High-Weight',         sub: 'Chapters Covered'   },
// //                   { value: 55,          color: '#ff2d78', label: 'PYQ Practice',        sub: 'Completed'          },
// //                   { value: 40,          color: '#e8a020', label: 'Revisions',           sub: 'This Week'          },
// //                 ].map((r, i) => (
// //                   <div key={i} className="prog-ring-wrap">
// //                     <ProgressRing value={r.value} size={96} color={r.color} label={r.label} sublabel={r.sub} />
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>

// //           {/* RIGHT */}
// //           <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

// //             {/* Smart Insights */}
// //             <div className="card" style={{ padding: '18px' }}>
// //               <SectionHeader icon={Zap} title="Smart Insights" color="#e8a020" />
// //               <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
// //                 {insights.map((ins, i) => (
// //                   <div key={i} style={{
// //                     padding: '10px 14px', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'flex-start',
// //                     borderLeft: `3px solid ${ins.color}`, background: `${ins.color}06`,
// //                     animation: `slideUp 0.4s ease ${i * 0.1}s both`,
// //                   }}>
// //                     <div style={{ width: 26, height: 26, borderRadius: 7, background: `${ins.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
// //                       <ins.icon size={13} color={ins.color} />
// //                     </div>
// //                     <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{ins.text}</p>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             {/* Risk Alerts */}
// //             <div className="card" style={{ padding: '18px' }}>
// //               <SectionHeader icon={ShieldAlert} title="Risk Alerts" color="#ff2d78" />
// //               {risks.map((r, i) => (
// //                 <div key={i} style={{
// //                   padding: '10px 14px', borderRadius: 12, marginBottom: 8,
// //                   background: 'rgba(255,45,120,0.06)', border: '1px solid rgba(255,45,120,0.2)',
// //                   display: 'flex', gap: 10, alignItems: 'center',
// //                 }}>
// //                   <ShieldAlert size={14} color="#ff2d78" />
// //                   <div>
// //                     <p style={{ fontSize: 12, fontWeight: 600, color: '#ff2d78' }}>{r.chapter}</p>
// //                     <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Skipping may impact {r.marks} marks · {r.subject}</p>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>

// //             {/* Tomorrow Preview */}
// //             <div className="card" style={{ padding: '18px' }}>
// //               <SectionHeader icon={ChevronRight} title="Tomorrow's Preview" />
// //               {/* ✅ FIX: tomorrowTasks was undefined — now safely falls back to [] */}
// //               {tomorrowTasks.length === 0 ? (
// //                 <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>No preview available yet</p>
// //               ) : (
// //                 tomorrowTasks.map((t, i) => (
// //                   <div key={i} style={{
// //                     display: 'flex', alignItems: 'center', gap: 10,
// //                     padding: '9px 0',
// //                     borderBottom: i < tomorrowTasks.length - 1 ? '1px solid var(--border)' : 'none',
// //                   }}>
// //                     <div style={{ width: 7, height: 7, borderRadius: '50%', background: { Learn:'#1a3fa3', Revise1:'#9b59b6', Revise2:'#7d3b9c', PYQ:'#e8a020' }[t.taskType] ?? '#aaa', flexShrink: 0 }} />
// //                     <div style={{ flex: 1 }}>
// //                       <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{t.chapter}</p>
// //                       <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.subject} · {t.estimatedTime} min</p>
// //                     </div>
// //                     <span style={{ fontSize: 9, fontWeight: 700, color: '#1a3fa3', background: 'rgba(26,63,163,0.1)', padding: '2px 7px', borderRadius: 5 }}>
// //                       {t.taskType}
// //                     </span>
// //                   </div>
// //                 ))
// //               )}
// //             </div>

// //             {/* PYQ Quick Access */}
// //             <div className="card" style={{ padding: '18px', background: 'linear-gradient(135deg, rgba(26,63,163,0.04), rgba(232,160,32,0.04))' }}>
// //               <SectionHeader icon={BookOpen} title="PYQ Repository" color="#1a3fa3" />
// //               <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.6 }}>
// //                 Access CRPS previous year questions uploaded by your teachers.
// //               </p>
// //               <a href="/pyqs" style={{
// //                 display: 'flex', alignItems: 'center', gap: 6,
// //                 padding: '10px 16px', borderRadius: 10,
// //                 background: 'var(--school-blue)', color: 'white',
// //                 fontWeight: 600, fontSize: 13, cursor: 'pointer',
// //                 textDecoration: 'none', justifyContent: 'center',
// //                 boxShadow: '0 4px 16px rgba(26,63,163,0.3)',
// //               }}>
// //                 <BookOpen size={14} /> Browse PYQs
// //               </a>
// //             </div>
// //           </div>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }
// import { useRef, useEffect } from 'react';
// import { gsap } from 'gsap';
// import { useApp } from '../context/AppContext';
// import Sidebar from '../components/Sidebar';
// import TaskCard from '../components/TaskCard';
// // ✅ FIX Bug 30: Use the dynamic components instead of hardcoded inline arrays
// import InsightCard from '../components/InsightCard';
// import RiskAlert   from '../components/RiskAlert';
// import { Zap, Calendar, TrendingUp, ShieldAlert, ChevronRight, BookOpen } from 'lucide-react';

// // ── Progress ring ────────────────────────────────────────────────────────
// function ProgressRing({ value, size = 96, sw = 7, color = '#1a3fa3', label, sublabel }) {
//   const r    = (size - sw * 2) / 2;
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
//       {label    && <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center', maxWidth: size }}>{label}</span>}
//       {sublabel && <span style={{ fontSize: 9,  color: 'var(--text-muted)', textAlign: 'center' }}>{sublabel}</span>}
//     </div>
//   );
// }

// // ── Confetti ────────────────────────────────────────────────────────────
// function Confetti({ show }) {
//   if (!show) return null;
//   const pieces = Array.from({ length: 70 }, (_, i) => ({
//     id: i, color: ['#1a3fa3','#00c9b1','#ff2d78','#e8a020','#9b59b6'][i % 5],
//     left: Math.random() * 100, delay: Math.random() * 1.8, size: 6 + Math.random() * 8,
//   }));
//   return (
//     <>
//       {pieces.map(p => (
//         <div key={p.id} className="confetti-piece" style={{ left: `${p.left}%`, top: '-20px', background: p.color, width: p.size, height: p.size, animationDelay: `${p.delay}s`, borderRadius: Math.random() > 0.5 ? '50%' : '2px' }} />
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

// export default function Dashboard() {
//   const {
//     tasks         = [],
//     showConfetti  = false,
//     subjects      = [],
//     tomorrowTasks = [],
//     userName      = '',
//     examReadiness = 0,
//   } = useApp();

//   const mainRef   = useRef();
//   const headerRef = useRef();
//   const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

//   // ── Entrance animations ─────────────────────────────────────────────────
//   useEffect(() => {
//     if (!mainRef.current) return;

//     const tl = gsap.timeline();

//     // Header slides down
//     tl.fromTo(headerRef.current,
//       { opacity: 0, y: -24 },
//       { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
//     );

//     // Stat counters pop in
//     tl.fromTo('.dash-stat',
//       { opacity: 0, scale: 0.7, y: 10 },
//       { opacity: 1, scale: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'back.out(1.8)' },
//       '-=0.3'
//     );

//     // Main sections slide up
//     tl.fromTo('.dash-section',
//       { opacity: 0, y: 32 },
//       { opacity: 1, y: 0, stagger: 0.1, duration: 0.55, ease: 'power3.out' },
//       '-=0.2'
//     );

//     // Progress rings scale in with spring
//     tl.fromTo('.prog-ring-wrap',
//       { scale: 0.5, opacity: 0 },
//       { scale: 1, opacity: 1, stagger: 0.12, duration: 0.65, ease: 'back.out(1.9)' },
//       '-=0.4'
//     );

//     // Gentle float on stats
//     gsap.to('.dash-stat', {
//       y: -5, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.4,
//     });

//     // Continuous shimmer sweep on the readiness ring
//     gsap.to('.ring-glow', {
//       rotation: 360, duration: 8, repeat: -1, ease: 'linear', transformOrigin: 'center',
//     });
//   }, []);

//   // Re-animate task cards when tasks load
//   useEffect(() => {
//     gsap.fromTo('.task-card-wrap',
//       { opacity: 0, x: -16 },
//       { opacity: 1, x: 0, stagger: 0.07, duration: 0.4, ease: 'power2.out' }
//     );
//   }, [tasks.length]);

//   const pendingCount = tasks.filter(t => t.status === 'pending').length;
//   const doneCount    = tasks.filter(t => t.status === 'done').length;
//   const totalMins    = tasks.reduce((a, t) => a + (t.estimatedTime ?? 0), 0);

//   // ✅ FIX Bug 28: avgProgress from real subjects (via examReadiness in context)
//   const avgProgress = examReadiness;

//   return (
//     <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
//       <Confetti show={showConfetti} />
//       <Sidebar />

//       <main ref={mainRef} style={{ flex: 1, overflowY: 'auto', padding: '28px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>

//         {/* ── Header ── */}
//         <div ref={headerRef} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
//           <div>
//             <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 3 }}>{today} · Chhotu Ram Public School</p>
//             <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 26, color: 'var(--text-primary)' }}>
//               Good morning, <span className="gradient-text">{userName || 'Student'}!</span> 👋
//             </h1>
//             <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 5 }}>
//               {pendingCount} tasks pending · {totalMins} min total today
//             </p>
//           </div>

//           {/* Stat chips */}
//           <div style={{ display: 'flex', gap: 12 }}>
//             {[
//               { label: 'Done',      value: doneCount,    color: '#00c9b1', bg: 'rgba(0,201,177,0.08)'  },
//               { label: 'Remaining', value: pendingCount, color: '#1a3fa3', bg: 'rgba(26,63,163,0.08)'  },
//               { label: 'Minutes',   value: totalMins,    color: '#e8a020', bg: 'rgba(232,160,32,0.10)' },
//             ].map((s, i) => (
//               <div key={i} className="dash-stat" style={{ padding: '12px 18px', borderRadius: 16, background: s.bg, border: `1px solid ${s.color}22`, textAlign: 'center', minWidth: 84 }}>
//                 <p style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 24, color: s.color }}>{s.value}</p>
//                 <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ── Two-column layout ── */}
//         <div style={{ display: 'grid', gridTemplateColumns: '1fr 330px', gap: 20 }}>

//           {/* LEFT column */}
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

//             {/* Today's tasks */}
//             <div className="card dash-section" style={{ padding: '22px' }}>
//               <SectionHeader icon={Calendar} title="Today's Study Plan" />
//               {tasks.length === 0
//                 ? (
//                   <div style={{ textAlign: 'center', padding: '40px 0' }}>
//                     <p style={{ fontSize: 32, marginBottom: 10 }}>🎉</p>
//                     <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>All tasks done! You're crushing it!</p>
//                   </div>
//                 )
//                 : tasks.map((t, i) => (
//                   <div key={t._id} className="task-card-wrap">
//                     <TaskCard task={t} index={i} />
//                   </div>
//                 ))
//               }
//             </div>

//             {/* Progress rings */}
//             <div className="card dash-section" style={{ padding: '22px' }}>
//               <SectionHeader icon={TrendingUp} title="Progress Overview" color="#00c9b1" />
//               <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
//                 {[
//                   // ✅ FIX Bug 28: first ring uses real examReadiness
//                   { value: avgProgress, color: '#1a3fa3', label: 'Syllabus Done',    sub: 'Overall'          },
//                   { value: subjects.length > 0 ? Math.round(subjects.filter(s => (s.chapters || []).some(c => (c.weightage || 0) >= 8 && c.done)).length / Math.max(1, subjects.reduce((a,s) => a + (s.chapters || []).filter(c => (c.weightage || 0) >= 8).length, 0)) * 100) : 0, color: '#00c9b1', label: 'High-Weight', sub: 'Chapters Covered' },
//                   { value: 55,          color: '#ff2d78', label: 'PYQ Practice',     sub: 'Completed'        },
//                   { value: 40,          color: '#e8a020', label: 'Revisions',         sub: 'This Week'        },
//                 ].map((r, i) => (
//                   <div key={i} className="prog-ring-wrap"
//                     onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.08, duration: 0.3, ease: 'back.out(1.5)' })}
//                     onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
//                   >
//                     <ProgressRing value={r.value} size={96} color={r.color} label={r.label} sublabel={r.sub} />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT column */}
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

//             {/* ✅ FIX Bug 30: Dynamic InsightCard — no more hardcoded strings */}
//             <div className="card dash-section" style={{ padding: '18px' }}>
//               <SectionHeader icon={Zap} title="Smart Insights" color="#e8a020" />
//               <InsightCard />
//             </div>

//             {/* ✅ FIX Bug 30: Dynamic RiskAlert — derived from real subject data */}
//             <div className="card dash-section" style={{ padding: '18px' }}>
//               <SectionHeader icon={ShieldAlert} title="Risk Alerts" color="#ff2d78" />
//               <RiskAlert />
//             </div>

//             {/* Tomorrow's preview */}
//             <div className="card dash-section" style={{ padding: '18px' }}>
//               <SectionHeader icon={ChevronRight} title="Tomorrow's Preview" />
//               {tomorrowTasks.length === 0 ? (
//                 <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>No preview available yet</p>
//               ) : (
//                 tomorrowTasks.map((t, i) => (
//                   <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < tomorrowTasks.length - 1 ? '1px solid var(--border)' : 'none' }}>
//                     <div style={{ width: 7, height: 7, borderRadius: '50%', background: { Learn:'#1a3fa3', Revise1:'#9b59b6', Revise2:'#7d3b9c', PYQ:'#e8a020' }[t.taskType] ?? '#aaa', flexShrink: 0 }} />
//                     <div style={{ flex: 1 }}>
//                       <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{t.chapter}</p>
//                       <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.subject} · {t.estimatedTime} min</p>
//                     </div>
//                     <span style={{ fontSize: 9, fontWeight: 700, color: '#1a3fa3', background: 'rgba(26,63,163,0.1)', padding: '2px 7px', borderRadius: 5 }}>{t.taskType}</span>
//                   </div>
//                 ))
//               )}
//             </div>

//             {/* PYQ access */}
//             <div className="card dash-section" style={{ padding: '18px', background: 'linear-gradient(135deg, rgba(26,63,163,0.04), rgba(232,160,32,0.04))' }}>
//               <SectionHeader icon={BookOpen} title="PYQ Repository" color="#1a3fa3" />
//               <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.65 }}>
//                 Access CRPS previous year questions uploaded by your teachers.
//               </p>
//               <a href="/pyqs"
//                 onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.04, y: -2 })}
//                 onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, y: 0 })}
//                 style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 10, background: 'var(--school-blue)', color: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer', textDecoration: 'none', justifyContent: 'center', boxShadow: '0 4px 16px rgba(26,63,163,0.3)' }}>
//                 <BookOpen size={14} /> Browse PYQs
//               </a>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import InsightCard from '../components/InsightCard';
import RiskAlert   from '../components/RiskAlert';
import {
  Zap, Calendar, TrendingUp, ShieldAlert, ChevronRight,
  BookOpen, School, Search, CheckCircle, X, Loader,
} from 'lucide-react';

// ── Progress ring ────────────────────────────────────────────────────────
function ProgressRing({ value, size = 96, sw = 7, color = '#1a3fa3', label, sublabel }) {
  const r      = (size - sw * 2) / 2;
  const circ   = 2 * Math.PI * r;
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
      {label    && <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center', maxWidth: size }}>{label}</span>}
      {sublabel && <span style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'center' }}>{sublabel}</span>}
    </div>
  );
}

// ── Confetti ─────────────────────────────────────────────────────────────
function Confetti({ show }) {
  if (!show) return null;
  const pieces = Array.from({ length: 70 }, (_, i) => ({
    id: i, color: ['#1a3fa3','#00c9b1','#ff2d78','#e8a020','#9b59b6'][i % 5],
    left: Math.random() * 100, delay: Math.random() * 1.8, size: 6 + Math.random() * 8,
  }));
  return (
    <>
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{ left: `${p.left}%`, top: '-20px', background: p.color, width: p.size, height: p.size, animationDelay: `${p.delay}s`, borderRadius: Math.random() > 0.5 ? '50%' : '2px' }} />
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

// ── Enrollment modal ──────────────────────────────────────────────────────
// Shown when a student has no classId. They search for a class by code and enroll.
function EnrollmentModal({ onEnrolled }) {
  const [classes, setClasses]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [enrolling, setEnrolling] = useState(null);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState('');
  const modalRef = useRef();

  // Fetch all available classes so student can pick their section
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem('token');
        const res   = await fetch('/api/class/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setClasses(data);
      } catch {
        // Fallback: ask for a class ID manually
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();

    // Animate in
    gsap.fromTo(modalRef.current,
      { opacity: 0, scale: 0.88, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
    );
    gsap.fromTo('.enroll-item',
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, stagger: 0.07, duration: 0.4, ease: 'power2.out', delay: 0.3 }
    );
  }, []);

  const handleEnroll = async (classId) => {
    setEnrolling(classId);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch(`/api/class/${classId}/enroll`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || 'Enrollment failed');
      }
      setDone(true);
      gsap.to(modalRef.current, { scale: 1.04, duration: 0.2, yoyo: true, repeat: 1 });
      setTimeout(onEnrolled, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnrolling(null);
    }
  };

  const CLASS_COLORS = { '9': '#1a3fa3', '10': '#00c9b1', '11': '#ff2d78', '12': '#e8a020' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div ref={modalRef} style={{ background: 'var(--bg-card)', borderRadius: 28, padding: '36px', width: '100%', maxWidth: 480, border: '1px solid var(--border)', boxShadow: '0 32px 100px rgba(0,0,0,0.3)' }}>

        {/* Top bar */}
        <div style={{ height: 4, background: 'linear-gradient(90deg,#1a3fa3,#00c9b1)', borderRadius: '4px 4px 0 0', margin: '-36px -36px 28px', borderTopLeftRadius: 28, borderTopRightRadius: 28 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(26,63,163,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <School size={22} color="var(--school-blue)" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)' }}>
              {done ? 'Enrolled! 🎉' : 'Join Your Class'}
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {done ? 'Refreshing your dashboard…' : 'Select your class section to get started'}
            </p>
          </div>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(255,45,120,0.08)', border: '1px solid rgba(255,45,120,0.2)', borderRadius: 10, fontSize: 13, color: '#ff2d78', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <X size={14} />{error}
          </div>
        )}

        {done ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: 60, height: 60, borderRadius: 18, background: 'rgba(0,201,177,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <CheckCircle size={30} color="#00c9b1" />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>You're enrolled! Your study plan is being prepared.</p>
          </div>
        ) : loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: 10, color: 'var(--text-muted)' }}>
            <Loader size={18} style={{ animation: 'rotateSpin 0.8s linear infinite' }} />
            <span style={{ fontSize: 13 }}>Loading available classes…</span>
          </div>
        ) : classes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', borderRadius: 16, border: '2px dashed var(--border)' }}>
            <School size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
            <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 6 }}>No classes available yet</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Ask your teacher to create a class section first, then come back to enroll.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto', paddingRight: 4 }}>
            {classes.map(cls => {
              const color = CLASS_COLORS[cls.name] || '#1a3fa3';
              const isEnrolling = enrolling === cls._id;
              return (
                <button
                  key={cls._id}
                  className="enroll-item"
                  onClick={() => handleEnroll(cls._id)}
                  disabled={!!enrolling}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '16px 18px', borderRadius: 16, textAlign: 'left',
                    background: `${color}06`, border: `1.5px solid ${color}22`,
                    cursor: enrolling ? 'not-allowed' : 'pointer',
                    opacity: enrolling && !isEnrolling ? 0.5 : 1,
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={e => { if (!enrolling) { e.currentTarget.style.background = `${color}12`; e.currentTarget.style.borderColor = color; } }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${color}06`; e.currentTarget.style.borderColor = `${color}22`; }}
                >
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 4px 14px ${color}40` }}>
                    <School size={18} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 2 }}>
                      Class {cls.name} — Section {cls.section}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {cls.subjects?.length || 0} subject{cls.subjects?.length !== 1 ? 's' : ''} · CRPS Bakhtawarpur
                    </p>
                  </div>
                  {isEnrolling ? (
                    <Loader size={16} color={color} style={{ animation: 'rotateSpin 0.8s linear infinite' }} />
                  ) : (
                    <ChevronRight size={16} color={color} />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────
export default function Dashboard() {
  const {
    tasks         = [],
    showConfetti  = false,
    subjects      = [],
    tomorrowTasks = [],
    userName      = '',
    examReadiness = 0,
    fetchSubjects,
    fetchTodayTasks,
    fetchTomorrowTasks,
  } = useApp();

  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [isEnrolled, setIsEnrolled]           = useState(true); // optimistic
  const mainRef   = useRef();
  const headerRef = useRef();

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Check enrollment status on mount
  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('/api/subjects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        // If subjects come back it means they're enrolled (classId set)
        // If empty AND tasks also empty, they might not be enrolled
        if (data.length === 0) {
          // Check if classId exists on the user — assume not enrolled
          // We'll show the modal after a brief delay so it doesn't flash
          setTimeout(() => setShowEnrollModal(true), 800);
        } else {
          setIsEnrolled(true);
        }
      } catch {
        // ignore
      }
    };
    checkEnrollment();
  }, []);

  // Entrance animations
  useEffect(() => {
    if (!mainRef.current) return;
    const tl = gsap.timeline();

    tl.fromTo(headerRef.current,
      { opacity: 0, y: -24 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
    tl.fromTo('.dash-stat',
      { opacity: 0, scale: 0.7, y: 10 },
      { opacity: 1, scale: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'back.out(1.8)' },
      '-=0.3'
    );
    tl.fromTo('.dash-section',
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.55, ease: 'power3.out' },
      '-=0.2'
    );
    tl.fromTo('.prog-ring-wrap',
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, stagger: 0.12, duration: 0.65, ease: 'back.out(1.9)' },
      '-=0.4'
    );

    gsap.to('.dash-stat', {
      y: -5, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.4,
    });
  }, []);

  useEffect(() => {
    gsap.fromTo('.task-card-wrap',
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, stagger: 0.07, duration: 0.4, ease: 'power2.out' }
    );
  }, [tasks.length]);

  const handleEnrolled = useCallback(() => {
    setShowEnrollModal(false);
    setIsEnrolled(true);
    // Re-fetch everything after enrollment
    fetchSubjects?.();
    fetchTodayTasks?.();
    fetchTomorrowTasks?.();
  }, [fetchSubjects, fetchTodayTasks, fetchTomorrowTasks]);

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const doneCount    = tasks.filter(t => t.status === 'done').length;
  const totalMins    = tasks.reduce((a, t) => a + (t.estimatedTime ?? 0), 0);
  const avgProgress  = examReadiness;

  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      <Confetti show={showConfetti} />

      {/* Enrollment modal — shown when student has no classId */}
      {showEnrollModal && <EnrollmentModal onEnrolled={handleEnrolled} />}

      <Sidebar />

      <main ref={mainRef} style={{ flex: 1, overflowY: 'auto', padding: '28px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ── Header ── */}
        <div ref={headerRef} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 3 }}>{today} · Chhotu Ram Public School</p>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 26, color: 'var(--text-primary)' }}>
              Good morning, <span className="gradient-text">{userName || 'Student'}!</span> 👋
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 5 }}>
              {subjects.length === 0
                ? 'Enroll in your class to see your personalised study plan'
                : `${pendingCount} tasks pending · ${totalMins} min total today`}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {/* Re-enroll button if not enrolled */}
            {subjects.length === 0 && (
              <button
                onClick={() => setShowEnrollModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '12px 20px', borderRadius: 14, border: 'none',
                  background: 'linear-gradient(135deg,#1a3fa3,#3a5fd4)',
                  color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(26,63,163,0.3)',
                }}
                onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.04, y: -2 })}
                onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, y: 0 })}
              >
                <School size={15} /> Join a Class
              </button>
            )}

            {/* Stat chips */}
            {subjects.length > 0 && [
              { label: 'Done',      value: doneCount,    color: '#00c9b1', bg: 'rgba(0,201,177,0.08)'  },
              { label: 'Remaining', value: pendingCount, color: '#1a3fa3', bg: 'rgba(26,63,163,0.08)'  },
              { label: 'Minutes',   value: totalMins,    color: '#e8a020', bg: 'rgba(232,160,32,0.10)' },
            ].map((s, i) => (
              <div key={i} className="dash-stat" style={{ padding: '12px 18px', borderRadius: 16, background: s.bg, border: `1px solid ${s.color}22`, textAlign: 'center', minWidth: 84 }}>
                <p style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 24, color: s.color }}>{s.value}</p>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Not-enrolled state ── */}
        {subjects.length === 0 ? (
          <div className="dash-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 24, textAlign: 'center', padding: '60px 40px', borderRadius: 28, border: '2px dashed var(--border)', background: 'var(--bg-card)' }}>
            <div style={{ fontSize: 72, lineHeight: 1 }}>📚</div>
            <div>
              <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 24, color: 'var(--text-primary)', marginBottom: 10 }}>
                You're not enrolled in a class yet
              </h2>
              <p style={{ color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto', lineHeight: 1.7, fontSize: 14 }}>
                Once you join your class section, your teacher's subjects and personalised study tasks will appear here automatically.
              </p>
            </div>
            <button
              onClick={() => setShowEnrollModal(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '14px 30px', borderRadius: 16, border: 'none',
                background: 'linear-gradient(135deg,#1a3fa3,#3a5fd4)',
                color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                boxShadow: '0 8px 28px rgba(26,63,163,0.3)',
              }}
              onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.05, y: -2 })}
              onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, y: 0 })}
            >
              <School size={18} /> Browse & Join a Class
            </button>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Don't see your class? Ask your teacher to create a section first.
            </p>
          </div>
        ) : (
          /* ── Main two-column layout ── */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 330px', gap: 20 }}>

            {/* LEFT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Today's tasks */}
              <div className="card dash-section" style={{ padding: '22px' }}>
                <SectionHeader icon={Calendar} title="Today's Study Plan" />
                {tasks.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <p style={{ fontSize: 32, marginBottom: 10 }}>🎉</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: 15, fontWeight: 600 }}>All tasks done! You're crushing it!</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>
                      No tasks scheduled yet? Ask your teacher to generate tasks.
                    </p>
                  </div>
                ) : (
                  tasks.map((t, i) => (
                    <div key={t._id} className="task-card-wrap">
                      <TaskCard task={t} index={i} />
                    </div>
                  ))
                )}
              </div>

              {/* Progress rings */}
              <div className="card dash-section" style={{ padding: '22px' }}>
                <SectionHeader icon={TrendingUp} title="Progress Overview" color="#00c9b1" />
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  {[
                    { value: avgProgress, color: '#1a3fa3', label: 'Syllabus Done',  sub: 'Overall'         },
                    { value: subjects.length > 0 ? Math.min(100, Math.round(doneCount / Math.max(1, tasks.length) * 100)) : 0, color: '#00c9b1', label: 'Tasks Today', sub: 'Completed' },
                    { value: 55, color: '#ff2d78', label: 'PYQ Practice',   sub: 'Completed'        },
                    { value: 40, color: '#e8a020', label: 'Revisions',      sub: 'This Week'        },
                  ].map((r, i) => (
                    <div key={i} className="prog-ring-wrap"
                      onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.08, duration: 0.3, ease: 'back.out(1.5)' })}
                      onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
                    >
                      <ProgressRing value={r.value} size={96} color={r.color} label={r.label} sublabel={r.sub} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Smart insights */}
              <div className="card dash-section" style={{ padding: '18px' }}>
                <SectionHeader icon={Zap} title="Smart Insights" color="#e8a020" />
                <InsightCard />
              </div>

              {/* Risk alerts */}
              <div className="card dash-section" style={{ padding: '18px' }}>
                <SectionHeader icon={ShieldAlert} title="Risk Alerts" color="#ff2d78" />
                <RiskAlert />
              </div>

              {/* Tomorrow */}
              <div className="card dash-section" style={{ padding: '18px' }}>
                <SectionHeader icon={ChevronRight} title="Tomorrow's Preview" />
                {tomorrowTasks.length === 0 ? (
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>No preview available yet</p>
                ) : tomorrowTasks.map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < tomorrowTasks.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: { Learn:'#1a3fa3', Revise1:'#9b59b6', Revise2:'#7d3b9c', PYQ:'#e8a020' }[t.taskType] ?? '#aaa', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{t.chapter}</p>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.subject} · {t.estimatedTime} min</p>
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#1a3fa3', background: 'rgba(26,63,163,0.1)', padding: '2px 7px', borderRadius: 5 }}>{t.taskType}</span>
                  </div>
                ))}
              </div>

              {/* PYQ access */}
              <div className="card dash-section" style={{ padding: '18px', background: 'linear-gradient(135deg, rgba(26,63,163,0.04), rgba(232,160,32,0.04))' }}>
                <SectionHeader icon={BookOpen} title="PYQ Repository" color="#1a3fa3" />
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.65 }}>
                  Access CRPS previous year questions uploaded by your teachers.
                </p>
                <a href="/pyqs"
                  onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.04, y: -2 })}
                  onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, y: 0 })}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 10, background: 'var(--school-blue)', color: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer', textDecoration: 'none', justifyContent: 'center', boxShadow: '0 4px 16px rgba(26,63,163,0.3)' }}>
                  <BookOpen size={14} /> Browse PYQs
                </a>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}