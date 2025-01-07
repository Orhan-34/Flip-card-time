import * as React from 'react';
import { createContext, useState, useContext, useEffect } from 'react';
import { TimeContextType } from '../types';

const TimeContext = createContext<TimeContextType | undefined>(undefined);

export const TimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [time, setTime] = useState<{ hour: string; minute: string; second: string }>({
    hour: '00',
    minute: '00',
    second: '00',
  });
  const [is24Hour, setIs24Hour] = useState(() => {
    const saved = localStorage.getItem('timeFormat');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();
      let hours = date.getHours();
      
      if (!is24Hour) {
        hours = hours % 12 || 12;
      }

      setTime({
        hour: hours.toString().padStart(2, '0'),
        minute: date.getMinutes().toString().padStart(2, '0'),
        second: date.getSeconds().toString().padStart(2, '0'),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [is24Hour]);

  const toggle24Hour = () => {
    setIs24Hour((prev: boolean) => {
      const newValue = !prev;
      localStorage.setItem('timeFormat', JSON.stringify(newValue));
      return newValue;
    });
  };

  return (
    <TimeContext.Provider value={{ ...time, is24Hour, toggle24Hour }}>
      {children}
    </TimeContext.Provider>
  );
};

export const useTime = () => {
  const context = useContext(TimeContext);
  if (context === undefined) {
    throw new Error('useTime must be used within a TimeProvider');
  }
  return context;
}; 