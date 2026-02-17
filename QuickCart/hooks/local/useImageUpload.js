"use client";
import { useState } from "react";
import { uploadService } from "@/services/upload.service";

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (file, onProgress) => {
    setUploading(true);
    setError(null);
    try {
      const imageUrl = await uploadService.uploadProductImage(file, { onProgress });
      setUploading(false);3
      return imageUrl;
    } catch (err) {
      setError(err?.message || "Error al subir la imagen");
      setUploading(false);
      return null;
    }
  };

  return { uploadImage, uploading, error };
}