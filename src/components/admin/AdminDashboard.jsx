import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { BookOpen, Users, UserCheck, FileText, Plus, Trash2, Edit, Check, X, Shield, BarChart3, Shuffle } from 'lucide-react';
import { Badge } from '../common/Badge';
import { ResultsTable } from '../teacher/ResultsTable';
import { QuestionFormModal } from '../teacher/QuestionFormModal';
import { QuizSettingsModal } from '../teacher/QuizSettingsModal';

export const AdminDashboard = ({ activeTab, setActiveTab }) => {
  const {
    courses, createCourse, updateCourse, deleteCourse,
    trainers, createTrainer, updateTrainer, deleteTrainer, assignCoursesToTrainer,
    students, createStudent, updateStudent, deleteStudent, assignCoursesToStudent,
    quizzes, activeQuiz, activeQuizId, setActiveQuizId, createQuiz, deleteQuiz,
    addQuestion, updateQuestion, deleteQuestion, shuffleQuizMasterQuestions,
    resultsHistory, clearResults
  } = useQuiz();

  // Modals and form states
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseForm, setCourseForm] = useState({ code: '', title: '', description: '' });

  const [showAddTrainer, setShowAddTrainer] = useState(false);
  const [trainerForm, setTrainerForm] = useState({ name: '', email: '', password: '', assignedCourseIds: [] });

  const [showAddStudent, setShowAddStudent] = useState(false);
  const [studentForm, setStudentForm] = useState({ name: '', email: '', rollNumber: '', password: '', assignedCourseIds: [] });

  const [showCreateExam, setShowCreateExam] = useState(false);
  const [examForm, setExamForm] = useState({ courseId: courses[0]?.id || '', title: '', description: '', timeLimitMinutes: 15, passPercentage: 70 });

  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Selected Filter Course for Exams
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');

  // --- Handlers ---
  const handleCreateCourseSubmit = (e) => {
    e.preventDefault();
    if (!courseForm.title || !courseForm.code) {
      alert('Course Code and Title are required!');
      return;
    }
    createCourse(courseForm);
    setCourseForm({ code: '', title: '', description: '' });
    setShowAddCourse(false);
  };

  const handleCreateTrainerSubmit = (e) => {
    e.preventDefault();
    if (!trainerForm.name || !trainerForm.email) {
      alert('Trainer Name and Email are required!');
      return;
    }
    createTrainer(trainerForm);
    setTrainerForm({ name: '', email: '', password: '', assignedCourseIds: [] });
    setShowAddTrainer(false);
  };

  const handleCreateStudentSubmit = (e) => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.rollNumber) {
      alert('Student Name and Roll Number are required!');
      return;
    }
    createStudent(studentForm);
    setStudentForm({ name: '', email: '', rollNumber: '', password: '', assignedCourseIds: [] });
    setShowAddStudent(false);
  };

  const handleCreateExamSubmit = (e) => {
    e.preventDefault();
    if (!examForm.title) {
      alert('Exam Title is required!');
      return;
    }
    createQuiz(examForm);
    setExamForm({ courseId: courses[0]?.id || '', title: '', description: '', timeLimitMinutes: 15, passPercentage: 70 });
    setShowCreateExam(false);
  };

  const toggleCourseInList = (courseId, currentList, setList) => {
    if (currentList.includes(courseId)) {
      setList(currentList.filter(id => id !== courseId));
    } else {
      setList([...currentList, courseId]);
    }
  };

  // Filtered Quizzes
  const filteredQuizzes = quizzes.filter(q => selectedCourseFilter === 'all' || q.courseId === selectedCourseFilter);

  return (
    <div className="app-container" style={{ padding: 0 }}>
      
      {/* Overview Cards Bar */}
      <div className="grid-stats" style={{ marginBottom: '1.75rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <BookOpen size={16} style={{ color: '#ff7085' }} /> Total Courses
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem' }}>{courses.length}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Users size={16} style={{ color: '#ff94a5' }} /> Active Trainers
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem' }}>{trainers.length}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <UserCheck size={16} style={{ color: '#34d399' }} /> Enrolled Students
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem' }}>{students.length}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileText size={16} style={{ color: '#fbbf24' }} /> Total Course Exams
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem' }}>{quizzes.length}</div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. COURSES TAB */}
      {/* ---------------------------------------------------- */}
      {(activeTab === 'courses' || activeTab === 'dashboard') && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen style={{ color: '#ff7085' }} size={22} /> Course Management
              </h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>Create academic courses and assign them to trainers and students.</p>
            </div>
            <button onClick={() => setShowAddCourse(true)} className="btn btn-primary btn-sm">
              <Plus size={16} /> Create Course
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {courses.map((course) => {
              const courseExamsCount = quizzes.filter(q => q.courseId === course.id).length;
              const assignedTrainers = trainers.filter(t => (t.assignedCourseIds || []).includes(course.id));
              const assignedStudents = students.filter(s => (s.assignedCourseIds || []).includes(course.id));

              return (
                <div key={course.id} className="glass-panel" style={{ padding: '1.25rem', border: '1px solid var(--border-color)', background: 'rgba(20, 9, 13, 0.6)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <Badge variant="cyan">{course.code}</Badge>
                      <h3 style={{ fontSize: '1.05rem', marginTop: '0.4rem', color: '#fff' }}>{course.title}</h3>
                    </div>
                    <button 
                      onClick={() => { if(confirm(`Delete course ${course.title}?`)) deleteCourse(course.id); }}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#f87171', padding: '0.3rem' }}
                      title="Delete Course"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', minHeight: '38px' }}>
                    {course.description || 'No description provided.'}
                  </p>

                  <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.775rem', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span>Exams: <strong style={{ color: '#fff' }}>{courseExamsCount}</strong></span>
                    <span>Trainers: <strong style={{ color: '#fff' }}>{assignedTrainers.length}</strong></span>
                    <span>Students: <strong style={{ color: '#fff' }}>{assignedStudents.length}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. TRAINERS TAB */}
      {/* ---------------------------------------------------- */}
      {(activeTab === 'trainers' || activeTab === 'dashboard') && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users style={{ color: '#ff94a5' }} size={22} /> Trainer Management
              </h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>Register trainers and assign courses they can manage and set exams for.</p>
            </div>
            <button onClick={() => setShowAddTrainer(true)} className="btn btn-primary btn-sm">
              <Plus size={16} /> Add Trainer
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-dim)' }}>
                  <th style={{ padding: '0.75rem' }}>Trainer Name</th>
                  <th style={{ padding: '0.75rem' }}>Email</th>
                  <th style={{ padding: '0.75rem' }}>Assigned Courses</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trainers.map((trainer) => {
                  const assignedCourseObjs = courses.filter(c => (trainer.assignedCourseIds || []).includes(c.id));
                  return (
                    <tr key={trainer.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600, color: '#fff' }}>{trainer.name}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{trainer.email}</td>
                      <td style={{ padding: '0.75rem' }}>
                        {assignedCourseObjs.length > 0 ? (
                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            {assignedCourseObjs.map(c => (
                              <Badge key={c.id} variant="indigo">{c.code}</Badge>
                            ))}
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>None assigned</span>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            if(confirm(`Delete trainer ${trainer.name}?`)) deleteTrainer(trainer.id);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#f87171' }}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. STUDENTS TAB */}
      {/* ---------------------------------------------------- */}
      {(activeTab === 'students' || activeTab === 'dashboard') && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserCheck style={{ color: '#34d399' }} size={22} /> Student Enrollment
              </h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>Create students and assign them courses to allow them to take exams.</p>
            </div>
            <button onClick={() => setShowAddStudent(true)} className="btn btn-primary btn-sm">
              <Plus size={16} /> Register Student
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-dim)' }}>
                  <th style={{ padding: '0.75rem' }}>Student ID</th>
                  <th style={{ padding: '0.75rem' }}>Student Name</th>
                  <th style={{ padding: '0.75rem' }}>Email</th>
                  <th style={{ padding: '0.75rem' }}>Enrolled Courses</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const enrolledCourses = courses.filter(c => (student.assignedCourseIds || []).includes(c.id));
                  return (
                    <tr key={student.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--primary-glow)' }}>
                        <Badge variant="cyan">{student.rollNumber}</Badge>
                      </td>
                      <td style={{ padding: '0.75rem', fontWeight: 600, color: '#fff' }}>{student.name}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{student.email}</td>
                      <td style={{ padding: '0.75rem' }}>
                        {enrolledCourses.length > 0 ? (
                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            {enrolledCourses.map(c => (
                              <Badge key={c.id} variant="emerald">{c.code}</Badge>
                            ))}
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>None enrolled</span>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            if(confirm(`Delete student ${student.name}?`)) deleteStudent(student.id);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#f87171' }}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. EXAMS / QUIZZES TAB */}
      {/* ---------------------------------------------------- */}
      {(activeTab === 'quizzes' || activeTab === 'dashboard') && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText style={{ color: '#fbbf24' }} size={22} /> Course Exams & Question Bank
              </h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>Set exams linked to specific courses, customize questions, and configure pass criteria.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <select
                className="select-field"
                style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
                value={selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
              >
                <option value="all">All Courses</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                ))}
              </select>

              <button onClick={() => setShowCreateExam(true)} className="btn btn-primary btn-sm">
                <Plus size={16} /> Set New Exam
              </button>
            </div>
          </div>

          {/* List of Exams */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {filteredQuizzes.map((quiz) => {
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
                    <Badge variant="indigo">{parentCourse ? parentCourse.code : 'General'}</Badge>
                    <button
                      onClick={(e) => { e.stopPropagation(); if (confirm(`Delete exam ${quiz.title}?`)) deleteQuiz(quiz.id); }}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#f87171', padding: '0.25rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.35rem' }}>{quiz.title}</h3>
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

          {/* Active Selected Quiz Details & Questions */}
          {activeQuiz && (
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: 0 }}>
                    Questions for: <span style={{ color: '#ff7085' }}>{activeQuiz.title}</span>
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{activeQuiz.questions.length} Questions configured</span>
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
                  <div key={q.id || idx} className="glass-panel" style={{ padding: '1rem', background: 'rgba(15, 7, 9, 0.4)', borderRadius: '10px' }}>
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
      {/* 5. RESULTS TAB */}
      {/* ---------------------------------------------------- */}
      {(activeTab === 'results' || activeTab === 'dashboard') && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BarChart3 style={{ color: '#34d399' }} size={22} /> All Student Results & Analytics
              </h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>Review student score history, pass/fail status, and exam statistics.</p>
            </div>
          </div>
          <ResultsTable results={resultsHistory} />
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODALS */}
      {/* ---------------------------------------------------- */}
      {/* Create Course Modal */}
      {showAddCourse && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#fff' }}>Create New Course</h3>
            <form onSubmit={handleCreateCourseSubmit}>
              <div className="input-group">
                <label className="input-label">Course Code</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. CCNA-200-301"
                  value={courseForm.code}
                  onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">Course Title</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. CCNA Cisco Certified Network Associate"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea
                  className="textarea-field"
                  placeholder="Course outline and scope..."
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowAddCourse(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Trainer Modal */}
      {showAddTrainer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#fff' }}>Register New Trainer</h3>
            <form onSubmit={handleCreateTrainerSubmit}>
              <div className="input-group">
                <label className="input-label">Trainer Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. John Doe"
                  value={trainerForm.name}
                  onChange={(e) => setTrainerForm({ ...trainerForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">Trainer Email</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="e.g. trainer@iat.ac.ke"
                  value={trainerForm.email}
                  onChange={(e) => setTrainerForm({ ...trainerForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">Password</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Enter login password"
                  value={trainerForm.password}
                  onChange={(e) => setTrainerForm({ ...trainerForm, password: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">Assign Courses</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px' }}>
                  {courses.map((c) => (
                    <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                      <input
                        type="checkbox"
                        checked={trainerForm.assignedCourseIds.includes(c.id)}
                        onChange={() => toggleCourseInList(c.id, trainerForm.assignedCourseIds, (newList) => setTrainerForm({ ...trainerForm, assignedCourseIds: newList }))}
                      />
                      <span><strong>{c.code}</strong> - {c.title}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowAddTrainer(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Trainer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Student Modal */}
      {showAddStudent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#fff' }}>Register New Student</h3>
            <form onSubmit={handleCreateStudentSubmit}>
              <div className="input-group">
                <label className="input-label">Student Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Alex Johnson"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">Student Roll / ID</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. STU-1001"
                  value={studentForm.rollNumber}
                  onChange={(e) => setStudentForm({ ...studentForm, rollNumber: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">Email Address *</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="e.g. alex@student.iat.ac.ke"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">Student Login Password *</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Set student login password (default: student123)"
                  value={studentForm.password}
                  onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">Enroll in Courses</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px' }}>
                  {courses.map((c) => (
                    <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                      <input
                        type="checkbox"
                        checked={studentForm.assignedCourseIds.includes(c.id)}
                        onChange={() => toggleCourseInList(c.id, studentForm.assignedCourseIds, (newList) => setStudentForm({ ...studentForm, assignedCourseIds: newList }))}
                      />
                      <span><strong>{c.code}</strong> - {c.title}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowAddStudent(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Enroll Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Exam Modal */}
      {showCreateExam && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#fff' }}>Set New Course Exam</h3>
            <form onSubmit={handleCreateExamSubmit}>
              <div className="input-group">
                <label className="input-label">Select Course</label>
                <select
                  className="select-field"
                  value={examForm.courseId}
                  onChange={(e) => setExamForm({ ...examForm, courseId: e.target.value })}
                  required
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Exam Title</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Midterm Network Fundamentals Exam"
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea
                  className="textarea-field"
                  placeholder="Instructions for students..."
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
                  <label className="input-label">Pass Threshold (%)</label>
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
