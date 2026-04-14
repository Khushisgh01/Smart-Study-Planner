// import { useRef, useEffect, useState } from 'react';
// import { gsap } from 'gsap';
// import { useApp } from '../context/AppContext';
// import { GraduationCap, Users, BookOpen, ArrowLeft, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
// import { useNavigate } from 'react-router';
// export default function LoginStudent() {
//   const { setActiveView, setRole, setUserName } = useApp();
//   const [selectedRole, setSelectedRole] = useState(null);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const containerRef = useRef(null);
//   const formRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!containerRef.current) return;
//     // Animate background decorations
//     gsap.fromTo('.login-bg-circle',
//       { scale: 0, opacity: 0 },
//       { scale: 1, opacity: 1, stagger: 0.2, duration: 1.2, ease: 'elastic.out(1, 0.5)' }
//     );
//     // Pulse the gradient circles continuously
//     gsap.to('.login-bg-circle', {
//       scale: 1.1, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.5,
//     });
//     // Animate main container
//     gsap.fromTo(containerRef.current.children,
//       { opacity: 0, y: 40, scale: 0.96 },
//       { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.7, ease: 'back.out(1.4)' }
//     );
//   }, []);

//   useEffect(() => {
//     if (formRef.current && selectedRole) {
//       gsap.fromTo(formRef.current,
//         { opacity: 0, x: 30, rotateY: 8 },
//         { opacity: 1, x: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' }
//       );
//       // Animate form fields staggered
//       gsap.fromTo(formRef.current.querySelectorAll('input, button, label, .form-header'),
//         { opacity: 0, y: 15 },
//         { opacity: 1, y: 0, stagger: 0.06, duration: 0.4, ease: 'power2.out', delay: 0.2 }
//       );
//     }
//   }, [selectedRole]);

//   const handleLogin = () => {
//     //setRole(selectedRole);
//     //setUserName(selectedRole === 'teacher' ? 'Teacher' : 'Arjun');
//     if (selectedRole === 'teacher') {
//       navigate('/teacher');
//     } else {
//       navigate('/onboarding');
//     }
//   };

//   return (
//     <div className="flex-1 flex items-center justify-center min-h-screen relative overflow-hidden"
//       style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e8ecff 50%, #f8f0ff 100%)' }}>
      
//       {/* Background decorations */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="login-bg-circle absolute w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #4f6ef7, transparent)', top: '-10%', right: '-10%' }} />
//         <div className="login-bg-circle absolute w-80 h-80 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #a78bfa, transparent)', bottom: '-10%', left: '-5%' }} />
//         <div className="login-bg-circle absolute w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #00c9b1, transparent)', top: '40%', left: '60%' }} />
//       </div>

//       <div ref={containerRef} className="relative z-10 w-full max-w-md mx-auto px-6">
//         {/* Back button */}
//         <button onClick={() => selectedRole ? setSelectedRole(null) : setActiveView('landing')}
//           className="flex items-center gap-2 mb-8 cursor-pointer transition-all hover:-translate-x-1"
//           style={{ color: '#4a5068', fontSize: 14, fontWeight: 500, background: 'none', border: 'none' }}>
//           <ArrowLeft size={16} /> Back
//         </button>

//         {/* Logo */}
//         <div className="flex items-center gap-3 mb-8">
//           <div className="w-12 h-12 rounded-xl flex items-center justify-center"
//             style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c5cff)', boxShadow: '0 4px 16px rgba(79,110,247,0.4)' }}>
//             <BookOpen size={22} color="white" />
//           </div>
//           <div>
//             <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24 }}>
//               Study<span style={{ color: '#4f6ef7' }}>OS</span>
//             </span>
//             <p style={{ fontSize: 12, color: '#8890aa' }}>Smart Study Planner</p>
//           </div>
//         </div>

//         {!selectedRole ? (
//           /* Role Selection */
//           <div>
//             <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28, color: '#0d0f1a', marginBottom: 8 }}>
//               Welcome! Who are you?
//             </h1>
//             <p style={{ fontSize: 15, color: '#4a5068', marginBottom: 32, lineHeight: 1.6 }}>
//               Choose your role to get a personalized experience
//             </p>

