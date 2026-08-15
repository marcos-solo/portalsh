import React, { useEffect, useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { Badge } from '../common/Badge';
import { 
  Trophy, 
  XCircle, 
  CheckCircle2, 
  RotateCcw, 
  Clock, 
  ArrowLeft,
  HelpCircle,
  Sparkles 
} from 'lucide-react';
import api from '../../utils/api';

const triggerConfetti = () => {
  try {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.5,
      size: Math.random() * 8 + 4,
      color: ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#ec4899'][Math.floor(Math.random() * 5)],
      speedY: Math.random() * 3 + 2,
      speedX: (Math.random() - 0.5) * 2
    }));

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        p.y += p.speedY;
        p.x += p.speedX;
      });
      frame++;
      if (frame < 120) {
        requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    };
    animate();
  } catch (e) {
    console.log(e);
  }
};

export const ExamResults = () => {
  const { examSession, exitExamSession, startExam } = useQuiz();
  const result = examSession?.result;

  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    if (result && result.isPassed) {
      triggerConfetti();
    }
  }, [result]);

  if (!result) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs} sec`;
  };

  const handleRetake = async () => {
    await startExam(examSession.quizId, examSession.studentName, examSession.studentId);
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUploadFiles = async () => {
    if (!files.length) return setUploadStatus('Please choose files first');
    const submissionId = examSession?.result?.backendSubmissionId || examSession?.backendSubmissionId;
    if (!submissionId) return setUploadStatus('No backend submission id available');
    setUploadStatus('Uploading...');
    try {
      await api.uploadFilesToSubmission(submissionId, files);
      setUploadStatus('Upload successful');
      setFiles([]);
    } catch (e) {
      setUploadStatus('Upload failed');
      console.warn(e);
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: '880px', paddingBottom: '4rem' }}>
      {/* Result Overview Header Card */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '2.5rem 2rem', 
          textAlign: 'center', 
          marginBottom: '2rem',
          border: result.isPassed ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
          background: result.isPassed ? 'radial-gradient(ellipse at top, rgba(16, 185, 129, 0.15), transparent 70%)' : 'radial-gradient(ellipse at top, rgba(239, 68, 68, 0.15), transparent 70%)'
        }}
      >
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          width: '72px', 
          height: '72px', 
          borderRadius: '50%', 
          background: result.isPassed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          marginBottom: '1rem'
        }}>
          {result.isPassed ? (
            <Trophy size={40} color="#10b981" />
          ) : (
            <XCircle size={40} color="#ef4444" />
          )}
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
          {result.isPassed ? 'Congratulations! Exam Passed 🎉' : 'Exam Completed — Needs Review'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          Student: <strong style={{ color: '#fff' }}>{result.studentName}</strong> ({result.studentId})
        </p>

        {/* Score Radial Badge */}
        <div style={{ 
          display: 'inline-flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          padding: '1.25rem 2.5rem', 
          background: 'rgba(0,0,0,0.4)', 
          borderRadius: 'var(--radius-xl)', 
          border: '1px solid var(--border-color)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: result.isPassed ? '#10b981' : '#ef4444', lineHeight: 1 }}>
            {result.scorePercentage}%
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Score: {result.score} out of {result.totalQuestions} Correct Questions
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <Badge variant="indigo">
            <Clock size={13} /> Time Taken: {formatTime(result.timeTakenSeconds)}
          </Badge>
          <Badge variant={result.isPassed ? "emerald" : "rose"}>
            Passing Threshold: {result.passThreshold}%
          </Badge>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem' }}>
          <button onClick={handleRetake} className="btn btn-secondary">
            <RotateCcw size={16} /> Retake Assessment
          </button>
          <button onClick={exitExamSession} className="btn btn-primary">
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>

      </div>

      {/* Section B: file upload for additional submission files */}
      <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.25rem' }}>
        <h4 style={{ margin: 0, marginBottom: '0.5rem' }}>Section B — Upload Supporting Files (PDF, .pkt)</h4>
        <p style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>You may upload supplementary files for manual grading or review.</p>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.75rem' }}>
          <input type="file" multiple onChange={handleFileChange} />
          <button onClick={handleUploadFiles} className="btn btn-primary">Upload Files</button>
          <span style={{ color: 'var(--text-muted)' }}>{uploadStatus}</span>
        </div>
      </div>

      {/* Detailed Question-by-Question Review */}
      <h3 style={{ fontSize: '1.35rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <HelpCircle color="var(--primary)" size={22} /> Detailed Question Breakdown
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {result.details.map((q, idx) => {
          return (
            <div 
              key={idx} 
              className="glass-panel" 
              style={{ 
                padding: '1.5rem',
                borderLeft: q.isCorrect ? '4px solid #10b981' : '4px solid #ef4444'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Question {idx + 1}
                  </span>
                  <Badge variant="cyan">{q.category}</Badge>
                </div>
                <div>
                  {q.isCorrect ? (
                    <Badge variant="emerald"><CheckCircle2 size={13} /> Correct (+1)</Badge>
                  ) : (
                    <Badge variant="rose"><XCircle size={13} /> Incorrect</Badge>
                  )}
                </div>
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                {q.questionText}
              </h4>

              {q.codeSnippet && (
                <div className="cli-code-block">
                  {q.codeSnippet}
                </div>
              )}

              {/* Options Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                {q.options.map((optText, oIdx) => {
                  const isUserChoice = q.selectedIndex === oIdx;
                  const isCorrectChoice = q.correctIndex === oIdx;

                  let bg = 'rgba(0,0,0,0.2)';
                  let border = '1px solid var(--border-color)';
                  let textColor = 'var(--text-muted)';
                  let label = null;

                  if (isCorrectChoice) {
                    bg = 'rgba(16, 185, 129, 0.15)';
                    border = '1px solid rgba(16, 185, 129, 0.4)';
                    textColor = '#34d399';
                    label = "✓ Correct Answer";
                  } else if (isUserChoice && !isCorrectChoice) {
                    bg = 'rgba(239, 68, 68, 0.15)';
                    border = '1px solid rgba(239, 68, 68, 0.4)';
                    textColor = '#f87171';
                    label = "✗ Your Answer";
                  }

                  return (
                    <div 
                      key={oIdx} 
                      style={{ 
                        padding: '0.65rem 0.85rem', 
                        borderRadius: 'var(--radius-md)', 
                        background: bg, 
                        border: border,
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: textColor }}>
                          {String.fromCharCode(65 + oIdx)}.
                        </span>
                        <span style={{ color: textColor }}>{optText}</span>
                      </div>
                      {label && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: textColor }}>
                          {label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {q.explanation && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.85rem 1rem', 
                  background: 'rgba(99, 102, 241, 0.08)', 
                  border: '1px solid rgba(99, 102, 241, 0.2)', 
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  color: 'var(--text-main)'
                }}>
                  <strong style={{ color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                    <Sparkles size={14} /> Explanation:
                  </strong>
                  {q.explanation}
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default ExamResults;
