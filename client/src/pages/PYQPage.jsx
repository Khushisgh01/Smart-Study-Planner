// import { useRef, useEffect, useState } from 'react';
// import { gsap } from 'gsap';
// import { useApp } from '../context/AppContext';
// import { BookOpen, Upload, Download, Trash2, FileText, Search, Filter, Plus, X, CheckCircle } from 'lucide-react';
// import Sidebar from '../components/Sidebar';

// function UploadModal({ subject, onClose, onUpload }) {
//   const [year, setYear] = useState('2024');
//   const [title, setTitle] = useState('');
//   const [file, setFile] = useState(null);
//   const [dragging, setDragging] = useState(false);
//   const modalRef = useRef();

//   useEffect(() => {
//     gsap.fromTo(modalRef.current,
//       { opacity: 0, scale: 0.88, y: 20 },
//       { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
//     );
//   }, []);

//   const handleSubmit = () => {
//     if (!title || !year) return;
//     onUpload(subject._id, { year, title, fileUrl: file ? URL.createObjectURL(file) : '#' });
//     onClose();
//   };

//   return (
//     <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(6px)' }}>
//       <div ref={modalRef} style={{ background: 'var(--bg-card)', borderRadius: 24, padding: 32, width: '90%', maxWidth: 480, border: '1px solid var(--border)', boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
//           <div>
//             <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)' }}>Upload PYQ</h2>
//             <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>for {subject?.name}</p>
//           </div>
//           <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
//             <X size={20} />
//           </button>
//         </div>

//         <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//           <div>
//             <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Exam Year</label>
//             <select value={year} onChange={e => setYear(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 14 }}>
//               {['2025','2024','2023','2022','2021','2020','2019','2018'].map(y => <option key={y} value={y}>{y}</option>)}
//             </select>
//           </div>

//           <div>
//             <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Title / Description</label>
//             <input value={title} onChange={e => setTitle(e.target.value)} placeholder={`e.g. CRPS ${subject?.name} Board PYQ ${year}`}
//               style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
//               onFocus={e => e.target.style.borderColor = '#1a3fa3'}
//               onBlur={e => e.target.style.borderColor = 'var(--border)'}
//             />
//           </div>

