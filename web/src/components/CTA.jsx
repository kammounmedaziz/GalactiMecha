import React from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket,
  ArrowRight,
  Sparkles,
  Globe2
} from 'lucide-react';

const CTA = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-nebula/20 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-space-cyan/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-morphism rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
        >
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-space-cyan/30 rounded-tl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-space-cyan/30 rounded-br-3xl"></div>
          
          {/* Floating Icons */}
          <div className="absolute top-8 right-8 animate-float">
            <Sparkles className="w-8 h-8 text-space-cyan/50" />
          </div>
          <div className="absolute bottom-8 left-8 animate-float" style={{ animationDelay: '2s' }}>
            <Globe2 className="w-8 h-8 text-cosmic-nebula/50" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-space-cyan/10 border border-space-cyan/30 mb-8"
            >
              <Rocket className="w-4 h-4 text-space-cyan animate-bounce" />
              <span className="text-sm font-rajdhani font-medium text-space-cyan">
                Ready for Launch
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-6xl font-orbitron font-bold mb-6"
            >
              Begin Your <span className="neon-text">Cosmic Journey</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-space-silver font-rajdhani max-w-2xl mx-auto mb-10"
            >
              Join thousands of explorers navigating the cosmos with the most
              advanced AI navigation system ever created.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button className="btn-primary group text-lg px-10 py-5">
                <span>Start Free Trial</span>
                <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <button className="btn-secondary group text-lg px-10 py-5">
                <span>Contact Sales</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 text-sm text-space-silver/70 font-rajdhani"
            >
              No credit card required • 14-day free trial • Cancel anytime
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
