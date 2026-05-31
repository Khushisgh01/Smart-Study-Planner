import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { parseExamDate } from '../utils/examDate';

export default function MiniCalendar({ examDates = [], subjects = [] }) {
  const today = new Date();

  const entries = subjects.length > 0
    ? subjects.filter(s => s.examDate).map(s => ({ name: s.name, color: s.color, examDate: s.examDate }))
    : examDates.filter(Boolean).map((examDate, i) => ({ name: `Exam ${i + 1}`, color: '#ff2d78', examDate }));

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const nextExam = entries
    .map(e => parseExamDate(e.examDate))
    .filter(Boolean)
    .sort((a, b) => a - b)
    .find(d => d >= todayStart) || parseExamDate(entries[0]?.examDate);

  const [month, setMonth] = useState(nextExam ? nextExam.getMonth() : today.getMonth());
  const [year, setYear] = useState(nextExam ? nextExam.getFullYear() : today.getFullYear());

  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: first + days }, (_, i) => i < first ? null : i - first + 1);
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const examsOnDay = (d) => entries.filter(entry => {
    const date = parseExamDate(entry.examDate);
    return date && date.getDate() === d && date.getMonth() === month && date.getFullYear() === year;
  });

  return (
    <div style={{ padding: '12px', background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <button type="button" onClick={() => { if (month === 0) { setMonth(11); setYear(y=>y-1); } else setMonth(m=>m-1); }} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--text-secondary)',display:'flex',alignItems:'center' }}>
          <ChevronLeft size={14} />
        </button>
        <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{monthNames[month]} {year}</span>
        <button type="button" onClick={() => { if (month === 11) { setMonth(0); setYear(y=>y+1); } else setMonth(m=>m+1); }} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--text-secondary)',display:'flex',alignItems:'center' }}>
          <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, textAlign: 'center' }}>
        {['S','M','T','W','T','F','S'].map((d,i) => (
          <span key={i} style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, padding: '2px 0' }}>{d}</span>
        ))}
        {cells.map((d, i) => {
          const dayExams = d ? examsOnDay(d) : [];
          const isExamDay = dayExams.length > 0;
          const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          return (
            <div key={i} title={isExamDay ? dayExams.map(e => e.name).join(', ') : undefined} style={{
              fontSize: 11, padding: '4px 2px', borderRadius: 6,
              background: isToday ? 'var(--accent)' : isExamDay ? '#ff2d7825' : 'transparent',
              color: isToday ? 'white' : isExamDay ? '#ff2d78' : d ? 'var(--text-secondary)' : 'transparent',
              fontWeight: isToday || isExamDay ? 700 : 400,
              cursor: d ? 'pointer' : 'default',
              position: 'relative',
            }}>
              {d || ''}
              {isExamDay && <div style={{ position:'absolute',bottom:1,left:'50%',transform:'translateX(-50%)',width:4,height:4,borderRadius:'50%',background: dayExams[0]?.color || '#ff2d78' }} />}
            </div>
          );
        })}
      </div>

      {entries.length > 0 && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {entries.map(entry => {
            const date = parseExamDate(entry.examDate);
            if (!date) return null;
            return (
              <div key={`${entry.name}-${entry.examDate}`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color || '#ff2d78', flexShrink: 0 }} />
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>{entry.name}</span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
