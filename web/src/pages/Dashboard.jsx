import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Cpu, 
  Zap, 
  Target, 
  TrendingUp,
  AlertTriangle,
  Navigation,
  Shield,
  LogOut,
  Gauge
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import faceAuth from '../utils/faceAuth';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [aiStats, setAiStats] = useState({
    navigationAccuracy: 99.9,
    responseTime: 8.5,
    simulationsRun: 1247893,
    anomaliesDetected: 342,
    successRate: 98.7,
    uptime: 99.99
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const currentUser = faceAuth.getCurrentUser();
    if (currentUser) {
      setUsername(currentUser);
      checkApiStatus();
      loadRecentActivity();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const checkApiStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/health');
      setIsOnline(response.data.status === 'ok');
    } catch (error) {
      setIsOnline(false);
    }
  };

  const loadRecentActivity = () => {
    // Simulate recent activity
    setRecentActivity([
      { id: 1, type: 'navigation', message: 'Navigation prediction completed', time: '2 minutes ago' },
      { id: 2, type: 'anomaly', message: 'Anomaly detected in sector 7', time: '15 minutes ago' },
      { id: 3, type: 'simulation', message: 'Mission simulation finished', time: '1 hour ago' },
      { id: 4, type: 'defense', message: 'Defense systems updated', time: '3 hours ago' },
    ]);
  };

  const handleLogout = () => {
    faceAuth.logout();
    navigate('/');
  };

  const statCards = [
    {
      icon: Target,
      title: 'Navigation Accuracy',
      value: `${aiStats.navigationAccuracy}%`,
      color: 'from-space-cyan to-cosmic-nebula',
      trend: '+0.2%'
    },
    {
      icon: Zap,
      title: 'Response Time',
      value: `${aiStats.responseTime}ms`,
      color: 'from-cosmic-nebula to-cosmic-galaxy',
      trend: '-1.5ms'
    },
    {
      icon: Activity,
      title: 'Simulations Run',
      value: aiStats.simulationsRun.toLocaleString(),
      color: 'from-cosmic-galaxy to-space-cyan',
      trend: '+12.4K'
    },
    {
      icon: AlertTriangle,
      title: 'Anomalies Detected',
      value: aiStats.anomaliesDetected,
      color: 'from-space-cyan to-cosmic-nebula',
      trend: '+23'
    },
    {
      icon: TrendingUp,
      title: 'Success Rate',
      value: `${aiStats.successRate}%`,
      color: 'from-cosmic-nebula to-cosmic-galaxy',
      trend: '+1.2%'
    },
    {
      icon: Shield,
      title: 'System Uptime',
      value: `${aiStats.uptime}%`,
      color: 'from-cosmic-galaxy to-space-cyan',
      trend: '100%'
    }
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-orbitron font-bold neon-text mb-2">
              Mission Control
            </h1>
            <p className="text-space-silver font-rajdhani">
              Welcome back, <span className="text-space-cyan">{username}</span>
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* API Status */}
            <div className="flex items-center space-x-2 glass-morphism px-4 py-2 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-sm font-rajdhani">
                {isOnline ? 'AI Online' : 'AI Offline'}
              </span>
            </div>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 glass-morphism hover:glass-morphism-strong px-4 py-2 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-rajdhani">Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-space"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-green-400 font-rajdhani font-medium">
                    {stat.trend}
                  </span>
                </div>
                <h3 className="text-space-silver font-rajdhani text-sm mb-2">
                  {stat.title}
                </h3>
                <p className="text-3xl font-orbitron font-bold text-space-white">
                  {stat.value}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="lg:col-span-2 card-space"
          >
            <h2 className="text-2xl font-orbitron font-bold text-space-white mb-6 flex items-center">
              <Activity className="w-6 h-6 mr-3 text-space-cyan" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 bg-space-blue/30 rounded-lg border border-space-cyan/20 hover:border-space-cyan/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {activity.type === 'navigation' && <Navigation className="w-5 h-5 text-space-cyan" />}
                    {activity.type === 'anomaly' && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                    {activity.type === 'simulation' && <Cpu className="w-5 h-5 text-cosmic-nebula" />}
                    {activity.type === 'defense' && <Shield className="w-5 h-5 text-green-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-space-white font-rajdhani font-medium">
                      {activity.message}
                    </p>
                    <p className="text-sm text-space-silver mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="card-space"
          >
            <h2 className="text-2xl font-orbitron font-bold text-space-white mb-6 flex items-center">
              <Gauge className="w-6 h-6 mr-3 text-space-cyan" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full btn-primary text-left justify-start">
                <Navigation className="w-5 h-5 mr-3" />
                Run Navigation
              </button>
              <button className="w-full btn-secondary text-left justify-start">
                <Cpu className="w-5 h-5 mr-3" />
                Start Simulation
              </button>
              <button className="w-full btn-secondary text-left justify-start">
                <AlertTriangle className="w-5 h-5 mr-3" />
                Check Anomalies
              </button>
              <button className="w-full btn-secondary text-left justify-start">
                <Shield className="w-5 h-5 mr-3" />
                Defense Status
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
