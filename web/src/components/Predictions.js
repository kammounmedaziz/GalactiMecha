import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Predictions({ token }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    api.getPredictions(token).then(data => { if (mounted) setItems(data.items || []); }).catch(() => {});
    return () => { mounted = false; };
  }, [token]);

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h3>Recent Predictions</h3>
      <table className="table">
        <thead>
          <tr><th>ID</th><th>Prediction</th><th>Score</th><th>Suspicious</th></tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.id} className={it.suspicious ? 'suspicious' : ''} style={{ background: it.suspicious ? 'rgba(255,70,70,0.06)' : 'transparent' }}>
              <td>{it.id}</td>
              <td>{it.prediction}</td>
              <td>{it.score.toFixed(2)}</td>
              <td>{it.suspicious ? 'YES' : 'NO'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
