import React from 'react';
import { useQuiz } from '../../context/QuizContext';
import { Shield, GraduationCap, Users, LogOut } from 'lucide-react';
import { Badge } from './Badge';

export const Header = () => {
  const { 
    activeRole, 
    setActiveRole, 
    isAdminLoggedIn,
    logoutAdmin,
    loggedInTrainer,
    logoutTrainer,
    loggedInStudent,
    logoutStudent,
    examSession
  } = useQuiz();

  // If in an active student exam, keep header simplified
  if (examSession && !examSession.isSubmitted) {
    return (
      <header className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 100, borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '0.85rem 1.5rem', marginBottom: '1.25rem', borderColor: 'rgba(139, 21, 38, 0.4)', backdropFilter: 'blur(16px)' }}>
        <div className="app-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent-crimson))', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap style={{ color: '#fff' }} size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', margin: 0, color: '#fff' }}>{examSession.quizTitle}</h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Student: <strong style={{ color: '#fff' }}>{examSession.studentName}</strong> ({examSession.studentId})
              </p>
            </div>
          </div>
          <Badge variant="indigo">Official IAT Exam Session</Badge>
        </div>
      </header>
    );
  }

  return (
    <header className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 100, borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '1rem 1.5rem', marginBottom: '1.5rem', backdropFilter: 'blur(16px)' }}>
      <div className="app-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: 0 }}>
        
        {/* IAT Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #67000d, #941123)', 
            width: '46px', 
            height: '46px', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>IAT</span>
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              Institute of Advanced Technology
              <Badge variant="cyan">Portal</Badge>
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Courses, Trainers, Students & Assessment Management
            </p>
          </div>
        </div>

        {/* Action Controls & Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          
          {/* Role Switcher Pill */}
          <div style={{ 
            background: 'rgba(0, 0, 0, 0.5)', 
            padding: '4px', 
            borderRadius: '12px', 
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <button
              onClick={() => setActiveRole('admin')}
              className={`btn btn-sm ${activeRole === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none' }}
            >
              <Shield size={14} /> Admin
            </button>
            <button
              onClick={() => setActiveRole('trainer')}
              className={`btn btn-sm ${activeRole === 'trainer' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none' }}
            >
              <Users size={14} /> Trainer
            </button>
            <button
              onClick={() => setActiveRole('student')}
              className={`btn btn-sm ${activeRole === 'student' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none' }}
            >
              <GraduationCap size={14} /> Student
            </button>
          </div>

          {/* Logout Actions */}
          {activeRole === 'admin' && isAdminLoggedIn && (
            <button 
              onClick={logoutAdmin}
              className="btn btn-secondary btn-sm"
              style={{ color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}
              title="Logout Admin"
            >
              <LogOut size={14} /> Logout Admin
            </button>
          )}

          {activeRole === 'trainer' && loggedInTrainer && (
            <button 
              onClick={logoutTrainer}
              className="btn btn-secondary btn-sm"
              style={{ color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}
              title="Logout Trainer"
            >
              <LogOut size={14} /> Logout
            </button>
          )}

          {activeRole === 'student' && loggedInStudent && (
            <button 
              onClick={logoutStudent}
              className="btn btn-secondary btn-sm"
              style={{ color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}
              title="Logout Student"
            >
              <LogOut size={14} /> Logout
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
