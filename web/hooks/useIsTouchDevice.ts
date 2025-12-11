import { useEffect, useState } from 'react';

/**
 * Определяет, является ли устройство тачевым / мобильным.
 * Используется, чтобы отключать мышиные эффекты и упрощать анимации.
 */
export function useIsTouchDevice() {
  const getIsTouch = () => {
    if (typeof window === 'undefined') return false;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const smallWidth = window.matchMedia('(max-width: 1024px)').matches; // планшеты тоже считаем тачевыми
    const hasTouchSupport = 'ontouchstart' in window;
    const maxTouch = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0;
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
    const uaTouch = /iphone|ipad|android|mobile|touch/.test(ua);
    return coarse || smallWidth || hasTouchSupport || maxTouch || uaTouch;
  };

  const [isTouch, setIsTouch] = useState<boolean>(getIsTouch);

  useEffect(() => {
    const check = () => setIsTouch(getIsTouch());
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isTouch;
}

