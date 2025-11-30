// storage.ts

import { Outfit, Schedule } from "./types";

export const StorageService = {
  getOutfits: (): Outfit[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("closely_outfits");
    return data ? JSON.parse(data) : [];
  },

  saveOutfits: (outfits: Outfit[]) => {
    localStorage.setItem("closely_outfits", JSON.stringify(outfits));
  },

  getSchedules: (): Schedule[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("closely_schedules");
    return data ? JSON.parse(data) : [];
  },

  saveSchedules: (schedules: Schedule[]) => {
    localStorage.setItem("closely_schedules", JSON.stringify(schedules));
  },

  getTags: (): string[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("closely_tags");
    return data ? JSON.parse(data) : [];
  },

  saveTags: (tags: string[]) => {
    localStorage.setItem("closely_tags", JSON.stringify(tags));
  },
};
