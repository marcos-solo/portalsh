import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useQuiz } from '../../context/QuizContext';

export const AdminSettingsModal = ({ isOpen, onClose }) => {
  const { isAdminLoggedIn, changeAdminPassword } = useQuiz();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = async (e) => {
    e.preventDefault();
    setStatus('');
    setIsSuccess(false);

    if (!currentPassword || !newPassword) {
      setStatus('Please fill in both current and new password fields.');
      return;
    }

    if (newPassword.length < 4) {
      setStatus('New password must be at least 4 characters long.');
      return;
    }

    const res = await changeAdminPassword(currentPassword, newPassword);
    if (res.success) {
      setIsSuccess(true);
      setStatus('Admin password successfully updated!');
      setCurrentPassword('');
      setNewPassword('');
    } else {
      setIsSuccess(false);
      setStatus(res.error || 'Failed to update admin password.');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Admin Security Settings">
      {!isAdminLoggedIn && <p style={{ color: 'var(--text-muted)' }}>You must be logged in as admin to change password.</p>}
      <form onSubmit={handleChange}>
        <div className="input-group">
          <label className="input-label">Current Password</label>
          <input 
            type="password" 
            className="input-field" 
            placeholder="Enter current admin password"
            value={currentPassword} 
            onChange={(e) => setCurrentPassword(e.target.value)} 
            required
          />
        </div>
        <div className="input-group">
          <label className="input-label">New Password</label>
          <input 
            type="password" 
            className="input-field" 
            placeholder="Enter new admin password"
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            required
          />
        </div>

        {status && (
          <p style={{ 
            marginTop: '0.75rem', 
            marginBottom: '1rem',
            padding: '0.65rem 0.85rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            background: isSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: isSuccess ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
            color: isSuccess ? '#34d399' : '#f87171' 
          }}>
            {status}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
          <button type="submit" className="btn btn-primary">Update Admin Password</button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminSettingsModal;