//             <div className="flex flex-col gap-4">
//               {/* Student Card */}
//               <button onClick={() => setSelectedRole('student')}
//                 className="flex items-center gap-5 p-6 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl text-left"
//                 style={{ background: 'white', border: '2px solid #e2e8f8', boxShadow: '0 4px 20px rgba(79,110,247,0.08)' }}>
//                 <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
//                   style={{ background: 'linear-gradient(135deg, #4f6ef7, #6c8fff)', boxShadow: '0 4px 16px rgba(79,110,247,0.3)' }}>
//                   <Users size={28} color="white" />
//                 </div>
//                 <div>
//                   <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: '#0d0f1a', marginBottom: 4 }}>
//                     Login as Student
//                   </h3>
//                   <p style={{ fontSize: 13, color: '#8890aa', lineHeight: 1.5 }}>
//                     Access your personalized study plan, track progress, and ace your exams
//                   </p>
//                 </div>
//                 <ArrowRight size={20} color="#4f6ef7" className="shrink-0" />
//               </button>

//               {/* Teacher Card */}
//               <button onClick={() => setSelectedRole('teacher')}
//                 className="flex items-center gap-5 p-6 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl text-left"
//                 style={{ background: 'white', border: '2px solid #e2e8f8', boxShadow: '0 4px 20px rgba(79,110,247,0.08)' }}>
//                 <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
//                   style={{ background: 'linear-gradient(135deg, #00c9b1, #00e6cc)', boxShadow: '0 4px 16px rgba(0,201,177,0.35)' }}>
//                   <GraduationCap size={28} color="white" />
//                 </div>
//                 <div>
//                   <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: '#0d0f1a', marginBottom: 4 }}>
//                     Login as Teacher
//                   </h3>
//                   <p style={{ fontSize: 13, color: '#8890aa', lineHeight: 1.5 }}>
//                     Set exam datesheets, configure chapter weightages, and manage subjects
//                   </p>
//                 </div>
//                 <ArrowRight size={20} color="#00c9b1" className="shrink-0" />
//               </button>
//             </div>
//           </div>
//         ) : (
//           /* Login Form */
//           <div ref={formRef}>
//             <div className="flex items-center gap-3 mb-6 form-header">
//               <div className="w-10 h-10 rounded-xl flex items-center justify-center"
//                 style={{ background: selectedRole === 'teacher' ? 'linear-gradient(135deg, #00c9b1, #00e6cc)' : 'linear-gradient(135deg, #4f6ef7, #6c8fff)' }}>
//                 {selectedRole === 'teacher' ? <GraduationCap size={18} color="white" /> : <Users size={18} color="white" />}
//               </div>
//               <div>
//                 <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24, color: '#0d0f1a' }}>
//                   {selectedRole === 'teacher' ? 'Teacher Login' : 'Student Login'}
//                 </h1>
//                 <p style={{ fontSize: 12, color: '#8890aa' }}>Enter your credentials to continue</p>
//               </div>
//             </div>

//             <div className="p-8 rounded-2xl" style={{ background: 'white', border: '1px solid #e2e8f8', boxShadow: '0 8px 40px rgba(79,110,247,0.08)' }}>
//               <div className="flex flex-col gap-5">
//                 {/* Email */}
//                 <div>
//                   <label style={{ fontSize: 13, fontWeight: 600, color: '#4a5068', marginBottom: 6, display: 'block' }}>Email</label>
//                   <div className="relative">
//                     <Mail size={16} color="#8890aa" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
//                     <input
//                       type="email" value={email} onChange={e => setEmail(e.target.value)}
//                       placeholder="you@school.edu"
//                       className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all focus:ring-2"
//                       style={{ background: '#f8f9ff', border: '1px solid #e2e8f8', fontSize: 14, color: '#0d0f1a' }}
//                     />
//                   </div>
//                 </div>

//                 {/* Password */}
//                 <div>
//                   <label style={{ fontSize: 13, fontWeight: 600, color: '#4a5068', marginBottom: 6, display: 'block' }}>Password</label>
//                   <div className="relative">
//                     <Lock size={16} color="#8890aa" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
//                     <input
//                       type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
//                       placeholder="Enter your password"
//                       className="w-full pl-10 pr-11 py-3 rounded-xl outline-none transition-all focus:ring-2"
//                       style={{ background: '#f8f9ff', border: '1px solid #e2e8f8', fontSize: 14, color: '#0d0f1a' }}
//                     />
//                     <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" style={{ background: 'none', border: 'none' }}>
//                       {showPassword ? <EyeOff size={16} color="#8890aa" /> : <Eye size={16} color="#8890aa" />}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Login Button */}
//                 <button onClick={handleLogin}
//                   className="w-full py-3.5 rounded-xl text-white cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
//                   style={{
//                     background: selectedRole === 'teacher'
//                       ? 'linear-gradient(135deg, #00c9b1, #00e6cc)'
//                       : 'linear-gradient(135deg, #4f6ef7, #7c5cff)',
//                     fontWeight: 600, fontSize: 15,
//                     boxShadow: selectedRole === 'teacher'
//                       ? '0 4px 20px rgba(0,201,177,0.35)'
//                       : '0 4px 20px rgba(79,110,247,0.35)',
//                   }}>
//                   Sign In <ArrowRight size={16} />
//                 </button>
//               </div>

