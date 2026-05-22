import axios from "axios";


const API_URL = "https://marketgen-ai.onrender.com/api/dashboard";

export const getDashboardData = async () => {
  const response = await fetch("https://marketgen-ai.onrender.com/reports/dashboard");
  const data = await response.json();
  return data;
};