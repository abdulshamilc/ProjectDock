import { useState, useEffect, useCallback } from 'react';
import api from './shared/api';

function App() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/health');
      setHealth(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to reach server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  const isConnected = health?.db === 'connected';

  return (
    <div className="app-hero">
      <h1 className="app-hero__title">Project Management System</h1>
      <p className="app-hero__subtitle">
        Architecture foundation ready. All systems monitored below.
      </p>

      <div className="card health-card fade-in">
        <div className="health-card__header">
          <span className="health-card__title">System Health</span>
          {!loading && !error && (
            <span className={`status-badge status-badge--${isConnected ? 'success' : 'error'}`}>
              <span className={`status-dot status-dot--${isConnected ? 'success' : 'error'}`} />
              {isConnected ? 'Operational' : 'Degraded'}
            </span>
          )}
        </div>

        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            Checking system status…
          </div>
        )}

        {error && (
          <div className="error-state">
            <span>⚠ {error}</span>
            <button className="error-state__retry" onClick={fetchHealth}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && health && (
          <div className="health-card__rows">
            <div className="health-row">
              <span className="health-row__label">Status</span>
              <span className="health-row__value">{health.status}</span>
            </div>
            <div className="health-row">
              <span className="health-row__label">Database</span>
              <span className="health-row__value">{health.db}</span>
            </div>
            <div className="health-row">
              <span className="health-row__label">Uptime</span>
              <span className="health-row__value">{Math.floor(health.uptime)}s</span>
            </div>
            <div className="health-row">
              <span className="health-row__label">Timestamp</span>
              <span className="health-row__value">
                {new Date(health.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
