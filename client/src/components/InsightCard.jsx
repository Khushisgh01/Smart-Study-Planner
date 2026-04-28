// import { Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';

// const insights = [
//   { type: 'tip', text: 'Focus on Trees + Graphs to gain +20 marks', icon: TrendingUp, color: '#4f6ef7' },
//   { type: 'warning', text: 'You are falling behind by 1 day', icon: AlertCircle, color: '#ffb700' },
//   { type: 'insight', text: 'Organic Reactions appears in 60% of PYQs', icon: Lightbulb, color: '#00c9b1' },
// ];

// export default function InsightCard() {
//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//       {insights.map((ins, i) => (
//         <div key={i} className="card" style={{
//           padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'flex-start',
//           borderLeft: `3px solid ${ins.color}`,
//           animation: `slideUp 0.4s ease ${i * 0.1}s both`,
//         }}>
//           <div style={{ width: 28, height: 28, borderRadius: 8, background: `${ins.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//             <ins.icon size={14} color={ins.color} />
//           </div>
//           <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{ins.text}</p>
//         </div>
//       ))}
//     </div>
//   );
// }
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useApp } from '../context/AppContext';
import { Lightbulb, TrendingUp, AlertCircle, Zap, Star, Clock } from 'lucide-react';

// ✅ FIX Bug 30: Insights derived from real context data — not hardcoded strings

function buildInsights(subjects, tasks) {
  const insights = [];

  const pending = tasks.filter(t => t.status === 'pending');
  const done    = tasks.filter(t => t.status === 'done');
  const skipped = tasks.filter(t => t.status === 'skipped');

  // 1 — Task completion status
  if (done.length > 0 && pending.length === 0) {
    insights.push({
      text: `All ${done.length} tasks done today! You're crushing it 🔥`,
      icon: Star, color: '#00c9b1',
    });
  } else if (skipped.length >= 2) {
    insights.push({
      text: `${skipped.length} tasks skipped — they've been rescheduled to tomorrow automatically.`,
      icon: AlertCircle, color: '#e8a020',
    });
  } else if (pending.length > 3) {
    insights.push({
      text: `${pending.length} tasks still pending. Focus for ${pending.reduce((a, t) => a + (t.estimatedTime || 0), 0)} more minutes to clear today's plan.`,
      icon: Clock, color: '#e8a020',
    });
  } else if (done.length > 0) {
    insights.push({
      text: `Nice! ${done.length} done, ${pending.length} to go. Keep the momentum going.`,
      icon: TrendingUp, color: '#1a3fa3',
    });
  }

  // 2 — Low-progress subject with exam approaching
  const lagging = subjects
    .map(s => ({ ...s, daysLeft: Math.ceil((new Date(s.examDate) - new Date()) / 86400000) }))
    .filter(s => s.daysLeft > 0 && s.progress < 50)
    .sort((a, b) => a.daysLeft - b.daysLeft)[0];

  if (lagging) {
    insights.push({
      text: `${lagging.name} is only ${lagging.progress}% done with ${lagging.daysLeft} days to exam — prioritise it now.`,
      icon: AlertCircle, color: '#ff2d78',
    });
  }

  // 3 — High-progress encouragement
  const winning = subjects.filter(s => s.progress >= 80)[0];
  if (winning && !lagging) {
    insights.push({
      text: `${winning.name} is at ${winning.progress}% — excellent progress! Consider a PYQ session to lock it in.`,
      icon: Star, color: '#00c9b1',
    });
  }

  // 4 — Subject with highest weightage insight
  const highWeight = subjects
    .flatMap(s => (s.chapters || []).map(ch => ({ ...ch, subject: s.name })))
    .sort((a, b) => (b.weightage || 0) - (a.weightage || 0))[0];

  if (highWeight && highWeight.weightage >= 8) {
    insights.push({
      text: `"${highWeight.name}" in ${highWeight.subject} has weight ${highWeight.weightage}/10 — it appears frequently in CRPS PYQs.`,
      icon: Lightbulb, color: '#1a3fa3',
    });
  }

  // 5 — Upcoming exam warning
  const urgent = subjects
    .map(s => ({ ...s, daysLeft: Math.ceil((new Date(s.examDate) - new Date()) / 86400000) }))
    .filter(s => s.daysLeft > 0 && s.daysLeft <= 10)
    .sort((a, b) => a.daysLeft - b.daysLeft)[0];

  if (urgent) {
    insights.push({
      text: `⚠️ ${urgent.name} exam in ${urgent.daysLeft} day${urgent.daysLeft === 1 ? '' : 's'}! Switch to revision-only mode.`,
      icon: Zap, color: '#ff2d78',
    });
  }

  // Fallback if no data yet
  if (insights.length === 0) {
    return [
      { text: 'Complete today\'s tasks to boost your Exam Readiness score!', icon: TrendingUp, color: '#1a3fa3' },
      { text: 'High-weightage chapters appear most in board exams — tackle them first.', icon: Lightbulb, color: '#00c9b1' },
      { text: 'Consistency beats intensity — aim for 1 completed task before checking your phone.', icon: Star, color: '#e8a020' },
    ];
  }

  return insights.slice(0, 3);
}

export default function InsightCard() {
  const { subjects = [], tasks = [] } = useApp();
  const containerRef = useRef();
  const insights = buildInsights(subjects, tasks);

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.children;

    // Staggered entrance with slight rotation effect
    gsap.fromTo(cards,
      { opacity: 0, x: -24, rotationY: -8, scale: 0.96 },
      { opacity: 1, x: 0, rotationY: 0, scale: 1, stagger: 0.12, duration: 0.5, ease: 'power2.out', transformPerspective: 600 }
    );

    // Subtle float on each card
    gsap.to(cards, {
      y: -3, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut',
      stagger: { each: 0.4, from: 'start' },
    });
  }, [insights.length, subjects.length, tasks.length]);

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {insights.map((ins, i) => (
        <div key={i} style={{
          padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'flex-start',
          borderLeft: `3px solid ${ins.color}`,
          background: `${ins.color}08`,
          borderRadius: '0 12px 12px 0',
          border: `1px solid ${ins.color}20`,
          borderLeft: `3px solid ${ins.color}`,
          cursor: 'default',
          transition: 'background 0.2s ease',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = `${ins.color}12`; gsap.to(e.currentTarget, { x: 3, duration: 0.25 }); }}
          onMouseLeave={e => { e.currentTarget.style.background = `${ins.color}08`; gsap.to(e.currentTarget, { x: 0, duration: 0.25 }); }}
        >
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `${ins.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ins.icon size={14} color={ins.color} />
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{ins.text}</p>
        </div>
      ))}
    </div>
  );
}