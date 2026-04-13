import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useApp } from '../context/AppContext';
import { GraduationCap, Users, BookOpen, ArrowLeft, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router';
export default function LoginStudent() {
  const { setActiveView, setRole, setUserName } = useApp();
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!containerRef.current) return;
    // Animate background decorations
    gsap.fromTo('.login-bg-circle',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, stagger: 0.2, duration: 1.2, ease: 'elastic.out(1, 0.5)' }
    );
    // Pulse the gradient circles continuously
    gsap.to('.login-bg-circle', {
      scale: 1.1, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.5,
    });
    // Animate main container
    gsap.fromTo(containerRef.current.children,
      { opacity: 0, y: 40, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.7, ease: 'back.out(1.4)' }
    );
  }, []);

  useEffect(() => {
    if (formRef.current && selectedRole) {
      gsap.fromTo(formRef.current,
        { opacity: 0, x: 30, rotateY: 8 },
        { opacity: 1, x: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' }
      );
      // Animate form fields staggered
      gsap.fromTo(formRef.current.querySelectorAll('input, button, label, .form-header'),
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.06, duration: 0.4, ease: 'power2.out', delay: 0.2 }
      );
    }
  }, [selectedRole]);

  const handleLogin = () => {
    //setRole(selectedRole);
    //setUserName(selectedRole === 'teacher' ? 'Teacher' : 'Arjun');
    if (selectedRole === 'teacher') {
      navigate('/teacher');
    } else {
      navigate('/onboarding');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e8ecff 50%, #f8f0ff 100%)' }}>
      
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="login-bg-circle absolute w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #4f6ef7, transparent)', top: '-10%', right: '-10%' }} />
        <div className="login-bg-circle absolute w-80 h-80 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #a78bfa, transparent)', bottom: '-10%', left: '-5%' }} />
        <div className="login-bg-circle absolute w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #00c9b1, transparent)', top: '40%', left: '60%' }} />
      </div>

      <div ref={containerRef} className="relative z-10 w-full max-w-md mx-auto px-6">
        {/* Back button */}
        <button onClick={() => selectedRole ? setSelectedRole(null) : setActiveView('landing')}
          className="flex items-center gap-2 mb-8 cursor-pointer transition-all hover:-translate-x-1"
          style={{ color: '#4a5068', fontSize: 14, fontWeight: 500, background: 'none', border: 'none' }}>
          <ArrowLeft size={16} /> Back
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c5cff)', boxShadow: '0 4px 16px rgba(79,110,247,0.4)' }}>
            <BookOpen size={22} color="white" />
          </div>
          <div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24 }}>
              Study<span style={{ color: '#4f6ef7' }}>OS</span>
            </span>
            <p style={{ fontSize: 12, color: '#8890aa' }}>Smart Study Planner</p>
          </div>
        </div>

        {!selectedRole ? (
          /* Role Selection */
          <div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28, color: '#0d0f1a', marginBottom: 8 }}>
              Welcome! Who are you?
            </h1>
            <p style={{ fontSize: 15, color: '#4a5068', marginBottom: 32, lineHeight: 1.6 }}>
              Choose your role to get a personalized experience
            </p>

            <div className="flex flex-col gap-4">
              {/* Student Card */}
              <button onClick={() => setSelectedRole('student')}
                className="flex items-center gap-5 p-6 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl text-left"
                style={{ background: 'white', border: '2px solid #e2e8f8', boxShadow: '0 4px 20px rgba(79,110,247,0.08)' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, #4f6ef7, #6c8fff)', boxShadow: '0 4px 16px rgba(79,110,247,0.3)' }}>
                  <Users size={28} color="white" />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: '#0d0f1a', marginBottom: 4 }}>
                    Login as Student
                  </h3>
                  <p style={{ fontSize: 13, color: '#8890aa', lineHeight: 1.5 }}>
                    Access your personalized study plan, track progress, and ace your exams
                  </p>
                </div>
                <ArrowRight size={20} color="#4f6ef7" className="shrink-0" />
              </button>

              {/* Teacher Card */}
              <button onClick={() => setSelectedRole('teacher')}
                className="flex items-center gap-5 p-6 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl text-left"
                style={{ background: 'white', border: '2px solid #e2e8f8', boxShadow: '0 4px 20px rgba(79,110,247,0.08)' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, #00c9b1, #00e6cc)', boxShadow: '0 4px 16px rgba(0,201,177,0.35)' }}>
                  <GraduationCap size={28} color="white" />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: '#0d0f1a', marginBottom: 4 }}>
                    Login as Teacher
                  </h3>
                  <p style={{ fontSize: 13, color: '#8890aa', lineHeight: 1.5 }}>
                    Set exam datesheets, configure chapter weightages, and manage subjects
                  </p>
                </div>
                <ArrowRight size={20} color="#00c9b1" className="shrink-0" />
              </button>
            </div>
          </div>
        ) : (
          /* Login Form */
          <div ref={formRef}>
            <div className="flex items-center gap-3 mb-6 form-header">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: selectedRole === 'teacher' ? 'linear-gradient(135deg, #00c9b1, #00e6cc)' : 'linear-gradient(135deg, #4f6ef7, #6c8fff)' }}>
                {selectedRole === 'teacher' ? <GraduationCap size={18} color="white" /> : <Users size={18} color="white" />}
              </div>
              <div>
                <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24, color: '#0d0f1a' }}>
                  {selectedRole === 'teacher' ? 'Teacher Login' : 'Student Login'}
                </h1>
                <p style={{ fontSize: 12, color: '#8890aa' }}>Enter your credentials to continue</p>
              </div>
            </div>

            <div className="p-8 rounded-2xl" style={{ background: 'white', border: '1px solid #e2e8f8', boxShadow: '0 8px 40px rgba(79,110,247,0.08)' }}>
              <div className="flex flex-col gap-5">
                {/* Email */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#4a5068', marginBottom: 6, display: 'block' }}>Email</label>
                  <div className="relative">
                    <Mail size={16} color="#8890aa" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@school.edu"
                      className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all focus:ring-2"
                      style={{ background: '#f8f9ff', border: '1px solid #e2e8f8', fontSize: 14, color: '#0d0f1a' }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#4a5068', marginBottom: 6, display: 'block' }}>Password</label>
                  <div className="relative">
                    <Lock size={16} color="#8890aa" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-11 py-3 rounded-xl outline-none transition-all focus:ring-2"
                      style={{ background: '#f8f9ff', border: '1px solid #e2e8f8', fontSize: 14, color: '#0d0f1a' }}
                    />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" style={{ background: 'none', border: 'none' }}>
                      {showPassword ? <EyeOff size={16} color="#8890aa" /> : <Eye size={16} color="#8890aa" />}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button onClick={handleLogin}
                  className="w-full py-3.5 rounded-xl text-white cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
                  style={{
                    background: selectedRole === 'teacher'
                      ? 'linear-gradient(135deg, #00c9b1, #00e6cc)'
                      : 'linear-gradient(135deg, #4f6ef7, #7c5cff)',
                    fontWeight: 600, fontSize: 15,
                    boxShadow: selectedRole === 'teacher'
                      ? '0 4px 20px rgba(0,201,177,0.35)'
                      : '0 4px 20px rgba(79,110,247,0.35)',
                  }}>
                  Sign In <ArrowRight size={16} />
                </button>
              </div>

              <p className="text-center mt-5" style={{ fontSize: 13, color: '#8890aa' }}>
                Demo mode — enter any credentials
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}