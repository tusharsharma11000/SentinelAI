import { useDashboard } from "./useDashboard";

export function useAnalytics() {
  const { analytics, loading, error, refetch } = useDashboard();

  return {
    analytics,
    loading,
    error,
    refreshAnalytics: refetch
  };
}
