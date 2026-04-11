import { useState } from 'react';
import { Check, AlertTriangle, X, Clock, ChevronRight } from 'lucide-react';
import { generateTaskColor } from '../utils/priorityEngine';
import { useApp } from '../context/AppContext';

const typeLabel = { Learn: 'LEARN', Revise1: 'REVISE I', Revise2: 'REVISE II', PYQ: 'PYQ' };
const typeClass = { Learn: 'task-learn', Revise1: 'task-revise1', Revise2: 'task-revise2', PYQ: 'task-pyq' };

export default function TaskCard({ task, index }) {
  const { updateTask, rescheduledAlert } = useApp();
  const [hovered, setHovered] = useState(false);
  const color = generateTaskColor(task.taskType);
  const isRescheduled = rescheduledAlert === task._id;

  if (task.status !== 'pending') {
    return (
      <div className="card" style={{
        padding: '14px 18px', marginBottom: 10, opacity: 0.5,
        display: 'flex', alignItems: 'center', gap: 12,
        animation: 'slideUp 0.3s ease',
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: task.status === 'done' ? '#00c9b1' : task.status === 'partial' ? '#ffb700' : '#ff2d78' }} />
        <span style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>
          {task.chapter} — {typeLabel[task.taskType]}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{task.status}</span>
      </div>
    );
  }

  return (
    <div
      className={`card ${typeClass[task.taskType]}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '16px 20px', marginBottom: 10,
        transform: hovered ? 'translateX(4px)' : 'translateX(0)',
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        animationDelay: `${index * 0.08}s`,
        animation: 'slideUp 0.4s ease both',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {isRescheduled && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          background: 'rgba(255,183,0,0.15)', padding: '6px 16px',
          fontSize: 12, color: '#d4960a', fontWeight: 600,
          borderBottom: '1px solid rgba(255,183,0,0.3)',
          animation: 'slideUp 0.3s ease',
        }}>
          ↻ Rescheduling to tomorrow automatically...
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              fontSize: 10, fontWeight: 800, letterSpacing: '0.06em',
              padding: '2px 8px', borderRadius: 6,
              background: `${color}20`, color,
            }}>{typeLabel[task.taskType]}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{task.subject}</span>
          </div>
          <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
            {task.chapter}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
            <Clock size={12} />
            <span style={{ fontSize: 12 }}>{task.estimatedTime} min</span>
          </div>
        </div>

        {hovered && (
          <div style={{ display: 'flex', gap: 6, animation: 'slideInRight 0.25s ease' }}>
            {[
              { status: 'done', icon: Check, color: '#00c9b1', label: 'Done' },
              { status: 'partial', icon: AlertTriangle, color: '#ffb700', label: 'Partial' },
              { status: 'skipped', icon: X, color: '#ff2d78', label: 'Skip' },
            ].map(({ status, icon: Icon, color: c, label }) => (
              <button key={status} onClick={() => updateTask(task._id, status)} title={label} style={{
                width: 34, height: 34, borderRadius: 10,
                background: `${c}18`, border: `1px solid ${c}40`,
                color: c, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}>
                <Icon size={15} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}