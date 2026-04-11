import { useApp } from '../context/AppContext';
import ThemeToggle from './ThemeToggle';
import { BookOpen, GraduationCap, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { activeView, setActiveView } = useApp();

  return (
    <nav style={{
      height: 64,
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #4f6ef7, #7c5cff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(79,110,247,0.4)',
        }}>
          <BookOpen size={18} color="white" />
        </div>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)' }}>
          Study<span style={{ color: 'var(--accent)' }}>OS</span>
        </span>
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'teacher', label: 'Teacher Panel', icon: GraduationCap },
          { id: 'onboarding', label: 'Setup', icon: BookOpen },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveView(id)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 10,
            background: activeView === id ? 'var(--accent-glow)' : 'transparent',
            border: activeView === id ? '1px solid var(--accent)' : '1px solid transparent',
            color: activeView === id ? 'var(--accent)' : 'var(--text-secondary)',
            fontWeight: 500, fontSize: 14, cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}>
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <ThemeToggle />
    </nav>
  );
}