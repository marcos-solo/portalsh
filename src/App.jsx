import React from 'react';
import { QuizProvider, useQuiz } from './context/QuizContext';
import { Header } from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import AdminSettingsModal from './components/auth/AdminSettingsModal';
import { UnifiedLoginPortal } from './components/auth/UnifiedLoginPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TrainerDashboard } from './components/trainer/TrainerDashboard';
import { StudentStart } from './components/student/StudentStart';
import { ExamScreen } from './components/student/ExamScreen';
import { ExamResults } from './components/student/ExamResults';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2.5rem', maxWidth: '800px', margin: '2rem auto' }} className="glass-panel">
          <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Application Error Encountered</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>An error occurred while rendering the page component. Details below:</p>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#0a0607', color: '#ff8888', padding: '1.25rem', borderRadius: '8px', fontSize: '0.875rem', border: '1px solid rgba(239,68,68,0.3)' }}>
            {this.state.error && this.state.error.toString()}
            {'\n'}
            {this.state.info && this.state.info.componentStack}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
            style={{ marginTop: '1.5rem' }}
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainAppContent({ activeTab, setActiveTab }) {
  const { activeRole, isAdminLoggedIn, loggedInTrainer, loggedInStudent, examSession } = useQuiz();

  const isAuthenticated = 
    (activeRole === 'admin' && isAdminLoggedIn) ||
    (activeRole === 'trainer' && Boolean(loggedInTrainer)) ||
    (activeRole === 'student' && Boolean(loggedInStudent));

  if (!isAuthenticated) {
    return <UnifiedLoginPortal />;
  }

  // 1. Admin Role View
  if (activeRole === 'admin') {
    return <AdminDashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
  }

  // 2. Trainer Role View
  if (activeRole === 'trainer') {
    return <TrainerDashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
  }

  // 3. Student Role View
  if (examSession) {
    if (examSession.isSubmitted) {
      return <ExamResults />;
    }
    return <ExamScreen />;
  }

  return <StudentStart activeTab={activeTab} setActiveTab={setActiveTab} />;
}

function AppContent() {
  const { activeRole, isAdminLoggedIn, loggedInTrainer, loggedInStudent } = useQuiz();
  const [showAdminSettings, setShowAdminSettings] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('courses');

  React.useEffect(() => {
    if (activeRole === 'admin' && !['courses', 'trainers', 'students', 'quizzes', 'results', 'settings'].includes(activeTab)) {
      setActiveTab('courses');
    } else if (activeRole === 'trainer' && !['my-courses', 'course-exams', 'results'].includes(activeTab)) {
      setActiveTab('my-courses');
    } else if (activeRole === 'student' && !['student-exams', 'my-results', 'active-exam'].includes(activeTab)) {
      setActiveTab('student-exams');
    }
  }, [activeRole]);

  const showSidebar = React.useMemo(() => {
    if (activeRole === 'admin' && !isAdminLoggedIn) return false;
    if (activeRole === 'trainer' && !loggedInTrainer) return false;
    if (activeRole === 'student' && !loggedInStudent) return false;
    return true;
  }, [activeRole, isAdminLoggedIn, loggedInTrainer, loggedInStudent]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, alignItems: 'stretch' }}>
        {showSidebar && (
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onOpenAdminSettings={() => setShowAdminSettings(true)} 
          />
        )}
        <main style={{ flex: 1, padding: '1.25rem' }}>
          <MainAppContent activeTab={activeTab} setActiveTab={setActiveTab} />
        </main>
      </div>
      <AdminSettingsModal isOpen={showAdminSettings} onClose={() => setShowAdminSettings(false)} />
    </div>
  );
}

export default function App() {
  return (
    <QuizProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </QuizProvider>
  );
}
