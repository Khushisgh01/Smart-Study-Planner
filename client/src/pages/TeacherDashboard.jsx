import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { teacherService } from '../services/teacherService';
import {
  GraduationCap, Plus, BookOpen, Trash2, Zap, Users,
  School, X, Check, Layers, RefreshCw, Award, ChevronRight,
  BarChart3, Calendar, Sparkles, AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// ── Class tab config ──────────────────────────────────────────────────────
const CLASS_TABS = [
  { num: '9',  label: 'Class IX',   color: '#1a3fa3', gradient: 'linear-gradient(135deg,#1a3fa3,#3a5fd4)', shadow: 'rgba(26,63,163,0.4)' },
  { num: '10', label: 'Class X',    color: '#00c9b1', gradient: 'linear-gradient(135deg,#00c9b1,#00e6cc)', shadow: 'rgba(0,201,177,0.4)' },
  { num: '11', label: 'Class XI',   color: '#ff2d78', gradient: 'linear-gradient(135deg,#ff2d78,#ff6ba0)', shadow: 'rgba(255,45,120,0.4)' },
  { num: '12', label: 'Class XII',  color: '#e8a020', gradient: 'linear-gradient(135deg,#e8a020,#f5c842)', shadow: 'rgba(232,160,32,0.4)' },
];

// ── Animated floating background ─────────────────────────────────────────
function FloatingBg({ activeColor }) {
  useEffect(() => {
    gsap.to('.td-float-blob', {
      y: () => `random(-60, 60)`,
      x: () => `random(-40, 40)`,
      scale: () => `random(0.9, 1.1)`,
      duration: () => `random(5, 9)`,
      repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.2,
    });
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {[...Array(12)].map((_, i) => (
        <div key={i} className="td-float-blob" style={{
          position: 'absolute',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 300 + 100}px`,
          height: `${Math.random() * 300 + 100}px`,
          background: `radial-gradient(circle, ${activeColor}08 0%, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(40px)',
        }} />
      ))}
    </div>
  );
}

// ── Create class modal ────────────────────────────────────────────────────
function CreateClassModal({ activeTab, onClose, onCreated }) {
  const [section, setSection] = useState('A');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const modalRef = useRef();
  const tab = CLASS_TABS.find(t => t.num === activeTab);

  useEffect(() => {
    gsap.fromTo(modalRef.current,
      { opacity: 0, scale: 0.8, y: 40, rotationX: 10 },
      { opacity: 1, scale: 1, y: 0, rotationX: 0, duration: 0.5, ease: 'back.out(1.7)', transformPerspective: 1000 }
    );
    gsap.fromTo('.modal-btn-section',
      { opacity: 0, scale: 0, y: 10 },
      { opacity: 1, scale: 1, y: 0, stagger: 0.06, duration: 0.4, ease: 'back.out(1.4)', delay: 0.3 }
    );
  }, []);

  const handleCreate = async () => {
    if (!section.trim()) return;
    setLoading(true);
    try {
      await teacherService.createClass({ name: activeTab, section: section.toUpperCase() });
      setSuccess(true);
      gsap.to(modalRef.current, { scale: 1.04, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.inOut' });
      setTimeout(() => {
        onCreated();
        gsap.to(modalRef.current, { opacity: 0, scale: 0.9, duration: 0.25, ease: 'power2.in', onComplete: onClose });
      }, 800);
    } catch (err) {
      alert(err.message || 'Failed to create class');
      setLoading(false);
    }
  };

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div ref={modalRef} style={{
        background: 'var(--bg-card)', borderRadius: 28, padding: '40px',
        width: '90%', maxWidth: 440,
        border: `1px solid ${tab?.color}30`,
        boxShadow: `0 32px 100px rgba(0,0,0,0.35), 0 0 0 1px ${tab?.color}15`,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Top gradient bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: tab?.gradient }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${tab?.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <School size={18} color={tab?.color} />
              </div>
              <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)' }}>
                Create {tab?.label}
              </h2>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', paddingLeft: 48 }}>
              Pick a section for this class
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Section picker */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>
            Select Section
          </label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['A', 'B', 'C', 'D'].map(s => (
              <button key={s} className="modal-btn-section" onClick={() => setSection(s)} style={{
                width: 54, height: 54, borderRadius: 14,
                background: section === s ? tab?.gradient : 'var(--bg-primary)',
                border: `2px solid ${section === s ? tab?.color : 'var(--border)'}`,
                color: section === s ? 'white' : 'var(--text-secondary)',
                fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                transform: section === s ? 'scale(1.12)' : 'scale(1)',
                boxShadow: section === s ? `0 6px 20px ${tab?.shadow}` : 'none',
              }}>
                {s}
              </button>
            ))}
            <input
              placeholder="Other"
              value={!['A','B','C','D'].includes(section) ? section : ''}
              onChange={e => setSection(e.target.value.toUpperCase().slice(0,2))}
              maxLength={2}
              style={{
                flex: 1, minWidth: 80, padding: '12px 16px', borderRadius: 14,
                border: `2px solid var(--border)`, background: 'var(--bg-primary)',
                color: 'var(--text-primary)', fontSize: 15, fontWeight: 700, outline: 'none',
                fontFamily: 'Syne,sans-serif', textAlign: 'center',
              }}
              onFocus={e => e.target.style.borderColor = tab?.color}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </div>

        {/* Preview */}
        <div style={{
          padding: '14px 18px', borderRadius: 14, marginBottom: 28,
          background: `${tab?.color}08`, border: `1px solid ${tab?.color}20`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: tab?.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <School size={16} color="white" />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              {tab?.label} — Section {section}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Add subjects & chapters after creating</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '13px', borderRadius: 14, border: '1px solid var(--border)',
            background: 'transparent', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', fontSize: 14,
          }}>
            Cancel
          </button>
          <button onClick={handleCreate} disabled={loading || success} style={{
            flex: 2, padding: '13px', borderRadius: 14, border: 'none',
            background: success ? 'linear-gradient(135deg,#00c9b1,#00e6cc)' : tab?.gradient,
            color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: `0 6px 24px ${tab?.shadow}`,
            transition: 'all 0.3s ease',
            opacity: loading ? 0.75 : 1,
          }}>
            {success ? (
              <><Check size={16} /> Created!</>
            ) : loading ? (
              <><RefreshCw size={14} style={{ animation: 'rotateSpin 1s linear infinite' }} /> Creating...</>
            ) : (
              <><Plus size={14} /> Create Class</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Individual class card ─────────────────────────────────────────────────
function ClassCard({ cls, tab, onAddSubject, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const cardRef = useRef();

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await teacherService.generateTasks(cls._id);
      setGenerated(true);
      gsap.fromTo(cardRef.current,
        { boxShadow: `0 0 0 0 ${tab.color}` },
        { boxShadow: `0 0 40px 8px ${tab.color}30, var(--shadow-card)`, duration: 0.4, yoyo: true, repeat: 2, ease: 'power2.inOut' }
      );
      setTimeout(() => setGenerated(false), 4000);
    } catch (err) {
      alert('Generate failed: ' + (err.message || 'Try again'));
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete Class ${cls.name}-${cls.section} and all its subjects?`)) return;
    setDeleting(true);
    gsap.to(cardRef.current, {
      scale: 0.85, opacity: 0, y: -20, duration: 0.35, ease: 'power2.in',
      onComplete: () => onDelete(cls._id),
    });
  };

  return (
    <div ref={cardRef}
      onMouseEnter={() => { setHovered(true); gsap.to(cardRef.current, { y: -6, duration: 0.35, ease: 'power2.out' }); }}
      onMouseLeave={() => { setHovered(false); gsap.to(cardRef.current, { y: 0, duration: 0.35, ease: 'power2.out' }); }}
      style={{
        background: 'var(--bg-card)', borderRadius: 22,
        border: `1px solid ${hovered ? tab.color + '50' : 'var(--border)'}`,
        padding: '0', overflow: 'hidden',
        boxShadow: hovered ? `0 16px 50px ${tab.color}20, var(--shadow-card)` : 'var(--shadow-card)',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        position: 'relative',
      }}>

      {/* Gradient header strip */}
      <div style={{
        background: tab.gradient, padding: '20px 22px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
            CRPS · {tab.label}
          </p>
          <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 22, color: 'white' }}>
            Section {cls.section}
          </h3>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
            {cls.subjects?.length || 0} subject{cls.subjects?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={handleDelete} disabled={deleting} style={{
          background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 10, padding: '7px 9px', color: 'white', cursor: 'pointer',
          backdropFilter: 'blur(8px)', transition: 'all 0.2s ease',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,45,120,0.5)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Subject list */}
      <div style={{ padding: '18px 22px' }}>
        {cls.subjects?.length > 0 ? (
          <div style={{ marginBottom: 16 }}>
            {cls.subjects.slice(0, 4).map((sub, i) => (
              <div key={sub._id || i} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
                borderBottom: i < Math.min(cls.subjects.length, 4) - 1 ? '1px solid var(--border)' : 'none',
                animation: `slideUp 0.3s ease ${i * 0.05}s both`,
              }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                  background: sub.color || tab.color,
                  boxShadow: `0 0 6px ${sub.color || tab.color}60`,
                }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', flex: 1 }}>{sub.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Layers size={11} color="var(--text-muted)" />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub.chapters?.length || 0}</span>
                </div>
              </div>
            ))}
            {cls.subjects.length > 4 && (
              <p style={{ fontSize: 11, color: 'var(--text-muted)', paddingTop: 8, fontWeight: 500 }}>
                +{cls.subjects.length - 4} more subjects
              </p>
            )}
          </div>
        ) : (
          <div style={{ padding: '20px 0', textAlign: 'center', marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${tab.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
              <BookOpen size={20} color={tab.color} />
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>No subjects yet</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Add the first subject below</p>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onAddSubject(cls._id)} style={{
            flex: 1, padding: '10px 12px', borderRadius: 12,
            background: `${tab.color}10`, border: `1px solid ${tab.color}25`,
            color: tab.color, fontWeight: 700, fontSize: 12, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'all 0.25s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = `${tab.color}20`; gsap.to(e.currentTarget, { scale: 1.03 }); }}
            onMouseLeave={e => { e.currentTarget.style.background = `${tab.color}10`; gsap.to(e.currentTarget, { scale: 1 }); }}
          >
            <Plus size={13} /> Add Subject
          </button>

          <button onClick={handleGenerate} disabled={generating || !cls.subjects?.length} style={{
            flex: 1, padding: '10px 12px', borderRadius: 12,
            background: generated ? 'rgba(0,201,177,0.1)' : 'rgba(232,160,32,0.08)',
            border: `1px solid ${generated ? 'rgba(0,201,177,0.3)' : 'rgba(232,160,32,0.2)'}`,
            color: generated ? '#00c9b1' : '#c9820a', fontWeight: 700, fontSize: 12, cursor: cls.subjects?.length ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            opacity: !cls.subjects?.length ? 0.45 : 1, transition: 'all 0.3s ease',
          }}>
            {generated ? <><Check size={12} /> Done!</>
              : generating ? <><RefreshCw size={12} style={{ animation: 'rotateSpin 0.8s linear infinite' }} /> Wait...</>
              : <><Zap size={12} /> Gen Tasks</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main TeacherDashboard component ───────────────────────────────────────
const TeacherDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [activeTab, setActiveTab] = useState('9');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userName } = useApp();
  const navigate = useNavigate();
  const headerRef = useRef();
  const tabsRef = useRef();

  const tab = CLASS_TABS.find(t => t.num === activeTab);
  const filteredClasses = classes.filter(c => c.name === activeTab);

  // Stats
  const totalClasses = classes.length;
  const totalSubjects = classes.reduce((a, c) => a + (c.subjects?.length || 0), 0);
  const totalChapters = classes.reduce((a, c) => a + (c.subjects?.reduce((b, s) => b + (s.chapters?.length || 0), 0) || 0), 0);

  // Entrance animation
  useEffect(() => {
    const kids = headerRef.current?.children;
    if (kids) {
      gsap.fromTo(kids, { opacity: 0, y: -24 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out' });
    }
    gsap.fromTo('.stat-chip-td', { opacity: 0, scale: 0, y: 20 }, { opacity: 1, scale: 1, y: 0, stagger: 0.08, duration: 0.55, ease: 'back.out(1.8)', delay: 0.35 });
    gsap.fromTo('.class-tab-btn', { opacity: 0, x: -24 }, { opacity: 1, x: 0, stagger: 0.06, duration: 0.5, ease: 'power2.out', delay: 0.55 });
  }, []);

  // Animate cards when tab or data changes
  useEffect(() => {
    gsap.fromTo('.class-grid-card',
      { opacity: 0, y: 28, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.09, duration: 0.5, ease: 'back.out(1.4)', delay: 0.05 }
    );
  }, [activeTab, classes]);

  const fetchClasses = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await teacherService.getClasses();
      setClasses(data);
    } catch (err) {
      setError('Could not load classes. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClasses(); }, []);

  const handleDelete = async (classId) => {
    try {
      await teacherService.deleteClass(classId);
      setClasses(prev => prev.filter(c => c._id !== classId));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-primary)', position: 'relative' }}>
      <FloatingBg activeColor={tab?.color || '#1a3fa3'} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 28px', position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div ref={headerRef} style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, marginBottom: 28 }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14,
                padding: '6px 16px', borderRadius: 50, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
                background: `${tab?.color}12`, border: `1px solid ${tab?.color}25`, color: tab?.color,
              }}>
                <GraduationCap size={13} />
                Teacher Dashboard · CRPS Bakhtawarpur
              </div>
              <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 34, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: 8 }}>
                Welcome back, <span style={{
                  background: tab?.gradient,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>{userName}!</span> 👨‍🏫
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · Manage your classes, subjects and tasks
              </p>
            </div>
            <button onClick={() => setShowModal(true)} style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '14px 26px', borderRadius: 16, border: 'none',
              background: tab?.gradient, color: 'white',
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
              boxShadow: `0 8px 28px ${tab?.shadow}`,
              transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            }}
              onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.06, y: -2 })}
              onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, y: 0 })}
            >
              <Plus size={17} /> Add {tab?.label} Section
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {[
              { label: 'Total Classes', value: totalClasses, icon: School, color: '#1a3fa3' },
              { label: 'Total Subjects', value: totalSubjects, icon: BookOpen, color: '#00c9b1' },
              { label: 'Total Chapters', value: totalChapters, icon: Layers, color: '#e8a020' },
              { label: 'Students', value: '500+', icon: Users, color: '#ff2d78' },
            ].map((s, i) => (
              <div key={i} className="stat-chip-td" style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 22px', borderRadius: 18,
                background: `${s.color}08`, border: `1px solid ${s.color}18`, minWidth: 160,
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={20} color={s.color} />
                </div>
                <div>
                  <p style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 22, color: 'var(--text-primary)', lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Class Tabs ── */}
        <div ref={tabsRef} style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
          {CLASS_TABS.map(t => (
            <button key={t.num} className="class-tab-btn" onClick={() => {
              setActiveTab(t.num);
              gsap.fromTo(`.tab-pill-${t.num}`, { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' });
            }} style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '12px 26px', borderRadius: 50,
              background: activeTab === t.num ? t.gradient : 'var(--bg-card)',
              color: activeTab === t.num ? 'white' : 'var(--text-secondary)',
              border: `2px solid ${activeTab === t.num ? t.color : 'var(--border)'}`,
              fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              boxShadow: activeTab === t.num ? `0 6px 22px ${t.shadow}` : 'var(--shadow-card)',
              transform: activeTab === t.num ? 'scale(1.04)' : 'scale(1)',
              transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            }}>
              <School size={15} />
              {t.label}
              <span className={`tab-pill-${t.num}`} style={{
                fontSize: 11, fontWeight: 800,
                background: activeTab === t.num ? 'rgba(255,255,255,0.22)' : `${t.color}14`,
                color: activeTab === t.num ? 'white' : t.color,
                padding: '2px 9px', borderRadius: 20, minWidth: 22, textAlign: 'center',
              }}>
                {classes.filter(c => c.name === t.num).length}
              </span>
            </button>
          ))}
        </div>

        {/* ── Context banner ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderRadius: 16, marginBottom: 28,
          background: `${tab?.color}06`, border: `1px solid ${tab?.color}18`,
          flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Award size={16} color={tab?.color} />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
              <strong style={{ color: tab?.color }}>{tab?.label}</strong> ·{' '}
              {filteredClasses.length === 0
                ? 'No sections created yet'
                : `${filteredClasses.length} section${filteredClasses.length !== 1 ? 's' : ''} · ${filteredClasses.reduce((a, c) => a + (c.subjects?.length || 0), 0)} subjects`}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={fetchClasses} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 12, fontWeight: 600, color: 'var(--text-muted)',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
            }}>
              <RefreshCw size={12} /> Refresh
            </button>
            {filteredClasses.length === 0 && (
              <button onClick={() => setShowModal(true)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 12, fontWeight: 700, color: tab?.color,
                background: `${tab?.color}10`, border: `1px solid ${tab?.color}25`,
                padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
              }}>
                <Plus size={12} /> Create First Section
              </button>
            )}
          </div>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div style={{
            padding: '14px 20px', borderRadius: 14, marginBottom: 24,
            background: 'rgba(255,45,120,0.08)', border: '1px solid rgba(255,45,120,0.2)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <AlertCircle size={16} color="#ff2d78" />
            <span style={{ fontSize: 13, color: '#ff2d78' }}>{error}</span>
          </div>
        )}

        {/* ── Class grid ── */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="shimmer-bar" style={{ height: 260, borderRadius: 22 }} />
            ))}
          </div>
        ) : filteredClasses.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '90px 40px',
            background: 'var(--bg-card)', borderRadius: 28,
            border: `2px dashed ${tab?.color}30`,
            animation: 'slideUp 0.5s ease both',
          }}>
            <div style={{
              width: 90, height: 90, borderRadius: 26, margin: '0 auto 22px',
              background: `${tab?.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <School size={40} color={tab?.color} />
            </div>
            <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 22, color: 'var(--text-primary)', marginBottom: 10 }}>
              No {tab?.label} sections yet
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28, maxWidth: 340, margin: '0 auto 28px' }}>
              Create your first {tab?.label} section to start adding subjects, chapters, and generating AI study tasks.
            </p>
            <button onClick={() => setShowModal(true)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 9,
              padding: '14px 30px', borderRadius: 16, border: 'none',
              background: tab?.gradient, color: 'white',
              fontWeight: 700, fontSize: 15, cursor: 'pointer',
              boxShadow: `0 8px 28px ${tab?.shadow}`,
            }}
              onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.05 })}
              onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1 })}
            >
              <Sparkles size={17} /> Create {tab?.label} Section
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {filteredClasses.map(cls => (
              <div key={cls._id} className="class-grid-card">
                <ClassCard
                  cls={cls}
                  tab={tab}
                  onAddSubject={classId => navigate(`/teacher/class/${classId}/add-subject`)}
                  onDelete={handleDelete}
                />
              </div>
            ))}

            {/* Add section card */}
            <button onClick={() => setShowModal(true)} style={{
              borderRadius: 22, border: `2px dashed ${tab?.color}35`,
              background: 'transparent', cursor: 'pointer', padding: '40px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14,
              minHeight: 200, transition: 'all 0.3s ease',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `${tab?.color}06`;
                e.currentTarget.style.borderColor = tab?.color;
                gsap.to(e.currentTarget, { scale: 1.02 });
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = `${tab?.color}35`;
                gsap.to(e.currentTarget, { scale: 1 });
              }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `${tab?.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={26} color={tab?.color} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>
                  Add Another Section
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Create {tab?.label} - Section B, C, D...</p>
              </div>
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <CreateClassModal
          activeTab={activeTab}
          onClose={() => setShowModal(false)}
          onCreated={() => { fetchClasses(); setShowModal(false); }}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;