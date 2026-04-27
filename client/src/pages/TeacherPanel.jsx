import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Plus, Trash2, Save, GraduationCap, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { teacherService } from '../services/teacherService';

const defaultChapter = { name: '', weightage: 5, difficulty: 'medium', pyqFreq: 'medium', time: 45 };
const SUBJECT_COLORS = ['#1a3fa3', '#00c9b1', '#ff2d78', '#e8a020', '#9b59b6', '#2ecc71'];

export default function TeacherPanel() {
  const [classId, setClassId] = useState(null);
  const [subjects, setSubjects] = useState([
    { name: 'Mathematics', examDate: '2025-06-15', color: '#1a3fa3', chapters: [{ ...defaultChapter, name: 'Differential Equations', weightage: 9 }] },
    { name: 'Physics', examDate: '2025-06-18', color: '#00c9b1', chapters: [{ ...defaultChapter, name: 'Waves & Optics', weightage: 8 }] },
  ]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const headerRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    // Try to get classId from URL params or localStorage
    const storedClassId = localStorage.getItem('activeClassId');
    if (storedClassId) setClassId(storedClassId);

    if (headerRef.current?.children) {
      gsap.fromTo(headerRef.current.children,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' }
      );
    }
    gsap.fromTo('.subject-block',
      { opacity: 0, y: 30, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.5, ease: 'back.out(1.4)', delay: 0.2 }
    );
  }, []);

  const addSubject = () => {
    const newSubject = { name: 'New Subject', examDate: '', color: SUBJECT_COLORS[subjects.length % SUBJECT_COLORS.length], chapters: [{ ...defaultChapter }] };
    setSubjects(s => [...s, newSubject]);
    setTimeout(() => {
      gsap.fromTo('.subject-block:last-child', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.4)' });
    }, 50);
  };

  const removeSubject = (si) => {
    gsap.to(`.subject-block:nth-child(${si + 1})`, {
      opacity: 0, scale: 0.9, x: -20, duration: 0.3, ease: 'power2.in',
      onComplete: () => setSubjects(s => s.filter((_, i) => i !== si)),
    });
  };

  const addChapter = (si) => setSubjects(s => s.map((sub, i) => i === si ? { ...sub, chapters: [...sub.chapters, { ...defaultChapter }] } : sub));
  const updateSubject = (si, field, val) => setSubjects(s => s.map((sub, i) => i === si ? { ...sub, [field]: val } : sub));
  const updateChapter = (si, ci, field, val) => setSubjects(s => s.map((sub, i) => i === si ? { ...sub, chapters: sub.chapters.map((ch, j) => j === ci ? { ...ch, [field]: val } : ch) } : sub));
  const removeChapter = (si, ci) => setSubjects(s => s.map((sub, i) => i === si ? { ...sub, chapters: sub.chapters.filter((_, j) => j !== ci) } : sub));

  // Bug 12 fix: Save & Generate actually calls the API
  const handleSave = async () => {
    if (!classId) {
      setSaveError('No class selected. Please open this panel from a class.');
      return;
    }

    setSaving(true);
    setSaveError('');

    try {
      // Save each subject to the API
      for (const sub of subjects) {
        await teacherService.createSubject(classId, {
          name: sub.name,
          examDate: sub.examDate,
          color: sub.color,
          chapters: sub.chapters.map(ch => ({
            name: ch.name,
            weightage: ch.weightage,
            difficulty: ch.difficulty,
            pyqFrequency: ch.pyqFreq,
            estimatedTime: ch.time,
          })),
        });
      }

      // After saving subjects, generate tasks for enrolled students
      await teacherService.generateTasks(classId);

      setSaved(true);
      gsap.fromTo('.save-badge', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' });
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err.message || 'Save failed. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
      {/* Header */}
      <div ref={headerRef} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0,201,177,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={22} color="#00c9b1" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 24, color: 'var(--text-primary)' }}>Teacher Panel</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>Configure subjects, chapters & weights · Chhotu Ram Public School</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {saved && (
            <div className="save-badge" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 20, background: 'rgba(0,201,177,0.12)', color: '#00c9b1', fontSize: 12, fontWeight: 700 }}>
              ✓ Saved & tasks generated!
            </div>
          )}
          {saveError && (
            <div style={{ padding: '7px 14px', borderRadius: 20, background: 'rgba(255,45,120,0.1)', color: '#ff2d78', fontSize: 12, fontWeight: 600 }}>
              ⚠ {saveError}
            </div>
          )}
          <button onClick={() => navigate('/pyqs')} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 10,
            background: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.3)',
            color: '#c9820a', cursor: 'pointer', fontWeight: 600, fontSize: 13,
          }}>
            <FileText size={14} /> Manage PYQs
          </button>
          <button onClick={addSubject} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 10,
            background: 'rgba(26,63,163,0.08)', border: '1px solid rgba(26,63,163,0.2)',
            color: 'var(--school-blue)', cursor: 'pointer', fontWeight: 600, fontSize: 13,
          }}>
            <Plus size={14} /> Add Subject
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ padding: '9px 20px', fontSize: 13, opacity: saving ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Save size={14} /> {saving ? 'Saving…' : 'Save & Generate'}
          </button>
        </div>
      </div>

      {/* Subjects */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {subjects.map((sub, si) => (
          <div key={si} className="subject-block card" style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: sub.color, borderRadius: '20px 0 0 20px' }} />

            <div style={{ paddingLeft: 16 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
                <input value={sub.name} onChange={e => updateSubject(si, 'name', e.target.value)}
                  placeholder="Subject name"
                  style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 18, background: 'transparent', border: 'none', borderBottom: `2px solid ${sub.color}`, color: 'var(--text-primary)', outline: 'none', flex: 1, minWidth: 140, paddingBottom: 4 }}
                />

                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {SUBJECT_COLORS.map(c => (
                    <button key={c} onClick={() => updateSubject(si, 'color', c)} style={{
                      width: 18, height: 18, borderRadius: '50%', background: c,
                      border: sub.color === c ? `2px solid var(--text-primary)` : '2px solid transparent',
                      cursor: 'pointer', outline: 'none', transition: 'transform 0.2s',
                      transform: sub.color === c ? 'scale(1.2)' : 'scale(1)',
                    }} />
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>Exam Date:</label>
                  <input type="date" value={sub.examDate} onChange={e => updateSubject(si, 'examDate', e.target.value)}
                    style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', color: 'var(--text-primary)', fontSize: 12 }}
                  />
                </div>

                <button onClick={() => removeSubject(si)} style={{ background: 'rgba(255,45,120,0.08)', border: '1px solid rgba(255,45,120,0.25)', borderRadius: 8, padding: '7px 10px', color: '#ff2d78', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500 }}>
                  <Trash2 size={13} /> Remove
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Chapter Name', 'Weightage (1–10)', 'Difficulty', 'PYQ Frequency', 'Est. Time (min)', ''].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sub.chapters.map((ch, ci) => (
                      <tr key={ci} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 12px' }}>
                          <input value={ch.name} onChange={e => updateChapter(si, ci, 'name', e.target.value)} placeholder="Chapter name"
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 13, fontWeight: 500, width: '100%', outline: 'none', minWidth: 160 }}
                          />
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <input type="range" min={1} max={10} value={ch.weightage} onChange={e => updateChapter(si, ci, 'weightage', +e.target.value)}
                              style={{ width: 80, accentColor: sub.color }}
                            />
                            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontWeight: 700, color: sub.color, minWidth: 18 }}>{ch.weightage}</span>
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <select value={ch.difficulty} onChange={e => updateChapter(si, ci, 'difficulty', e.target.value)}
                            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', color: 'var(--text-primary)', fontSize: 12, cursor: 'pointer' }}>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <select value={ch.pyqFreq} onChange={e => updateChapter(si, ci, 'pyqFreq', e.target.value)}
                            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', color: 'var(--text-primary)', fontSize: 12, cursor: 'pointer' }}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <input type="number" value={ch.time} onChange={e => updateChapter(si, ci, 'time', +e.target.value)} min={15} max={180}
                            style={{ width: 68, background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', color: 'var(--text-primary)', fontSize: 12 }}
                          />
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <button onClick={() => removeChapter(si, ci)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button onClick={() => addChapter(si)} style={{
                marginTop: 12, display: 'flex', alignItems: 'center', gap: 6,
                background: 'none', border: `1px dashed var(--border)`, borderRadius: 8,
                padding: '7px 14px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12, fontWeight: 500,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = sub.color; e.currentTarget.style.color = sub.color; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <Plus size={12} /> Add Chapter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
