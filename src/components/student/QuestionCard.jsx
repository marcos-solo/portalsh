import React from 'react';
import { useQuiz } from '../../context/QuizContext';
import { Badge } from '../common/Badge';
import { Flag, CheckCircle2 } from 'lucide-react';

export const QuestionCard = () => {
  const { examSession, selectAnswer, toggleFlagQuestion } = useQuiz();

  if (!examSession) return null;

  const { questions, currentIndex, answers, flagged } = examSession;
  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  const selectedOption = answers[currentIndex];
  const isFlagged = Boolean(flagged[currentIndex]);

  return (
    <div className="glass-panel" style={{ padding: '1.75rem' }}>
      
      {/* Question Header Meta */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ 
            background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))', 
            color: '#fff', 
            fontSize: '0.9rem', 
            fontWeight: 800,
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px'
          }}>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <Badge variant="cyan">{currentQ.category || 'General'}</Badge>
        </div>

        <button 
          onClick={() => toggleFlagQuestion(currentIndex)}
          className={`btn btn-sm ${isFlagged ? 'btn-amber' : 'btn-secondary'}`}
          title="Flag question to review later before submitting"
        >
          <Flag size={14} fill={isFlagged ? '#fff' : 'none'} />
          {isFlagged ? 'Flagged for Review' : 'Flag Question'}
        </button>
      </div>

      {/* Question Prompt */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem', lineHeight: '1.45' }}>
        {currentQ.question}
      </h3>

      {/* CLI / Code Snippet */}
      {currentQ.codeSnippet && (
        <div className="cli-code-block">
          {currentQ.codeSnippet}
        </div>
      )}

      {/* Option Choices */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1.5rem' }}>
        {currentQ.options.map((optText, oIdx) => {
          const isSelected = selectedOption === oIdx;
          const letter = String.fromCharCode(65 + oIdx);

          return (
            <div 
              key={oIdx}
              onClick={() => selectAnswer(currentIndex, oIdx)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.85rem', 
                padding: '1rem 1.25rem', 
                borderRadius: 'var(--radius-md)', 
                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)', 
                background: isSelected ? 'rgba(99, 102, 241, 0.18)' : 'rgba(0, 0, 0, 0.25)', 
                cursor: 'pointer',
                transition: 'all 0.18s ease-in-out',
                boxShadow: isSelected ? '0 0 15px rgba(99, 102, 241, 0.2)' : 'none'
              }}
            >
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.08)', 
                color: isSelected ? '#fff' : 'var(--text-muted)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.9rem',
                flexShrink: 0
              }}>
                {letter}
              </div>

              <span style={{ 
                fontSize: '0.975rem', 
                color: isSelected ? '#fff' : 'var(--text-main)', 
                fontWeight: isSelected ? 600 : 400,
                flex: 1 
              }}>
                {optText}
              </span>

              {isSelected && (
                <CheckCircle2 size={20} color="var(--primary)" />
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
