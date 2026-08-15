import React from 'react';
import { Shield, GraduationCap, FileText, Settings, BookOpen, Users, UserCheck, BarChart3, Award } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const Sidebar = ({ activeTab, setActiveTab, onOpenAdminSettings }) => {
  const { activeRole, isAdminLoggedIn, loggedInTrainer, loggedInStudent, examSession } = useQuiz();

  const getNavItemStyle = (tabKey) => {
    const isActive = activeTab === tabKey;
    return {
      padding: '0.75rem 1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      cursor: 'pointer',
      borderRadius: '10px',
      fontSize: '0.875rem',
      fontWeight: isActive ? '700' : '500',
      color: isActive ? '#ffffff' : 'var(--text-muted)',
      background: isActive ? 'linear-gradient(135deg, var(--primary), var(--accent-crimson))' : 'transparent',
      boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
      transition: 'all 0.15s ease-in-out',
      marginBottom: '0.35rem'
    };
  };

  return (
    <aside style={{ 
      width: '240px', 
      minWidth: '200px', 
      background: 'rgba(15, 7, 9, 0.88)', 
      padding: '1.25rem 1rem', 
      borderRight: '1px solid var(--border-color)', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'sticky',
      top: '72px',
      height: 'calc(100vh - 72px)',
      alignSelf: 'flex-start',
      overflowY: 'auto',
      backdropFilter: 'blur(12px)',
      zIndex: 90
    }}>
      
      {/* Header Info */}
      <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, background: 'linear-gradient(135deg, var(--primary), var(--accent-crimson))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>
          IAT
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
            {activeRole === 'admin' ? 'Admin Portal' : activeRole === 'trainer' ? 'Trainer Portal' : 'Student Portal'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
            {activeRole === 'admin' ? (isAdminLoggedIn ? 'Logged in as Admin' : 'Admin Area') :
             activeRole === 'trainer' ? (loggedInTrainer ? loggedInTrainer.name : 'Trainer') :
             (loggedInStudent ? loggedInStudent.name : 'Student Area')}
          </div>
        </div>
      </div>

      {/* Role Navigation Links */}
      <nav style={{ flex: 1 }}>
        {activeRole === 'admin' && (
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
              Management Menu
            </div>
            <div style={getNavItemStyle('courses')} onClick={() => setActiveTab('courses')}>
              <BookOpen size={17} /> Courses
            </div>
            <div style={getNavItemStyle('trainers')} onClick={() => setActiveTab('trainers')}>
              <Users size={17} /> Trainers
            </div>
            <div style={getNavItemStyle('students')} onClick={() => setActiveTab('students')}>
              <UserCheck size={17} /> Students
            </div>
            <div style={getNavItemStyle('quizzes')} onClick={() => setActiveTab('quizzes')}>
              <FileText size={17} /> Course Exams
            </div>
            <div style={getNavItemStyle('results')} onClick={() => setActiveTab('results')}>
              <BarChart3 size={17} /> Submissions
            </div>
            <div style={{ ...getNavItemStyle('settings'), marginTop: '1rem' }} onClick={onOpenAdminSettings}>
              <Settings size={17} /> Security Settings
            </div>
          </div>
        )}

        {activeRole === 'trainer' && (
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
              Trainer Dashboard
            </div>
            <div style={getNavItemStyle('my-courses')} onClick={() => setActiveTab('my-courses')}>
              <BookOpen size={17} /> Assigned Courses
            </div>
            <div style={getNavItemStyle('course-exams')} onClick={() => setActiveTab('course-exams')}>
              <FileText size={17} /> Course Exams
            </div>
            <div style={getNavItemStyle('results')} onClick={() => setActiveTab('results')}>
              <BarChart3 size={17} /> Student Results
            </div>
          </div>
        )}

        {activeRole === 'student' && (
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
              Student Learning
            </div>
            <div style={getNavItemStyle('student-exams')} onClick={() => setActiveTab('student-exams')}>
              <GraduationCap size={17} /> Available Exams
            </div>
            {examSession && (
              <div style={getNavItemStyle('active-exam')} onClick={() => setActiveTab('active-exam')}>
                <FileText size={17} /> Active Exam
              </div>
            )}
            <div style={getNavItemStyle('my-results')} onClick={() => setActiveTab('my-results')}>
              <Award size={17} /> Exam History
            </div>
          </div>
        )}
      </nav>

      {/* Footer hint */}
      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center' }}>
        IAT CCNA System v2.0
      </div>
    </aside>
  );
};

export default Sidebar;
