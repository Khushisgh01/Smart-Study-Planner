// import { ShieldAlert } from 'lucide-react';

// const risks = [
//   { chapter: 'Differential Equations', marks: 15, subject: 'Mathematics' },
//   { chapter: 'Waves & Optics', marks: 12, subject: 'Physics' },
// ];

// export default function RiskAlert() {
//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//       {risks.map((r, i) => (
//         <div key={i} style={{
//           padding: '12px 16px',
//           borderRadius: 12,
//           background: 'rgba(255,45,120,0.08)',
//           border: '1px solid rgba(255,45,120,0.25)',
//           display: 'flex', gap: 10, alignItems: 'center',
//           animation: `slideUp 0.4s ease ${i * 0.1}s both`,
//         }}>
//           <ShieldAlert size={16} color="#ff2d78" />
//           <div>
//             <p style={{ fontSize: 13, fontWeight: 600, color: '#ff2d78' }}>{r.chapter}</p>
//             <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Skipping may impact {r.marks} marks · {r.subject}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ShieldAlert, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

// ✅ FIX Bug 30: Risks derived from real subject progress data — not hardcoded strings

function buildRisks(subjects, tasks) {
  const risks = [];

  // 1 — Subjects with low progress and upcoming exam
  subjects.forEach(s => {
    const daysLeft = Math.ceil((new Date(s.examDate) - new Date()) / 86400000);
    if (daysLeft <= 0) return; // exam passed

    if (daysLeft <= 21 && s.progress < 50) {
      // Find highest-weight incomplete chapter
      const worstChapter = (s.chapters || [])
        .sort((a, b) => (b.weightage || 0) - (a.weightage || 0))[0];

      risks.push({
        chapter: worstChapter?.name || s.name,
        marks: Math.round((worstChapter?.weightage || 5) * 2),
        subject: s.name,
        daysLeft,
        severity: daysLeft <= 7 ? 'critical' : 'warning',
      });
    }

    // Very close exam with any significant gap
    if (daysLeft <= 5 && s.progress < 80) {
      risks.push({
        chapter: `${s.name} overall`,
        marks: Math.round((100 - s.progress) / 10) * 3,
        subject: s.name,
        daysLeft,
        severity: 'critical',
      });
    }
  });

  // 2 — Accumulated skipped tasks
  const skipped = tasks.filter(t => t.status === 'skipped');
  if (skipped.length >= 3) {
    risks.unshift({
      chapter: `${skipped.length} skipped tasks accumulated`,
      marks: skipped.length * 4,
      subject: 'Multiple subjects',
      daysLeft: null,
      severity: 'warning',
    });
  }

  // De-duplicate + cap at 3
  const seen = new Set();
  return risks.filter(r => {
    const key = r.chapter + r.subject;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 3);
}

export default function RiskAlert() {
  const { subjects = [], tasks = [] } = useApp();
  const containerRef = useRef();
  const risks = buildRisks(subjects, tasks);

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = [...containerRef.current.children];

    gsap.fromTo(cards,
      { opacity: 0, scale: 0.88, y: 12 },
      { opacity: 1, scale: 1, y: 0, stagger: 0.1, duration: 0.45, ease: 'back.out(1.5)' }
    );

    // Pulse the critical ones
    cards.forEach((card, i) => {
      if (risks[i]?.severity === 'critical') {
        gsap.to(card, { boxShadow: '0 0 16px rgba(255,45,120,0.35)', duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.3 });
      }
    });
  }, [risks.length, subjects.length, tasks.length]);

  // All clear state
  if (risks.length === 0) {
    return (
      <div ref={containerRef} style={{ padding: '16px', borderRadius: 12, background: 'rgba(0,201,177,0.07)', border: '1px solid rgba(0,201,177,0.22)', display: 'flex', gap: 10, alignItems: 'center' }}>
        <CheckCircle size={16} color="#00c9b1" />
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#00c9b1' }}>No risk alerts!</p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Your progress is on track — keep it up.</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {risks.map((r, i) => {
        const isCritical = r.severity === 'critical';
        const borderColor = isCritical ? '#ff2d78' : '#e8a020';
        const bgColor     = isCritical ? 'rgba(255,45,120,0.08)' : 'rgba(232,160,32,0.08)';
        const textColor   = isCritical ? '#ff2d78' : '#c9820a';

        return (
          <div key={i}
            style={{ padding: '12px 16px', borderRadius: 12, background: bgColor, border: `1px solid ${borderColor}30`, display: 'flex', gap: 10, alignItems: 'flex-start', transition: 'transform 0.2s ease, background 0.2s ease', cursor: 'default' }}
            onMouseEnter={e => { e.currentTarget.style.background = isCritical ? 'rgba(255,45,120,0.13)' : 'rgba(232,160,32,0.13)'; gsap.to(e.currentTarget, { x: 3, duration: 0.2 }); }}
            onMouseLeave={e => { e.currentTarget.style.background = bgColor; gsap.to(e.currentTarget, { x: 0, duration: 0.2 }); }}
          >
            <ShieldAlert size={16} color={borderColor} style={{ flexShrink: 0, marginTop: 1 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: textColor, marginBottom: 2 }}>{r.chapter}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {r.marks ? `Skipping may impact ~${r.marks} marks` : 'Needs attention'} · {r.subject}
                {r.daysLeft != null && ` · ${r.daysLeft}d left`}
              </p>
            </div>
            {isCritical && (
              <span style={{ fontSize: 9, fontWeight: 800, background: 'rgba(255,45,120,0.15)', color: '#ff2d78', padding: '2px 8px', borderRadius: 20, flexShrink: 0, alignSelf: 'center' }}>
                URGENT
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}