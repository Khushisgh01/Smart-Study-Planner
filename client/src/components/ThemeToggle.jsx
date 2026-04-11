import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { dark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      style={{
        position: 'relative',
        width: 56,
        height: 28,
        borderRadius: 14,
        background: dark ? 'linear-gradient(135deg,#1e2a6e,#0a0e20)' : 'linear-gradient(135deg,#c7d5ff,#e8eeff)',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        padding: '3px',
        transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      }}
      aria-label="Toggle theme"
    >
      <div style={{
        width: 22, height: 22,
        borderRadius: '50%',
        background: dark ? 'linear-gradient(135deg,#6c8fff,#a78bfa)' : 'linear-gradient(135deg,#ffb700,#ff8c00)',
        transform: dark ? 'translateX(28px)' : 'translateX(0)',
        transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: dark ? '0 0 12px rgba(108,143,255,0.6)' : '0 0 12px rgba(255,183,0,0.6)',
      }}>
        {dark ? <Moon size={12} color="white" /> : <Sun size={12} color="white" />}
      </div>
    </button>
  );
}