import React from 'react';
import { Github, Twitter, Linkedin, Mail, Rocket } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'API Docs', href: '#docs' },
      { name: 'Changelog', href: '#changelog' },
    ],
    company: [
      { name: 'About', href: '#about' },
      { name: 'Blog', href: '#blog' },
      { name: 'Careers', href: '#careers' },
      { name: 'Press Kit', href: '#press' },
    ],
    resources: [
      { name: 'Documentation', href: '#docs' },
      { name: 'Tutorials', href: '#tutorials' },
      { name: 'Community', href: '#community' },
      { name: 'Support', href: '#support' },
    ],
    legal: [
      { name: 'Privacy', href: '#privacy' },
      { name: 'Terms', href: '#terms' },
      { name: 'Security', href: '#security' },
      { name: 'Compliance', href: '#compliance' },
    ],
  };

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <footer className="relative border-t border-space-cyan/20">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-space-blue/20"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cosmic-nebula to-space-cyan flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-orbitron font-bold neon-text">
                GalactiMecha
              </span>
            </div>
            <p className="text-space-silver font-rajdhani mb-6 leading-relaxed">
              Next-generation AI navigation system for interstellar exploration.
              Navigate the cosmos with confidence.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg glass-morphism flex items-center justify-center text-space-silver hover:text-space-cyan hover:bg-space-cyan/10 transition-all duration-300 group"
                  >
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-space-white font-orbitron font-bold text-sm uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-space-silver hover:text-space-cyan font-rajdhani transition-colors duration-300 inline-flex items-center group"
                    >
                      <span>{link.name}</span>
                      <svg
                        className="w-3 h-3 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-space-cyan/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-space-silver text-sm font-rajdhani">
              © {new Date().getFullYear()} GalactiMecha. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm font-rajdhani">
              <a href="#" className="text-space-silver hover:text-space-cyan transition-colors">
                Status
              </a>
              <span className="text-space-silver/50">•</span>
              <a href="#" className="text-space-silver hover:text-space-cyan transition-colors">
                API Status
              </a>
              <span className="text-space-silver/50">•</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-space-silver">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
