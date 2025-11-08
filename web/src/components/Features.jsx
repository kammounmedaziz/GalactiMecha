import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Shield, 
  Zap, 
  Target, 
  Brain, 
  Layers,
  Radar,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI Navigation',
      description: 'Advanced neural networks predict optimal trajectories through space-time with quantum precision.',
      color: 'from-space-cyan to-cosmic-nebula',
      delay: 0.1,
    },
    {
      icon: Radar,
      title: 'Anomaly Detection',
      description: 'Real-time scanning and identification of cosmic anomalies, wormholes, and gravitational distortions.',
      color: 'from-cosmic-nebula to-cosmic-galaxy',
      delay: 0.2,
    },
    {
      icon: Shield,
      title: 'Defense Matrix',
      description: 'Multi-layered protection systems against asteroid swarms, solar flares, and hostile entities.',
      color: 'from-cosmic-galaxy to-space-cyan',
      delay: 0.3,
    },
    {
      icon: Target,
      title: 'Precision Targeting',
      description: 'Lock onto any celestial body or target with sub-millisecond accuracy across vast distances.',
      color: 'from-space-cyan to-cosmic-nebula',
      delay: 0.4,
    },
    {
      icon: Layers,
      title: 'Multi-Dimensional Analysis',
      description: 'Process data across multiple dimensions and timelines for optimal decision-making.',
      color: 'from-cosmic-nebula to-cosmic-galaxy',
      delay: 0.5,
    },
    {
      icon: Zap,
      title: 'Quantum Computing',
      description: 'Harness quantum entanglement for instantaneous calculations across light-years of distance.',
      color: 'from-cosmic-galaxy to-space-cyan',
      delay: 0.6,
    },
  ];

  const stats = [
    {
      icon: Cpu,
      value: '10 PetaFLOPS',
      label: 'Processing Power',
      description: 'Ultra-fast quantum computations',
    },
    {
      icon: AlertTriangle,
      value: '0.001%',
      label: 'Error Rate',
      description: 'Near-perfect accuracy',
    },
    {
      icon: TrendingUp,
      value: '24/7',
      label: 'Uptime',
      description: 'Always operational',
    },
  ];

  return (
    <section id="ai" className="relative py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 w-96 h-96 bg-cosmic-nebula/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/2 w-96 h-96 bg-space-cyan/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-morphism mb-6"
          >
            <Cpu className="w-4 h-4 text-space-cyan" />
            <span className="text-sm font-rajdhani font-medium text-space-silver">
              Advanced Capabilities
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="section-title"
          >
            Beyond <span className="neon-text">Human Limits</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-space-silver font-rajdhani max-w-3xl mx-auto"
          >
            Powered by cutting-edge AI technology that pushes the boundaries
            of what's possible in interstellar navigation.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: feature.delay }}
                className="card-space group hover:scale-105 transition-all duration-300"
              >
                <div className="relative mb-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:animate-pulse-slow`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className={`absolute inset-0 w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} blur-xl opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                </div>

                <h3 className="text-2xl font-orbitron font-bold text-space-white mb-3 group-hover:text-glow">
                  {feature.title}
                </h3>

                <p className="text-space-silver font-rajdhani leading-relaxed">
                  {feature.description}
                </p>

                <div className="mt-6 pt-6 border-t border-space-cyan/20">
                  <a
                    href="#"
                    className="inline-flex items-center text-space-cyan hover:text-space-cyan/80 font-rajdhani font-medium transition-colors"
                  >
                    Learn More
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-morphism rounded-2xl p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-r from-cosmic-nebula to-space-cyan flex items-center justify-center">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-3xl font-orbitron font-bold neon-text mb-1">
                      {stat.value}
                    </div>
                    <div className="text-space-white font-rajdhani font-medium mb-1">
                      {stat.label}
                    </div>
                    <div className="text-sm text-space-silver">
                      {stat.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
