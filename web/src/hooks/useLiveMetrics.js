import { useState, useEffect } from 'react';
import api from '../api';

export default function useLiveMetrics(token, interval = 5000) {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    let mounted = true;
    let id;
    const fetcher = async () => {
      try {
        const data = await api.getMetrics(token);
        if (mounted) setMetrics(data);
      } catch (e) {
        // ignore
      }
    };
    fetcher();
    id = setInterval(fetcher, interval);
    return () => { mounted = false; clearInterval(id); };
  }, [token, interval]);

  return metrics;
}
