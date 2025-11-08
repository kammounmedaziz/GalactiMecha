import React from 'react';

export default function Topbar({ onLogout }) {
  return (
    <div className="topbar">
      <div className="topbar__title">Welcome to GalactiMecha Dashboard</div>
      <div className="topbar__actions">
        <button className="btn--ghost" onClick={() => { localStorage.removeItem('token'); if (onLogout) onLogout(); }}>Logout</button>
      </div>
    </div>
  );
}
