// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { gsap } from 'gsap';
// import { teacherService } from '../services/teacherService';
// import {
//   Plus, Trash2, ArrowLeft, Check, BookOpen, Layers,
//   AlertCircle, ChevronDown, ChevronUp, Sparkles, RefreshCw, Calendar
// } from 'lucide-react';

// const SUBJECT_COLORS = ['#1a3fa3','#00c9b1','#ff2d78','#e8a020','#9b59b6','#2ecc71','#e74c3c','#3498db'];

// const DIFFICULTY_CONFIG = {
//   easy:   { label: 'Easy',   color: '#00c9b1', bg: 'rgba(0,201,177,0.12)'  },
//   medium: { label: 'Medium', color: '#e8a020', bg: 'rgba(232,160,32,0.12)' },
//   hard:   { label: 'Hard',   color: '#ff2d78', bg: 'rgba(255,45,120,0.12)' },
// };

// const PYQ_CONFIG = {
//   low:    { label: 'Low',    color: '#8890aa', bg: 'rgba(136,144,170,0.12)' },
//   medium: { label: 'Medium', color: '#e8a020', bg: 'rgba(232,160,32,0.12)'  },
//   high:   { label: 'High',   color: '#00c9b1', bg: 'rgba(0,201,177,0.12)'  },
// };

// const emptyChapter = () => ({ name: '', weightage: 5, difficulty: 'medium', pyqFrequency: 'medium', estimatedTime: 45 });

// // ── Floating background ───────────────────────────────────────────────────
// function FloatingBg({ color }) {
//   useEffect(() => {
//     gsap.to('.as-blob', {
//       y: () => `random(-50, 50)`,
//       x: () => `random(-30, 30)`,
//       duration: () => `random(5, 9)`,
//       repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.25,
//     });
//   }, []);

//   return (
//     <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
//       {[...Array(8)].map((_, i) => (
//         <div key={i} className="as-blob" style={{
//           position: 'absolute',
//           top: `${i * 13}%`, left: `${(i * 17) % 100}%`,
//           width: `${150 + i * 40}px`, height: `${150 + i * 40}px`,
//           background: `radial-gradient(circle, ${color}08 0%, transparent 70%)`,
//           borderRadius: '50%', filter: 'blur(30px)',
//         }} />
//       ))}
//     </div>
//   );
// }

// // ── Chapter accordion row ─────────────────────────────────────────────────
// function ChapterRow({ chapter, index, onChange, onRemove, color, canRemove }) {
//   const [expanded, setExpanded] = useState(true);
//   const bodyRef = useRef();

//   const toggleExpand = () => {
//     if (expanded) {
//       gsap.to(bodyRef.current, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => setExpanded(false) });
//     } else {
//       setExpanded(true);
//       requestAnimationFrame(() => {
//         gsap.fromTo(bodyRef.current, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.35, ease: 'power2.out' });
//       });
//     }
//   };

//   return (
//     <div style={{
//       borderRadius: 18, border: `1.5px solid var(--border)`,
//       background: 'var(--bg-card)', overflow: 'hidden',
//       transition: 'border-color 0.3s ease',
//       animation: 'slideUp 0.4s ease both',
//     }}
//       onMouseEnter={e => e.currentTarget.style.borderColor = color + '60'}
//       onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
//     >
//       {/* Chapter header */}
//       <div style={{
//         padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
//         background: expanded ? `${color}05` : 'transparent', transition: 'background 0.25s ease',
//       }} onClick={toggleExpand}>
//         <div style={{
//           width: 32, height: 32, borderRadius: 10, background: color, flexShrink: 0,
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 14, color: 'white',
//         }}>
//           {index + 1}
//         </div>

//         <input
//           value={chapter.name}
//           onChange={e => onChange('name', e.target.value)}
//           onClick={e => e.stopPropagation()}
//           placeholder={`Chapter ${index + 1} name...`}
//           style={{
//             flex: 1, background: 'transparent', border: 'none',
//             fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15,
//             color: 'var(--text-primary)', outline: 'none',
//           }}
//         />

//         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//           <span style={{
//             fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 20,
//             background: `${color}15`, color,
//           }}>
//             W:{chapter.weightage}
//           </span>
//           {canRemove && (
//             <button onClick={e => { e.stopPropagation(); onRemove(); }} style={{
//               background: 'rgba(255,45,120,0.08)', border: 'none', borderRadius: 8,
//               padding: '5px 7px', color: '#ff2d78', cursor: 'pointer',
//               display: 'flex', alignItems: 'center',
//             }}
//               onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,45,120,0.18)'}
//               onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,45,120,0.08)'}
//             >
//               <Trash2 size={13} />
//             </button>
//           )}
//           {expanded ? <ChevronUp size={15} color="var(--text-muted)" /> : <ChevronDown size={15} color="var(--text-muted)" />}
//         </div>
//       </div>

