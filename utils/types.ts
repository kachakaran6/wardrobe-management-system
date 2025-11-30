// types.ts

export interface Outfit {
  id: string;
  title: string;
  imageBase64: string;
  tags: string[];
  notes: string;
  createdAt: string;
}

export interface Schedule {
  id: string;
  outfitId: string;
  date: string;
  timeSlot: "morning" | "afternoon" | "evening" | null;
}

export interface AppState {
  outfits: Outfit[];
  schedules: Schedule[];
  tags: string[];
}
