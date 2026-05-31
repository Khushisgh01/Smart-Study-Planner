import { getBadgeStyle } from '../utils/priorityEngine';
import { formatExamCountdown } from '../utils/examDate';

export default function SubjectCard({ subject, onClick, active }) {
  const badge = getBadgeStyle(subject.badge);
  const progress = subject.myProgress?.pct ?? subject.progress ?? 0;
  const countdown = formatExamCountdown(subject.examDate);
  const daysLeft = countdown.includes('days left') ? parseInt(countdown, 10) : null;

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
        {subject.badge && (
        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: badge.bg, color: badge.color }}>
          {subject.badge}
        </span>
        )}
      </div>

      <div style={{ marginBottom: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Progress</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: subject.color }}>{progress}%</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 3,
            background: `linear-gradient(90deg, ${subject.color}, ${subject.color}aa)`,
            width: `${progress}%`,
            transition: 'width 1s cubic-bezier(0.34,1.56,0.64,1)',
          }} />
        </div>
      </div>

      <span style={{ fontSize: 11, color: daysLeft !== null && daysLeft < 10 ? '#ff2d78' : 'var(--text-muted)' }}>
        {countdown}
      </span>
    </div>
  );
}