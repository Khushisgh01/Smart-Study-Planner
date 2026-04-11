import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import ProgressRing from '../components/ProgressRing';
import InsightCard from '../components/InsightCard';
import RiskAlert from '../components/RiskAlert';
import TomorrowPreview from '../components/TomorrowPreview';
import { Zap, Calendar, TrendingUp, ShieldAlert, ChevronRight } from 'lucide-react';

function Confetti({ show }) {
  if (!show) return null;
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    color: ['#4f6ef7','#00c9b1','#ff2d78','#ffb700','#a78bfa'][i % 5],
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    size: 6 + Math.random() * 8,
  }));
  return (
    <>
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left: `${p.left}%`, top: '-20px',
          background: p.color,
          width: p.size, height: p.size,
          animationDelay: `${p.delay}s`,
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        }} />
      ))}
    </>
  );
}

function SectionHeader({ icon: Icon, title, color = 'var(--accent)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={14} color={color} />
      </div>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>{title}</h2>
    </div>
  );
}

export default function Dashboard() {
  const { tasks, showConfetti, subjects } = useApp();
  const mainRef = useRef();
  const today = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });

  useEffect(() => {
    gsap.fromTo(mainRef.current.children,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out' }
    );
  }, []);

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const totalMins = tasks.reduce((a,t) => a + t.estimatedTime, 0);

  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      <Confetti show={showConfetti} />
      <Sidebar />

      <main ref={mainRef} style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>{today}</p>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--text-primary)' }}>
              Good morning, <span className="gradient-text">Arjun!</span> 👋
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6 }}>
              {pendingCount} tasks pending today · {totalMins} min total
            </p>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { label: 'Done Today', value: doneCount, color: '#00c9b1' },
              { label: 'Remaining', value: pendingCount, color: '#4f6ef7' },
              { label: 'Total Min', value: totalMins, color: '#ffb700' },
            ].map((s, i) => (
              <div key={i} className="card" style={{ padding: '12px 18px', textAlign: 'center', minWidth: 90 }}>
                <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: s.color }}>{s.value}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Two column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          {/* LEFT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Today's Tasks */}
            <div className="card" style={{ padding: '24px' }}>
              <SectionHeader icon={Calendar} title="Today's Study Plan" />
              {tasks.length === 0
                ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px 0' }}>🎉 All tasks done! You're on fire!</p>
                : tasks.map((t, i) => <TaskCard key={t._id} task={t} index={i} />)
              }
            </div>

            {/* Progress */}
            <div className="card" style={{ padding: '24px' }}>
              <SectionHeader icon={TrendingUp} title="Progress Overview" color="#00c9b1" />
              <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
                <ProgressRing value={subjects.reduce((a,s)=>a+s.progress,0)/subjects.length|0} size={100} color="#4f6ef7" label="Syllabus Done" sublabel="Overall" />
                <ProgressRing value={72} size={100} color="#00c9b1" label="High-Weight Chapters" sublabel="Covered" />
                <ProgressRing value={55} size={100} color="#ff2d78" label="PYQ Practice" sublabel="Completed" />
                <ProgressRing value={40} size={100} color="#ffb700" label="Revisions Done" sublabel="This Week" />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Insights */}
            <div className="card" style={{ padding: '20px' }}>
              <SectionHeader icon={Zap} title="Smart Insights" color="#ffb700" />
              <InsightCard />
            </div>

            {/* Risk Alerts */}
            <div className="card" style={{ padding: '20px' }}>
              <SectionHeader icon={ShieldAlert} title="Risk Alerts" color="#ff2d78" />
              <RiskAlert />
            </div>

            {/* Tomorrow Preview */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <SectionHeader icon={ChevronRight} title="Tomorrow's Preview" />
              </div>
              <TomorrowPreview />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}