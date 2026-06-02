<<<<<<< HEAD
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const getDashboardData = async () => {
  const response = await fetch(`${API_URL}/reports/dashboard`);

  if (!response.ok) {
    throw new Error("Error loading dashboard data");
  }

  return response.json();
=======
import api from "./axios";

export const getDashboardData = async () => {
  const response = await api.get("/reports/dashboard");
  return response.data;
};

export const dashboardApi = {
  getData: getDashboardData,
>>>>>>> 298ebad (Actualizacion de datos)
};