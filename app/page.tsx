"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Grid3x3,
  List,
  Search,
  X,
  Upload,
  Tag,
  Clock,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";

// ==================== TYPES ====================
interface Outfit {
  id: string;
  title: string;
  imageBase64: string;
  tags: string[];
  notes: string;
  createdAt: string;
}

interface Schedule {
  id: string;
  outfitId: string;
  date: string;
  timeSlot: "morning" | "afternoon" | "evening" | null;
}

interface AppState {
  outfits: Outfit[];
  schedules: Schedule[];
  tags: string[];
}

// ==================== STORAGE SERVICE ====================
const StorageService = {
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

// ==================== CONTEXT ====================
const AppContext = createContext<{
  state: AppState;
  addOutfit: (outfit: Omit<Outfit, "id" | "createdAt">) => void;
  deleteOutfit: (id: string) => void;
  addSchedule: (schedule: Omit<Schedule, "id">) => void;
  deleteSchedule: (id: string) => void;
  addTag: (tag: string) => void;
  getScheduleByDate: (date: string) => Schedule[];
  getOutfitById: (id: string) => Outfit | undefined;
} | null>(null);

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    outfits: [],
    schedules: [],
    tags: [],
  });

  useEffect(() => {
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

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

// ==================== DATE UTILITIES ====================
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ==================== COMPONENTS ====================
const OutfitCard: React.FC<{
  outfit: Outfit;
  onClick?: () => void;
  onDelete?: () => void;
}> = ({ outfit, onClick, onDelete }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group relative"
  >
    <div className="aspect-square relative overflow-hidden bg-gray-100">
      <img
        src={outfit.imageBase64}
        alt={outfit.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
      />
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-black mb-2">{outfit.title}</h3>
      <div className="flex flex-wrap gap-2">
        {outfit.tags.slice(0, 3).map((tag, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-coral-50 text-black rounded-full text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
    {onDelete && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-3 right-3 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </button>
    )}
  </div>
);

const UploadDropzone: React.FC<{
  onUpload: (base64: string) => void;
}> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onUpload(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files[0]) {
          handleFile(e.dataTransfer.files[0]);
        }
      }}
      className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
        isDragging
          ? "border-coral-500 bg-coral-50"
          : "border-gray-300 bg-gray-50"
      }`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-black font-medium mb-2">
          Drop an image here or click to upload
        </p>
        <p className="text-gray-500 text-sm">PNG, JPG up to 5MB</p>
      </label>
    </div>
  );
};

const CalendarGrid: React.FC<{
  year: number;
  month: number;
  onDateClick: (date: string) => void;
  getScheduleByDate: (date: string) => Schedule[];
  getOutfitById: (id: string) => Outfit | undefined;
}> = ({ year, month, onDateClick, getScheduleByDate, getOutfitById }) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = formatDate(new Date(year, month, day));
    const schedules = getScheduleByDate(date);
    const hasSchedule = schedules.length > 0;

    days.push(
      <div
        key={day}
        onClick={() => onDateClick(date)}
        className={`aspect-square p-2 rounded-xl cursor-pointer transition-all hover:bg-gray-100 ${
          hasSchedule ? "bg-coral-50" : ""
        }`}
      >
        <div className="text-sm font-medium text-black mb-1">{day}</div>
        {hasSchedule && (
          <div className="grid grid-cols-2 gap-1">
            {schedules.slice(0, 2).map((schedule) => {
              const outfit = getOutfitById(schedule.outfitId);
              return outfit ? (
                <div
                  key={schedule.id}
                  className="aspect-square rounded overflow-hidden"
                >
                  <img
                    src={outfit.imageBase64}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null;
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-7 gap-2">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div
          key={day}
          className="text-center text-sm font-semibold text-black py-2"
        >
          {day}
        </div>
      ))}
      {days}
    </div>
  );
};

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-black">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// ==================== VIEWS ====================
const CreateView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addOutfit, addTag, state } = useApp();
  const [image, setImage] = useState<string>("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const handleCreate = () => {
    if (!image || !title) return;

    selectedTags.forEach((tag) => addTag(tag));
    addOutfit({ title, imageBase64: image, tags: selectedTags, notes });
    onBack();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-black mb-6 hover:text-black"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <h1 className="text-3xl font-bold text-black mb-8">Create New Outfit</h1>

      {!image ? (
        <UploadDropzone onUpload={setImage} />
      ) : (
        <div className="mb-6">
          <div className="relative rounded-2xl overflow-hidden bg-gray-100 mb-4">
            <img
              src={image}
              alt="Preview"
              className="w-full h-96 object-cover"
            />
            <button
              onClick={() => setImage("")}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-black" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Outfit title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 mb-4 focus:outline-none focus:ring-2 focus:ring-coral-500 text-black"
          />

          <textarea
            placeholder="Add notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 mb-4 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-coral-500 text-black"
          />

          <div className="mb-4">
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Add tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && newTag) {
                    setSelectedTags([...selectedTags, newTag]);
                    setNewTag("");
                  }
                }}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-coral-500 text-black"
              />
              <button
                onClick={() => {
                  if (newTag) {
                    setSelectedTags([...selectedTags, newTag]);
                    setNewTag("");
                  }
                }}
                className="px-6 py-2 bg-coral-500 text-white rounded-xl hover:bg-coral-600 transition-colors"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-coral-100 text-black rounded-full text-sm font-medium flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() =>
                      setSelectedTags(
                        selectedTags.filter((_, idx) => idx !== i)
                      )
                    }
                  >
                    <X className="w-3 h-3 text-black" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={!title}
            className="w-full py-4 bg-coral-500 text-white rounded-xl font-semibold hover:bg-coral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Outfit
          </button>
        </div>
      )}
    </div>
  );
};

const LibraryView: React.FC = () => {
  const { state, deleteOutfit } = useApp();
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOutfits = state.outfits.filter(
    (outfit) =>
      outfit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outfit.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search outfits or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-coral-500 text-black"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredOutfits.map((outfit) => (
          <OutfitCard
            key={outfit.id}
            outfit={outfit}
            onClick={() => setSelectedOutfit(outfit)}
            onDelete={() => {
              if (confirm("Delete this outfit?")) {
                deleteOutfit(outfit.id);
              }
            }}
          />
        ))}
      </div>

      {filteredOutfits.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Grid3x3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No outfits found</p>
        </div>
      )}

      <Modal
        isOpen={!!selectedOutfit}
        onClose={() => setSelectedOutfit(null)}
        title={selectedOutfit?.title}
      >
        {selectedOutfit && (
          <div>
            <img
              src={selectedOutfit.imageBase64}
              alt={selectedOutfit.title}
              className="w-full rounded-xl mb-4"
            />
            {selectedOutfit.notes && (
              <p className="text-black mb-4">{selectedOutfit.notes}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {selectedOutfit.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-coral-50 text-black rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const CalendarView: React.FC = () => {
  const {
    getScheduleByDate,
    getOutfitById,
    state,
    addSchedule,
    deleteSchedule,
  } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedOutfitId, setSelectedOutfitId] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<
    "morning" | "afternoon" | "evening" | null
  >(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const handleSchedule = () => {
    if (selectedDate && selectedOutfitId) {
      addSchedule({
        outfitId: selectedOutfitId,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
      });
      setShowScheduleModal(false);
      setSelectedOutfitId("");
      setSelectedTimeSlot(null);
    }
  };

  const schedules = selectedDate ? getScheduleByDate(selectedDate) : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-black">
          {monthNames[month]} {year}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-black" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>

      <CalendarGrid
        year={year}
        month={month}
        onDateClick={setSelectedDate}
        getScheduleByDate={getScheduleByDate}
        getOutfitById={getOutfitById}
      />

      <Modal
        isOpen={!!selectedDate}
        onClose={() => setSelectedDate(null)}
        title={
          selectedDate
            ? new Date(selectedDate + "T00:00").toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : ""
        }
      >
        <div className="space-y-4">
          {schedules.map((schedule) => {
            const outfit = getOutfitById(schedule.outfitId);
            return outfit ? (
              <div
                key={schedule.id}
                className="flex gap-4 p-4 bg-gray-50 rounded-xl"
              >
                <img
                  src={outfit.imageBase64}
                  alt={outfit.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-black mb-1">
                    {outfit.title}
                  </h3>
                  {schedule.timeSlot && (
                    <div className="flex items-center gap-2 text-sm text-black mb-2">
                      <Clock className="w-4 h-4" />
                      {schedule.timeSlot}
                    </div>
                  )}
                  <button
                    onClick={() => deleteSchedule(schedule.id)}
                    className="text-red-500 text-sm hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : null;
          })}

          <button
            onClick={() => setShowScheduleModal(true)}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-black hover:border-coral-500 hover:text-coral-500 transition-colors"
          >
            + Schedule Outfit
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Schedule an Outfit"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Select Outfit
            </label>
            <select
              value={selectedOutfitId}
              onChange={(e) => setSelectedOutfitId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-coral-500 text-black"
            >
              <option value="">Choose an outfit</option>
              {state.outfits.map((outfit) => (
                <option key={outfit.id} value={outfit.id}>
                  {outfit.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Time Slot (Optional)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["morning", "afternoon", "evening"].map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTimeSlot(slot as any)}
                  className={`py-3 rounded-xl border transition-colors ${
                    selectedTimeSlot === slot
                      ? "border-coral-500 bg-coral-50 text-black"
                      : "border-gray-200 hover:border-gray-300 text-black"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSchedule}
            disabled={!selectedOutfitId}
            className="w-full py-3 bg-coral-500 text-white rounded-xl font-semibold hover:bg-coral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Schedule
          </button>
        </div>
      </Modal>
    </div>
  );
};

