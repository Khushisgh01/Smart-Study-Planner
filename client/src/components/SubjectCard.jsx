import { getBadgeStyle } from '../utils/priorityEngine';

export default function SubjectCard({ subject, onClick, active }) {
  const badge = getBadgeStyle(subject.badge);
  const daysLeft = Math.ceil((new Date(subject.examDate) - new Date()) / 86400000);

  return (
    <div onClick={onClick} style={{
      padding: '14px 16px',
      borderRadius: 14,
      background: active ? `${subject.color}18` : 'var(--bg-card)',
      border: `1px solid ${active ? subject.color + '60' : 'var(--border)'}`,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: 8,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: subject.color, flexShrink: 0 }} />
          <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{subject.name}</span>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: badge.bg, color: badge.color }}>
          {subject.badge}
        </span>
      </div>

      <div style={{ marginBottom: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Progress</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: subject.color }}>{subject.progress}%</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 3,
            background: `linear-gradient(90deg, ${subject.color}, ${subject.color}aa)`,
            width: `${subject.progress}%`,
            transition: 'width 1s cubic-bezier(0.34,1.56,0.64,1)',
          }} />
        </div>
      </div>

      <span style={{ fontSize: 11, color: daysLeft < 10 ? '#ff2d78' : 'var(--text-muted)' }}>
        {daysLeft < 0 ? 'Exam passed' : `${daysLeft} days left`}
      </span>
    </div>
  );
}