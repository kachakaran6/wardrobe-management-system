// views/DashboardView.tsx
import React from "react";
import { useApp } from "../context";
import { formatDate } from "../utils/utils";

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
          Welcome to SyncStyle
        </h1>
        <p className="text-black">Your personal wardrobe manager</p>
      </div>

      <div className="bg-gradient-to-br-from-coral-500 to-coral-600 rounded-3xl p-8 text-white">
        <h2 className="text-2xl text-gray-600 font-bold mb-4">
          Today's Outfits
        </h2>
        {todaySchedules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
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

export default DashboardView;
