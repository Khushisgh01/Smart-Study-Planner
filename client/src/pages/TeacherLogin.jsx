// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { authService } from '../services/authService';

// const TeacherLogin = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const response = await authService.teacherLogin({ email, password });
//       console.log('Login successful:', response);
//       // Redirect to teacher dashboard
//       navigate('/teacher/dashboard');
//     } catch (err) {
//       setError(err.message || 'Invalid Email or Password');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Teacher Login</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleLogin}>
//         <div>
//           <label>Email:</label>
//           <input 
//             type="email" 
//             value={email} 
//             onChange={(e) => setEmail(e.target.value)} 
//             required 
//           />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input 
//             type="password" 
//             value={password} 
//             onChange={(e) => setPassword(e.target.value)} 
//             required 
//           />
//         </div>
//         <button type="submit" disabled={loading}>
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default TeacherLogin;
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, School } from 'lucide-react';
import { useApp } from '../context/AppContext';
// ✅ FIX Bug 26: Use authService (same as LoginPage) instead of raw axios
import { authService } from '../services/authService';

// ── Floating geometric background ────────────────────────────────────────
function FloatingBg() {
  useEffect(() => {
    gsap.to('.tl-blob', {
      y: () => `random(-80, 80)`,
      x: () => `random(-60, 60)`,
      rotation: () => `random(-25, 25)`,
      duration: () => `random(4, 8)`,
      repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.15,
    });
  }, []);

  const blobs = [
    { top: '8%',  left: '5%',  size: 180, color: 'rgba(0,201,177,0.08)'   },
    { top: '60%', right: '4%', size: 220, color: 'rgba(0,201,177,0.06)'   },
    { top: '30%', left: '55%', size: 140, color: 'rgba(26,63,163,0.06)'   },
    { top: '75%', left: '20%', size: 160, color: 'rgba(232,160,32,0.05)'  },
    { top: '15%', right: '15%',size: 100, color: 'rgba(255,45,120,0.05)'  },
    { top: '50%', left: '10%', size: 120, color: 'rgba(0,201,177,0.05)'   },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {blobs.map((b, i) => (
        <div key={i} className="tl-blob" style={{
          position: 'absolute',
          top: b.top, left: b.left, right: b.right,
          width: b.size, height: b.size,
          background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
          borderRadius: '50%', filter: 'blur(30px)',
        }} />
      ))}

      {/* Dotted grid top-right */}
      <div style={{ position: 'absolute', top: 40, right: 40, opacity: 0.18, display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 10 }}>
        {Array.from({ length: 64 }).map((_, i) => (
          <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: '#00c9b1' }} />
        ))}
      </div>
    </div>
  );
}

