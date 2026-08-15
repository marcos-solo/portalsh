import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Clock, Shuffle, Percent } from 'lucide-react';

export const QuizSettingsModal = ({ isOpen, onClose, quiz, onSave }) => {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(15);
  const [passPercentage, setPassPercentage] = useState(70);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);

  // removed admin credential editing from quiz settings; admin credentials managed in Admin Settings

  useEffect(() => {
    if (quiz) {
      setTitle(quiz.title || '');
      setDescription(quiz.description || '');
      setTimeLimitMinutes(quiz.timeLimitMinutes || 15);
      setPassPercentage(quiz.passPercentage || 70);
      setShuffleQuestions(quiz.shuffleQuestions !== undefined ? quiz.shuffleQuestions : true);
      setShuffleOptions(quiz.shuffleOptions !== undefined ? quiz.shuffleOptions : true);
    }
  }, [quiz, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a quiz title.");
      return;
    }


    onSave(quiz.id, {
      title: title.trim(),
      description: description.trim(),
      timeLimitMinutes: Math.max(1, Number(timeLimitMinutes)),
      passPercentage: Math.min(100, Math.max(1, Number(passPercentage))),
      shuffleQuestions,
      shuffleOptions
    });

    onClose();
  };

  if (!quiz) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quiz Settings & Timer Configuration">
      <form onSubmit={handleSubmit}>
        
        <div className="input-group">
          <label className="input-label">Quiz Title</label>
          <input 
            type="text" 
            className="input-field" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>

        <div className="input-group">
          <label className="input-label">Description / Student Instructions</label>
          <textarea 
            className="textarea-field" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
        </div>

        <div className="grid-2">
          <div className="input-group">
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} color="var(--primary)" /> Time Limit (Minutes)
            </label>
            <input 
              type="number" 
              min="1" 
              max="300" 
              className="input-field" 
              value={timeLimitMinutes} 
              onChange={(e) => setTimeLimitMinutes(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Percent size={16} color="var(--success)" /> Pass Score Target (%)
            </label>
            <input 
              type="number" 
              min="1" 
              max="100" 
              className="input-field" 
              value={passPercentage} 
              onChange={(e) => setPassPercentage(e.target.value)} 
              required 
            />
          </div>
        </div>

        {/* Shuffling Options */}
        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', margin: '1rem 0' }}>
          <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shuffle size={16} color="var(--accent-cyan)" /> Automatic Exam Shuffling Controls
          </h4>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
            <input 
              type="checkbox" 
              checked={shuffleQuestions} 
              onChange={(e) => setShuffleQuestions(e.target.checked)} 
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
            />
            Shuffle Question Sequence for every student session
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontSize: '0.9rem' }}>
            <input 
              type="checkbox" 
              checked={shuffleOptions} 
              onChange={(e) => setShuffleOptions(e.target.checked)} 
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
            />
            Shuffle Multiple Choice Option Answers (A/B/C/D) automatically
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button type="submit" className="btn btn-primary">Save Settings</button>
        </div>

      </form>
    </Modal>
  );
};
