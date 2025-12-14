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
  const isMobileRef = useRef<boolean>(false);
  const startTimeRef = useRef<number>(Date.now());
  const particlesRef = useRef<Particle[]>([]);
  const prevWidthRef = useRef<number>(0);
  
  const mouseRef = useRef({ x: 0, y: 0, isActive: false });

  useEffect(() => {
    isMobileRef.current = window.innerWidth < 768;
    prevWidthRef.current = window.innerWidth;

    if (isMobileRef.current && containerRef.current) {
         containerRef.current.style.opacity = '1';
         containerRef.current.style.transform = 'scale(1)';
    }

    const handleScroll = () => {
       if (window.innerWidth < 768) {
           if (containerRef.current && containerRef.current.style.opacity !== '1') {
               containerRef.current.style.opacity = '1';
               containerRef.current.style.transform = 'scale(1)';
           }
           return; 
       }
       if (containerRef.current) {
          const scrollY = window.scrollY;
          const opacity = Math.max(1 - scrollY / 700, 0); 
          const scale = Math.max(1 - scrollY / 1500, 0.9);
          containerRef.current.style.opacity = `${opacity}`;
          containerRef.current.style.transform = `scale(${scale})`;
       }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        mouseRef.current.x = e.clientX - rect.left;
        mouseRef.current.y = e.clientY - rect.top;
        mouseRef.current.isActive = true;
    };

    const handleMouseLeave = () => {
        mouseRef.current.isActive = false;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    if (!isMobileRef.current) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true, alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    let isFallback = true; 

    // Timing constants
    const TIME_WARP_END = 1500; 
    const TIME_WAVE_START = 3000;

    const createParticles = () => {
      const p: Particle[] = [];
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
      if (!tempCtx) return [];

      tempCanvas.width = width;
      tempCanvas.height = height;
      const centerY = height / 2;
      const isMobile = isMobileRef.current;

      const fontSize = isMobile ? Math.min(width * 0.18, 90) : Math.min(width * 0.18, 220);
      
      tempCtx.clearRect(0, 0, width, height);
      // Heavy font weight for solid base
      tempCtx.font = `900 ${fontSize}px "Inter", sans-serif`;
      tempCtx.textAlign = 'center';
      tempCtx.textBaseline = 'middle';
      tempCtx.fillStyle = '#FFFFFF';
      tempCtx.fillText('Lucy AI', width / 2, centerY - 20);

      const imageData = tempCtx.getImageData(0, 0, width, height).data;
      
      // REDUCED SKIP = MORE DENSITY
      // Desktop: 3 (was 4), Mobile: 4 (was 5)
      const skip = isMobile ? 4 : 3; 

      let hasTextPixels = false;
      // Palette with more white
      const palette = ['#FFFFFF', '#FFFFFF', '#E9D5FF', '#D8B4FE'];

      for (let y = 0; y < height; y += skip) {
        for (let x = 0; x < width; x += skip) {
          const index = (y * width + x) * 4;
          if (imageData[index + 3] > 128) { 
             hasTextPixels = true;
             
             // 80% White for brightness/pop
             const isBright = Math.random() > 0.2; 
             const color = isBright ? '#FFFFFF' : '#D8B4FE';
             
             p.push({
               targetX: x,
               targetY: y,
               x: (Math.random() - 0.5) * width * 1.5,
               y: (Math.random() - 0.5) * height * 1.5,
               z: Math.random() * 1000 + 100,
               vx: 0,
               vy: 0,
               color: color,
               // Size optimized for density: not too big (blobby), not too small (invisible)
               size: isMobile ? (Math.random() * 2 + 1) : (Math.random() * 2.2 + 1.2), 
               type: 'text',
               randomX: (Math.random() - 0.5) * width, 
               randomY: (Math.random() - 0.5) * height,
               assemblyDelay: Math.random() * 1000 
             });
          }
        }
      }

      // Background Waves
      const wavePoints = isMobile ? 40 : 100; 
      for (let i = 0; i < wavePoints; i++) {
        for (let layer = 0; layer < 3; layer++) {
             const tx = (width / wavePoints) * i;
             const ty = centerY - 20; 
             p.push({
                targetX: tx,
                targetY: ty,
                x: (Math.random() - 0.5) * width,
                y: (Math.random() - 0.5) * height,
                z: Math.random() * width + 100,
                vx: 0,
                vy: 0,
                color: layer === 0 ? '#D8B4FE' : '#FFFFFF', 
                // Wave particles slightly larger
                size: Math.random() * 4 + 2,
                type: 'wave',
                randomX: (Math.random() - 0.5) * width,
                randomY: (Math.random() - 0.5) * height,
                assemblyDelay: 0 
             });
        }
      }

      if (hasTextPixels) {
          isFallback = false;
      }
      
      return p;
    };

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      isMobileRef.current = width < 768;
      
      const dpr = window.devicePixelRatio > 1 ? (width < 768 ? 2 : 1.5) : 1;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0); 
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      particlesRef.current = createParticles();
    };

    const handleResize = () => {
        const newWidth = window.innerWidth;
        const isMobile = newWidth < 768;
        if (isMobile && newWidth === prevWidthRef.current) return;
        prevWidthRef.current = newWidth;
        init();
    };

    init();

    let attempts = 0;
    const retryInterval = setInterval(() => {
        if (isFallback && attempts < 10) {
            attempts++;
            particlesRef.current = createParticles();
        } else {
            clearInterval(retryInterval);
        }
    }, 500);

    window.addEventListener('resize', handleResize);

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      
      ctx.clearRect(0, 0, width, height);
      
      // Fallback text
      if (isFallback) {
          const fontSize = isMobileRef.current ? Math.min(width * 0.18, 90) : Math.min(width * 0.18, 220);
          ctx.font = `900 ${fontSize}px "Inter", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = 'white';
          ctx.shadowBlur = 25;
          ctx.shadowColor = '#D8B4FE'; 
          ctx.globalAlpha = Math.min(elapsed / 1000, 1);
          ctx.fillText('Lucy AI', width / 2, height / 2 - 20);
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
      }

      const timeSec = elapsed * 0.001;
      const isMobile = isMobileRef.current;
      const cx = width / 2;
      const cy = height / 2;
      const fov = 300;
      
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const isMouseActive = mouseRef.current.isActive && !isMobile;

      // Use source-over for solid colors
      ctx.globalCompositeOperation = 'source-over';

      particlesRef.current.forEach((p, i) => {
        if (isFallback && p.type === 'text') return;

        let shouldAssemble = false;
        
        if (p.type === 'text') {
            shouldAssemble = elapsed > (TIME_WARP_END + p.assemblyDelay);
        } else if (p.type === 'wave') {
            shouldAssemble = elapsed > TIME_WAVE_START;
        }

        if (!shouldAssemble) {
            p.z -= 15; 
            if (p.z <= 10) {
                p.z = 2000; 
                p.randomX = (Math.random() - 0.5) * width * 2;
                p.randomY = (Math.random() - 0.5) * height * 2;
            }
            const scale = fov / p.z;
            p.x = cx + p.randomX * scale;
            p.y = cy + p.randomY * scale;
        } else {
            let destX = p.targetX;
            let destY = p.targetY;

            if (p.type === 'wave') {
                const layer = i % 3;
                const freq = 0.01 + layer * 0.005;
                const speed = 2 + layer;
                const amp = 30 + layer * 15;
                destY = p.targetY + Math.sin(p.targetX * freq + timeSec * speed) * amp;
            }

            if (isMouseActive) {
                const dx = mouseX - p.x;
                const dy = mouseY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const repulsionRadius = 120; 

                if (dist < repulsionRadius) {
                    const force = (repulsionRadius - dist) / repulsionRadius;
                    const angle = Math.atan2(dy, dx);
                    const pushX = Math.cos(angle) * force * 60;
                    const pushY = Math.sin(angle) * force * 60;
                    destX -= pushX;
                    destY -= pushY;
                }
            }

            p.x += (destX - p.x) * 0.1;
            p.y += (destY - p.y) * 0.1;
        }

        let alpha = 1;
        if (p.type === 'wave') {
             alpha = elapsed < TIME_WAVE_START ? 0 : Math.min((elapsed - TIME_WAVE_START) / 1000, 1);
        } else {
             alpha = shouldAssemble ? 1 : Math.min(1, 1200 / p.z); 
        }

        if (alpha > 0.1) {
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
        }
      });
      
      // Tagline
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;

      if (elapsed > TIME_WAVE_START + 500) {
          const taglineAlpha = Math.min((elapsed - (TIME_WAVE_START + 500)) / 1000, 1);
          if (taglineAlpha > 0) {
              const taglineSize = Math.min(width * 0.04, 24); 
              ctx.font = `600 ${taglineSize}px "Inter", sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              
              const tagline = "ГОЛОС ВАШЕГО БИЗНЕСА";
              const spacedTagline = tagline.split('').join('  ');
              
              const taglineOffset = isMobile ? 130 : 180;

              ctx.shadowBlur = 15;
              ctx.shadowColor = "rgba(255, 255, 255, 0.7)";
              ctx.fillStyle = `rgba(255, 255, 255, ${taglineAlpha})`;
              ctx.fillText(spacedTagline, width / 2, height / 2 + taglineOffset);
              ctx.shadowBlur = 0;
          }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(retryInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className={`${className} transition-opacity duration-500 ease-out will-change-transform`}>
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};