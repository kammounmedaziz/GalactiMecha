import React, { useEffect, useState } from 'react';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import Charts from '../components/Charts';
import Experiments from '../components/Experiments';
import Predictions from '../components/Predictions';
import api from '../api';

export default function Dashboard({ onLogout }) {
  const [metrics, setMetrics] = useState(null);
  const [activeTab, setActiveTab] = useState('metrics');
  const token = localStorage.getItem('token');

  // Load metrics initially and when switching back to metrics/drift
  useEffect(() => {
    let mounted = true;
    if (activeTab === 'metrics' || activeTab === 'drift') {
      api.getMetrics(token).then(data => { if (mounted) setMetrics(data); }).catch(() => {});
    }
    return () => { mounted = false; };
  }, [token, activeTab]);

  const handleNavigate = (key) => {
    setActiveTab(key);
  };

  return (
    <div className="app-container">
      <Sidebar activeKey={activeTab} onNavigate={handleNavigate} />
      <main className="main">
        <Topbar onLogout={onLogout} />
        <div className="page">
          <h2>Dashboard</h2>

          {activeTab === 'metrics' && (
            <div className="card">
              {metrics ? (
                <div>
                  <div className="muted">Model: {metrics.model}</div>
                  <div className="muted">Accuracy: {metrics.accuracy}</div>
                </div>
              ) : (
                <div>Loading metrics…</div>
              )}
              <Charts metrics={metrics} />
            </div>
          )}

          {activeTab === 'drift' && (
            <div className="card">
              <h3>Drift</h3>
              <Charts metrics={metrics} />
            </div>
          )}

          {activeTab === 'experiments' && (
            <div className="card"><Experiments token={token} /></div>
          )}

          {activeTab === 'models' && (
            <div className="card">
              <h3>Models</h3>
              <p className="muted">List of available models will appear here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
