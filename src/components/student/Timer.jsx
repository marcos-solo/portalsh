import React, { useEffect } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { Clock, AlertTriangle } from 'lucide-react';

export const Timer = ({ onTimeExpired }) => {
  const { examSession, setExamSession } = useQuiz();

  useEffect(() => {
    if (!examSession || examSession.isSubmitted) return;

    const timerInterval = setInterval(() => {
      setExamSession((prev) => {
        if (!prev || prev.isSubmitted) return prev;

        if (prev.timeRemaining <= 1) {
          clearInterval(timerInterval);
          onTimeExpired();
          return {
            ...prev,
            timeRemaining: 0
          };
        }

        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        };
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [examSession?.isSubmitted, setExamSession, onTimeExpired]);

  if (!examSession) return null;

  const seconds = examSession.timeRemaining;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isWarning = seconds <= 120; // 2 minutes or less

  const formatPadded = (num) => String(num).padStart(2, '0');

  return (
    <div 
      className={`glass-panel ${isWarning ? 'timer-warning' : ''}`}
      style={{ 
        padding: '0.5rem 1.1rem', 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '0.65rem',
        borderRadius: '9999px',
        border: isWarning ? '1px solid #ef4444' : '1px solid var(--border-color)',
        transition: 'all 0.3s'
      }}
    >
      {isWarning ? (
        <AlertTriangle size={18} color="#ef4444" />
      ) : (
        <Clock size={18} color="var(--primary)" />
      )}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', color: isWarning ? '#ef4444' : 'var(--text-dim)', textTransform: 'uppercase' }}>
          Time Remaining
        </span>
        <span style={{ 
          fontFamily: 'var(--font-mono)', 
          fontWeight: 800, 
          fontSize: '1.1rem',
          color: isWarning ? '#ef4444' : '#fff'
        }}>
          {formatPadded(mins)}:{formatPadded(secs)}
        </span>
      </div>
    </div>
  );
};
