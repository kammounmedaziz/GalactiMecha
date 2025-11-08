import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Experiments({ token }) {
  const [exps, setExps] = useState([]);
  const [name, setName] = useState('My Experiment');

  useEffect(() => {
    let mounted = true;
    api.listExperiments(token).then(data => { if (mounted) setExps(data); }).catch(() => {});
    return () => { mounted = false; };
  }, [token]);

  const start = async () => {
    try {
      await api.startExperiment(name, token);
      const latest = await api.listExperiments(token);
      setExps(latest);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h3>Experiments</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input className="input" value={name} onChange={e => setName(e.target.value)} />
        <button className="btn" onClick={start}>Start</button>
      </div>
      <ul>
        {exps.map(e => (
          <li key={e.id} className="muted">{e.name} — {e.status}</li>
        ))}
      </ul>
    </div>
  );
}
