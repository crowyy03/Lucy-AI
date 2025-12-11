import { useEffect, useState } from 'react';

/**
 * Определяет, является ли устройство тачевым / мобильным.
 * Используется, чтобы отключать мышиные эффекты и упрощать анимации.
 */
export function useIsTouchDevice() {
  const getIsTouch = () => {
    if (typeof window === 'undefined') return false;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const smallWidth = window.matchMedia('(max-width: 768px)').matches;
    const hasTouchSupport = 'ontouchstart' in window;
    return coarse || smallWidth || hasTouchSupport;
  };

  const [isTouch, setIsTouch] = useState<boolean>(getIsTouch);

  useEffect(() => {
    const check = () => setIsTouch(getIsTouch());
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isTouch;
}

