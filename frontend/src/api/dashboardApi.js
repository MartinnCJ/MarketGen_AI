import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";

export const getDashboardData = async () => {
  const response = await fetch(`${API_URL}/reports/dashboard`);
  return response.json();
};