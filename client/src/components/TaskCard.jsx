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
      <div className="card-flat" style={{
        padding: '12px 16px', marginBottom: 8, opacity: 0.55,
        display: 'flex', alignItems: 'center', gap: 10,
        animation: 'slideUp 0.3s ease',
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: task.status === 'done' ? '#00c9b1' : task.status === 'partial' ? '#e8a020' : '#ff2d78', flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: task.status === 'done' ? 'line-through' : 'none', flex: 1 }}>
          {task.chapter} — {typeLabel[task.taskType]}
        </span>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{task.status}</span>
      </div>
    );
  }

  return (
    <div
      className={`card ${typeClass[task.taskType]}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '16px 18px', marginBottom: 10,
        transform: hovered ? 'translateX(4px) translateY(-2px)' : 'translateX(0)',
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        animationDelay: `${index * 0.08}s`,
        animation: 'slideUp 0.4s ease both',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {isRescheduled && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          background: 'rgba(232,160,32,0.12)', padding: '5px 14px',
          fontSize: 11, color: '#c9820a', fontWeight: 600,
          borderBottom: '1px solid rgba(232,160,32,0.25)',
        }}>
          ↻ Rescheduling to tomorrow automatically...
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingTop: isRescheduled ? 24 : 0 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.06em', padding: '2px 8px', borderRadius: 6, background: `${color}18`, color }}>
              {typeLabel[task.taskType]}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{task.subject}</span>
          </div>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
            {task.chapter}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
            <Clock size={11} />
            <span style={{ fontSize: 11 }}>{task.estimatedTime} min</span>
          </div>
        </div>

        {hovered && (
          <div style={{ display: 'flex', gap: 6, animation: 'slideInRight 0.2s ease' }}>
            {[
              { status: 'done', icon: Check, c: '#00c9b1', label: 'Done' },
              { status: 'partial', icon: AlertTriangle, c: '#e8a020', label: 'Partial' },
              { status: 'skipped', icon: X, c: '#ff2d78', label: 'Skip' },
            ].map(({ status, icon: Icon, c, label }) => (
              <button key={status} onClick={() => updateTask(task._id, status)} title={label} style={{
                width: 32, height: 32, borderRadius: 9,
                background: `${c}15`, border: `1px solid ${c}35`,
                color: c, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}>
                <Icon size={13} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}