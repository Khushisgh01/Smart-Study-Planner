// import { useEffect, useRef, useState } from 'react';
// import { gsap } from 'gsap';
// import { useApp } from '../context/AppContext';
// import { getBadgeStyle } from '../utils/priorityEngine';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// function ProgressRing({ value, size = 80, strokeWidth = 7, color = '#1a3fa3' }) {
//   const r = (size - strokeWidth * 2) / 2;
//   const circ = 2 * Math.PI * r;
//   const offset = circ - (value / 100) * circ;
//   return (
//     <div style={{ position: 'relative', width: size, height: size }}>
//       <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
//         <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
//         <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
//           strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
//           style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)', filter: `drop-shadow(0 0 6px ${color}80)` }}
//         />
//       </svg>
//       <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: size * 0.22, color: 'var(--text-primary)' }}>{value}%</span>
//       </div>
//     </div>
//   );
// }

// function MiniCalendar({ examDates = [] }) {
//   const today = new Date();
//   const [month, setMonth] = useState(today.getMonth());
//   const [year, setYear] = useState(today.getFullYear());
//   const first = new Date(year, month, 1).getDay();
//   const days  = new Date(year, month + 1, 0).getDate();
//   const cells = Array.from({ length: first + days }, (_, i) => i < first ? null : i - first + 1);
//   const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
//   const isExamDay = d => examDates.some(ed => { const dt = new Date(ed); return dt.getDate()===d && dt.getMonth()===month && dt.getFullYear()===year; });
//   return (
//     <div style={{ padding: 12, background: 'var(--bg-primary)', borderRadius: 14, border: '1px solid var(--border)' }}>
//       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
//         <button onClick={() => month===0 ? (setMonth(11),setYear(y=>y-1)) : setMonth(m=>m-1)} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--text-secondary)',display:'flex',alignItems:'center',padding:2 }}>
//           <ChevronLeft size={13} />
//         </button>
//         <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-primary)' }}>{monthNames[month]} {year}</span>
//         <button onClick={() => month===11 ? (setMonth(0),setYear(y=>y+1)) : setMonth(m=>m+1)} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--text-secondary)',display:'flex',alignItems:'center',padding:2 }}>
//           <ChevronRight size={13} />
//         </button>
//       </div>
//       <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2, textAlign:'center' }}>
//         {['S','M','T','W','T','F','S'].map((d,i) => (
//           <span key={i} style={{ fontSize:9, color:'var(--text-muted)', fontWeight:700, padding:'2px 0' }}>{d}</span>
//         ))}
//         {cells.map((d,i) => (
//           <div key={i} style={{
//             fontSize:10, padding:'4px 2px', borderRadius:6,
//             background: d===today.getDate()&&month===today.getMonth() ? 'var(--school-blue)' : isExamDay(d) ? 'rgba(232,160,32,0.18)' : 'transparent',
//             color: d===today.getDate()&&month===today.getMonth() ? 'white' : isExamDay(d) ? '#c9820a' : d ? 'var(--text-secondary)' : 'transparent',
//             fontWeight: d===today.getDate()&&month===today.getMonth() ? 700 : isExamDay(d) ? 700 : 400,
//             cursor: d ? 'pointer' : 'default', position:'relative',
//           }}>
//             {d||''}
//             {isExamDay(d) && <div style={{ position:'absolute',bottom:1,left:'50%',transform:'translateX(-50%)',width:3,height:3,borderRadius:'50%',background:'#e8a020' }} />}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default function Sidebar() {
//   const { subjects, examReadiness } = useApp();
//   const [activeSubject, setActiveSubject] = useState(null);
//   const sidebarRef = useRef();

//   useEffect(() => {
//     gsap.fromTo(sidebarRef.current.children,
//       { opacity: 0, x: -24 },
//       { opacity: 1, x: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out', delay: 0.2 }
//     );
//   }, []);

//   const examDates = subjects.map(s => s.examDate);

//   return (
//     <aside ref={sidebarRef} style={{
//       width: 272, minHeight: '100%',
//       background: 'var(--bg-sidebar)',
//       borderRight: '1px solid var(--border)',
//       display: 'flex', flexDirection: 'column', gap: 20,
//       padding: '24px 14px',
//       overflowY: 'auto',
//       flexShrink: 0,
//     }}>
//       {/* Readiness */}
//       <div className="card" style={{ padding: '20px 16px', textAlign: 'center' }}>
//         <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
//           <ProgressRing value={examReadiness} size={88} color="var(--school-blue)" />
//         </div>
//         <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>Exam Readiness</p>
//         <div style={{
//           padding: '5px 14px', borderRadius: 20, display: 'inline-block', fontSize: 12, fontWeight: 700,
//           background: examReadiness >= 70 ? 'rgba(0,201,177,0.15)' : examReadiness >= 50 ? 'rgba(232,160,32,0.15)' : 'rgba(255,45,120,0.15)',
//           color: examReadiness >= 70 ? '#00c9b1' : examReadiness >= 50 ? '#c9820a' : '#ff2d78',
//         }}>
//           {examReadiness >= 70 ? '🚀 On Fire!' : examReadiness >= 50 ? '⚡ Building Up' : '😅 Need Focus'}
//         </div>
//       </div>

