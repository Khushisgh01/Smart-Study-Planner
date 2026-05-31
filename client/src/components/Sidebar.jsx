import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useApp } from '../context/AppContext';
import { getBadgeStyle } from '../utils/priorityEngine';
import { formatExamCountdown } from '../utils/examDate';

import ProgressRing  from './ProgressRing';
import MiniCalendar  from './MiniCalendar';

export default function Sidebar({ onSwitchClass }) {
  const { subjects, examReadiness, userRole } = useApp();
  const [activeSubject, setActiveSubject] = useState(null);
  const sidebarRef = useRef();

  useEffect(() => {
    gsap.fromTo(sidebarRef.current.children,
      { opacity: 0, x: -24 },
      { opacity: 1, x: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out', delay: 0.2 }
    );
  }, []);

  const examDates = subjects.map(s => s.examDate).filter(Boolean);

  return (
    <aside ref={sidebarRef} style={{
      width: 272, minHeight: '100%',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', gap: 20,
      padding: '24px 14px',
      overflowY: 'auto',
      flexShrink: 0,
    }}>
      {/* Readiness */}
      <div className="card" style={{ padding: '20px 16px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          {/* ✅ Bug 32: using canonical ProgressRing import */}
          <ProgressRing value={examReadiness} size={88} color="var(--school-blue)" />
        </div>
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>Exam Readiness</p>
        <div style={{
          padding: '5px 14px', borderRadius: 20, display: 'inline-block', fontSize: 12, fontWeight: 700,
          background: examReadiness >= 70 ? 'rgba(0,201,177,0.15)' : examReadiness >= 50 ? 'rgba(232,160,32,0.15)' : 'rgba(255,45,120,0.15)',
          color:      examReadiness >= 70 ? '#00c9b1'              : examReadiness >= 50 ? '#c9820a'              : '#ff2d78',
        }}>
          {examReadiness >= 70 ? '🚀 On Fire!' : examReadiness >= 50 ? '⚡ Building Up' : '😅 Need Focus'}
        </div>
      </div>

      {/* Subjects */}
      <div>
        <h3 style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Subjects</h3>
        {subjects.map(s => {
          const badge = getBadgeStyle(s.badge);
          const countdown = formatExamCountdown(s.examDate);
          const urgent = countdown.includes('day') && !countdown.includes('not set') && parseInt(countdown, 10) < 10;
          const isActive = activeSubject === s._id;
          return (
            <div
              key={s._id}
              onClick={() => setActiveSubject(isActive ? null : s._id)}
              style={{
                padding: '12px 14px', borderRadius: 14, marginBottom: 8, cursor: 'pointer',
                background: isActive ? `${s.color}12` : 'var(--bg-card)',
                border: `1px solid ${isActive ? s.color + '50' : 'var(--border)'}`,
                transition: 'all 0.3s ease',
                transform: isActive ? 'scale(1.01)' : 'scale(1)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: s.color, flexShrink: 0, boxShadow: `0 0 6px ${s.color}60` }} />
                  <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{s.name}</span>
                </div>
                {s.badge && (
                <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: badge.bg, color: badge.color }}>
                  {s.badge}
                </span>
                )}
              </div>
              <div style={{ marginBottom: 5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Progress</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: s.color }}>{s.myProgress?.pct ?? 0}%</span>
                </div>
                <div className="prog-bar">
                  <div className="prog-fill" style={{ width: `${s.myProgress?.pct ?? 0}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}aa)` }} />
                </div>
              </div>
              <span style={{ fontSize: 10, color: urgent ? '#ff2d78' : 'var(--text-muted)' }}>
                {countdown}
              </span>
            </div>
          );
        })}
      </div>

      {/* Calendar — ✅ Bug 31: using canonical MiniCalendar import */}
      <div>
        <h3 style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Exam Dates</h3>
        <MiniCalendar subjects={subjects} examDates={examDates} />
      </div>

      {userRole === 'student' && onSwitchClass && (
        <button
          type="button"
          onClick={onSwitchClass}
          style={{
            width: '100%', padding: '11px 14px', borderRadius: 12,
            border: '1px solid var(--border)', background: 'var(--bg-card)',
            color: 'var(--text-secondary)', fontSize: 12, fontWeight: 700,
            cursor: 'pointer', textAlign: 'center',
          }}
        >
          Switch Class
        </button>
      )}
    </aside>
  );
}