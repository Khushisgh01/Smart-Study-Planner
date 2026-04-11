import { ShieldAlert } from 'lucide-react';

const risks = [
  { chapter: 'Differential Equations', marks: 15, subject: 'Mathematics' },
  { chapter: 'Waves & Optics', marks: 12, subject: 'Physics' },
];

export default function RiskAlert() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {risks.map((r, i) => (
        <div key={i} style={{
          padding: '12px 16px',
          borderRadius: 12,
          background: 'rgba(255,45,120,0.08)',
          border: '1px solid rgba(255,45,120,0.25)',
          display: 'flex', gap: 10, alignItems: 'center',
          animation: `slideUp 0.4s ease ${i * 0.1}s both`,
        }}>
          <ShieldAlert size={16} color="#ff2d78" />
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#ff2d78' }}>{r.chapter}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Skipping may impact {r.marks} marks · {r.subject}</p>
          </div>
        </div>
      ))}
    </div>
  );
}