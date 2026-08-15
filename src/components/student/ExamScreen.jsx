import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { Timer } from './Timer';
import { QuestionCard } from './QuestionCard';
import { Modal } from '../common/Modal';
import { ArrowLeft, ArrowRight, CheckCircle2, Flag, Send, AlertCircle } from 'lucide-react';

export const ExamScreen = () => {
  const { 
    examSession, 
    setCurrentQuestionIndex, 
    submitExam, 
    exitExamSession 
  } = useQuiz();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  if (!examSession) return null;

  const { questions, currentIndex, answers, flagged } = examSession;
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;
  const unansweredCount = totalQuestions - answeredCount;

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentQuestionIndex(currentIndex - 1);
    }
  };

  const handleConfirmSubmit = () => {
    setIsSubmitModalOpen(false);
    submitExam();
  };

  return (
    <div className="app-container" style={{ paddingBottom: '4rem' }}>
      
      {/* Top Exam Workspace Bar */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '0.85rem 1.5rem', 
          marginBottom: '1.5rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1rem' 
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{examSession.quizTitle}</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Progress: <strong style={{ color: '#fff' }}>{answeredCount}</strong> of {totalQuestions} answered
          </p>
        </div>

        {/* Live Timer */}
        <Timer onTimeExpired={() => submitExam()} />

        {/* Submit Exam Button */}
        <button 
          onClick={() => setIsSubmitModalOpen(true)} 
          className="btn btn-success"
        >
          <Send size={16} /> Submit Exam
        </button>
      </div>

      {/* Main Grid: Question Content & Navigator Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '1.5rem' }}>
        
        {/* Left Column: Active Question Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <QuestionCard />

          {/* Bottom Next / Prev Controls */}
          <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              onClick={handlePrev} 
              disabled={currentIndex === 0} 
              className="btn btn-secondary"
              style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
            >
              <ArrowLeft size={16} /> Previous Question
            </button>

            {currentIndex < totalQuestions - 1 ? (
              <button onClick={handleNext} className="btn btn-primary">
                Next Question <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={() => setIsSubmitModalOpen(true)} className="btn btn-success">
                Finish & Submit <Send size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Question Navigator Sidebar */}
        <div className="glass-panel" style={{ padding: '1.25rem', height: 'fit-content' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Question Palette
          </h4>

          {/* Question Number Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
            {questions.map((_, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnswered = answers[idx] !== undefined;
              const isFlag = Boolean(flagged[idx]);

              let bg = 'rgba(0,0,0,0.3)';
              let borderColor = 'var(--border-color)';
              let color = 'var(--text-muted)';

              if (isAnswered) {
                bg = 'rgba(99, 102, 241, 0.25)';
                borderColor = 'var(--primary)';
                color = '#fff';
              }

              if (isCurrent) {
                borderColor = '#38bdf8';
                bg = 'rgba(56, 189, 248, 0.2)';
              }

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  style={{
                    height: '42px',
                    borderRadius: 'var(--radius-md)',
                    background: bg,
                    border: isCurrent ? '2px solid #38bdf8' : `1px solid ${borderColor}`,
                    color,
                    fontWeight: isCurrent || isAnswered ? 700 : 400,
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    transition: 'all 0.15s'
                  }}
                  title={`Question ${idx + 1} ${isAnswered ? '(Answered)' : '(Unanswered)'}`}
                >
                  {idx + 1}
                  {isFlag && (
                    <span style={{ 
                      position: 'absolute', 
                      top: '-3px', 
                      right: '-3px', 
                      width: '10px', 
                      height: '10px', 
                      borderRadius: '50%', 
                      background: '#f59e0b',
                      border: '1px solid #000'
                    }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(99, 102, 241, 0.5)' }} />
              Answered ({answeredCount})
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)' }} />
              Unanswered ({unansweredCount})
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
              Flagged for Review ({flaggedCount})
            </div>
          </div>

          {/* Quit exam button */}
          <button 
            onClick={() => {
              if (confirm("Quit exam session? Your current progress will be lost.")) {
                exitExamSession();
              }
            }} 
            className="btn btn-secondary btn-sm" 
            style={{ width: '100%', marginTop: '1.25rem' }}
          >
            Cancel & Exit Exam
          </button>

        </div>

      </div>

      {/* Confirmation Modal */}
      <Modal 
        isOpen={isSubmitModalOpen} 
        onClose={() => setIsSubmitModalOpen(false)} 
        title="Submit Exam Confirmation"
      >
        <div style={{ padding: '0.5rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
            <AlertCircle size={28} color="var(--warning)" />
            <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Are you ready to submit your assessment?</h4>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
            <p>• Total Questions: <strong>{totalQuestions}</strong></p>
            <p>• Answered Questions: <strong style={{ color: '#10b981' }}>{answeredCount}</strong></p>
            <p>• Unanswered Questions: <strong style={{ color: unansweredCount > 0 ? '#ef4444' : '#10b981' }}>{unansweredCount}</strong></p>
            {flaggedCount > 0 && (
              <p style={{ color: '#f59e0b' }}>• Flagged for review: <strong>{flaggedCount}</strong></p>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button onClick={() => setIsSubmitModalOpen(false)} className="btn btn-secondary">
              Continue Test
            </button>
            <button onClick={handleConfirmSubmit} className="btn btn-success">
              <CheckCircle2 size={16} /> Yes, Submit Final Exam
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
