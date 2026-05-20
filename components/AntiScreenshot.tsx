'use client';
import { useEffect } from 'react';

export default function AntiScreenshot() {
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener('contextmenu', prevent);
    const blockKeys = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && ['p', 'i', 'j', 'u'].includes(e.key)) {
        e.preventDefault();
        return false;
      }
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
    };
    document.addEventListener('keydown', blockKeys);
    document.addEventListener('dragstart', prevent);
    document.addEventListener('copy', prevent);
    document.addEventListener('cut', prevent);
    return () => {
      document.removeEventListener('contextmenu', prevent);
      document.removeEventListener('keydown', blockKeys);
      document.removeEventListener('dragstart', prevent);
      document.removeEventListener('copy', prevent);
      document.removeEventListener('cut', prevent);
    };
  }, []);
  return null;
}
