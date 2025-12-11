import React, { useEffect, useRef } from 'react';

export const VoiceWave: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 500;
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      const centerY = canvas.height / 2;
      const colors = ['rgba(216, 180, 254, 0.5)', 'rgba(85, 107, 47, 0.4)', 'rgba(216, 180, 254, 0.2)'];
      
      // Draw multiple sine waves
      for (let j = 0; j < 3; j++) {
        ctx.beginPath();
        ctx.lineWidth = 2 + j;
        ctx.strokeStyle = colors[j];

        for (let x = 0; x < canvas.width; x++) {
          // Complex wave function to simulate voice modulation
          const y = centerY + 
            Math.sin(x * 0.01 + time + j) * 50 * Math.sin(time * 0.5) +
            Math.sin(x * 0.03 + time * 2) * 20;
          
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-0 opacity-60 pointer-events-none mix-blend-screen"
    />
  );
};