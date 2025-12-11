import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useIsTouchDevice } from '../hooks/useIsTouchDevice';

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
  const isTouch = useIsTouchDevice();
  const isTouchRef = useRef(false);
  const disableInteractionsRef = useRef(false);
  
  // Track mouse position AND velocity for "drag" effect
  const mouseRef = useRef({ x: -9999, y: -9999, vx: 0, vy: 0, lastX: -9999, lastY: -9999 });
  const startTimeRef = useRef<number>(Date.now());

  // Синхронизируем актуальное значение тача в ref, чтобы колбэки видели свежие данные
  useEffect(() => {
    isTouchRef.current = isTouch;
    if (typeof window !== 'undefined') {
      const coarse = window.matchMedia('(any-pointer: coarse)').matches;
      const hoverNone = window.matchMedia('(any-hover: none)').matches;
      disableInteractionsRef.current = isTouch || coarse || hoverNone;
    } else {
      disableInteractionsRef.current = isTouch;
    }
  }, [isTouch]);

  // Мгновенно фиксируем состояние до первой отрисовки, чтобы исключить реакцию на первый скролл
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const disable = disableInteractionsRef.current;
    if (disable) {
      containerRef.current.style.filter = 'blur(0px)';
      containerRef.current.style.opacity = '1';
      containerRef.current.style.transform = 'scale(1)';
      containerRef.current.style.pointerEvents = 'none';
    }
  }, []);

  // Scroll Effect (отключаем на таче/коурс)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const disable = disableInteractionsRef.current;
    if (disable) {
      container.style.filter = 'blur(0px)';
      container.style.opacity = '1';
      container.style.transform = 'scale(1)';
      container.style.pointerEvents = 'none';
      return;
    }

    const handleScroll = () => {
       if (disableInteractionsRef.current) return;
       if (containerRef.current) {
          const scrollY = window.scrollY;
          // Лого всегда остаётся, но при скролле уходит на задний план и чуть размывается
          const blur = Math.min(scrollY / 80, 6); 
          const opacity = Math.max(1 - scrollY / 1200, 0.35); 
          const scale = Math.max(1 - scrollY / 5000, 0.98);
          
          containerRef.current.style.filter = `blur(${blur}px)`;
          containerRef.current.style.opacity = `${opacity}`;
          containerRef.current.style.transform = `scale(${scale})`;
          containerRef.current.style.pointerEvents = opacity <= 0.05 ? 'none' : 'auto';
       }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isTouch]);

  // Для тач-устройств фиксируем состояние (без реакции на скролл/клик)
  useEffect(() => {
    if (!isTouch || !containerRef.current) return;
    containerRef.current.style.filter = 'blur(0px)';
    containerRef.current.style.opacity = '1';
    containerRef.current.style.transform = 'scale(1)';
    containerRef.current.style.pointerEvents = 'none';
  }, [isTouch]);

  // Advanced Mouse Tracking
  useEffect(() => {
    if (disableInteractionsRef.current) return; // На таче/коурс не вешаем мышиные обработчики
    const handleMouseMove = (e: MouseEvent) => {
        const currentX = e.clientX;
        const currentY = e.clientY;
        
        // Calculate velocity
        const dx = currentX - mouseRef.current.lastX;
        const dy = currentY - mouseRef.current.lastY;
        
        mouseRef.current.x = currentX;
        mouseRef.current.y = currentY;
        mouseRef.current.vx = dx; // Simple velocity
        mouseRef.current.vy = dy;
        mouseRef.current.lastX = currentX;
        mouseRef.current.lastY = currentY;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isTouch]);

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const ASSEMBLY_START_GLOBAL = 500; 
    const MAX_ASSEMBLY_DELAY = 1500;    
    const WAVE_APPEAR_TIME = 2500;      

    const initParticles = (w: number, h: number) => {
      particles = [];
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      tempCanvas.width = w;
      tempCanvas.height = h;
      const centerY = h / 2;

      // 1. Generate Text Bitmap
      const fontSize = Math.min(w * 0.21, isTouch ? 270 : 250); 
      tempCtx.font = `900 ${fontSize}px "Inter", sans-serif`;
      tempCtx.textAlign = 'center';
      tempCtx.textBaseline = 'middle';
      tempCtx.fillStyle = 'white';
      tempCtx.fillText('Lucy AI', w / 2, centerY - 20);

      const imageData = tempCtx.getImageData(0, 0, w, h).data;
      const skip = isTouch ? 6 : 4; // меньше точек на мобильном для плавности

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
               size: Math.random() * 2 + 1,
               type: 'text',
               randomX: (Math.random() - 0.5) * w, 
               randomY: (Math.random() - 0.5) * h,
               assemblyDelay: Math.random() * MAX_ASSEMBLY_DELAY 
             });
          }
        }
      }

      // 3. Create Wave Particles
      const wavePoints = isTouch ? 120 : 180;
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
      const dprBase = window.devicePixelRatio || 1;
      const dpr = isTouch ? Math.min(dprBase, 1.35) : dprBase;
      width = window.innerWidth;
      height = window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // сбрасываем предыдущий масштаб
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
      
      // Gradually decrease mouse velocity (friction on the mouse tracker itself)
      mouseRef.current.vx *= 0.9;
      mouseRef.current.vy *= 0.9;

      ctx.clearRect(0, 0, width, height);
      
      const interactionsDisabled = disableInteractionsRef.current;
      if (interactionsDisabled) {
        mouseRef.current = { x: -9999, y: -9999, vx: 0, vy: 0, lastX: -9999, lastY: -9999 };
      }

      const mx = interactionsDisabled ? -9999 : mouseRef.current.x; 
      const my = interactionsDisabled ? -9999 : mouseRef.current.y; 
      // Mouse velocity influence
      const mvx = interactionsDisabled ? 0 : mouseRef.current.vx;
      const mvy = interactionsDisabled ? 0 : mouseRef.current.vy;
      
      const timeSec = elapsed * 0.001;

      particles.forEach((p, i) => {
        const isTextReady = p.type === 'text' && (elapsed > ASSEMBLY_START_GLOBAL + p.assemblyDelay);
        const isWaveReady = p.type === 'wave' && (elapsed > WAVE_APPEAR_TIME);
        const isStable = isTextReady || isWaveReady;

        if (!isStable) {
            // WARP DRIVE
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

            // --- FLUID MOUSE PHYSICS ---
            const dx = p.x - mx;
            const dy = p.y - my;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const interactionRadius = disableInteractionsRef.current ? 0 : 160; 

            if (dist < interactionRadius && !disableInteractionsRef.current) {
                const influence = Math.pow(1 - dist / interactionRadius, 3); // Cubic falloff for smoother edge
                
                // Repulsion (push away)
                const angle = Math.atan2(dy, dx);
                const repelForce = 15 * influence;
                p.vx += Math.cos(angle) * repelForce;
                p.vy += Math.sin(angle) * repelForce;

                // Drag (follow mouse movement)
                // If mouse is moving fast, particles get dragged along slightly
                const dragFactor = 0.4 * influence;
                p.vx += mvx * dragFactor;
                p.vy += mvy * dragFactor;
            }

            // Spring Physics (Return home)
            const springStiffness = p.type === 'wave' ? 0.04 : 0.03; // Softer spring for fluid feel
            p.vx += (destX - p.x) * springStiffness;
            p.vy += (destY - p.y) * springStiffness;

            // Friction (Damping)
            // Higher friction = less jitter, more "watery" feel
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

        if (alpha > 0.01) {
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.fillStyle = p.color;
            
            if (p.type === 'wave' && alpha > 0.8) {
                ctx.shadowBlur = 8;
                ctx.shadowColor = p.color;
            } else {
                ctx.shadowBlur = 0;
            }

            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
      });
      
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // Tagline
      const centerY = height / 2;
      const taglineSize = Math.min(width * 0.04, 24); 
      const tagline = "ГОЛОС ВАШЕГО БИЗНЕСА";
      const spacedTagline = tagline.split('').join('  ');

      const taglineAlpha = disableInteractionsRef.current
        ? 0.3
        : Math.min(Math.max((elapsed - WAVE_APPEAR_TIME) / 1500, 0), 1);

      ctx.font = `600 ${taglineSize}px "Inter", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgba(255, 255, 255, ${taglineAlpha})`;
      ctx.shadowBlur = disableInteractionsRef.current ? 8 : 15;
      ctx.shadowColor = `rgba(216, 180, 254, ${taglineAlpha * (disableInteractionsRef.current ? 0.4 : 0.5)})`;
      ctx.filter = disableInteractionsRef.current ? 'blur(2.5px)' : 'none';
      ctx.fillText(spacedTagline, width / 2, centerY + 120);
      ctx.filter = 'none';

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTouch]);

  return (
    <div
      ref={containerRef}
      className={`${className} ${isTouch ? 'transition-none' : 'transition-all duration-100 ease-out'} will-change-transform`}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};