//               <p className="text-center mt-5" style={{ fontSize: 13, color: '#8890aa' }}>
//                 Demo mode — enter any credentials
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useApp } from '../context/AppContext';
import { GraduationCap, Users, BookOpen, ArrowLeft, Mail, Lock, ArrowRight, Eye, EyeOff, School } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
            position: 'absolute',
            top: s.top, bottom: s.bottom, left: s.left, right: s.right,
            width: s.size, height: s.size,
            background: s.color,
            borderRadius: i % 2 === 0 ? 12 : '50%',
            transform: `rotate(${s.rotate}deg)`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
      {/* Grid dots top right */}
      <div style={{ position: 'absolute', top: 40, right: 40, opacity: 0.2, display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8 }}>
        {Array.from({ length: 36 }).map((_, i) => (
          <div key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: '#1a3fa3' }} />
        ))}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { setRole, setUserName } = useApp();
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo('.login-logo', { scale: 0, rotate: -30 }, { scale: 1, rotate: 0, duration: 0.7, ease: 'back.out(2)' });
    gsap.fromTo('.login-card', { opacity: 0, y: 50, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.4)', delay: 0.2 });
    gsap.fromTo('.role-card', { opacity: 0, x: -30 }, { opacity: 1, x: 0, stagger: 0.15, duration: 0.5, ease: 'power2.out', delay: 0.5 });

    // Continuous background pulse
    gsap.to('.bg-orb-1', { scale: 1.15, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.bg-orb-2', { scale: 1.1, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });
  }, []);

  useEffect(() => {
    if (selectedRole && formRef.current) {
      gsap.fromTo(formRef.current,
        { opacity: 0, x: 40, scale: 0.96 },
        { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: 'back.out(1.4)' }
      );
      gsap.fromTo('.form-field',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.4, ease: 'power2.out', delay: 0.2 }
      );
    }
  }, [selectedRole]);

  const handleLogin = () => {
    setIsLoading(true);
    gsap.to('.login-btn', { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1 });
    setTimeout(() => {
      setRole(selectedRole);
      setUserName(selectedRole === 'teacher' ? 'Teacher Sahab' : 'Arjun');
      setIsLoading(false);
      navigate(selectedRole === 'teacher' ? '/teacher' : '/onboarding');
    }, 900);
  };

  const goBack = () => {
    if (selectedRole) {
      gsap.to(formRef.current, { opacity: 0, x: -30, duration: 0.3, ease: 'power2.in', onComplete: () => setSelectedRole(null) });
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

      {/* Background orbs */}
      <div className="bg-orb-1" style={{ position: 'absolute', top: '-15%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,63,163,0.1) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div className="bg-orb-2" style={{ position: 'absolute', bottom: '-10%', left: '-8%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,160,32,0.08) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

      <div ref={containerRef} style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>
        {/* Back */}
        <button onClick={goBack} style={{
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24,
          color: '#4a5068', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer',
          transition: 'all 0.2s', padding: '6px 10px', borderRadius: 8,
        }}>
          <ArrowLeft size={15} /> Back
        </button>

        {/* Logo */}
        <div className="login-logo" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #1a3fa3, #3a5fd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 18px rgba(26,63,163,0.4)' }}>
            <School size={24} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: '#0d0f1a' }}>
              CRPS <span style={{ color: '#1a3fa3' }}>StudyOS</span>
            </div>
            <div style={{ fontSize: 11, color: '#8890aa' }}>Chhotu Ram Public School, Bakhtawarpur</div>
          </div>
        </div>

        <div className="login-card" style={{ background: 'white', borderRadius: 24, padding: 32, boxShadow: '0 24px 80px rgba(26,63,163,0.12)', border: '1px solid rgba(26,63,163,0.08)' }}>

          {!selectedRole ? (
            /* Role selection */
            <div>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24, color: '#0d0f1a', marginBottom: 6 }}>
                Welcome! 👋
              </h1>
              <p style={{ fontSize: 14, color: '#4a5068', marginBottom: 28, lineHeight: 1.6 }}>
                Select your role to get started
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <button className="role-card" onClick={() => setSelectedRole('student')} style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '20px 18px',
                  borderRadius: 16, cursor: 'pointer', textAlign: 'left', border: 'none',
                  background: 'linear-gradient(135deg, #f0f4ff, #e8edff)',
                  border: '2px solid rgba(26,63,163,0.1)',
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #1a3fa3, #3a5fd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 16px rgba(26,63,163,0.3)' }}>
                    <Users size={26} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#0d0f1a', marginBottom: 3 }}>Login as Student</div>
                    <div style={{ fontSize: 12, color: '#8890aa', lineHeight: 1.5 }}>Access your personalised study plan, track progress & PYQs</div>
                  </div>
                  <ArrowRight size={18} color="#1a3fa3" />
                </button>

                <button className="role-card" onClick={() => setSelectedRole('teacher')} style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '20px 18px',
                  borderRadius: 16, cursor: 'pointer', textAlign: 'left',
                  background: 'linear-gradient(135deg, #f0fffe, #e0faf8)',
                  border: '2px solid rgba(0,201,177,0.15)',
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #00c9b1, #00e6cc)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 16px rgba(0,201,177,0.35)' }}>
                    <GraduationCap size={26} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#0d0f1a', marginBottom: 3 }}>Login as Teacher</div>
                    <div style={{ fontSize: 12, color: '#8890aa', lineHeight: 1.5 }}>Set datesheets, manage chapters, upload PYQs & configure weights</div>
                  </div>
                  <ArrowRight size={18} color="#00c9b1" />
                </button>
              </div>

              <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#8890aa' }}>
                Demo mode · Enter any credentials
              </p>
            </div>
          ) : (
            /* Login form */
            <div ref={formRef}>
              <div className="form-field" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: selectedRole === 'teacher' ? 'linear-gradient(135deg, #00c9b1, #00e6cc)' : 'linear-gradient(135deg, #1a3fa3, #3a5fd4)',
                }}>
                  {selectedRole === 'teacher' ? <GraduationCap size={20} color="white" /> : <Users size={20} color="white" />}
                </div>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: '#0d0f1a' }}>
                    {selectedRole === 'teacher' ? 'Teacher Login' : 'Student Login'}
                  </div>
                  <div style={{ fontSize: 11, color: '#8890aa' }}>Enter your credentials to continue</div>
                </div>
              </div>

              {/* Email */}
              <div className="form-field" style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#4a5068', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} color="#8890aa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@crps.edu.in"
                    style={{
                      width: '100%', paddingLeft: 40, paddingRight: 14, paddingTop: 12, paddingBottom: 12,
                      borderRadius: 12, border: '1.5px solid #e2e8f8', background: '#f8f9ff',
                      fontSize: 14, color: '#0d0f1a', outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = '#1a3fa3'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f8'}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-field" style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#4a5068', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} color="#8890aa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{
                      width: '100%', paddingLeft: 40, paddingRight: 44, paddingTop: 12, paddingBottom: 12,
                      borderRadius: 12, border: '1.5px solid #e2e8f8', background: '#f8f9ff',
                      fontSize: 14, color: '#0d0f1a', outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = selectedRole === 'teacher' ? '#00c9b1' : '#1a3fa3'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f8'}
                  />
                  <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {showPassword ? <EyeOff size={15} color="#8890aa" /> : <Eye size={15} color="#8890aa" />}
                  </button>
                </div>
              </div>

              {/* Login button */}
              <button className="login-btn form-field" onClick={handleLogin} disabled={isLoading} style={{
                width: '100%', padding: '14px', borderRadius: 14, border: 'none',
                background: selectedRole === 'teacher'
                  ? 'linear-gradient(135deg, #00c9b1, #00e6cc)'
                  : 'linear-gradient(135deg, #1a3fa3, #3a5fd4)',
                color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: selectedRole === 'teacher' ? '0 6px 24px rgba(0,201,177,0.3)' : '0 6px 24px rgba(26,63,163,0.3)',
                transition: 'all 0.2s ease', opacity: isLoading ? 0.8 : 1,
              }}>
                {isLoading ? (
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2.5px solid white', borderTopColor: 'transparent', animation: 'rotateSpin 0.8s linear infinite' }} />
                ) : (
                  <><ArrowRight size={16} /> Sign In</>
                )}
              </button>

              <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#8890aa' }}>
                Demo mode · Any credentials work
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}