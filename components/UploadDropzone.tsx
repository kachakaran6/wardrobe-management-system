// components/UploadDropzone.tsx
import React, { useState } from "react";
import { Upload } from "lucide-react";

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

export default UploadDropzone;