//       {/* Chapter details */}
//       {expanded && (
//         <div ref={bodyRef} style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
//           <div style={{ width: '100%', height: 1, background: 'var(--border)' }} />

//           {/* Weightage slider */}
//           <div>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
//               <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
//                 Weightage (Exam Importance)
//               </label>
//               <span style={{
//                 fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18,
//                 color, minWidth: 30, textAlign: 'center',
//               }}>
//                 {chapter.weightage}
//               </span>
//             </div>
//             <div style={{ position: 'relative' }}>
//               <input type="range" min={1} max={10} value={chapter.weightage}
//                 onChange={e => onChange('weightage', Number(e.target.value))}
//                 style={{ width: '100%', accentColor: color, height: 6, cursor: 'pointer', borderRadius: 3 }}
//               />
//               <div style={{
//                 position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)',
//                 width: `${(chapter.weightage - 1) / 9 * 100}%`,
//                 height: 6, background: color, borderRadius: 3, pointerEvents: 'none',
//               }} />
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 6, fontWeight: 600 }}>
//               <span>1 · Low</span><span>5 · Medium</span><span>10 · Critical</span>
//             </div>
//           </div>

//           {/* Difficulty + PYQ Frequency row */}
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//             <div>
//               <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 10 }}>
//                 Difficulty
//               </label>
//               <div style={{ display: 'flex', gap: 6 }}>
//                 {Object.entries(DIFFICULTY_CONFIG).map(([key, cfg]) => (
//                   <button key={key} onClick={() => onChange('difficulty', key)} style={{
//                     flex: 1, padding: '8px 4px', borderRadius: 10, border: 'none', cursor: 'pointer',
//                     background: chapter.difficulty === key ? cfg.bg : 'var(--bg-primary)',
//                     border: `1.5px solid ${chapter.difficulty === key ? cfg.color : 'var(--border)'}`,
//                     color: chapter.difficulty === key ? cfg.color : 'var(--text-muted)',
//                     fontSize: 11, fontWeight: 700, transition: 'all 0.2s ease',
//                     transform: chapter.difficulty === key ? 'scale(1.05)' : 'scale(1)',
//                   }}>
//                     {cfg.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 10 }}>
//                 PYQ Frequency
//               </label>
//               <div style={{ display: 'flex', gap: 6 }}>
//                 {Object.entries(PYQ_CONFIG).map(([key, cfg]) => (
//                   <button key={key} onClick={() => onChange('pyqFrequency', key)} style={{
//                     flex: 1, padding: '8px 4px', borderRadius: 10, cursor: 'pointer', border: 'none',
//                     background: chapter.pyqFrequency === key ? cfg.bg : 'var(--bg-primary)',
//                     border: `1.5px solid ${chapter.pyqFrequency === key ? cfg.color : 'var(--border)'}`,
//                     color: chapter.pyqFrequency === key ? cfg.color : 'var(--text-muted)',
//                     fontSize: 11, fontWeight: 700, transition: 'all 0.2s ease',
//                     transform: chapter.pyqFrequency === key ? 'scale(1.05)' : 'scale(1)',
//                   }}>
//                     {cfg.label}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Estimated time */}
//           <div>
//             <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
//               Estimated Study Time (minutes)
//             </label>
//             <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
//               {[30, 45, 60, 90, 120].map(t => (
//                 <button key={t} onClick={() => onChange('estimatedTime', t)} style={{
//                   padding: '8px 16px', borderRadius: 10, cursor: 'pointer', border: 'none',
//                   background: chapter.estimatedTime === t ? `${color}15` : 'var(--bg-primary)',
//                   border: `1.5px solid ${chapter.estimatedTime === t ? color : 'var(--border)'}`,
//                   color: chapter.estimatedTime === t ? color : 'var(--text-muted)',
//                   fontWeight: 700, fontSize: 12, transition: 'all 0.2s ease',
//                   transform: chapter.estimatedTime === t ? 'scale(1.05)' : 'scale(1)',
//                 }}>
//                   {t}m
//                 </button>
//               ))}
//               <input type="number" value={chapter.estimatedTime} min={15} max={300}
//                 onChange={e => onChange('estimatedTime', Number(e.target.value))}
//                 style={{
//                   width: 80, padding: '8px 12px', borderRadius: 10,
//                   border: '1.5px solid var(--border)', background: 'var(--bg-primary)',
//                   color: 'var(--text-primary)', fontSize: 13, fontWeight: 700, outline: 'none',
//                   textAlign: 'center',
//                 }}
//                 onFocus={e => e.target.style.borderColor = color}
//                 onBlur={e => e.target.style.borderColor = 'var(--border)'}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Main component ────────────────────────────────────────────────────────
// const AddSubject = () => {
//   const { classId } = useParams();
//   const navigate = useNavigate();
//   const headerRef = useRef();
//   const formRef = useRef();

