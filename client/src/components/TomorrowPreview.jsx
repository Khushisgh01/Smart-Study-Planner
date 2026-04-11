import { useApp } from '../context/AppContext';
import { generateTaskColor } from '../utils/priorityEngine';
import { ArrowRight } from 'lucide-react';

export default function TomorrowPreview() {
  const { tomorrowTasks } = useApp();

  return (
    <div>
      {tomorrowTasks.map((t, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 0',
          borderBottom: i < tomorrowTasks.length - 1 ? '1px solid var(--border)' : 'none',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: generateTaskColor(t.taskType), flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{t.chapter}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.subject} · {t.estimatedTime}min</p>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: generateTaskColor(t.taskType), background: `${generateTaskColor(t.taskType)}18`, padding: '2px 8px', borderRadius: 6 }}>
            {t.taskType}
          </span>
        </div>
      ))}
    </div>
  );
}