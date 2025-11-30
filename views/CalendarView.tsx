// views/CalendarView.tsx
import React, { useState } from "react";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "../context";
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  formatDate,
  monthNames,
} from "../utils/utils";
import Modal from "../components/ui/Modal";
import { Schedule } from "../utils/types";

// ==================== CalendarGrid COMPONENT ====================
const CalendarGrid: React.FC<{
  year: number;
  month: number;
  onDateClick: (date: string) => void;
  getScheduleByDate: (date: string) => Schedule[];
  getOutfitById: (id: string) => any; // Using any for brevity here, should be Outfit | undefined
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
          hasSchedule ? "bg-[#FDECEE]" : ""
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

// ==================== CalendarView COMPONENT ====================
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
                      ? "border-coral-500 bg-[#FDECEE] text-black"
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
            className="w-full py-3 bg-[#FF7F50] text-black rounded-xl font-semibold hover:bg-[#E67348] transition-colors  disabled:cursor-not-allowed"
          >
            Schedule
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CalendarView;