//   const [subjectData, setSubjectData] = useState({ name: '', examDate: '', color: '#1a3fa3' });
//   const [chapters, setChapters] = useState([emptyChapter()]);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     gsap.fromTo(headerRef.current?.children || [],
//       { opacity: 0, y: -20 },
//       { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out' }
//     );
//     gsap.fromTo(formRef.current?.children || [],
//       { opacity: 0, y: 30, scale: 0.97 },
//       { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.5, ease: 'back.out(1.4)', delay: 0.25 }
//     );
//   }, []);

//   const handleSubjectChange = (field, value) => {
//     setSubjectData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleChapterChange = (index, field, value) => {
//     setChapters(prev => prev.map((ch, i) => i === index ? { ...ch, [field]: value } : ch));
//   };

//   const addChapter = () => {
//     setChapters(prev => [...prev, emptyChapter()]);
//     setTimeout(() => {
//       gsap.fromTo('.chapter-row:last-child',
//         { opacity: 0, y: 20, scale: 0.96 },
//         { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.4)' }
//       );
//     }, 30);
//   };

//   const removeChapter = (index) => {
//     setChapters(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async () => {
//     if (!subjectData.name.trim()) { setError('Subject name is required'); return; }
//     if (!subjectData.examDate) { setError('Exam date is required'); return; }
//     if (chapters.some(c => !c.name.trim())) { setError('All chapter names are required'); return; }

//     setLoading(true);
//     setError('');

//     try {
//       await teacherService.createSubject(classId, { ...subjectData, chapters });
//       setSuccess(true);

//       gsap.to(formRef.current, { y: -10, opacity: 0, scale: 0.98, duration: 0.5, ease: 'power2.in' });
//       setTimeout(() => navigate('/teacher/dashboard'), 1200);
//     } catch (err) {
//       setError(err.message || 'Failed to add subject. Please try again.');
//       setLoading(false);
//     }
//   };

//   const activeColor = subjectData.color;

//   if (success) {
//     return (
//       <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, padding: 40, minHeight: '80vh' }}>
//         <div style={{
//           width: 90, height: 90, borderRadius: 26, background: 'rgba(0,201,177,0.12)',
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           animation: 'float2 2s ease-in-out infinite',
//           boxShadow: '0 0 30px rgba(0,201,177,0.3)',
//         }}>
//           <Check size={42} color="#00c9b1" />
//         </div>
//         <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--text-primary)' }}>
//           Subject Added! 🎉
//         </h2>
//         <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
//           <strong style={{ color: '#00c9b1' }}>{subjectData.name}</strong> with {chapters.length} chapter{chapters.length !== 1 ? 's' : ''} saved to the class.
//         </p>
//         <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Redirecting to dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-primary)', position: 'relative' }}>
//       <FloatingBg color={activeColor} />

//       <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 24px', position: 'relative', zIndex: 1 }}>

//         {/* ── Header ── */}
//         <div ref={headerRef} style={{ marginBottom: 36 }}>
//           <button onClick={() => navigate('/teacher/dashboard')} style={{
//             display: 'flex', alignItems: 'center', gap: 7, marginBottom: 24,
//             background: 'var(--bg-card)', border: '1px solid var(--border)',
//             padding: '8px 16px', borderRadius: 10, cursor: 'pointer',
//             color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600,
//           }}
//             onMouseEnter={e => gsap.to(e.currentTarget, { x: -4 })}
//             onMouseLeave={e => gsap.to(e.currentTarget, { x: 0 })}
//           >
//             <ArrowLeft size={15} /> Back to Dashboard
//           </button>

//           <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
//             <div style={{ width: 52, height: 52, borderRadius: 16, background: `${activeColor}15`, border: `2px solid ${activeColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//               <BookOpen size={24} color={activeColor} />
//             </div>
//             <div>
//               <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--text-primary)' }}>
//                 Add New Subject
//               </h1>
//               <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Configure subject details and all chapters</p>
//             </div>
//           </div>
//         </div>

//         <div ref={formRef} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

//           {/* ── Subject Details Card ── */}
//           <div style={{ background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
//             {/* Gradient top bar */}
//             <div style={{ height: 4, background: `linear-gradient(90deg, ${activeColor}, ${activeColor}70)` }} />
//             <div style={{ padding: '28px' }}>
//               <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 17, color: 'var(--text-primary)', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
//                 <Layers size={18} color={activeColor} /> Subject Details
//               </h2>

//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
//                 {/* Name */}
//                 <div style={{ gridColumn: '1 / -1' }}>
//                   <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
//                     Subject Name *
//                   </label>
//                   <input
//                     value={subjectData.name}
//                     onChange={e => handleSubjectChange('name', e.target.value)}
//                     placeholder="e.g. Mathematics, Physics, Chemistry..."
//                     style={{
//                       width: '100%', padding: '13px 18px', borderRadius: 14,
//                       border: `1.5px solid var(--border)`, background: 'var(--bg-primary)',
//                       color: 'var(--text-primary)', fontSize: 15, fontWeight: 600, outline: 'none',
//                       transition: 'border-color 0.25s ease',
//                       fontFamily: 'Syne,sans-serif',
//                     }}
//                     onFocus={e => e.target.style.borderColor = activeColor}
//                     onBlur={e => e.target.style.borderColor = 'var(--border)'}
//                   />
//                 </div>

