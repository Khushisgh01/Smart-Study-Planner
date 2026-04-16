import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useApp } from '../context/AppContext';
import { GraduationCap, Users, ArrowLeft, Mail, Lock, ArrowRight, Eye, EyeOff, School, User, Target, Clock, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function FloatingGeoms() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {[
        { top: '5%', left: '3%', size: 60, color: 'rgba(26,63,163,0.07)', rotate: 20, delay: 0 },
        { top: '20%', right: '5%', size: 40, color: 'rgba(232,160,32,0.08)', rotate: -15, delay: 1 },
        { bottom: '25%', left: '6%', size: 50, color: 'rgba(0,201,177,0.06)', rotate: 35, delay: 2 },
        { bottom: '10%', right: '4%', size: 70, color: 'rgba(255,45,120,0.05)', rotate: 10, delay: 0.5 },
        { top: '50%', left: '12%', size: 30, color: 'rgba(26,63,163,0.08)', rotate: 45, delay: 1.5 },
        { top: '70%', right: '10%', size: 45, color: 'rgba(232,160,32,0.06)', rotate: -30, delay: 2.5 },
      ].map((s, i) => (
        <div key={i} className={`animate-float${(i % 3) + 1}`}
          style={{
            position: 'absolute', top: s.top, bottom: s.bottom, left: s.left, right: s.right,
            width: s.size, height: s.size, background: s.color,
            borderRadius: i % 2 === 0 ? 12 : '50%', transform: `rotate(${s.rotate}deg)`, animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function LoginPage() {
  const { setRole, setUserName } = useApp();
  const [selectedRole, setSelectedRole] = useState(null); // 'student' | 'teacher'
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
  
  // Form State
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

  // API Base URL (Change if hosted elsewhere)
  const API_URL = 'http://localhost:5000/api/auth';

  useEffect(() => {
    gsap.fromTo('.login-logo', { scale: 0, rotate: -30 }, { scale: 1, rotate: 0, duration: 0.7, ease: 'back.out(2)' });
    gsap.fromTo('.login-card', { opacity: 0, y: 50, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.4)', delay: 0.2 });
    gsap.fromTo('.role-card', { opacity: 0, x: -30 }, { opacity: 1, x: 0, stagger: 0.15, duration: 0.5, ease: 'power2.out', delay: 0.5 });
  }, []);

  useEffect(() => {
    if (selectedRole && formRef.current) {
      gsap.fromTo(formRef.current,
        { opacity: 0, x: 40, scale: 0.96 },
        { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: 'back.out(1.4)' }
      );
    }
  }, [selectedRole, isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      let endpoint = '';
      let payload = {};

      if (isLogin) {
        endpoint = selectedRole === 'student' ? `${API_URL}/user/login` : `${API_URL}/teacher/login`;
        payload = { email, password };
      } else {
        endpoint = selectedRole === 'student' ? `${API_URL}/user/register` : `${API_URL}/teacher/register`;
        payload = selectedRole === 'student' 
          ? { name, email, password, level, dailyHours: Number(dailyHours), target }
          : { name, email, password };
      }

      const response = await axios.post(endpoint, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      // Success logic
      const { token, name: resName, role } = response.data;
      
      // Store token in localStorage
      if(token) localStorage.setItem('token', token);
      
      setRole(selectedRole);
      setUserName(resName || name);
      
      // Animate out and navigate
      gsap.to('.login-btn', { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1 });
      setTimeout(() => {
        setIsLoading(false);
        // If student just registered, maybe send them to onboarding, otherwise dashboard
        if (selectedRole === 'student' && !isLogin) navigate('/onboarding');
        else navigate(selectedRole === 'teacher' ? '/teacher' : '/dashboard');
      }, 500);

    } catch (error) {
      setIsLoading(false);
      setErrorMsg(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const goBack = () => {
    if (selectedRole) {
      gsap.to(formRef.current, { opacity: 0, x: -30, duration: 0.3, ease: 'power2.in', onComplete: () => {
        setSelectedRole(null);
        setErrorMsg('');
        setIsLogin(true);
      }});
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{
      flex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #e8ecff 50%, #f5f0ff 100%)',
      position: 'relative', overflow: 'hidden', padding: 24,
    }}>
      <FloatingGeoms />

      <div ref={containerRef} style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>
        {/* Back Button */}
        <button onClick={goBack} style={{
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24,
          color: '#4a5068', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer',
        }}>
          <ArrowLeft size={15} /> Back
        </button>

        {/* Header Logo */}
        <div className="login-logo" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #1a3fa3, #3a5fd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(26,63,163,0.25)' }}>
            <School size={24} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: '#0d0f1a' }}>
              CRPS <span style={{ color: '#1a3fa3' }}>StudyOS</span>
            </div>
            <div style={{ fontSize: 11, color: '#8890aa' }}>Smart Study Planner</div>
          </div>
        </div>

        <div className="login-card" style={{ background: 'white', borderRadius: 24, padding: 32, boxShadow: '0 24px 80px rgba(26,63,163,0.12)', border: '1px solid rgba(26,63,163,0.08)' }}>
          
          {!selectedRole ? (
            /* Role Selection */
            <div>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24, color: '#0d0f1a', marginBottom: 6 }}>Welcome! 👋</h1>
              <p style={{ fontSize: 14, color: '#4a5068', marginBottom: 28 }}>Select your role to get started</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <button className="role-card" onClick={() => setSelectedRole('student')} style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '20px 18px', borderRadius: 16, cursor: 'pointer', textAlign: 'left',
                  background: 'linear-gradient(135deg, #f0f4ff, #e8edff)', border: '2px solid rgba(26,63,163,0.1)', transition: 'all 0.3s ease',
                }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #1a3fa3, #3a5fd4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={26} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#0d0f1a', marginBottom: 3 }}>Student</div>
                    <div style={{ fontSize: 12, color: '#8890aa' }}>Access your study plan & track progress</div>
                  </div>
                  <ArrowRight size={18} color="#1a3fa3" />
                </button>

                <button className="role-card" onClick={() => setSelectedRole('teacher')} style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '20px 18px', borderRadius: 16, cursor: 'pointer', textAlign: 'left',
                  background: 'linear-gradient(135deg, #f0fffe, #e0faf8)', border: '2px solid rgba(0,201,177,0.15)', transition: 'all 0.3s ease',
                }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #00c9b1, #00e6cc)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GraduationCap size={26} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#0d0f1a', marginBottom: 3 }}>Teacher</div>
                    <div style={{ fontSize: 12, color: '#8890aa' }}>Manage chapters, PYQs & track students</div>
                  </div>
                  <ArrowRight size={18} color="#00c9b1" />
                </button>
              </div>
            </div>
          ) : (
            /* Login / Register Form */
            <form ref={formRef} onSubmit={handleSubmit}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: selectedRole === 'teacher' ? 'linear-gradient(135deg, #00c9b1, #00e6cc)' : 'linear-gradient(135deg, #1a3fa3, #3a5fd4)' }}>
                  {selectedRole === 'teacher' ? <GraduationCap size={20} color="white" /> : <Users size={20} color="white" />}
                </div>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: '#0d0f1a' }}>
                    {selectedRole === 'teacher' ? 'Teacher' : 'Student'} {isLogin ? 'Login' : 'Registration'}
                  </div>
                  <div style={{ fontSize: 11, color: '#8890aa' }}>{isLogin ? 'Enter your credentials to continue' : 'Create a new account'}</div>
                </div>
              </div>

              {errorMsg && (
                <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#b91c1c', borderRadius: 8, fontSize: 13, marginBottom: 16, border: '1px solid #fca5a5' }}>
                  {errorMsg}
                </div>
              )}

              {/* REGISTER ONLY FIELDS */}
              {!isLogin && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#4a5068', display: 'block', marginBottom: 6 }}>NAME</label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} color="#8890aa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: 12, border: '1.5px solid #e2e8f8', background: '#f8f9ff', fontSize: 14, outline: 'none' }} />
                  </div>
                </div>
              )}

              {/* COMMON FIELDS: EMAIL & PASSWORD */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#4a5068', display: 'block', marginBottom: 6 }}>EMAIL</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} color="#8890aa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: 12, border: '1.5px solid #e2e8f8', background: '#f8f9ff', fontSize: 14, outline: 'none' }} />
                </div>
              </div>

              <div style={{ marginBottom: !isLogin && selectedRole === 'student' ? 16 : 24 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#4a5068', display: 'block', marginBottom: 6 }}>PASSWORD</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} color="#8890aa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input type={showPassword ? 'text' : 'password'} required minLength="6" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" style={{ width: '100%', padding: '12px 44px 12px 40px', borderRadius: 12, border: '1.5px solid #e2e8f8', background: '#f8f9ff', fontSize: 14, outline: 'none' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {showPassword ? <EyeOff size={15} color="#8890aa" /> : <Eye size={15} color="#8890aa" />}
                  </button>
                </div>
              </div>

              {/* EXTRA STUDENT REGISTRATION FIELDS */}
              {!isLogin && selectedRole === 'student' && (
                <>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#4a5068', display: 'block', marginBottom: 6 }}>STUDY LEVEL</label>
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
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#4a5068', display: 'block', marginBottom: 6 }}>DAILY HRS</label>
                      <div style={{ position: 'relative' }}>
                        <Clock size={15} color="#8890aa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                        <input type="number" required min="1" max="24" value={dailyHours} onChange={e => setDailyHours(e.target.value)} placeholder="Hrs" style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: 12, border: '1.5px solid #e2e8f8', background: '#f8f9ff', fontSize: 14, outline: 'none' }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#4a5068', display: 'block', marginBottom: 6 }}>YOUR TARGET</label>
                    <div style={{ position: 'relative' }}>
                      <Target size={15} color="#8890aa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                      <input type="text" required value={target} onChange={e => setTarget(e.target.value)} placeholder="e.g. 95% in Boards" style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: 12, border: '1.5px solid #e2e8f8', background: '#f8f9ff', fontSize: 14, outline: 'none' }} />
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button type="submit" className="login-btn" disabled={isLoading} style={{
                width: '100%', padding: '14px', borderRadius: 14, border: 'none',
                background: selectedRole === 'teacher' ? 'linear-gradient(135deg, #00c9b1, #00e6cc)' : 'linear-gradient(135deg, #1a3fa3, #3a5fd4)',
                color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: selectedRole === 'teacher' ? '0 6px 24px rgba(0,201,177,0.3)' : '0 6px 24px rgba(26,63,163,0.3)',
                transition: 'all 0.2s ease', opacity: isLoading ? 0.8 : 1,
              }}>
                {isLoading ? 'Processing...' : <><ArrowRight size={16} /> {isLogin ? 'Sign In' : 'Create Account'}</>}
              </button>

              {/* Toggle Login/Register */}
              <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#8890aa' }}>
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
  );
}