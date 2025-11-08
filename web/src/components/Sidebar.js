import React from 'react';

export default function Sidebar({ onNavigate, activeKey }) {
  const items = [
    { key: 'metrics', label: 'Metrics' },
    { key: 'drift', label: 'Drift' },
    { key: 'experiments', label: 'Experiments' },
    { key: 'models', label: 'Models' }
  ];

  const handleClick = (key, e) => {
    if (onNavigate) onNavigate(key);
    else console.log('navigate to', key);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">GalactiMecha</div>
      <ul className="sidebar__list">
        {items.map(it => (
          <li key={it.key} className="sidebar__item">
            <button
              onClick={(e) => handleClick(it.key, e)}
              className={`sidebar__btn ${activeKey === it.key ? 'sidebar__btn--active' : ''}`}
              aria-pressed={activeKey === it.key}
            >
              {it.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
