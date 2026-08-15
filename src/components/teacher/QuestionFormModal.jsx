import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const QuestionFormModal = ({ isOpen, onClose, onSubmit, onSave, initialData = null, editingQuestion = null }) => {
  const targetData = editingQuestion || initialData;
  const saveHandler = onSave || onSubmit;

  const [question, setQuestion] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [category, setCategory] = useState('Network Fundamentals');

  useEffect(() => {
    if (targetData) {
      setQuestion(targetData.question || '');
      setCodeSnippet(targetData.codeSnippet || '');
      setOptions(targetData.options && targetData.options.length >= 2 ? [...targetData.options] : ['', '', '', '']);
      setCorrectIndex(targetData.correctIndex !== undefined ? targetData.correctIndex : 0);
      setExplanation(targetData.explanation || '');
      setCategory(targetData.category || 'Network Fundamentals');
    } else {
      setQuestion('');
      setCodeSnippet('');
      setOptions(['', '', '', '']);
      setCorrectIndex(0);
      setExplanation('');
      setCategory('Network Fundamentals');
    }
  }, [targetData, isOpen]);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOptionField = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOptionField = (index) => {
    if (options.length <= 2) {
      alert("A multiple choice question must have at least 2 options.");
      return;
    }
    const updated = options.filter((_, i) => i !== index);
    setOptions(updated);
    if (correctIndex >= updated.length) {
      setCorrectIndex(updated.length - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) {
      alert("Please enter a question text.");
      return;
    }
    for (let i = 0; i < options.length; i++) {
      if (!options[i].trim()) {
        alert(`Please enter text for Option ${i + 1}.`);
        return;
      }
    }

    const payload = {
      question: question.trim(),
      codeSnippet: codeSnippet.trim(),
      options: options.map((o) => o.trim()),
      correctIndex: Number(correctIndex),
      explanation: explanation.trim(),
      category: category.trim() || 'General'
    };

    if (typeof saveHandler === 'function') {
      saveHandler(payload);
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={targetData ? "Edit Question" : "Add New MCQ Question"} maxWidth="720px">
      <form onSubmit={handleSubmit}>
        
        {/* Category & Topic */}
        <div className="grid-2">
          <div className="input-group">
            <label className="input-label">Topic / Category</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Subnetting, OSPF, VLANs, Security" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
            />
          </div>
          <div className="input-group">
            <label className="input-label">Correct Option Answer</label>
            <div style={{ display: 'flex', alignItems: 'center', height: '42px', color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>
              <CheckCircle2 size={18} style={{ marginRight: '6px' }} />
              Selected: Option {correctIndex + 1}
            </div>
          </div>
        </div>

        {/* Question Text */}
        <div className="input-group">
          <label className="input-label">Question Text *</label>
          <textarea 
            className="textarea-field" 
            placeholder="Type the multiple choice question here..." 
            value={question} 
            onChange={(e) => setQuestion(e.target.value)} 
            required 
          />
        </div>

        {/* Optional CLI / Code Snippet */}
        <div className="input-group">
          <label className="input-label">Optional Network CLI / Config Code Snippet</label>
          <textarea 
            className="textarea-field code-textarea" 
            placeholder="e.g. Router(config)# ip route 0.0.0.0 0.0.0.0 10.0.0.1" 
            value={codeSnippet} 
            onChange={(e) => setCodeSnippet(e.target.value)} 
          />
        </div>

        {/* Options List */}
        <div className="input-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label className="input-label" style={{ margin: 0 }}>Options (Select the radio button for the correct answer)</label>
            {options.length < 6 && (
              <button type="button" onClick={addOptionField} className="btn btn-secondary btn-sm">
                <Plus size={14} /> Add Option
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {options.map((opt, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.65rem',
                  background: correctIndex === idx ? 'rgba(16, 185, 129, 0.08)' : 'rgba(0,0,0,0.2)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: correctIndex === idx ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)'
                }}
              >
                <input 
                  type="radio" 
                  name="correctAnswerRadio" 
                  checked={correctIndex === idx} 
                  onChange={() => setCorrectIndex(idx)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#10b981' }}
                  title="Mark as Correct Answer"
                />
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: correctIndex === idx ? '#10b981' : 'var(--text-muted)', minWidth: '70px' }}>
                  Option {idx + 1}:
                </span>
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ padding: '0.45rem 0.75rem' }} 
                  placeholder={`Enter text for option ${idx + 1}`} 
                  value={opt} 
                  onChange={(e) => handleOptionChange(idx, e.target.value)} 
                  required 
                />
                {options.length > 2 && (
                  <button 
                    type="button" 
                    onClick={() => removeOptionField(idx)} 
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}
                    title="Delete Option"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Explanation */}
        <div className="input-group">
          <label className="input-label">Answer Explanation (Shown to students in review mode)</label>
          <textarea 
            className="textarea-field" 
            placeholder="Explain why the correct answer is right..." 
            value={explanation} 
            onChange={(e) => setExplanation(e.target.value)} 
          />
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button type="submit" className="btn btn-primary">
            {targetData ? "Save Changes" : "Create Question"}
          </button>
        </div>

      </form>
    </Modal>
  );
};
