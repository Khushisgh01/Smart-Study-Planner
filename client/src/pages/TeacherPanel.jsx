import { useState } from 'react';
import { Plus, Trash2, Upload, Save } from 'lucide-react';

const defaultChapter = { name:'', weightage:5, difficulty:'medium', pyqFreq:'medium', time:45 };

export default function TeacherPanel() {
  const [subjects, setSubjects] = useState([
    { name:'Mathematics', examDate:'2025-06-15', chapters:[{ ...defaultChapter, name:'Differential Equations', weightage:9 }] },
  ]);

  const addSubject = () => setSubjects(s => [...s, { name:'New Subject', examDate:'', chapters:[{...defaultChapter}] }]);
  const removeSubject = (si) => setSubjects(s => s.filter((_,i)=>i!==si));
  const addChapter = (si) => setSubjects(s => s.map((sub,i)=>i===si?{...sub,chapters:[...sub.chapters,{...defaultChapter}]}:sub));
  const updateSubject = (si, field, val) => setSubjects(s => s.map((sub,i)=>i===si?{...sub,[field]:val}:sub));
  const updateChapter = (si, ci, field, val) => setSubjects(s => s.map((sub,i)=>i===si?{...sub,chapters:sub.chapters.map((ch,j)=>j===ci?{...ch,[field]:val}:ch)}:sub));
  const removeChapter = (si, ci) => setSubjects(s => s.map((sub,i)=>i===si?{...sub,chapters:sub.chapters.filter((_,j)=>j!==ci)}:sub));

  return (
    <div style={{ flex:1, overflowY:'auto', padding:'28px 32px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
        <div>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:28, color:'var(--text-primary)' }}>Teacher Panel</h1>
          <p style={{ color:'var(--text-muted)', fontSize:14, marginTop:4 }}>Configure subjects, chapters & weights for the priority engine</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={addSubject} style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 18px', borderRadius:10, background:'rgba(79,110,247,0.1)', border:'1px solid rgba(79,110,247,0.3)', color:'var(--accent)', cursor:'pointer', fontWeight:600, fontSize:14 }}>
            <Plus size={15} /> Add Subject
          </button>
          <button className="btn-primary" style={{ display:'flex', alignItems:'center', gap:6 }}>
            <Save size={15} /> Save & Generate
          </button>
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
        {subjects.map((sub, si) => (
          <div key={si} className="card" style={{ padding:24 }}>
            <div style={{ display:'flex', gap:14, alignItems:'center', marginBottom:20, flexWrap:'wrap' }}>
              <input value={sub.name} onChange={e=>updateSubject(si,'name',e.target.value)} placeholder="Subject name" style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:18, background:'transparent', border:'none', borderBottom:'2px solid var(--accent)', color:'var(--text-primary)', outline:'none', flex:1, minWidth:150, paddingBottom:4 }} />
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <label style={{ fontSize:13, color:'var(--text-muted)', fontWeight:500 }}>Exam Date:</label>
                <input type="date" value={sub.examDate} onChange={e=>updateSubject(si,'examDate',e.target.value)} style={{ background:'var(--bg-primary)', border:'1px solid var(--border)', borderRadius:8, padding:'6px 10px', color:'var(--text-primary)', fontSize:13 }} />
              </div>
              <button onClick={()=>removeSubject(si)} style={{ background:'rgba(255,45,120,0.1)', border:'1px solid rgba(255,45,120,0.3)', borderRadius:8, padding:'6px 10px', color:'#ff2d78', cursor:'pointer', display:'flex', alignItems:'center' }}>
                <Trash2 size={14} />
              </button>
            </div>

            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead>
                  <tr style={{ borderBottom:'1px solid var(--border)' }}>
                    {['Chapter Name','Weightage','Difficulty','PYQ Freq','Est. Time (min)',''].map(h => (
                      <th key={h} style={{ textAlign:'left', padding:'8px 12px', color:'var(--text-muted)', fontWeight:600, fontSize:11, textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sub.chapters.map((ch, ci) => (
                    <tr key={ci} style={{ borderBottom:'1px solid var(--border)', transition:'background 0.2s' }}>
                      <td style={{ padding:'10px 12px' }}>
                        <input value={ch.name} onChange={e=>updateChapter(si,ci,'name',e.target.value)} placeholder="Chapter name" style={{ background:'transparent', border:'none', color:'var(--text-primary)', fontSize:13, fontWeight:500, width:'100%', outline:'none' }} />
                      </td>
                      <td style={{ padding:'10px 12px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <input type="range" min={1} max={10} value={ch.weightage} onChange={e=>updateChapter(si,ci,'weightage',+e.target.value)} style={{ width:80, accentColor:'var(--accent)' }} />
                          <span style={{ fontFamily:'JetBrains Mono,monospace', fontWeight:700, color:'var(--accent)', minWidth:16 }}>{ch.weightage}</span>
                        </div>
                      </td>
                      <td style={{ padding:'10px 12px' }}>
                        <select value={ch.difficulty} onChange={e=>updateChapter(si,ci,'difficulty',e.target.value)} style={{ background:'var(--bg-primary)', border:'1px solid var(--border)', borderRadius:6, padding:'4px 8px', color:'var(--text-primary)', fontSize:12, cursor:'pointer' }}>
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </td>
                      <td style={{ padding:'10px 12px' }}>
                        <select value={ch.pyqFreq} onChange={e=>updateChapter(si,ci,'pyqFreq',e.target.value)} style={{ background:'var(--bg-primary)', border:'1px solid var(--border)', borderRadius:6, padding:'4px 8px', color:'var(--text-primary)', fontSize:12, cursor:'pointer' }}>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </td>
                      <td style={{ padding:'10px 12px' }}>
                        <input type="number" value={ch.time} onChange={e=>updateChapter(si,ci,'time',+e.target.value)} min={15} max={180} style={{ width:70, background:'var(--bg-primary)', border:'1px solid var(--border)', borderRadius:6, padding:'4px 8px', color:'var(--text-primary)', fontSize:12 }} />
                      </td>
                      <td style={{ padding:'10px 12px' }}>
                        <button onClick={()=>removeChapter(si,ci)} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', display:'flex', alignItems:'center' }}>
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button onClick={()=>addChapter(si)} style={{ marginTop:12, display:'flex', alignItems:'center', gap:6, background:'none', border:'1px dashed var(--border)', borderRadius:8, padding:'8px 16px', color:'var(--text-muted)', cursor:'pointer', fontSize:13, fontWeight:500, transition:'all 0.2s' }}>
              <Plus size={13} /> Add Chapter
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}