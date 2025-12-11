import React from 'react';

export const SmallLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* 
         Continuous Pulse Line (Soundwave)
         M (Move) -> L (Line) coordinates calculated to mimic the specific image shape:
         Horizontal start -> Small spike -> Medium spike -> Tallest spike -> Medium spike -> Small spike -> Horizontal end
      */}
      <path 
        d="M5 25 L20 25 L25 15 L30 35 L35 10 L40 40 L50 5 L60 45 L65 15 L70 35 L75 20 L80 25 L95 25" 
        stroke="currentColor" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};