import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [user, setUser] = useState(null);

  const onLogin = (data) => {
    setUser(data.user);
  };

  const onLogout = () => {
    setUser(null);
  };

  const token = localStorage.getItem('token');
  if (!token || !user) return <Login onLogin={onLogin} />;

  return <Dashboard onLogout={onLogout} />;
}
