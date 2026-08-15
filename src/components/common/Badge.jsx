import React from 'react';

export const Badge = ({ children, variant = 'indigo', className = '' }) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
};
