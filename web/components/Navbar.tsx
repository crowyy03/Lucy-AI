import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SmallLogo } from './SmallLogo';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Возможности', href: '#features' },
    { name: 'Сценарии', href: '#cases' },
    { name: 'Тарифы', href: '#pricing' },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'glass-nav py-2' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative w-12 h-8 text-white group-hover:text-lavender transition-colors duration-300">
               <SmallLogo className="w-full h-full" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white group-hover:text-lavender transition-colors">
              Lucy AI
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {links.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="text-zinc-400 hover:text-white transition-colors duration-200 px-3 py-2 text-sm font-medium tracking-wide"
                >
                  {link.name}
                </button>
              ))}
              <button onClick={() => handleNavClick('#contact')} className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-2 rounded-full text-sm font-medium transition-all hover:border-lavender/50 hover:shadow-[0_0_15px_rgba(216,180,254,0.3)]">
                Связаться
              </button>
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-bg border-b border-zinc-800 absolute w-full"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {links.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="text-zinc-300 hover:text-lavender block w-full text-left px-3 py-4 text-base font-medium border-b border-zinc-800"
                >
                  {link.name}
                </button>
              ))}
              <button onClick={() => handleNavClick('#contact')} className="w-full mt-4 bg-lavender text-zinc-900 font-bold py-3 rounded-xl">
                Связаться
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};