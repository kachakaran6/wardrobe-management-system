// views/LibraryView.tsx
import React, { useState } from "react";
import { Search, Grid3x3 } from "lucide-react";
import { useApp } from "../context";
import OutfitCard from "../components/OutfitCard";
import Modal from "../components/ui/Modal";
import { Outfit } from "../utils/types";

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

export default LibraryView;
