import React, { createContext, useContext, ReactNode } from 'react';
import { useTime, TimeState } from '../hooks/useTime';

interface TimeContextType {
  time: TimeState;
}

const TimeContext = createContext<TimeContextType | undefined>(undefined);

export function TimeProvider({ children }: { children: ReactNode }) {
  const time = useTime();

  return (
    <TimeContext.Provider value={{ time }}>
      {children}
    </TimeContext.Provider>
  );
}

export function useTimeContext() {
  const context = useContext(TimeContext);
  if (context === undefined) {
    throw new Error('useTimeContext must be used within a TimeProvider');
  }
  return context;
} 