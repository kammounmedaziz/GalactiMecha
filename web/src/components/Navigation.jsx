import React, { useState, useEffect } from 'react';
import { Menu, X, Rocket, UserPlus, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Login', action: () => navigate('/login'), icon: LogIn },
    { name: 'Register', action: () => navigate('/register'), icon: UserPlus },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-morphism shadow-lg shadow-space-cyan/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-3"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cosmic-nebula to-space-cyan flex items-center justify-center animate-pulse-slow">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div className="absolute inset-0 w-12 h-12 rounded-full bg-gradient-to-r from-cosmic-nebula to-space-cyan blur-xl opacity-50 animate-pulse-slow"></div>
              </div>
              <span className="text-2xl font-orbitron font-bold neon-text">
                GalactiMecha
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={item.action}
                    className="group px-4 py-2 rounded-lg text-space-silver hover:text-space-cyan transition-all duration-300 font-rajdhani font-medium text-lg relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cosmic-nebula/20 to-space-cyan/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cosmic-nebula to-space-cyan scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button 
              onClick={() => navigate('/login')}
              className="btn-primary group"
            >
              <span>Launch Mission</span>
              <Rocket className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-space-cyan hover:bg-space-cyan/10 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden glass-morphism border-t border-space-cyan/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    item.action();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-space-silver hover:text-space-cyan hover:bg-space-cyan/10 transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-rajdhani font-medium">{item.name}</span>
                </button>
              );
            })}
            <button 
              onClick={() => {
                navigate('/login');
                setIsOpen(false);
              }}
              className="w-full btn-primary mt-4"
            >
              <span>Launch Mission</span>
              <Rocket className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
