import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { BookOpen, FileText, Plus, Trash2, Edit, Shuffle, BarChart3, Users } from 'lucide-react';
import { Badge } from '../common/Badge';
import { ResultsTable } from '../teacher/ResultsTable';
import { QuestionFormModal } from '../teacher/QuestionFormModal';
import { QuizSettingsModal } from '../teacher/QuizSettingsModal';

export const TrainerDashboard = ({ activeTab, setActiveTab }) => {
  const {
    loggedInTrainer,
    courses,
    quizzes,
    activeQuiz,
    activeQuizId,
    setActiveQuizId,
    createQuiz,
    deleteQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    shuffleQuizMasterQuestions,
    updateQuizSettings,
    resultsHistory
  } = useQuiz();

  const [showCreateExam, setShowCreateExam] = useState(false);
  const [examForm, setExamForm] = useState({ courseId: '', title: '', description: '', timeLimitMinutes: 15, passPercentage: 70 });

  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Get courses assigned to this trainer
  const assignedCourseIds = loggedInTrainer?.assignedCourseIds || [];
  const assignedCourses = courses.filter(c => assignedCourseIds.includes(c.id));

  // Get quizzes for trainer's assigned courses
  const trainerQuizzes = quizzes.filter(q => assignedCourseIds.includes(q.courseId));

  const handleCreateExamSubmit = (e) => {
    e.preventDefault();
    if (!examForm.title || !examForm.courseId) {
      alert('Please select an assigned course and enter an exam title!');
      return;
    }
    createQuiz(examForm);
    setExamForm({ courseId: '', title: '', description: '', timeLimitMinutes: 15, passPercentage: 70 });
    setShowCreateExam(false);
  };

  return (
    <div className="app-container" style={{ padding: 0 }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.75rem', background: 'linear-gradient(135deg, rgba(122, 12, 26, 0.4), rgba(26, 13, 17, 0.8))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', color: '#fff', margin: 0 }}>
              Welcome, <span style={{ color: '#ff7085' }}>{loggedInTrainer?.name || 'Trainer'}</span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              You have access to <strong style={{ color: '#fff' }}>{assignedCourses.length} assigned course(s)</strong> and can create & manage exams.
            </p>
          </div>
          <button 
            onClick={() => {
              if (assignedCourses.length === 0) {
                alert('No courses have been assigned to you by the Admin yet.');
                return;
              }
              setExamForm(prev => ({ ...prev, courseId: assignedCourses[0]?.id || '' }));
              setShowCreateExam(true);
            }} 
            className="btn btn-primary"
          >
            <Plus size={16} /> Set Course Exam
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. ASSIGNED COURSES */}
      {/* ---------------------------------------------------- */}
      {(activeTab === 'my-courses' || activeTab === 'dashboard') && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen style={{ color: '#ff7085' }} size={20} /> My Assigned Courses
          </h3>

          {assignedCourses.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No courses assigned yet. Please request your Administrator to assign courses to your account.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {assignedCourses.map((c) => {
                const count = quizzes.filter(q => q.courseId === c.id).length;
                return (
                  <div key={c.id} className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(20, 9, 13, 0.6)' }}>
                    <Badge variant="cyan">{c.code}</Badge>
                    <h4 style={{ fontSize: '1.05rem', marginTop: '0.4rem', color: '#fff' }}>{c.title}</h4>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.5rem 0 1rem 0' }}>{c.description}</p>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                      Active Exams: <strong style={{ color: '#fff' }}>{count}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. COURSE EXAMS */}
      {/* ---------------------------------------------------- */}
      {(activeTab === 'course-exams' || activeTab === 'dashboard') && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText style={{ color: '#fbbf24' }} size={20} /> Course Exams & Questions
            </h3>
            <button 
              onClick={() => {
                if (assignedCourses.length === 0) {
                  alert('No courses assigned to you!');
                  return;
                }
                setExamForm(prev => ({ ...prev, courseId: assignedCourses[0]?.id || '' }));
                setShowCreateExam(true);
              }}
              className="btn btn-primary btn-sm"
            >
              <Plus size={15} /> Set Exam
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {trainerQuizzes.map((quiz) => {
              const parentCourse = courses.find(c => c.id === quiz.courseId);
              const isSelected = activeQuizId === quiz.id;

              return (
                <div
                  key={quiz.id}
                  onClick={() => setActiveQuizId(quiz.id)}
                  className="glass-panel"
                  style={{
                    padding: '1.25rem',
                    cursor: 'pointer',
                    borderColor: isSelected ? 'var(--border-active)' : 'var(--border-color)',
                    background: isSelected ? 'rgba(122, 12, 26, 0.25)' : 'rgba(20, 9, 13, 0.6)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <Badge variant="indigo">{parentCourse ? parentCourse.code : 'Course Exam'}</Badge>
                    <button
                      onClick={(e) => { e.stopPropagation(); if (confirm(`Delete exam ${quiz.title}?`)) deleteQuiz(quiz.id); }}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#f87171', padding: '0.25rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.35rem' }}>{quiz.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>{quiz.description}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', color: 'var(--text-dim)' }}>
                    <span>Questions: <strong style={{ color: '#fff' }}>{quiz.questions.length}</strong></span>
                    <span>Time: <strong style={{ color: '#fff' }}>{quiz.timeLimitMinutes}m</strong></span>
                    <span>Pass: <strong style={{ color: '#fff' }}>{quiz.passPercentage}%</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Quiz Questions */}
          {activeQuiz && assignedCourseIds.includes(activeQuiz.courseId) && (
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: '#fff', margin: 0 }}>
                    Questions for: <span style={{ color: '#ff7085' }}>{activeQuiz.title}</span>
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{activeQuiz.questions.length} Questions</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => shuffleQuizMasterQuestions(activeQuiz.id)} className="btn btn-secondary btn-sm">
                    <Shuffle size={14} /> Instant Shuffle
                  </button>
                  <button onClick={() => setShowSettingsModal(true)} className="btn btn-secondary btn-sm">
                    <Edit size={14} /> Exam Settings
                  </button>
                  <button onClick={() => { setEditingQuestion(null); setShowQuestionModal(true); }} className="btn btn-primary btn-sm">
                    <Plus size={14} /> Add Question
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {activeQuiz.questions.map((q, idx) => (
                  <div key={q.id || idx} className="glass-panel" style={{ padding: '1rem', background: 'rgba(15, 7, 9, 0.4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.75rem', color: '#ff7085', fontWeight: 700 }}>Q{idx + 1}. {q.category || 'General'}</span>
                        <div style={{ fontSize: '0.925rem', fontWeight: 600, color: '#fff', marginTop: '0.2rem' }}>{q.question}</div>
                        {q.codeSnippet && (
                          <pre className="cli-code-block" style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>{q.codeSnippet}</pre>
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.4rem', marginTop: '0.5rem' }}>
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              style={{
                                fontSize: '0.825rem',
                                padding: '0.35rem 0.65rem',
                                borderRadius: '6px',
                                background: oIdx === q.correctIndex ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
                                border: oIdx === q.correctIndex ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255,255,255,0.05)',
                                color: oIdx === q.correctIndex ? '#34d399' : 'var(--text-muted)'
                              }}
                            >
                              {String.fromCharCode(65 + oIdx)}. {opt} {oIdx === q.correctIndex && '✓'}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.35rem', marginLeft: '1rem' }}>
                        <button
                          onClick={() => { setEditingQuestion(q); setShowQuestionModal(true); }}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem' }}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => deleteQuestion(activeQuiz.id, q.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#f87171', padding: '0.3rem' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. STUDENT RESULTS */}
      {/* ---------------------------------------------------- */}
      {(activeTab === 'results' || activeTab === 'dashboard') && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 style={{ color: '#34d399' }} size={20} /> Student Submission Results
          </h3>
          <ResultsTable results={resultsHistory} />
        </div>
      )}

      {/* Set Exam Modal */}
      {showCreateExam && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#fff' }}>Set New Course Exam</h3>
            <form onSubmit={handleCreateExamSubmit}>
              <div className="input-group">
                <label className="input-label">Select Assigned Course</label>
                <select
                  className="select-field"
                  value={examForm.courseId}
                  onChange={(e) => setExamForm({ ...examForm, courseId: e.target.value })}
                  required
                >
                  {assignedCourses.map(c => (
                    <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Exam Title</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Midterm CCNA Exam"
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea
                  className="textarea-field"
                  placeholder="Exam instructions..."
                  value={examForm.description}
                  onChange={(e) => setExamForm({ ...examForm, description: e.target.value })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Time Limit (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    className="input-field"
                    value={examForm.timeLimitMinutes}
                    onChange={(e) => setExamForm({ ...examForm, timeLimitMinutes: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Pass Percentage (%)</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    className="input-field"
                    value={examForm.passPercentage}
                    onChange={(e) => setExamForm({ ...examForm, passPercentage: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowCreateExam(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Exam</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Question Modal */}
      {showQuestionModal && activeQuiz && (
        <QuestionFormModal
          isOpen={showQuestionModal}
          onClose={() => { setShowQuestionModal(false); setEditingQuestion(null); }}
          quizId={activeQuiz.id}
          editingQuestion={editingQuestion}
          onSave={(data) => {
            if (editingQuestion) {
              updateQuestion(activeQuiz.id, editingQuestion.id, data);
            } else {
              addQuestion(activeQuiz.id, data);
            }
            setShowQuestionModal(false);
            setEditingQuestion(null);
          }}
        />
      )}

      {/* Quiz Settings Modal */}
      {showSettingsModal && activeQuiz && (
        <QuizSettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          quiz={activeQuiz}
          onSave={(arg1, arg2) => {
            const settingsData = typeof arg1 === 'object' ? arg1 : arg2;
            updateQuizSettings(activeQuiz.id, settingsData);
            setShowSettingsModal(false);
          }}
        />
      )}

    </div>
  );
};
