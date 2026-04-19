import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useApp } from '../context/AppContext';
import { GraduationCap, Users, ArrowLeft, Mail, Lock, ArrowRight, Eye, EyeOff, School, User, Target, Clock, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Animated Background Bubbles
function FloatingGeoms() {
  const bubbles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 60 + 10,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    color: ['rgba(26,63,163,0.15)', 'rgba(0,201,177,0.15)', 'rgba(255,45,120,0.12)', 'rgba(232,160,32,0.15)'][Math.floor(Math.random() * 4)],
    shape: Math.random() > 0.5 ? '50%' : '15px'
  }));

  useEffect(() => {
    gsap.to('.anim-bubble', {
      y: () => `random(-100, 100)`,
      x: () => `random(-100, 100)`,
      rotation: () => `random(-90, 90)`,
      duration: () => `random(3, 7)`,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.1,
    });
  }, []);

  return (
    <div className="parallax-bg" style={{ position: 'absolute', inset: -50, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {bubbles.map(b => (
        <div key={b.id} className="anim-bubble"
          style={{
            position: 'absolute', top: b.top, left: b.left,
            width: b.size, height: b.size, background: b.color,
            borderRadius: b.shape, backdropFilter: 'blur(2px)'
          }}
        />
      ))}
    </div>
  );
}

// Moving Student Character Widgets
function MovingWidgets() {
  const widgets = [
    { img: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Aki&backgroundColor=b6e3f4', text: 'Studying Physics...', y: '12%', speed: 25, dir: 1, delay: 0 },
    { img: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Kenji&backgroundColor=c0aede', text: 'Solving PYQs 📝', y: '35%', speed: 20, dir: -1, delay: 2 },
    { img: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Sakura&backgroundColor=ffdfbf', text: 'Late for class!', y: '80%', speed: 15, dir: 1, delay: 1 },
    { img: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Sensei&backgroundColor=d1d4f9', text: 'Grading tests', y: '25%', speed: 28, dir: -1, delay: 5 },
    { img: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Ren&backgroundColor=b6e3f4', text: 'Target 95% 🚀', y: '65%', speed: 22, dir: -1, delay: 3 },
    { img: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Yuki&backgroundColor=ffdfbf', text: 'Revision mode on', y: '50%', speed: 30, dir: 1, delay: 4 },
  ];

  useEffect(() => {
    widgets.forEach((w, i) => {
      const el = `.widget-${i}`;
      gsap.fromTo(el,
        { x: w.dir === 1 ? '-20vw' : '120vw' },
        { x: w.dir === 1 ? '120vw' : '-20vw', duration: w.speed, repeat: -1, ease: 'linear', delay: w.delay }
      );
      gsap.to(el, {
        y: '+=30', rotation: () => `random(-5, 5)`, duration: 'random(2, 4)',
        repeat: -1, yoyo: true, ease: 'sine.inOut', delay: w.delay
      });
    });
    gsap.to('.anime-avatar', {
      y: -6, duration: 0.3, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.1
    });
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {widgets.map((w, i) => (
        <div key={i} className={`widget-${i}`} style={{
          position: 'absolute', top: w.y,
          background: 'rgba(255, 255, 255, 0.45)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.8)', padding: '8px 16px 8px 8px',
          borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: '0 8px 32px rgba(26,63,163,0.1)', whiteSpace: 'nowrap'
        }}>
          <img className="anime-avatar" src={w.img} alt="student" style={{
            width: 44, height: 44, borderRadius: '50%', border: '2px solid white',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }} />
          <span style={{ fontWeight: 800, color: '#2b3044', fontSize: 13, fontFamily: 'Syne, sans-serif' }}>{w.text}</span>
        </div>
      ))}
    </div>
  );
}

export default function LoginPage() {
  const { setRole, setUserName } = useApp();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [level, setLevel] = useState('average');
  const [dailyHours, setDailyHours] = useState(4);
  const [target, setTarget] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const containerRef = useRef(null);
  const formRef = useRef(null);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5000/api/auth';

  useEffect(() => {
    gsap.to(containerRef.current, { y: -8, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.fromTo('.login-logo', { scale: 0, rotate: -45, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.5)' });
    gsap.fromTo('.login-card', { opacity: 0, y: 100, rotateX: 15 }, { opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 });
    gsap.fromTo('.role-card', { opacity: 0, x: -50, scale: 0.9 }, { opacity: 1, x: 0, scale: 1, stagger: 0.2, duration: 0.6, ease: 'back.out(1.5)', delay: 0.4 });

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      gsap.to('.parallax-bg', { x: x * 2, y: y * 2, duration: 1, ease: 'power2.out' });
      gsap.to('.login-card', { rotationY: x, rotationX: -y, transformPerspective: 1000, duration: 0.5, ease: 'power1.out' });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (selectedRole && formRef.current) {
      gsap.fromTo(formRef.current.children,
        { opacity: 0, x: 40, scale: 0.9 },
        { opacity: 1, x: 0, scale: 1, stagger: 0.05, duration: 0.5, ease: 'back.out(1.2)' }
      );
    }
  }, [selectedRole, isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const endpoint = isLogin
        ? `${API_URL}/${selectedRole === 'student' ? 'user' : 'teacher'}/login`
        : `${API_URL}/${selectedRole === 'student' ? 'user' : 'teacher'}/register`;

      const payload = isLogin
        ? { email, password }
        : (selectedRole === 'student'
          ? { name, email, password, level, dailyHours: Number(dailyHours), target }
          : { name, email, password });

      const response = await axios.post(endpoint, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      const { token, name: resName } = response.data;

      // ── Store auth data in localStorage ──
      if (token) localStorage.setItem('token', token);
      localStorage.setItem('userRole', selectedRole);               // <-- role persistence fix
      localStorage.setItem('user', JSON.stringify(response.data));  // <-- store user data

      // ── Update app context ──
      setRole(selectedRole);
      setUserName(resName || name);

      // Success animation
      gsap.to('.login-card', { scale: 1.1, opacity: 0, filter: 'blur(10px)', duration: 0.6, ease: 'power3.in' });
      gsap.to('.parallax-bg', { scale: 2, opacity: 0, duration: 0.6 });

      setTimeout(() => {
        setIsLoading(false);
        if (selectedRole === 'student' && !isLogin) {
          navigate('/onboarding');
        } else {
          // ── FIXED: teacher goes to /teacher/dashboard, not /teacher ──
          navigate(selectedRole === 'teacher' ? '/teacher/dashboard' : '/dashboard');
        }
      }, 600);

    } catch (error) {
      setIsLoading(false);
      setErrorMsg(error.response?.data?.message || 'Something went wrong. Please try again.');
      gsap.fromTo('.login-card', { x: -10 }, { x: 10, duration: 0.1, yoyo: true, repeat: 5, ease: 'linear' });
    }
  };

  const goBack = () => {
    if (selectedRole) {
      gsap.to(formRef.current, {
        opacity: 0, x: -50, duration: 0.3, ease: 'power2.in', onComplete: () => {
          setSelectedRole(null);
          setErrorMsg('');
          setIsLogin(true);
        }
      });
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{
      width: '100%', minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #e8ecff 50%, #f5f0ff 100%)',
      position: 'relative', overflowX: 'hidden', overflowY: 'auto'
    }}>
      <FloatingGeoms />
      <MovingWidgets />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        <div ref={containerRef} style={{ width: '100%', maxWidth: 460 }}>

          <button onClick={goBack} style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24,
            color: '#4a5068', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer',
          }}
            onMouseEnter={e => gsap.to(e.target, { x: -5 })}
            onMouseLeave={e => gsap.to(e.target, { x: 0 })}
          >
            <ArrowLeft size={15} /> Back
          </button>

          <div className="login-logo" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #1a3fa3, #3a5fd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(26,63,163,0.3)' }}>
              <School size={24} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24, color: '#0d0f1a' }}>CRPS <span style={{ color: '#1a3fa3' }}>StudyOS</span></div>
              <div style={{ fontSize: 12, color: '#8890aa' }}>Smart Study Planner</div>
            </div>
          </div>

          <div className="login-card" style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)', borderRadius: 24, padding: '32px 32px 40px 32px', boxShadow: '0 24px 80px rgba(26,63,163,0.15)', border: '1px solid rgba(26,63,163,0.08)', transformStyle: 'preserve-3d' }}>

            {!selectedRole ? (
              <div>
                <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 26, color: '#0d0f1a', marginBottom: 6 }}>Welcome! 👋</h1>
                <p style={{ fontSize: 14, color: '#4a5068', marginBottom: 28 }}>Select your role to get started</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <button className="role-card" onClick={() => setSelectedRole('student')} style={{
                    display: 'flex', alignItems: 'center', gap: 16, padding: '20px', borderRadius: 16, cursor: 'pointer', textAlign: 'left',
                    background: 'linear-gradient(135deg, #f0f4ff, #e8edff)', border: '2px solid rgba(26,63,163,0.1)', transition: 'all 0.3s ease',
                  }}
                    onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.03, boxShadow: '0 10px 30px rgba(26,63,163,0.15)' })}
                    onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, boxShadow: 'none' })}
                  >
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #1a3fa3, #3a5fd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(26,63,163,0.4)' }}>
                      <Users size={26} color="white" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 17, color: '#0d0f1a', marginBottom: 3 }}>Student</div>
                      <div style={{ fontSize: 12, color: '#8890aa' }}>Access your study plan & track progress</div>
                    </div>
                    <ArrowRight size={18} color="#1a3fa3" />
                  </button>

                  <button className="role-card" onClick={() => setSelectedRole('teacher')} style={{
                    display: 'flex', alignItems: 'center', gap: 16, padding: '20px', borderRadius: 16, cursor: 'pointer', textAlign: 'left',
                    background: 'linear-gradient(135deg, #f0fffe, #e0faf8)', border: '2px solid rgba(0,201,177,0.15)', transition: 'all 0.3s ease',
                  }}
                    onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.03, boxShadow: '0 10px 30px rgba(0,201,177,0.15)' })}
                    onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, boxShadow: 'none' })}
                  >
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #00c9b1, #00e6cc)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,201,177,0.4)' }}>
                      <GraduationCap size={26} color="white" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 17, color: '#0d0f1a', marginBottom: 3 }}>Teacher</div>
                      <div style={{ fontSize: 12, color: '#8890aa' }}>Manage chapters, PYQs & track students</div>
                    </div>
                    <ArrowRight size={18} color="#00c9b1" />
                  </button>
                </div>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: selectedRole === 'teacher' ? 'linear-gradient(135deg, #00c9b1, #00e6cc)' : 'linear-gradient(135deg, #1a3fa3, #3a5fd4)' }}>
                    {selectedRole === 'teacher' ? <GraduationCap size={20} color="white" /> : <Users size={20} color="white" />}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: '#0d0f1a' }}>{selectedRole === 'teacher' ? 'Teacher' : 'Student'} {isLogin ? 'Login' : 'Registration'}</div>
                    <div style={{ fontSize: 11, color: '#8890aa' }}>{isLogin ? 'Enter your credentials to continue' : 'Create a new account'}</div>
                  </div>
                </div>

                {errorMsg && (
                  <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#b91c1c', borderRadius: 8, fontSize: 13, border: '1px solid #fca5a5' }}>
                    {errorMsg}
                  </div>
                )}

                {!isLogin && (
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#4a5068', display: 'block', marginBottom: 6 }}>NAME</label>
                    <div style={{ position: 'relative' }}>
                      <User size={15} color="#8890aa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Full Name"
                        style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: 12, border: '1.5px solid #e2e8f8', background: '#f8f9ff', fontSize: 14, outline: 'none' }}
                        onFocus={e => e.target.style.borderColor = '#1a3fa3'} onBlur={e => e.target.style.borderColor = '#e2e8f8'} />
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#4a5068', display: 'block', marginBottom: 6 }}>EMAIL</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} color="#8890aa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com"
                      style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: 12, border: '1.5px solid #e2e8f8', background: '#f8f9ff', fontSize: 14, outline: 'none' }}
                      onFocus={e => e.target.style.borderColor = '#1a3fa3'} onBlur={e => e.target.style.borderColor = '#e2e8f8'} />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#4a5068', display: 'block', marginBottom: 6 }}>PASSWORD</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} color="#8890aa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                    <input type={showPassword ? 'text' : 'password'} required minLength="6" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
                      style={{ width: '100%', padding: '12px 44px 12px 40px', borderRadius: 12, border: '1.5px solid #e2e8f8', background: '#f8f9ff', fontSize: 14, outline: 'none' }}
                      onFocus={e => e.target.style.borderColor = '#1a3fa3'} onBlur={e => e.target.style.borderColor = '#e2e8f8'} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      {showPassword ? <EyeOff size={15} color="#8890aa" /> : <Eye size={15} color="#8890aa" />}
                    </button>
                  </div>
                </div>

                {!isLogin && selectedRole === 'student' && (
                  <>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 12, fontWeight: 700, color: '#4a5068', display: 'block', marginBottom: 6 }}>LEVEL</label>
                        <div style={{ position: 'relative' }}>
                          <Activity size={15} color="#8890aa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                          <select value={level} onChange={e => setLevel(e.target.value)} style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: 12, border: '1.5px solid #e2e8f8', background: '#f8f9ff', fontSize: 14, outline: 'none' }}>
                            <option value="topper">Topper</option>
                            <option value="average">Average</option>
                            <option value="last-minute">Last-Minute</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ width: '40%' }}>
                        <label style={{ fontSize: 12, fontWeight: 700, color: '#4a5068', display: 'block', marginBottom: 6 }}>HRS/DAY</label>
                        <div style={{ position: 'relative' }}>
                          <Clock size={15} color="#8890aa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                          <input type="number" required min="1" max="24" value={dailyHours} onChange={e => setDailyHours(e.target.value)} placeholder="Hrs"
                            style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: 12, border: '1.5px solid #e2e8f8', background: '#f8f9ff', fontSize: 14, outline: 'none' }} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#4a5068', display: 'block', marginBottom: 6 }}>TARGET</label>
                      <div style={{ position: 'relative' }}>
                        <Target size={15} color="#8890aa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                        <input type="text" required value={target} onChange={e => setTarget(e.target.value)} placeholder="e.g. 95% in Boards"
                          style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: 12, border: '1.5px solid #e2e8f8', background: '#f8f9ff', fontSize: 14, outline: 'none' }}
                          onFocus={e => e.target.style.borderColor = '#1a3fa3'} onBlur={e => e.target.style.borderColor = '#e2e8f8'} />
                      </div>
                    </div>
                  </>
                )}

                <button type="submit" disabled={isLoading} style={{
                  width: '100%', padding: '14px', borderRadius: 14, border: 'none', marginTop: 10,
                  background: selectedRole === 'teacher' ? 'linear-gradient(135deg, #00c9b1, #00e6cc)' : 'linear-gradient(135deg, #1a3fa3, #3a5fd4)',
                  color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: selectedRole === 'teacher' ? '0 6px 24px rgba(0,201,177,0.3)' : '0 6px 24px rgba(26,63,163,0.3)',
                  transition: 'all 0.2s ease', opacity: isLoading ? 0.8 : 1,
                }}
                  onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.02 })}
                  onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1 })}
                >
                  {isLoading ? 'Processing...' : <><ArrowRight size={16} /> {isLogin ? 'Sign In' : 'Create Account'}</>}
                </button>

                <p style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: '#8890aa' }}>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button type="button" onClick={() => setIsLogin(!isLogin)} style={{ color: selectedRole === 'teacher' ? '#00c9b1' : '#1a3fa3', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}