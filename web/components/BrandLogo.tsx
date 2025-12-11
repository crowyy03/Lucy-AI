import React, { useEffect, useRef } from 'react';

interface BrandLogoProps {
  className?: string;
}

interface Particle {
  targetX: number;
  targetY: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  type: 'text' | 'wave';
  randomX: number;
  randomY: number;
  assemblyDelay: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = "w-full h-full" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track mouse position
  const mouseRef = useRef({ x: -9999, y: -9999, vx: 0, vy: 0, lastX: -9999, lastY: -9999 });
  const startTimeRef = useRef<number>(Date.now());
  const isMobileRef = useRef<boolean>(false);

  // Scroll Effect (Throttle this or use lightweight transforms)
  useEffect(() => {
    isMobileRef.current = window.innerWidth < 768;

    const handleScroll = () => {
       if (containerRef.current) {
          const scrollY = window.scrollY;
          // Reduce effects on mobile to save GPU
          if (isMobileRef.current && scrollY > 100) return;

          const opacity = Math.max(1 - scrollY / 700, 0); 
          const scale = Math.max(1 - scrollY / 1500, 0.9);
          
          // Removed blur filter on scroll for performance
          containerRef.current.style.opacity = `${opacity}`;
          containerRef.current.style.transform = `scale(${scale})`;
          containerRef.current.style.pointerEvents = opacity <= 0.05 ? 'none' : 'auto';
       }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse Tracking (Desktop Only)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (window.innerWidth < 768) return; // Disable on mobile

        const currentX = e.clientX;
        const currentY = e.clientY;
        
        const dx = currentX - mouseRef.current.lastX;
        const dy = currentY - mouseRef.current.lastY;
        
        mouseRef.current.x = currentX;
        mouseRef.current.y = currentY;
        mouseRef.current.vx = dx; 
        mouseRef.current.vy = dy;
        mouseRef.current.lastX = currentX;
        mouseRef.current.lastY = currentY;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true, alpha: true });
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const ASSEMBLY_START_GLOBAL = 500; 
    const MAX_ASSEMBLY_DELAY = 1500;    
    const WAVE_APPEAR_TIME = 2000;      

    const initParticles = (w: number, h: number) => {
      particles = [];
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      tempCanvas.width = w;
      tempCanvas.height = h;
      const centerY = h / 2;

      // 1. Generate Text Bitmap
      // Make text slightly larger on mobile for readability
      const fontSize = Math.min(w * (isMobileRef.current ? 0.22 : 0.18), 220); 
      tempCtx.font = `900 ${fontSize}px "Inter", sans-serif`;
      tempCtx.textAlign = 'center';
      tempCtx.textBaseline = 'middle';
      tempCtx.fillStyle = 'white';
      tempCtx.fillText('Lucy AI', w / 2, centerY - 20);

      const imageData = tempCtx.getImageData(0, 0, w, h).data;
      
      // Optimization: Skip more pixels on mobile to reduce particle count
      const skip = isMobileRef.current ? 6 : 4;

      // 2. Create Text Particles
      for (let y = 0; y < h; y += skip) {
        for (let x = 0; x < w; x += skip) {
          const index = (y * w + x) * 4;
          if (imageData[index + 3] > 128) {
             const rand = Math.random();
             const color = rand > 0.6 ? '#D8B4FE' : '#FFFFFF';
             
             particles.push({
               targetX: x,
               targetY: y,
               x: (Math.random() - 0.5) * w * 3,
               y: (Math.random() - 0.5) * h * 3,
               z: Math.random() * w * 2 + 100,
               vx: 0,
               vy: 0,
               color: color,
               size: isMobileRef.current ? 1.5 : (Math.random() * 2 + 1),
               type: 'text',
               randomX: (Math.random() - 0.5) * w, 
               randomY: (Math.random() - 0.5) * h,
               assemblyDelay: Math.random() * MAX_ASSEMBLY_DELAY 
             });
          }
        }
      }

      // 3. Create Wave Particles
      const wavePoints = isMobileRef.current ? 80 : 180;
      for (let i = 0; i < wavePoints; i++) {
        for (let layer = 0; layer < 3; layer++) {
             const tx = (w / wavePoints) * i;
             const ty = centerY - 20; 
             particles.push({
                targetX: tx,
                targetY: ty,
                x: (Math.random() - 0.5) * w,
                y: (Math.random() - 0.5) * h,
                z: Math.random() * w * 2 + 100,
                vx: 0,
                vy: 0,
                color: layer === 0 ? '#D8B4FE' : layer === 1 ? '#658491' : '#FFFFFF',
                size: Math.random() * 2 + 1.5,
                type: 'wave',
                randomX: (Math.random() - 0.5) * w,
                randomY: (Math.random() - 0.5) * h,
                assemblyDelay: 0 
             });
        }
      }
    };

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      // Prevent re-init on mobile address bar scroll (width doesn't change usually)
      if (Math.abs(newWidth - width) < 50 && Math.abs(newHeight - height) < 150) return;

      width = newWidth;
      height = newHeight;
      isMobileRef.current = width < 768;
      
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      initParticles(width, height);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      
      // Gradually decrease mouse velocity
      mouseRef.current.vx *= 0.9;
      mouseRef.current.vy *= 0.9;

      ctx.clearRect(0, 0, width, height);
      
      const mx = mouseRef.current.x; 
      const my = mouseRef.current.y; 
      const mvx = mouseRef.current.vx;
      const mvy = mouseRef.current.vy;
      
      const timeSec = elapsed * 0.001;
      const isMobile = isMobileRef.current;

      particles.forEach((p, i) => {
        const isTextReady = p.type === 'text' && (elapsed > ASSEMBLY_START_GLOBAL + p.assemblyDelay);
        const isWaveReady = p.type === 'wave' && (elapsed > WAVE_APPEAR_TIME);
        const isStable = isTextReady || isWaveReady;

        if (!isStable) {
            // WARP DRIVE (Simplified for mobile perf)
            p.z -= 25; 
            if (p.z <= 1) {
                p.z = width * 2; 
                p.x = (Math.random() - 0.5) * width;
                p.y = (Math.random() - 0.5) * height;
            }
            const fov = 300;
            const scale = fov / p.z;
            p.x = (width / 2) + p.randomX * scale;
            p.y = (height / 2) + p.randomY * scale;
        } else {
            // STABLE MODE
            let destX = p.targetX;
            let destY = p.targetY;

            // Wave/Breath
            if (p.type === 'wave') {
                const layer = i % 3;
                const freq = 0.01 + layer * 0.005;
                const speed = 2 + layer;
                const amp = 30 + layer * 15;
                destY = p.targetY + Math.sin(p.targetX * freq + timeSec * speed) * amp;
            } else {
                const freq = 0.01;
                const speed = 2; 
                const amp = 4;
                destY = p.targetY + Math.sin(p.targetX * freq + timeSec * speed) * amp;
            }

            // --- FLUID MOUSE PHYSICS (SKIP ON MOBILE) ---
            if (!isMobile) {
                const dx = p.x - mx;
                const dy = p.y - my;
                // Fast distance check (box check) before sqrt
                if (Math.abs(dx) < 160 && Math.abs(dy) < 160) {
                     const dist = Math.sqrt(dx*dx + dy*dy);
                     const interactionRadius = 160; 
        
                     if (dist < interactionRadius) {
                        const influence = Math.pow(1 - dist / interactionRadius, 3);
                        const angle = Math.atan2(dy, dx);
                        const repelForce = 15 * influence;
                        p.vx += Math.cos(angle) * repelForce;
                        p.vy += Math.sin(angle) * repelForce;
                        
                        const dragFactor = 0.4 * influence;
                        p.vx += mvx * dragFactor;
                        p.vy += mvy * dragFactor;
                     }
                }
            }

            // Spring Physics
            const springStiffness = p.type === 'wave' ? 0.04 : 0.03;
            p.vx += (destX - p.x) * springStiffness;
            p.vy += (destY - p.y) * springStiffness;

            // Friction
            p.vx *= 0.88; 
            p.vy *= 0.88;

            p.x += p.vx;
            p.y += p.vy;
        }

        // --- RENDER ---
        let alpha = 1;
        
        if (p.type === 'wave') {
             if (elapsed < WAVE_APPEAR_TIME) {
                 alpha = 0;
             } else {
                 alpha = Math.min((elapsed - WAVE_APPEAR_TIME) / 1000, 1);
             }
        } else {
            if (!isStable) {
                alpha = Math.min(1, 500 / p.z);
            } else {
                alpha = 1;
            }
        }

        if (alpha > 0.1) { // Threshold optimization
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            
            // Only use shadow blur on desktop for waves
            if (!isMobile && p.type === 'wave' && alpha > 0.8) {
                ctx.shadowBlur = 8;
                ctx.shadowColor = p.color;
            } else {
                ctx.shadowBlur = 0;
            }

            // Draw Rects (Particles) instead of Arcs (Circles) for performance and style
            const s = p.size;
            ctx.fillRect(p.x, p.y, s, s);
        }
      });
      
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // Tagline
      if (elapsed > WAVE_APPEAR_TIME) {
          const taglineAlpha = Math.min((elapsed - WAVE_APPEAR_TIME) / 1500, 1);
          if (taglineAlpha > 0) {
              const centerY = height / 2;
              const taglineSize = Math.min(width * 0.04, 24); 
              ctx.font = `600 ${taglineSize}px "Inter", sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              
              const tagline = "ГОЛОС ВАШЕГО БИЗНЕСА";
              const spacedTagline = tagline.split('').join('  ');
              
              ctx.fillStyle = `rgba(255, 255, 255, ${taglineAlpha * 0.9})`;
              // No shadow on mobile text
              if (!isMobile) {
                  ctx.shadowBlur = 15;
                  ctx.shadowColor = `rgba(216, 180, 254, ${taglineAlpha * 0.5})`;
              }
              ctx.fillText(spacedTagline, width / 2, centerY + 120);
          }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className={`${className} transition-all duration-100 ease-out will-change-transform`}>
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};