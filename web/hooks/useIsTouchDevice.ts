import { useEffect, useState } from 'react';

/**
 * Определяет, является ли устройство тачевым / мобильным.
 * Используется, чтобы отключать мышиные эффекты и упрощать анимации.
 */
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const check = () => {
      if (typeof window === 'undefined') return;
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      const smallWidth = window.matchMedia('(max-width: 768px)').matches;
      setIsTouch(coarse || smallWidth);
    };

    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isTouch;
}

