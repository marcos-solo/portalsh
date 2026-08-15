import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { QuestionFormModal } from './QuestionFormModal';
import { QuizSettingsModal } from './QuizSettingsModal';
import { QuizEditorModal } from './QuizEditorModal';
import { ResultsTable } from './ResultsTable';
import { Badge } from '../common/Badge';
import { 
  Plus, 
  Shuffle, 
  Settings, 
  Trash2, 
  Edit3, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  BookOpen, 
  BarChart3,
  Layers,
  Sparkles
} from 'lucide-react';

export const TeacherDashboard = () => {
  const { 
    quizzes, 
    activeQuiz, 
    activeQuizId, 
    setActiveQuizId, 
    createQuiz, 
    updateQuizSettings, 
    deleteQuiz, 
    addQuestion, 
    updateQuestion, 
    deleteQuestion, 
    shuffleQuizMasterQuestions, 
    resultsHistory 
  } = useQuiz();

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCreateQuizModalOpen, setIsCreateQuizModalOpen] = useState(false);
  const [shuffleToast, setShuffleToast] = useState(false);

  // Stats calculation
  const totalQuizzes = quizzes.length;
  const totalQuestions = quizzes.reduce((acc, q) => acc + (q.questions?.length || 0), 0);
  const totalAttempts = resultsHistory.length;
  const passCount = resultsHistory.filter((r) => r.isPassed).length;
  const passRate = totalAttempts > 0 ? Math.round((passCount / totalAttempts) * 100) : 0;

  const handleOpenAddQuestion = () => {
    setEditingQuestion(null);
    setIsQuestionModalOpen(true);
  };

  const handleOpenEditQuestion = (q) => {
    setEditingQuestion(q);
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = (questionData) => {
    if (editingQuestion) {
      updateQuestion(activeQuiz.id, editingQuestion.id, questionData);
    } else {
      addQuestion(activeQuiz.id, questionData);
    }
  };

  const handleShuffleNow = () => {
    if (!activeQuiz) return;
    shuffleQuizMasterQuestions(activeQuiz.id);
    setShuffleToast(true);
    setTimeout(() => setShuffleToast(false), 2500);
  };

  return (
    <div className="app-container">
      
      {/* Top Header & Overview Banner */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Instructor Quiz Manager</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Create multiple choice questions, set exam timers, shuffle answer choices, and track student results.
            </p>
          </div>
          <button 
            onClick={() => setIsCreateQuizModalOpen(true)} 
            className="btn btn-primary btn-lg"
          >
            <Plus size={18} /> Create New Quiz Bank
          </button>
        </div>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid-stats">
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>TOTAL QUIZZES</span>
            <Layers size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem' }}>{totalQuizzes}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>TOTAL QUESTION BANK</span>
            <HelpCircle size={18} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem' }}>{totalQuestions}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>STUDENT ATTEMPTS</span>
            <BookOpen size={18} color="var(--accent-purple)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem' }}>{totalAttempts}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>AVG PASS RATE</span>
            <BarChart3 size={18} color="var(--success)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem', color: passRate >= 70 ? '#10b981' : '#f59e0b' }}>
            {passRate}%
          </div>
        </div>
      </div>

      {/* Active Quiz Selector & Toolbar */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ flex: 1, minWidth: '280px' }}>
            <label className="input-label" style={{ marginBottom: '0.35rem' }}>Select Active Quiz to Manage</label>
            <select 
              className="select-field"
              value={activeQuizId || ''} 
              onChange={(e) => setActiveQuizId(e.target.value)}
              style={{ fontSize: '1.05rem', fontWeight: 600 }}
            >
              {quizzes.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.title} ({q.questions?.length || 0} Questions • {q.timeLimitMinutes} min timer)
                </option>
              ))}
            </select>
          </div>

          {activeQuiz && (
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <button 
                onClick={handleShuffleNow} 
                className="btn btn-secondary" 
                title="Immediately shuffle master question order"
              >
                <Shuffle size={16} color="var(--accent-cyan)" /> Shuffle Questions Now
              </button>

              <button 
                onClick={() => setIsSettingsModalOpen(true)} 
                className="btn btn-secondary"
                title="Configure Timer and Shuffling Options"
              >
                <Settings size={16} /> Quiz Settings
              </button>

              {quizzes.length > 1 && (
                <button 
                  onClick={() => {
                    if (confirm(`Delete quiz "${activeQuiz.title}" and all its questions?`)) {
                      deleteQuiz(activeQuiz.id);
                    }
                  }} 
                  className="btn btn-secondary"
                  style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}
                  title="Delete Quiz"
                >
                  <Trash2 size={16} /> Delete
                </button>
              )}
            </div>
          )}

        </div>

        {/* Shuffle Alert Toast Banner */}
        {shuffleToast && (
          <div style={{ 
            marginTop: '1rem', 
            background: 'rgba(6, 182, 212, 0.15)', 
            border: '1px solid rgba(6, 182, 212, 0.4)', 
            borderRadius: 'var(--radius-md)', 
            padding: '0.65rem 1rem', 
            color: '#22d3ee',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}>
            <Sparkles size={16} /> Question bank sequence has been randomized!
          </div>
        )}

        {/* Active Quiz Meta Info */}
        {activeQuiz && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Badge variant="indigo">
              <Clock size={12} /> {activeQuiz.timeLimitMinutes} Mins Timer
            </Badge>
            <Badge variant="emerald">
              Pass Target: {activeQuiz.passPercentage}%
            </Badge>
            {activeQuiz.shuffleQuestions && (
              <Badge variant="cyan">Question Shuffling ON</Badge>
            )}
            {activeQuiz.shuffleOptions && (
              <Badge variant="cyan">Option Choices Shuffling ON</Badge>
            )}
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
              {activeQuiz.description}
            </span>
          </div>
        )}
      </div>

      {/* Questions Manager Section */}
      {activeQuiz && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Question List <Badge variant="indigo">{activeQuiz.questions?.length || 0}</Badge>
            </h3>
            <button onClick={handleOpenAddQuestion} className="btn btn-success">
              <Plus size={16} /> Add MCQ Question
            </button>
          </div>

          {(!activeQuiz.questions || activeQuiz.questions.length === 0) ? (
            <div className="glass-panel" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
              <HelpCircle size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
              <h3>No Questions in this Quiz Bank</h3>
              <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem 0' }}>
                Click the button below to add your first multiple choice question.
              </p>
              <button onClick={handleOpenAddQuestion} className="btn btn-primary">
                <Plus size={16} /> Add First Question
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeQuiz.questions.map((q, idx) => (
                <div key={q.id} className="glass-panel" style={{ padding: '1.25rem' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ 
                        background: 'rgba(99, 102, 241, 0.2)', 
                        color: '#818cf8', 
                        width: '28px', 
                        height: '28px', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}>
                        {idx + 1}
                      </span>
                      <Badge variant="cyan">{q.category || 'General'}</Badge>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleOpenEditQuestion(q)} 
                        className="btn btn-secondary btn-sm"
                        title="Edit question"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm("Delete this question?")) {
                            deleteQuestion(activeQuiz.id, q.id);
                          }
                        }} 
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#f87171' }}
                        title="Delete question"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    {q.question}
                  </h4>

                  {/* Optional CLI Code Snippet */}
                  {q.codeSnippet && (
                    <div className="cli-code-block">
                      {q.codeSnippet}
                    </div>
                  )}

                  {/* Options Grid */}
                  <div className="grid-2" style={{ marginTop: '0.85rem' }}>
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = oIdx === q.correctIndex;
                      return (
                        <div 
                          key={oIdx} 
                          style={{ 
                            padding: '0.6rem 0.85rem', 
                            borderRadius: 'var(--radius-md)', 
                            background: isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(0, 0, 0, 0.2)', 
                            border: isCorrect ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <span style={{ 
                            fontWeight: 700, 
                            color: isCorrect ? '#10b981' : 'var(--text-muted)',
                            width: '24px'
                          }}>
                            {String.fromCharCode(65 + oIdx)}.
                          </span>
                          <span style={{ color: isCorrect ? '#fff' : 'var(--text-muted)', flex: 1 }}>
                            {opt}
                          </span>
                          {isCorrect && (
                            <CheckCircle2 size={16} color="#10b981" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation text preview */}
                  {q.explanation && (
                    <div style={{ marginTop: '0.75rem', fontSize: '0.825rem', color: 'var(--text-muted)', fontStyle: 'italic', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Student Results Log Table */}
      <ResultsTable />

      {/* Modals */}
      <QuestionFormModal 
        isOpen={isQuestionModalOpen} 
        onClose={() => setIsQuestionModalOpen(false)} 
        onSubmit={handleSaveQuestion} 
        initialData={editingQuestion} 
      />

      <QuizSettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)} 
        quiz={activeQuiz} 
        onSave={updateQuizSettings} 
      />

      <QuizEditorModal 
        isOpen={isCreateQuizModalOpen} 
        onClose={() => setIsCreateQuizModalOpen(false)} 
        onCreate={createQuiz} 
      />

    </div>
  );
};
