// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { authService } from '../services/authService';

// const TeacherRegister = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ name: '', email: '', password: '' });
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       await authService.teacherRegister(formData);
//       alert('Teacher Registration successful! Please login.');
//       navigate('/teacher-login');
//     } catch (err) {
//       setError(err.message || 'User already exists');
//     }
//   };

//   return (
//     <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
//       <h2>Teacher Registration</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
      
//       <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//         <input name="name" placeholder="Full Name (e.g. Dr. Sharma)" onChange={handleChange} required />
//         <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
//         <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        
//         <button type="submit" style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none' }}>
//           Register as Teacher
//         </button>
//       </form>
//       <p style={{ marginTop: '10px' }}>
//         Already have an account? <a href="/teacher-login">Login here</a>
//       </p>
//     </div>
//   );
// };

// export default TeacherRegister;
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { GraduationCap, Mail, Lock, User, ArrowLeft, ArrowRight, School, Eye, EyeOff } from 'lucide-react';
// ✅ FIX: TeacherRegister was calling authService.teacherRegister() which doesn't exist.
//         The correct method name is authService.registerTeacher().
import { authService } from '../services/authService';
import { useApp } from '../context/AppContext';

export default function TeacherRegister() {
  const navigate = useNavigate();
  const { setRole, setUserName } = useApp();

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const cardRef = useRef();
  const formRef = useRef();

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { y: 60, opacity: 0, rotationX: 10 },
      { y: 0, opacity: 1, rotationX: 0, duration: 0.7, ease: 'power3.out', transformPerspective: 900 }
    );
    gsap.fromTo([...formRef.current.children],
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, stagger: 0.08, duration: 0.45, ease: 'back.out(1.3)', delay: 0.3 }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // ✅ FIX: was authService.teacherRegister — correct name is registerTeacher
      const response = await authService.registerTeacher({ name, email, password });
      setRole('teacher');
      setUserName(response.name || name);

      gsap.to(cardRef.current, {
        scale: 1.06, opacity: 0, filter: 'blur(8px)', duration: 0.5,
        ease: 'power3.in', onComplete: () => navigate('/teacher/dashboard'),
      });
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration failed. Please try again.');
      gsap.fromTo(cardRef.current, { x: -10 }, { x: 10, duration: 0.08, yoyo: true, repeat: 6, ease: 'linear' });
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px 12px 42px',
    borderRadius: 12, border: '1.5px solid #d4e4f7',
    background: '#f8fbff', fontSize: 14, outline: 'none',
    color: '#0d0f1a', transition: 'border-color 0.2s ease',
    fontFamily: 'DM Sans, sans-serif',
  };
  const focus = e => e.target.style.borderColor = '#00c9b1';
  const blur  = e => e.target.style.borderColor = '#d4e4f7';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fffe 0%, #e5f8f5 50%, #f0f4ff 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        <button onClick={() => navigate('/teacher-login')}
          onMouseEnter={e => gsap.to(e.currentTarget, { x: -5 })}
          onMouseLeave={e => gsap.to(e.currentTarget, { x: 0 })}
          style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28, background: 'none', border: 'none', cursor: 'pointer', color: '#4a5068', fontSize: 13, fontWeight: 500 }}
        >
          <ArrowLeft size={15} /> Back to Login
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg,#00c9b1,#00e6cc)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 28px rgba(0,201,177,0.35)' }}>
            <GraduationCap size={26} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: '#0d0f1a' }}>
              CRPS <span style={{ color: '#00c9b1' }}>Teacher Portal</span>
            </div>
            <div style={{ fontSize: 12, color: '#8890aa' }}>Create your teacher account</div>
          </div>
        </div>

        <div ref={cardRef} style={{
          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(24px)',
          borderRadius: 26, padding: '36px 36px 44px',
          boxShadow: '0 24px 80px rgba(0,201,177,0.14)',
          border: '1px solid rgba(0,201,177,0.1)',
        }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: '#0d0f1a', marginBottom: 6 }}>
            Teacher Registration
          </h2>
          <p style={{ fontSize: 13, color: '#8890aa', marginBottom: 24 }}>
            Already registered?{' '}
            <Link to="/teacher-login" style={{ color: '#00c9b1', fontWeight: 700 }}>Sign in here</Link>
          </p>

          {error && (
            <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#b91c1c', borderRadius: 10, fontSize: 13, marginBottom: 16, border: '1px solid #fca5a5' }}>
              {error}
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#4a5068', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={15} color="#8890aa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Dr. Ramesh Sharma" style={inputStyle} onFocus={focus} onBlur={blur} />
              </div>
            </div>

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
              style={{
                width: '100%', padding: '14px', borderRadius: 14, border: 'none', marginTop: 8,
                background: 'linear-gradient(135deg,#00c9b1,#00e6cc)', color: 'white',
                fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.78 : 1, display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
                boxShadow: '0 8px 28px rgba(0,201,177,0.4)', transition: 'opacity 0.2s',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {loading ? 'Creating account…' : <><ArrowRight size={16} /> Register as Teacher</>}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}