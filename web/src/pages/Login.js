import React, { useState, useEffect, useRef } from 'react';
import api from '../api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('adminpass');
  const [error, setError] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await api.login(username, password);
      // store token and notify parent
      localStorage.setItem('token', data.token);
      onLogin(data);
    } catch (err) {
      setError(err.data?.error || err.message || 'Login failed');
    }
  };

  const openCamera = async () => {
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = s;
      if (videoRef.current) videoRef.current.srcObject = s;
      setCameraOpen(true);
    } catch (e) {
      setError('Cannot access camera: ' + e.message);
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    streamRef.current = null;
    setCameraOpen(false);
  };

  const captureAndLogin = async () => {
    setError(null);
    try {
      const video = videoRef.current;
      if (!video) throw new Error('Video not available');
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      // Call faceAuthLogin which returns JWT if matched
      const resp = await api.faceAuthLogin(dataUrl);
      if (resp.token) {
        localStorage.setItem('token', resp.token);
        closeCamera();
        onLogin(resp);
      } else {
        setError('Face not recognized');
      }
    } catch (e) {
      setError(e.data?.error || e.message || 'Face login failed');
    }
  };

  useEffect(() => {
    return () => {
      closeCamera();
    };
  }, []);

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 20, border: '1px solid #ddd' }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div style={{ marginBottom: 8 }}>
          <label>Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%' }} />
        </div>
        <button type="submit">Login</button>
      </form>

      <div style={{ marginTop: 12 }}>
        <div style={{ marginBottom: 8 }}>
          <button onClick={openCamera}>Login with Face</button>
          {cameraOpen && <button onClick={closeCamera} style={{ marginLeft: 8 }}>Close Camera</button>}
        </div>
        {cameraOpen && (
          <div>
            <video id="face-video" ref={videoRef} autoPlay playsInline style={{ width: 320, border: '1px solid #ccc' }} />
            <div>
              <button onClick={captureAndLogin} style={{ marginTop: 8 }}>Capture & Login</button>
            </div>
          </div>
        )}
      </div>

      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
    </div>
  );
}
