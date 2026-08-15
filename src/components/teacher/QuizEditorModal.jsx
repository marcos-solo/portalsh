import React, { useState } from 'react';
import { Modal } from '../common/Modal';

export const QuizEditorModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(15);
  const [passPercentage, setPassPercentage] = useState(70);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a quiz title.");
      return;
    }

    onCreate({
      title: title.trim(),
      description: description.trim(),
      timeLimitMinutes: Number(timeLimitMinutes),
      passPercentage: Number(passPercentage),
      shuffleQuestions: true,
      shuffleOptions: true,
      questions: []
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Quiz / MCQ Test Bank">
      <form onSubmit={handleSubmit}>
        
        <div className="input-group">
          <label className="input-label">Quiz Title *</label>
          <input 
            type="text" 
            className="input-field" 
            placeholder="e.g. CCNA Routing & Switching Practice Exam 1" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>

        <div className="input-group">
          <label className="input-label">Description / Scope</label>
          <textarea 
            className="textarea-field" 
            placeholder="Provide brief instructions or scope covered in this assessment..." 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
        </div>

        <div className="grid-2">
          <div className="input-group">
            <label className="input-label">Exam Time Limit (Minutes)</label>
            <input 
              type="number" 
              min="1" 
              className="input-field" 
              value={timeLimitMinutes} 
              onChange={(e) => setTimeLimitMinutes(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label className="input-label">Passing Percentage Threshold (%)</label>
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

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button type="submit" className="btn btn-primary">Create Quiz</button>
        </div>

      </form>
    </Modal>
  );
};
