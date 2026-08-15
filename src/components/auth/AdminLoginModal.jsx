import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { Shield, KeyRound, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Badge } from '../common/Badge';

export const AdminLoginModal = () => {
  const { loginAdmin, setActiveRole } = useQuiz();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    try {
      const res = await loginAdmin(username, password);
      if (!res || !res.success) {
        setErrorMsg(res?.error || 'Invalid username or password. Please try again.');
      }
    } catch (err) {
      console.error('Admin login failed', err);
      setErrorMsg(err?.message || 'Login failed due to an unexpected error.');
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: '480px', paddingTop: '3rem', paddingBottom: '4rem' }}>
      <div className="glass-panel" style={{ padding: '2.5rem 2rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary), var(--accent-purple))', 
            width: '64px', 
            height: '64px', 
            borderRadius: '20px', 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)',
            marginBottom: '1rem'
          }}>
            <Shield size={34} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.65rem', marginBottom: '0.35rem' }}>Instructor Admin Portal</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Please log in with your administrative credentials to manage question banks.
          </p>
        </div>

        {errorMsg && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.15)', 
            border: '1px solid rgba(239, 68, 68, 0.4)', 
            borderRadius: 'var(--radius-md)', 
            padding: '0.75rem 1rem', 
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.25rem',
            fontSize: '0.875rem'
          }}>
            <AlertCircle size={18} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          
          <div className="input-group">
            <label className="input-label">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
              <input 
                type="text" 
                className="input-field" 
                style={{ paddingLeft: '2.4rem' }} 
                placeholder="Enter admin username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="input-field" 
                style={{ paddingLeft: '2.4rem', paddingRight: '2.5rem' }} 
                placeholder="Enter admin password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

                {/* Removed hardcoded default credentials for security. Use Admin Settings to change password. */}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            <KeyRound size={18} /> Log In as Instructor
          </button>

          <button 
            type="button" 
            onClick={() => setActiveRole('student')} 
            className="btn btn-secondary" 
            style={{ width: '100%', marginTop: '0.75rem' }}
          >
            Switch to Student Exam Mode
          </button>

        </form>

      </div>
    </div>
  );
};
