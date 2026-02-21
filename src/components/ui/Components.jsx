
import React from 'react';

export const Button = ({ variant = 'primary', className = '', children, ...props }) => {
  const variantClass = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    hero: 'btn btn-hero',
    ghostDark: 'btn btn-ghost-dark',
  }[variant] || 'btn btn-primary';

  return (
    <button className={`${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Card = ({ children, className = '', glass = false, ...props }) => {
  return (
    <div className={`${glass ? 'card-glass' : 'card'} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const Input = ({ label, error, success, type = 'text', ...props }) => {
  return (
    <div className="input-group">
      {label && <label className="label">{label}</label>}
      <input
        className={`input ${error ? 'input-error' : ''} ${success ? 'input-success' : ''}`}
        type={type}
        {...props}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export const Badge = ({ children, color = 'purple' }) => {
  const colors = {
    purple: { bg: 'rgba(147,51,234,0.1)', border: 'rgba(147,51,234,0.2)', text: '#9333EA' },
    teal: { bg: 'rgba(20,184,166,0.1)', border: 'rgba(20,184,166,0.2)', text: '#14B8A6' },
    blue: { bg: 'rgba(30,58,138,0.1)', border: 'rgba(30,58,138,0.2)', text: '#1E3A8A' },
    green: { bg: 'rgba(22,163,74,0.1)', border: 'rgba(22,163,74,0.2)', text: '#16A34A' },
    cyan: { bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.2)', text: '#38BDF8' },
  };
  const c = colors[color] || colors.purple;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: c.bg, border: `1px solid ${c.border}`,
      color: c.text, borderRadius: 999, padding: '4px 12px',
      fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
    }}>
      {children}
    </span>
  );
};
