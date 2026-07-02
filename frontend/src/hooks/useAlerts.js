import { useState } from "react";
import api from "../services/api";
import { useDashboard } from "./useDashboard";

export function useAlerts() {
  const { alerts, refetch } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateAlertStatus = async (id, status) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/alerts/${id}`, { status });
      await refetch();
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update alert status");
      setLoading(false);
      throw err;
    }
  };

  const deleteAlert = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/alerts/${id}`);
      await refetch();
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to purge alert log");
      setLoading(false);
      throw err;
    }
  };

  return {
    alerts,
    loading,
    error,
    updateAlertStatus,
    deleteAlert
  };
}