//                 {/* Exam date */}
//                 <div>
//                   <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
//                     Exam Date *
//                   </label>
//                   <div style={{ position: 'relative' }}>
//                     <Calendar size={15} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
//                     <input type="date"
//                       value={subjectData.examDate}
//                       onChange={e => handleSubjectChange('examDate', e.target.value)}
//                       style={{
//                         width: '100%', padding: '13px 14px 13px 42px', borderRadius: 14,
//                         border: `1.5px solid var(--border)`, background: 'var(--bg-primary)',
//                         color: 'var(--text-primary)', fontSize: 14, outline: 'none',
//                       }}
//                       onFocus={e => e.target.style.borderColor = activeColor}
//                       onBlur={e => e.target.style.borderColor = 'var(--border)'}
//                     />
//                   </div>
//                 </div>

//                 {/* Color picker */}
//                 <div>
//                   <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
//                     Subject Color
//                   </label>
//                   <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
//                     {SUBJECT_COLORS.map(c => (
//                       <button key={c} onClick={() => handleSubjectChange('color', c)} style={{
//                         width: 34, height: 34, borderRadius: 10, background: c,
//                         border: activeColor === c ? '3px solid var(--text-primary)' : '2px solid transparent',
//                         cursor: 'pointer', outline: 'none',
//                         transform: activeColor === c ? 'scale(1.2)' : 'scale(1)',
//                         transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
//                         boxShadow: activeColor === c ? `0 0 12px ${c}80` : 'none',
//                       }} />
//                     ))}
//                     <input type="color" value={activeColor} onChange={e => handleSubjectChange('color', e.target.value)}
//                       style={{ width: 34, height: 34, borderRadius: 10, border: '1px solid var(--border)', cursor: 'pointer', padding: 2, background: 'var(--bg-primary)' }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ── Chapters Card ── */}
//           <div style={{ background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
//             <div style={{ height: 4, background: `linear-gradient(90deg, ${activeColor}70, ${activeColor})` }} />
//             <div style={{ padding: '28px' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
//                 <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 17, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
//                   <BookOpen size={18} color={activeColor} />
//                   Chapters
//                   <span style={{ fontSize: 12, fontWeight: 800, background: `${activeColor}15`, color: activeColor, padding: '2px 10px', borderRadius: 20 }}>
//                     {chapters.length}
//                   </span>
//                 </h2>
//                 <button onClick={addChapter} style={{
//                   display: 'flex', alignItems: 'center', gap: 7,
//                   padding: '9px 18px', borderRadius: 12, border: 'none',
//                   background: `${activeColor}12`, color: activeColor,
//                   fontWeight: 700, fontSize: 13, cursor: 'pointer',
//                   transition: 'all 0.25s ease',
//                 }}
//                   onMouseEnter={e => { e.currentTarget.style.background = `${activeColor}22`; gsap.to(e.currentTarget, { scale: 1.04 }); }}
//                   onMouseLeave={e => { e.currentTarget.style.background = `${activeColor}12`; gsap.to(e.currentTarget, { scale: 1 }); }}
//                 >
//                   <Plus size={14} /> Add Chapter
//                 </button>
//               </div>

//               <div className="chapter-rows" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
//                 {chapters.map((chapter, index) => (
//                   <div key={index} className="chapter-row">
//                     <ChapterRow
//                       chapter={chapter}
//                       index={index}
//                       color={activeColor}
//                       canRemove={chapters.length > 1}
//                       onChange={(field, value) => handleChapterChange(index, field, value)}
//                       onRemove={() => removeChapter(index)}
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* ── Summary & Submit ── */}
//           <div style={{ background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border)', padding: '24px 28px', boxShadow: 'var(--shadow-card)' }}>
//             {error && (
//               <div style={{
//                 display: 'flex', alignItems: 'center', gap: 10,
//                 padding: '12px 16px', borderRadius: 12, marginBottom: 18,
//                 background: 'rgba(255,45,120,0.08)', border: '1px solid rgba(255,45,120,0.2)',
//               }}>
//                 <AlertCircle size={16} color="#ff2d78" />
//                 <span style={{ fontSize: 13, color: '#ff2d78' }}>{error}</span>
//               </div>
//             )}

//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
//               <div>
//                 <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
//                   {subjectData.name || 'Untitled Subject'} · {chapters.length} chapter{chapters.length !== 1 ? 's' : ''}
//                 </p>
//                 <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
//                   {subjectData.examDate ? `Exam: ${new Date(subjectData.examDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : 'Exam date not set'}
//                 </p>
//               </div>