//       {/* Subjects */}
//       <div>
//         <h3 style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Subjects</h3>
//         {subjects.map(s => {
//           const badge = getBadgeStyle(s.badge);
//           const daysLeft = Math.ceil((new Date(s.examDate) - new Date()) / 86400000);
//           const isActive = activeSubject === s._id;
//           return (
//             <div key={s._id} onClick={() => setActiveSubject(isActive ? null : s._id)} style={{
//               padding: '12px 14px', borderRadius: 14, marginBottom: 8, cursor: 'pointer',
//               background: isActive ? `${s.color}12` : 'var(--bg-card)',
//               border: `1px solid ${isActive ? s.color + '50' : 'var(--border)'}`,
//               transition: 'all 0.3s ease',
//               transform: isActive ? 'scale(1.01)' : 'scale(1)',
//             }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
//                   <div style={{ width: 9, height: 9, borderRadius: '50%', background: s.color, flexShrink: 0, boxShadow: `0 0 6px ${s.color}60` }} />
//                   <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{s.name}</span>
//                 </div>
//                 <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: badge.bg, color: badge.color }}>
//                   {s.badge}
//                 </span>
//               </div>
//               <div style={{ marginBottom: 5 }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
//                   <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Progress</span>
//                   <span style={{ fontSize: 10, fontWeight: 700, color: s.color }}>{s.progress}%</span>
//                 </div>
//                 <div className="prog-bar">
//                   <div className="prog-fill" style={{ width: `${s.progress}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}aa)` }} />
//                 </div>
//               </div>
//               <span style={{ fontSize: 10, color: daysLeft < 10 ? '#ff2d78' : 'var(--text-muted)' }}>
//                 {daysLeft < 0 ? 'Exam passed' : `${daysLeft} days left`}
//               </span>
//             </div>
//           );
//         })}
//       </div>

//       {/* Calendar */}
//       <div>
//         <h3 style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Exam Dates</h3>
//         <MiniCalendar examDates={examDates} />
//       </div>
//     </aside>
//   );
// }
// ✅ FIX Bug 31: Removed the inline MiniCalendar definition that was duplicating MiniCalendar.jsx.
//               Now imports the single canonical component.
// ✅ FIX Bug 32: Removed the inline ProgressRing definition that was duplicating ProgressRing.jsx.
//               Now imports the single canonical component.

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useApp } from '../context/AppContext';
import { getBadgeStyle } from '../utils/priorityEngine';

// ── Canonical single-source components (Bug 31 + 32 fix) ─────────────────
import ProgressRing  from './ProgressRing';
import MiniCalendar  from './MiniCalendar';

export default function Sidebar() {
  const { subjects, examReadiness } = useApp();
  const [activeSubject, setActiveSubject] = useState(null);
  const sidebarRef = useRef();

  useEffect(() => {
    gsap.fromTo(sidebarRef.current.children,
      { opacity: 0, x: -24 },
      { opacity: 1, x: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out', delay: 0.2 }
    );
  }, []);

  const examDates = subjects.map(s => s.examDate);

  return (
    <aside ref={sidebarRef} style={{
      width: 272, minHeight: '100%',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', gap: 20,
      padding: '24px 14px',
      overflowY: 'auto',
      flexShrink: 0,
    }}>
      {/* Readiness */}
      <div className="card" style={{ padding: '20px 16px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          {/* ✅ Bug 32: using canonical ProgressRing import */}
          <ProgressRing value={examReadiness} size={88} color="var(--school-blue)" />
        </div>
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>Exam Readiness</p>
        <div style={{
          padding: '5px 14px', borderRadius: 20, display: 'inline-block', fontSize: 12, fontWeight: 700,
          background: examReadiness >= 70 ? 'rgba(0,201,177,0.15)' : examReadiness >= 50 ? 'rgba(232,160,32,0.15)' : 'rgba(255,45,120,0.15)',
          color:      examReadiness >= 70 ? '#00c9b1'              : examReadiness >= 50 ? '#c9820a'              : '#ff2d78',
        }}>
          {examReadiness >= 70 ? '🚀 On Fire!' : examReadiness >= 50 ? '⚡ Building Up' : '😅 Need Focus'}
        </div>
      </div>

      {/* Subjects */}
      <div>
        <h3 style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Subjects</h3>
        {subjects.map(s => {
          const badge    = getBadgeStyle(s.badge);
          const daysLeft = Math.ceil((new Date(s.examDate) - new Date()) / 86400000);
          const isActive = activeSubject === s._id;
          return (
            <div
              key={s._id}
              onClick={() => setActiveSubject(isActive ? null : s._id)}
              style={{
                padding: '12px 14px', borderRadius: 14, marginBottom: 8, cursor: 'pointer',
                background: isActive ? `${s.color}12` : 'var(--bg-card)',
                border: `1px solid ${isActive ? s.color + '50' : 'var(--border)'}`,
                transition: 'all 0.3s ease',
                transform: isActive ? 'scale(1.01)' : 'scale(1)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: s.color, flexShrink: 0, boxShadow: `0 0 6px ${s.color}60` }} />
                  <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{s.name}</span>
                </div>
                <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: badge.bg, color: badge.color }}>
                  {s.badge}
                </span>
              </div>
              <div style={{ marginBottom: 5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Progress</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: s.color }}>{s.progress}%</span>
                </div>
                <div className="prog-bar">
                  <div className="prog-fill" style={{ width: `${s.progress}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}aa)` }} />
                </div>
              </div>
              <span style={{ fontSize: 10, color: daysLeft < 10 ? '#ff2d78' : 'var(--text-muted)' }}>
                {daysLeft < 0 ? 'Exam passed' : `${daysLeft} days left`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Calendar — ✅ Bug 31: using canonical MiniCalendar import */}
      <div>
        <h3 style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Exam Dates</h3>
        <MiniCalendar examDates={examDates} />
      </div>
    </aside>
  );
}