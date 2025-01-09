import { useState, useEffect } from 'react';

export interface TimeState {
  hours: number;
  minutes: number;
  seconds: number;
}

export function useTime(interval: number = 1000): TimeState {
  const [time, setTime] = useState<TimeState>(() => {
    const now = new Date();
    return {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime({
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      });
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return time;
} 