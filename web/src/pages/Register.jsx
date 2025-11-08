import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, UserPlus, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import faceAuth from '../utils/faceAuth';

const Register = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [username, setUsername] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
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
      setStatus({ type: 'info', message: 'Camera activated. Position your face in the frame.' });
    } else {
      setStatus({ type: 'error', message: 'Camera access denied. Please allow camera access.' });
    }
  };

  const captureFace = () => {
    const imageData = faceAuth.captureFace(canvasRef.current);
    if (imageData) {
      setCapturedImage(imageData);
      faceAuth.stopCamera();
      setCameraActive(false);
      setStatus({ type: 'success', message: 'Face captured successfully!' });
    }
  };

  const handleRegister = async () => {
    if (!username.trim()) {
      setStatus({ type: 'error', message: 'Please enter a username' });
      return;
    }

    if (!capturedImage) {
      setStatus({ type: 'error', message: 'Please capture your face first' });
      return;
    }

    setLoading(true);
    const result = await faceAuth.registerUser(username, capturedImage);
    setLoading(false);

    if (result.success) {
      setStatus({ type: 'success', message: 'Registration successful! Redirecting to login...' });
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setStatus({ type: 'error', message: result.message });
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setStatus({ type: '', message: '' });
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

        {/* Registration Card */}
        <div className="glass-morphism rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-cosmic-nebula to-space-cyan mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-orbitron font-bold neon-text mb-2">
              Register
            </h1>
            <p className="text-space-silver font-rajdhani">
              Create your account with Face ID authentication
            </p>
          </div>

          {/* Username Input */}
          <div className="mb-6">
            <label className="block text-space-silver font-rajdhani font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-3 bg-space-blue/30 border border-space-cyan/30 rounded-lg text-space-white placeholder-space-silver/50 font-rajdhani focus:outline-none focus:border-space-cyan transition-colors"
            />
          </div>

          {/* Camera Section */}
          <div className="mb-6">
            <label className="block text-space-silver font-rajdhani font-medium mb-2">
              Face Capture
            </label>
            <div className="relative aspect-video bg-space-blue/30 rounded-lg overflow-hidden border border-space-cyan/30">
              {!capturedImage ? (
                <>
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
                </>
              ) : (
                <img src={capturedImage} alt="Captured face" className="w-full h-full object-cover" />
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Camera Controls */}
          <div className="flex gap-4 mb-6">
            {!capturedImage ? (
              <>
                {!cameraActive ? (
                  <button
                    onClick={startCamera}
                    className="flex-1 btn-primary"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Activate Camera
                  </button>
                ) : (
                  <button
                    onClick={captureFace}
                    className="flex-1 btn-primary"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Capture Face
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={retakePhoto}
                className="flex-1 btn-secondary"
              >
                Retake Photo
              </button>
            )}
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

          {/* Register Button */}
          <button
            onClick={handleRegister}
            disabled={loading || !username || !capturedImage}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Complete Registration'}
          </button>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-space-silver font-rajdhani">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-space-cyan hover:text-space-lightBlue transition-colors font-medium"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
