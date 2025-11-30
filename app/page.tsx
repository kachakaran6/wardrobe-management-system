// App.tsx
"use client";

import React, { useState } from "react";
import { Plus, Grid3x3, List, Calendar } from "lucide-react";
import { AppProvider } from "../context";
import DashboardView from "../views/DashboardView";
import LibraryView from "../views/LibraryView";
import CalendarView from "../views/CalendarView";
import CreateView from "../views/CreateView";

type ViewType = "dashboard" | "library" | "calendar" | "create";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardView />;
      case "library":
        return <LibraryView />;
      case "calendar":
        return <CalendarView />;
      case "create":
        return <CreateView onBack={() => setCurrentView("library")} />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-[#FAF7F2]">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* <div className="w-10 h-10 bg-gradient-to-br from-coral-500 to-coral-600 rounded-xl flex items-center justify-center"> */}
              {/* <span className="text-purple-700 bg-amber-300 border- font-bold text-xl">
                  SS
                </span> */}
              {/* </div> */}
              <h1 className="text-2xl font-bold text-black">SyncStyle</h1>
            </div>

            <button
              onClick={() => setCurrentView("create")}
              className="flex items-center gap-2 px-6 py-3 bg-coral-500 text-gray-700 rounded-xl hover:bg-coral-600 transition-colors font-semibold shadow-sm"
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
              <div className="flex gap-2 text-pink-800">
                {[
                  { id: "dashboard", label: "Dashboard", icon: List },
                  { id: "library", label: "Library", icon: Grid3x3 },
                  { id: "calendar", label: "Calendar", icon: Calendar },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as ViewType)}
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
        <main className="max-w-7xl mx-auto px-4 py-8">{renderView()}</main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 mt-16">
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
