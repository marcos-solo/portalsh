import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_QUIZZES } from '../data/sampleQuizzes';
import { prepareExamQuestions } from '../utils/shuffle';

const QuizContext = createContext();

const QUIZZES_STORAGE_KEY = 'iat_quizzes_v2';
const RESULTS_STORAGE_KEY = 'iat_exam_results_v2';
const ROLE_STORAGE_KEY = 'iat_user_role_v2';
const ADMIN_AUTH_KEY = 'iat_admin_auth_v2';
const COURSES_STORAGE_KEY = 'iat_courses_v2';
const TRAINERS_STORAGE_KEY = 'iat_trainers_v2';
const STUDENTS_STORAGE_KEY = 'iat_students_v2';
const LOGGED_TRAINER_KEY = 'iat_logged_trainer_v2';
const LOGGED_STUDENT_KEY = 'iat_logged_student_v2';

// Default initial courses
const INITIAL_COURSES = [
  {
    id: 'course_1',
    code: 'CCNA-200-301',
    title: 'CCNA Cisco Certified Network Associate',
    description: 'Network Fundamentals, IP Connectivity, Security & Automation.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'course_2',
    code: 'CYBER-101',
    title: 'Cybersecurity & Network Defense',
    description: 'Ethical Hacking, Network Defense & Security Operations.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'course_3',
    code: 'IT-ESS-102',
    title: 'IT Essentials & Hardware Systems',
    description: 'Computer Hardware, Operating Systems & Troubleshooting.',
    createdAt: new Date().toISOString()
  }
];