//           <div>
//             <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>PDF File</label>
//             <div
//               className="upload-zone"
//               onDragOver={e => { e.preventDefault(); setDragging(true); }}
//               onDragLeave={() => setDragging(false)}
//               onDrop={e => { e.preventDefault(); setDragging(false); setFile(e.dataTransfer.files[0]); }}
//               onClick={() => document.getElementById('pyq-file').click()}
//               style={{ borderColor: dragging ? '#1a3fa3' : undefined, background: dragging ? 'rgba(26,63,163,0.05)' : undefined }}
//             >
//               <input id="pyq-file" type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
//               {file ? (
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
//                   <CheckCircle size={18} color="#00c9b1" />
//                   <span style={{ fontSize: 13, fontWeight: 600, color: '#00c9b1' }}>{file.name}</span>
//                 </div>
//               ) : (
//                 <div>
//                   <Upload size={24} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
//                   <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Drop PDF here or click to browse</p>
//                   <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Supports .pdf files up to 20MB</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
//           <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 500, fontSize: 13 }}>
//             Cancel
//           </button>
//           <button onClick={handleSubmit} disabled={!title || !year} className="btn-primary" style={{ opacity: (!title || !year) ? 0.5 : 1, padding: '10px 22px', fontSize: 13 }}>
//             <Upload size={14} /> Upload PYQ
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function PYQPage() {
//   const { subjects, role, addPYQ, deletePYQ } = useApp();
//   const [search, setSearch] = useState('');
//   const [activeSubj, setActiveSubj] = useState(subjects[0]?._id);
//   const [showUpload, setShowUpload] = useState(false);
//   const [uploadSubject, setUploadSubject] = useState(null);
//   const pageRef = useRef();

//   useEffect(() => {
//     gsap.fromTo(pageRef.current.children,
//       { opacity: 0, y: 24 },
//       { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' }
//     );
//     gsap.fromTo('.pyq-card',
//       { opacity: 0, x: 20 },
//       { opacity: 1, x: 0, stagger: 0.07, duration: 0.4, ease: 'power2.out', delay: 0.3 }
//     );
//   }, [activeSubj]);

//   const currentSubject = subjects.find(s => s._id === activeSubj);
//   const filteredPYQs = (currentSubject?.pyqs || []).filter(p =>
//     p.title.toLowerCase().includes(search.toLowerCase()) || p.year.includes(search)
//   );

//   return (
//     <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
//       {role === 'student' && <Sidebar />}

//       <main style={{ flex: 1, overflowY: 'auto', padding: '28px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
//         <div ref={pageRef}>

//           {/* Header */}
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
//             <div>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
//                 <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(26,63,163,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                   <BookOpen size={18} color="var(--school-blue)" />
//                 </div>
//                 <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 24, color: 'var(--text-primary)' }}>
//                   {role === 'teacher' ? 'Manage PYQs' : 'Previous Year Questions'}
//                 </h1>
//               </div>
//               <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
//                 {role === 'teacher' ? 'Upload and manage PYQs for all subjects.' : 'CRPS Board PYQs organised by subject and year.'}
//               </p>
//             </div>

//             {/* Search */}
//             <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//               <div style={{ position: 'relative' }}>
//                 <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
//                 <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search PYQs..."
//                   style={{ paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', width: 200 }}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Subject Tabs */}
//           <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
//             {subjects.map(s => (
//               <button key={s._id} onClick={() => setActiveSubj(s._id)} style={{
//                 display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 20,
//                 background: activeSubj === s._id ? s.color : 'var(--bg-card)',
//                 color: activeSubj === s._id ? 'white' : 'var(--text-secondary)',
//                 border: `1.5px solid ${activeSubj === s._id ? s.color : 'var(--border)'}`,
//                 fontWeight: 600, fontSize: 13, cursor: 'pointer',
//                 transition: 'all 0.25s ease',
//                 boxShadow: activeSubj === s._id ? `0 4px 16px ${s.color}40` : 'none',
//               }}>
//                 <div style={{ width: 7, height: 7, borderRadius: '50%', background: activeSubj === s._id ? 'rgba(255,255,255,0.7)' : s.color }} />
//                 {s.name}
//                 <span style={{ fontSize: 10, fontWeight: 700, background: activeSubj === s._id ? 'rgba(255,255,255,0.2)' : 'var(--bg-primary)', padding: '1px 6px', borderRadius: 10, color: activeSubj === s._id ? 'white' : 'var(--text-muted)' }}>
//                   {s.pyqs?.length || 0}
//                 </span>
//               </button>
//             ))}
//           </div>

//           {/* PYQ Grid */}
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
//             {/* Upload card (teacher only) */}
//             {role === 'teacher' && (
//               <button className="pyq-card" onClick={() => { setUploadSubject(currentSubject); setShowUpload(true); }}
//                 style={{
//                   padding: '28px 24px', borderRadius: 20, cursor: 'pointer',
//                   background: 'transparent', border: '2px dashed var(--border)',
//                   display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
//                   transition: 'all 0.3s ease', color: 'var(--text-muted)',
//                 }}>
//                 <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(26,63,163,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                   <Plus size={24} color="var(--school-blue)" />
//                 </div>
//                 <div>
//                   <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 4 }}>Upload PYQ</p>
//                   <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Add a PDF for {currentSubject?.name}</p>
//                 </div>
//               </button>
//             )}

//             {filteredPYQs.length === 0 && role !== 'teacher' ? (
//               <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px 0' }}>
//                 <FileText size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px', display: 'block' }} />
//                 <p style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', marginBottom: 6 }}>No PYQs yet</p>
//                 <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Your teacher hasn't uploaded any PYQs for {currentSubject?.name} yet.</p>
//               </div>
//             ) : (
//               filteredPYQs.map((pyq, i) => (
//                 <div key={pyq._id} className="pyq-card card" style={{ padding: '22px', position: 'relative', overflow: 'hidden' }}>
//                   {/* Subject color accent top */}
//                   <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: currentSubject?.color }} />

//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
//                     <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
//                       <div style={{ width: 44, height: 44, borderRadius: 12, background: `${currentSubject?.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//                         <FileText size={20} color={currentSubject?.color} />
//                       </div>
//                       <div>
//                         <div style={{ fontSize: 10, fontWeight: 800, color: currentSubject?.color, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
//                           {currentSubject?.name} · {pyq.year}
//                         </div>
//                         <h3 style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>{pyq.title}</h3>
//                       </div>
//                     </div>
//                     {role === 'teacher' && (
//                       <button onClick={() => deletePYQ(currentSubject._id, pyq._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, transition: 'color 0.2s' }}
//                         onMouseEnter={e => e.currentTarget.style.color = '#ff2d78'}
//                         onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
//                       >
//                         <Trash2 size={14} />
//                       </button>
//                     )}
//                   </div>

//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Uploaded: {pyq.uploadedAt}</span>
//                     <a href={pyq.fileUrl} target="_blank" rel="noreferrer" style={{
//                       display: 'flex', alignItems: 'center', gap: 6,
//                       padding: '7px 14px', borderRadius: 9, textDecoration: 'none',
//                       background: `${currentSubject?.color}15`, color: currentSubject?.color,
//                       fontWeight: 600, fontSize: 12,
//                       transition: 'all 0.2s ease',
//                     }}>
//                       <Download size={12} /> Download
//                     </a>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </main>

//       {showUpload && uploadSubject && (
//         <UploadModal
//           subject={uploadSubject}
//           onClose={() => setShowUpload(false)}
//           onUpload={(subjectId, pyq) => { addPYQ(subjectId, pyq); gsap.fromTo('.pyq-card', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, stagger: 0.05, duration: 0.4, ease: 'back.out(1.4)' }); }}
//         />
//       )}
//     </div>
//   );
// }
// ✅ FIX Bug 33: PYQPage previously showed Sidebar only for students BUT the subjects list
//               came from mockSubjects in AppContext, so real uploaded PYQs (from the backend)
//               could never appear. Fix:
//               1. Students now fetch subjects+PYQs from /api/subjects (real API).
//               2. Teachers fetch all subjects they manage via /api/subjects/teacher.
//               3. `role` prop was used but AppContext exposes `userRole` — unified to userRole.
//               4. PYQ upload/delete now calls real API endpoints instead of local state mutations.

import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { useApp } from '../context/AppContext';
import {
  BookOpen, Upload, Download, Trash2, FileText,
  Search, Plus, X, CheckCircle, Loader,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

// ── Upload modal ──────────────────────────────────────────────────────────
function UploadModal({ subject, onClose, onUpload }) {
  const [year, setYear]       = useState('2024');
  const [title, setTitle]     = useState('');
  const [file, setFile]       = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading]  = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    gsap.fromTo(modalRef.current,
      { opacity: 0, scale: 0.88, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
    );
  }, []);

  const handleSubmit = async () => {
    if (!title || !year) return;
    setLoading(true);
    try {
      await onUpload(subject._id, { year, title, file });
      onClose();
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(6px)' }}>
      <div ref={modalRef} style={{ background: 'var(--bg-card)', borderRadius: 24, padding: 32, width: '90%', maxWidth: 480, border: '1px solid var(--border)', boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)' }}>Upload PYQ</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>for {subject?.name}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Exam Year</label>
            <select value={year} onChange={e => setYear(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 14 }}>
              {['2025','2024','2023','2022','2021','2020','2019','2018'].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Title / Description</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder={`e.g. CRPS ${subject?.name} Board PYQ ${year}`}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#1a3fa3'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>PDF File</label>
            <div
              className="upload-zone"
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); setFile(e.dataTransfer.files[0]); }}
              onClick={() => document.getElementById('pyq-file').click()}
              style={{ borderColor: dragging ? '#1a3fa3' : undefined, background: dragging ? 'rgba(26,63,163,0.05)' : undefined }}
            >
              <input id="pyq-file" type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
              {file ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                  <CheckCircle size={18} color="#00c9b1" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#00c9b1' }}>{file.name}</span>
                </div>
              ) : (
                <div>
                  <Upload size={24} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Drop PDF here or click to browse</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Supports .pdf files up to 20MB</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 500, fontSize: 13 }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={!title || !year || loading} className="btn-primary" style={{ opacity: (!title || !year || loading) ? 0.5 : 1, padding: '10px 22px', fontSize: 13 }}>
            {loading ? <><Loader size={13} style={{ animation: 'rotateSpin 0.8s linear infinite' }} /> Uploading…</> : <><Upload size={14} /> Upload PYQ</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function PYQPage() {
  const { userRole } = useApp();
  const isTeacher = userRole === 'teacher';

  // ✅ Bug 33 fix: local subjects state fetched from real API, not AppContext mock subjects
  const [subjects, setSubjects]     = useState([]);
  const [loadingSubj, setLoadingSubj] = useState(true);
  const [search, setSearch]         = useState('');
  const [activeSubj, setActiveSubj] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadSubject, setUploadSubject] = useState(null);
  const pageRef = useRef();

  // ── Fetch subjects with their PYQs from the real API ─────────────────
  const fetchSubjects = useCallback(async () => {
    setLoadingSubj(true);
    try {
      const token    = localStorage.getItem('token');
      // Teachers see all subjects they own; students see subjects for their class
      const endpoint = isTeacher ? '/api/subjects/teacher' : '/api/subjects';
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch subjects');
      const data = await res.json();
      setSubjects(data);
      if (data.length > 0 && !activeSubj) setActiveSubj(data[0]._id);
    } catch (err) {
      console.error('PYQPage fetchSubjects error:', err);
    } finally {
      setLoadingSubj(false);
    }
  }, [isTeacher]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchSubjects(); }, [fetchSubjects]);

  // Re-animate cards when active subject changes
  useEffect(() => {
    if (!pageRef.current) return;
    gsap.fromTo([...pageRef.current.children],
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' }
    );
    gsap.fromTo('.pyq-card',
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, stagger: 0.07, duration: 0.4, ease: 'power2.out', delay: 0.25 }
    );
  }, [activeSubj, subjects]);

  // ── Real API: upload PYQ ──────────────────────────────────────────────
  const handleUpload = async (subjectId, { year, title, file }) => {
    const token = localStorage.getItem('token');
    const form  = new FormData();
    form.append('year', year);
    form.append('title', title);
    if (file) form.append('file', file);

    const res = await fetch(`/api/subjects/${subjectId}/pyqs`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    if (!res.ok) {
      const d = await res.json();
      throw new Error(d.message || 'Upload failed');
    }
    // Refresh subjects to show new PYQ
    await fetchSubjects();
    gsap.fromTo('.pyq-card',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, stagger: 0.05, duration: 0.4, ease: 'back.out(1.4)' }
    );
  };

  // ── Real API: delete PYQ ──────────────────────────────────────────────
  const handleDelete = async (subjectId, pyqId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/subjects/${subjectId}/pyqs/${pyqId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const d = await res.json();
      throw new Error(d.message || 'Delete failed');
    }
    await fetchSubjects();
  };

  const currentSubject  = subjects.find(s => s._id === activeSubj);
  const filteredPYQs    = (currentSubject?.pyqs || []).filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) || p.year?.includes(search)
  );

  // ── Loading skeleton ─────────────────────────────────────────────────
  if (loadingSubj) {
    return (
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {!isTeacher && <Sidebar />}
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 16, marginTop: 60 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="shimmer-bar" style={{ height: 140, borderRadius: 20 }} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      {/* ✅ Bug 33: Sidebar rendered for students (correct); teachers see full width */}
      {!isTeacher && <Sidebar />}

      <main style={{ flex: 1, overflowY: 'auto', padding: '28px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div ref={pageRef}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(26,63,163,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={18} color="var(--school-blue)" />
                </div>
                <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 24, color: 'var(--text-primary)' }}>
                  {isTeacher ? 'Manage PYQs' : 'Previous Year Questions'}
                </h1>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                {isTeacher
                  ? 'Upload and manage PYQs for all subjects.'
                  : 'CRPS Board PYQs organised by subject and year — uploaded by your teachers.'}
              </p>
            </div>

            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search PYQs…"
                style={{ paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', width: 200 }}
              />
            </div>
          </div>

          {/* Subject tabs */}
          {subjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 40px', borderRadius: 20, border: '2px dashed var(--border)', color: 'var(--text-muted)' }}>
              <BookOpen size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                {isTeacher ? 'No subjects yet' : 'No subjects assigned'}
              </p>
              <p style={{ fontSize: 13 }}>
                {isTeacher
                  ? 'Add subjects from the Teacher Dashboard first.'
                  : 'Your teacher hasn\'t added any subjects yet.'}
              </p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {subjects.map(s => (
                  <button
                    key={s._id}
                    onClick={() => setActiveSubj(s._id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      padding: '8px 16px', borderRadius: 20,
                      background: activeSubj === s._id ? s.color : 'var(--bg-card)',
                      color: activeSubj === s._id ? 'white' : 'var(--text-secondary)',
                      border: `1.5px solid ${activeSubj === s._id ? s.color : 'var(--border)'}`,
                      fontWeight: 600, fontSize: 13, cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      boxShadow: activeSubj === s._id ? `0 4px 16px ${s.color}40` : 'none',
                    }}
                  >
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: activeSubj === s._id ? 'rgba(255,255,255,0.7)' : s.color }} />
                    {s.name}
                    <span style={{ fontSize: 10, fontWeight: 700, background: activeSubj === s._id ? 'rgba(255,255,255,0.2)' : 'var(--bg-primary)', padding: '1px 6px', borderRadius: 10, color: activeSubj === s._id ? 'white' : 'var(--text-muted)' }}>
                      {s.pyqs?.length || 0}
                    </span>
                  </button>
                ))}
              </div>

              {/* PYQ grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 16 }}>
                {/* Upload card (teacher only) */}
                {isTeacher && (
                  <button
                    className="pyq-card"
                    onClick={() => { setUploadSubject(currentSubject); setShowUpload(true); }}
                    style={{
                      padding: '28px 24px', borderRadius: 20, cursor: 'pointer',
                      background: 'transparent', border: '2px dashed var(--border)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                      transition: 'all 0.3s ease', color: 'var(--text-muted)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--school-blue)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(26,63,163,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus size={24} color="var(--school-blue)" />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 4 }}>Upload PYQ</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Add a PDF for {currentSubject?.name}</p>
                    </div>
                  </button>
                )}

                {filteredPYQs.length === 0 && !isTeacher ? (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px 0' }}>
                    <FileText size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px', display: 'block' }} />
                    <p style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', marginBottom: 6 }}>No PYQs yet</p>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      Your teacher hasn't uploaded any PYQs for {currentSubject?.name} yet.
                    </p>
                  </div>
                ) : (
                  filteredPYQs.map((pyq) => (
                    <div key={pyq._id} className="pyq-card card" style={{ padding: '22px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: currentSubject?.color }} />

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${currentSubject?.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <FileText size={20} color={currentSubject?.color} />
                          </div>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 800, color: currentSubject?.color, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                              {currentSubject?.name} · {pyq.year}
                            </div>
                            <h3 style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>{pyq.title}</h3>
                          </div>
                        </div>
                        {isTeacher && (
                          <button
                            onClick={() => handleDelete(currentSubject._id, pyq._id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, transition: 'color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#ff2d78'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {pyq.uploadedAt ? `Uploaded: ${new Date(pyq.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
                        </span>
                        <a
                          href={pyq.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '7px 14px', borderRadius: 9, textDecoration: 'none',
                            background: `${currentSubject?.color}15`, color: currentSubject?.color,
                            fontWeight: 600, fontSize: 12,
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Download size={12} /> Download
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {showUpload && uploadSubject && (
        <UploadModal
          subject={uploadSubject}
          onClose={() => setShowUpload(false)}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
}