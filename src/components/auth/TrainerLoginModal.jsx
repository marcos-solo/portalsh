import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { Users, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

export const TrainerLoginModal = () => {
  const { loginTrainer } = useQuiz();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    const res = loginTrainer(email, password);
    if (!res.success) {
      setError(res.error || 'Invalid credentials');
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '3rem auto' }} className="glass-panel">
      <div style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ 
            width: '54px', 
            height: '54px', 
            borderRadius: '14px', 
            background: 'linear-gradient(135deg, var(--primary), var(--accent-crimson))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Users size={28} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.35rem' }}>Trainer Portal Login</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Log in to manage your assigned courses and set course exams.
          </p>
        </div>

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

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Trainer Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="input-field"
                placeholder="Enter trainer email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
              <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
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

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.5rem' }}>
            Log In as Trainer <ArrowRight size={18} />
          </button>
        </form>

      </div>
    </div>
  );
};