// Default initial trainers
const INITIAL_TRAINERS = [
  {
    id: 'trainer_1',
    name: 'John Doe (Trainer)',
    email: 'trainer@iat.ac.ke',
    password: 'password123',
    assignedCourseIds: ['course_1', 'course_2'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'trainer_2',
    name: 'Jane Smith (Trainer)',
    email: 'jane@iat.ac.ke',
    password: 'password123',
    assignedCourseIds: ['course_3'],
    createdAt: new Date().toISOString()
  }
];

// Default initial students
const INITIAL_STUDENTS = [
  {
    id: 'student_1',
    name: 'Alex Johnson',
    email: 'alex@student.iat.ac.ke',
    rollNumber: 'STU-1001',
    password: 'student123',
    assignedCourseIds: ['course_1', 'course_2'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'student_2',
    name: 'Sarah Lee',
    email: 'sarah@student.iat.ac.ke',
    rollNumber: 'STU-1002',
    password: 'student123',
    assignedCourseIds: ['course_1', 'course_3'],
    createdAt: new Date().toISOString()
  }
];

export const QuizProvider = ({ children }) => {
  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true' || Boolean(localStorage.getItem('ccna_admin_token'));
  });

  const [adminToken, setAdminToken] = useState(() => {
    return localStorage.getItem('ccna_admin_token') || null;
  });

  // Active Role: 'admin' | 'trainer' | 'student'
  const [activeRole, setActiveRole] = useState(() => {
    return localStorage.getItem(ROLE_STORAGE_KEY) || 'admin';
  });

  // Courses state
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem(COURSES_STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_COURSES;
  });

  // Trainers state
  const [trainers, setTrainers] = useState(() => {
    const saved = localStorage.getItem(TRAINERS_STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_TRAINERS;
  });

  // Students state
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_STUDENTS;
  });

  // Logged-in Trainer
  const [loggedInTrainer, setLoggedInTrainer] = useState(() => {
    const saved = localStorage.getItem(LOGGED_TRAINER_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  // Logged-in Student
  const [loggedInStudent, setLoggedInStudent] = useState(() => {
    const saved = localStorage.getItem(LOGGED_STUDENT_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  // Load quizzes and ensure courseId is attached
  const [quizzes, setQuizzes] = useState(() => {
    const saved = localStorage.getItem(QUIZZES_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(q => ({
            ...q,
            courseId: q.courseId || 'course_1'
          }));
        }
      } catch (e) {
        console.error("Failed to parse saved quizzes:", e);
      }
    }
    return INITIAL_QUIZZES.map(q => ({
      ...q,
      courseId: q.courseId || 'course_1'
    }));
  });

  // Load results history
  const [resultsHistory, setResultsHistory] = useState(() => {
    const saved = localStorage.getItem(RESULTS_STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // Currently selected quiz for editing or taking
  const [activeQuizId, setActiveQuizId] = useState(quizzes[0]?.id || null);

  // Active Student Exam Session State
  const [examSession, setExamSession] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(TRAINERS_STORAGE_KEY, JSON.stringify(trainers));
  }, [trainers]);

  useEffect(() => {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(resultsHistory));
  }, [resultsHistory]);

  useEffect(() => {
    localStorage.setItem(ROLE_STORAGE_KEY, activeRole);
  }, [activeRole]);

  useEffect(() => {
    if (loggedInTrainer) {
      localStorage.setItem(LOGGED_TRAINER_KEY, JSON.stringify(loggedInTrainer));
    } else {
      localStorage.removeItem(LOGGED_TRAINER_KEY);
    }
  }, [loggedInTrainer]);

  useEffect(() => {
    if (loggedInStudent) {
      localStorage.setItem(LOGGED_STUDENT_KEY, JSON.stringify(loggedInStudent));
    } else {
      localStorage.removeItem(LOGGED_STUDENT_KEY);
    }
  }, [loggedInStudent]);

  // Helper: Active Quiz
  const activeQuiz = quizzes.find((q) => q.id === activeQuizId) || quizzes[0];

  // ----------------------------------------------------
  // COURSE ACTIONS (ADMIN)
  // ----------------------------------------------------
  const createCourse = (courseData) => {
    const newCourse = {
      id: 'course_' + Date.now(),
      code: courseData.code || 'COURSE-' + Math.floor(100 + Math.random() * 900),
      title: courseData.title || 'Untitled Course',
      description: courseData.description || '',
      createdAt: new Date().toISOString()
    };
    setCourses((prev) => [newCourse, ...prev]);
    return newCourse;
  };

  const updateCourse = (courseId, updatedData) => {
    setCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, ...updatedData } : c)));
  };

  const deleteCourse = (courseId) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    // Remove assigned course from trainers & students
    setTrainers((prev) => prev.map(t => ({
      ...t,
      assignedCourseIds: (t.assignedCourseIds || []).filter(id => id !== courseId)
    })));
    setStudents((prev) => prev.map(s => ({
      ...s,
      assignedCourseIds: (s.assignedCourseIds || []).filter(id => id !== courseId)
    })));
  };

  // ----------------------------------------------------
  // TRAINER ACTIONS (ADMIN & TRAINER)
  // ----------------------------------------------------
  const createTrainer = (trainerData) => {
    const newTrainer = {
      id: 'trainer_' + Date.now(),
      name: trainerData.name || 'New Trainer',
      email: trainerData.email || '',
      password: trainerData.password || 'password123',
      assignedCourseIds: trainerData.assignedCourseIds || [],
      createdAt: new Date().toISOString()
    };
    setTrainers((prev) => [newTrainer, ...prev]);
    return newTrainer;
  };

  const updateTrainer = (trainerId, updatedData) => {
    setTrainers((prev) => prev.map((t) => (t.id === trainerId ? { ...t, ...updatedData } : t)));
    if (loggedInTrainer && loggedInTrainer.id === trainerId) {
      setLoggedInTrainer(prev => ({ ...prev, ...updatedData }));
    }
  };

  const deleteTrainer = (trainerId) => {
    setTrainers((prev) => prev.filter((t) => t.id !== trainerId));
    if (loggedInTrainer && loggedInTrainer.id === trainerId) {
      setLoggedInTrainer(null);
    }
  };

  const assignCoursesToTrainer = (trainerId, courseIds) => {
    updateTrainer(trainerId, { assignedCourseIds: courseIds });
  };

  const loginTrainer = (email, password) => {
    const found = trainers.find(t => t.email.toLowerCase() === email.toLowerCase().trim() && t.password === password);
    if (found) {
      setLoggedInTrainer(found);
      setActiveRole('trainer');
      return { success: true, trainer: found };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const logoutTrainer = () => {
    setLoggedInTrainer(null);
  };

  // ----------------------------------------------------
  // STUDENT ACTIONS (ADMIN & STUDENT)
  // ----------------------------------------------------
  const createStudent = (studentData) => {
    const newStudent = {
      id: 'student_' + Date.now(),
      name: studentData.name || 'New Student',
      email: studentData.email || '',
      rollNumber: studentData.rollNumber || 'STU-' + Math.floor(1000 + Math.random() * 9000),
      password: studentData.password || 'student123',
      assignedCourseIds: studentData.assignedCourseIds || [],
      createdAt: new Date().toISOString()
    };
    setStudents((prev) => [newStudent, ...prev]);
    return newStudent;
  };

  const updateStudent = (studentId, updatedData) => {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, ...updatedData } : s)));
    if (loggedInStudent && loggedInStudent.id === studentId) {
      setLoggedInStudent(prev => ({ ...prev, ...updatedData }));
    }
  };

  const deleteStudent = (studentId) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    if (loggedInStudent && loggedInStudent.id === studentId) {
      setLoggedInStudent(null);
    }
  };

  const assignCoursesToStudent = (studentId, courseIds) => {
    updateStudent(studentId, { assignedCourseIds: courseIds });
  };

  const loginStudent = (identifier, password) => {
    const found = students.find(s => 
      (s.email.toLowerCase() === identifier.toLowerCase().trim() || s.rollNumber.toLowerCase() === identifier.toLowerCase().trim()) && 
      (s.password === password)
    );
    if (found) {
      setLoggedInStudent(found);
      setActiveRole('student');
      return { success: true, student: found };
    }
    return { success: false, error: 'Invalid Student ID/Email or Password' };
  };

  const logoutStudent = () => {
    setLoggedInStudent(null);
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
    localStorage.setItem(ADMIN_AUTH_KEY, 'false');
    localStorage.removeItem('ccna_admin_token');
    setLoggedInTrainer(null);
    setLoggedInStudent(null);
    setExamSession(null);
  };

  // ----------------------------------------------------
  // EXAM / QUIZ ACTIONS (ADMIN & TRAINERS)
  // ----------------------------------------------------
  const createQuiz = (newQuizData) => {
    const newQuiz = {
      id: 'quiz_' + Date.now(),
      courseId: newQuizData.courseId || courses[0]?.id || 'course_1',
      title: newQuizData.title || 'Untitled Quiz',
      description: newQuizData.description || '',
      timeLimitMinutes: Number(newQuizData.timeLimitMinutes) || 15,
      passPercentage: Number(newQuizData.passPercentage) || 70,
      shuffleQuestions: newQuizData.shuffleQuestions !== undefined ? newQuizData.shuffleQuestions : true,
      shuffleOptions: newQuizData.shuffleOptions !== undefined ? newQuizData.shuffleOptions : true,
      allowReview: true,
      createdAt: new Date().toISOString(),
      createdById: activeRole === 'trainer' && loggedInTrainer ? loggedInTrainer.id : 'admin',
      questions: newQuizData.questions || []
    };
    setQuizzes((prev) => [newQuiz, ...prev]);
    setActiveQuizId(newQuiz.id);
    return newQuiz;
  };

  const updateQuizSettings = (quizId, updatedSettings) => {
    setQuizzes((prev) =>
      prev.map((q) => (q.id === quizId ? { ...q, ...updatedSettings } : q))
    );
  };

  const deleteQuiz = (quizId) => {
    setQuizzes((prev) => {
      const filtered = prev.filter((q) => q.id !== quizId);
      if (activeQuizId === quizId && filtered.length > 0) {
        setActiveQuizId(filtered[0].id);
      }
      return filtered;
    });
  };

  const addQuestion = (quizId, questionData) => {
    const newQuestion = {
      id: 'q_' + Date.now(),
      question: questionData.question,
      codeSnippet: questionData.codeSnippet || '',
      options: questionData.options,
      correctIndex: Number(questionData.correctIndex),
      explanation: questionData.explanation || '',
      category: questionData.category || 'General'
    };

    setQuizzes((prev) =>
      prev.map((quiz) => {
        if (quiz.id === quizId) {
          return {
            ...quiz,
            questions: [...quiz.questions, newQuestion]
          };
        }
        return quiz;
      })
    );
  };

  const updateQuestion = (quizId, questionId, questionData) => {
    setQuizzes((prev) =>
      prev.map((quiz) => {
        if (quiz.id === quizId) {
          return {
            ...quiz,
            questions: quiz.questions.map((q) =>
              q.id === questionId ? { ...q, ...questionData } : q
            )
          };
        }
        return quiz;
      })
    );
  };

  const deleteQuestion = (quizId, questionId) => {
    setQuizzes((prev) =>
      prev.map((quiz) => {
        if (quiz.id === quizId) {
          return {
            ...quiz,
            questions: quiz.questions.filter((q) => q.id !== questionId)
          };
        }
        return quiz;
      })
    );
  };

  const shuffleQuizMasterQuestions = (quizId) => {
    setQuizzes((prev) =>
      prev.map((quiz) => {
        if (quiz.id === quizId) {
          return {
            ...quiz,
            questions: prepareExamQuestions(quiz.questions, true, false)
          };
        }
        return quiz;
      })
    );
  };

  const resetToSampleQuizzes = () => {
    setQuizzes(INITIAL_QUIZZES.map(q => ({ ...q, courseId: q.courseId || 'course_1' })));
    setCourses(INITIAL_COURSES);
    setTrainers(INITIAL_TRAINERS);
    setStudents(INITIAL_STUDENTS);
    setActiveQuizId(INITIAL_QUIZZES[0].id);
  };

  const exportQuizzesJson = () => {
    const exportData = {
      courses,
      quizzes
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `iat_assessment_data_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importQuizzesJson = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.quizzes && Array.isArray(parsed.quizzes)) {
        setQuizzes(parsed.quizzes);
        if (parsed.courses && Array.isArray(parsed.courses)) setCourses(parsed.courses);
        setActiveQuizId(parsed.quizzes[0]?.id || null);
        return { success: true, count: parsed.quizzes.length };
      } else if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title && parsed[0].questions) {
        setQuizzes(parsed);
        setActiveQuizId(parsed[0].id);
        return { success: true, count: parsed.length };
      } else {
        return { success: false, error: 'Invalid JSON schema for quiz bank.' };
      }
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  // ----------------------------------------------------
  // STUDENT EXAM ACTIONS
  // ----------------------------------------------------
  const startExam = async (quizId, studentName, studentId) => {
    const targetQuiz = quizzes.find((q) => q.id === quizId);
    if (!targetQuiz || targetQuiz.questions.length === 0) {
      alert("Selected quiz has no questions available!");
      return false;
    }

    // STRICT ENROLLMENT GUARD: Ensure student is assigned to this quiz's course
    if (activeRole === 'student' && loggedInStudent) {
      const assignedIds = loggedInStudent.assignedCourseIds || [];
      if (!assignedIds.includes(targetQuiz.courseId)) {
        alert("Access Denied: You are not assigned or enrolled in the course for this exam. Please contact your Administrator or Trainer.");
        return false;
      }
    }

    const preparedQuestions = prepareExamQuestions(
      targetQuiz.questions,
      targetQuiz.shuffleQuestions,
      targetQuiz.shuffleOptions
    );

    const initialSession = {
      quizId: targetQuiz.id,
      quizTitle: targetQuiz.title,
      studentName: studentName || (loggedInStudent ? loggedInStudent.name : 'Anonymous Student'),
      studentId: studentId || (loggedInStudent ? loggedInStudent.rollNumber : 'STU-' + Math.floor(1000 + Math.random() * 9000)),
      questions: preparedQuestions,
      answers: {},
      flagged: {},
      currentIndex: 0,
      startTime: Date.now(),
      totalTimeSeconds: targetQuiz.timeLimitMinutes * 60,
      timeRemaining: targetQuiz.timeLimitMinutes * 60,
      isSubmitted: false,
      result: null
    };

    try {
      const api = await import('../utils/api');
      const email = `${initialSession.studentId}@local`;
      const student = await api.registerStudent({ name: initialSession.studentName, email, roll: initialSession.studentId });
      initialSession.backendStudentId = student.id;
    } catch (e) {
      console.warn('Failed to register student with backend', e);
    }

    setExamSession(initialSession);
    return true;
  };

  const selectAnswer = (questionIndex, optionIndex) => {
    if (!examSession || examSession.isSubmitted) return;
    setExamSession((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionIndex]: optionIndex
      }
    }));
  };

  const toggleFlagQuestion = (questionIndex) => {
    if (!examSession || examSession.isSubmitted) return;
    setExamSession((prev) => ({
      ...prev,
      flagged: {
        ...prev.flagged,
        [questionIndex]: !prev.flagged[questionIndex]
      }
    }));
  };

  const setCurrentQuestionIndex = (idx) => {
    if (!examSession) return;
    if (idx >= 0 && idx < examSession.questions.length) {
      setExamSession((prev) => ({ ...prev, currentIndex: idx }));
    }
  };

  const submitExam = () => {
    if (!examSession || examSession.isSubmitted) return;

    const targetQuiz = quizzes.find((q) => q.id === examSession.quizId);
    const questions = examSession.questions;
    let score = 0;
    const details = questions.map((q, idx) => {
      const selectedIndex = examSession.answers[idx];
      const isCorrect = selectedIndex === q.correctIndex;
      if (isCorrect) score++;

      return {
        questionId: q.id,
        questionText: q.question,
        codeSnippet: q.codeSnippet,
        category: q.category,
        options: q.options,
        selectedIndex: selectedIndex !== undefined ? selectedIndex : null,
        correctIndex: q.correctIndex,
        isCorrect,
        explanation: q.explanation
      };
    });

    const totalQuestions = questions.length;
    const scorePercentage = Math.round((score / totalQuestions) * 100);
    const passThreshold = targetQuiz ? targetQuiz.passPercentage : 70;
    const isPassed = scorePercentage >= passThreshold;
    const timeTakenSeconds = examSession.totalTimeSeconds - examSession.timeRemaining;

    const resultObject = {
      id: 'res_' + Date.now(),
      quizId: examSession.quizId,
      quizTitle: examSession.quizTitle,
      studentName: examSession.studentName,
      studentId: examSession.studentId,
      submittedAt: new Date().toISOString(),
      score,
      totalQuestions,
      scorePercentage,
      passThreshold,
      isPassed,
      timeTakenSeconds,
      details
    };

    setExamSession((prev) => ({
      ...prev,
      isSubmitted: true,
      result: resultObject
    }));

    setResultsHistory((prev) => [resultObject, ...prev]);

    (async () => {
      try {
        if (examSession && examSession.backendStudentId) {
          const api = await import('../utils/api');
          const resp = await api.submitStudentSubmission({ studentId: examSession.backendStudentId, quizId: examSession.quizId, answers: resultObject.details });
          if (resp && resp.submissionId) {
            setExamSession((prev) => ({ ...prev, backendSubmissionId: resp.submissionId, result: { ...prev.result, backendSubmissionId: resp.submissionId } }));
            setResultsHistory((prev) => prev.map(r => r.id === resultObject.id ? { ...r, backendSubmissionId: resp.submissionId } : r));
          }
        }
      } catch (e) {
        console.warn('Failed to send submission to backend', e);
      }
    })();
  };

  const exitExamSession = () => {
    setExamSession(null);
  };

  const clearResults = () => {
    setResultsHistory([]);
  };

  // Admin credentials state with persistence
  const [adminCreds, setAdminCreds] = useState(() => {
    const saved = localStorage.getItem('iat_admin_creds_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return { username: 'admin', password: 'admin123' };
  });

  useEffect(() => {
    localStorage.setItem('iat_admin_creds_v2', JSON.stringify(adminCreds));
  }, [adminCreds]);

  const changeAdminPassword = async (currentPassword, newPassword) => {
    if (currentPassword !== adminCreds.password) {
      return { success: false, error: 'Current password is incorrect.' };
    }

    const updated = { ...adminCreds, password: newPassword };
    setAdminCreds(updated);
    localStorage.setItem('iat_admin_creds_v2', JSON.stringify(updated));

    try {
      const api = await import('../utils/api');
      await api.changeAdminPassword(currentPassword, newPassword);
    } catch (e) {
      console.warn('Backend admin password update skipped:', e);
    }

    return { success: true };
  };

  // Admin auth
  const loginAdmin = async (username, password) => {
    // 1. Validate against current dynamic adminCreds state
    if (username.toLowerCase().trim() === adminCreds.username.toLowerCase() && password === adminCreds.password) {
      setIsAdminLoggedIn(true);
      setActiveRole('admin');
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      return { success: true };
    }

    // 2. Try backend authentication if backend server is online
    try {
      const api = await import('../utils/api');
      const res = await api.loginAdmin(username, password);
      if (res && res.token) {
        setAdminToken(res.token);
        setIsAdminLoggedIn(true);
        setActiveRole('admin');
        localStorage.setItem('ccna_admin_token', res.token);
        localStorage.setItem(ADMIN_AUTH_KEY, 'true');
        return { success: true };
      }
    } catch (e) {}

    return { success: false, error: 'Invalid username or password' };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.setItem(ADMIN_AUTH_KEY, 'false');
    localStorage.removeItem('ccna_admin_token');
  };

  return (
    <QuizContext.Provider
      value={{
        // Role & Auth State
        activeRole,
        setActiveRole,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        loggedInTrainer,
        loginTrainer,
        logoutTrainer,
        loggedInStudent,
        loginStudent,
        logoutStudent,
        logout,
        // Courses
        courses,
        createCourse,
        updateCourse,
        deleteCourse,
        // Trainers
        trainers,
        createTrainer,
        updateTrainer,
        deleteTrainer,
        assignCoursesToTrainer,
        // Students
        students,
        createStudent,
        updateStudent,
        deleteStudent,
        assignCoursesToStudent,
        // Exams / Quizzes
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
        resetToSampleQuizzes,
        exportQuizzesJson,
        importQuizzesJson,
        // Results & Session
        resultsHistory,
        clearResults,
        examSession,
        setExamSession,
        startExam,
        selectAnswer,
        toggleFlagQuestion,
        setCurrentQuestionIndex,
        submitExam,
        exitExamSession
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
