/* eslint-disable react-hooks/set-state-in-effect */
// context.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AppState, Outfit, Schedule } from "./utils/types";
import { StorageService } from "./utils/storage";

// ==================== CONTEXT INTERFACE ====================
interface AppContextType {
  state: AppState;
  addOutfit: (outfit: Omit<Outfit, "id" | "createdAt">) => void;
  deleteOutfit: (id: string) => void;
  addSchedule: (schedule: Omit<Schedule, "id">) => void;
  deleteSchedule: (id: string) => void;
  addTag: (tag: string) => void;
  getScheduleByDate: (date: string) => Schedule[];
  getOutfitById: (id: string) => Outfit | undefined;
}

const AppContext = createContext<AppContextType | null>(null);

// ==================== PROVIDER ====================
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AppState>({
    outfits: [],
    schedules: [],
    tags: [],
  });

  useEffect(() => {
    // Load initial state from storage
    setState({
      outfits: StorageService.getOutfits(),
      schedules: StorageService.getSchedules(),
      tags: StorageService.getTags(),
    });
  }, []);

  const addOutfit = (outfit: Omit<Outfit, "id" | "createdAt">) => {
    const newOutfit: Outfit = {
      ...outfit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...state.outfits, newOutfit];
    StorageService.saveOutfits(updated);
    setState((prev) => ({ ...prev, outfits: updated }));
  };

  const deleteOutfit = (id: string) => {
    const updated = state.outfits.filter((o) => o.id !== id);
    StorageService.saveOutfits(updated);
    setState((prev) => ({ ...prev, outfits: updated }));

    // Also remove schedules associated with the deleted outfit
    const schedules = state.schedules.filter((s) => s.outfitId !== id);
    StorageService.saveSchedules(schedules);
    setState((prev) => ({ ...prev, schedules }));
  };

  const addSchedule = (schedule: Omit<Schedule, "id">) => {
    const newSchedule: Schedule = {
      ...schedule,
      id: Date.now().toString(),
    };
    const updated = [...state.schedules, newSchedule];
    StorageService.saveSchedules(updated);
    setState((prev) => ({ ...prev, schedules: updated }));
  };

  const deleteSchedule = (id: string) => {
    const updated = state.schedules.filter((s) => s.id !== id);
    StorageService.saveSchedules(updated);
    setState((prev) => ({ ...prev, schedules: updated }));
  };

  const addTag = (tag: string) => {
    if (!state.tags.includes(tag)) {
      const updated = [...state.tags, tag];
      StorageService.saveTags(updated);
      setState((prev) => ({ ...prev, tags: updated }));
    }
  };

  const getScheduleByDate = (date: string) => {
    return state.schedules.filter((s) => s.date === date);
  };

  const getOutfitById = (id: string) => {
    return state.outfits.find((o) => o.id === id);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        addOutfit,
        deleteOutfit,
        addSchedule,
        deleteSchedule,
        addTag,
        getScheduleByDate,
        getOutfitById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// ==================== HOOK ====================
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