export default function TeacherLogin() {
  const { setRole, setUserName } = useApp();
  const navigate = useNavigate();

  const [isLogin, setIsLogin]         = useState(true);
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [name, setName]               = useState('');
  const [showPass, setShowPass]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  const cardRef   = useRef();
  const formRef   = useRef();
  const logoRef   = useRef();

  // ── Entrance animations ───────────────────────────────────────────────
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(logoRef.current,
      { scale: 0, rotation: -180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 0.9, ease: 'elastic.out(1, 0.5)' }
    )
    .fromTo(cardRef.current,
      { y: 80, opacity: 0, rotationX: 12 },
      { y: 0, opacity: 1, rotationX: 0, duration: 0.7, ease: 'power3.out' },
      '-=0.4'
    );

    // Parallax on mouse move
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 14;
      const y = (e.clientY / window.innerHeight - 0.5) * 14;
      gsap.to(cardRef.current, { rotationY: x, rotationX: -y, transformPerspective: 1200, duration: 0.6, ease: 'power1.out' });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Animate form fields whenever isLogin toggles
  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo([...formRef.current.children],
        { opacity: 0, x: 30, scale: 0.96 },
        { opacity: 1, x: 0, scale: 1, stagger: 0.06, duration: 0.45, ease: 'back.out(1.3)' }
      );
    }
  }, [isLogin]);

  // ── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      if (isLogin) {
        // ✅ FIX Bug 26: authService.loginTeacher — consistent with authService.js
        response = await authService.loginTeacher({ email, password });
      } else {
        // ✅ FIX Bug 26: authService.registerTeacher — same pattern
        response = await authService.registerTeacher({ name, email, password });
      }

      // authService already stores token + user + userRole
      setRole('teacher');
      setUserName(response.name || name);

      // Success animation
      gsap.to(cardRef.current, { scale: 1.08, opacity: 0, filter: 'blur(8px)', duration: 0.5, ease: 'power3.in' });

      setTimeout(() => navigate('/teacher/dashboard'), 550);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Something went wrong. Please try again.');
      gsap.fromTo(cardRef.current, { x: -12 }, { x: 12, duration: 0.08, yoyo: true, repeat: 6, ease: 'linear' });
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px 12px 42px',
    borderRadius: 12, border: '1.5px solid #d4e4f7',
    background: '#f8fbff', fontSize: 14, outline: 'none',
    color: '#0d0f1a', transition: 'border-color 0.2s ease',
  };

  const focus = e => e.target.style.borderColor = '#00c9b1';
  const blur  = e => e.target.style.borderColor = '#d4e4f7';

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fffe 0%, #e5f8f5 50%, #f0f4ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative', overflowX: 'hidden' }}>
      <FloatingBg />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>

        {/* Back button */}
        <button
          onClick={() => navigate('/login')}
          onMouseEnter={e => gsap.to(e.currentTarget, { x: -5 })}
          onMouseLeave={e => gsap.to(e.currentTarget, { x: 0 })}
          style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28, background: 'none', border: 'none', cursor: 'pointer', color: '#4a5068', fontSize: 13, fontWeight: 500 }}
        >
          <ArrowLeft size={15} /> Back to Login
        </button>

        {/* Logo */}
        <div ref={logoRef} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, #00c9b1, #00e6cc)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 28px rgba(0,201,177,0.35)' }}>
            <GraduationCap size={26} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: '#0d0f1a' }}>
              CRPS <span style={{ color: '#00c9b1' }}>Teacher Portal</span>
            </div>
            <div style={{ fontSize: 12, color: '#8890aa' }}>Chhotu Ram Public School, Bakhtawarpur</div>
          </div>
        </div>

        {/* Card */}
        <div
          ref={cardRef}
          style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(24px)', borderRadius: 26, padding: '36px 36px 44px', boxShadow: '0 24px 80px rgba(0,201,177,0.14)', border: '1px solid rgba(0,201,177,0.1)', transformStyle: 'preserve-3d' }}
        >
          {/* Tab toggle */}
          <div style={{ display: 'flex', background: '#f0fffe', borderRadius: 14, padding: 4, marginBottom: 28 }}>
            {['Sign In', 'Register'].map((label, i) => (
              <button key={i} onClick={() => { setIsLogin(i === 0); setError(''); }}
                style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, transition: 'all 0.25s ease',
                  background: (isLogin ? i === 0 : i === 1) ? 'linear-gradient(135deg,#00c9b1,#00e6cc)' : 'transparent',
                  color:      (isLogin ? i === 0 : i === 1) ? 'white' : '#8890aa',
                  boxShadow:  (isLogin ? i === 0 : i === 1) ? '0 4px 14px rgba(0,201,177,0.35)' : 'none',
                }}>
                {label}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#b91c1c', borderRadius: 10, fontSize: 13, marginBottom: 16, border: '1px solid #fca5a5' }}>
              {error}
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {!isLogin && (
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#4a5068', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <School size={15} color="#8890aa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Dr. Ramesh Sharma" style={inputStyle} onFocus={focus} onBlur={blur} />
                </div>
              </div>
            )}

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#4a5068', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} color="#8890aa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="teacher@crps.edu.in" style={inputStyle} onFocus={focus} onBlur={blur} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#4a5068', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} color="#8890aa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input type={showPass ? 'text' : 'password'} required minLength="6" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" style={{ ...inputStyle, paddingRight: 44 }} onFocus={focus} onBlur={blur} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showPass ? <EyeOff size={15} color="#8890aa" /> : <Eye size={15} color="#8890aa" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.02, y: -2 })}
              onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, y: 0 })}
              style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', marginTop: 8,
                background: 'linear-gradient(135deg, #00c9b1, #00e6cc)', color: 'white', fontWeight: 700, fontSize: 15,
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.78 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 8px 28px rgba(0,201,177,0.4)', transition: 'opacity 0.2s ease',
              }}>
              {loading ? 'Processing…' : <><ArrowRight size={16} /> {isLogin ? 'Sign In as Teacher' : 'Create Account'}</>}
            </button>

            {/* Register shortcut */}
            <p style={{ textAlign: 'center', fontSize: 13, color: '#8890aa', marginTop: 4 }}>
              {isLogin ? "New teacher? " : "Already registered? "}
              <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }}
                style={{ color: '#00c9b1', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>
                {isLogin ? 'Create account' : 'Sign in instead'}
              </button>
            </p>

            {/* Link to /teacher-register for full registration form */}
            {isLogin && (
              <p style={{ textAlign: 'center', fontSize: 12, color: '#aab0c8', marginTop: -8 }}>
                Need the full registration form?{' '}
                <Link to="/teacher-register" style={{ color: '#00c9b1', fontWeight: 600 }}>
                  Register here
                </Link>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}