import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, LogIn, AlertCircle, CheckCircle, ArrowLeft, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import faceAuth from '../utils/faceAuth';

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [cameraActive, setCameraActive] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (cameraActive) {
        faceAuth.stopCamera();
      }
    };
  }, [cameraActive]);

  const startCamera = async () => {
    setStatus({ type: '', message: '' });
    const success = await faceAuth.initCamera(videoRef.current);
    if (success) {
      setCameraActive(true);
      setStatus({ type: 'info', message: 'Camera activated. Position your face for authentication.' });
    } else {
      setStatus({ type: 'error', message: 'Camera access denied. Please allow camera access.' });
    }
  };

  const authenticateWithFace = async () => {
    setLoading(true);
    setStatus({ type: 'info', message: 'Authenticating...' });

    // Capture face
    const faceData = faceAuth.captureFace(canvasRef.current);
    
    if (!faceData) {
      setStatus({ type: 'error', message: 'Failed to capture face. Please try again.' });
      setLoading(false);
      return;
    }

    // Authenticate
    const result = await faceAuth.authenticateUser(faceData);
    setLoading(false);

    if (result.success) {
      setStatus({ type: 'success', message: `Welcome back, ${result.username}!` });
      faceAuth.stopCamera();
      setCameraActive(false);
      setIsAuthenticated(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } else {
      setStatus({ type: 'error', message: result.message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center space-x-2 text-space-cyan hover:text-space-lightBlue transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-rajdhani">Back to Home</span>
        </button>

        {/* Login Card */}
        <div className="glass-morphism rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-cosmic-nebula to-space-cyan mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-orbitron font-bold neon-text mb-2">
              Secure Login
            </h1>
            <p className="text-space-silver font-rajdhani">
              Authenticate with your Face ID
            </p>
          </div>

          {/* Camera Section */}
          <div className="mb-6">
            <div className="relative aspect-video bg-space-blue/30 rounded-lg overflow-hidden border border-space-cyan/30">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`w-full h-full object-cover ${!cameraActive && 'hidden'}`}
              />
              {!cameraActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-space-cyan/50 mx-auto mb-4" />
                    <p className="text-space-silver font-rajdhani">
                      Camera inactive
                    </p>
                  </div>
                </div>
              )}
              
              {/* Scanning overlay when camera is active */}
              {cameraActive && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 border-2 border-space-cyan/50 rounded-lg">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-space-cyan rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-space-cyan rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-space-cyan rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-space-cyan rounded-br-lg"></div>
                  </div>
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-space-cyan/50 animate-pulse"></div>
                </div>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Status Message */}
          {status.message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center space-x-2 p-4 rounded-lg mb-6 ${
                status.type === 'error' ? 'bg-red-500/20 border border-red-500/50' :
                status.type === 'success' ? 'bg-green-500/20 border border-green-500/50' :
                'bg-space-cyan/20 border border-space-cyan/50'
              }`}
            >
              {status.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
              {status.type === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
              <p className="text-sm font-rajdhani">{status.message}</p>
            </motion.div>
          )}

          {/* Authentication Buttons */}
          <div className="space-y-4">
            {!cameraActive ? (
              <button
                onClick={startCamera}
                className="w-full btn-primary"
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Face Authentication
              </button>
            ) : (
              <button
                onClick={authenticateWithFace}
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Authenticating...' : 'Authenticate Now'}
              </button>
            )}
          </div>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-space-silver font-rajdhani mb-4">
              Don't have an account?
            </p>
            <button
              onClick={() => navigate('/register')}
              className="btn-secondary"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Register New Account
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
