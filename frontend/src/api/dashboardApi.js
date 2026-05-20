const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const getDashboardData = async () => {
  const response = await fetch(`${API_URL}/reports/dashboard`);

  if (!response.ok) {
    throw new Error("Error loading dashboard data");
  }

  return response.json();
};