import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { GraduationCap, Clock, HelpCircle, Shuffle, ShieldCheck, PlayCircle, UserCheck, Award, History, CheckCircle2, XCircle, BookOpen, AlertTriangle } from 'lucide-react';
import { Badge } from '../common/Badge';

function getOrdinalText(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]) + " Attempt";
}

export const StudentStart = ({ activeTab = 'student-exams', setActiveTab }) => {
  const { quizzes, courses, loggedInStudent, activeQuizId, setActiveQuizId, startExam, resultsHistory } = useQuiz();
  
  const studentName = loggedInStudent ? loggedInStudent.name : '';
  const studentId = loggedInStudent ? loggedInStudent.rollNumber : '';
  const enrolledCourseIds = loggedInStudent?.assignedCourseIds || [];

  // STRICT ENROLLMENT FILTER: Only list quizzes belonging to courses explicitly assigned to this student
  const availableQuizzes = quizzes.filter(q => enrolledCourseIds.includes(q.courseId));

  const selectedQuiz = availableQuizzes.find((q) => q.id === activeQuizId) || availableQuizzes[0] || null;

  // Filter past attempt history for this student
  const studentResults = resultsHistory.filter((res) => {
    if (!loggedInStudent) return false;
    return (
      res.studentId === loggedInStudent.rollNumber ||
      res.studentName === loggedInStudent.name ||
      res.studentId === loggedInStudent.id
    );
  });

  // Get attempts for the currently selected quiz
  const quizAttempts = selectedQuiz ? studentResults.filter(r => r.quizId === selectedQuiz.id) : [];
  const currentAttemptNumber = quizAttempts.length + 1;
  const ordinalLabel = getOrdinalText(currentAttemptNumber);

  const handleBeginExam = async (e) => {
    e.preventDefault();
    if (!loggedInStudent) {
      alert("Please log in with your student credentials first.");
      return;
    }

    if (!selectedQuiz) {
      alert("No valid exam selected.");
      return;
    }

    if (!selectedQuiz.questions || selectedQuiz.questions.length === 0) {
      alert("The selected quiz has no questions available.");
      return;
    }

    const ok = await startExam(selectedQuiz.id, studentName, studentId);
    if (!ok) return;
  };

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="app-container" style={{ maxWidth: '820px', paddingTop: '1rem', paddingBottom: '3rem' }}>
      
      {/* Student Profile Header Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(122, 12, 26, 0.35), rgba(26, 13, 17, 0.85))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), var(--accent-crimson))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={28} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', margin: 0, color: '#fff' }}>
                Welcome, <span style={{ color: '#ff7085' }}>{studentName || 'Student'}</span>
              </h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                Student ID: <strong style={{ color: '#fff' }}>{studentId}</strong> | Enrolled Courses: <strong style={{ color: '#fff' }}>{enrolledCourseIds.length}</strong>
              </p>
            </div>
          </div>
          
          {/* Sub-navigation tabs */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTab && setActiveTab('student-exams')}
              className={`btn btn-sm ${activeTab === 'student-exams' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <BookOpen size={14} /> Available Exams ({availableQuizzes.length})
            </button>
            <button
              onClick={() => setActiveTab && setActiveTab('my-results')}
              className={`btn btn-sm ${activeTab === 'my-results' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <History size={14} /> Exam History ({studentResults.length})
            </button>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. EXAM HISTORY TAB */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'my-results' ? (
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award style={{ color: '#34d399' }} size={22} /> My Personal Exam History
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                Complete record of your past exam attempts and scores.
              </p>
            </div>
            <button onClick={() => setActiveTab && setActiveTab('student-exams')} className="btn btn-primary btn-sm">
              Take an Exam
            </button>
          </div>

          {studentResults.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', color: 'var(--text-muted)' }}>
              <p>You haven't completed any exam attempts yet.</p>
              <button onClick={() => setActiveTab && setActiveTab('student-exams')} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                View Available Exams
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-dim)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem' }}>Attempt #</th>
                    <th style={{ padding: '0.75rem' }}>Exam Title</th>
                    <th style={{ padding: '0.75rem' }}>Score</th>
                    <th style={{ padding: '0.75rem' }}>Percentage</th>
                    <th style={{ padding: '0.75rem' }}>Result</th>
                    <th style={{ padding: '0.75rem' }}>Time Spent</th>
                    <th style={{ padding: '0.75rem' }}>Submitted Date</th>
                  </tr>
                </thead>
                <tbody>
                  {studentResults.map((res, idx) => {
                    const prevAttemptsOfSameQuiz = studentResults.filter(r => r.quizId === res.quizId && new Date(r.submittedAt) <= new Date(res.submittedAt));
                    const attemptNum = prevAttemptsOfSameQuiz.length;

                    return (
                      <tr key={res.id || idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.75rem' }}>
                          <Badge variant="indigo">{getOrdinalText(attemptNum)}</Badge>
                        </td>
                        <td style={{ padding: '0.75rem', fontWeight: 600, color: '#fff' }}>{res.quizTitle}</td>
                        <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{res.score} / {res.totalQuestions}</td>
                        <td style={{ padding: '0.75rem', fontWeight: 700, color: res.isPassed ? '#34d399' : '#f87171' }}>
                          {res.scorePercentage}%
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          {res.isPassed ? (
                            <Badge variant="emerald"><CheckCircle2 size={12} /> PASSED</Badge>
                          ) : (
                            <Badge variant="rose"><XCircle size={12} /> FAILED</Badge>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{formatTime(res.timeTakenSeconds)}</td>
                        <td style={{ padding: '0.75rem', color: 'var(--text-dim)', fontSize: '0.8rem' }}>{formatDate(res.submittedAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* ---------------------------------------------------- */
        /* 2. AVAILABLE EXAMS TAB (STRICTLY ASSIGNED COURSES ONLY) */
        /* ---------------------------------------------------- */
        <div className="glass-panel" style={{ padding: '2rem 1.75rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.35rem', color: '#fff' }}>Available Course Exams</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Exams available strictly for your assigned/enrolled courses.
            </p>
          </div>

          {availableQuizzes.length === 0 ? (
            <div style={{ 
              padding: '2.5rem', 
              textAlign: 'center', 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.3)', 
              borderRadius: '12px',
              color: '#f87171' 
            }}>
              <AlertTriangle size={36} style={{ marginBottom: '0.75rem', color: '#ef4444' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#fff' }}>No Enrolled Course Exams Available</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}>
                You are currently not assigned to any courses with active exams. Please contact your Administrator or Trainer to enroll you in your required courses.
              </p>
            </div>
          ) : (
            <form onSubmit={handleBeginExam}>
              
              {/* Select Exam Dropdown */}
              <div className="input-group">
                <label className="input-label">Select Assigned Course Exam *</label>
                <select 
                  className="select-field" 
                  value={selectedQuiz?.id || ''} 
                  onChange={(e) => setActiveQuizId(e.target.value)}
                  style={{ fontSize: '1rem', fontWeight: 600 }}
                >
                  {availableQuizzes.map((q) => {
                    const parentCourse = courses.find(c => c.id === q.courseId);
                    const qAttempts = studentResults.filter(r => r.quizId === q.id);
                    const attemptTag = qAttempts.length > 0 ? ` [${qAttempts.length} Previous Attempt(s)]` : ' [First Attempt]';
                    return (
                      <option key={q.id} value={q.id}>
                        [{parentCourse ? parentCourse.code : 'ASSIGNED'}] {q.title} ({q.questions?.length || 0} Qs){attemptTag}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Quiz Details & Attempt Banner Summary Box */}
              {selectedQuiz && (
                <div style={{ 
                  background: 'rgba(15, 7, 9, 0.6)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: '1.35rem', 
                  margin: '1.5rem 0' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <Badge variant="indigo">
                        {courses.find(c => c.id === selectedQuiz.courseId)?.code || 'Assigned Course'}
                      </Badge>
                      
                      {/* ATTEMPT NUMBER BADGE */}
                      <Badge variant={quizAttempts.length > 0 ? "cyan" : "emerald"}>
                        🎯 {ordinalLabel}
                      </Badge>
                    </div>

                    <span style={{ fontSize: '0.8rem', color: '#ff7085', fontWeight: 600 }}>IAT Certified Assessment</span>
                  </div>

                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem', color: '#fff' }}>
                    {selectedQuiz.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    {selectedQuiz.description || 'Answer all multiple choice questions within the allocated timer.'}
                  </p>

                  {/* Attempt Notice Banner if re-taking */}
                  {quizAttempts.length > 0 && (
                    <div style={{ 
                      background: 'rgba(122, 12, 26, 0.25)', 
                      border: '1px solid rgba(168, 28, 46, 0.4)', 
                      borderRadius: '8px', 
                      padding: '0.65rem 0.85rem', 
                      marginBottom: '1rem',
                      fontSize: '0.825rem',
                      color: '#ff9aa8',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>ℹ️ You have completed <strong>{quizAttempts.length}</strong> previous attempt(s) for this exam.</span>
                      <span>Best Score: <strong>{Math.max(...quizAttempts.map(a => a.scorePercentage))}%</strong></span>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <Badge variant="indigo">
                      <Clock size={13} /> {selectedQuiz.timeLimitMinutes} Mins Allocated
                    </Badge>
                    <Badge variant="cyan">
                      <HelpCircle size={13} /> {selectedQuiz.questions?.length || 0} Questions
                    </Badge>
                    <Badge variant="emerald">
                      <ShieldCheck size={13} /> Pass Target: {selectedQuiz.passPercentage}%
                    </Badge>
                    {selectedQuiz.shuffleQuestions && (
                      <Badge variant="amber">
                        <Shuffle size={13} /> Randomized Order
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Notice */}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center', marginBottom: '1.5rem' }}>
                ⏱️ Timer starts immediately upon clicking Begin Exam. Answers auto-submit when time expires.
              </p>

              {/* Begin Button with Attempt Ordinal label */}
              <button 
                type="submit" 
                className="btn btn-primary btn-lg" 
                style={{ width: '100%' }}
              >
                <PlayCircle size={20} /> Begin Timed Exam ({ordinalLabel})
              </button>

            </form>
          )}

        </div>
      )}

    </div>
  );
};
