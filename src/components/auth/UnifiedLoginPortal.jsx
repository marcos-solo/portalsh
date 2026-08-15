import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { Shield, Users, GraduationCap, Lock, Mail, User, ArrowRight, AlertCircle } from 'lucide-react';

export const UnifiedLoginPortal = () => {
  const { 
    activeRole, 
    setActiveRole, 
    loginAdmin, 
    loginTrainer, 
    loginStudent
  } = useQuiz();

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleChange = (newRole) => {
    setActiveRole(newRole);
    setIdentifier('');
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('Please enter both identifier/email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (activeRole === 'admin') {
        const res = await loginAdmin(identifier.trim(), password);
        if (!res.success) {
          setError(res.error || 'Invalid admin credentials');
        }
      } else if (activeRole === 'trainer') {
        const res = loginTrainer(identifier.trim(), password);
        if (!res.success) {
          setError(res.error || 'Invalid trainer credentials');
        }
      } else if (activeRole === 'student') {
        const res = loginStudent(identifier.trim(), password);
        if (!res.success) {
          setError(res.error || 'Invalid student credentials');
        }
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '3rem auto' }} className="glass-panel">
      <div style={{ padding: '2.25rem 2rem' }}>
        
        {/* Portal Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #67000d, #941123)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            boxShadow: 'var(--shadow-glow)',
            border: '1px solid rgba(255,255,255,0.15)'
          }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.35rem', letterSpacing: '-0.5px' }}>IAT</span>
          </div>
          <h2 style={{ fontSize: '1.45rem', color: '#fff', marginBottom: '0.35rem' }}>IAT Assessment Portal</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Institute of Advanced Technology Authentication System
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div style={{ 
          background: 'rgba(0, 0, 0, 0.45)', 
          padding: '5px', 
          borderRadius: '12px', 
          border: '1px solid var(--border-color)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '4px',
          marginBottom: '1.5rem'
        }}>
          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`btn btn-sm ${activeRole === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none', padding: '0.55rem 0.25rem', fontSize: '0.825rem' }}
          >
            <Shield size={14} /> Admin
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('trainer')}
            className={`btn btn-sm ${activeRole === 'trainer' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none', padding: '0.55rem 0.25rem', fontSize: '0.825rem' }}
          >
            <Users size={14} /> Trainer
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('student')}
            className={`btn btn-sm ${activeRole === 'student' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none', padding: '0.55rem 0.25rem', fontSize: '0.825rem' }}
          >
            <GraduationCap size={14} /> Student
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.15)', 
            border: '1px solid rgba(239, 68, 68, 0.4)',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            color: '#f87171',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label className="input-label">
              {activeRole === 'admin' ? 'Admin Username' : activeRole === 'trainer' ? 'Trainer Email' : 'Student Roll ID or Email'}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={activeRole === 'trainer' ? 'email' : 'text'}
                className="input-field"
                placeholder={
                  activeRole === 'admin' ? 'Enter admin username' :
                  activeRole === 'trainer' ? 'Enter trainer email address' :
                  'Enter student ID or email address'
                }
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
              {activeRole === 'admin' ? (
                <User size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              ) : (
                <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              )}
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="input-field"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
              <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%', marginTop: '0.75rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Authenticating...' : `Log In as ${activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}`} <ArrowRight size={18} />
          </button>
        </form>

      </div>
    </div>
  );
};
