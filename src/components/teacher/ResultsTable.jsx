import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { Badge } from '../common/Badge';
import { Trash2, CheckCircle2, XCircle, Clock, Search, Award } from 'lucide-react';

export const ResultsTable = () => {
  const { resultsHistory, clearResults } = useQuiz();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResults = resultsHistory.filter((res) => {
    const term = searchTerm.toLowerCase();
    return (
      res.studentName.toLowerCase().includes(term) ||
      res.studentId.toLowerCase().includes(term) ||
      res.quizTitle.toLowerCase().includes(term)
    );
  });

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
    <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award color="var(--primary)" size={22} /> Student Exam Attempts & Analytics
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Real-time track of completed student tests and performance scores.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-dim)' }} />
            <input 
              type="text" 
              placeholder="Search by student name or ID..." 
              className="input-field" 
              style={{ paddingLeft: '2.1rem', padding: '0.45rem 0.85rem 0.45rem 2.1rem', fontSize: '0.85rem', width: '240px' }} 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>

        </div>
      </div>

      {resultsHistory.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            No exam attempts recorded yet. Switch to <strong>Student Mode</strong> to take a test!
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Student</th>
                <th style={{ padding: '0.75rem 1rem' }}>Quiz Title</th>
                <th style={{ padding: '0.75rem 1rem' }}>Score</th>
                <th style={{ padding: '0.75rem 1rem' }}>Percentage</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>Time Taken</th>
                <th style={{ padding: '0.75rem 1rem' }}>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((res) => (
                <tr key={res.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>
                    <div>{res.studentName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ID: {res.studentId}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{res.quizTitle}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>
                    {res.score} / {res.totalQuestions}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ 
                      fontWeight: 700, 
                      color: res.isPassed ? '#10b981' : '#ef4444' 
                    }}>
                      {res.scorePercentage}%
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {res.isPassed ? (
                      <Badge variant="emerald"><CheckCircle2 size={12} /> PASSED</Badge>
                    ) : (
                      <Badge variant="rose"><XCircle size={12} /> FAILED</Badge>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={13} /> {formatTime(res.timeTakenSeconds)}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                    {formatDate(res.submittedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