const DashboardView: React.FC = () => {
  const { state, getScheduleByDate, getOutfitById } = useApp();
  const today = formatDate(new Date());
  const todaySchedules = getScheduleByDate(today);

  const upcomingDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      date: formatDate(date),
      label:
        i === 0
          ? "Today"
          : i === 1
          ? "Tomorrow"
          : date.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            }),
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">
          Welcome to Closely
        </h1>
        <p className="text-black">Your personal wardrobe manager</p>
      </div>

      <div className="bg-gradient-to-br from-coral-500 to-coral-600 rounded-3xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Today's Outfits</h2>
        {todaySchedules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todaySchedules.map((schedule) => {
              const outfit = getOutfitById(schedule.outfitId);
              return outfit ? (
                <div
                  key={schedule.id}
                  className="bg-white/10 backdrop-blur rounded-2xl p-4 flex gap-4"
                >
                  <img
                    src={outfit.imageBase64}
                    alt={outfit.title}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                  <div>
                    <h3 className="font-semibold mb-1">{outfit.title}</h3>
                    {schedule.timeSlot && (
                      <p className="text-sm opacity-90">{schedule.timeSlot}</p>
                    )}
                  </div>
                </div>
              ) : null;
            })}
          </div>
        ) : (
          <p className="opacity-90">No outfits scheduled for today</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold text-black mb-4">Upcoming Week</h2>
        <div className="space-y-3">
          {upcomingDays.map((day) => {
            const schedules = getScheduleByDate(day.date);
            return (
              <div
                key={day.date}
                className="bg-white rounded-2xl p-4 border border-gray-100"
              >
                <div className="font-semibold text-black mb-2">{day.label}</div>
                {schedules.length > 0 ? (
                  <div className="flex gap-2">
                    {schedules.slice(0, 3).map((schedule) => {
                      const outfit = getOutfitById(schedule.outfitId);
                      return outfit ? (
                        <img
                          key={schedule.id}
                          src={outfit.imageBase64}
                          alt={outfit.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : null;
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No outfits scheduled</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-black mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="text-3xl text-black font-bold text-coral-500 mb-1">
              {state.outfits.length}
            </div>
            <div className="text-black text-sm">Outfits</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="text-3xl text-black font-bold text-coral-500 mb-1">
              {state.schedules.length}
            </div>
            <div className="text-black text-sm">Scheduled</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="text-3xl text-black font-bold text-coral-500 mb-1">
              {state.tags.length}
            </div>
            <div className="text-black text-sm">Tags</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="text-3xl text-black font-bold text-coral-500 mb-1">
              {todaySchedules.length}
            </div>
            <div className="text-black text-sm">Today</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN APP ====================
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "library" | "calendar" | "create"
  >("dashboard");

  return (
    <AppProvider>
      <div className="min-h-screen bg-[#FAF7F2]">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-coral-500 to-coral-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <h1 className="text-2xl font-bold text-black">Closely</h1>
            </div>

            <button
              onClick={() => setCurrentView("create")}
              className="flex items-center gap-2 px-6 py-3 bg-coral-500 text-white rounded-xl hover:bg-coral-600 transition-colors font-semibold shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Outfit</span>
            </button>
          </div>
        </header>

        {/* Navigation */}
        {currentView !== "create" && (
          <nav className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex gap-2">
                {[
                  { id: "dashboard", label: "Dashboard", icon: List },
                  { id: "library", label: "Library", icon: Grid3x3 },
                  { id: "calendar", label: "Calendar", icon: Calendar },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as any)}
                    className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                      currentView === item.id
                        ? "border-coral-500 text-coral-600"
                        : "border-transparent text-black hover:text-black"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="hidden sm:inline font-medium">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </nav>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {currentView === "dashboard" && <DashboardView />}
          {currentView === "library" && <LibraryView />}
          {currentView === "calendar" && <CalendarView />}
          {currentView === "create" && (
            <CreateView onBack={() => setCurrentView("library")} />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-black border-t border-gray-100 mt-16">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-black text-sm">
            <p>Closely - Your Personal Wardrobe Manager</p>
            <p className="mt-1">All data stored locally in your browser</p>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
};

export default App;
