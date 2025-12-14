import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section 
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-transparent"
    >
      {/* 
         Changed gradient: 'via-dark-bg/60' -> 'via-transparent'. 
         This makes the center much clearer so the logo is visible. 
         Only the very edges fade to black.
      */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-dark-bg/90 pointer-events-none z-10" />

      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full pointer-events-none">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 2, duration: 1 }}
           className="absolute bottom-[15%] text-zinc-500 text-xs tracking-[0.3em] uppercase opacity-60"
        >
             Scroll to explore
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer z-30 group pointer-events-auto"
        onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <div className="flex flex-col items-center gap-2">
            <ChevronDown className="text-zinc-500 group-hover:text-lavender transition-colors animate-bounce" size={24} />
        </div>
      </motion.div>
    </section>
  );
};