//               <div style={{ display: 'flex', gap: 10 }}>
//                 <button onClick={() => navigate('/teacher/dashboard')} style={{
//                   padding: '13px 22px', borderRadius: 14, border: '1px solid var(--border)',
//                   background: 'transparent', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', fontSize: 14,
//                 }}>
//                   Cancel
//                 </button>
//                 <button onClick={handleSubmit} disabled={loading} style={{
//                   display: 'flex', alignItems: 'center', gap: 9,
//                   padding: '13px 28px', borderRadius: 14, border: 'none',
//                   background: `linear-gradient(135deg, ${activeColor}, ${activeColor}cc)`,
//                   color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer',
//                   boxShadow: `0 6px 24px ${activeColor}40`,
//                   opacity: loading ? 0.75 : 1,
//                   transition: 'all 0.3s ease',
//                 }}
//                   onMouseEnter={e => !loading && gsap.to(e.currentTarget, { scale: 1.04, y: -2 })}
//                   onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, y: 0 })}
//                 >
//                   {loading
//                     ? <><RefreshCw size={15} style={{ animation: 'rotateSpin 0.8s linear infinite' }} /> Saving...</>
//                     : <><Sparkles size={15} /> Save Subject</>}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddSubject;
// ✅ FIX Bug 34: No duplicate subject name validation existed.
//   A teacher could add "Mathematics" twice to the same class — both frontend and the API
//   call would silently succeed.  Fix adds:
//   1. Frontend uniqueness check before the API call (case-insensitive, trimmed).
//   2. An inline red error banner that highlights the duplicate name field.
//   3. The existing chapter-name required check is preserved.
//   (The matching server-side guard should be added in server/routes/subjects.js — see comment
//    at the bottom of this file for the recommended Mongoose unique-index approach.)

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { teacherService } from '../services/teacherService';
import {
  Plus, Trash2, ArrowLeft, Check, BookOpen, Layers,
  AlertCircle, ChevronDown, ChevronUp, Sparkles, RefreshCw, Calendar,
} from 'lucide-react';

const SUBJECT_COLORS = ['#1a3fa3','#00c9b1','#ff2d78','#e8a020','#9b59b6','#2ecc71','#e74c3c','#3498db'];

const DIFFICULTY_CONFIG = {
  easy:   { label: 'Easy',   color: '#00c9b1', bg: 'rgba(0,201,177,0.12)'  },
  medium: { label: 'Medium', color: '#e8a020', bg: 'rgba(232,160,32,0.12)' },
  hard:   { label: 'Hard',   color: '#ff2d78', bg: 'rgba(255,45,120,0.12)' },
};

const PYQ_CONFIG = {
  low:    { label: 'Low',    color: '#8890aa', bg: 'rgba(136,144,170,0.12)' },
  medium: { label: 'Medium', color: '#e8a020', bg: 'rgba(232,160,32,0.12)'  },
  high:   { label: 'High',   color: '#00c9b1', bg: 'rgba(0,201,177,0.12)'  },
};

const emptyChapter = () => ({ name: '', weightage: 5, difficulty: 'medium', pyqFrequency: 'medium', estimatedTime: 45 });

