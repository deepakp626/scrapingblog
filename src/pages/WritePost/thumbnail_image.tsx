import React, { useRef, useState, useEffect } from "react";
import { Upload, X } from "lucide-react";

interface ThumbnailImageProps {
  value: File | null;
  onChange: (file: File | null) => void;
  existingUrl?: string;
  onRemoveExisting?: () => void;
}

export const ThumbnailImage: React.FC<ThumbnailImageProps> = ({
  value,
  onChange,
  existingUrl,
  onRemoveExisting,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (value) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (existingUrl) {
      setPreview(existingUrl);
    } else {
      setPreview(null);
    }
  }, [value, existingUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        onChange(file);
      }
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    onRemoveExisting?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Thumbnail Image
      </label>
      <div
        onClick={triggerFileInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 overflow-hidden group bg-white
          ${isDragOver 
            ? "border-orange-500 bg-orange-500/5 shadow-[0_0_15px_rgba(249,115,22,0.15)]" 
            : "border-slate-200 hover:border-orange-500/50 hover:bg-slate-50"
          }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {preview ? (
          <div className="relative w-full h-full">
            <img
              src={preview}
              alt="Thumbnail preview"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleRemove}
                className="p-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full hover:scale-110 transition-all duration-200 shadow-xl cursor-pointer"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="p-3 bg-slate-100 rounded-xl mb-2 group-hover:scale-110 transition-transform duration-300 border border-slate-250 group-hover:border-orange-500/30 group-hover:bg-orange-500/5">
              <Upload className="w-5 h-5 text-slate-500 group-hover:text-orange-500 transition-colors" />
            </div>
            <p className="text-xs font-semibold text-slate-800 mb-1">
              Click or drag image here
            </p>
            <p className="text-[10px] text-slate-500">
              Supports PNG, JPG, WEBP up to 5MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default ThumbnailImage;
