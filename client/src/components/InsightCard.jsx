import { Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';

const insights = [
  { type: 'tip', text: 'Focus on Trees + Graphs to gain +20 marks', icon: TrendingUp, color: '#4f6ef7' },
  { type: 'warning', text: 'You are falling behind by 1 day', icon: AlertCircle, color: '#ffb700' },
  { type: 'insight', text: 'Organic Reactions appears in 60% of PYQs', icon: Lightbulb, color: '#00c9b1' },
];

export default function InsightCard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {insights.map((ins, i) => (
        <div key={i} className="card" style={{
          padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'flex-start',
          borderLeft: `3px solid ${ins.color}`,
          animation: `slideUp 0.4s ease ${i * 0.1}s both`,
        }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `${ins.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ins.icon size={14} color={ins.color} />
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{ins.text}</p>
        </div>
      ))}
    </div>
  );
}