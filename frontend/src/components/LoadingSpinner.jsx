import React from 'react';

export default function LoadingSpinner({ size = 24, color = '#2563EB' }) {
  const spinnerStyle = {
    width: size,
    height: size,
    border: `${Math.round(size / 8)}px solid ${color}`,
    borderTop: `${Math.round(size / 8)}px solid transparent`,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  };

  return <div style={spinnerStyle} aria-label="Loading" />;
}

// Add CSS animation via a global style (could be in index.css)
// @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
