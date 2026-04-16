import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { Sun, Moon, BookOpen, GraduationCap, LayoutDashboard, FileText, Home, LogOut, School } from 'lucide-react';

export default function Navbar() {
  const { dark, toggle } = useTheme();
  const { role, setRole, setUserName } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef();
  const logoRef = useRef();

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
    );
    gsap.fromTo(logoRef.current,
      { scale: 0, rotate: -20 },
      { scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(1.7)', delay: 0.3 }
    );
  }, []);

  const isActive = (path) => location.pathname === path;

  const studentLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/pyqs', label: 'Previous Year Qs', icon: FileText },
    { path: '/onboarding', label: 'Setup', icon: BookOpen },
  ];

  const teacherLinks = [
    { path: '/teacher', label: 'Teacher Panel', icon: GraduationCap },
    { path: '/pyqs', label: 'Manage PYQs', icon: FileText },
  ];

  const links = role === 'teacher' ? teacherLinks : studentLinks;

  // Logout Functionality
  const handleLogout = () => {
    // 1. Remove the token from local storage
    localStorage.removeItem('token');
    
    // 2. Clear the global app state
    setRole(null);
    setUserName('');
    
    // 3. Redirect to the landing/home page
    navigate('/');
  };

  return (
    <nav ref={navRef} style={{
      height: 68,
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky', top: 0, zIndex: 200,
      boxShadow: '0 2px 24px rgba(26,63,163,0.07)',
    }}>
      {/* Logo */}
      <div ref={logoRef} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
        onClick={() => navigate('/')}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'linear-gradient(135deg, #1a3fa3, #3a5fd4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 18px rgba(26,63,163,0.4)',
          flexShrink: 0,
        }}>
          <School size={20} color="white" />
        </div>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)', lineHeight: 1 }}>
            CRPS <span style={{ color: 'var(--school-blue)' }}>StudyOS</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>Chhotu Ram Public School</div>
        </div>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {role && links.map(({ path, label, icon: Icon }) => (
          <button key={path} onClick={() => navigate(path)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 10,
            background: isActive(path) ? 'var(--accent-glow)' : 'transparent',
            border: isActive(path) ? '1px solid var(--accent)' : '1px solid transparent',
            color: isActive(path) ? 'var(--accent)' : 'var(--text-secondary)',
            fontWeight: 500, fontSize: 13, cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
          }}>
            <Icon size={14} />
            {label}
            {isActive(path) && (
              <div style={{
                position: 'absolute', bottom: -1, left: '50%',
                transform: 'translateX(-50%)',
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--accent)',
              }} />
            )}
          </button>
        ))}

        {!role && (
          <button onClick={() => navigate('/')} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 10,
            background: 'transparent', border: '1px solid transparent',
            color: 'var(--text-secondary)', fontWeight: 500, fontSize: 13, cursor: 'pointer',
          }}>
            <Home size={14} /> Home
          </button>
        )}
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Theme toggle */}
        <button onClick={toggle} style={{
          width: 52, height: 28, borderRadius: 14,
          background: dark ? 'linear-gradient(135deg,#1a2560,#090e22)' : 'linear-gradient(135deg,#c7d5ff,#e8eeff)',
          border: '1px solid var(--border)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', padding: 3,
          transition: 'all 0.35s ease',
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            background: dark ? 'linear-gradient(135deg,#4f7fff,#8faeff)' : 'linear-gradient(135deg,#e8a020,#f5c842)',
            transform: dark ? 'translateX(24px)' : 'translateX(0)',
            transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: dark ? '0 0 10px rgba(79,127,255,0.6)' : '0 0 10px rgba(232,160,32,0.6)',
          }}>
            {dark ? <Moon size={11} color="white" /> : <Sun size={11} color="white" />}
          </div>
        </button>

        {/* Role badge */}
        {role && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 20,
            background: role === 'teacher' ? 'rgba(0,201,177,0.12)' : 'rgba(26,63,163,0.12)',
            border: `1px solid ${role === 'teacher' ? 'rgba(0,201,177,0.3)' : 'rgba(26,63,163,0.3)'}`,
            fontSize: 12, fontWeight: 600,
            color: role === 'teacher' ? '#00c9b1' : 'var(--school-blue)',
          }}>
            {role === 'teacher' ? <GraduationCap size={13} /> : <BookOpen size={13} />}
            {role === 'teacher' ? 'Teacher' : 'Student'}
          </div>
        )}

        {/* Logout Button (Only visible if logged in) */}
        {role && (
          <button 
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 10,
              background: 'transparent',
              border: '1px solid rgba(239, 68, 68, 0.3)', // light red border
              color: '#ef4444', // red text
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <LogOut size={14} /> Logout
          </button>
        )}
      </div>
    </nav>
  );
}