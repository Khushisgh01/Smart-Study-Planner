import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function MiniCalendar({ examDates = [] }) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: first + days }, (_, i) => i < first ? null : i - first + 1);
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const isExamDay = (d) => examDates.some(ed => {
    const date = new Date(ed);
    return date.getDate() === d && date.getMonth() === month && date.getFullYear() === year;
  });

  return (
    <div style={{ padding: '12px', background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <button onClick={() => { if (month === 0) { setMonth(11); setYear(y=>y-1); } else setMonth(m=>m-1); }} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--text-secondary)',display:'flex',alignItems:'center' }}>
          <ChevronLeft size={14} />
        </button>
        <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{monthNames[month]} {year}</span>
        <button onClick={() => { if (month === 11) { setMonth(0); setYear(y=>y+1); } else setMonth(m=>m+1); }} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--text-secondary)',display:'flex',alignItems:'center' }}>
          <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, textAlign: 'center' }}>
        {['S','M','T','W','T','F','S'].map((d,i) => (
          <span key={i} style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, padding: '2px 0' }}>{d}</span>
        ))}
        {cells.map((d, i) => (
          <div key={i} style={{
            fontSize: 11, padding: '4px 2px', borderRadius: 6,
            background: d === today.getDate() && month === today.getMonth() ? 'var(--accent)' : isExamDay(d) ? '#ff2d7825' : 'transparent',
            color: d === today.getDate() && month === today.getMonth() ? 'white' : isExamDay(d) ? '#ff2d78' : d ? 'var(--text-secondary)' : 'transparent',
            fontWeight: d === today.getDate() && month === today.getMonth() ? 700 : isExamDay(d) ? 700 : 400,
            cursor: d ? 'pointer' : 'default',
            position: 'relative',
          }}>
            {d || ''}
            {isExamDay(d) && <div style={{ position:'absolute',bottom:1,left:'50%',transform:'translateX(-50%)',width:4,height:4,borderRadius:'50%',background:'#ff2d78' }} />}
          </div>
        ))}
      </div>
    </div>
  );
}