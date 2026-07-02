import { useState } from "react";
import api from "../services/api";
import { useDashboard } from "./useDashboard";

export function useCamera() {
  const { cameras, refetch } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addCamera = async (cameraData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/camera/add", cameraData);
      await refetch();
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add camera feed");
      setLoading(false);
      throw err;
    }
  };

  const deleteCamera = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/camera/${id}`);
      await refetch();
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete camera feed");
      setLoading(false);
      throw err;
    }
  };

  return {
    cameras,
    loading,
    error,
    addCamera,
    deleteCamera
  };
}
