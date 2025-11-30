// components/OutfitCard.tsx
import React from "react";
import { Trash2 } from "lucide-react";
import { Outfit } from "../utils/types";

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

export default OutfitCard;