// ── Floating background ───────────────────────────────────────────────────
function FloatingBg({ color }) {
  useEffect(() => {
    gsap.to('.as-blob', {
      y: () => `random(-50, 50)`, x: () => `random(-30, 30)`,
      duration: () => `random(5, 9)`, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.25,
    });
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {[...Array(8)].map((_, i) => (
        <div key={i} className="as-blob" style={{
          position: 'absolute', top: `${i * 13}%`, left: `${(i * 17) % 100}%`,
          width: `${150 + i * 40}px`, height: `${150 + i * 40}px`,
          background: `radial-gradient(circle, ${color}08 0%, transparent 70%)`,
          borderRadius: '50%', filter: 'blur(30px)',
        }} />
      ))}
    </div>
  );
}

// ── Chapter accordion row ─────────────────────────────────────────────────
function ChapterRow({ chapter, index, onChange, onRemove, color, canRemove }) {
  const [expanded, setExpanded] = useState(true);
  const bodyRef = useRef();

  const toggleExpand = () => {
    if (expanded) {
      gsap.to(bodyRef.current, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => setExpanded(false) });
    } else {
      setExpanded(true);
      requestAnimationFrame(() => {
        gsap.fromTo(bodyRef.current, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.35, ease: 'power2.out' });
      });
    }
  };

  return (
    <div
      style={{ borderRadius: 18, border: `1.5px solid var(--border)`, background: 'var(--bg-card)', overflow: 'hidden', transition: 'border-color 0.3s ease', animation: 'slideUp 0.4s ease both' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = color + '60'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {/* Header */}
      <div
        style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', background: expanded ? `${color}05` : 'transparent', transition: 'background 0.25s ease' }}
        onClick={toggleExpand}
      >
        <div style={{ width: 32, height: 32, borderRadius: 10, background: color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 14, color: 'white' }}>
          {index + 1}
        </div>
        <input
          value={chapter.name}
          onChange={e => onChange('name', e.target.value)}
          onClick={e => e.stopPropagation()}
          placeholder={`Chapter ${index + 1} name…`}
          style={{ flex: 1, background: 'transparent', border: 'none', fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', outline: 'none' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 20, background: `${color}15`, color }}>W:{chapter.weightage}</span>
          {canRemove && (
            <button onClick={e => { e.stopPropagation(); onRemove(); }} style={{ background: 'rgba(255,45,120,0.08)', border: 'none', borderRadius: 8, padding: '5px 7px', color: '#ff2d78', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Trash2 size={13} />
            </button>
          )}
          {expanded ? <ChevronUp size={15} color="var(--text-muted)" /> : <ChevronDown size={15} color="var(--text-muted)" />}
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div ref={bodyRef} style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ width: '100%', height: 1, background: 'var(--border)' }} />

          {/* Weightage */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Weightage (Exam Importance)</label>
              <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, color, minWidth: 30, textAlign: 'center' }}>{chapter.weightage}</span>
            </div>
            <input type="range" min={1} max={10} value={chapter.weightage}
              onChange={e => onChange('weightage', Number(e.target.value))}
              style={{ width: '100%', accentColor: color, height: 6, cursor: 'pointer', borderRadius: 3 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 6, fontWeight: 600 }}>
              <span>1 · Low</span><span>5 · Medium</span><span>10 · Critical</span>
            </div>
          </div>

          {/* Difficulty + PYQ Frequency */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 10 }}>Difficulty</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {Object.entries(DIFFICULTY_CONFIG).map(([key, cfg]) => (
                  <button key={key} onClick={() => onChange('difficulty', key)} style={{
                    flex: 1, padding: '8px 4px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: chapter.difficulty === key ? cfg.bg : 'var(--bg-primary)',
                    border: `1.5px solid ${chapter.difficulty === key ? cfg.color : 'var(--border)'}`,
                    color: chapter.difficulty === key ? cfg.color : 'var(--text-muted)',
                    fontSize: 11, fontWeight: 700, transition: 'all 0.2s ease',
                    transform: chapter.difficulty === key ? 'scale(1.05)' : 'scale(1)',
                  }}>{cfg.label}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 10 }}>PYQ Frequency</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {Object.entries(PYQ_CONFIG).map(([key, cfg]) => (
                  <button key={key} onClick={() => onChange('pyqFrequency', key)} style={{
                    flex: 1, padding: '8px 4px', borderRadius: 10, cursor: 'pointer', border: 'none',
                    background: chapter.pyqFrequency === key ? cfg.bg : 'var(--bg-primary)',
                    border: `1.5px solid ${chapter.pyqFrequency === key ? cfg.color : 'var(--border)'}`,
                    color: chapter.pyqFrequency === key ? cfg.color : 'var(--text-muted)',
                    fontSize: 11, fontWeight: 700, transition: 'all 0.2s ease',
                    transform: chapter.pyqFrequency === key ? 'scale(1.05)' : 'scale(1)',
                  }}>{cfg.label}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Estimated time */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Estimated Study Time (minutes)</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[30, 45, 60, 90, 120].map(t => (
                <button key={t} onClick={() => onChange('estimatedTime', t)} style={{
                  padding: '8px 16px', borderRadius: 10, cursor: 'pointer', border: 'none',
                  background: chapter.estimatedTime === t ? `${color}15` : 'var(--bg-primary)',
                  border: `1.5px solid ${chapter.estimatedTime === t ? color : 'var(--border)'}`,
                  color: chapter.estimatedTime === t ? color : 'var(--text-muted)',
                  fontWeight: 700, fontSize: 12, transition: 'all 0.2s ease',
                  transform: chapter.estimatedTime === t ? 'scale(1.05)' : 'scale(1)',
                }}>{t}m</button>
              ))}
              <input type="number" value={chapter.estimatedTime} min={15} max={300}
                onChange={e => onChange('estimatedTime', Number(e.target.value))}
                style={{ width: 80, padding: '8px 12px', borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 700, outline: 'none', textAlign: 'center' }}
                onFocus={e => e.target.style.borderColor = color}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
const AddSubject = () => {
  const { classId } = useParams();
  const navigate    = useNavigate();
  const headerRef   = useRef();
  const formRef     = useRef();

  const [subjectData, setSubjectData] = useState({ name: '', examDate: '', color: '#1a3fa3' });
  const [chapters, setChapters]       = useState([emptyChapter()]);
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState(false);
  const [error, setError]             = useState('');

  // ── Fetch existing subjects so we can check for duplicates ───────────
  const [existingNames, setExistingNames] = useState([]);

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const token = localStorage.getItem('token');
        const res   = await fetch(`/api/subjects/class/${classId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        // Store lower-cased names for case-insensitive comparison
        setExistingNames(data.map(s => s.name.trim().toLowerCase()));
      } catch {
        // Non-blocking — validation will just skip if fetch fails
      }
    };
    if (classId) fetchExisting();
  }, [classId]);

  useEffect(() => {
    gsap.fromTo(headerRef.current?.children || [],
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out' }
    );
    gsap.fromTo(formRef.current?.children || [],
      { opacity: 0, y: 30, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.5, ease: 'back.out(1.4)', delay: 0.25 }
    );
  }, []);

  const handleSubjectChange = (field, value) => {
    setSubjectData(prev => ({ ...prev, [field]: value }));
    // Clear duplicate error when name changes
    if (field === 'name') setError('');
  };

  const handleChapterChange = (index, field, value) => {
    setChapters(prev => prev.map((ch, i) => i === index ? { ...ch, [field]: value } : ch));
  };

  const addChapter = () => {
    setChapters(prev => [...prev, emptyChapter()]);
    setTimeout(() => {
      gsap.fromTo('.chapter-row:last-child',
        { opacity: 0, y: 20, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.4)' }
      );
    }, 30);
  };

  const removeChapter = (index) => {
    setChapters(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const trimmedName = subjectData.name.trim();

    // ── Validation ────────────────────────────────────────────────────
    if (!trimmedName) {
      setError('Subject name is required.');
      return;
    }
    if (!subjectData.examDate) {
      setError('Exam date is required.');
      return;
    }
    if (chapters.some(c => !c.name.trim())) {
      setError('All chapter names are required.');
      return;
    }

    // ✅ FIX Bug 34: Duplicate subject name check (case-insensitive)
    if (existingNames.includes(trimmedName.toLowerCase())) {
      setError(
        `A subject named "${trimmedName}" already exists in this class. ` +
        'Please choose a different name or edit the existing subject.'
      );
      // Shake the name input for extra feedback
      gsap.fromTo(
        '.subject-name-input',
        { x: -8 },
        { x: 8, duration: 0.08, yoyo: true, repeat: 6, ease: 'linear', onComplete: () => gsap.set('.subject-name-input', { x: 0 }) }
      );
      return;
    }

    setLoading(true);
    setError('');

    try {
      await teacherService.createSubject(classId, { ...subjectData, name: trimmedName, chapters });
      setSuccess(true);
      gsap.to(formRef.current, { y: -10, opacity: 0, scale: 0.98, duration: 0.5, ease: 'power2.in' });
      setTimeout(() => navigate('/teacher/dashboard'), 1200);
    } catch (err) {
      // ✅ Bug 34: also surface server-side duplicate error gracefully
      const msg = err.message || '';
      if (msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('already exists')) {
        setError(`A subject named "${trimmedName}" already exists in this class.`);
      } else {
        setError(msg || 'Failed to add subject. Please try again.');
      }
      setLoading(false);
    }
  };

  const activeColor = subjectData.color;

  // ── Success screen ────────────────────────────────────────────────────
  if (success) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, padding: 40, minHeight: '80vh' }}>
        <div style={{ width: 90, height: 90, borderRadius: 26, background: 'rgba(0,201,177,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'float2 2s ease-in-out infinite', boxShadow: '0 0 30px rgba(0,201,177,0.3)' }}>
          <Check size={42} color="#00c9b1" />
        </div>
        <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--text-primary)' }}>Subject Added! 🎉</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
          <strong style={{ color: '#00c9b1' }}>{subjectData.name}</strong> with {chapters.length} chapter{chapters.length !== 1 ? 's' : ''} saved to the class.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Redirecting to dashboard…</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-primary)', position: 'relative' }}>
      <FloatingBg color={activeColor} />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 24px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div ref={headerRef} style={{ marginBottom: 36 }}>
          <button onClick={() => navigate('/teacher/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 24, background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: 10, cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }}
            onMouseEnter={e => gsap.to(e.currentTarget, { x: -4 })}
            onMouseLeave={e => gsap.to(e.currentTarget, { x: 0 })}
          >
            <ArrowLeft size={15} /> Back to Dashboard
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: `${activeColor}15`, border: `2px solid ${activeColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={24} color={activeColor} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--text-primary)' }}>Add New Subject</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Configure subject details and all chapters</p>
            </div>
          </div>
        </div>

        <div ref={formRef} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Subject Details Card */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ height: 4, background: `linear-gradient(90deg, ${activeColor}, ${activeColor}70)` }} />
            <div style={{ padding: '28px' }}>
              <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 17, color: 'var(--text-primary)', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Layers size={18} color={activeColor} /> Subject Details
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Name */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                    Subject Name *
                  </label>
                  <input
                    className="subject-name-input"
                    value={subjectData.name}
                    onChange={e => handleSubjectChange('name', e.target.value)}
                    placeholder="e.g. Mathematics, Physics, Chemistry…"
                    style={{
                      width: '100%', padding: '13px 18px', borderRadius: 14,
                      border: `1.5px solid ${error && error.includes('subject named') ? '#ff2d78' : 'var(--border)'}`,
                      background: 'var(--bg-primary)', color: 'var(--text-primary)',
                      fontSize: 15, fontWeight: 600, outline: 'none',
                      transition: 'border-color 0.25s ease',
                      fontFamily: 'Syne,sans-serif',
                    }}
                    onFocus={e => e.target.style.borderColor = activeColor}
                    onBlur={e => e.target.style.borderColor = error && error.includes('subject named') ? '#ff2d78' : 'var(--border)'}
                  />
                </div>

                {/* Exam date */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Exam Date *</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={15} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                    <input type="date" value={subjectData.examDate}
                      onChange={e => handleSubjectChange('examDate', e.target.value)}
                      style={{ width: '100%', padding: '13px 14px 13px 42px', borderRadius: 14, border: `1.5px solid var(--border)`, background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                      onFocus={e => e.target.style.borderColor = activeColor}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Subject Color</label>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    {SUBJECT_COLORS.map(c => (
                      <button key={c} onClick={() => handleSubjectChange('color', c)} style={{
                        width: 34, height: 34, borderRadius: 10, background: c,
                        border: activeColor === c ? '3px solid var(--text-primary)' : '2px solid transparent',
                        cursor: 'pointer', outline: 'none',
                        transform: activeColor === c ? 'scale(1.2)' : 'scale(1)',
                        transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                        boxShadow: activeColor === c ? `0 0 12px ${c}80` : 'none',
                      }} />
                    ))}
                    <input type="color" value={activeColor} onChange={e => handleSubjectChange('color', e.target.value)}
                      style={{ width: 34, height: 34, borderRadius: 10, border: '1px solid var(--border)', cursor: 'pointer', padding: 2, background: 'var(--bg-primary)' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chapters Card */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ height: 4, background: `linear-gradient(90deg, ${activeColor}70, ${activeColor})` }} />
            <div style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 17, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BookOpen size={18} color={activeColor} />
                  Chapters
                  <span style={{ fontSize: 12, fontWeight: 800, background: `${activeColor}15`, color: activeColor, padding: '2px 10px', borderRadius: 20 }}>{chapters.length}</span>
                </h2>
                <button onClick={addChapter} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 12, border: 'none', background: `${activeColor}12`, color: activeColor, fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.25s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${activeColor}22`; gsap.to(e.currentTarget, { scale: 1.04 }); }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${activeColor}12`; gsap.to(e.currentTarget, { scale: 1 }); }}
                >
                  <Plus size={14} /> Add Chapter
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {chapters.map((chapter, index) => (
                  <div key={index} className="chapter-row">
                    <ChapterRow
                      chapter={chapter} index={index} color={activeColor}
                      canRemove={chapters.length > 1}
                      onChange={(field, value) => handleChapterChange(index, field, value)}
                      onRemove={() => removeChapter(index)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary & Submit */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border)', padding: '24px 28px', boxShadow: 'var(--shadow-card)' }}>
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, marginBottom: 18, background: 'rgba(255,45,120,0.08)', border: '1px solid rgba(255,45,120,0.2)' }}>
                <AlertCircle size={16} color="#ff2d78" />
                <span style={{ fontSize: 13, color: '#ff2d78' }}>{error}</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                  {subjectData.name || 'Untitled Subject'} · {chapters.length} chapter{chapters.length !== 1 ? 's' : ''}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {subjectData.examDate ? `Exam: ${new Date(subjectData.examDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : 'Exam date not set'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => navigate('/teacher/dashboard')} style={{ padding: '13px 22px', borderRadius: 14, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
                  Cancel
                </button>
                <button onClick={handleSubmit} disabled={loading} style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: '13px 28px', borderRadius: 14, border: 'none',
                  background: `linear-gradient(135deg, ${activeColor}, ${activeColor}cc)`,
                  color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  boxShadow: `0 6px 24px ${activeColor}40`,
                  opacity: loading ? 0.75 : 1, transition: 'all 0.3s ease',
                }}
                  onMouseEnter={e => !loading && gsap.to(e.currentTarget, { scale: 1.04, y: -2 })}
                  onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, y: 0 })}
                >
                  {loading
                    ? <><RefreshCw size={15} style={{ animation: 'rotateSpin 0.8s linear infinite' }} /> Saving…</>
                    : <><Sparkles size={15} /> Save Subject</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubject;

/*
 * ── SERVER-SIDE companion fix for Bug 34 ────────────────────────────────
 * In server/routes/subjects.js (POST /api/subjects/class/:classId), add:
 *
 *   const exists = await Subject.findOne({
 *     classId: req.params.classId,
 *     name: { $regex: new RegExp(`^${req.body.name.trim()}$`, 'i') },
 *   });
 *   if (exists) {
 *     return res.status(409).json({
 *       message: `A subject named "${req.body.name.trim()}" already exists in this class.`,
 *     });
 *   }
 *
 * Or add a compound unique index on the Subject model:
 *   SubjectSchema.index({ classId: 1, name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });
 */