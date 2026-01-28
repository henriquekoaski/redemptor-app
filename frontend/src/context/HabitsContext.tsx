import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Habit } from '../data/habitsData';

export interface ActiveHabit extends Habit {
  startDate: Date;
  punishment: number;
}

interface HabitsContextType {
  activeHabits: ActiveHabit[];
  addHabit: (habit: Habit) => void;
  removeHabit: (habitId: string) => void;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export function HabitsProvider({ children }: { children: ReactNode }) {
  const [activeHabits, setActiveHabits] = useState<ActiveHabit[]>([]);

  const addHabit = (habit: Habit) => {
    // Check if habit already exists
    const exists = activeHabits.some(h => h.id === habit.id);
    if (!exists) {
      const newHabit: ActiveHabit = {
        ...habit,
        startDate: new Date(),
        punishment: 100, // Standard value
      };
      setActiveHabits(prev => [...prev, newHabit]);
    }
  };

  const removeHabit = (habitId: string) => {
    setActiveHabits(prev => prev.filter(h => h.id !== habitId));
  };

  return (
    <HabitsContext.Provider value={{ activeHabits, addHabit, removeHabit }}>
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitsContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
}

