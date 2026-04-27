import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const { userName, userRole, logout } = useApp();
  const navigate = useNavigate();

  // Bug 5 fix: logout() in AppContext now clears token + userRole + user
  const handleLogout = () => {
    logout(); // clears all localStorage keys and resets state
  };

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 28px', background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>
        StudyFlow
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {userName && (
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {userName} · <strong style={{ textTransform: 'capitalize' }}>{userRole}</strong>
          </span>
        )}
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 18px', borderRadius: 10, border: '1px solid var(--border)',
            background: 'transparent', color: 'var(--text-secondary)',
            fontWeight: 600, fontSize: 13, cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
