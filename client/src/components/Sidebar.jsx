import { useState } from 'react';
import { useApp } from '../context/AppContext';
import SubjectCard from './SubjectCard';
import MiniCalendar from './MiniCalendar';
import ProgressRing from './ProgressRing';

export default function Sidebar() {
  const { subjects, examReadiness } = useApp();
  const [active, setActive] = useState(null);
  const examDates = subjects.map(s => s.examDate);

  return (
    <aside style={{
      width: 280, minHeight: '100%',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', gap: 20,
      padding: '24px 16px',
      overflowY: 'auto',
      flexShrink: 0,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
          padding: '20px',
          background: 'var(--bg-card)',
          borderRadius: 16,
          border: '1px solid var(--border)',
          width: '100%',
          gap: 8,
        }}>
          <ProgressRing value={examReadiness} size={90} color="#4f6ef7" label="Exam Readiness" />
          <div style={{
            marginTop: 4, padding: '4px 12px',
            background: examReadiness >= 70 ? 'rgba(0,201,177,0.15)' : examReadiness >= 50 ? 'rgba(255,183,0,0.15)' : 'rgba(255,45,120,0.15)',
            borderRadius: 20, fontSize: 12, fontWeight: 700,
            color: examReadiness >= 70 ? '#00c9b1' : examReadiness >= 50 ? '#d4960a' : '#ff2d78',
          }}>
            {examReadiness >= 70 ? '🚀 On Fire' : examReadiness >= 50 ? '⚡ Building Up' : '😅 Need Focus'}
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Subjects</h3>
        {subjects.map(s => (
          <SubjectCard key={s._id} subject={s} active={active === s._id} onClick={() => setActive(active === s._id ? null : s._id)} />
        ))}
      </div>

      <div>
        <h3 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Exam Dates</h3>
        <MiniCalendar examDates={examDates} />
      </div>
    </aside>
  );
}