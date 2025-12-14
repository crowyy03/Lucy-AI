import React, { useEffect, useRef } from 'react';

export const GlobalBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const resize = () => {
      width = window.innerWidth;
      height = document.body.scrollHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    const observer = new ResizeObserver(resize);
    observer.observe(document.body);
    window.addEventListener('resize', resize);
    resize();

    const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    const isMobile = width < 768;
    // SUPER LIGHTWEIGHT ON MOBILE
    const particleCount = isMobile ? 20 : 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 2,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      ctx.fillStyle = 'rgba(216, 180, 254, 0.15)';
      
      const currentIsMobile = window.innerWidth < 768;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Disabled lines entirely for better performance on all devices
      
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      observer.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
       <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-[#080a0c] to-dark-bg" />
       <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40" />
    </div>
  );
};