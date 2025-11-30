// views/CreateView.tsx
import React, { useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import { useApp } from "../context";
import UploadDropzone from "../components/UploadDropzone";

const CreateView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addOutfit, addTag } = useApp();
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
            className="w-full py-4 bg-[#FF7F50] text-black  rounded-xl font-semibold hover:bg-coral-600 transition-colors disabled:cursor-not-allowed"
          >
            Create Outfit
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateView;
