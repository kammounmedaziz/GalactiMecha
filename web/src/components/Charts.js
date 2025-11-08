import React from 'react';

export default function Charts({ metrics }) {
  // Placeholder component: replace with chart library (Recharts / Chart.js)
  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h3>Metrics & Drift</h3>
      {metrics ? (
        <div>
          <div className="muted">Accuracy: {metrics.accuracy}</div>
          <div className="muted">AUC: {metrics.auc}</div>
          <div>
            <strong>Drift</strong>
            <ul>
              {metrics.drift.map(d => <li key={d.feature}>{d.feature}: {d.score}</li>)}
            </ul>
          </div>
        </div>
      ) : (
        <div>Loading charts…</div>
      )}
    </div>
  );
}
