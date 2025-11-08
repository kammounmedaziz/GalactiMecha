import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Cpu, 
  Zap, 
  Target, 
  TrendingUp,
  AlertTriangle,
  Navigation as NavIcon,
  Shield,
  LogOut,
  Gauge,
  Play,
  Loader,
  Rocket,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Plot from 'react-plotly.js';
import faceAuth from '../utils/faceAuth';
import aiApi from '../utils/aiApi';

const Dashboard = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview, simulation, attack, analytics
  
  // Simulation state
  const [simulationData, setSimulationData] = useState(null);
  const [simulationParams, setSimulationParams] = useState({
    instruction: 'Execute safe Mars approach with conservative fuel usage',
    steps: 50,
    anomalyRate: 0.1,
    sensitivity: 0.5
  });

  // Attack scenario state
  const [attackData, setAttackData] = useState(null);
  const [attackParams, setAttackParams] = useState({
    instruction: 'Safe Mars approach with fuel conservation',
    totalSteps: 50,
    attackStart: 15,
    attackDuration: 10
  });

  // Analytics state
  const [analyticsData, setAnalyticsData] = useState(null);

  // Real-time stats
  const [aiStats, setAiStats] = useState({
    navigationAccuracy: 99.9,
    responseTime: 8.5,
    simulationsRun: 1247893,
    anomaliesDetected: 342,
    successRate: 98.7,
    uptime: 99.99
  });

  useEffect(() => {
    const currentUser = faceAuth.getCurrentUser();
    if (currentUser) {
      setUsername(currentUser);
      checkApiStatus();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const checkApiStatus = async () => {
    const online = await aiApi.checkHealth();
    setIsOnline(online);
  };

  const handleLogout = () => {
    faceAuth.logout();
    setIsAuthenticated(false);
    navigate('/');
  };

  // Run Simulation
  const runSimulation = async () => {
    console.log('Dashboard: Starting simulation...');
    setLoading(true);
    setSimulationData(null); // Clear previous data
    
    const result = await aiApi.runSimulation(
      simulationParams.instruction,
      simulationParams.steps,
      simulationParams.anomalyRate,
      simulationParams.sensitivity
    );
    
    console.log('Dashboard: Simulation result:', result);
    
    if (result.success) {
      console.log('Dashboard: Setting simulation data');
      setSimulationData(result);
      setAiStats(prev => ({
        ...prev,
        simulationsRun: prev.simulationsRun + 1
      }));
    } else {
      console.error('Dashboard: Simulation failed:', result.error);
      alert(`Simulation failed: ${result.error}`);
    }
    setLoading(false);
  };

  // Run Attack Scenario
  const runAttackScenario = async () => {
    setLoading(true);
    const result = await aiApi.runAttackScenario(
      attackParams.instruction,
      attackParams.totalSteps,
      attackParams.attackStart,
      attackParams.attackDuration
    );
    
    if (result.success) {
      setAttackData(result);
    }
    setLoading(false);
  };

  // Run Analytics Test
  const runAnalytics = async () => {
    setLoading(true);
    const result = await aiApi.runAnalyticsTest(
      'Compare different navigation approaches',
      50
    );
    
    if (result.success) {
      setAnalyticsData(result);
    }
    setLoading(false);
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
      trend: '+' + Math.floor(Math.random() * 100)
    },
    {
      icon: AlertTriangle,
      title: 'Anomalies Detected',
      value: aiStats.anomaliesDetected,
      color: 'from-space-cyan to-cosmic-nebula',
      trend: '+' + Math.floor(Math.random() * 50)
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Gauge },
            { id: 'simulation', label: 'Simulation', icon: Rocket },
            { id: 'attack', label: 'Attack Scenarios', icon: Shield },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-rajdhani font-medium transition-all ${
                  activeTab === tab.id
                    ? 'glass-morphism-strong text-space-cyan neon-border'
                    : 'glass-morphism text-space-silver hover:text-space-cyan'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Quick Actions */}
              <div className="card-space">
                <h2 className="text-2xl font-orbitron font-bold text-space-white mb-6 flex items-center">
                  <Gauge className="w-6 h-6 mr-3 text-space-cyan" />
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <button 
                    onClick={() => setActiveTab('simulation')}
                    className="w-full btn-primary text-left justify-start"
                  >
                    <NavIcon className="w-5 h-5 mr-3" />
                    Run Navigation Simulation
                  </button>
                  <button 
                    onClick={() => setActiveTab('attack')}
                    className="w-full btn-secondary text-left justify-start"
                  >
                    <Shield className="w-5 h-5 mr-3" />
                    Test Attack Defense
                  </button>
                  <button 
                    onClick={() => setActiveTab('analytics')}
                    className="w-full btn-secondary text-left justify-start"
                  >
                    <BarChart3 className="w-5 h-5 mr-3" />
                    View Analytics
                  </button>
                  <button 
                    onClick={checkApiStatus}
                    className="w-full btn-secondary text-left justify-start"
                  >
                    <Activity className="w-5 h-5 mr-3" />
                    Check System Status
                  </button>
                </div>
              </div>

              {/* System Status */}
              <div className="card-space">
                <h2 className="text-2xl font-orbitron font-bold text-space-white mb-6 flex items-center">
                  <Cpu className="w-6 h-6 mr-3 text-space-cyan" />
                  System Status
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-space-blue/30 rounded-lg">
                    <span className="text-space-silver font-rajdhani">AI Core</span>
                    <span className={`font-rajdhani font-bold ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                      {isOnline ? 'ONLINE' : 'OFFLINE'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-space-blue/30 rounded-lg">
                    <span className="text-space-silver font-rajdhani">Navigation</span>
                    <span className="font-rajdhani font-bold text-green-400">OPERATIONAL</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-space-blue/30 rounded-lg">
                    <span className="text-space-silver font-rajdhani">Defense Matrix</span>
                    <span className="font-rajdhani font-bold text-green-400">ACTIVE</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-space-blue/30 rounded-lg">
                    <span className="text-space-silver font-rajdhani">Anomaly Detection</span>
                    <span className="font-rajdhani font-bold text-green-400">SCANNING</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Simulation Tab */}
          {activeTab === 'simulation' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Simulation Controls */}
              <div className="card-space">
                <h2 className="text-2xl font-orbitron font-bold text-space-white mb-6">
                  Navigation Simulation
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-space-silver font-rajdhani mb-2">
                      Mission Instruction
                    </label>
                    <textarea
                      value={simulationParams.instruction}
                      onChange={(e) => setSimulationParams({...simulationParams, instruction: e.target.value})}
                      className="w-full px-4 py-3 bg-space-blue/30 border border-space-cyan/30 rounded-lg text-space-white font-rajdhani focus:outline-none focus:border-space-cyan resize-none"
                      rows="3"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-space-silver font-rajdhani mb-2">
                        Steps: {simulationParams.steps}
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={simulationParams.steps}
                        onChange={(e) => setSimulationParams({...simulationParams, steps: parseInt(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-space-silver font-rajdhani mb-2">
                        Anomaly Rate: {(simulationParams.anomalyRate * 100).toFixed(0)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={simulationParams.anomalyRate}
                        onChange={(e) => setSimulationParams({...simulationParams, anomalyRate: parseFloat(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-space-silver font-rajdhani mb-2">
                        Sensitivity: {(simulationParams.sensitivity * 100).toFixed(0)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={simulationParams.sensitivity}
                        onChange={(e) => setSimulationParams({...simulationParams, sensitivity: parseFloat(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={runSimulation}
                  disabled={loading || !isOnline}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Run Simulation
                    </>
                  )}
                </button>
              </div>

              {/* Simulation Results */}
              {simulationData && (
                <>
                  <div className="card-space">
                    <h3 className="text-xl font-orbitron font-bold text-space-white mb-4">
                      Summary
                    </h3>
                    <div 
                      className="prose prose-invert max-w-none text-space-silver font-rajdhani"
                      dangerouslySetInnerHTML={{ __html: simulationData.summary }}
                    />
                  </div>

                  {simulationData.trajectoryPlot && (
                    <div className="card-space">
                      <h3 className="text-xl font-orbitron font-bold text-space-white mb-4">
                        🌌 3D Trajectory Visualization
                      </h3>
                      <div className="bg-space-blue/20 rounded-lg p-4 border border-space-cyan/20">
                        <Plot
                          data={aiApi.parsePlotlyData(simulationData.trajectoryPlot)?.data || []}
                          layout={{
                            ...aiApi.parsePlotlyData(simulationData.trajectoryPlot)?.layout,
                            paper_bgcolor: 'rgba(10,14,39,0.8)',
                            plot_bgcolor: 'rgba(10,14,39,0.8)',
                            font: { 
                              color: '#e8f4f8',
                              family: 'Rajdhani, sans-serif',
                              size: 12
                            },
                            showlegend: true,
                            legend: {
                              bgcolor: 'rgba(10,14,39,0.7)',
                              bordercolor: 'rgba(100,181,246,0.3)',
                              borderwidth: 1,
                              font: { size: 11 }
                            },
                            margin: { l: 10, r: 10, t: 40, b: 10 },
                            scene: {
                              bgcolor: 'rgba(10,14,39,0.5)',
                              xaxis: { 
                                title: { text: 'X Position', font: { size: 12, color: '#64b5f6' } },
                                gridcolor: 'rgba(100,181,246,0.3)',
                                zerolinecolor: 'rgba(100,181,246,0.4)',
                                showgrid: true,
                                showbackground: true,
                                backgroundcolor: 'rgba(10,14,39,0.3)'
                              },
                              yaxis: { 
                                title: { text: 'Y Position', font: { size: 12, color: '#64b5f6' } },
                                gridcolor: 'rgba(100,181,246,0.3)',
                                zerolinecolor: 'rgba(100,181,246,0.4)',
                                showgrid: true,
                                showbackground: true,
                                backgroundcolor: 'rgba(10,14,39,0.3)'
                              },
                              zaxis: { 
                                title: { text: 'Z Position', font: { size: 12, color: '#64b5f6' } },
                                gridcolor: 'rgba(100,181,246,0.3)',
                                zerolinecolor: 'rgba(100,181,246,0.4)',
                                showgrid: true,
                                showbackground: true,
                                backgroundcolor: 'rgba(10,14,39,0.3)'
                              },
                              camera: {
                                eye: { x: 1.5, y: 1.5, z: 1.3 }
                              }
                            }
                          }}
                          config={{ 
                            responsive: true,
                            displayModeBar: true,
                            displaylogo: false,
                            modeBarButtonsToRemove: ['lasso2d', 'select2d']
                          }}
                          className="w-full"
                          style={{ height: '600px' }}
                        />
                      </div>
                    </div>
                  )}

                  {simulationData.sensorPlot && (
                    <div className="card-space">
                      <h3 className="text-xl font-orbitron font-bold text-space-white mb-4">
                        📊 Sensor Data Over Time
                      </h3>
                      <div className="bg-space-blue/20 rounded-lg p-4 border border-space-cyan/20">
                        {(() => {
                          const plotData = aiApi.parsePlotlyData(simulationData.sensorPlot);
                          
                          // If it's a matplotlib image
                          if (plotData && plotData.type === 'image') {
                            return (
                              <img 
                                src={plotData.data} 
                                alt="Sensor Data Over Time"
                                className="w-full rounded-lg"
                                style={{ maxHeight: '600px', objectFit: 'contain', backgroundColor: 'transparent' }}
                              />
                            );
                          }
                          
                          // If it's a direct base64 string
                          if (typeof simulationData.sensorPlot === 'string' && simulationData.sensorPlot.startsWith('data:image')) {
                            return (
                              <img 
                                src={simulationData.sensorPlot} 
                                alt="Sensor Data Over Time"
                                className="w-full rounded-lg"
                                style={{ maxHeight: '600px', objectFit: 'contain', backgroundColor: 'transparent' }}
                              />
                            );
                          }
                          
                          // Otherwise render as Plotly
                          if (plotData && plotData.data) {
                            return (
                              <Plot
                                data={plotData.data}
                                layout={{
                                  ...plotData.layout,
                                  paper_bgcolor: 'rgba(10,14,39,0.8)',
                                  plot_bgcolor: 'rgba(10,14,39,0.8)',
                                  font: { 
                                    color: '#e8f4f8',
                                    family: 'Rajdhani, sans-serif',
                                    size: 12
                                  },
                                  xaxis: {
                                    title: { text: 'Time Step', font: { size: 14, color: '#64b5f6' } },
                                    gridcolor: 'rgba(100,181,246,0.3)',
                                    zerolinecolor: 'rgba(100,181,246,0.4)',
                                    tickfont: { size: 11 },
                                    showgrid: true
                                  },
                                  yaxis: {
                                    title: { text: 'Value', font: { size: 14, color: '#64b5f6' } },
                                    gridcolor: 'rgba(100,181,246,0.3)',
                                    zerolinecolor: 'rgba(100,181,246,0.4)',
                                    tickfont: { size: 11 },
                                    showgrid: true
                                  },
                                  showlegend: true,
                                  legend: {
                                    bgcolor: 'rgba(10,14,39,0.7)',
                                    bordercolor: 'rgba(100,181,246,0.3)',
                                    borderwidth: 1,
                                    font: { size: 11 }
                                  },
                                  margin: { l: 60, r: 40, t: 40, b: 60 },
                                  hovermode: 'closest'
                                }}
                                config={{ 
                                  responsive: true,
                                  displayModeBar: true,
                                  displaylogo: false,
                                  modeBarButtonsToRemove: ['lasso2d', 'select2d']
                                }}
                                className="w-full"
                                style={{ height: '500px' }}
                              />
                            );
                          }
                          
                          return (
                            <div className="text-space-silver text-center py-8">
                              <p>Chart data not available</p>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {simulationData.detailsTable && simulationData.detailsTable.length > 0 && (
                    <div className="card-space">
                      <h3 className="text-xl font-orbitron font-bold text-space-white mb-4">
                        Step-by-Step Details
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm font-rajdhani">
                          <thead>
                            <tr className="border-b border-space-cyan/30">
                              <th className="px-4 py-3 text-left text-space-cyan">Step</th>
                              <th className="px-4 py-3 text-left text-space-cyan">Anomaly</th>
                              <th className="px-4 py-3 text-left text-space-cyan">Thrust X</th>
                              <th className="px-4 py-3 text-left text-space-cyan">Thrust Y</th>
                              <th className="px-4 py-3 text-left text-space-cyan">Thrust Z</th>
                              <th className="px-4 py-3 text-left text-space-cyan">Roll</th>
                              <th className="px-4 py-3 text-left text-space-cyan">Pitch</th>
                              <th className="px-4 py-3 text-left text-space-cyan">Yaw</th>
                              <th className="px-4 py-3 text-left text-space-cyan">Fuel</th>
                              <th className="px-4 py-3 text-left text-space-cyan">Distance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {simulationData.detailsTable.map((row, idx) => (
                              <tr 
                                key={idx} 
                                className="border-b border-space-blue/20 hover:bg-space-blue/10 transition-colors"
                              >
                                {row.map((cell, cellIdx) => (
                                  <td 
                                    key={cellIdx} 
                                    className={`px-4 py-3 ${
                                      cellIdx === 1 && cell === 'Yes' 
                                        ? 'text-red-400 font-bold' 
                                        : 'text-space-silver'
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* Attack Scenario Tab */}
          {activeTab === 'attack' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Attack Controls */}
              <div className="card-space">
                <h2 className="text-2xl font-orbitron font-bold text-space-white mb-6">
                  Attack Defense Testing
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-space-silver font-rajdhani mb-2">
                      Mission Instruction
                    </label>
                    <textarea
                      value={attackParams.instruction}
                      onChange={(e) => setAttackParams({...attackParams, instruction: e.target.value})}
                      className="w-full px-4 py-3 bg-space-blue/30 border border-space-cyan/30 rounded-lg text-space-white font-rajdhani focus:outline-none focus:border-space-cyan resize-none"
                      rows="3"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-space-silver font-rajdhani mb-2">
                        Total Steps: {attackParams.totalSteps}
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={attackParams.totalSteps}
                        onChange={(e) => setAttackParams({...attackParams, totalSteps: parseInt(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-space-silver font-rajdhani mb-2">
                        Attack Start: {attackParams.attackStart}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max={attackParams.totalSteps - 10}
                        value={attackParams.attackStart}
                        onChange={(e) => setAttackParams({...attackParams, attackStart: parseInt(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-space-silver font-rajdhani mb-2">
                        Attack Duration: {attackParams.attackDuration}
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="30"
                        value={attackParams.attackDuration}
                        onChange={(e) => setAttackParams({...attackParams, attackDuration: parseInt(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={runAttackScenario}
                  disabled={loading || !isOnline}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Run Attack Scenario
                    </>
                  )}
                </button>
              </div>

              {/* Attack Results */}
              {attackData && (
                <>
                  <div className="card-space">
                    <h3 className="text-xl font-orbitron font-bold text-space-white mb-4">
                      Attack Analysis
                    </h3>
                    <div 
                      className="prose prose-invert max-w-none text-space-silver font-rajdhani"
                      dangerouslySetInnerHTML={{ __html: attackData.summary }}
                    />
                  </div>

                  {attackData.trajectoryPlot && (
                    <div className="card-space">
                      <h3 className="text-xl font-orbitron font-bold text-space-white mb-4">
                        Normal vs Attacked Trajectory
                      </h3>
                      <div className="bg-space-blue/20 rounded-lg p-4 border border-space-cyan/20">
                        <Plot
                          data={aiApi.parsePlotlyData(attackData.trajectoryPlot)?.data || []}
                          layout={{
                            ...aiApi.parsePlotlyData(attackData.trajectoryPlot)?.layout,
                            paper_bgcolor: 'rgba(10,14,39,0.8)',
                            plot_bgcolor: 'rgba(10,14,39,0.8)',
                            font: { 
                              color: '#e8f4f8',
                              family: 'Rajdhani, sans-serif',
                              size: 12
                            },
                            xaxis: {
                              gridcolor: 'rgba(100,181,246,0.3)',
                              zerolinecolor: 'rgba(100,181,246,0.4)',
                              showgrid: true
                            },
                            yaxis: {
                              gridcolor: 'rgba(100,181,246,0.3)',
                              zerolinecolor: 'rgba(100,181,246,0.4)',
                              showgrid: true
                            },
                            showlegend: true,
                            legend: {
                              bgcolor: 'rgba(10,14,39,0.7)',
                              bordercolor: 'rgba(100,181,246,0.3)',
                              borderwidth: 1
                            },
                            margin: { l: 60, r: 40, t: 40, b: 60 }
                          }}
                          config={{ 
                            responsive: true,
                            displayModeBar: true,
                            displaylogo: false
                          }}
                          className="w-full"
                          style={{ height: '500px' }}
                        />
                      </div>
                    </div>
                  )}

                  {attackData.detectionPlot && (
                    <div className="card-space">
                      <h3 className="text-xl font-orbitron font-bold text-space-white mb-4">
                        Attack Detection & Response
                      </h3>
                      <div className="bg-space-blue/20 rounded-lg p-4 border border-space-cyan/20">
                        {(() => {
                          const plotData = aiApi.parsePlotlyData(attackData.detectionPlot);
                          
                          // If it's a matplotlib image
                          if (plotData && plotData.type === 'image') {
                            return (
                              <img 
                                src={plotData.data} 
                                alt="Attack Detection Timeline"
                                className="w-full rounded-lg"
                                style={{ maxHeight: '600px', objectFit: 'contain', backgroundColor: 'transparent' }}
                              />
                            );
                          }
                          
                          // If we have Plotly data, render Plot component
                          if (plotData && plotData.data) {
                            return (
                              <Plot
                                data={plotData.data}
                                layout={{
                                  ...plotData.layout,
                                  paper_bgcolor: 'rgba(10,14,39,0.8)',
                                  plot_bgcolor: 'rgba(10,14,39,0.8)',
                                  font: { 
                                    color: '#e8f4f8',
                                    family: 'Rajdhani, sans-serif',
                                    size: 12
                                  },
                                  xaxis: {
                                    gridcolor: 'rgba(100,181,246,0.3)',
                                    zerolinecolor: 'rgba(100,181,246,0.4)',
                                    showgrid: true
                                  },
                                  yaxis: {
                                    gridcolor: 'rgba(100,181,246,0.3)',
                                    zerolinecolor: 'rgba(100,181,246,0.4)',
                                    showgrid: true
                                  },
                                  showlegend: true,
                                  legend: {
                                    bgcolor: 'rgba(10,14,39,0.7)',
                                    bordercolor: 'rgba(100,181,246,0.3)',
                                    borderwidth: 1
                                  },
                                  margin: { l: 60, r: 40, t: 40, b: 60 }
                                }}
                                config={{ 
                                  responsive: true,
                                  displayModeBar: true,
                                  displaylogo: false
                                }}
                                className="w-full"
                                style={{ height: '500px' }}
                              />
                            );
                          }
                          
                          // If it's a direct base64 string
                          if (typeof attackData.detectionPlot === 'string' && attackData.detectionPlot.startsWith('data:image')) {
                            return (
                              <img 
                                src={attackData.detectionPlot} 
                                alt="Attack Detection Timeline"
                                className="w-full rounded-lg"
                                style={{ maxHeight: '600px', objectFit: 'contain', backgroundColor: 'transparent' }}
                              />
                            );
                          }
                          
                          // Fallback
                          return (
                            <div className="text-space-silver text-center py-8">
                              <p>Chart data format not recognized</p>
                              <p className="text-sm text-space-silver/60 mt-2">Check console for details</p>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {attackData.deviationPlot && (
                    <div className="card-space">
                      <h3 className="text-xl font-orbitron font-bold text-space-white mb-4">
                        Sensor Data Deviations
                      </h3>
                      <div className="bg-space-blue/20 rounded-lg p-4 border border-space-cyan/20">
                        {(() => {
                          const plotData = aiApi.parsePlotlyData(attackData.deviationPlot);
                          
                          // If it's a matplotlib image
                          if (plotData && plotData.type === 'image') {
                            return (
                              <img 
                                src={plotData.data} 
                                alt="Sensor Data Deviations"
                                className="w-full rounded-lg"
                                style={{ maxHeight: '600px', objectFit: 'contain', backgroundColor: 'transparent' }}
                              />
                            );
                          }
                          
                          // If we have Plotly data, render Plot component
                          if (plotData && plotData.data) {
                            return (
                              <Plot
                                data={plotData.data}
                                layout={{
                                  ...plotData.layout,
                                  paper_bgcolor: 'rgba(10,14,39,0.8)',
                                  plot_bgcolor: 'rgba(10,14,39,0.8)',
                                  font: { 
                                    color: '#e8f4f8',
                                    family: 'Rajdhani, sans-serif',
                                    size: 12
                                  },
                                  xaxis: {
                                    gridcolor: 'rgba(100,181,246,0.3)',
                                    zerolinecolor: 'rgba(100,181,246,0.4)',
                                    showgrid: true
                                  },
                                  yaxis: {
                                    gridcolor: 'rgba(100,181,246,0.3)',
                                    zerolinecolor: 'rgba(100,181,246,0.4)',
                                    showgrid: true
                                  },
                                  showlegend: true,
                                  legend: {
                                    bgcolor: 'rgba(10,14,39,0.7)',
                                    bordercolor: 'rgba(100,181,246,0.3)',
                                    borderwidth: 1
                                  },
                                  margin: { l: 60, r: 40, t: 40, b: 60 }
                                }}
                                config={{ 
                                  responsive: true,
                                  displayModeBar: true,
                                  displaylogo: false
                                }}
                                className="w-full"
                                style={{ height: '500px' }}
                              />
                            );
                          }
                          
                          // If it's a direct base64 string
                          if (typeof attackData.deviationPlot === 'string' && attackData.deviationPlot.startsWith('data:image')) {
                            return (
                              <img 
                                src={attackData.deviationPlot} 
                                alt="Sensor Data Deviations"
                                className="w-full rounded-lg"
                                style={{ maxHeight: '600px', objectFit: 'contain', backgroundColor: 'transparent' }}
                              />
                            );
                          }
                          
                          // Fallback
                          return (
                            <div className="text-space-silver text-center py-8">
                              <p>Chart data format not recognized</p>
                              <p className="text-sm text-space-silver/60 mt-2">Check console for details</p>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="card-space">
                <h2 className="text-2xl font-orbitron font-bold text-space-white mb-6">
                  Performance Analytics
                </h2>
                
                <button
                  onClick={runAnalytics}
                  disabled={loading || !isOnline}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Run Analytics Test
                    </>
                  )}
                </button>

                {analyticsData && (
                  <div 
                    className="prose prose-invert max-w-none text-space-silver font-rajdhani"
                    dangerouslySetInnerHTML={{ __html: analyticsData.results }}
                  />
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
