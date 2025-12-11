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
      height = document.body.scrollHeight; // Cover full scroll height
      canvas.width = width;
      canvas.height = height;
    };
    
    // Observer to update height if content grows
    const observer = new ResizeObserver(resize);
    observer.observe(document.body);
    window.addEventListener('resize', resize);
    resize();

    const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    const particleCount = 150; // Density

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 2,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      ctx.fillStyle = 'rgba(216, 180, 254, 0.15)'; // Lavender faint
      ctx.strokeStyle = 'rgba(74, 102, 112, 0.05)'; // Petrol faint line

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connections
        // Only connect to close neighbors to save perf
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx*dx + dy*dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.lineWidth = 1 - (dist / 150);
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

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
       {/* Gradient base */}
       <div
          className={`absolute inset-0 overflow-hidden ${
            typeof window !== "undefined" && window.innerWidth <= 768
              ? "pointer-events-none touch-none"
              : ""
          }`}
        />
       {/* Particles */}
       <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40" />
    </div>
  );
};